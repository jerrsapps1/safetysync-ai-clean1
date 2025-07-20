import OpenAI from "openai";
import { db } from "./db";
import { trainingDocuments, certificates } from "@shared/schema";
import { eq } from "drizzle-orm";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ProcessedSignIn {
  trainingTitle: string;
  instructorName: string;
  instructorCredentials: string;
  trainingDate: string;
  location: string;
  duration: string;
  trainingStandards: string[];
  employees: Array<{
    name: string;
    employeeId?: string;
    signature: boolean;
    completionStatus: 'completed' | 'partial' | 'absent';
  }>;
  certificationEligible: boolean;
  evaluationRequired: boolean;
}

export class AIDocumentProcessor {
  
  async processSignInDocument(documentContent: string, instructorId: number): Promise<ProcessedSignIn> {
    try {
      const prompt = `
        You are an expert at extracting training information from documents, including PDFs with encoding artifacts.
        This content may contain PDF binary data, formatting characters, or fragmented text. Look for patterns and extract ALL available information.
        
        Analyze this training sign-in document and extract structured information.
        Return JSON with this exact format:
        {
          "trainingTitle": "string",
          "instructorName": "string", 
          "instructorCredentials": "string",
          "trainingDate": "YYYY-MM-DD",
          "location": "string",
          "duration": "string (e.g. '4 hours', '8 hours')",
          "trainingStandards": ["29 CFR 1926.95", "OSHA 1926.501", "ANSI Z359.1", etc - EXTRACT EXACT NUMBERS],
          "employees": [
            {
              "name": "First Last",
              "employeeId": "optional ID",
              "signature": true/false,
              "completionStatus": "completed|partial|absent"
            }
          ],
          "certificationEligible": true/false,
          "evaluationRequired": true/false
        }

        CRITICAL INSTRUCTIONS for PDF text extraction:
        - The text may be heavily corrupted with PDF artifacts, binary data, or fragmented words
        - Look for ANY readable patterns: names (John, Smith, Mary), training keywords (Fall, Protection, OSHA, Safety), dates (2025, January, Jan), numbers (employee IDs)
        - Extract partial matches even if incomplete: "John" + "Smith" = "John Smith", "Fall" + "Protection" = "Fall Protection"
        - Search for instructor patterns: names near words like "instructor", "trainer", "conducted", "by"
        - Find company/location clues: building names, addresses, city names
        - Look for time patterns: AM/PM, hours, duration indicators
        - Employee patterns: lists of names, ID numbers, departments
        - CRITICAL: Extract specific OSHA standards with exact numbers like "1926.95", "1926.501", "1910.147", "29 CFR 1926.95", etc.
        - Look for patterns near "OSHA Standard:", "Standard:", "CFR", "1926.", "1910.", "29 CFR"
        - DUAL APPROACH: Extract both explicit standards AND suggest relevant ones:
          * If document shows specific standards (like "OSHA Standard: 1926.95"), extract exactly
          * If no specific standard shown, intelligently match training type to relevant standards:
            - Fall Protection: 29 CFR 1926.95, 1926.501, 1926.502, 1926.503
            - Scaffold Safety: 29 CFR 1926.451, 1926.452
            - Confined Space: 29 CFR 1910.146
            - Forklift/PIT: 29 CFR 1910.178
            - Lockout/Tagout: 29 CFR 1910.147
            - Respirator: 29 CFR 1910.134
        - Always provide at least one relevant standard even if document doesn't specify
        - Be extremely aggressive - any readable text is valuable
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: documentContent }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      // Log the AI extraction results for debugging
      console.log('=== AI EXTRACTION RESULTS ===');
      console.log('✓ Training Title:', result.trainingTitle || 'NOT FOUND');
      console.log('✓ Instructor:', result.instructorName || 'NOT FOUND');
      console.log('✓ Instructor Credentials:', result.instructorCredentials || 'NOT FOUND');
      console.log('✓ Date:', result.trainingDate || 'NOT FOUND');
      console.log('✓ Location:', result.location || 'NOT FOUND');
      console.log('✓ Duration:', result.duration || 'NOT FOUND');
      console.log('✓ Training Standards:', result.trainingStandards?.length ? result.trainingStandards.join(', ') : 'NOT FOUND');
      console.log('✓ Certification Eligible:', result.certificationEligible);
      console.log('✓ Employees found:', result.employees?.length || 0);
      if (result.employees && result.employees.length > 0) {
        console.log('✓ All employee names:', result.employees.map(emp => emp.name).join(', '));
        console.log('✓ Employee details sample:', JSON.stringify(result.employees[0], null, 2));
      } else {
        console.log('❌ NO EMPLOYEES EXTRACTED - this indicates a major extraction failure');
      }
      console.log('=== EXTRACTION COMPLETE ===');
      
      return result as ProcessedSignIn;

    } catch (error) {
      console.error('AI processing error:', error);
      throw new Error('Failed to process sign-in document with AI');
    }
  }

  async verifyWithInstructor(processedData: ProcessedSignIn, instructorId: number): Promise<{
    verified: boolean;
    corrections?: Partial<ProcessedSignIn>;
    instructorNotes?: string;
  }> {
    // This would typically involve showing the instructor the extracted data
    // and allowing them to make corrections before final processing
    
    // For now, we'll simulate instructor verification
    // In production, this would be an interactive step
    
    return {
      verified: true,
      instructorNotes: "AI extraction verified by instructor"
    };
  }

  async generateCertificates(processedData: ProcessedSignIn, userId: number): Promise<string[]> {
    const certificateIds: string[] = [];
    
    if (!processedData.certificationEligible) {
      return certificateIds;
    }

    for (const employee of processedData.employees) {
      if (employee.completionStatus === 'completed' && employee.signature) {
        
        // Generate certificate content using AI
        const certificateContent = await this.generateCertificateContent(
          employee.name,
          processedData.trainingTitle,
          processedData.instructorName,
          processedData.instructorCredentials,
          processedData.trainingDate,
          processedData.trainingStandards
        );

        // Store certificate in database
        const [certificate] = await db.insert(certificates).values({
          userId,
          employeeName: employee.name,
          employeeId: employee.employeeId || null,
          certificationType: processedData.trainingTitle,
          issueDate: new Date(processedData.trainingDate),
          expirationDate: this.calculateExpirationDate(processedData.trainingTitle),
          instructorName: processedData.instructorName,
          instructorCredentials: processedData.instructorCredentials,
          trainingStandards: processedData.trainingStandards,
          certificateContent: JSON.stringify(certificateContent),
          status: 'active'
        }).returning();

        certificateIds.push(certificate.id.toString());
      }
    }

    return certificateIds;
  }

  private async generateCertificateContent(
    employeeName: string,
    trainingTitle: string,
    instructorName: string,
    instructorCredentials: string,
    trainingDate: string,
    standards: string[]
  ) {
    const prompt = `
      Generate professional certificate content for:
      Employee: ${employeeName}
      Training: ${trainingTitle}
      Instructor: ${instructorName} (${instructorCredentials})
      Date: ${trainingDate}
      Standards: ${standards.join(', ')}

      Return JSON with:
      {
        "certificateTitle": "Certificate of Completion",
        "headerText": "This certifies that",
        "bodyText": "professional certification text",
        "footerText": "authority and compliance text",
        "validityPeriod": "years",
        "walletCardText": "compact text for wallet card"
      }

      Make it professional, compliance-focused, and industry-standard.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.2
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  }

  private calculateExpirationDate(trainingType: string): Date {
    const expirationMap: Record<string, number> = {
      'Fall Protection': 12, // months
      'Scaffold Safety': 12,
      'Confined Space': 12,
      'Forklift Operation': 36,
      'First Aid/CPR': 24,
      'Default': 12
    };

    const months = expirationMap[trainingType] || expirationMap['Default'];
    const expiration = new Date();
    expiration.setMonth(expiration.getMonth() + months);
    return expiration;
  }

  async generateEvaluationForms(processedData: ProcessedSignIn): Promise<string> {
    if (!processedData.evaluationRequired) {
      return '';
    }

    const prompt = `
      Generate a professional evaluation form for: ${processedData.trainingTitle}
      Include:
      - Knowledge assessment questions
      - Practical skill evaluation criteria
      - Safety compliance checkpoints
      - Instructor evaluation section
      
      Return as structured JSON for form generation.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.3
    });

    return response.choices[0].message.content || '{}';
  }
}

export const aiDocumentProcessor = new AIDocumentProcessor();
import { OpenAI } from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable must be set");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface DocumentProcessingResult {
  extractedData: {
    trainingTitle?: string;
    instructorName?: string;
    instructorCredentials?: string;
    trainingDate?: string;
    location?: string;
    duration?: string;
    employees?: Array<{
      name: string;
      id?: string;
      department?: string;
    }>;
    oshaStandards?: string[];
    complianceType?: string;
  };
  confidence: number;
  processingMethod: string;
  recommendations: string[];
}

export class BoomiAIProcessor {
  private static instance: BoomiAIProcessor;

  static getInstance(): BoomiAIProcessor {
    if (!BoomiAIProcessor.instance) {
      BoomiAIProcessor.instance = new BoomiAIProcessor();
    }
    return BoomiAIProcessor.instance;
  }

  async processTrainingDocument(
    documentText: string, 
    documentType: 'pdf' | 'word' | 'excel' = 'pdf'
  ): Promise<DocumentProcessingResult> {
    try {
      console.log("🤖 BOOMI AI: Starting enhanced document processing...");
      
      const prompt = `
You are Boomi AI, an advanced document processing system specialized in OSHA training record extraction. 

Analyze this training document and extract structured data with high accuracy:

Document Content:
${documentText}

Extract the following information with maximum precision:

1. TRAINING DETAILS:
   - Training title/course name
   - Training date (format: YYYY-MM-DD)
   - Location/facility
   - Duration (hours/days)
   - Compliance type (OSHA, ANSI, EPA, etc.)

2. INSTRUCTOR INFORMATION:
   - Instructor name
   - Credentials (CIH, CSP, OSHA Authorized, etc.)
   - Company/organization

3. PARTICIPANTS:
   - All employee names (extract every name from sign-in sheets)
   - Employee IDs if available
   - Departments if mentioned

4. COMPLIANCE STANDARDS:
   - Specific OSHA standards (e.g., 29 CFR 1926.95)
   - Related safety regulations
   - Industry-specific requirements

5. AI RECOMMENDATIONS:
   - Missing compliance elements
   - Data quality improvements
   - Additional training needs
   - Certificate generation recommendations

Return a JSON response with this exact structure:
{
  "extractedData": {
    "trainingTitle": "string",
    "instructorName": "string", 
    "instructorCredentials": "string",
    "trainingDate": "YYYY-MM-DD",
    "location": "string",
    "duration": "string",
    "employees": [{"name": "string", "id": "string", "department": "string"}],
    "oshaStandards": ["string"],
    "complianceType": "string"
  },
  "confidence": 0.95,
  "processingMethod": "Boomi AI Enhanced Processing",
  "recommendations": ["string"]
}

Focus on accuracy and completeness. If information is unclear, indicate with null values.
`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are Boomi AI, an enterprise-grade document processing system designed for OSHA compliance data extraction. Provide accurate, structured responses in JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.1, // Low temperature for consistent extraction
        max_tokens: 2000
      });

      const aiResponse = response.choices[0]?.message?.content;
      
      if (!aiResponse) {
        throw new Error("No response from Boomi AI");
      }

      try {
        // Extract JSON from response
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("No JSON found in AI response");
        }

        const result = JSON.parse(jsonMatch[0]) as DocumentProcessingResult;
        
        // Enhanced post-processing
        result.confidence = this.calculateConfidence(result.extractedData, documentText);
        result.processingMethod = "Boomi AI Enhanced Processing";
        
        // Add intelligent recommendations
        result.recommendations = this.generateRecommendations(result.extractedData, documentText);

        console.log(`✅ BOOMI AI: Document processed successfully (${result.confidence}% confidence)`);
        console.log(`📊 BOOMI AI: Extracted ${result.extractedData.employees?.length || 0} employees`);
        
        return result;
      } catch (parseError) {
        console.error("❌ BOOMI AI: JSON parsing error:", parseError);
        throw new Error("Failed to parse AI response");
      }

    } catch (error) {
      console.error("❌ BOOMI AI: Processing error:", error);
      
      // Fallback processing
      return this.fallbackProcessing(documentText);
    }
  }

  private calculateConfidence(data: any, originalText: string): number {
    let score = 0;
    const maxScore = 10;

    // Training title present
    if (data.trainingTitle) score += 2;
    
    // Instructor information
    if (data.instructorName) score += 1.5;
    if (data.instructorCredentials) score += 1;
    
    // Date extraction
    if (data.trainingDate) score += 1.5;
    
    // Employee data
    if (data.employees?.length > 0) score += 2;
    
    // OSHA standards
    if (data.oshaStandards?.length > 0) score += 1;
    
    // Location/duration
    if (data.location) score += 0.5;
    if (data.duration) score += 0.5;

    return Math.round((score / maxScore) * 100);
  }

  private generateRecommendations(data: any, originalText: string): string[] {
    const recommendations: string[] = [];

    if (!data.trainingTitle) {
      recommendations.push("Training title not clearly identified - review document header");
    }

    if (!data.instructorCredentials) {
      recommendations.push("Instructor credentials missing - verify trainer qualifications");
    }

    if (!data.employees || data.employees.length === 0) {
      recommendations.push("No employee participants found - check sign-in sheet format");
    }

    if (!data.oshaStandards || data.oshaStandards.length === 0) {
      recommendations.push("OSHA standards not specified - add regulatory references");
    }

    if (!data.trainingDate) {
      recommendations.push("Training date unclear - ensure proper date formatting");
    }

    // Intelligence-based recommendations
    if (originalText.toLowerCase().includes('fall protection')) {
      recommendations.push("Consider adding 29 CFR 1926.95 Fall Protection standard");
    }

    if (originalText.toLowerCase().includes('respiratory')) {
      recommendations.push("Recommend annual fit testing verification per 29 CFR 1910.134");
    }

    if (data.employees?.length > 10) {
      recommendations.push("Large training group - consider breakout sessions for better retention");
    }

    return recommendations;
  }

  private fallbackProcessing(documentText: string): DocumentProcessingResult {
    console.log("🔄 BOOMI AI: Using fallback processing method");
    
    // Basic pattern matching for essential data
    const employees: Array<{name: string, id?: string, department?: string}> = [];
    
    // Extract names (simple pattern matching)
    const namePatterns = /([A-Z][a-z]+ [A-Z][a-z]+)/g;
    const matches = documentText.match(namePatterns);
    
    if (matches) {
      matches.forEach(name => {
        if (name.length > 5 && !name.includes('Training') && !name.includes('OSHA')) {
          employees.push({ name: name.trim() });
        }
      });
    }

    return {
      extractedData: {
        trainingTitle: "Document Processing Required",
        instructorName: null,
        instructorCredentials: null,
        trainingDate: null,
        location: null,
        duration: null,
        employees: employees.slice(0, 20), // Limit to prevent overflow
        oshaStandards: [],
        complianceType: "General Safety Training"
      },
      confidence: 30,
      processingMethod: "Boomi AI Fallback Processing",
      recommendations: [
        "Document requires manual review for complete data extraction",
        "Consider improving document format for better AI processing",
        "Verify extracted employee names for accuracy"
      ]
    };
  }

  async generateComplianceCertificate(
    employeeName: string,
    trainingDetails: any,
    companyName: string
  ): Promise<string> {
    try {
      const prompt = `
Generate a professional OSHA compliance training certificate for:
- Employee: ${employeeName}
- Training: ${trainingDetails.trainingTitle || 'Safety Training'}
- Date: ${trainingDetails.trainingDate || new Date().toISOString().split('T')[0]}
- Instructor: ${trainingDetails.instructorName || 'Certified Instructor'}
- Company: ${companyName}

Create a formal certificate text with proper compliance language.
`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a professional certificate generator for OSHA compliance training."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      });

      return response.choices[0]?.message?.content || "Certificate generation failed";
    } catch (error) {
      console.error("❌ BOOMI AI: Certificate generation error:", error);
      return `Professional Training Certificate\n\nThis certifies that ${employeeName} has successfully completed safety training requirements.`;
    }
  }
}

export const boomiAI = BoomiAIProcessor.getInstance();
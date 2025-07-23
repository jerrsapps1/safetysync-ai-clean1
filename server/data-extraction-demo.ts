import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { boomiAI } from './ai-boomi-integration';

// Our TypeScript/PostgreSQL equivalent of your Python Replit DB example
export class DataExtractionService {
  
  // Store extracted training document data
  async storeExtractedData(extractedData: any): Promise<string> {
    const recordId = uuidv4();
    
    try {
      // Store in PostgreSQL using Drizzle ORM
      const [record] = await db.execute(`
        INSERT INTO processed_documents (id, extracted_data, processing_method, confidence, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING id
      `, [recordId, JSON.stringify(extractedData), 'Boomi AI Processing', 95]);
      
      console.log(`✅ DATA STORED: Record ${recordId} saved to PostgreSQL`);
      return recordId;
    } catch (error) {
      console.error('❌ DATA STORAGE ERROR:', error);
      throw new Error('Failed to store extracted data');
    }
  }

  // Process and store training document with AI
  async processTrainingDocument(documentText: string): Promise<{
    recordId: string;
    extractedData: any;
    confidence: number;
  }> {
    try {
      // Use Boomi AI for document processing
      const result = await boomiAI.processTrainingDocument(documentText);
      
      // Store the extracted data
      const recordId = await this.storeExtractedData(result.extractedData);
      
      console.log(`🤖 AI PROCESSING COMPLETE: ${result.confidence}% confidence`);
      console.log(`📊 EXTRACTED: ${result.extractedData.employees?.length || 0} employees`);
      
      return {
        recordId,
        extractedData: result.extractedData,
        confidence: result.confidence
      };
    } catch (error) {
      console.error('❌ PROCESSING ERROR:', error);
      throw error;
    }
  }

  // Retrieve stored data by ID
  async getExtractedData(recordId: string): Promise<any> {
    try {
      const [record] = await db.execute(`
        SELECT extracted_data, processing_method, confidence, created_at
        FROM processed_documents 
        WHERE id = $1
      `, [recordId]);
      
      if (!record) {
        throw new Error('Record not found');
      }
      
      return {
        id: recordId,
        data: JSON.parse(record.extracted_data),
        method: record.processing_method,
        confidence: record.confidence,
        createdAt: record.created_at
      };
    } catch (error) {
      console.error('❌ DATA RETRIEVAL ERROR:', error);
      throw new Error('Failed to retrieve extracted data');
    }
  }

  // Demo function showing complete workflow
  async demonstrateWorkflow(): Promise<void> {
    const sampleDocument = `
      OSHA Training Sign-In Sheet
      Fall Protection Training
      Date: 2025-07-23
      Instructor: Sarah Johnson, CIH, CSP
      Location: Construction Site A
      
      Attendees:
      1. John Smith - EMP001
      2. Maria Rodriguez - EMP002  
      3. David Chen - EMP003
      4. Lisa Thompson - EMP004
    `;

    try {
      console.log('🚀 STARTING DEMO WORKFLOW...');
      
      // Process document with AI
      const result = await this.processTrainingDocument(sampleDocument);
      
      console.log(`✅ WORKFLOW COMPLETE:`);
      console.log(`   Record ID: ${result.recordId}`);
      console.log(`   Confidence: ${result.confidence}%`);
      console.log(`   Employees: ${result.extractedData.employees?.length || 0}`);
      
      // Retrieve the stored data
      const storedData = await this.getExtractedData(result.recordId);
      console.log(`📋 VERIFICATION: Data successfully stored and retrieved`);
      
    } catch (error) {
      console.error('❌ DEMO WORKFLOW FAILED:', error);
    }
  }
}

export const dataExtractionService = new DataExtractionService();
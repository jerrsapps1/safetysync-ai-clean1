import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db';

// Google Cloud Document AI configuration
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID || 'your-project-id';
const PROCESSOR_ID = process.env.GOOGLE_CLOUD_PROCESSOR_ID || 'your-processor-id';
const LOCATION = process.env.GOOGLE_CLOUD_LOCATION || 'us'; // or 'eu' depending on your GCP setup

// TypeScript equivalent of your Python Google Cloud Document AI implementation
export class GoogleDocumentAIProcessor {
  private client: DocumentProcessorServiceClient;
  private processorName: string;

  constructor() {
    this.client = new DocumentProcessorServiceClient();
    this.processorName = `projects/${PROJECT_ID}/locations/${LOCATION}/processors/${PROCESSOR_ID}`;
  }

  // TypeScript equivalent of your Python extract_from_pdf function
  async extractFromPDF(fileBuffer: Buffer): Promise<any> {
    try {
      const document = {
        content: fileBuffer,
        mimeType: 'application/pdf'
      };

      const request = {
        name: this.processorName,
        rawDocument: document
      };

      console.log(`📄 GOOGLE CLOUD AI: Processing PDF with Document AI...`);
      const [result] = await this.client.processDocument(request);

      // Extract data similar to your Python implementation
      const data: Record<string, string> = {};
      
      if (result.document?.entities) {
        for (const entity of result.document.entities) {
          if (entity.type_ && entity.mentionText) {
            data[entity.type_] = entity.mentionText;
          }
        }
      }

      console.log(`✅ GOOGLE CLOUD AI: Extracted ${Object.keys(data).length} entities`);
      return data;

    } catch (error: any) {
      console.error('❌ GOOGLE CLOUD AI ERROR:', error);
      throw new Error(`Google Cloud Document AI processing failed: ${error.message}`);
    }
  }

  // TypeScript equivalent of your Python store_extracted_data function
  async storeExtractedData(data: any): Promise<string> {
    try {
      const recordId = uuidv4();
      
      // Store in PostgreSQL (equivalent to your db[record_id] = data)
      await db.execute(`
        INSERT INTO processed_documents (ai_extracted_data, processing_date, document_type)
        VALUES ($1, NOW(), 'pdf-google-ai')
      `, [
        JSON.stringify(data)
      ]);

      console.log(`💾 STORAGE: Record ${recordId} stored in PostgreSQL`);
      return recordId;

    } catch (error: any) {
      console.error('❌ STORAGE ERROR:', error);
      throw new Error(`Failed to store extracted data: ${error.message}`);
    }
  }

  // Complete workflow combining both functions (like your Python Flask route)
  async processAndStore(fileBuffer: Buffer): Promise<{
    recordId: string;
    extractedData: any;
    processingMethod: string;
  }> {
    try {
      // Extract data using Google Cloud Document AI
      const extractedData = await this.extractFromPDF(fileBuffer);
      
      // Store the extracted data
      const recordId = await this.storeExtractedData(extractedData);

      return {
        recordId,
        extractedData,
        processingMethod: 'Google Cloud Document AI'
      };

    } catch (error: any) {
      console.error('❌ PROCESS AND STORE ERROR:', error);
      throw error;
    }
  }

  // Health check for Google Cloud Document AI service
  async healthCheck(): Promise<boolean> {
    try {
      // Simple test to verify credentials and service availability
      const testDocument = {
        content: Buffer.from('Test document'),
        mimeType: 'text/plain'
      };

      await this.client.processDocument({
        name: this.processorName,
        rawDocument: testDocument
      });

      return true;
    } catch (error) {
      console.warn('Google Cloud Document AI not available:', error.message);
      return false;
    }
  }
}

export const googleDocumentAI = new GoogleDocumentAIProcessor();
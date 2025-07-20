import { Request, Response } from 'express';
import { AIDocumentProcessor } from '../ai-document-processor';
import { db } from '../db';
import { processedDocuments, certificates } from '@shared/schema';
import { eq } from 'drizzle-orm';
import multer from 'multer';
// Auth middleware will be added from routes.ts

const aiDocumentProcessor = new AIDocumentProcessor();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept common document formats
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Please upload PDF, image, or document files.'));
    }
  }
});

export async function uploadAndProcessSignIn(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    // Handle both file upload and direct text
    if (req.body.documentContent) {
      // Direct text processing
      try {
        const documentContent = req.body.documentContent;
        const fileName = req.body.fileName || 'document.txt';
        
        // Process with AI
        const processedData = await aiDocumentProcessor.processSignInDocument(
          documentContent, 
          userId
        );

        // Store processed document using direct SQL
        const { pool } = await import('../db');
        const result = await pool.query(`
          INSERT INTO processed_documents (user_id, original_file_name, document_type, ai_extracted_data, verification_status)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id, user_id, original_file_name, document_type, ai_extracted_data, verification_status, created_at
        `, [userId, fileName, 'signin', JSON.stringify(processedData), 'pending']);
        
        const storedDoc = result.rows[0];

        res.json({
          success: true,
          processedDocument: storedDoc,
          extractedData: processedData,
          message: 'Document processed successfully. Please verify the extracted information.'
        });

      } catch (error) {
        console.error('AI processing error:', error);
        res.status(500).json({ 
          success: false, 
          error: 'Failed to process document with AI' 
        });
      }
      return;
    }

    // Handle file upload
    upload.single('signInDocument')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, error: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
      }

      try {
        let documentContent = '';
        
        // Handle different file types
        if (req.file.mimetype === 'application/pdf') {
          // Try multiple PDF extraction methods
          let extractionMethod = 'none';
          
          // Method 1: pdf-parse library
          try {
            const pdfParse = await import('pdf-parse');
            const pdfData = await pdfParse.default(req.file.buffer);
            if (pdfData.text && pdfData.text.length > 100) {
              documentContent = pdfData.text;
              extractionMethod = 'pdf-parse';
              console.log('PDF parsed successfully with pdf-parse, text length:', documentContent.length);
            } else {
              throw new Error('pdf-parse returned insufficient text');
            }
          } catch (pdfError) {
            console.error('pdf-parse failed:', pdfError);
            
            // Method 2: Try pdfreader
            try {
              const pdfreader = await import('pdfreader');
              const extractedLines: string[] = [];
              
              await new Promise((resolve, reject) => {
                new pdfreader.PdfReader().parseBuffer(req.file.buffer, (err: any, item: any) => {
                  if (err) {
                    reject(err);
                  } else if (!item) {
                    resolve(null);
                  } else if (item.text) {
                    extractedLines.push(item.text);
                  }
                });
              });
              
              if (extractedLines.length > 0) {
                documentContent = extractedLines.join(' ');
                extractionMethod = 'pdfreader';
                console.log('PDF parsed successfully with pdfreader, text length:', documentContent.length);
              } else {
                throw new Error('pdfreader returned no text');
              }
            } catch (pdfreaderError) {
              console.error('pdfreader failed:', pdfreaderError);
              
              // Method 3: Enhanced manual extraction
              const rawText = req.file.buffer.toString('utf-8');
              console.log('Both PDF libraries failed, trying manual extraction...');
              
              // Strategy 1: Extract all text between common PDF delimiters
              const patterns = [
                /\((.*?)\)/g,          // Text in parentheses
                /\[(.*?)\]/g,          // Text in brackets  
                /BT\s+(.*?)\s+ET/g,    // Between BT and ET (PDF text operators)
                /Tj\s*\((.*?)\)/g,     // Tj operators with text
                />\s*\((.*?)\)\s*</g   // XML-like text content
              ];
              
              const extractedTexts: string[] = [];
              for (const pattern of patterns) {
                const matches = rawText.match(pattern);
                if (matches) {
                  extractedTexts.push(...matches.map(match => 
                    match.replace(/[()[\]<>]/g, '')
                         .replace(/BT|ET|Tj/g, '')
                         .trim()
                  ).filter(text => text.length > 2 && /[a-zA-Z]/.test(text)));
                }
              }
              
              if (extractedTexts.length > 10) {
                documentContent = extractedTexts.join(' ');
                extractionMethod = 'manual-patterns';
                console.log('Manual pattern extraction successful, text length:', documentContent.length);
              } else {
                // Final fallback: aggressive word extraction
                const wordMatches = rawText.match(/[A-Za-z][A-Za-z0-9\s\-\.]{1,50}/g);
                if (wordMatches && wordMatches.length > 20) {
                  documentContent = wordMatches
                    .filter(text => text.length > 2 && /[a-zA-Z]/.test(text))
                    .join(' ');
                  extractionMethod = 'word-extraction';
                  console.log('Word extraction method successful, text length:', documentContent.length);
                } else {
                  documentContent = rawText
                    .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();
                  extractionMethod = 'basic-cleanup';
                  console.log('Using basic cleanup as last resort, text length:', documentContent.length);
                }
              }
            }
          }
          
          console.log(`PDF extraction method used: ${extractionMethod}`);
        } else if (req.file.mimetype.includes('text/') || req.file.originalname.endsWith('.txt')) {
          // Plain text files
          documentContent = req.file.buffer.toString('utf-8');
        } else if (req.file.mimetype.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
          // Word documents - convert buffer to text (basic extraction)
          documentContent = req.file.buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ');
        } else {
          // Fallback - try to extract text
          documentContent = req.file.buffer.toString('utf-8');
        }
        
        console.log(`Processing ${req.file.mimetype} file: ${req.file.originalname}`);
        console.log(`Extracted text length: ${documentContent.length} characters`);
        
        if (documentContent.length === 0) {
          throw new Error('No text content could be extracted from the uploaded file');
        }
        
        // Show preview of extracted content for debugging
        console.log('=== EXTRACTED TEXT PREVIEW ===');
        console.log('First 500 characters:', documentContent.substring(0, 500));
        console.log('=== MIDDLE SECTION ===');
        console.log('Middle 500 characters:', documentContent.substring(Math.floor(documentContent.length/2), Math.floor(documentContent.length/2) + 500));
        console.log('=== LAST SECTION ===');
        console.log('Last 500 characters:', documentContent.substring(Math.max(0, documentContent.length - 500)));
        console.log('=== END DEBUG ===');
        
        // Process with AI
        const processedData = await aiDocumentProcessor.processSignInDocument(
          documentContent, 
          userId
        );

        // Store processed document using direct SQL
        const { pool } = await import('../db');
        const result = await pool.query(`
          INSERT INTO processed_documents (user_id, original_file_name, document_type, ai_extracted_data, verification_status)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id, user_id, original_file_name, document_type, ai_extracted_data, verification_status, created_at
        `, [userId, req.file.originalname, 'signin', JSON.stringify(processedData), 'pending']);
        
        const storedDoc = result.rows[0];

        res.json({
          success: true,
          processedDocument: storedDoc,
          extractedData: processedData,
          message: 'Document processed successfully. Please verify the extracted information.'
        });

      } catch (error) {
        console.error('AI processing error:', error);
        res.status(500).json({ 
          success: false, 
          error: 'Failed to process document with AI' 
        });
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

export async function verifyAndGenerateCertificates(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const { documentId, verifiedData, instructorNotes } = req.body;

    if (!userId || !documentId) {
      return res.status(400).json({ success: false, error: 'Missing required parameters' });
    }

    // Get the processed document
    const [processedDoc] = await db
      .select()
      .from(processedDocuments)
      .where(eq(processedDocuments.id, documentId));

    if (!processedDoc || processedDoc.userId !== userId) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }

    // Update verification status
    await db
      .update(processedDocuments)
      .set({
        verificationStatus: 'verified',
        instructorNotes: instructorNotes || '',
        aiExtractedData: JSON.stringify(verifiedData)
      })
      .where(eq(processedDocuments.id, documentId));

    // Generate certificates
    const certificateIds = await aiDocumentProcessor.generateCertificates(
      verifiedData,
      userId
    );

    // Update certificate count
    await db
      .update(processedDocuments)
      .set({ certificatesGenerated: certificateIds.length })
      .where(eq(processedDocuments.id, documentId));

    res.json({
      success: true,
      certificatesGenerated: certificateIds.length,
      certificateIds,
      message: `Successfully generated ${certificateIds.length} certificates`
    });

  } catch (error) {
    console.error('Certificate generation error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate certificates' });
  }
}

export async function getProcessedDocuments(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    // Use direct SQL query with pool connection
    const { pool } = await import('../db');
    const result = await pool.query('SELECT * FROM processed_documents WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    
    const docs = result.rows;

    res.json({
      success: true,
      documents: docs
    });

  } catch (error) {
    console.error('Error fetching processed documents:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch documents' });
  }
}

export async function getGeneratedCertificates(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const certs = await db
      .select()
      .from(certificates)
      .where(eq(certificates.userId, userId));

    res.json({
      success: true,
      certificates: certs
    });

  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch certificates' });
  }
}

export async function generateWalletCard(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const { certificateId } = req.params;

    if (!userId || !certificateId) {
      return res.status(400).json({ success: false, error: 'Missing required parameters' });
    }

    // Get certificate
    const [certificate] = await db
      .select()
      .from(certificates)
      .where(eq(certificates.id, parseInt(certificateId)));

    if (!certificate || certificate.userId !== userId) {
      return res.status(404).json({ success: false, error: 'Certificate not found' });
    }

    // Generate wallet card (this would create a compact digital card)
    const walletCardData = {
      employeeName: certificate.employeeName,
      certificationType: certificate.certificateType,
      issueDate: certificate.issueDate,
      expirationDate: certificate.expirationDate,
      instructorName: certificate.instructorName,
      qrCode: `${process.env.BASE_URL}/verify/${certificate.id}` // For verification
    };

    res.json({
      success: true,
      walletCard: walletCardData,
      message: 'Wallet card generated successfully'
    });

  } catch (error) {
    console.error('Wallet card generation error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate wallet card' });
  }
}
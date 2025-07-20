import { Request, Response } from 'express';
import { aiDocumentProcessor } from '../ai-document-processor';
import { db } from '../db';
import { processedDocuments, certificates } from '@shared/schema';
import { eq } from 'drizzle-orm';
import multer from 'multer';
import { authenticateToken } from '../auth-middleware';

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

        // Store processed document
        const [storedDoc] = await db.insert(processedDocuments).values({
          userId,
          originalFileName: fileName,
          documentType: 'signin',
          aiExtractedData: JSON.stringify(processedData),
          verificationStatus: 'pending'
        }).returning();

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
        // Convert file buffer to text (for PDFs, you might need a PDF parser)
        const documentContent = req.file.buffer.toString('utf-8');
        
        // Process with AI
        const processedData = await aiDocumentProcessor.processSignInDocument(
          documentContent, 
          userId
        );

        // Store processed document
        const [storedDoc] = await db.insert(processedDocuments).values({
          userId,
          originalFileName: req.file.originalname,
          documentType: 'signin',
          aiExtractedData: JSON.stringify(processedData),
          verificationStatus: 'pending'
        }).returning();

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

    const docs = await db
      .select()
      .from(processedDocuments)
      .where(eq(processedDocuments.userId, userId));

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
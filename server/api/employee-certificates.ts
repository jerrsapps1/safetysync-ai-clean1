import { Request, Response } from 'express';
import { db } from '../db';
import { employeeCertificates, employeeQrCodes, employees } from '@shared/schema';
import { eq, and, desc } from 'drizzle-orm';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

// Get all certificates for a specific employee
export async function getEmployeeCertificates(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const employeeId = parseInt(req.params.employeeId);

    if (!userId || !employeeId) {
      return res.status(400).json({ success: false, error: 'Missing required parameters' });
    }

    // Verify employee belongs to user
    const [employee] = await db
      .select()
      .from(employees)
      .where(and(eq(employees.id, employeeId), eq(employees.userId, userId)));

    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }

    const certificates = await db
      .select()
      .from(employeeCertificates)
      .where(and(
        eq(employeeCertificates.employeeId, employeeId),
        eq(employeeCertificates.userId, userId)
      ))
      .orderBy(desc(employeeCertificates.createdAt));

    res.json(certificates);

  } catch (error) {
    console.error('Get employee certificates error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch employee certificates' 
    });
  }
}

// Add a new certificate for an employee
export async function addEmployeeCertificate(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const employeeId = parseInt(req.params.employeeId);
    
    if (!userId || !employeeId) {
      return res.status(400).json({ success: false, error: 'Missing required parameters' });
    }

    // Verify employee belongs to user
    const [employee] = await db
      .select()
      .from(employees)
      .where(and(eq(employees.id, employeeId), eq(employees.userId, userId)));

    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }

    const certificateData = {
      employeeId,
      userId,
      ...req.body
    };

    const [newCertificate] = await db
      .insert(employeeCertificates)
      .values(certificateData)
      .returning();

    console.log(`✓ Added certificate for employee ${employeeId}: ${newCertificate.certificateName}`);

    res.json({
      success: true,
      certificate: newCertificate,
      message: 'Certificate added successfully'
    });

  } catch (error) {
    console.error('Add employee certificate error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add employee certificate' 
    });
  }
}

// Update an employee certificate
export async function updateEmployeeCertificate(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const employeeId = parseInt(req.params.employeeId);
    const certificateId = parseInt(req.params.certificateId);
    
    if (!userId || !employeeId || !certificateId) {
      return res.status(400).json({ success: false, error: 'Missing required parameters' });
    }

    // Verify certificate belongs to user and employee
    const [existingCert] = await db
      .select()
      .from(employeeCertificates)
      .where(and(
        eq(employeeCertificates.id, certificateId),
        eq(employeeCertificates.employeeId, employeeId),
        eq(employeeCertificates.userId, userId)
      ));

    if (!existingCert) {
      return res.status(404).json({ success: false, error: 'Certificate not found' });
    }

    const [updatedCertificate] = await db
      .update(employeeCertificates)
      .set({
        ...req.body,
        updatedAt: new Date()
      })
      .where(eq(employeeCertificates.id, certificateId))
      .returning();

    console.log(`✓ Updated certificate ${certificateId} for employee ${employeeId}`);

    res.json({
      success: true,
      certificate: updatedCertificate,
      message: 'Certificate updated successfully'
    });

  } catch (error) {
    console.error('Update employee certificate error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update employee certificate' 
    });
  }
}

// Delete an employee certificate
export async function deleteEmployeeCertificate(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const employeeId = parseInt(req.params.employeeId);
    const certificateId = parseInt(req.params.certificateId);
    
    if (!userId || !employeeId || !certificateId) {
      return res.status(400).json({ success: false, error: 'Missing required parameters' });
    }

    // Verify certificate belongs to user and employee
    const [existingCert] = await db
      .select()
      .from(employeeCertificates)
      .where(and(
        eq(employeeCertificates.id, certificateId),
        eq(employeeCertificates.employeeId, employeeId),
        eq(employeeCertificates.userId, userId)
      ));

    if (!existingCert) {
      return res.status(404).json({ success: false, error: 'Certificate not found' });
    }

    await db
      .delete(employeeCertificates)
      .where(eq(employeeCertificates.id, certificateId));

    console.log(`✓ Deleted certificate ${certificateId} for employee ${employeeId}`);

    res.json({
      success: true,
      message: 'Certificate deleted successfully'
    });

  } catch (error) {
    console.error('Delete employee certificate error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete employee certificate' 
    });
  }
}

// Generate QR code for employee
export async function generateEmployeeQrCode(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const employeeId = parseInt(req.params.employeeId);
    
    if (!userId || !employeeId) {
      return res.status(400).json({ success: false, error: 'Missing required parameters' });
    }

    // Verify employee belongs to user
    const [employee] = await db
      .select()
      .from(employees)
      .where(and(eq(employees.id, employeeId), eq(employees.userId, userId)));

    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }

    // Check if QR code already exists
    const [existingQr] = await db
      .select()
      .from(employeeQrCodes)
      .where(and(
        eq(employeeQrCodes.employeeId, employeeId),
        eq(employeeQrCodes.userId, userId)
      ));

    let qrCodeData: string;
    let qrCodeId: number;

    if (existingQr) {
      qrCodeData = existingQr.qrCodeData;
      qrCodeId = existingQr.id;
    } else {
      // Generate unique QR code data
      qrCodeData = uuidv4();
      
      // Save QR code to database
      const [newQrCode] = await db
        .insert(employeeQrCodes)
        .values({
          employeeId,
          userId,
          qrCodeData,
          isActive: true
        })
        .returning();
      
      qrCodeId = newQrCode.id;
    }

    // Generate QR code URL for employee certificate access
    const qrUrl = `${process.env.BASE_URL || 'https://safetysync.ai'}/employee-certs/${qrCodeData}`;
    
    // Generate QR code image
    const qrCodeImage = await QRCode.toDataURL(qrUrl, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 256
    });

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads', 'qr-codes');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Save QR code image to file
    const fileName = `employee-${employeeId}-qr-${qrCodeData.substring(0, 8)}.png`;
    const filePath = path.join(uploadsDir, fileName);
    const imageBuffer = Buffer.from(qrCodeImage.split(',')[1], 'base64');
    fs.writeFileSync(filePath, imageBuffer);

    // Update QR code with image path
    const imagePath = `/uploads/qr-codes/${fileName}`;
    
    const [updatedQrCode] = await db
      .update(employeeQrCodes)
      .set({
        qrCodeImagePath: imagePath,
        updatedAt: new Date()
      })
      .where(eq(employeeQrCodes.id, qrCodeId))
      .returning();

    console.log(`✓ Generated QR code for employee ${employeeId}: ${employee.firstName} ${employee.lastName}`);

    res.json({
      success: true,
      qrCode: updatedQrCode,
      qrUrl,
      message: 'QR code generated successfully'
    });

  } catch (error) {
    console.error('Generate QR code error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate QR code' 
    });
  }
}

// Get employee QR code
export async function getEmployeeQrCode(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const employeeId = parseInt(req.params.employeeId);
    
    if (!userId || !employeeId) {
      return res.status(400).json({ success: false, error: 'Missing required parameters' });
    }

    const [qrCode] = await db
      .select()
      .from(employeeQrCodes)
      .where(and(
        eq(employeeQrCodes.employeeId, employeeId),
        eq(employeeQrCodes.userId, userId),
        eq(employeeQrCodes.isActive, true)
      ));

    if (!qrCode) {
      return res.status(404).json({ success: false, error: 'QR code not found' });
    }

    res.json(qrCode);

  } catch (error) {
    console.error('Get QR code error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get QR code' 
    });
  }
}

// Public endpoint to view employee certificates via QR code (no authentication required)
export async function viewEmployeeCertificatesPublic(req: Request, res: Response) {
  try {
    const qrCodeData = req.params.qrCodeData;
    
    if (!qrCodeData) {
      return res.status(400).json({ success: false, error: 'QR code data required' });
    }

    // Find QR code
    const [qrCode] = await db
      .select()
      .from(employeeQrCodes)
      .where(and(
        eq(employeeQrCodes.qrCodeData, qrCodeData),
        eq(employeeQrCodes.isActive, true)
      ));

    if (!qrCode) {
      return res.status(404).json({ success: false, error: 'Invalid or expired QR code' });
    }

    // Get employee information
    const [employee] = await db
      .select()
      .from(employees)
      .where(eq(employees.id, qrCode.employeeId));

    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }

    // Get employee certificates
    const certificates = await db
      .select()
      .from(employeeCertificates)
      .where(and(
        eq(employeeCertificates.employeeId, qrCode.employeeId),
        eq(employeeCertificates.status, 'active')
      ))
      .orderBy(desc(employeeCertificates.issueDate));

    // Update access count
    await db
      .update(employeeQrCodes)
      .set({
        accessCount: qrCode.accessCount + 1,
        lastAccessedAt: new Date()
      })
      .where(eq(employeeQrCodes.id, qrCode.id));

    console.log(`📱 QR code accessed for employee ${employee.firstName} ${employee.lastName} (${certificates.length} certificates)`);

    res.json({
      success: true,
      employee: {
        id: employee.id,
        employeeId: employee.employeeId,
        firstName: employee.firstName,
        lastName: employee.lastName,
        position: employee.position,
        department: employee.department,
        location: employee.location
      },
      certificates: certificates.map(cert => ({
        id: cert.id,
        certificateName: cert.certificateName,
        certificationType: cert.certificationType,
        issueDate: cert.issueDate,
        expirationDate: cert.expirationDate,
        issuingOrganization: cert.issuingOrganization,
        instructorName: cert.instructorName,
        instructorCredentials: cert.instructorCredentials,
        trainingStandards: cert.trainingStandards,
        certificateNumber: cert.certificateNumber,
        status: cert.status
      })),
      accessedAt: new Date().toISOString(),
      totalAccesses: qrCode.accessCount + 1
    });

  } catch (error) {
    console.error('View certificates public error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to load employee certificates' 
    });
  }
}
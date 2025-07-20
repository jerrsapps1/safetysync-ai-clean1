import { db } from './db';
import { employeeCertificates, employees } from '@shared/schema';
import { CertificateGenerator } from './certificate-generator';
import { eq, and } from 'drizzle-orm';

export class EmployeeCertificateService {
  private certificateGenerator: CertificateGenerator;

  constructor() {
    this.certificateGenerator = new CertificateGenerator();
  }

  async generateAndStoreEmployeeCertificate(data: {
    employeeId: number;
    userId: number;
    employeeName: string;
    employeeIdString: string;
    trainingName: string;
    completionDate: string;
    instructorName: string;
    instructorCredentials: string;
    location: string;
    duration: string;
    companyName?: string;
  }) {
    // Verify employee exists and belongs to user
    const [employee] = await db
      .select()
      .from(employees)
      .where(and(eq(employees.id, data.employeeId), eq(employees.userId, data.userId)));

    if (!employee) {
      throw new Error('Employee not found or access denied');
    }

    // Generate certificate using existing generator
    const certificateResult = await this.certificateGenerator.generateCertificate({
      employeeName: data.employeeName,
      employeeId: data.employeeIdString,
      trainingName: data.trainingName,
      completionDate: data.completionDate,
      instructorName: data.instructorName,
      instructorCredentials: data.instructorCredentials,
      location: data.location,
      duration: data.duration,
      companyName: data.companyName
    });

    // Generate wallet card
    const walletCardHtml = this.certificateGenerator.generateWalletCard({
      employeeName: data.employeeName,
      employeeId: data.employeeIdString,
      trainingName: data.trainingName,
      completionDate: data.completionDate,
      expiryDate: certificateResult.expiryDate,
      instructorName: data.instructorName,
      instructorCredentials: data.instructorCredentials,
      companyName: data.companyName || 'SafetySync.AI',
      certificateNumber: certificateResult.certificateNumber
    });

    // Save wallet card to file
    const fs = require('fs/promises');
    const path = require('path');
    const uploadsDir = path.join(process.cwd(), 'uploads', 'wallet-cards');
    
    try {
      await fs.access(uploadsDir);
    } catch {
      await fs.mkdir(uploadsDir, { recursive: true });
    }

    const walletCardFilename = `wallet_card_${data.employeeIdString}_${Date.now()}.html`;
    const walletCardFilepath = path.join(uploadsDir, walletCardFilename);
    await fs.writeFile(walletCardFilepath, walletCardHtml, 'utf8');
    const walletCardUrl = `/uploads/wallet-cards/${walletCardFilename}`;

    // Determine training standards based on training name
    const trainingStandards = this.getTrainingStandards(data.trainingName);

    // Store certificate in employee certificates table
    const [newEmployeeCertificate] = await db
      .insert(employeeCertificates)
      .values({
        employeeId: data.employeeId,
        userId: data.userId,
        certificateName: data.trainingName,
        certificationType: this.getCertificationType(data.trainingName),
        issueDate: new Date(data.completionDate),
        expirationDate: new Date(certificateResult.expiryDate),
        issuingOrganization: data.companyName || 'SafetySync.AI',
        instructorName: data.instructorName,
        instructorCredentials: data.instructorCredentials,
        trainingStandards: trainingStandards,
        certificateNumber: certificateResult.certificateNumber,
        certificateFilePath: certificateResult.certificateUrl,
        walletCardFilePath: walletCardUrl,
        uploadedFromExternal: false,
        notes: `Generated from training completed on ${data.completionDate} at ${data.location}`,
        status: 'active'
      })
      .returning();

    console.log(`✓ Generated and stored certificate for employee ${data.employeeName}: ${data.trainingName}`);

    return {
      success: true,
      certificate: newEmployeeCertificate,
      certificateUrl: certificateResult.certificateUrl,
      walletCardUrl: walletCardUrl,
      certificateNumber: certificateResult.certificateNumber,
      expiryDate: certificateResult.expiryDate
    };
  }

  private getCertificationType(trainingName: string): string {
    const typeMapping: Record<string, string> = {
      'Fall Protection Training': 'Safety Training',
      'OSHA 10-Hour General Industry': 'OSHA Certification',
      'Hazard Communication (HazCom)': 'Safety Training',
      'Personal Protective Equipment (PPE)': 'Safety Training',
      'Lockout/Tagout (LOTO)': 'Safety Training',
      'Respiratory Protection': 'Safety Training',
      'Confined Space Entry': 'Safety Training',
      'Forklift Operation': 'Equipment Operation',
      'First Aid/CPR': 'Medical Certification',
      'Fire Safety': 'Safety Training',
      'Electrical Safety': 'Safety Training'
    };

    return typeMapping[trainingName] || 'Training Certificate';
  }

  private getTrainingStandards(trainingName: string): string[] {
    const standardsMapping: Record<string, string[]> = {
      'Fall Protection Training': ['29 CFR 1926.501', '29 CFR 1926.502', '29 CFR 1926.503'],
      'OSHA 10-Hour General Industry': ['29 CFR 1926.95'],
      'Hazard Communication (HazCom)': ['29 CFR 1910.1200'],
      'Personal Protective Equipment (PPE)': ['29 CFR 1910.132'],
      'Lockout/Tagout (LOTO)': ['29 CFR 1910.147'],
      'Respiratory Protection': ['29 CFR 1910.134'],
      'Confined Space Entry': ['29 CFR 1910.146'],
      'Forklift Operation': ['29 CFR 1910.178'],
      'First Aid/CPR': ['OSHA First Aid Standards'],
      'Fire Safety': ['29 CFR 1910.38'],
      'Electrical Safety': ['29 CFR 1910.303']
    };

    return standardsMapping[trainingName] || ['General Safety Standards'];
  }

  async addExternalCertificate(data: {
    employeeId: number;
    userId: number;
    certificateName: string;
    certificationType: string;
    issueDate: Date;
    expirationDate?: Date;
    issuingOrganization?: string;
    instructorName?: string;
    instructorCredentials?: string;
    certificateNumber?: string;
    notes?: string;
    certificateFilePath?: string;
  }) {
    // Verify employee exists and belongs to user
    const [employee] = await db
      .select()
      .from(employees)
      .where(and(eq(employees.id, data.employeeId), eq(employees.userId, data.userId)));

    if (!employee) {
      throw new Error('Employee not found or access denied');
    }

    // Store external certificate in employee certificates table
    const [newEmployeeCertificate] = await db
      .insert(employeeCertificates)
      .values({
        employeeId: data.employeeId,
        userId: data.userId,
        certificateName: data.certificateName,
        certificationType: data.certificationType,
        issueDate: data.issueDate,
        expirationDate: data.expirationDate,
        issuingOrganization: data.issuingOrganization,
        instructorName: data.instructorName,
        instructorCredentials: data.instructorCredentials,
        certificateNumber: data.certificateNumber,
        certificateFilePath: data.certificateFilePath,
        uploadedFromExternal: true,
        notes: data.notes,
        status: 'active'
      })
      .returning();

    console.log(`✓ Added external certificate for employee ID ${data.employeeId}: ${data.certificateName}`);

    return {
      success: true,
      certificate: newEmployeeCertificate
    };
  }

  async updateCertificateStatus(certificateId: number, userId: number, status: 'active' | 'expired' | 'revoked', notes?: string) {
    // Verify certificate belongs to user
    const [existingCert] = await db
      .select()
      .from(employeeCertificates)
      .where(and(
        eq(employeeCertificates.id, certificateId),
        eq(employeeCertificates.userId, userId)
      ));

    if (!existingCert) {
      throw new Error('Certificate not found or access denied');
    }

    const [updatedCertificate] = await db
      .update(employeeCertificates)
      .set({
        status,
        notes: notes || existingCert.notes,
        updatedAt: new Date()
      })
      .where(eq(employeeCertificates.id, certificateId))
      .returning();

    console.log(`✓ Updated certificate ${certificateId} status to ${status}`);

    return {
      success: true,
      certificate: updatedCertificate
    };
  }
}
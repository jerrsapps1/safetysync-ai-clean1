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
    employeeId?: number;
    userId: number;
    employeeName: string;
    employeeIdString?: string;
    trainingName?: string;
    trainingTitle?: string;
    completionDate?: string;
    trainingDate?: string;
    instructorName: string;
    instructorCredentials: string;
    location: string;
    duration: string;
    companyName?: string;
    trainingStandards?: string[];
    certificationType?: string;
    expirationDate?: string;
  }) {
    // Normalize the data for flexibility
    const normalizedData = {
      ...data,
      trainingName: data.trainingName || data.trainingTitle || 'General Training',
      completionDate: data.completionDate || data.trainingDate || new Date().toISOString().split('T')[0],
      employeeIdString: data.employeeIdString || data.employeeId?.toString() || `AUTO-${Date.now()}`
    };

    let employee;
    let profileCreated = false;

    if (data.employeeId) {
      // Verify existing employee
      const [existingEmployee] = await db
        .select()
        .from(employees)
        .where(and(eq(employees.id, data.employeeId), eq(employees.userId, data.userId)));

      if (!existingEmployee) {
        throw new Error('Employee not found or access denied');
      }
      employee = existingEmployee;
    } else {
      // Create new employee profile from training document
      try {
        const [newEmployee] = await db
          .insert(employees)
          .values({
            userId: data.userId,
            firstName: normalizedData.employeeName.split(' ')[0] || 'Unknown',
            lastName: normalizedData.employeeName.split(' ').slice(1).join(' ') || 'Employee',
            employeeId: normalizedData.employeeIdString,
            email: `${normalizedData.employeeName.toLowerCase().replace(/\s+/g, '.')}@company.com`,
            phone: '(555) 000-0000',
            position: 'Employee',
            department: 'General',
            location: normalizedData.location || 'Main Office',
            hireDate: new Date(normalizedData.completionDate),
            status: 'Active',
            notes: `Profile created from training document: ${normalizedData.trainingName}`
          })
          .returning();

        employee = newEmployee;
        profileCreated = true;
        console.log(`✓ Created new employee profile: ${normalizedData.employeeName} (ID: ${employee.id})`);
      } catch (error) {
        console.error(`Error creating employee profile for ${normalizedData.employeeName}:`, error);
        throw new Error(`Failed to create employee profile: ${error.message}`);
      }
    }

    // Generate certificate using existing generator
    const certificateResult = await this.certificateGenerator.generateCertificate({
      employeeName: normalizedData.employeeName,
      employeeId: normalizedData.employeeIdString,
      trainingName: normalizedData.trainingName,
      completionDate: normalizedData.completionDate,
      instructorName: normalizedData.instructorName,
      instructorCredentials: normalizedData.instructorCredentials,
      location: normalizedData.location,
      duration: normalizedData.duration,
      companyName: normalizedData.companyName
    });

    // Generate wallet card
    const walletCardHtml = this.certificateGenerator.generateWalletCard({
      employeeName: normalizedData.employeeName,
      employeeId: normalizedData.employeeIdString,
      trainingName: normalizedData.trainingName,
      completionDate: normalizedData.completionDate,
      expiryDate: data.expirationDate || certificateResult.expiryDate,
      instructorName: normalizedData.instructorName,
      instructorCredentials: normalizedData.instructorCredentials,
      companyName: normalizedData.companyName || 'SafetySync.AI',
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

    const walletCardFilename = `wallet_card_${normalizedData.employeeIdString}_${Date.now()}.html`;
    const walletCardFilepath = path.join(uploadsDir, walletCardFilename);
    await fs.writeFile(walletCardFilepath, walletCardHtml, 'utf8');
    const walletCardUrl = `/uploads/wallet-cards/${walletCardFilename}`;

    // Determine training standards based on training name
    const trainingStandards = data.trainingStandards || this.getTrainingStandards(normalizedData.trainingName);

    // Store certificate in employee certificates table
    const [newEmployeeCertificate] = await db
      .insert(employeeCertificates)
      .values({
        employeeId: employee.id,
        userId: data.userId,
        certificateName: normalizedData.trainingName,
        certificationType: data.certificationType || this.getCertificationType(normalizedData.trainingName),
        issueDate: new Date(normalizedData.completionDate),
        expirationDate: new Date(data.expirationDate || certificateResult.expiryDate),
        issuingOrganization: normalizedData.companyName || 'SafetySync.AI',
        instructorName: normalizedData.instructorName,
        instructorCredentials: normalizedData.instructorCredentials,
        trainingStandards: trainingStandards,
        certificateNumber: certificateResult.certificateNumber,
        certificateFilePath: certificateResult.certificateUrl,
        walletCardFilePath: walletCardUrl,
        uploadedFromExternal: false,
        notes: `Generated from training completed on ${normalizedData.completionDate} at ${normalizedData.location}`,
        status: 'active'
      })
      .returning();

    console.log(`✓ Generated and stored certificate for employee ${normalizedData.employeeName}: ${normalizedData.trainingName}`);

    return {
      success: true,
      certificate: newEmployeeCertificate,
      certificateId: newEmployeeCertificate.id,
      certificateUrl: certificateResult.certificateUrl,
      walletCardUrl: walletCardUrl,
      certificateNumber: certificateResult.certificateNumber,
      expiryDate: data.expirationDate || certificateResult.expiryDate,
      profileCreated: profileCreated,
      employeeId: employee.id,
      employeeName: normalizedData.employeeName
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
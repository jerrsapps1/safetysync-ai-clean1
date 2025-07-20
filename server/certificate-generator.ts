import fs from 'fs/promises';
import path from 'path';

interface CertificateData {
  employeeName: string;
  employeeId: string;
  trainingName: string;
  completionDate: string;
  expiryDate: string;
  companyName: string;
  certificateNumber: string;
  instructorName: string;
  instructorCredentials: string;
  oshaStandard: string;
  location: string;
  duration: string;
}

export class CertificateGenerator {
  private generateCertificateNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CERT-${timestamp.slice(-8)}${random}`;
  }

  private getOSHAStandardInfo(trainingName: string): { standard: string; complianceStatement: string } {
    const oshaStandards: Record<string, { standard: string; complianceStatement: string }> = {
      'Fall Protection Training': {
        standard: '29 CFR 1926.501, 1926.502, 1926.503, 1926.95',
        complianceStatement: 'This training is compliant with OSHA 29 CFR 1926.501 fall protection standards and requirements for construction and general industry applications.'
      },
      'OSHA 10-Hour General Industry': {
        standard: '29 CFR 1926.95 - OSHA 10-Hour General Industry Safety Training',
        complianceStatement: 'This training program is compliant with OSHA 29 CFR 1926.95 requirements for general industry safety training and provides foundational knowledge of workplace safety standards.'
      },
      'Hazard Communication (HazCom)': {
        standard: '29 CFR 1910.1200 - Hazard Communication Standard',
        complianceStatement: 'This training is compliant with OSHA 29 CFR 1910.1200 Hazard Communication Standard requirements for chemical hazard awareness and safety data sheet comprehension.'
      },
      'Personal Protective Equipment (PPE)': {
        standard: '29 CFR 1910.132 - Personal Protective Equipment',
        complianceStatement: 'This training meets OSHA 29 CFR 1910.132 requirements for personal protective equipment selection, use, and maintenance in the workplace.'
      },
      'Lockout/Tagout (LOTO)': {
        standard: '29 CFR 1910.147 - Control of Hazardous Energy',
        complianceStatement: 'This training meets OSHA 29 CFR 1910.147 requirements for the control of hazardous energy sources during equipment maintenance and servicing.'
      },
      'Respiratory Protection': {
        standard: '29 CFR 1910.134 - Respiratory Protection',
        complianceStatement: 'This training is compliant with OSHA 29 CFR 1910.134 respiratory protection standards for proper respirator selection, use, and maintenance.'
      },
      'Confined Space Entry': {
        standard: '29 CFR 1910.146 - Permit-Required Confined Spaces',
        complianceStatement: 'This training meets OSHA 29 CFR 1910.146 requirements for safe entry into permit-required confined spaces and hazard recognition.'
      },
      'Forklift Operation': {
        standard: '29 CFR 1910.178 - Powered Industrial Trucks',
        complianceStatement: 'This training is compliant with OSHA 29 CFR 1910.178 requirements for powered industrial truck operation and safety protocols.'
      }
    };

    return oshaStandards[trainingName] || {
      standard: '29 CFR 1926.95 - General Industry Safety Training',
      complianceStatement: 'This training program is designed to meet applicable OSHA safety training requirements and industry best practices for workplace safety.'
    };
  }

  private formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private calculateExpiryDate(trainingName: string, completionDate: Date): string {
    // Training expiry periods based on OSHA requirements
    const expiryPeriods: Record<string, number> = {
      'Fall Protection Training': 365, // 1 year
      'OSHA 10-Hour General Industry': 1095, // 3 years
      'Hazard Communication (HazCom)': 365, // 1 year
      'Personal Protective Equipment (PPE)': 365, // 1 year
      'Lockout/Tagout (LOTO)': 365, // 1 year
      'Respiratory Protection': 365, // 1 year
      'Confined Space Entry': 365, // 1 year
      'Forklift Operation': 1095, // 3 years
    };

    const days = expiryPeriods[trainingName] || 365; // Default 1 year
    const expiryDate = new Date(completionDate);
    expiryDate.setDate(expiryDate.getDate() + days);
    
    return this.formatDate(expiryDate);
  }

  private generateCertificateHTML(data: CertificateData): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Training Certificate - ${data.employeeName}</title>
    <style>
        @page {
            size: letter;
            margin: 0.5in;
        }
        
        body {
            font-family: Arial, sans-serif;
            line-height: 1.4;
            color: #000;
            margin: 0;
            padding: 20px;
            background: white;
        }
        
        .certificate {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border: 3px solid #000;
            position: relative;
            min-height: 600px;
        }
        
        .certificate-header {
            text-align: center;
            margin-bottom: 60px;
        }
        
        .certificate-title {
            font-size: 32px;
            font-weight: bold;
            color: #000;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 4px;
        }
        
        .certificate-subtitle {
            font-size: 16px;
            color: #000;
            margin-bottom: 40px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        
        .certificate-presented-to {
            font-size: 16px;
            color: #000;
            margin-bottom: 20px;
        }
        
        .employee-name {
            font-size: 42px;
            font-weight: bold;
            color: #000;
            margin: 30px 0;
            text-transform: uppercase;
            letter-spacing: 3px;
        }
        
        .completion-text {
            font-size: 12px;
            color: #000;
            margin: 20px 0;
            line-height: 1.5;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .training-name {
            font-size: 24px;
            font-weight: bold;
            color: #000;
            margin: 25px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .compliance-text {
            font-size: 12px;
            color: #000;
            margin: 20px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .expiry-section {
            font-size: 16px;
            font-weight: bold;
            color: #000;
            margin: 40px 0;
            text-transform: uppercase;
        }
        
        .instructor-section {
            display: flex;
            justify-content: space-between;
            margin-top: 80px;
            padding-top: 20px;
        }
        
        .instructor-info {
            text-align: center;
            flex: 1;
        }
        
        .instructor-name {
            font-size: 14px;
            font-weight: bold;
            color: #000;
            border-top: 1px solid #000;
            padding-top: 5px;
            margin: 0 20px;
        }
        
        .instructor-title {
            font-size: 12px;
            color: #000;
            margin-top: 2px;
        }
        
        .certificate-details {
            position: absolute;
            bottom: 20px;
            right: 20px;
            font-size: 12px;
            color: #000;
        }
        
        .certificate-number {
            position: absolute;
            top: 40px;
            right: 40px;
            font-size: 12px;
            color: #666;
            background: #f5f5f5;
            padding: 5px 10px;
            border-radius: 3px;
        }
        
        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 120px;
            color: rgba(25, 118, 210, 0.05);
            font-weight: bold;
            z-index: 0;
            pointer-events: none;
        }
        
        @media print {
            body {
                background: none;
            }
        }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="watermark">CERTIFIED</div>
        
        <div class="certificate-number">Certificate: ${data.certificateNumber}</div>
        
        <div class="certificate-header">
            <div class="certificate-title">CERTIFICATE</div>
            <div class="certificate-subtitle">OF COMPLETION</div>
        </div>
        
        <div class="certificate-presented-to">This certificate is presented to</div>
        
        <div class="employee-name">${data.employeeName}</div>
        
        <div class="completion-text">
            The above named Employee has successfully completed, Classroom, Competency and applicable Practical training in
        </div>
        
        <div class="training-name">${data.trainingName}</div>
        
        <div class="compliance-text">
            COMPLIANT WITH ${data.oshaStandard}
        </div>
        
        <div class="completion-text">
            Training conducted at ${data.location} for ${data.duration} on ${data.completionDate}
        </div>
        
        <div class="expiry-section">
            EXPIRES: ${data.expiryDate !== 'Never' ? data.expiryDate.replace(/,/g, '') : 'DOES NOT EXPIRE'}
        </div>
        
        <div class="instructor-section">
            <div class="instructor-info">
                <div class="instructor-name">${data.instructorName.toUpperCase()}</div>
                <div class="instructor-title">${data.instructorCredentials}</div>
            </div>
            <div class="instructor-info">
                <div class="instructor-name">${data.companyName.toUpperCase()}</div>
                <div class="instructor-title">Safety Training Dept.</div>
            </div>
        </div>
        
        <div class="certificate-details">
            Completion Date: ${data.completionDate.replace(/,/g, '')}<br>
            Employee ID: ${data.employeeId}<br>
            Training Location: ${data.location}
        </div>
    </div>
</body>
</html>`;
  }

  async generateCertificate(certificateData: {
    employeeName: string;
    employeeId: string;
    trainingName: string;
    completionDate: string;
    instructorName: string;
    instructorCredentials: string;
    location: string;
    duration: string;
    companyName?: string;
  }): Promise<{ certificateUrl: string; certificateNumber: string; expiryDate: string }> {
    const certificateNumber = this.generateCertificateNumber();
    const oshaInfo = this.getOSHAStandardInfo(certificateData.trainingName);
    const completionDate = new Date(certificateData.completionDate);
    const expiryDate = this.calculateExpiryDate(certificateData.trainingName, completionDate);
    
    const data: CertificateData = {
      employeeName: certificateData.employeeName,
      employeeId: certificateData.employeeId,
      trainingName: certificateData.trainingName,
      completionDate: this.formatDate(certificateData.completionDate),
      expiryDate,
      companyName: certificateData.companyName || 'SafetySync.AI',
      certificateNumber,
      instructorName: certificateData.instructorName,
      instructorCredentials: certificateData.instructorCredentials,
      oshaStandard: oshaInfo.standard,
      location: certificateData.location,
      duration: certificateData.duration
    };

    const html = this.generateCertificateHTML(data);
    
    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'uploads', 'certificates');
    try {
      await fs.access(uploadsDir);
    } catch {
      await fs.mkdir(uploadsDir, { recursive: true });
    }

    // Save certificate as HTML file
    const filename = `certificate_${certificateData.employeeId}_${Date.now()}.html`;
    const filepath = path.join(uploadsDir, filename);
    
    await fs.writeFile(filepath, html, 'utf8');
    
    return {
      certificateUrl: `/uploads/certificates/${filename}`,
      certificateNumber,
      expiryDate
    };
  }

  generateWalletCard(certificateData: {
    employeeName: string;
    employeeId: string;
    trainingName: string;
    completionDate: string;
    expiryDate: string;
    instructorName: string;
    instructorCredentials: string;
    companyName?: string;
    certificateNumber: string;
  }): string {
    const oshaInfo = this.getOSHAStandardInfo(certificateData.trainingName);
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Training Wallet Card - ${certificateData.employeeName}</title>
    <style>
        @page {
            size: 3.375in 2.125in;
            margin: 0.1in;
        }
        
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: white;
        }
        
        .wallet-card {
            width: 3.375in;
            height: 2.125in;
            background: white;
            border: 2px solid #000;
            padding: 0.1in;
            box-sizing: border-box;
            position: relative;
        }
        
        .card-header {
            text-align: center;
            margin-bottom: 0.05in;
            border-bottom: 1px solid #ccc;
            padding-bottom: 0.05in;
        }
        
        .card-title {
            font-size: 10px;
            font-weight: bold;
            color: #1976d2;
            margin: 0;
        }
        
        .company-name {
            font-size: 8px;
            color: #666;
            margin: 0;
        }
        
        .employee-name {
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            margin: 0.05in 0;
            color: #000;
        }
        
        .employee-id {
            font-size: 8px;
            text-align: center;
            color: #666;
            margin-bottom: 0.05in;
        }
        
        .training-info {
            font-size: 8px;
            line-height: 1.2;
            margin-bottom: 0.05in;
        }
        
        .training-name {
            font-weight: bold;
            color: #000;
        }
        
        .osha-standard {
            color: #666;
            margin: 0.02in 0;
        }
        
        .dates {
            display: flex;
            justify-content: space-between;
            font-size: 7px;
            color: #000;
            margin: 0.05in 0;
        }
        
        .footer {
            position: absolute;
            bottom: 0.05in;
            left: 0.1in;
            right: 0.1in;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 6px;
            color: #666;
        }
        
        .cert-number {
            font-size: 6px;
            color: #666;
        }
        
        @media print {
            body {
                background: none;
            }
        }
    </style>
</head>
<body>
    <div class="wallet-card">
        <div class="card-header">
            <div class="card-title">SAFETY TRAINING CERTIFICATION CARD</div>
            <div class="company-name">${certificateData.companyName || 'SafetySync.AI'}</div>
        </div>
        
        <div class="employee-name">${certificateData.employeeName}</div>
        <div class="employee-id">ID: ${certificateData.employeeId}</div>
        
        <div class="training-info">
            <div class="training-name">Has completed ${certificateData.trainingName}</div>
            <div class="osha-standard">in compliance with ${oshaInfo.standard}</div>
        </div>
        
        <div class="dates">
            <div>
                <strong>Training Date:</strong><br>
                ${certificateData.completionDate.replace(/,/g, '')}
            </div>
            <div>
                <strong>Expires:</strong><br>
                ${certificateData.expiryDate.replace(/,/g, '')}
            </div>
        </div>
        
        <div class="footer">
            <div>
                <div><strong>Trainer:</strong> ${certificateData.instructorName}</div>
                <div>${certificateData.instructorCredentials}</div>
            </div>
            <div class="cert-number">
                Cert: ${certificateData.certificateNumber}
            </div>
        </div>
    </div>
</body>
</html>`;
  }
}

export const certificateGenerator = new CertificateGenerator();
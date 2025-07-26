const html2pdf = require('html2pdf.js');

class PDFGenerator {
  constructor() {
    this.defaultOptions = {
      margin: [10, 10],
      filename: 'document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
  }

  async generateCertificatePDF(certificateData) {
    const htmlContent = this.createCertificateHTML(certificateData);
    
    const options = {
      ...this.defaultOptions,
      filename: `${certificateData.employeeName}_Certificate.pdf`,
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    return await html2pdf().set(options).from(htmlContent).toPdf().get('pdf').then(pdf => {
      return pdf.output('blob');
    });
  }

  async generateWalletCardPDF(cardData) {
    const htmlContent = this.createWalletCardHTML(cardData);
    
    const options = {
      ...this.defaultOptions,
      filename: `${cardData.employeeName}_WalletCard.pdf`,
      jsPDF: { unit: 'mm', format: [85.6, 54], orientation: 'landscape' } // Credit card size
    };

    return await html2pdf().set(options).from(htmlContent).toPdf().get('pdf').then(pdf => {
      return pdf.output('blob');
    });
  }

  async generateTrainingReportPDF(reportData) {
    const htmlContent = this.createTrainingReportHTML(reportData);
    
    const options = {
      ...this.defaultOptions,
      filename: `Training_Report_${new Date().toISOString().split('T')[0]}.pdf`
    };

    return await html2pdf().set(options).from(htmlContent).toPdf().get('pdf').then(pdf => {
      return pdf.output('blob');
    });
  }

  createCertificateHTML(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: 'Arial', sans-serif; 
            margin: 0; 
            padding: 40px;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            min-height: 100vh;
          }
          .certificate {
            background: white;
            border: 8px solid #2563eb;
            border-radius: 20px;
            padding: 60px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            border-bottom: 3px solid #10b981;
            padding-bottom: 30px;
            margin-bottom: 40px;
          }
          .logo {
            font-size: 36px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
          }
          .title {
            font-size: 48px;
            font-weight: bold;
            color: #1e293b;
            margin: 30px 0;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          .subtitle {
            font-size: 24px;
            color: #475569;
            margin-bottom: 40px;
          }
          .employee-name {
            font-size: 36px;
            font-weight: bold;
            color: #2563eb;
            margin: 30px 0;
            text-decoration: underline;
          }
          .training-details {
            background: #f8fafc;
            padding: 30px;
            border-radius: 10px;
            margin: 40px 0;
            border-left: 5px solid #10b981;
          }
          .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            text-align: left;
          }
          .detail-item {
            margin-bottom: 15px;
          }
          .detail-label {
            font-weight: bold;
            color: #374151;
            display: block;
          }
          .detail-value {
            color: #1f2937;
            font-size: 18px;
          }
          .signatures {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 60px;
            margin-top: 60px;
            text-align: center;
          }
          .signature-line {
            border-top: 2px solid #374151;
            padding-top: 10px;
            margin-top: 40px;
          }
          .qr-section {
            position: absolute;
            bottom: 40px;
            right: 40px;
            text-align: center;
          }
          .certificate-id {
            font-size: 12px;
            color: #6b7280;
            margin-top: 40px;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="header">
            <div class="logo">SafetySync.AI</div>
            <div style="color: #6b7280; font-size: 14px;">OSHA Compliance Platform</div>
          </div>
          
          <div class="title">Certificate of Completion</div>
          <div class="subtitle">This certifies that</div>
          
          <div class="employee-name">${data.employeeName}</div>
          
          <div style="font-size: 20px; color: #475569; margin: 20px 0;">
            has successfully completed the training requirements for
          </div>
          
          <div style="font-size: 28px; font-weight: bold; color: #10b981; margin: 30px 0;">
            ${data.trainingTitle}
          </div>
          
          <div class="training-details">
            <div class="details-grid">
              <div class="detail-item">
                <span class="detail-label">Training Date:</span>
                <span class="detail-value">${data.completionDate}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Certificate Number:</span>
                <span class="detail-value">${data.certificateNumber}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">OSHA Standard:</span>
                <span class="detail-value">${data.oshaStandard || 'N/A'}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Valid Until:</span>
                <span class="detail-value">${data.expirationDate}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Instructor:</span>
                <span class="detail-value">${data.instructorName}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Training Hours:</span>
                <span class="detail-value">${data.trainingHours || '8'} hours</span>
              </div>
            </div>
          </div>
          
          <div class="signatures">
            <div>
              <div class="signature-line">
                <strong>${data.instructorName}</strong><br>
                Certified Instructor
              </div>
            </div>
            <div>
              <div class="signature-line">
                <strong>SafetySync.AI Platform</strong><br>
                Digital Verification System
              </div>
            </div>
          </div>
          
          <div class="certificate-id">
            Certificate ID: ${data.certificateNumber} | Generated: ${new Date().toLocaleDateString()}
          </div>
        </div>
      </body>
      </html>
    `;
  }

  createWalletCardHTML(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: 'Arial', sans-serif; 
            margin: 0; 
            padding: 10px;
            background: white;
          }
          .wallet-card {
            width: 85.6mm;
            height: 54mm;
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            border-radius: 8px;
            padding: 8px;
            color: white;
            position: relative;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          }
          .card-header {
            font-size: 10px;
            font-weight: bold;
            margin-bottom: 4px;
          }
          .employee-name {
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 2px;
          }
          .employee-id {
            font-size: 8px;
            opacity: 0.9;
            margin-bottom: 6px;
          }
          .training-info {
            font-size: 8px;
            line-height: 1.2;
          }
          .expiry {
            position: absolute;
            bottom: 8px;
            right: 8px;
            font-size: 7px;
            background: rgba(255,255,255,0.2);
            padding: 2px 4px;
            border-radius: 3px;
          }
          .qr-code {
            position: absolute;
            top: 8px;
            right: 8px;
            width: 20px;
            height: 20px;
            background: white;
            border-radius: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 6px;
            color: #2563eb;
          }
        </style>
      </head>
      <body>
        <div class="wallet-card">
          <div class="card-header">SafetySync.AI Digital Certificate</div>
          <div class="employee-name">${data.employeeName}</div>
          <div class="employee-id">ID: ${data.employeeId}</div>
          <div class="training-info">
            <div><strong>${data.trainingTitle}</strong></div>
            <div>Completed: ${data.completionDate}</div>
            <div>Cert #: ${data.certificateNumber}</div>
          </div>
          <div class="qr-code">QR</div>
          <div class="expiry">Expires: ${data.expirationDate}</div>
        </div>
      </body>
      </html>
    `;
  }

  createTrainingReportHTML(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: 'Arial', sans-serif; 
            margin: 0; 
            padding: 40px;
            color: #1f2937;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 30px;
            margin-bottom: 40px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
          }
          .report-title {
            font-size: 24px;
            font-weight: bold;
            margin: 20px 0;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 40px 0;
          }
          .summary-card {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #2563eb;
            text-align: center;
          }
          .summary-number {
            font-size: 36px;
            font-weight: bold;
            color: #2563eb;
          }
          .summary-label {
            color: #6b7280;
            font-size: 14px;
            margin-top: 5px;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
          }
          .table th,
          .table td {
            border: 1px solid #d1d5db;
            padding: 12px;
            text-align: left;
          }
          .table th {
            background: #f3f4f6;
            font-weight: bold;
          }
          .table tr:nth-child(even) {
            background: #f9fafb;
          }
          .section {
            margin: 40px 0;
          }
          .section-title {
            font-size: 20px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #e5e7eb;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">SafetySync.AI</div>
          <div class="report-title">Training Compliance Report</div>
          <div style="color: #6b7280;">Generated on ${new Date().toLocaleDateString()}</div>
        </div>

        <div class="summary-grid">
          <div class="summary-card">
            <div class="summary-number">${data.totalEmployees || 0}</div>
            <div class="summary-label">Total Employees</div>
          </div>
          <div class="summary-card">
            <div class="summary-number">${data.compliantEmployees || 0}</div>
            <div class="summary-label">Compliant Employees</div>
          </div>
          <div class="summary-card">
            <div class="summary-number">${data.pendingTraining || 0}</div>
            <div class="summary-label">Pending Training</div>
          </div>
          <div class="summary-card">
            <div class="summary-number">${data.complianceScore || 0}%</div>
            <div class="summary-label">Compliance Score</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Employee Training Status</div>
          <table class="table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Employee ID</th>
                <th>Training Status</th>
                <th>Last Training Date</th>
                <th>Next Due Date</th>
              </tr>
            </thead>
            <tbody>
              ${(data.employees || []).map(emp => `
                <tr>
                  <td>${emp.name}</td>
                  <td>${emp.id}</td>
                  <td>${emp.status}</td>
                  <td>${emp.lastTraining || 'N/A'}</td>
                  <td>${emp.nextDue || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Training Programs Overview</div>
          <table class="table">
            <thead>
              <tr>
                <th>Training Program</th>
                <th>OSHA Standard</th>
                <th>Employees Trained</th>
                <th>Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              ${(data.trainingPrograms || []).map(program => `
                <tr>
                  <td>${program.name}</td>
                  <td>${program.standard}</td>
                  <td>${program.trained}</td>
                  <td>${program.completionRate}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new PDFGenerator();
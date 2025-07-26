// Platform Documentation Generator
// Generates a comprehensive PDF of all SafetySync.AI platform pages

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PlatformDocumentationGenerator {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.outputDir = './platform-screenshots';
    this.pages = [
      // Landing and Public Pages
      { name: 'Landing Page', url: '/', description: 'Hero section, features, and navigation' },
      { name: 'Contact Page', url: '/contact', description: 'Contact information and forms' },
      { name: 'Case Studies', url: '/case-studies', description: 'Customer success stories' },
      { name: 'Pricing', url: '/pricing', description: 'Pricing plans and features' },
      { name: 'HR Teams', url: '/hr', description: 'HR-specific features and benefits' },
      
      // Authentication Flow
      { name: 'Client Portal', url: '/client-portal', description: 'Login and authentication interface' },
      
      // Protected Dashboard
      { name: 'Standalone Dashboard', url: '/dashboard', description: 'Authentication-protected comprehensive dashboard' },
      
      // Main Workspace Views
      { name: 'Workspace - User Guide', url: '/workspace?tab=user-guide', description: 'Platform documentation and tutorials' },
      { name: 'Workspace - Workspace View', url: '/workspace?tab=unified-dashboard', description: 'Main compliance dashboard with widgets' },
      { name: 'Workspace - Company Profile', url: '/workspace?tab=company-profile', description: 'Company setup and configuration' },
      { name: 'Workspace - Employee Management', url: '/workspace?tab=employee-management', description: 'Employee data and compliance tracking' },
      { name: 'Workspace - Training Documents', url: '/workspace?tab=training-document-hub', description: 'Document upload and AI processing' },
      { name: 'Workspace - OSHA Compliance', url: '/workspace?tab=osha-compliance-manager', description: 'Compliance management and reporting' },
      
      // Additional Features
      { name: 'User Guide Standalone', url: '/user-guide', description: 'Comprehensive platform documentation' },
    ];
  }

  async init() {
    // Create output directory
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async generateScreenshots() {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });

      // Login credentials for protected pages
      const loginCredentials = {
        username: 'testuser',
        password: 'password'
      };

      // First, login to access protected pages
      console.log('Logging in to access protected pages...');
      await page.goto(`${this.baseUrl}/client-portal`);
      await page.waitForSelector('input[name="username"]', { timeout: 10000 });
      await page.type('input[name="username"]', loginCredentials.username);
      await page.type('input[name="password"]', loginCredentials.password);
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);

      const screenshots = [];

      for (const pageInfo of this.pages) {
        try {
          console.log(`Capturing: ${pageInfo.name}`);
          await page.goto(`${this.baseUrl}${pageInfo.url}`, { 
            waitUntil: 'networkidle0',
            timeout: 30000
          });
          
          // Wait for content to load
          await page.waitForTimeout(3000);

          // Take full page screenshot
          const filename = `${pageInfo.name.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
          const filepath = path.join(this.outputDir, filename);
          
          await page.screenshot({
            path: filepath,
            fullPage: true,
            type: 'png'
          });

          screenshots.push({
            ...pageInfo,
            filename,
            filepath
          });

          console.log(`✓ Captured: ${pageInfo.name}`);
        } catch (error) {
          console.error(`✗ Failed to capture ${pageInfo.name}:`, error.message);
        }
      }

      return screenshots;
    } finally {
      await browser.close();
    }
  }

  generateHTML(screenshots) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SafetySync.AI Platform Documentation</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background: #f8fafc;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            padding: 40px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5rem;
            font-weight: 700;
        }
        .header p {
            margin: 10px 0 0 0;
            font-size: 1.1rem;
            opacity: 0.9;
        }
        .toc {
            padding: 30px;
            background: #f1f5f9;
            border-bottom: 1px solid #e2e8f0;
        }
        .toc h2 {
            margin: 0 0 20px 0;
            color: #1e293b;
        }
        .toc ul {
            list-style: none;
            padding: 0;
            margin: 0;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 10px;
        }
        .toc li {
            padding: 8px 0;
        }
        .toc a {
            color: #3b82f6;
            text-decoration: none;
            font-weight: 500;
        }
        .toc a:hover {
            text-decoration: underline;
        }
        .page-section {
            padding: 40px;
            border-bottom: 1px solid #e2e8f0;
        }
        .page-section:last-child {
            border-bottom: none;
        }
        .page-title {
            color: #1e293b;
            font-size: 1.8rem;
            font-weight: 600;
            margin: 0 0 10px 0;
        }
        .page-description {
            color: #64748b;
            font-size: 1rem;
            margin: 0 0 20px 0;
        }
        .page-url {
            background: #f1f5f9;
            padding: 8px 12px;
            border-radius: 6px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.9rem;
            color: #475569;
            margin-bottom: 20px;
        }
        .screenshot {
            width: 100%;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .print-break {
            page-break-before: always;
        }
        @media print {
            body { background: white; }
            .container { box-shadow: none; }
            .page-section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>SafetySync.AI Platform Documentation</h1>
            <p>Comprehensive visual documentation of all platform pages and features</p>
            <p>Generated on ${new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
        </div>

        <div class="toc">
            <h2>Table of Contents</h2>
            <ul>
                ${screenshots.map(screenshot => `
                    <li><a href="#${screenshot.name.replace(/[^a-zA-Z0-9]/g, '_')}">${screenshot.name}</a></li>
                `).join('')}
            </ul>
        </div>

        ${screenshots.map((screenshot, index) => `
            <div class="page-section ${index > 0 ? 'print-break' : ''}" id="${screenshot.name.replace(/[^a-zA-Z0-9]/g, '_')}">
                <h2 class="page-title">${screenshot.name}</h2>
                <p class="page-description">${screenshot.description}</p>
                <div class="page-url">${screenshot.url}</div>
                <img src="${screenshot.filename}" alt="${screenshot.name}" class="screenshot" />
            </div>
        `).join('')}
    </div>
</body>
</html>`;

    return html;
  }

  async generatePDF() {
    console.log('Starting SafetySync.AI platform documentation generation...');
    
    await this.init();
    const screenshots = await this.generateScreenshots();
    
    if (screenshots.length === 0) {
      throw new Error('No screenshots were captured');
    }

    // Generate HTML documentation
    const html = this.generateHTML(screenshots);
    const htmlPath = path.join(this.outputDir, 'platform_documentation.html');
    fs.writeFileSync(htmlPath, html);

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      await page.goto(`file://${path.resolve(htmlPath)}`, { 
        waitUntil: 'networkidle0' 
      });

      const pdfPath = path.join(this.outputDir, 'SafetySync_AI_Platform_Documentation.pdf');
      await page.pdf({
        path: pdfPath,
        format: 'A4',
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm'
        },
        printBackground: true
      });

      console.log(`✓ PDF generated: ${pdfPath}`);
      console.log(`✓ HTML version: ${htmlPath}`);
      console.log(`✓ Screenshots directory: ${this.outputDir}`);
      
      return {
        pdfPath,
        htmlPath,
        screenshotsPath: this.outputDir,
        pageCount: screenshots.length
      };
    } finally {
      await browser.close();
    }
  }
}

export default PlatformDocumentationGenerator;

// If run directly  
if (import.meta.url === `file://${__filename}`) {
  const generator = new PlatformDocumentationGenerator();
  generator.generatePDF()
    .then(result => {
      console.log('\n🎉 Documentation generation complete!');
      console.log(`📄 PDF: ${result.pdfPath}`);
      console.log(`🌐 HTML: ${result.htmlPath}`);
      console.log(`📁 Screenshots: ${result.screenshotsPath}`);
      console.log(`📊 Pages captured: ${result.pageCount}`);
    })
    .catch(error => {
      console.error('❌ Generation failed:', error);
      process.exit(1);
    });
}
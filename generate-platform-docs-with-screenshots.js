// SafetySync.AI Platform Documentation Generator with Screenshots
// Creates comprehensive documentation with visual page captures

import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

class SafetySyncDocumentationWithScreenshots {
  constructor() {
    this.platformPages = [
      {
        section: "Landing & Public Pages",
        pages: [
          { name: "Landing Page", url: "/", description: "Hero section with SafetySync.AI branding, features showcase, call-to-action buttons for trial signup and demo requests" },
          { name: "Contact Page", url: "/contact", description: "Professional contact form, company information, support channels" },
          { name: "Case Studies", url: "/case-studies", description: "Customer success stories demonstrating OSHA compliance improvements" },
          { name: "Pricing Plans", url: "/pricing", description: "Subscription tiers, feature comparisons, ROI calculator" },
          { name: "HR Teams Page", url: "/hr", description: "HR-specific features including employee training management, compliance documentation, digital certificates" }
        ]
      },
      {
        section: "Authentication System", 
        pages: [
          { name: "Client Portal", url: "/client-portal", description: "Secure login interface with username/password authentication, remember me option, password strength validation" },
          { name: "Standalone Dashboard", url: "/dashboard", description: "Authentication-protected comprehensive dashboard with compliance tracking, AI clone detection, collaboration tools" }
        ]
      },
      {
        section: "Main Workspace Platform",
        pages: [
          { name: "User Guide", url: "/workspace?tab=user-guide", description: "Comprehensive platform documentation, feature explanations, tutorial content (First Tab)" },
          { name: "Workspace View", url: "/workspace?tab=unified-dashboard", description: "Main compliance dashboard with customizable widgets, employee statistics, safety alerts, training progress (Second Tab)" },
          { name: "Company Profile", url: "/workspace?tab=company-profile", description: "Company setup and configuration, industry selection, contact information management" },
          { name: "Employee Management", url: "/workspace?tab=employee-management", description: "Employee database with 200+ records, department analytics, bulk operations, CSV export, certificate tracking" }
        ]
      },
      {
        section: "Training & Compliance Features",
        pages: [
          { name: "Training Document Hub", url: "/workspace?tab=training-document-hub", description: "AI-powered document upload and processing, training record management, certificate generation" },
          { name: "OSHA Compliance Manager", url: "/workspace?tab=osha-compliance-manager", description: "Comprehensive OSHA compliance tracking, training matrix, certification monitoring, audit readiness" },
          { name: "Employee Insights", url: "/workspace?tab=employee-insights", description: "Analytics dashboard with department performance, hiring trends, compliance scores, AI-powered insights" }
        ]
      }
    ];

    this.baseUrl = 'http://localhost:5000';
    this.screenshotDir = 'platform-screenshots';
    this.outputDir = 'platform-documentation';
  }

  async initializeBrowser() {
    console.log('🚀 Launching browser for screenshot capture...');
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1920, height: 1080 });
  }

  async login() {
    console.log('🔐 Logging in to capture authenticated pages...');
    try {
      await this.page.goto(`${this.baseUrl}/client-portal`);
      await this.page.waitForSelector('input[name="username"]', { timeout: 10000 });
      
      await this.page.type('input[name="username"]', 'testuser');
      await this.page.type('input[name="password"]', 'password');
      
      await this.page.click('button[type="submit"]');
      await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
      
      console.log('✓ Successfully logged in');
    } catch (error) {
      console.log('⚠️ Login failed, will capture public pages only:', error.message);
    }
  }

  async captureScreenshot(url, filename) {
    try {
      console.log(`📸 Capturing screenshot for: ${url}`);
      await this.page.goto(`${this.baseUrl}${url}`, { waitUntil: 'networkidle0' });
      
      // Wait for content to load
      await this.page.waitForTimeout(3000);
      
      // Take full page screenshot
      const screenshotPath = path.join(this.screenshotDir, `${filename}.png`);
      await this.page.screenshot({
        path: screenshotPath,
        fullPage: true,
        quality: 90
      });
      
      console.log(`✓ Screenshot saved: ${screenshotPath}`);
      return `${filename}.png`;
    } catch (error) {
      console.log(`❌ Failed to capture ${url}:`, error.message);
      return null;
    }
  }

  async captureAllScreenshots() {
    console.log('📸 Starting screenshot capture process...');
    
    // Create screenshots directory
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }

    const screenshots = {};

    for (const section of this.platformPages) {
      console.log(`\n📂 Capturing ${section.section} screenshots...`);
      
      for (const page of section.pages) {
        const filename = page.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const screenshotFile = await this.captureScreenshot(page.url, filename);
        
        if (screenshotFile) {
          screenshots[page.name] = screenshotFile;
        }
      }
    }

    return screenshots;
  }

  generateHTMLWithScreenshots(screenshots) {
    const timestamp = new Date().toLocaleString();
    
    let sectionsHTML = '';
    
    for (const section of this.platformPages) {
      sectionsHTML += `
        <div class="documentation-section">
          <h2 class="section-title">${section.section}</h2>
          <div class="pages-grid">
      `;
      
      for (const page of section.pages) {
        const screenshot = screenshots[page.name];
        const screenshotHTML = screenshot ? 
          `<div class="page-screenshot">
             <img src="../platform-screenshots/${screenshot}" alt="${page.name} Screenshot" />
           </div>` : 
          `<div class="page-screenshot no-image">
             <p>Screenshot not available</p>
           </div>`;
        
        sectionsHTML += `
          <div class="page-card">
            <div class="page-header">
              <h3 class="page-title">${page.name}</h3>
              <span class="page-url">${page.url}</span>
            </div>
            ${screenshotHTML}
            <div class="page-description">
              <p>${page.description}</p>
            </div>
          </div>
        `;
      }
      
      sectionsHTML += `
          </div>
        </div>
      `;
    }

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SafetySync.AI Platform Documentation with Screenshots</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%);
            min-height: 100vh;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
        }

        .header {
            text-align: center;
            margin-bottom: 3rem;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 2rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .header h1 {
            color: white;
            font-size: 3rem;
            margin-bottom: 1rem;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .header .subtitle {
            color: #e0f2fe;
            font-size: 1.2rem;
            margin-bottom: 1rem;
        }

        .header .timestamp {
            color: #bbdefb;
            font-size: 0.9rem;
        }

        .overview {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 2rem;
            margin-bottom: 3rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .overview h2 {
            color: #1e40af;
            margin-bottom: 1rem;
            font-size: 1.8rem;
        }

        .overview p {
            margin-bottom: 1rem;
            color: #475569;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1rem;
            margin-top: 1.5rem;
        }

        .feature-item {
            background: rgba(37, 99, 235, 0.1);
            padding: 1rem;
            border-radius: 8px;
            border-left: 4px solid #2563eb;
        }

        .documentation-section {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .section-title {
            color: #1e40af;
            font-size: 2rem;
            margin-bottom: 2rem;
            padding-bottom: 0.5rem;
            border-bottom: 3px solid #3b82f6;
        }

        .pages-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
            gap: 2rem;
        }

        .page-card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .page-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }

        .page-header {
            background: linear-gradient(135deg, #1e40af, #3b82f6);
            color: white;
            padding: 1.5rem;
        }

        .page-title {
            font-size: 1.4rem;
            margin-bottom: 0.5rem;
        }

        .page-url {
            font-family: 'Courier New', monospace;
            background: rgba(255, 255, 255, 0.2);
            padding: 0.3rem 0.6rem;
            border-radius: 4px;
            font-size: 0.9rem;
        }

        .page-screenshot {
            position: relative;
            background: #f8fafc;
        }

        .page-screenshot img {
            width: 100%;
            height: 300px;
            object-fit: cover;
            object-position: top;
            border-bottom: 1px solid #e2e8f0;
        }

        .page-screenshot.no-image {
            height: 300px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #64748b;
            background: #f1f5f9;
            border-bottom: 1px solid #e2e8f0;
        }

        .page-description {
            padding: 1.5rem;
        }

        .page-description p {
            color: #475569;
            line-height: 1.6;
        }

        .tech-stack {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 2rem;
            margin-top: 2rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .tech-stack h2 {
            color: #1e40af;
            margin-bottom: 1.5rem;
            font-size: 1.8rem;
        }

        .tech-categories {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }

        .tech-category {
            background: white;
            border-radius: 10px;
            padding: 1.5rem;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .tech-category h3 {
            color: #3b82f6;
            margin-bottom: 1rem;
            font-size: 1.2rem;
        }

        .tech-category ul {
            list-style: none;
        }

        .tech-category li {
            padding: 0.5rem 0;
            padding-left: 1.5rem;
            position: relative;
            color: #475569;
        }

        .tech-category li::before {
            content: "→";
            position: absolute;
            left: 0;
            color: #3b82f6;
            font-weight: bold;
        }

        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .pages-grid {
                grid-template-columns: 1fr;
            }
            
            .tech-categories {
                grid-template-columns: 1fr;
            }
        }

        @media print {
            body {
                background: white;
            }
            
            .container {
                max-width: none;
                padding: 1rem;
            }
            
            .page-card {
                break-inside: avoid;
                margin-bottom: 1rem;
            }
            
            .documentation-section {
                break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>SafetySync.AI Platform Documentation</h1>
            <p class="subtitle">Comprehensive Visual Guide with Screenshots</p>
            <p class="timestamp">Generated on: ${timestamp}</p>
        </div>

        <div class="overview">
            <h2>Platform Overview</h2>
            <p>SafetySync.AI is an advanced AI-powered enterprise safety management platform that transforms workforce document processing and OSHA compliance through intelligent extraction, verification, and proactive risk management.</p>
            
            <h3>Key Features</h3>
            <div class="features-grid">
                <div class="feature-item">AI-Powered Document Processing with OpenAI GPT-4o integration</div>
                <div class="feature-item">Real-time Compliance Tracking and Monitoring</div>
                <div class="feature-item">Employee Certificate Management with QR Code verification</div>
                <div class="feature-item">Training Matrix and OSHA Standards Alignment</div>
                <div class="feature-item">Mobile-Responsive Design with Adaptive UI Components</div>
                <div class="feature-item">Advanced Security with Authentication and Rate Limiting</div>
                <div class="feature-item">Customizable Dashboard Widgets with Drag-and-Drop Layout</div>
                <div class="feature-item">Bulk Employee Operations and CSV Export</div>
                <div class="feature-item">Department Analytics and Performance Tracking</div>
                <div class="feature-item">AI-Powered Contextual Help System</div>
                <div class="feature-item">Professional Blue Gradient Theme Consistency</div>
                <div class="feature-item">Comprehensive Audit Trail and Reporting</div>
            </div>
        </div>

        ${sectionsHTML}

        <div class="tech-stack">
            <h2>Technical Architecture</h2>
            <div class="tech-categories">
                <div class="tech-category">
                    <h3>Frontend Technologies</h3>
                    <ul>
                        <li>React.js with TypeScript for type safety</li>
                        <li>Vite for fast development and optimized builds</li>
                        <li>Tailwind CSS with custom blue gradient theming</li>
                        <li>Shadcn/UI components for consistent design</li>
                        <li>Wouter for lightweight client-side routing</li>
                        <li>TanStack Query for server state management</li>
                        <li>React Hook Form with Zod validation</li>
                    </ul>
                </div>
                <div class="tech-category">
                    <h3>Backend Technologies</h3>
                    <ul>
                        <li>Node.js with Express.js framework</li>
                        <li>TypeScript for type safety across the stack</li>
                        <li>PostgreSQL with Drizzle ORM</li>
                        <li>Neon Database serverless PostgreSQL</li>
                        <li>JWT authentication with session management</li>
                        <li>Comprehensive API with RESTful endpoints</li>
                    </ul>
                </div>
                <div class="tech-category">
                    <h3>AI & Integration</h3>
                    <ul>
                        <li>OpenAI GPT-4o for document analysis</li>
                        <li>Google Cloud Document AI integration</li>
                        <li>Intelligent PDF processing with multiple extraction layers</li>
                        <li>AI-powered contextual help system</li>
                        <li>Smart compliance recommendations</li>
                    </ul>
                </div>
                <div class="tech-category">
                    <h3>Security & Performance</h3>
                    <ul>
                        <li>Helmet.js for security headers</li>
                        <li>Rate limiting and authentication protection</li>
                        <li>Input sanitization and XSS prevention</li>
                        <li>Secure session management</li>
                        <li>Comprehensive audit logging</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
  }

  async generate() {
    try {
      console.log('🎯 Starting SafetySync.AI Documentation Generation with Screenshots...\n');

      // Create output directory
      if (!fs.existsSync(this.outputDir)) {
        fs.mkdirSync(this.outputDir, { recursive: true });
      }

      // Initialize browser and login
      await this.initializeBrowser();
      await this.login();

      // Capture all screenshots
      const screenshots = await this.captureAllScreenshots();

      // Generate HTML documentation with screenshots
      const htmlContent = this.generateHTMLWithScreenshots(screenshots);
      
      // Write HTML file
      const htmlPath = path.join(this.outputDir, 'SafetySync_AI_Platform_Documentation_With_Screenshots.html');
      fs.writeFileSync(htmlPath, htmlContent, 'utf8');

      // Close browser
      await this.browser.close();

      console.log('\n🎉 SafetySync.AI Documentation with Screenshots Generated Successfully!');
      console.log(`📄 HTML Documentation: ${path.resolve(htmlPath)}`);
      console.log(`📸 Screenshots Directory: ${path.resolve(this.screenshotDir)}`);
      console.log('✓ Ready for download and printing with visual page captures');

    } catch (error) {
      console.error('❌ Documentation generation failed:', error);
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// Run the generator
const generator = new SafetySyncDocumentationWithScreenshots();
generator.generate();
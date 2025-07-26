// SafetySync.AI Platform Documentation Generator
// Creates comprehensive documentation without browser dependencies

import fs from 'fs';
import path from 'path';

class SafetySyncDocumentationGenerator {
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
      },
      {
        section: "Additional Resources",
        pages: [
          { name: "User Guide Standalone", url: "/user-guide", description: "Comprehensive platform documentation accessible outside the workspace" }
        ]
      }
    ];

    this.keyFeatures = [
      "AI-Powered Document Processing with OpenAI GPT-4o integration",
      "Real-time Compliance Tracking and Monitoring",
      "Employee Certificate Management with QR Code verification",
      "Training Matrix and OSHA Standards Alignment",
      "Mobile-Responsive Design with Adaptive UI Components",
      "Advanced Security with Authentication and Rate Limiting",
      "Customizable Dashboard Widgets with Drag-and-Drop Layout",
      "Bulk Employee Operations and CSV Export",
      "Department Analytics and Performance Tracking",
      "AI-Powered Contextual Help System",
      "Professional Blue Gradient Theme Consistency",
      "Comprehensive Audit Trail and Reporting"
    ];

    this.technicalStack = {
      "Frontend": [
        "React.js with TypeScript for type safety",
        "Vite for fast development and optimized builds",
        "Tailwind CSS with custom blue gradient theming",
        "Shadcn/UI components for consistent design",
        "Wouter for lightweight client-side routing",
        "TanStack Query for server state management",
        "React Hook Form with Zod validation",
        "Framer Motion for smooth animations"
      ],
      "Backend": [
        "Node.js with Express.js framework",
        "TypeScript for full-stack type safety",
        "PostgreSQL with Drizzle ORM",
        "Neon Database for serverless PostgreSQL",
        "JWT-based authentication with secure sessions",
        "Rate limiting and security middleware",
        "OpenAI API integration for AI processing",
        "Comprehensive error handling and logging"
      ],
      "Database Schema": [
        "Users table with authentication and profile data",
        "Employees table with department and compliance tracking",
        "Certificates table with expiration monitoring",
        "Training sessions and completion tracking",
        "Audit logs and security event tracking",
        "Lead capture system for trial and demo requests"
      ]
    };
  }

  generateHTMLDocumentation() {
    const timestamp = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SafetySync.AI Platform Documentation</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1e293b;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            min-height: 100vh;
            box-shadow: 0 0 50px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            padding: 60px 40px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
            opacity: 0.3;
        }
        
        .header-content {
            position: relative;
            z-index: 1;
        }
        
        .header h1 {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 15px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .header .subtitle {
            font-size: 1.3rem;
            opacity: 0.95;
            margin-bottom: 10px;
        }
        
        .header .timestamp {
            font-size: 1rem;
            opacity: 0.8;
            font-weight: 300;
        }
        
        .nav-section {
            background: #f8fafc;
            padding: 40px;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .nav-section h2 {
            color: #1e293b;
            font-size: 1.8rem;
            margin-bottom: 30px;
            text-align: center;
        }
        
        .toc-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        
        .toc-card {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            border-left: 4px solid #3b82f6;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .toc-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }
        
        .toc-card h3 {
            color: #1e293b;
            font-size: 1.1rem;
            margin-bottom: 10px;
        }
        
        .toc-card a {
            color: #3b82f6;
            text-decoration: none;
            font-weight: 500;
        }
        
        .toc-card a:hover {
            text-decoration: underline;
        }
        
        .section {
            padding: 50px 40px;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .section:last-child {
            border-bottom: none;
        }
        
        .section-title {
            color: #1e293b;
            font-size: 2.2rem;
            font-weight: 600;
            margin-bottom: 30px;
            text-align: center;
            position: relative;
        }
        
        .section-title::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 3px;
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            border-radius: 2px;
        }
        
        .page-group {
            margin-bottom: 40px;
        }
        
        .page-group-title {
            color: #475569;
            font-size: 1.4rem;
            font-weight: 600;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e2e8f0;
        }
        
        .page-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 25px;
        }
        
        .page-card {
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
            border: 1px solid #e2e8f0;
            transition: all 0.3s ease;
        }
        
        .page-card:hover {
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
            transform: translateY(-3px);
        }
        
        .page-card h4 {
            color: #1e293b;
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .page-url {
            background: #f1f5f9;
            color: #475569;
            padding: 6px 12px;
            border-radius: 6px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.85rem;
            margin-bottom: 12px;
            display: inline-block;
        }
        
        .page-description {
            color: #64748b;
            line-height: 1.6;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
        }
        
        .feature-item {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #10b981;
            transition: all 0.2s ease;
        }
        
        .feature-item:hover {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border-left-color: #3b82f6;
        }
        
        .feature-item::before {
            content: '✓';
            color: #10b981;
            font-weight: bold;
            margin-right: 10px;
        }
        
        .tech-section {
            background: #f8fafc;
        }
        
        .tech-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
        }
        
        .tech-category {
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .tech-category h4 {
            color: #1e293b;
            font-size: 1.3rem;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #3b82f6;
        }
        
        .tech-list {
            list-style: none;
        }
        
        .tech-list li {
            padding: 8px 0;
            color: #475569;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .tech-list li:last-child {
            border-bottom: none;
        }
        
        .tech-list li::before {
            content: '▸';
            color: #3b82f6;
            font-weight: bold;
            margin-right: 10px;
        }
        
        .footer {
            background: #1e293b;
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .print-break {
            page-break-before: always;
        }
        
        @media print {
            body { 
                background: white !important; 
            }
            .container { 
                box-shadow: none !important; 
                max-width: none !important;
            }
            .section { 
                page-break-inside: avoid; 
            }
            .page-card {
                break-inside: avoid;
            }
        }
        
        @media (max-width: 768px) {
            .header {
                padding: 40px 20px;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .section {
                padding: 30px 20px;
            }
            
            .nav-section {
                padding: 30px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="header-content">
                <h1>SafetySync.AI</h1>
                <p class="subtitle">Comprehensive Platform Documentation</p>
                <p class="timestamp">Generated on ${timestamp}</p>
            </div>
        </div>

        <div class="nav-section">
            <h2>Platform Overview</h2>
            <div class="toc-grid">
                ${this.platformPages.map(section => `
                    <div class="toc-card">
                        <h3>${section.section}</h3>
                        ${section.pages.map(page => `
                            <div><a href="#${page.name.replace(/[^a-zA-Z0-9]/g, '_')}">${page.name}</a></div>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Platform Pages & Features</h2>
            ${this.platformPages.map(section => `
                <div class="page-group">
                    <h3 class="page-group-title">${section.section}</h3>
                    <div class="page-grid">
                        ${section.pages.map(page => `
                            <div class="page-card" id="${page.name.replace(/[^a-zA-Z0-9]/g, '_')}">
                                <h4>${page.name}</h4>
                                <div class="page-url">${page.url}</div>
                                <p class="page-description">${page.description}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="section">
            <h2 class="section-title">Key Platform Features</h2>
            <div class="features-grid">
                ${this.keyFeatures.map(feature => `
                    <div class="feature-item">${feature}</div>
                `).join('')}
            </div>
        </div>

        <div class="section tech-section">
            <h2 class="section-title">Technical Architecture</h2>
            <div class="tech-grid">
                ${Object.entries(this.technicalStack).map(([category, items]) => `
                    <div class="tech-category">
                        <h4>${category}</h4>
                        <ul class="tech-list">
                            ${items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="footer">
            <p><strong>SafetySync.AI</strong> - AI-Powered OSHA Compliance Platform</p>
            <p>Comprehensive documentation generated on ${timestamp}</p>
        </div>
    </div>
</body>
</html>`;
  }

  generateMarkdownDocumentation() {
    const timestamp = new Date().toISOString().split('T')[0];

    return `# SafetySync.AI Platform Documentation

**Generated:** ${timestamp}

## Overview

SafetySync.AI is an advanced AI-powered enterprise safety management platform that transforms workforce document processing and OSHA compliance through intelligent extraction, verification, and proactive risk management.

## Platform Architecture

${this.platformPages.map(section => `
### ${section.section}

${section.pages.map(page => `
#### ${page.name}
- **URL:** \`${page.url}\`
- **Description:** ${page.description}
`).join('')}
`).join('')}

## Key Features

${this.keyFeatures.map(feature => `- ${feature}`).join('\n')}

## Technical Stack

${Object.entries(this.technicalStack).map(([category, items]) => `
### ${category}

${items.map(item => `- ${item}`).join('\n')}
`).join('')}

## Navigation Structure

The platform follows a clean, intuitive navigation structure:

1. **User Guide** (First Tab) - Primary entry point for documentation
2. **Workspace View** (Second Tab) - Main compliance dashboard
3. **Company Profile** - Setup and configuration
4. **Employee Management** - Comprehensive employee tracking
5. **Training Documents** - AI-powered document processing
6. **OSHA Compliance** - Compliance management and reporting

## Security Features

- JWT-based authentication with secure sessions
- Rate limiting and brute force protection
- Input sanitization and XSS prevention
- Comprehensive audit logging
- Role-based access control (admin/user tiers)

## Color Theme

Consistent blue gradient theme throughout the platform:
- Primary: \`from-blue-600 via-blue-500 to-blue-400\`
- Glass morphism cards: \`bg-black/20 backdrop-blur-sm\`
- Text: White on colored backgrounds, dark on light backgrounds

---

*This documentation provides a comprehensive overview of the SafetySync.AI platform structure, features, and technical implementation.*`;
  }

  async generate() {
    const outputDir = './platform-documentation';
    
    // Create output directory
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate HTML documentation
    const html = this.generateHTMLDocumentation();
    const htmlPath = path.join(outputDir, 'SafetySync_AI_Platform_Documentation.html');
    fs.writeFileSync(htmlPath, html, 'utf8');

    // Generate Markdown documentation
    const markdown = this.generateMarkdownDocumentation();
    const markdownPath = path.join(outputDir, 'SafetySync_AI_Platform_Documentation.md');
    fs.writeFileSync(markdownPath, markdown, 'utf8');

    return {
      htmlPath: path.resolve(htmlPath),
      markdownPath: path.resolve(markdownPath),
      outputDir: path.resolve(outputDir)
    };
  }
}

// Run the generator
const generator = new SafetySyncDocumentationGenerator();
generator.generate()
  .then(result => {
    console.log('\n🎉 SafetySync.AI Documentation Generated Successfully!');
    console.log(`📄 HTML Documentation: ${result.htmlPath}`);
    console.log(`📝 Markdown Documentation: ${result.markdownPath}`);
    console.log(`📁 Output Directory: ${result.outputDir}`);
    console.log('\n✓ Ready for download and printing');
  })
  .catch(error => {
    console.error('❌ Documentation generation failed:', error);
    process.exit(1);
  });
// SafetySync.AI Platform Documentation Generator with Existing Screenshots
// Creates comprehensive documentation using existing screenshot assets

import fs from 'fs';
import path from 'path';

class SafetySyncDocumentationWithExistingScreenshots {
  constructor() {
    // Map of page sections with their corresponding screenshots
    this.platformPages = [
      {
        section: "Landing & Public Pages",
        pages: [
          { 
            name: "Landing Page", 
            url: "/", 
            description: "Hero section with SafetySync.AI branding, features showcase, call-to-action buttons for trial signup and demo requests",
            screenshot: "Screenshot 2025-07-25 221420_1753500157476.png" // Recent landing page
          },
          { 
            name: "Contact Page", 
            url: "/contact", 
            description: "Professional contact form, company information, support channels",
            screenshot: "Screenshot 2025-07-15 225304_1752637993217.png"
          },
          { 
            name: "Case Studies", 
            url: "/case-studies", 
            description: "Customer success stories demonstrating OSHA compliance improvements",
            screenshot: "Screenshot 2025-07-15 223137_1752636729131.png"
          },
          { 
            name: "Pricing Plans", 
            url: "/pricing", 
            description: "Subscription tiers, feature comparisons, ROI calculator",
            screenshot: "Screenshot 2025-07-15 220230_1752634966423.png"
          },
          { 
            name: "HR Teams Page", 
            url: "/hr", 
            description: "HR-specific features including employee training management, compliance documentation, digital certificates",
            screenshot: "Screenshot 2025-07-15 213658_1752633429123.png"
          }
        ]
      },
      {
        section: "Authentication System", 
        pages: [
          { 
            name: "Client Portal", 
            url: "/client-portal", 
            description: "Secure login interface with username/password authentication, remember me option, password strength validation",
            screenshot: "Screenshot 2025-07-16 085106_1752673957529.png"
          },
          { 
            name: "Standalone Dashboard", 
            url: "/dashboard", 
            description: "Authentication-protected comprehensive dashboard with compliance tracking, AI clone detection, collaboration tools",
            screenshot: "Screenshot 2025-07-20 225635_1753070214600.png"
          }
        ]
      },
      {
        section: "Main Workspace Platform",
        pages: [
          { 
            name: "User Guide", 
            url: "/workspace?tab=user-guide", 
            description: "Comprehensive platform documentation, feature explanations, tutorial content (First Tab)",
            screenshot: "Screenshot 2025-07-25 223743_1753501222029.png" // Recent workspace screenshot
          },
          { 
            name: "Workspace View", 
            url: "/workspace?tab=unified-dashboard", 
            description: "Main compliance dashboard with customizable widgets, employee statistics, safety alerts, training progress (Second Tab)",
            screenshot: "Screenshot 2025-07-16 222058_1752722476226.png"
          },
          { 
            name: "Company Profile", 
            url: "/workspace?tab=company-profile", 
            description: "Company setup and configuration, industry selection, contact information management",
            screenshot: "Screenshot 2025-07-15 201426_1752628477015.png"
          },
          { 
            name: "Employee Management", 
            url: "/workspace?tab=employee-management", 
            description: "Employee database with 200+ records, department analytics, bulk operations, CSV export, certificate tracking",
            screenshot: "Screenshot 2025-07-15 200707_1752628193165.png"
          }
        ]
      },
      {
        section: "Training & Compliance Features",
        pages: [
          { 
            name: "Training Document Hub", 
            url: "/workspace?tab=training-document-hub", 
            description: "AI-powered document upload and processing, training record management, certificate generation",
            screenshot: "Screenshot 2025-07-13 182107_1752449011646.png"
          },
          { 
            name: "OSHA Compliance Manager", 
            url: "/workspace?tab=osha-compliance-manager", 
            description: "Comprehensive OSHA compliance tracking, training matrix, certification monitoring, audit readiness",
            screenshot: "Screenshot 2025-07-09 172958_1752100298849.png"
          },
          { 
            name: "Employee Insights", 
            url: "/workspace?tab=employee-insights", 
            description: "Analytics dashboard with department performance, hiring trends, compliance scores, AI-powered insights",
            screenshot: "Screenshot 2025-07-19 145515_1752954930185.png"
          }
        ]
      },
      {
        section: "Advanced Features",
        pages: [
          { 
            name: "AI Document Processing", 
            url: "/workspace?tab=ai-document-processor", 
            description: "Revolutionary AI-powered document extraction and processing with OpenAI GPT-4o integration",
            screenshot: "Screenshot 2025-07-09 190948_1752106504115.png"
          },
          { 
            name: "Training Session Generator", 
            url: "/workspace?tab=instructor-sign-in-generator", 
            description: "Instructor sign-in sheet generation with customizable training classes and employee management",
            screenshot: "Screenshot 2025-07-11 221026_1752289838464.png"
          }
        ]
      }
    ];

    this.outputDir = 'platform-documentation';
    this.assetsDir = 'attached_assets';
  }

  copyScreenshotsToDocumentation() {
    const screenshotsDir = path.join(this.outputDir, 'screenshots');
    
    // Create screenshots directory in documentation folder
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    const copiedScreenshots = {};

    for (const section of this.platformPages) {
      for (const page of section.pages) {
        if (page.screenshot) {
          const sourcePath = path.join(this.assetsDir, page.screenshot);
          const destPath = path.join(screenshotsDir, page.screenshot);
          
          try {
            if (fs.existsSync(sourcePath)) {
              fs.copyFileSync(sourcePath, destPath);
              copiedScreenshots[page.name] = page.screenshot;
              console.log(`✓ Copied screenshot: ${page.screenshot}`);
            } else {
              console.log(`⚠️ Screenshot not found: ${page.screenshot}`);
            }
          } catch (error) {
            console.log(`❌ Failed to copy screenshot ${page.screenshot}:`, error.message);
          }
        }
      }
    }

    return copiedScreenshots;
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
        const hasScreenshot = screenshots[page.name];
        const screenshotHTML = hasScreenshot ? 
          `<div class="page-screenshot">
             <img src="screenshots/${page.screenshot}" alt="${page.name} Screenshot" loading="lazy" />
             <div class="screenshot-overlay">
               <span class="view-full">Click to view full size</span>
             </div>
           </div>` : 
          `<div class="page-screenshot no-image">
             <div class="no-image-content">
               <svg class="no-image-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
               </svg>
               <p>Screenshot Coming Soon</p>
             </div>
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
            cursor: pointer;
        }

        .page-screenshot img {
            width: 100%;
            height: 350px;
            object-fit: cover;
            object-position: top;
            border-bottom: 1px solid #e2e8f0;
            transition: transform 0.3s ease;
        }

        .page-screenshot:hover img {
            transform: scale(1.02);
        }

        .screenshot-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .page-screenshot:hover .screenshot-overlay {
            opacity: 1;
        }

        .view-full {
            color: white;
            background: rgba(37, 99, 235, 0.9);
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-size: 0.9rem;
            font-weight: 500;
        }

        .page-screenshot.no-image {
            height: 350px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
            border-bottom: 1px solid #e2e8f0;
        }

        .no-image-content {
            text-align: center;
            color: #64748b;
        }

        .no-image-icon {
            width: 48px;
            height: 48px;
            margin: 0 auto 0.5rem;
            opacity: 0.5;
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

        .download-section {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 2rem;
            margin-top: 2rem;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .download-section h2 {
            color: #1e40af;
            margin-bottom: 1rem;
        }

        .download-section p {
            color: #475569;
            margin-bottom: 1.5rem;
        }

        .download-button {
            display: inline-block;
            background: linear-gradient(135deg, #2563eb, #3b82f6);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .download-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(37, 99, 235, 0.4);
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

            .page-screenshot img {
                height: 250px;
            }

            .page-screenshot.no-image {
                height: 250px;
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

            .screenshot-overlay,
            .download-section {
                display: none;
            }
        }

        /* Modal for full-size screenshots */
        .screenshot-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 1000;
            padding: 2rem;
        }

        .screenshot-modal.active {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .screenshot-modal img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            border-radius: 8px;
        }

        .close-modal {
            position: absolute;
            top: 1rem;
            right: 1rem;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            background: rgba(0, 0, 0, 0.5);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
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

        <div class="download-section">
            <h2>Documentation Access</h2>
            <p>This comprehensive documentation provides visual insight into all SafetySync.AI platform features and capabilities.</p>
            <a href="/download-docs" class="download-button">Access Additional Documentation Formats</a>
        </div>
    </div>

    <!-- Screenshot Modal -->
    <div class="screenshot-modal" id="screenshotModal">
        <span class="close-modal" onclick="closeModal()">&times;</span>
        <img id="modalImage" src="" alt="Full size screenshot">
    </div>

    <script>
        // Add click handlers for screenshots
        document.querySelectorAll('.page-screenshot img').forEach(img => {
            img.addEventListener('click', function() {
                const modal = document.getElementById('screenshotModal');
                const modalImg = document.getElementById('modalImage');
                modalImg.src = this.src;
                modal.classList.add('active');
            });
        });

        function closeModal() {
            document.getElementById('screenshotModal').classList.remove('active');
        }

        // Close modal on outside click
        document.getElementById('screenshotModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });

        // Close modal on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    </script>
</body>
</html>`;
  }

  async generate() {
    try {
      console.log('🎯 Starting SafetySync.AI Documentation Generation with Existing Screenshots...\n');

      // Create output directory
      if (!fs.existsSync(this.outputDir)) {
        fs.mkdirSync(this.outputDir, { recursive: true });
      }

      // Copy existing screenshots to documentation folder
      console.log('📸 Copying existing screenshots...');
      const copiedScreenshots = this.copyScreenshotsToDocumentation();

      // Generate HTML documentation with screenshots
      console.log('📄 Generating HTML documentation...');
      const htmlContent = this.generateHTMLWithScreenshots(copiedScreenshots);
      
      // Write HTML file
      const htmlPath = path.join(this.outputDir, 'SafetySync_AI_Platform_Documentation_With_Screenshots.html');
      fs.writeFileSync(htmlPath, htmlContent, 'utf8');

      console.log('\n🎉 SafetySync.AI Documentation with Screenshots Generated Successfully!');
      console.log(`📄 HTML Documentation: ${path.resolve(htmlPath)}`);
      console.log(`📸 Screenshots included: ${Object.keys(copiedScreenshots).length} pages`);
      console.log('✓ Ready for download and printing with visual page captures');
      console.log('✓ Features clickable screenshots for full-size viewing');
      console.log('✓ Print-optimized formatting with high-quality images');

    } catch (error) {
      console.error('❌ Documentation generation failed:', error);
    }
  }
}

// Run the generator
const generator = new SafetySyncDocumentationWithExistingScreenshots();
generator.generate();
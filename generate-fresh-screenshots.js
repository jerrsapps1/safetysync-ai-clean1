import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

class FreshScreenshotGenerator {
  constructor() {
    this.browser = null;
    this.page = null;
    this.baseUrl = 'http://localhost:5000';
    this.screenshotDir = './platform-screenshots';
    this.credentials = {
      username: 'testuser',
      password: 'password'
    };
  }

  async initialize() {
    console.log('🎯 Starting Fresh Screenshot Generation...');
    
    // Create screenshot directory
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }

    // Launch browser
    this.browser = await puppeteer.launch({
      headless: true,
      executablePath: '/nix/store/zi4f80l169xlmivz8vja8wlphq74qqk0-chromium-125.0.6422.141/bin/chromium',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--window-size=1920,1080'
      ]
    });

    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1920, height: 1080 });
  }

  async authenticateUser() {
    console.log('🔐 Authenticating user...');
    
    try {
      // Go to client portal
      await this.page.goto(`${this.baseUrl}/client-portal`, { waitUntil: 'networkidle0' });
      
      // Look for login form - try multiple selectors
      let usernameField = null;
      let passwordField = null;
      
      // Try to find username field with various selectors
      const usernameSelectors = [
        'input[name="username"]',
        'input[placeholder*="username" i]',
        'input[type="text"]',
        '#username',
        '.username-input'
      ];
      
      for (const selector of usernameSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 2000 });
          usernameField = selector;
          break;
        } catch (e) {
          continue;
        }
      }
      
      if (usernameField) {
        await this.page.type(usernameField, this.credentials.username);
        console.log('✓ Username entered');
      }
      
      // Find password field
      const passwordSelectors = [
        'input[name="password"]',
        'input[type="password"]',
        '#password'
      ];
      
      for (const selector of passwordSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 2000 });
          passwordField = selector;
          break;
        } catch (e) {
          continue;
        }
      }
      
      if (passwordField) {
        await this.page.type(passwordField, this.credentials.password);
        console.log('✓ Password entered');
      }
      
      // Try to find and click login button
      const buttonSelectors = [
        'button[type="submit"]',
        'button:contains("Sign In")',
        'button:contains("Login")',
        '.login-button',
        '#login-button'
      ];
      
      let loginButton = null;
      for (const selector of buttonSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 2000 });
          loginButton = selector;
          break;
        } catch (e) {
          continue;
        }
      }
      
      if (loginButton) {
        await this.page.click(loginButton);
        console.log('✓ Login button clicked');
        
        // Wait for navigation or workspace page
        await Promise.race([
          this.page.waitForNavigation({ waitUntil: 'networkidle0' }),
          this.page.waitForSelector('.workspace-content', { timeout: 5000 }),
          new Promise(resolve => setTimeout(resolve, 3000))
        ]);
        
        console.log('✅ Authentication successful');
        return true;
      }
      
      console.log('⚠️ Could not find login elements');
      return false;
    } catch (error) {
      console.log(`⚠️ Authentication failed: ${error.message}`);
      return false;
    }
  }

  async captureScreenshot(url, filename, waitForSelector = null) {
    try {
      console.log(`📸 Capturing: ${filename}`);
      
      await this.page.goto(`${this.baseUrl}${url}`, { waitUntil: 'networkidle0' });
      
      if (waitForSelector) {
        await this.page.waitForSelector(waitForSelector, { timeout: 10000 });
      }
      
      // Wait for additional loading
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Take screenshot (PNG doesn't support quality parameter)
      await this.page.screenshot({
        path: path.join(this.screenshotDir, filename),
        fullPage: true
      });
      
      console.log(`✅ Captured: ${filename}`);
      return true;
    } catch (error) {
      console.log(`❌ Failed to capture ${filename}: ${error.message}`);
      return false;
    }
  }

  async generateAllScreenshots() {
    const screenshots = [];
    let authenticated = false;

    await this.initialize();

    // Try to authenticate
    authenticated = await this.authenticateUser();

    // Public pages (no authentication required)
    const publicPages = [
      { url: '/', filename: 'landing-page.png', name: 'Landing Page' },
      { url: '/contact', filename: 'contact-page.png', name: 'Contact Page' },
      { url: '/case-studies', filename: 'case-studies.png', name: 'Case Studies' },
      { url: '/pricing', filename: 'pricing-plans.png', name: 'Pricing Plans' },
      { url: '/hr', filename: 'hr-teams.png', name: 'HR Teams Page' },
      { url: '/testimonials', filename: 'testimonials.png', name: 'Testimonials' },
      { url: '/client-portal', filename: 'client-portal.png', name: 'Client Portal' },
      { url: '/download-docs', filename: 'download-docs.png', name: 'Download Documentation' }
    ];

    console.log('\n📁 Capturing Public Pages...');
    for (const page of publicPages) {
      const success = await this.captureScreenshot(page.url, page.filename);
      if (success) {
        screenshots.push({
          filename: page.filename,
          name: page.name,
          section: 'Public Pages'
        });
      }
    }

    // Authenticated pages (if login successful)
    if (authenticated) {
      const authenticatedPages = [
        { url: '/workspace', filename: 'workspace-dashboard.png', name: 'Workspace Dashboard', waitFor: '.workspace-content' },
        { url: '/workspace?tab=user-guide', filename: 'user-guide.png', name: 'User Guide', waitFor: '.workspace-content' },
        { url: '/workspace?tab=company-profile', filename: 'company-profile.png', name: 'Company Profile', waitFor: '.workspace-content' },
        { url: '/workspace?tab=employee-management', filename: 'employee-management.png', name: 'Employee Management', waitFor: '.workspace-content' },
        { url: '/workspace?tab=training-documents', filename: 'training-documents.png', name: 'Training Documents', waitFor: '.workspace-content' },
        { url: '/workspace?tab=osha-compliance', filename: 'osha-compliance.png', name: 'OSHA Compliance Manager', waitFor: '.workspace-content' },
        { url: '/workspace?tab=ai-document-processing', filename: 'ai-document-processing.png', name: 'AI Document Processing', waitFor: '.workspace-content' },
        { url: '/workspace?tab=employee-insights', filename: 'employee-insights.png', name: 'Employee Insights', waitFor: '.workspace-content' }
      ];

      console.log('\n📁 Capturing Authenticated Pages...');
      for (const page of authenticatedPages) {
        const success = await this.captureScreenshot(page.url, page.filename, page.waitFor);
        if (success) {
          screenshots.push({
            filename: page.filename,
            name: page.name,
            section: 'Platform Workspace'
          });
        }
      }
    }

    await this.browser.close();

    console.log(`\n🎉 Screenshot generation complete!`);
    console.log(`📸 Total screenshots captured: ${screenshots.length}`);
    console.log(`📁 Screenshots saved to: ${this.screenshotDir}`);

    return screenshots;
  }

  async generateDocumentationWithFreshScreenshots() {
    const screenshots = await this.generateAllScreenshots();
    
    // Generate HTML documentation with fresh screenshots
    const htmlContent = this.generateHTMLDocumentation(screenshots);
    
    const outputFile = './platform-documentation/SafetySync_AI_Fresh_Screenshots_Documentation.html';
    fs.writeFileSync(outputFile, htmlContent);
    
    console.log(`\n📄 Fresh Screenshot Documentation Generated!`);
    console.log(`📄 File: ${outputFile}`);
    
    return outputFile;
  }

  generateHTMLDocumentation(screenshots) {
    const groupedScreenshots = screenshots.reduce((acc, screenshot) => {
      if (!acc[screenshot.section]) {
        acc[screenshot.section] = [];
      }
      acc[screenshot.section].push(screenshot);
      return acc;
    }, {});

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SafetySync.AI Platform Documentation - Fresh Screenshots</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(to bottom right, #2563eb, #3b82f6, #60a5fa);
            min-height: 100vh;
            margin: 0;
            padding: 20px;
            color: white;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding: 30px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 16px;
            backdrop-filter: blur(10px);
        }
        .section {
            margin-bottom: 40px;
            background: rgba(0, 0, 0, 0.1);
            border-radius: 16px;
            padding: 30px;
            backdrop-filter: blur(10px);
        }
        .section h2 {
            color: white;
            border-bottom: 2px solid #60a5fa;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .screenshot-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        .screenshot-item {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
        }
        .screenshot-item h3 {
            color: white;
            margin-bottom: 15px;
            font-size: 16px;
        }
        .screenshot-item img {
            width: 100%;
            height: auto;
            border-radius: 8px;
            border: 2px solid #60a5fa;
            cursor: pointer;
            transition: transform 0.3s ease;
        }
        .screenshot-item img:hover {
            transform: scale(1.05);
        }
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
        }
        .modal-content {
            margin: auto;
            display: block;
            width: 90%;
            max-width: 1200px;
            max-height: 90%;
            margin-top: 2%;
        }
        .close {
            position: absolute;
            top: 15px;
            right: 35px;
            color: #f1f1f1;
            font-size: 40px;
            font-weight: bold;
            cursor: pointer;
        }
        @media print {
            body { background: white; color: black; }
            .section { background: #f8f9fa; border: 1px solid #dee2e6; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>SafetySync.AI Platform Documentation</h1>
            <p>Fresh Screenshots - Captured ${new Date().toLocaleDateString()}</p>
            <p>Complete visual guide with current platform screenshots</p>
        </div>

        ${Object.entries(groupedScreenshots).map(([section, items]) => `
        <div class="section">
            <h2>${section}</h2>
            <div class="screenshot-grid">
                ${items.map(item => `
                <div class="screenshot-item">
                    <h3>${item.name}</h3>
                    <img src="../platform-screenshots/${item.filename}" 
                         alt="${item.name}" 
                         onclick="openModal('../platform-screenshots/${item.filename}', '${item.name}')">
                </div>
                `).join('')}
            </div>
        </div>
        `).join('')}
    </div>

    <!-- Modal for full-size images -->
    <div id="imageModal" class="modal">
        <span class="close" onclick="closeModal()">&times;</span>
        <img class="modal-content" id="modalImage">
    </div>

    <script>
        function openModal(src, alt) {
            document.getElementById('imageModal').style.display = 'block';
            document.getElementById('modalImage').src = src;
            document.getElementById('modalImage').alt = alt;
        }

        function closeModal() {
            document.getElementById('imageModal').style.display = 'none';
        }

        // Close modal when clicking outside the image
        window.onclick = function(event) {
            const modal = document.getElementById('imageModal');
            if (event.target === modal) {
                closeModal();
            }
        }
    </script>
</body>
</html>`;
  }
}

// Run the generator
async function main() {
  const generator = new FreshScreenshotGenerator();
  await generator.generateDocumentationWithFreshScreenshots();
}

main().catch(console.error);
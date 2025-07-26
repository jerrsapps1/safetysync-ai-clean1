const axios = require('axios');
require('dotenv').config();

// Simple email testing utility
class EmailTester {
  constructor() {
    this.apiKey = process.env.BREVO_API_KEY;
    this.baseUrl = 'https://api.brevo.com/v3';
  }

  async checkApiKey() {
    if (!this.apiKey) {
      console.log('🔴 BREVO_API_KEY not found');
      console.log('Add your Brevo API key to environment variables');
      return false;
    }

    console.log('🟢 BREVO_API_KEY found');
    console.log('Key length:', this.apiKey.length);
    return true;
  }

  async testConnection() {
    try {
      const response = await axios.get(`${this.baseUrl}/account`, {
        headers: { 'api-key': this.apiKey }
      });
      
      console.log('✅ Brevo connection successful');
      console.log('Account:', response.data.email);
      return true;
    } catch (error) {
      console.log('❌ Brevo connection failed');
      console.log(error.response?.data?.message || error.message);
      return false;
    }
  }

  async sendWelcomeEmail(testEmail = 'test@example.com') {
    const emailData = {
      sender: { name: 'SafetySync.AI', email: 'noreply@safetysync.ai' },
      to: [{ email: testEmail, name: 'Test User' }],
      subject: 'Welcome to SafetySync.AI - Test Email',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 40px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to SafetySync.AI</h1>
          </div>
          <div style="padding: 40px; background: #f8fafc;">
            <h2 style="color: #1e293b;">Hello Test User!</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              This is a test email from your SafetySync.AI platform. The email system is working correctly!
            </p>
            <div style="background: white; padding: 30px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #10b981;">
              <h3 style="color: #1e293b; margin-top: 0;">System Status:</h3>
              <ul style="color: #475569; line-height: 1.8;">
                <li>✅ Brevo API integration active</li>
                <li>✅ Email templates loaded</li>
                <li>✅ Professional formatting applied</li>
                <li>✅ SafetySync.AI branding active</li>
              </ul>
            </div>
            <div style="text-align: center; margin: 40px 0;">
              <a href="https://safetysync.ai/workspace" 
                 style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Access Workspace
              </a>
            </div>
          </div>
        </div>
      `
    };

    try {
      const response = await axios.post(`${this.baseUrl}/smtp/email`, emailData, {
        headers: {
          'api-key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Welcome email sent successfully');
      console.log('Message ID:', response.data.messageId);
      return true;
    } catch (error) {
      console.log('❌ Failed to send welcome email');
      console.log(error.response?.data || error.message);
      return false;
    }
  }

  async runFullTest() {
    console.log('🚀 Starting email system test...\n');
    
    const hasKey = await this.checkApiKey();
    if (!hasKey) return;
    
    const connected = await this.testConnection();
    if (!connected) return;
    
    console.log('\n📧 Testing email sending...');
    await this.sendWelcomeEmail();
    
    console.log('\n✨ Email system test complete!');
  }
}

// Export for use in other scripts
module.exports = EmailTester;

// Run test if called directly
if (require.main === module) {
  const tester = new EmailTester();
  tester.runFullTest();
}
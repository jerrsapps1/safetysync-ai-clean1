const axios = require('axios');
require('dotenv').config();

async function testBrevoEmail() {
  const apiKey = process.env.BREVO_API_KEY;
  
  if (!apiKey) {
    console.log('❌ BREVO_API_KEY not found in environment variables');
    console.log('Please add your Brevo API key to the secrets management system');
    return;
  }

  console.log('🔍 Testing Brevo API connection...');
  console.log('API Key length:', apiKey.length);
  console.log('API Key prefix:', apiKey.substring(0, 10) + '...');

  try {
    // Test API connection
    const response = await axios.get(
      'https://api.brevo.com/v3/account',
      {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Brevo API connection successful!');
    console.log('Account info:', {
      email: response.data.email,
      firstName: response.data.firstName,
      lastName: response.data.lastName,
      companyName: response.data.companyName
    });

  } catch (error) {
    console.log('❌ Brevo API connection failed:');
    console.log('Error:', error.response?.data || error.message);
  }
}

async function sendTestSummary() {
  const apiKey = process.env.BREVO_API_KEY;
  
  if (!apiKey) {
    console.log('❌ Cannot send test email - BREVO_API_KEY not configured');
    return;
  }

  const testSummary = `
Weekly SafetySync.AI Summary
============================
Total New Signups: 15
Trial Conversions: 8
Active Users: 142
Certificates Generated: 89
Popular Training: Fall Protection (29 CFR 1926.95)

Top Features Used:
- AI Document Processing: 67%
- Certificate Generation: 89%
- Employee Management: 78%
- Compliance Reporting: 45%

System Status: All systems operational
`;

  try {
    console.log('📧 Sending test summary email...');
    
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: { name: 'SafetySync AI', email: 'admin@safetysync.ai' },
        to: [{ email: 'admin@safetysync.ai', name: 'Admin' }],
        subject: '📊 Weekly Signup Summary - Test',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">SafetySync.AI Weekly Summary</h1>
            </div>
            <div style="padding: 20px; background: #f8fafc;">
              <pre style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #10b981;">${testSummary}</pre>
            </div>
          </div>
        `
      },
      {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Test summary email sent successfully!');
    console.log('Message ID:', response.data.messageId);

  } catch (error) {
    console.log('❌ Failed to send test email:');
    console.log('Error:', error.response?.data || error.message);
  }
}

// Run tests
(async () => {
  console.log('🚀 Starting Brevo API tests...\n');
  
  await testBrevoEmail();
  console.log('\n' + '='.repeat(50) + '\n');
  await sendTestSummary();
  
  console.log('\n✨ Test complete!');
})();
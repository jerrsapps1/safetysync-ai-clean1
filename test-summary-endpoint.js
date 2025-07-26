import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function testSummaryEndpoint() {
  const baseUrl = 'http://localhost:5000';
  
  const testSummary = `Weekly SafetySync.AI Summary - Test
====================================
Date: ${new Date().toLocaleDateString()}

📊 TEST METRICS
- New Signups: 15
- Trial Conversions: 8  
- Active Users: 142
- Certificates Generated: 89

🎓 TRAINING ACTIVITY
- Popular Training: Fall Protection
- Documents Processed: 67
- AI Extractions: 45

💰 REVENUE
- Certificate Sales: $475.20
- Subscription Revenue: $1,250.00

🔧 SYSTEM STATUS
- All systems operational
- Email service: Active
- Database: Connected

This is a test of the /api/send-summary endpoint.`;

  try {
    console.log('🚀 Testing /api/send-summary endpoint...');
    console.log('Base URL:', baseUrl);
    console.log('Summary length:', testSummary.length);
    
    const response = await axios.post(`${baseUrl}/api/send-summary`, {
      summary: testSummary
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ Success!');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    if (response.data.messageId) {
      console.log('📧 Email sent with Message ID:', response.data.messageId);
    }

  } catch (error) {
    console.log('❌ Test failed:');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error data:', error.response.data);
      
      if (error.response.status === 400) {
        console.log('💡 Tip: Make sure BREVO_API_KEY is configured in your environment');
      }
    } else if (error.code === 'ECONNREFUSED') {
      console.log('💡 Tip: Make sure the server is running on port 5000');
      console.log('Run: npm run dev');
    } else {
      console.log('Error:', error.message);
    }
  }
}

// Test the endpoint
testSummaryEndpoint();
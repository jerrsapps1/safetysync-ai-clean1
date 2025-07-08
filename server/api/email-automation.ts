// Email automation API endpoints
import { Router } from "express";
import { emailAutomation } from "../email-automation";

const router = Router();

// Get email queue status
router.get('/status', async (req, res) => {
  try {
    const status = emailAutomation.getQueueStatus();
    res.json({
      success: true,
      data: status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting email queue status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get email queue status'
    });
  }
});

// Process email queue manually (for testing)
router.post('/process-queue', async (req, res) => {
  try {
    await emailAutomation.processQueue();
    const status = emailAutomation.getQueueStatus();
    
    res.json({
      success: true,
      message: 'Email queue processed successfully',
      data: status
    });
  } catch (error) {
    console.error('Error processing email queue:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process email queue'
    });
  }
});

// Send test email
router.post('/send-test', async (req, res) => {
  try {
    const { email, emailId, leadType } = req.body;
    
    if (!email || !emailId || !leadType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: email, emailId, leadType'
      });
    }

    // Create a test lead and send the specific email
    const testLeadData = {
      name: 'Test User',
      email: email,
      company: 'Test Company'
    };

    // Start sequence but only for the specific email
    await emailAutomation.startSequence(999999, leadType, testLeadData);
    
    res.json({
      success: true,
      message: `Test email sent to ${email}`
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test email'
    });
  }
});

// Cleanup sent emails
router.post('/cleanup', async (req, res) => {
  try {
    emailAutomation.cleanup();
    const status = emailAutomation.getQueueStatus();
    
    res.json({
      success: true,
      message: 'Email queue cleaned up successfully',
      data: status
    });
  } catch (error) {
    console.error('Error cleaning up email queue:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cleanup email queue'
    });
  }
});

export default router;
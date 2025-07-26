const axios = require('axios');
require('dotenv').config();

class BrevoEmailService {
  constructor() {
    this.apiKey = process.env.BREVO_API_KEY;
    this.baseUrl = 'https://api.brevo.com/v3';
    
    if (!this.apiKey) {
      console.warn('BREVO_API_KEY not found in environment variables');
    }
  }

  async sendEmail({ to, subject, htmlContent, textContent, sender }) {
    if (!this.apiKey) {
      throw new Error('Brevo API key not configured');
    }

    const emailData = {
      sender: sender || {
        name: "SafetySync.AI",
        email: "noreply@safetysync.ai"
      },
      to: Array.isArray(to) ? to : [{ email: to, name: to.split('@')[0] }],
      subject: subject,
      htmlContent: htmlContent,
      textContent: textContent || this.stripHtml(htmlContent)
    };

    try {
      const response = await axios.post(
        `${this.baseUrl}/smtp/email`,
        emailData,
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': this.apiKey
          }
        }
      );

      console.log('Email sent successfully:', response.data);
      return { success: true, messageId: response.data.messageId };
    } catch (error) {
      console.error('Failed to send email:', error.response?.data || error.message);
      throw new Error(`Email sending failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async sendWelcomeEmail(userEmail, userName) {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to SafetySync.AI</h1>
        </div>
        <div style="padding: 40px; background: #f8fafc;">
          <h2 style="color: #1e293b; margin-bottom: 20px;">Hello ${userName}!</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            Welcome to SafetySync.AI, your comprehensive OSHA compliance platform. We're excited to help you streamline your safety management processes.
          </p>
          <div style="background: white; padding: 30px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #10b981;">
            <h3 style="color: #1e293b; margin-top: 0;">Get Started:</h3>
            <ul style="color: #475569; line-height: 1.8;">
              <li>Set up your company profile</li>
              <li>Add your employees to the system</li>
              <li>Upload training documents for AI processing</li>
              <li>Generate digital certificates and wallet cards</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 40px 0;">
            <a href="${process.env.FRONTEND_URL || 'https://safetysync.ai'}/workspace" 
               style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Access Your Workspace
            </a>
          </div>
          <p style="color: #64748b; font-size: 14px; margin-top: 40px;">
            If you have any questions, our support team is here to help.
          </p>
        </div>
      </div>
    `;

    return await this.sendEmail({
      to: userEmail,
      subject: "Welcome to SafetySync.AI - Your OSHA Compliance Platform",
      htmlContent: htmlContent
    });
  }

  async sendEmailVerification(userEmail, verificationToken) {
    const verificationUrl = `${process.env.FRONTEND_URL || 'https://safetysync.ai'}/verify-email?token=${verificationToken}`;
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Verify Your Email</h1>
        </div>
        <div style="padding: 40px; background: #f8fafc;">
          <h2 style="color: #1e293b; margin-bottom: 20px;">Email Verification Required</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            Please verify your email address to complete your SafetySync.AI account setup.
          </p>
          <div style="text-align: center; margin: 40px 0;">
            <a href="${verificationUrl}" 
               style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #64748b; font-size: 14px;">
            This verification link expires in 24 hours. If you didn't create this account, please ignore this email.
          </p>
        </div>
      </div>
    `;

    return await this.sendEmail({
      to: userEmail,
      subject: "Verify Your SafetySync.AI Email Address",
      htmlContent: htmlContent
    });
  }

  async sendPasswordReset(userEmail, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL || 'https://safetysync.ai'}/reset-password?token=${resetToken}`;
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset</h1>
        </div>
        <div style="padding: 40px; background: #f8fafc;">
          <h2 style="color: #1e293b; margin-bottom: 20px;">Reset Your Password</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            We received a request to reset your SafetySync.AI password. Click the button below to create a new password.
          </p>
          <div style="text-align: center; margin: 40px 0;">
            <a href="${resetUrl}" 
               style="background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p style="color: #64748b; font-size: 14px;">
            This reset link expires in 1 hour. If you didn't request this reset, please ignore this email.
          </p>
        </div>
      </div>
    `;

    return await this.sendEmail({
      to: userEmail,
      subject: "Reset Your SafetySync.AI Password",
      htmlContent: htmlContent
    });
  }

  stripHtml(html) {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }
}

module.exports = new BrevoEmailService();
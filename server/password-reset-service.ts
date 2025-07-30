import crypto from 'crypto';
import { storage } from './storage';
import axios from 'axios';

// Generate secure reset token
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Send password reset email using Brevo API
export async function sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
  const resetUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/reset-password?token=${resetToken}`;
  
  const emailData = {
    sender: {
      name: "SafetySync.AI Support",
      email: "noreply@safetysync.ai"
    },
    to: [{
      email: email,
      name: email
    }],
    subject: "Reset Your SafetySync.AI Password",
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
          .content { padding: 40px 30px; }
          .content h2 { color: #1e293b; font-size: 24px; margin-bottom: 20px; }
          .content p { color: #475569; line-height: 1.6; margin-bottom: 20px; }
          .reset-button { display: inline-block; background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .reset-button:hover { background: #1d4ed8; }
          .security-info { background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SafetySync.AI</h1>
          </div>
          <div class="content">
            <h2>Reset Your Password</h2>
            <p>We received a request to reset your SafetySync.AI password. Click the button below to create a new password:</p>
            
            <a href="${resetUrl}" class="reset-button">Reset My Password</a>
            
            <div class="security-info">
              <h3 style="color: #1e293b; margin: 0 0 10px 0;">Security Information:</h3>
              <ul style="margin: 0; padding-left: 20px; color: #475569;">
                <li>This link will expire in 1 hour for your security</li>
                <li>If you didn't request this reset, you can safely ignore this email</li>
                <li>Your password won't change until you click the link and create a new one</li>
              </ul>
            </div>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #2563eb;">${resetUrl}</p>
            
            <p>Need help? Contact our support team at <a href="mailto:hello@safetysync.ai">hello@safetysync.ai</a></p>
          </div>
          <div class="footer">
            <p>© 2025 SafetySync.AI. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      emailData,
      {
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('✅ Password reset email sent successfully via Brevo');
  } catch (error: any) {
    console.error('❌ Failed to send password reset email:', error.response?.data || error.message);
    throw new Error('Failed to send password reset email');
  }
}

// Initiate password reset process
export async function initiatePasswordReset(email: string): Promise<void> {
  // Check if user exists
  const user = await storage.getUserByEmail(email);
  if (!user) {
    // Don't reveal if email exists or not for security
    return;
  }

  // Generate reset token and expiration (1 hour from now)
  const resetToken = generateResetToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  // Store reset token in database
  await storage.setPasswordResetToken(user.id, resetToken, expiresAt);

  // Send reset email
  await sendPasswordResetEmail(email, resetToken);
}

// Validate reset token and update password
export async function resetPassword(token: string, newPassword: string): Promise<boolean> {
  // Find user by reset token
  const user = await storage.getUserByResetToken(token);
  if (!user) {
    return false;
  }

  // Check if token is expired
  if (!user.passwordResetExpires || new Date() > user.passwordResetExpires) {
    return false;
  }

  // Update password and clear reset token
  await storage.updateUserPassword(user.id, newPassword);
  await storage.clearPasswordResetToken(user.id);

  return true;
}
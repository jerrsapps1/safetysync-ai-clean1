import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

interface EmailVerificationData {
  email: string;
  name: string;
  verificationToken: string;
  company?: string;
}

export async function sendVerificationEmail(data: EmailVerificationData): Promise<boolean> {
  try {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/verify-email?token=${data.verificationToken}`;
    
    const msg = {
      to: data.email,
      from: {
        email: 'hello@safetysync.ai',
        name: 'SafetySync.AI Team'
      },
      subject: 'Welcome to SafetySync.AI - Please Verify Your Email',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to SafetySync.AI</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%); padding: 40px 30px; text-align: center; }
            .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .subtitle { color: #e2e8f0; font-size: 16px; }
            .content { padding: 40px 30px; }
            .welcome { font-size: 24px; color: #1e293b; margin-bottom: 20px; }
            .message { color: #475569; line-height: 1.6; margin-bottom: 30px; }
            .button { display: inline-block; background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .button:hover { background: #059669; }
            .footer { background: #f1f5f9; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
            .security-note { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">SafetySync.AI</div>
              <div class="subtitle">AI-Powered OSHA Compliance Management</div>
            </div>
            
            <div class="content">
              <h1 class="welcome">Welcome to SafetySync.AI, ${data.name}!</h1>
              
              <div class="message">
                <p>Thank you for starting your free trial with SafetySync.AI. We're excited to help you streamline your OSHA compliance and save 15+ hours weekly on safety management.</p>
                
                <p>To complete your account setup and access your workspace, please verify your email address by clicking the button below:</p>
              </div>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email & Access Workspace</a>
              </div>
              
              <div class="security-note">
                <strong>Security Note:</strong> This verification link will expire in 24 hours for your security. If you didn't create this account, please ignore this email.
              </div>
              
              <div class="message">
                <p><strong>What's Next?</strong></p>
                <ul>
                  <li>Access your personalized dashboard</li>
                  <li>Upload training documents for AI processing</li>
                  <li>Generate digital safety certificates</li>
                  <li>Set up automated compliance tracking</li>
                </ul>
                
                <p>If you have any questions, our support team is here to help at <a href="mailto:support@safetysync.ai">support@safetysync.ai</a></p>
              </div>
            </div>
            
            <div class="footer">
              <p><strong>SafetySync.AI</strong> - Revolutionizing Workplace Safety Management</p>
              <p>This email was sent to ${data.email}. If you didn't sign up for SafetySync.AI, please ignore this email.</p>
              <p>© 2025 SafetySync.AI. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to SafetySync.AI, ${data.name}!
        
        Thank you for starting your free trial. To complete your account setup and access your workspace, please verify your email address by visiting:
        
        ${verificationUrl}
        
        This link will expire in 24 hours for security reasons.
        
        What's next after verification:
        - Access your personalized dashboard
        - Upload training documents for AI processing  
        - Generate digital safety certificates
        - Set up automated compliance tracking
        
        Questions? Contact us at support@safetysync.ai
        
        Best regards,
        The SafetySync.AI Team
      `
    };

    await sgMail.send(msg);
    console.log(`✅ EMAIL: Verification email sent to ${data.email}`);
    return true;
  } catch (error) {
    console.error('❌ EMAIL: Failed to send verification email:', error);
    return false;
  }
}

export async function sendWelcomeEmail(email: string, name: string): Promise<boolean> {
  try {
    const msg = {
      to: email,
      from: {
        email: 'hello@safetysync.ai',
        name: 'SafetySync.AI Team'
      },
      subject: 'Account Verified - Welcome to SafetySync.AI!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center; }
            .content { padding: 40px 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="color: white; margin: 0;">🎉 Account Verified Successfully!</h1>
            </div>
            <div class="content">
              <h2>Welcome aboard, ${name}!</h2>
              <p>Your SafetySync.AI account has been verified and is now fully active. You can now access all platform features including:</p>
              <ul>
                <li>AI-powered document processing</li>
                <li>Digital certificate generation</li>
                <li>Automated compliance tracking</li>
                <li>Real-time safety insights</li>
              </ul>
              <p>Ready to revolutionize your safety management? <a href="${process.env.FRONTEND_URL || 'http://localhost:5000'}/workspace" style="color: #10b981; font-weight: bold;">Access Your Workspace</a></p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await sgMail.send(msg);
    console.log(`✅ EMAIL: Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ EMAIL: Failed to send welcome email:', error);
    return false;
  }
}
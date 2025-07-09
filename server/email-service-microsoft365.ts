import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: {
    name: string;
    address: string;
  };
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

class Microsoft365EmailService {
  private transporter: nodemailer.Transporter;
  private config: EmailConfig;

  constructor() {
    this.config = {
      host: 'smtp.office365.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER || 'jerry@safetysync.ai',
        pass: process.env.EMAIL_PASSWORD || '', // Use app password
      },
      from: {
        name: 'SafetySync.AI',
        address: process.env.EMAIL_FROM || 'jerry@safetysync.ai'
      }
    };

    this.transporter = nodemailer.createTransport(this.config);
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: `${this.config.from.name} <${this.config.from.address}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.stripHtml(options.html),
        replyTo: options.replyTo || 'support@safetysync.ai'
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${options.to}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(userEmail: string, userName: string): Promise<void> {
    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">Welcome to SafetySync.AI!</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0 0; font-size: 18px;">Your AI-powered compliance journey begins today</p>
        </div>
        
        <div style="padding: 40px; background: white;">
          <p style="font-size: 18px; color: #374151; margin: 0 0 25px 0;">Hi ${userName},</p>
          
          <p style="color: #6b7280; line-height: 1.7; margin-bottom: 30px;">
            Your <strong>90-day free trial</strong> is now active with <strong>unlimited certificate generation</strong>. 
            You have complete access to our enterprise platform.
          </p>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 12px; margin: 30px 0; border-left: 5px solid #3B82F6;">
            <h3 style="color: #1e293b; margin: 0 0 20px 0;">🎯 Your Success Roadmap</h3>
            <div style="margin-bottom: 15px;">✅ Week 1: Company setup, employee import, first report</div>
            <div style="margin-bottom: 15px;">📄 Week 2: Professional certificates, automated reminders</div>
            <div>🚀 Week 3+: Advanced features, API integration, team collaboration</div>
          </div>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="https://app.safetysync.ai/dashboard" style="background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
              Access Your Dashboard
            </a>
          </div>
        </div>
      </div>
    `;

    await this.sendEmail({
      to: userEmail,
      subject: 'Welcome to SafetySync.AI! Your 90-day trial starts now 🚀',
      html,
      replyTo: 'support@safetysync.ai'
    });
  }

  async sendTrialReminderEmail(userEmail: string, userName: string, daysRemaining: number): Promise<void> {
    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #F59E0B 0%, #EF4444 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Your Trial Expires in ${daysRemaining} Days</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0 0; font-size: 16px;">Continue your compliance journey with SafetySync.AI</p>
        </div>
        
        <div style="padding: 40px; background: white;">
          <p style="font-size: 18px; color: #374151; margin: 0 0 25px 0;">Hi ${userName},</p>
          
          <p style="color: #6b7280; line-height: 1.7; margin-bottom: 30px;">
            Your SafetySync.AI trial expires in <strong>${daysRemaining} days</strong>. 
            Don't lose access to your compliance data and professional certificates.
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="https://app.safetysync.ai/billing" style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
              Upgrade to Pro - $49/month
            </a>
          </div>
        </div>
      </div>
    `;

    await this.sendEmail({
      to: userEmail,
      subject: `Your SafetySync.AI trial expires in ${daysRemaining} days`,
      html,
      replyTo: 'support@safetysync.ai'
    });
  }

  async sendSupportEmail(userEmail: string, subject: string, message: string): Promise<void> {
    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #374151; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">Support Request</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0 0;">From: ${userEmail}</p>
        </div>
        
        <div style="padding: 40px; background: white;">
          <h3 style="color: #374151; margin: 0 0 20px 0;">Subject: ${subject}</h3>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; color: #374151;">
            ${message}
          </div>
        </div>
      </div>
    `;

    await this.sendEmail({
      to: 'support@safetysync.ai',
      subject: `Support Request: ${subject}`,
      html,
      replyTo: userEmail
    });
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Microsoft 365 SMTP connection successful');
      return true;
    } catch (error) {
      console.error('Microsoft 365 SMTP connection failed:', error);
      return false;
    }
  }

  async sendEmailWithErrorHandling(options: EmailOptions): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      await this.sendEmail(options);
      return {
        success: true,
        message: 'Email sent successfully!',
        details: {
          to: options.to,
          subject: options.subject,
          timestamp: new Date().toLocaleString(),
          status: 'sent'
        }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('SmtpClientAuthentication is disabled') || 
          errorMessage.includes('535 5.7.139') ||
          errorMessage.includes('Authentication unsuccessful')) {
        return {
          success: false,
          message: 'Microsoft 365 SMTP authentication is disabled for your tenant',
          details: {
            to: options.to,
            subject: options.subject,
            timestamp: new Date().toLocaleString(),
            error: 'SMTP AUTH disabled',
            solution: 'Enable SMTP authentication in Microsoft 365 Admin Center',
            link: 'https://admin.microsoft.com → Settings → Modern authentication → Enable SMTP AUTH',
            instructions: [
              '1. Go to Microsoft 365 Admin Center',
              '2. Navigate to Settings → Org settings → Services',
              '3. Find "Modern authentication" and enable SMTP AUTH',
              '4. Wait 5-10 minutes for changes to propagate'
            ]
          }
        };
      }
      
      return {
        success: false,
        message: 'Failed to send email',
        details: {
          to: options.to,
          subject: options.subject,
          timestamp: new Date().toLocaleString(),
          error: errorMessage
        }
      };
    }
  }
}

export const emailService = new Microsoft365EmailService();
import { TRIAL_EMAIL_SEQUENCE, DEMO_EMAIL_SEQUENCE, type EmailSequence, type EmailTemplate } from "@shared/email-templates";

// Email automation service for SafetySync.AI
// Handles scheduling and sending of automated email sequences

interface EmailJob {
  id: string;
  leadId: number;
  emailId: string;
  scheduledFor: Date;
  sent: boolean;
  sequenceType: 'trial' | 'demo';
}

interface EmailServiceConfig {
  provider: 'sendgrid' | 'mailgun' | 'postmark' | 'mock';
  apiKey?: string;
  fromEmail: string;
  fromName: string;
}

class EmailAutomationService {
  private config: EmailServiceConfig;
  private emailQueue: EmailJob[] = [];

  constructor(config: EmailServiceConfig) {
    this.config = config;
  }

  // Start an email sequence for a new lead
  async startSequence(leadId: number, sequenceType: 'trial' | 'demo', leadData: any): Promise<void> {
    const sequence = sequenceType === 'trial' ? TRIAL_EMAIL_SEQUENCE : DEMO_EMAIL_SEQUENCE;
    
    console.log(`Starting ${sequenceType} email sequence for lead ${leadId}`);
    
    // Schedule all emails in the sequence
    let baseTime = new Date();
    
    for (const email of sequence.emails) {
      const scheduledTime = new Date(baseTime.getTime() + (email.delay * 60 * 60 * 1000)); // delay in hours
      
      const job: EmailJob = {
        id: `${leadId}_${email.id}_${Date.now()}`,
        leadId,
        emailId: email.id,
        scheduledFor: scheduledTime,
        sent: false,
        sequenceType
      };
      
      this.emailQueue.push(job);
      
      // For immediate emails (delay: 0), send right away
      if (email.delay === 0) {
        await this.sendEmail(email, leadData);
        job.sent = true;
      }
    }
    
    console.log(`Scheduled ${sequence.emails.length} emails for lead ${leadId}`);
  }

  // Process the email queue (call this on a schedule, e.g., every hour)
  async processQueue(): Promise<void> {
    const now = new Date();
    const dueEmails = this.emailQueue.filter(job => 
      !job.sent && job.scheduledFor <= now
    );

    console.log(`Processing ${dueEmails.length} due emails`);

    for (const job of dueEmails) {
      try {
        // Get lead data (you'll need to implement this based on your storage)
        const leadData = await this.getLeadData(job.leadId);
        if (!leadData) continue;

        // Get email template
        const sequence = job.sequenceType === 'trial' ? TRIAL_EMAIL_SEQUENCE : DEMO_EMAIL_SEQUENCE;
        const emailTemplate = sequence.emails.find(e => e.id === job.emailId);
        if (!emailTemplate) continue;

        // Send email
        await this.sendEmail(emailTemplate, leadData);
        job.sent = true;
        
        console.log(`Sent email ${job.emailId} to lead ${job.leadId}`);
      } catch (error) {
        console.error(`Failed to send email ${job.emailId} to lead ${job.leadId}:`, error);
      }
    }
  }

  // Send individual email
  private async sendEmail(template: EmailTemplate, leadData: any): Promise<void> {
    // Replace variables in email content
    const variables = {
      firstName: leadData.name?.split(' ')[0] || 'there',
      fullName: leadData.name || 'Valued Customer',
      companyName: leadData.company || 'your company',
      dashboardUrl: 'https://your-domain.replit.app/dashboard',
      supportUrl: 'https://your-domain.replit.app/user-guide',
      unsubscribeUrl: `https://your-domain.replit.app/unsubscribe?email=${leadData.email}`
    };

    const htmlContent = this.replaceVariables(template.htmlContent, variables);
    const textContent = this.replaceVariables(template.textContent, variables);
    const subject = this.replaceVariables(template.subject, variables);

    // Send via configured email service
    switch (this.config.provider) {
      case 'mock':
        await this.sendMockEmail(leadData.email, subject, htmlContent, textContent);
        break;
      case 'sendgrid':
        await this.sendViaSendGrid(leadData.email, subject, htmlContent, textContent);
        break;
      case 'mailgun':
        await this.sendViaMailgun(leadData.email, subject, htmlContent, textContent);
        break;
      case 'postmark':
        await this.sendViaPostmark(leadData.email, subject, htmlContent, textContent);
        break;
      default:
        throw new Error(`Unsupported email provider: ${this.config.provider}`);
    }
  }

  // Replace variables in email content
  private replaceVariables(content: string, variables: Record<string, string>): string {
    let result = content;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return result;
  }

  // Mock email sending (for development/testing)
  private async sendMockEmail(to: string, subject: string, html: string, text: string): Promise<void> {
    console.log(`📧 MOCK EMAIL SENT`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`HTML Preview: ${html.substring(0, 200)}...`);
    
    // Store in mock email log for testing
    const mockEmail = {
      to,
      subject,
      html,
      text,
      sentAt: new Date(),
      provider: 'mock'
    };
    
    // In a real app, you might store this in a database for testing
    console.log('Mock email stored for testing:', mockEmail);
  }

  // SendGrid implementation
  private async sendViaSendGrid(to: string, subject: string, html: string, text: string): Promise<void> {
    if (!this.config.apiKey) {
      throw new Error('SendGrid API key not configured');
    }

    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(this.config.apiKey);

    const msg = {
      to,
      from: {
        email: this.config.fromEmail,
        name: this.config.fromName
      },
      subject,
      text,
      html
    };

    await sgMail.send(msg);
  }

  // Mailgun implementation
  private async sendViaMailgun(to: string, subject: string, html: string, text: string): Promise<void> {
    if (!this.config.apiKey) {
      throw new Error('Mailgun API key not configured');
    }

    // Implement Mailgun sending logic here
    console.log('Mailgun sending not yet implemented');
  }

  // Postmark implementation
  private async sendViaPostmark(to: string, subject: string, html: string, text: string): Promise<void> {
    if (!this.config.apiKey) {
      throw new Error('Postmark API key not configured');
    }

    // Implement Postmark sending logic here
    console.log('Postmark sending not yet implemented');
  }

  // Get lead data from storage
  private async getLeadData(leadId: number): Promise<any> {
    // This should integrate with your existing storage system
    // For now, return mock data
    return {
      id: leadId,
      name: 'Test User',
      email: 'test@example.com',
      company: 'Test Company'
    };
  }

  // Get queue status for monitoring
  getQueueStatus(): { total: number; pending: number; sent: number } {
    return {
      total: this.emailQueue.length,
      pending: this.emailQueue.filter(job => !job.sent).length,
      sent: this.emailQueue.filter(job => job.sent).length
    };
  }

  // Clear sent emails from queue (cleanup)
  cleanup(): void {
    const beforeCount = this.emailQueue.length;
    this.emailQueue = this.emailQueue.filter(job => !job.sent);
    const afterCount = this.emailQueue.length;
    console.log(`Cleaned up ${beforeCount - afterCount} sent emails from queue`);
  }
}

// Default configuration
const defaultConfig: EmailServiceConfig = {
  provider: 'mock', // Start with mock for testing
  fromEmail: 'noreply@safetysync.ai',
  fromName: 'SafetySync.AI Team'
};

// Export singleton instance
export const emailAutomation = new EmailAutomationService(defaultConfig);

// Export types
export type { EmailJob, EmailServiceConfig };
export { EmailAutomationService };
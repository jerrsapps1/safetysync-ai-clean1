// Email Service Configuration for Lead Nurturing
// This module handles email automation and lead nurturing sequences

export interface EmailSequence {
  id: string;
  name: string;
  type: 'trial' | 'demo';
  emails: EmailTemplate[];
}

export interface EmailTemplate {
  id: string;
  subject: string;
  delay: number; // hours after previous email
  htmlContent: string;
  textContent: string;
  ctaText: string;
  ctaUrl: string;
}

// Professional Email Sequence for Trial Users (7 emails over 90 days)
export const TRIAL_EMAIL_SEQUENCE: EmailSequence = {
  id: 'trial_nurture_2025',
  name: 'Trial User Success Journey',
  type: 'trial',
  emails: [
    {
      id: 'trial_welcome',
      subject: 'Welcome to SafetySync.AI! Your 90-day trial starts now 🚀',
      delay: 0,
      htmlContent: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">Welcome to SafetySync.AI!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0 0; font-size: 18px; font-weight: 300;">Your AI-powered compliance journey begins today</p>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 40px 30px; background: white; border: 1px solid #e5e7eb; border-top: none;">
            <p style="font-size: 18px; color: #374151; margin: 0 0 25px 0; line-height: 1.6;">Hi {{firstName}},</p>
            
            <p style="color: #6b7280; line-height: 1.7; margin-bottom: 30px; font-size: 16px;">
              Congratulations! Your <strong>90-day free trial</strong> is now active. You have complete access to our enterprise-grade platform, 
              including <strong>unlimited certificate generation</strong> for the first 90 days.
            </p>
            
            <!-- Quick Start Guide -->
            <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 30px; border-radius: 12px; margin: 30px 0; border-left: 5px solid #3B82F6;">
              <h3 style="color: #1e293b; margin: 0 0 20px 0; font-size: 20px;">🎯 Your Success Roadmap</h3>
              <div style="space-y: 15px;">
                <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
                  <span style="background: #22c55e; color: white; padding: 6px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-right: 15px; min-width: 60px; text-align: center;">WEEK 1</span>
                  <span style="color: #475569; line-height: 1.6;">Set up company profile, import employee data, generate first compliance report</span>
                </div>
                <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
                  <span style="background: #3b82f6; color: white; padding: 6px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-right: 15px; min-width: 60px; text-align: center;">WEEK 2</span>
                  <span style="color: #475569; line-height: 1.6;">Create professional certificates, set up automated reminders, configure training schedules</span>
                </div>
                <div style="display: flex; align-items: flex-start;">
                  <span style="background: #8b5cf6; color: white; padding: 6px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-right: 15px; min-width: 60px; text-align: center;">WEEK 3+</span>
                  <span style="color: #475569; line-height: 1.6;">Advanced features, API integration, team collaboration, audit preparation</span>
                </div>
              </div>
            </div>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="{{dashboardUrl}}" style="background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); color: white; padding: 18px 36px; text-decoration: none; border-radius: 10px; font-weight: 600; display: inline-block; font-size: 16px; box-shadow: 0 4px 14px rgba(59, 130, 246, 0.25); transition: all 0.3s ease;">
                Access Your Dashboard →
              </a>
            </div>
            
            <!-- Value Proposition -->
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 30px 0; border: 1px solid #fbbf24;">
              <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <span style="font-size: 24px; margin-right: 10px;">💡</span>
                <strong style="color: #92400e; font-size: 16px;">Did you know?</strong>
              </div>
              <p style="color: #92400e; margin: 0; line-height: 1.6; font-size: 14px;">
                Companies using SafetySync.AI save an average of <strong>15 hours per week</strong> on compliance tasks and reduce 
                administrative costs by <strong>$8,400 annually</strong>. Your ROI starts from day one.
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8fafc; padding: 25px 30px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; margin: 0; font-size: 14px; line-height: 1.6;">
              Questions? Reply to this email or schedule a <a href="{{supportUrl}}" style="color: #3B82F6; text-decoration: none;">15-minute onboarding call</a> with our team.
            </p>
          </div>
        </div>
      `,
      textContent: 'Welcome to SafetySync.AI! Your 90-day trial is active with unlimited certificate generation. Access your dashboard to begin your compliance automation journey.',
      ctaText: 'Access Dashboard',
      ctaUrl: '{{dashboardUrl}}'
    },
    {
      id: 'trial_features',
      subject: 'See how SafetySync.AI automated compliance for 1,200+ companies',
      delay: 48,
      htmlContent: `
        <h2>Compliance Tracking Made Simple</h2>
        <p>Our AI-powered platform automatically tracks:</p>
        <ul>
          <li>📊 Employee certification status</li>
          <li>📅 Training schedule management</li>
          <li>📋 Audit-ready report generation</li>
          <li>🚨 Expiration alerts and reminders</li>
        </ul>
        <p>Watch how Construction Plus saved 15 hours per week with automated tracking.</p>
      `,
      textContent: 'See how SafetySync.AI automated compliance for 1,200+ companies...',
      ctaText: 'View Case Study',
      ctaUrl: '/case-studies',
    },
    {
      id: 'trial_roi',
      subject: 'Calculate your compliance ROI (takes 2 minutes)',
      delay: 120,
      htmlContent: `
        <h2>What's Your Compliance ROI?</h2>
        <p>Companies using SafetySync.AI typically see:</p>
        <ul>
          <li>💰 $8,400 annual savings in administrative costs</li>
          <li>⏱️ 15+ hours saved per week</li>
          <li>🎯 99.2% compliance rate improvement</li>
          <li>📈 Zero compliance violations after 6 months</li>
        </ul>
        <p>Use our ROI calculator to see your potential savings.</p>
      `,
      textContent: 'Calculate your compliance ROI in 2 minutes...',
      ctaText: 'Calculate My ROI',
      ctaUrl: '/pricing',
    },
    {
      id: 'trial_support',
      subject: 'Training resources + dedicated support team',
      delay: 192,
      htmlContent: `
        <h2>Get the Most from Your Trial</h2>
        <p>Access our complete training library:</p>
        <ul>
          <li>📚 Step-by-step setup guides</li>
          <li>🎥 Video tutorials for every feature</li>
          <li>📞 1-on-1 support calls available</li>
          <li>💬 Live chat with compliance experts</li>
        </ul>
        <p>Book a 15-minute setup call with our team.</p>
      `,
      textContent: 'Access training resources and dedicated support...',
      ctaText: 'Book Setup Call',
      ctaUrl: '/user-guide',
    },
    {
      id: 'trial_conversion',
      subject: 'Your trial expires in 3 days - Continue with SafetySync.AI',
      delay: 288,
      htmlContent: `
        <h2>Don't Lose Your Progress</h2>
        <p>Your 90-day trial is ending soon. Continue with SafetySync.AI to:</p>
        <ul>
          <li>🔒 Keep all your employee records and certifications</li>
          <li>📊 Access unlimited compliance reports</li>
          <li>🎯 Maintain your automated compliance tracking</li>
          <li>💎 Unlock advanced AI features and analytics</li>
        </ul>
        <p><strong>Special offer:</strong> Save 20% on your first year with code TRIAL20</p>
      `,
      textContent: 'Your trial expires in 3 days. Continue with SafetySync.AI...',
      ctaText: 'Continue with SafetySync.AI',
      ctaUrl: '/pricing?promo=TRIAL20',
    },
  ],
};

// Demo Request Email Sequence (3 emails over 7 days)
export const DEMO_EMAIL_SEQUENCE: EmailSequence = {
  id: 'demo_sequence',
  name: 'Demo Request Follow-up',
  type: 'demo',
  emails: [
    {
      id: 'demo_confirmation',
      subject: 'Your SafetySync.AI demo is confirmed - here\'s what to expect',
      delay: 0,
      htmlContent: `
        <h2>Your Demo is Confirmed!</h2>
        <p>We'll show you exactly how SafetySync.AI can streamline your compliance process.</p>
        <h3>Demo Agenda (30 minutes):</h3>
        <ul>
          <li>🎯 Custom compliance dashboard setup</li>
          <li>📊 Live report generation demonstration</li>
          <li>🤖 AI-powered insights and recommendations</li>
          <li>💼 Pricing and implementation discussion</li>
        </ul>
        <p>Click below to add the demo to your calendar.</p>
      `,
      textContent: 'Your SafetySync.AI demo is confirmed. Here\'s what to expect...',
      ctaText: 'Add to Calendar',
      ctaUrl: '/demo/calendar',
    },
    {
      id: 'demo_preparation',
      subject: 'Demo tomorrow - prepare for maximum value',
      delay: 72,
      htmlContent: `
        <h2>Get Ready for Tomorrow's Demo</h2>
        <p>To maximize your demo value, please prepare:</p>
        <ul>
          <li>📝 Current employee count and locations</li>
          <li>📋 List of required certifications/training</li>
          <li>🎯 Specific compliance challenges you're facing</li>
          <li>💰 Current compliance management costs</li>
        </ul>
        <p>Questions? Reply to this email or call us at (555) 123-4567.</p>
      `,
      textContent: 'Demo tomorrow - prepare for maximum value...',
      ctaText: 'Demo Prep Checklist',
      ctaUrl: '/demo/prep',
    },
    {
      id: 'demo_followup',
      subject: 'Thanks for the demo - here\'s your custom proposal',
      delay: 168,
      htmlContent: `
        <h2>Your Custom SafetySync.AI Proposal</h2>
        <p>Based on our demo discussion, here's your tailored solution:</p>
        <ul>
          <li>💼 Enterprise plan for [EMPLOYEE_COUNT] employees</li>
          <li>📊 Custom dashboard with your specific requirements</li>
          <li>🎯 Implementation timeline: 2-3 weeks</li>
          <li>💰 ROI projection: $[CALCULATED_SAVINGS] annual savings</li>
        </ul>
        <p>Ready to get started? Questions about implementation?</p>
      `,
      textContent: 'Thanks for the demo - here\'s your custom proposal...',
      ctaText: 'Start Implementation',
      ctaUrl: '/demo/proposal',
    },
  ],
};

// Email service interface
export interface EmailService {
  sendEmail: (to: string, template: EmailTemplate, variables?: Record<string, string>) => Promise<boolean>;
  scheduleEmail: (to: string, template: EmailTemplate, delayHours: number, variables?: Record<string, string>) => Promise<boolean>;
  sendSequence: (to: string, sequence: EmailSequence, variables?: Record<string, string>) => Promise<boolean>;
}

// Email template variable replacement
export const replaceEmailVariables = (content: string, variables: Record<string, string> = {}): string => {
  let result = content;
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(`\\[${key}\\]`, 'g'), value);
  });
  return result;
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Email service configuration
export const EMAIL_CONFIG = {
  // Replace with your actual email service configuration
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '',
  FROM_EMAIL: 'hello@safetysync.ai',
  FROM_NAME: 'SafetySync.AI Team',
  REPLY_TO: 'support@safetysync.ai',
  
  // Email service provider settings
  PROVIDER: 'sendgrid', // Options: 'sendgrid', 'mailgun', 'ses'
  
  // Template settings
  TEMPLATE_THEME: {
    primaryColor: '#2563eb',
    secondaryColor: '#64748b',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    logoUrl: 'https://safetysync.ai/logo.png',
  },
};

export default {
  TRIAL_EMAIL_SEQUENCE,
  DEMO_EMAIL_SEQUENCE,
  replaceEmailVariables,
  validateEmail,
  EMAIL_CONFIG,
};
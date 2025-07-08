// Comprehensive Email Templates for SafetySync.AI
// Professional email sequences for lead nurturing and customer success

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

// Trial User Email Sequence (7 emails over 90 days)
export const TRIAL_EMAIL_SEQUENCE: EmailSequence = {
  id: 'trial_success_journey',
  name: 'Trial User Success Journey',
  type: 'trial',
  emails: [
    {
      id: 'trial_welcome',
      subject: 'Welcome to SafetySync.AI! Your 90-day trial starts now 🚀',
      delay: 0, // Immediate
      htmlContent: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">Welcome to SafetySync.AI!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0 0; font-size: 18px;">Your AI-powered compliance journey begins today</p>
          </div>
          
          <div style="padding: 40px 30px; background: white;">
            <p style="font-size: 18px; color: #374151; margin: 0 0 25px 0;">Hi {{firstName}},</p>
            
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
              <a href="{{dashboardUrl}}" style="background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); color: white; padding: 18px 36px; text-decoration: none; border-radius: 10px; font-weight: 600; display: inline-block;">
                Access Your Dashboard →
              </a>
            </div>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; border: 1px solid #fbbf24;">
              <p style="color: #92400e; margin: 0;"><strong>💡 Pro Tip:</strong> Companies save 15 hours/week and $8,400 annually with SafetySync.AI</p>
            </div>
          </div>
        </div>
      `,
      textContent: 'Welcome to SafetySync.AI! Your 90-day trial with unlimited certificates is active. Access your dashboard to start automating compliance.',
      ctaText: 'Access Dashboard',
      ctaUrl: '{{dashboardUrl}}'
    },
    {
      id: 'trial_quick_wins',
      subject: 'Quick wins: 3 ways SafetySync.AI saves time today',
      delay: 72, // 3 days
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="background: #059669; padding: 30px; text-align: center;">
            <h2 style="color: white; margin: 0; font-size: 28px;">Quick Wins with SafetySync.AI</h2>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">3 time-saving features you can use today</p>
          </div>
          
          <div style="padding: 30px;">
            <p style="font-size: 16px; color: #374151; margin-bottom: 25px;">Hi {{firstName}},</p>
            
            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 30px;">
              It's been 3 days since you started your trial. Here are 3 quick wins you can achieve today:
            </p>
            
            <div style="margin: 25px 0;">
              <div style="display: flex; margin-bottom: 25px; align-items: flex-start;">
                <div style="background: #dbeafe; padding: 15px; border-radius: 50%; margin-right: 20px; min-width: 50px; text-align: center;">
                  <span style="color: #3B82F6; font-weight: bold; font-size: 20px;">1</span>
                </div>
                <div>
                  <h4 style="color: #1f2937; margin: 0 0 8px 0; font-size: 18px;">Generate Your First Report</h4>
                  <p style="color: #6b7280; margin: 0; line-height: 1.6;">Create a comprehensive compliance report in under 2 minutes using our AI-powered generator.</p>
                </div>
              </div>
              
              <div style="display: flex; margin-bottom: 25px; align-items: flex-start;">
                <div style="background: #d1fae5; padding: 15px; border-radius: 50%; margin-right: 20px; min-width: 50px; text-align: center;">
                  <span style="color: #059669; font-weight: bold; font-size: 20px;">2</span>
                </div>
                <div>
                  <h4 style="color: #1f2937; margin: 0 0 8px 0; font-size: 18px;">Create Professional Certificates</h4>
                  <p style="color: #6b7280; margin: 0; line-height: 1.6;">Generate OSHA-compliant certificates with your company branding - free for 90 days.</p>
                </div>
              </div>
              
              <div style="display: flex; align-items: flex-start;">
                <div style="background: #fde68a; padding: 15px; border-radius: 50%; margin-right: 20px; min-width: 50px; text-align: center;">
                  <span style="color: #d97706; font-weight: bold; font-size: 20px;">3</span>
                </div>
                <div>
                  <h4 style="color: #1f2937; margin: 0 0 8px 0; font-size: 18px;">Set Up Automated Reminders</h4>
                  <p style="color: #6b7280; margin: 0; line-height: 1.6;">Never miss a certification deadline with intelligent AI-powered reminder system.</p>
                </div>
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{dashboardUrl}}" style="background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Try These Features Now
              </a>
            </div>
          </div>
        </div>
      `,
      textContent: 'Quick wins with SafetySync.AI: 1) Generate reports in 2 minutes, 2) Create professional certificates, 3) Set up automated reminders. Try these features now.',
      ctaText: 'Try Features',
      ctaUrl: '{{dashboardUrl}}'
    },
    {
      id: 'trial_success_stories',
      subject: 'Week 1 complete! See what other companies achieved',
      delay: 168, // 7 days
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #8B5CF6, #EC4899); padding: 30px; text-align: center;">
            <h2 style="color: white; margin: 0; font-size: 28px;">Week 1 Complete! 🎉</h2>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">See what other companies achieved</p>
          </div>
          
          <div style="padding: 30px;">
            <p style="font-size: 16px; color: #374151;">Hi {{firstName}},</p>
            
            <p style="color: #6b7280; line-height: 1.6; margin: 20px 0;">
              Congratulations on completing your first week! Here's what other companies accomplished in their first week:
            </p>
            
            <div style="background: #f0fdf4; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #22c55e;">
              <h4 style="color: #166534; margin: 0 0 10px 0; font-size: 18px;">"Reduced compliance prep time by 75%"</h4>
              <p style="color: #166534; margin: 0; font-style: italic; font-size: 14px;">- Sarah Johnson, EH&S Manager at TechFlow Industries (247 employees)</p>
            </div>
            
            <div style="background: #eff6ff; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #3b82f6;">
              <h4 style="color: #1e40af; margin: 0 0 10px 0; font-size: 18px;">"Generated 50 certificates in 10 minutes"</h4>
              <p style="color: #1e40af; margin: 0; font-style: italic; font-size: 14px;">- Mike Rodriguez, Safety Director at BuildCorp (1,200 employees)</p>
            </div>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <p style="color: #92400e; margin: 0; line-height: 1.6;">
                <strong>Your Progress:</strong> You have 83 days remaining in your trial with unlimited certificate generation. 
                After that, it's just $49/month for 50 certificates + 50 digital wallet cards.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{dashboardUrl}}" style="background: #8B5CF6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Continue Your Success Story
              </a>
            </div>
          </div>
        </div>
      `,
      textContent: 'Week 1 complete! Other companies reduced compliance time by 75% and generated 50 certificates in 10 minutes. Continue your success story.',
      ctaText: 'Continue Success',
      ctaUrl: '{{dashboardUrl}}'
    },
    {
      id: 'trial_advanced_features',
      subject: 'Unlock advanced features: API integration & team collaboration',
      delay: 336, // 14 days
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1e293b; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h2 style="color: white; margin: 0; font-size: 28px;">Ready for Advanced Features?</h2>
            <p style="color: #cbd5e1; margin: 10px 0 0 0;">Take your compliance automation to the next level</p>
          </div>
          
          <div style="padding: 30px; background: white; border: 1px solid #e5e7eb; border-top: none;">
            <p style="color: #374151;">Hi {{firstName}},</p>
            
            <p style="color: #6b7280; line-height: 1.6; margin: 20px 0;">
              You're 2 weeks into your trial! Ready to explore our advanced features that enterprise clients love?
            </p>
            
            <div style="grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0;">
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h4 style="color: #1f2937; margin: 0 0 10px 0;">🔗 API Integration</h4>
                <p style="color: #6b7280; margin: 0; font-size: 14px; line-height: 1.5;">Connect with your HRIS, training platforms, and existing tools for seamless data flow.</p>
              </div>
              
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h4 style="color: #1f2937; margin: 0 0 10px 0;">👥 Team Collaboration</h4>
                <p style="color: #6b7280; margin: 0; font-size: 14px; line-height: 1.5;">Add team members, assign roles, and collaborate on compliance management.</p>
              </div>
              
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h4 style="color: #1f2937; margin: 0 0 10px 0;">📊 Advanced Analytics</h4>
                <p style="color: #6b7280; margin: 0; font-size: 14px; line-height: 1.5;">Deep insights into compliance trends, risk patterns, and performance metrics.</p>
              </div>
              
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
                <h4 style="color: #1f2937; margin: 0 0 10px 0;">🎨 Custom Branding</h4>
                <p style="color: #6b7280; margin: 0; font-size: 14px; line-height: 1.5;">White-label certificates and reports with your company logo and colors.</p>
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{dashboardUrl}}" style="background: #1e293b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Explore Advanced Features
              </a>
            </div>
          </div>
        </div>
      `,
      textContent: 'Ready for advanced features? Explore API integration, team collaboration, advanced analytics, and custom branding in your dashboard.',
      ctaText: 'Explore Features',
      ctaUrl: '{{dashboardUrl}}'
    }
  ]
};

// Demo Request Email Sequence (5 emails over 30 days)
export const DEMO_EMAIL_SEQUENCE: EmailSequence = {
  id: 'demo_enterprise_journey',
  name: 'Enterprise Demo Journey',
  type: 'demo',
  emails: [
    {
      id: 'demo_welcome',
      subject: 'Your SafetySync.AI enterprise demo is ready',
      delay: 0, // Immediate
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e293b, #3b82f6); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 32px;">Enterprise Demo Ready</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0 0; font-size: 18px;">Experience SafetySync.AI at enterprise scale</p>
          </div>
          
          <div style="padding: 40px 30px; background: white; border: 1px solid #e5e7eb; border-top: none;">
            <p style="font-size: 18px; color: #374151;">Hi {{firstName}},</p>
            
            <p style="color: #6b7280; line-height: 1.7; margin: 25px 0;">
              Thank you for your interest in SafetySync.AI for {{companyName}}. Your enterprise demo environment 
              is now configured with sample data representing a mid-size organization.
            </p>
            
            <div style="background: #f8fafc; padding: 25px; border-radius: 10px; margin: 30px 0; border-left: 5px solid #3b82f6;">
              <h3 style="color: #1e293b; margin: 0 0 15px 0;">🏢 Enterprise Features Included</h3>
              <ul style="color: #6b7280; margin: 0; padding-left: 20px; line-height: 1.8;">
                <li>Multi-location compliance management</li>
                <li>Advanced role-based access controls</li>
                <li>API integration capabilities</li>
                <li>Custom branding and white-labeling</li>
                <li>Dedicated account management</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{dashboardUrl}}" style="background: #1e293b; color: white; padding: 18px 36px; text-decoration: none; border-radius: 10px; font-weight: 600; display: inline-block;">
                Access Enterprise Demo
              </a>
            </div>
            
            <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <p style="color: #1e40af; margin: 0; text-align: center;">
                <strong>Ready to discuss your specific needs?</strong><br>
                <a href="{{supportUrl}}" style="color: #3b82f6;">Schedule a personalized consultation</a>
              </p>
            </div>
          </div>
        </div>
      `,
      textContent: 'Your SafetySync.AI enterprise demo is ready with multi-location management, advanced access controls, and API integration. Access your demo environment now.',
      ctaText: 'Access Demo',
      ctaUrl: '{{dashboardUrl}}'
    }
  ]
};
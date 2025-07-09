import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Eye, Send, Check, X, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

export default function EmailPreview() {
  const [selectedTemplate, setSelectedTemplate] = useState('welcome');

  const templates = {
    welcome: {
      title: 'Welcome Email',
      subject: 'Welcome to SafetySync.AI! Your 90-day trial starts now 🚀',
      description: 'Professional onboarding email with trial information',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">Welcome to SafetySync.AI!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0 0; font-size: 18px;">Your AI-powered compliance journey begins today</p>
          </div>
          
          <div style="padding: 40px; background: white;">
            <p style="font-size: 18px; color: #374151; margin: 0 0 25px 0;">Hi Jerry,</p>
            
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
      `
    },
    trial: {
      title: 'Trial Reminder',
      subject: 'Your SafetySync.AI trial expires in 7 days - Continue your success! 🎯',
      description: 'Automated trial expiration reminder',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #F59E0B 0%, #EF4444 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Trial Ending Soon!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0 0; font-size: 18px;">7 days remaining in your trial</p>
          </div>
          
          <div style="padding: 40px; background: white;">
            <p style="font-size: 18px; color: #374151; margin: 0 0 25px 0;">Hi Jerry,</p>
            
            <p style="color: #6b7280; line-height: 1.7; margin-bottom: 30px;">
              Your trial has been a success! You've generated <strong>23 certificates</strong> and saved <strong>15+ hours</strong> of manual work.
            </p>
            
            <div style="background: #fef3c7; padding: 30px; border-radius: 12px; margin: 30px 0; border-left: 5px solid #F59E0B;">
              <h3 style="color: #92400e; margin: 0 0 20px 0;">⚡ Your Trial Success</h3>
              <div style="margin-bottom: 15px;">📋 Generated 23 professional certificates</div>
              <div style="margin-bottom: 15px;">⏰ Saved 15+ hours of manual compliance work</div>
              <div>🎯 100% compliance rate achieved</div>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="https://app.safetysync.ai/pricing" style="background: linear-gradient(135deg, #F59E0B 0%, #EF4444 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                Continue Your Success
              </a>
            </div>
          </div>
        </div>
      `
    },
    demo: {
      title: 'Demo Request',
      subject: 'Your SafetySync.AI enterprise demo is confirmed! 🏢',
      description: 'Enterprise demo scheduling confirmation',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Demo Confirmed!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0 0; font-size: 18px;">Your enterprise demo is scheduled</p>
          </div>
          
          <div style="padding: 40px; background: white;">
            <p style="font-size: 18px; color: #374151; margin: 0 0 25px 0;">Hi Jerry,</p>
            
            <p style="color: #6b7280; line-height: 1.7; margin-bottom: 30px;">
              Your <strong>enterprise demo</strong> is confirmed for <strong>tomorrow at 2:00 PM EST</strong>. 
              We'll show you how SafetySync.AI can transform your compliance operations.
            </p>
            
            <div style="background: #ecfdf5; padding: 30px; border-radius: 12px; margin: 30px 0; border-left: 5px solid #10B981;">
              <h3 style="color: #065f46; margin: 0 0 20px 0;">📅 Demo Details</h3>
              <div style="margin-bottom: 15px;">🗓️ Date: Tomorrow, January 15th</div>
              <div style="margin-bottom: 15px;">⏰ Time: 2:00 PM EST</div>
              <div>🔗 Link: We'll send the meeting link 1 hour before</div>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="https://calendly.com/safetysync-demo" style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                Add to Calendar
              </a>
            </div>
          </div>
        </div>
      `
    },
    support: {
      title: 'Support Response',
      subject: 'Re: Your SafetySync.AI support request - Resolved! ✅',
      description: 'Customer support response email',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Support Resolved!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0 0; font-size: 18px;">Your request has been handled</p>
          </div>
          
          <div style="padding: 40px; background: white;">
            <p style="font-size: 18px; color: #374151; margin: 0 0 25px 0;">Hi Jerry,</p>
            
            <p style="color: #6b7280; line-height: 1.7; margin-bottom: 30px;">
              Great news! Your support request about <strong>certificate generation</strong> has been resolved. 
              The issue was with the equipment authorization list formatting.
            </p>
            
            <div style="background: #f0f9ff; padding: 30px; border-radius: 12px; margin: 30px 0; border-left: 5px solid #6366F1;">
              <h3 style="color: #1e40af; margin: 0 0 20px 0;">✅ Resolution Summary</h3>
              <div style="margin-bottom: 15px;">🔧 Fixed: Equipment authorization formatting</div>
              <div style="margin-bottom: 15px;">📄 Updated: Certificate generation templates</div>
              <div>🚀 Result: All certificates now generate properly</div>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="https://app.safetysync.ai/support" style="background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                Contact Support Again
              </a>
            </div>
          </div>
        </div>
      `
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/admin">
            <Button variant="outline" className="mb-4 text-blue-200 border-blue-500/50 hover:bg-blue-500/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Button>
          </Link>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            SafetySync.AI Email Templates
          </h1>
          <p className="text-blue-200 text-lg">
            Professional email templates for Microsoft 365 integration
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template Selector */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-sm border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(templates).map(([key, template]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedTemplate(key)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedTemplate === key
                        ? 'border-blue-400 bg-blue-500/20 text-white'
                        : 'border-blue-500/20 bg-white/5 text-blue-200 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-semibold mb-1">{template.title}</div>
                    <div className="text-sm opacity-80">{template.description}</div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Status Card */}
            <Card className="bg-white/10 backdrop-blur-sm border-green-500/20 mt-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-400" />
                  Email System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-green-200">DNS Records</span>
                  <Badge variant="outline" className="border-green-500 text-green-400">
                    <Check className="w-3 h-3 mr-1" />
                    Ready
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-200">Email Service</span>
                  <Badge variant="outline" className="border-green-500 text-green-400">
                    <Check className="w-3 h-3 mr-1" />
                    Ready
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-orange-200">SMTP Auth</span>
                  <Badge variant="outline" className="border-orange-500 text-orange-400">
                    <X className="w-3 h-3 mr-1" />
                    Disabled
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Template Preview */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-sm border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  {templates[selectedTemplate as keyof typeof templates].title} Preview
                </CardTitle>
                <div className="text-blue-200 text-sm">
                  Subject: {templates[selectedTemplate as keyof typeof templates].subject}
                </div>
              </CardHeader>
              <CardContent>
                <div 
                  className="bg-white rounded-lg p-4 max-h-96 overflow-y-auto"
                  dangerouslySetInnerHTML={{ 
                    __html: templates[selectedTemplate as keyof typeof templates].html 
                  }}
                />
              </CardContent>
            </Card>

            {/* Test Button */}
            <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20 mt-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Test Email System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-orange-200 mb-4">
                  ⚠️ Enable SMTP authentication in Microsoft 365 admin center first
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  onClick={() => {
                    fetch('/api/test-email', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        to: 'jerry@safetysync.ai',
                        subject: 'Test Email',
                        testType: selectedTemplate
                      })
                    })
                    .then(res => res.json())
                    .then(data => {
                      console.log('Email test result:', data);
                      alert(data.success ? 'Email sent successfully!' : `Error: ${data.message}`);
                    });
                  }}
                >
                  Test {templates[selectedTemplate as keyof typeof templates].title}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
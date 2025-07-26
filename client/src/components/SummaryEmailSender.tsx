import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Send, Mail, CheckCircle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

export default function SummaryEmailSender() {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastSent, setLastSent] = useState<string | null>(null);
  const { toast } = useToast();

  const generateSampleSummary = () => {
    const today = new Date();
    const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const sampleSummary = `Weekly SafetySync.AI Summary
============================
Report Period: ${weekStart.toLocaleDateString()} - ${today.toLocaleDateString()}

📊 USER METRICS
- Total New Signups: 23
- Trial Conversions: 12 (52%)
- Active Users: 187
- User Retention Rate: 89%

🎓 TRAINING ACTIVITY  
- Certificates Generated: 156
- Digital Wallet Cards: 143
- Training Documents Processed: 89
- AI Document Extractions: 67

🏆 TOP TRAINING PROGRAMS
1. Fall Protection (29 CFR 1926.95) - 34 completions
2. HAZWOPER (29 CFR 1910.120) - 28 completions
3. Forklift Safety (29 CFR 1910.178) - 22 completions
4. PPE Training (29 CFR 1910.132) - 19 completions

⚡ FEATURE USAGE
- AI Document Processing: 78%
- Certificate Generation: 91%
- Employee Management: 82%
- Compliance Reporting: 58%
- Shopping Cart: 34%

💰 REVENUE METRICS
- Certificate Purchases: $927.20
- Subscription Revenue: $2,340.00
- Average Order Value: $47.50
- Cart Conversion Rate: 68%

🔧 SYSTEM STATUS
- Uptime: 99.8%
- Average Response Time: 245ms
- Database Performance: Excellent
- Email Delivery Rate: 98.5%

📈 GROWTH INSIGHTS
- Week-over-week signup growth: +15%
- Mobile usage increased: +23%
- Customer satisfaction: 4.8/5.0
- Support ticket resolution: <2 hours

Next Week Focus:
- Expand OSHA training library
- Improve mobile experience
- Launch volume discount promotions
- Enhance AI document accuracy`;

    setSummary(sampleSummary);
  };

  const sendSummary = async () => {
    if (!summary.trim()) {
      toast({
        title: "Error",
        description: "Please enter a summary to send",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiRequest('POST', '/api/send-summary', {
        summary: summary.trim()
      });

      if (response.ok) {
        const data = await response.json();
        setLastSent(new Date().toLocaleString());
        
        toast({
          title: "Email Sent Successfully",
          description: `Weekly summary sent via Brevo (Message ID: ${data.messageId})`
        });

        // Clear the summary after successful send
        setSummary('');
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Email send error:', error);
      toast({
        title: "Email Send Failed",
        description: "Please check your Brevo API configuration and try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-black/20 backdrop-blur-sm border-blue-700/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Mail className="w-5 h-5 text-emerald-400" />
          Weekly Summary Email Sender
        </CardTitle>
        <CardDescription className="text-blue-100">
          Send professional weekly summaries to administrators via Brevo email service
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {lastSent && (
          <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-900/20 p-3 rounded-lg border border-emerald-500/30">
            <CheckCircle className="w-4 h-4" />
            Last summary sent: {lastSent}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={generateSampleSummary}
              variant="outline"
              size="sm"
              className="bg-blue-600/20 border-blue-500/30 text-white hover:bg-blue-600/40"
            >
              Generate Sample Summary
            </Button>
          </div>

          <Textarea
            placeholder="Enter your weekly summary here or click 'Generate Sample Summary' to see an example..."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={20}
            className="bg-blue-900/60 border-blue-700/50 text-white placeholder-blue-200 font-mono text-sm"
          />

          <div className="flex items-center justify-between">
            <div className="text-blue-200 text-sm">
              Characters: {summary.length} | Lines: {summary.split('\n').length}
            </div>
            
            <Button
              onClick={sendSummary}
              disabled={isLoading || !summary.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Summary
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="bg-blue-900/40 p-4 rounded-lg border border-blue-700/50">
          <h4 className="text-white font-semibold mb-2">Email Configuration</h4>
          <div className="space-y-1 text-blue-200 text-sm">
            <div>• Sender: SafetySync AI (admin@safetysync.ai)</div>
            <div>• Recipient: Admin (you@yourdomain.com)</div>
            <div>• Subject: 📊 Weekly Signup Summary</div>
            <div>• Service: Brevo API Integration</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
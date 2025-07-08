import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Clock, 
  Users, 
  TrendingUp, 
  Eye,
  Send,
  Calendar,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { TRIAL_EMAIL_SEQUENCE, DEMO_EMAIL_SEQUENCE } from "@shared/email-templates";

export default function EmailPreviewPage() {
  const [selectedEmail, setSelectedEmail] = useState(TRIAL_EMAIL_SEQUENCE.emails[0]);
  const [previewMode, setPreviewMode] = useState<'html' | 'text'>('html');

  const replaceVariables = (content: string) => {
    return content
      .replace(/\{\{firstName\}\}/g, 'John')
      .replace(/\{\{fullName\}\}/g, 'John Smith')
      .replace(/\{\{companyName\}\}/g, 'Acme Construction')
      .replace(/\{\{dashboardUrl\}\}/g, 'https://safetysync.ai/dashboard')
      .replace(/\{\{supportUrl\}\}/g, 'https://safetysync.ai/user-guide');
  };

  const formatDelay = (hours: number) => {
    if (hours === 0) return 'Immediate';
    if (hours < 24) return `${hours} hours`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Email Automation Preview</h1>
          <p className="text-gray-600 mt-2">Preview and test your automated email sequences</p>
        </div>

        {/* Email Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Mail className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Sequences</p>
                  <p className="text-2xl font-bold text-gray-900">2</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Emails</p>
                  <p className="text-2xl font-bold text-gray-900">{TRIAL_EMAIL_SEQUENCE.emails.length + DEMO_EMAIL_SEQUENCE.emails.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Open Rate</p>
                  <p className="text-2xl font-bold text-gray-900">67%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Click Rate</p>
                  <p className="text-2xl font-bold text-gray-900">24%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Email Sequence List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Email Sequences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="trial" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="trial">Trial Sequence</TabsTrigger>
                  <TabsTrigger value="demo">Demo Sequence</TabsTrigger>
                </TabsList>
                
                <TabsContent value="trial" className="space-y-4 mt-4">
                  <div className="text-sm text-gray-600 mb-4">
                    {TRIAL_EMAIL_SEQUENCE.emails.length} emails over 90 days
                  </div>
                  {TRIAL_EMAIL_SEQUENCE.emails.map((email, index) => (
                    <div
                      key={email.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedEmail.id === email.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedEmail(email)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{email.subject}</h4>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDelay(email.delay)}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {email.textContent.substring(0, 100)}...
                      </p>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="demo" className="space-y-4 mt-4">
                  <div className="text-sm text-gray-600 mb-4">
                    {DEMO_EMAIL_SEQUENCE.emails.length} emails over 30 days
                  </div>
                  {DEMO_EMAIL_SEQUENCE.emails.map((email, index) => (
                    <div
                      key={email.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedEmail.id === email.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedEmail(email)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{email.subject}</h4>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDelay(email.delay)}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {email.textContent.substring(0, 100)}...
                      </p>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Email Preview */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Email Preview
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={previewMode === 'html' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('html')}
                  >
                    HTML
                  </Button>
                  <Button
                    variant={previewMode === 'text' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('text')}
                  >
                    Text
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Email Headers */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Subject:</span>
                    <div className="mt-1 font-medium">{replaceVariables(selectedEmail.subject)}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Delay:</span>
                    <div className="mt-1">{formatDelay(selectedEmail.delay)}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">From:</span>
                    <div className="mt-1">SafetySync.AI Team &lt;noreply@safetysync.ai&gt;</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">To:</span>
                    <div className="mt-1">John Smith &lt;john@acmeconstruction.com&gt;</div>
                  </div>
                </div>
              </div>

              {/* Email Content */}
              <div className="border rounded-lg">
                {previewMode === 'html' ? (
                  <div 
                    className="p-4 min-h-[500px]"
                    dangerouslySetInnerHTML={{ 
                      __html: replaceVariables(selectedEmail.htmlContent) 
                    }}
                  />
                ) : (
                  <div className="p-4 min-h-[500px] whitespace-pre-wrap font-mono text-sm bg-gray-50">
                    {replaceVariables(selectedEmail.textContent)}
                  </div>
                )}
              </div>

              {/* Email Actions */}
              <div className="mt-6 flex gap-4">
                <Button>
                  <Send className="w-4 h-4 mr-2" />
                  Send Test Email
                </Button>
                <Button variant="outline">
                  Edit Template
                </Button>
                <Button variant="outline">
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Email Performance Stats */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Email Performance by Sequence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium mb-4">Trial User Sequence</h4>
                <div className="space-y-3">
                  {TRIAL_EMAIL_SEQUENCE.emails.map((email, index) => (
                    <div key={email.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium text-sm">{email.subject.substring(0, 40)}...</div>
                        <div className="text-xs text-gray-600">{formatDelay(email.delay)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">72% open</div>
                        <div className="text-xs text-gray-600">28% click</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Demo Request Sequence</h4>
                <div className="space-y-3">
                  {DEMO_EMAIL_SEQUENCE.emails.map((email, index) => (
                    <div key={email.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium text-sm">{email.subject.substring(0, 40)}...</div>
                        <div className="text-xs text-gray-600">{formatDelay(email.delay)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">68% open</div>
                        <div className="text-xs text-gray-600">31% click</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
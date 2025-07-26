import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SummaryEmailSender from '@/components/SummaryEmailSender';
import SignupGraph from '@/components/SignupGraph';
import { Badge } from '@/components/ui/badge';
import { Mail, Settings, Database, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminEmailPage() {
  const isBrevoConfigured = !!import.meta.env.VITE_BREVO_API_KEY;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Email Administration</h1>
          <p className="text-blue-100 text-lg">
            Manage automated email services and weekly summary reports
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-black/20 backdrop-blur-sm border-blue-700/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white text-lg">
                <Settings className="w-5 h-5 text-blue-400" />
                API Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {isBrevoConfigured ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Brevo API Key</span>
                      <Badge variant="outline" className="bg-emerald-900/20 border-emerald-500/30 text-emerald-400">
                        Configured
                      </Badge>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400">Brevo API Key</span>
                      <Badge variant="outline" className="bg-yellow-900/20 border-yellow-500/30 text-yellow-400">
                        Required
                      </Badge>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Email Templates</span>
                  <Badge variant="outline" className="bg-emerald-900/20 border-emerald-500/30 text-emerald-400">
                    Ready
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">API Endpoint</span>
                  <Badge variant="outline" className="bg-emerald-900/20 border-emerald-500/30 text-emerald-400">
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-sm border-blue-700/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white text-lg">
                <Mail className="w-5 h-5 text-blue-400" />
                Email Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-white">Weekly Summaries</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-white">Welcome Emails</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-white">Trial Notifications</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-white">Certificate Alerts</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-sm border-blue-700/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white text-lg">
                <Database className="w-5 h-5 text-blue-400" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-white">Express Server</span>
                  <Badge variant="outline" className="bg-emerald-900/20 border-emerald-500/30 text-emerald-400">
                    Running
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-white">PostgreSQL</span>
                  <Badge variant="outline" className="bg-emerald-900/20 border-emerald-500/30 text-emerald-400">
                    Connected
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-white">API Routes</span>
                  <Badge variant="outline" className="bg-emerald-900/20 border-emerald-500/30 text-emerald-400">
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuration Notice */}
        {!isBrevoConfigured && (
          <Card className="bg-yellow-900/20 backdrop-blur-sm border-yellow-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <AlertCircle className="w-5 h-5" />
                API Key Configuration Required
              </CardTitle>
              <CardDescription className="text-yellow-200">
                To enable email functionality, configure your BREVO_API_KEY in the secrets management system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-yellow-900/40 p-4 rounded-lg border border-yellow-500/30">
                <h4 className="text-yellow-400 font-semibold mb-2">Setup Instructions:</h4>
                <ol className="text-yellow-200 text-sm space-y-1 list-decimal list-inside">
                  <li>Visit <a href="https://app.brevo.com/" target="_blank" rel="noopener" className="underline">app.brevo.com</a> and sign in</li>
                  <li>Navigate to "SMTP & API" in account settings</li>
                  <li>Copy your API key (starts with "xkeysib-...")</li>
                  <li>Add BREVO_API_KEY to your environment secrets</li>
                  <li>Restart the application to activate email services</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Signup Analytics Graph */}
        <SignupGraph />

        {/* Main Email Sender */}
        <SummaryEmailSender />

        {/* Technical Information */}
        <Card className="bg-black/20 backdrop-blur-sm border-blue-700/30">
          <CardHeader>
            <CardTitle className="text-white">Technical Details</CardTitle>
            <CardDescription className="text-blue-100">
              Email service configuration and endpoint information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="text-white font-semibold">API Endpoint</h4>
                <div className="bg-blue-900/60 p-3 rounded font-mono text-blue-200">
                  POST /api/send-summary
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-white font-semibold">Email Provider</h4>
                <div className="bg-blue-900/60 p-3 rounded font-mono text-blue-200">
                  Brevo API v3 (api.brevo.com)
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-white font-semibold">Sender Configuration</h4>
                <div className="bg-blue-900/60 p-3 rounded text-blue-200">
                  SafetySync AI<br />
                  admin@safetysync.ai
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-white font-semibold">Default Recipient</h4>
                <div className="bg-blue-900/60 p-3 rounded text-blue-200">
                  Admin User<br />
                  you@yourdomain.com
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
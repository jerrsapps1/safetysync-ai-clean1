import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, AlertCircle, Globe, Mail, Shield, Search, Send } from "lucide-react";

interface DNSRecord {
  type: string;
  name: string;
  value: string;
  ttl: number;
  priority?: number;
  comment: string;
  status?: "active" | "pending" | "error";
}

const DNS_RECORDS: DNSRecord[] = [
  {
    type: "A",
    name: "@",
    value: "[YOUR_REPLIT_IP]",
    ttl: 300,
    comment: "Primary domain - Get from Replit deployment settings",
    status: "pending"
  },
  {
    type: "A",
    name: "app",
    value: "[YOUR_REPLIT_IP]",
    ttl: 300,
    comment: "Main application subdomain",
    status: "pending"
  },
  {
    type: "A",
    name: "api",
    value: "[YOUR_REPLIT_IP]",
    ttl: 300,
    comment: "API endpoint subdomain",
    status: "pending"
  },
  {
    type: "A",
    name: "admin",
    value: "[YOUR_REPLIT_IP]",
    ttl: 300,
    comment: "Admin portal subdomain",
    status: "pending"
  },
  {
    type: "CNAME",
    name: "www",
    value: "safetysync.ai",
    ttl: 300,
    comment: "WWW redirect to primary domain",
    status: "active"
  },
  {
    type: "MX",
    name: "@",
    value: "safetysync-ai.mail.protection.outlook.com",
    ttl: 3600,
    priority: 0,
    comment: "Microsoft 365 mail server via GoDaddy",
    status: "pending"
  },
  {
    type: "TXT",
    name: "@",
    value: "v=spf1 include:spf.protection.outlook.com -all",
    ttl: 300,
    comment: "SPF record for Microsoft 365 email authentication",
    status: "pending"
  },
  {
    type: "CNAME",
    name: "autodiscover",
    value: "autodiscover.outlook.com",
    ttl: 300,
    comment: "Microsoft 365 autodiscover for email client setup",
    status: "pending"
  },
  {
    type: "TXT",
    name: "@",
    value: "google-site-verification=[GET_FROM_SEARCH_CONSOLE]",
    ttl: 300,
    comment: "Google Search Console verification",
    status: "pending"
  }
];

const VERIFICATION_SERVICES = [
  {
    name: "Google Search Console",
    url: "https://search.google.com/search-console",
    icon: Search,
    description: "Add property: safetysync.ai → Domain verification → Copy TXT record",
    recordType: "TXT",
    recordName: "@",
    recordPrefix: "google-site-verification="
  },
  {
    name: "Facebook Business",
    url: "https://business.facebook.com",
    icon: Globe,
    description: "Brand Safety → Domains → Add safetysync.ai → Copy verification code",
    recordType: "TXT",
    recordName: "@",
    recordPrefix: "facebook-domain-verification="
  },
  {
    name: "Microsoft Bing",
    url: "https://www.bing.com/webmasters",
    icon: Search,
    description: "Add site: safetysync.ai → DNS verification → Copy code",
    recordType: "TXT",
    recordName: "@",
    recordPrefix: "MS="
  },
  {
    name: "Google Workspace",
    url: "https://workspace.google.com",
    icon: Mail,
    description: "Add domain → Verify ownership → Configure MX records",
    recordType: "MX",
    recordName: "@",
    recordPrefix: "ASPMX.L.GOOGLE.COM"
  }
];

export default function DNSManagement() {
  const [serverIP, setServerIP] = useState("");
  const [verificationCodes, setVerificationCodes] = useState<Record<string, string>>({});
  const [copiedRecord, setCopiedRecord] = useState<string | null>(null);

  const handleCopyRecord = (record: DNSRecord) => {
    const recordText = `${record.type}\t${record.name}\t${record.value}${record.priority ? `\t${record.priority}` : ""}\t${record.ttl}`;
    navigator.clipboard.writeText(recordText);
    setCopiedRecord(`${record.type}-${record.name}`);
    setTimeout(() => setCopiedRecord(null), 2000);
  };

  const updateRecordValue = (recordType: string, name: string, newValue: string) => {
    // This would update the DNS record in a real implementation
    console.log(`Updating ${recordType} record ${name} to ${newValue}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const generateDNSRecords = () => {
    return DNS_RECORDS.map(record => ({
      ...record,
      value: record.value.includes("[YOUR_REPLIT_IP]") 
        ? record.value.replace("[YOUR_REPLIT_IP]", serverIP || "[YOUR_REPLIT_IP]")
        : record.value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            DNS Management - SafetySync.AI
          </CardTitle>
          <CardDescription>
            Configure DNS records for your SafetySync.AI domain. Update the values below with your actual server information.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="setup">Quick Setup</TabsTrigger>
          <TabsTrigger value="records">DNS Records</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="status">Status Check</TabsTrigger>
          <TabsTrigger value="email-test">Email Test</TabsTrigger>
        </TabsList>

        {/* Quick Setup Tab */}
        <TabsContent value="setup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Get Your Server Information</CardTitle>
              <CardDescription>
                Get your server IP or CNAME from your hosting provider
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>For Replit:</strong> Go to your deployment dashboard → Domains → Copy the IP address or CNAME target
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <Label htmlFor="server-ip">Server IP Address or CNAME Target</Label>
                <Input
                  id="server-ip"
                  placeholder="192.168.1.100 or your-repl-name.username.repl.co"
                  value={serverIP}
                  onChange={(e) => setServerIP(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={() => updateRecordValue("A", "@", serverIP)}
                disabled={!serverIP}
              >
                Update DNS Records with This IP
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Step 2: Email Service Setup</CardTitle>
              <CardDescription>
                Configure email service for admin@safetysync.ai
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  <strong>✅ Configured:</strong> Microsoft 365 email service via GoDaddy
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <p className="text-sm text-blue-500">
                  Your email service is already configured with Microsoft 365 through GoDaddy. 
                  Make sure to add the MX and SPF records shown in the DNS Records tab.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" onClick={() => window.open("https://admin.microsoft.com", "_blank")}>
                    Microsoft 365 Admin Center
                  </Button>
                  <Button variant="outline" onClick={() => window.open("https://dcc.godaddy.com/manage/", "_blank")}>
                    GoDaddy Domain Management
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DNS Records Tab */}
        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>DNS Records Configuration</CardTitle>
              <CardDescription>
                Complete DNS records for SafetySync.AI domain setup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {generateDNSRecords().map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{record.type}</Badge>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {record.name === "@" ? "safetysync.ai" : `${record.name}.safetysync.ai`}
                        </code>
                        {getStatusBadge(record.status || "pending")}
                      </div>
                      <div className="text-sm text-blue-500 mb-1">
                        <strong>Value:</strong> {record.value}
                        {record.priority && <span> (Priority: {record.priority})</span>}
                      </div>
                      <div className="text-xs text-blue-400">{record.comment}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyRecord(record)}
                      className="ml-2"
                    >
                      {copiedRecord === `${record.type}-${record.name}` ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Verification Tab */}
        <TabsContent value="verification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Domain Verification Services</CardTitle>
              <CardDescription>
                Set up domain verification for analytics and business tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {VERIFICATION_SERVICES.map((service, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <service.icon className="w-5 h-5" />
                      <h3 className="font-medium">{service.name}</h3>
                    </div>
                    <p className="text-sm text-blue-500 mb-3">{service.description}</p>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder={`Enter ${service.name} verification code`}
                        value={verificationCodes[service.name] || ""}
                        onChange={(e) => setVerificationCodes({
                          ...verificationCodes,
                          [service.name]: e.target.value
                        })}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        onClick={() => window.open(service.url, "_blank")}
                      >
                        Get Code
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Status Check Tab */}
        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>DNS Status Check</CardTitle>
              <CardDescription>
                Check the current status of your DNS records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    DNS propagation can take 24-48 hours. Check status with online tools like dnschecker.org
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => window.open("https://dnschecker.org", "_blank")}
                  >
                    Check DNS Propagation
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => window.open("https://www.ssllabs.com/ssltest/", "_blank")}
                  >
                    Test SSL Certificate
                  </Button>
                </div>
                
                <div className="text-sm text-blue-500">
                  <h4 className="font-medium mb-2">Testing Commands:</h4>
                  <code className="block bg-gray-100 p-2 rounded text-xs">
                    dig safetysync.ai<br/>
                    dig app.safetysync.ai<br/>
                    dig api.safetysync.ai<br/>
                    curl -I https://safetysync.ai
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email-test" className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Testing
            </h3>
            <p className="text-blue-500 mb-6">
              Test your Microsoft 365 email setup after DNS records have propagated (usually 15-30 minutes).
            </p>
            
            <EmailTestForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmailTestForm() {
  const [formData, setFormData] = useState({
    to: '',
    subject: 'SafetySync.AI Email Test',
    testType: 'basic'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to send test email. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="to" className="block text-sm font-medium text-blue-600 mb-1">
          Send To Email
        </label>
        <input
          type="email"
          id="to"
          value={formData.to}
          onChange={(e) => setFormData(prev => ({ ...prev, to: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="admin@safetysync.ai"
          required
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-blue-600 mb-1">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          value={formData.subject}
          onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="testType" className="block text-sm font-medium text-blue-600 mb-1">
          Email Template
        </label>
        <select
          id="testType"
          value={formData.testType}
          onChange={(e) => setFormData(prev => ({ ...prev, testType: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="basic">Basic Email Test</option>
          <option value="welcome">Welcome Email Template</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Test Email
          </>
        )}
      </button>

      {result && (
        <div className={`p-4 rounded-md ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <p className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
            {result.message}
          </p>
        </div>
      )}
    </form>
  );
}
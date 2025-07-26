import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Separator } from './separator';
import { Code, Copy, Check, ExternalLink, Key, Database, Shield, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiDocumentationProps {
  userTier?: string;
}

export function ApiDocumentation({ userTier = 'free_trial' }: ApiDocumentationProps) {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
    toast({
      title: "Copied to clipboard",
      description: "API endpoint copied successfully",
      duration: 2000,
    });
  };

  const endpoints = [
    {
      category: 'Authentication',
      methods: [
        {
          method: 'POST',
          endpoint: '/api/auth/login',
          description: 'Authenticate user and get access token',
          tier: 'basic',
          example: `curl -X POST https://api.safetysync.ai/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email": "user@company.com", "password": "secure_password"}'`,
          response: `{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 123,
    "email": "user@company.com",
    "name": "John Doe",
    "company": "Acme Corp"
  }
}`
        },
        {
          method: 'POST',
          endpoint: '/api/auth/refresh',
          description: 'Refresh expired access token',
          tier: 'basic',
          example: `curl -X POST https://api.safetysync.ai/auth/refresh \\
  -H "Authorization: Bearer YOUR_REFRESH_TOKEN"`,
          response: `{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`
        }
      ]
    },
    {
      category: 'Compliance Reports',
      methods: [
        {
          method: 'GET',
          endpoint: '/api/compliance/reports',
          description: 'Retrieve all compliance reports for organization',
          tier: 'professional',
          example: `curl -X GET "https://api.safetysync.ai/compliance/reports?page=1&limit=10" \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"`,
          response: `{
  "success": true,
  "data": [
    {
      "id": 456,
      "reportName": "Q4 Safety Training Compliance",
      "reportType": "full",
      "generatedAt": "2025-01-15T10:30:00Z",
      "complianceScore": 94.5,
      "totalEmployees": 250,
      "compliantEmployees": 236
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}`
        },
        {
          method: 'POST',
          endpoint: '/api/compliance/reports/generate',
          description: 'Generate new compliance report',
          tier: 'professional',
          example: `curl -X POST https://api.safetysync.ai/compliance/reports/generate \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "reportType": "full",
    "reportName": "Monthly Safety Audit",
    "periodStart": "2025-01-01",
    "periodEnd": "2025-01-31"
  }'`,
          response: `{
  "success": true,
  "reportId": 789,
  "status": "generating",
  "estimatedCompletion": "2025-01-15T10:35:00Z"
}`
        }
      ]
    },
    {
      category: 'Employee Management',
      methods: [
        {
          method: 'GET',
          endpoint: '/api/employees',
          description: 'List all employees and their compliance status',
          tier: 'basic',
          example: `curl -X GET "https://api.safetysync.ai/employees?department=manufacturing&status=pending" \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"`,
          response: `{
  "success": true,
  "data": [
    {
      "id": 101,
      "name": "Jane Smith",
      "email": "jane.smith@company.com",
      "department": "Manufacturing",
      "hireDate": "2024-06-15",
      "complianceStatus": "compliant",
      "certifications": [
        {
          "name": "OSHA 10-Hour Construction",
          "status": "active",
          "expiresAt": "2025-06-15"
        }
      ]
    }
  ]
}`
        },
        {
          method: 'POST',
          endpoint: '/api/employees',
          description: 'Add new employee to compliance tracking',
          tier: 'basic',
          example: `curl -X POST https://api.safetysync.ai/employees \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Mike Johnson",
    "email": "mike.johnson@company.com",
    "department": "Warehouse",
    "hireDate": "2025-01-15",
    "requiredCertifications": ["OSHA 10-Hour General", "Forklift Safety"]
  }'`,
          response: `{
  "success": true,
  "employee": {
    "id": 102,
    "name": "Mike Johnson",
    "complianceStatus": "pending",
    "trainingPlan": "assigned"
  }
}`
        }
      ]
    },
    {
      category: 'Training Management',
      methods: [
        {
          method: 'GET',
          endpoint: '/api/training/courses',
          description: 'List available training courses',
          tier: 'professional',
          example: `curl -X GET "https://api.safetysync.ai/training/courses?category=safety" \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"`,
          response: `{
  "success": true,
  "courses": [
    {
      "id": "osha-10-construction",
      "name": "OSHA 10-Hour Construction Safety",
      "duration": "10 hours",
      "category": "safety",
      "compliance": ["OSHA 1926"],
      "validityPeriod": "1 year"
    }
  ]
}`
        },
        {
          method: 'POST',
          endpoint: '/api/training/assign',
          description: 'Assign training course to employee',
          tier: 'professional',
          example: `curl -X POST https://api.safetysync.ai/training/assign \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "employeeId": 101,
    "courseId": "osha-10-construction",
    "dueDate": "2025-02-15"
  }'`,
          response: `{
  "success": true,
  "assignment": {
    "id": 501,
    "status": "assigned",
    "dueDate": "2025-02-15",
    "notificationsSent": true
  }
}`
        }
      ]
    },
    {
      category: 'Webhooks',
      methods: [
        {
          method: 'POST',
          endpoint: '/api/webhooks/configure',
          description: 'Configure webhook endpoints for real-time notifications',
          tier: 'enterprise',
          example: `curl -X POST https://api.safetysync.ai/webhooks/configure \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://yourapp.com/safetysync-webhook",
    "events": ["certification.expired", "training.completed", "compliance.violation"],
    "secret": "your_webhook_secret"
  }'`,
          response: `{
  "success": true,
  "webhook": {
    "id": "wh_abc123",
    "url": "https://yourapp.com/safetysync-webhook",
    "status": "active",
    "events": ["certification.expired", "training.completed", "compliance.violation"]
  }
}`
        }
      ]
    }
  ];

  const getTierBadge = (tier: string) => {
    const colors = {
      basic: 'bg-blue-100 text-blue-800',
      professional: 'bg-purple-100 text-purple-800',
      enterprise: 'bg-orange-100 text-orange-800'
    };
    return (
      <Badge className={`${colors[tier as keyof typeof colors]} text-xs`}>
        {tier.charAt(0).toUpperCase() + tier.slice(1)}
      </Badge>
    );
  };

  const canAccessTier = (endpointTier: string) => {
    const tierHierarchy = { free_trial: 0, basic: 1, professional: 2, enterprise: 3 };
    return tierHierarchy[userTier as keyof typeof tierHierarchy] >= tierHierarchy[endpointTier as keyof typeof tierHierarchy];
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-blue-800">SafetySync.AI API Documentation</h1>
        <p className="text-lg text-blue-500 max-w-2xl mx-auto">
          Integrate OSHA compliance tracking directly into your existing workflows with our comprehensive REST API.
        </p>
        <div className="flex justify-center items-center gap-4 text-sm text-blue-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Enterprise Security</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>Real-time Sync</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            <span>99.9% Uptime</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="getting-started" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="getting-started" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Quick Start Guide
              </CardTitle>
              <CardDescription>
                Get up and running with the SafetySync.AI API in minutes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">1. Get Your API Key</h4>
                  <p className="text-sm text-blue-500">
                    Generate an API key from your SafetySync.AI dashboard under Account Settings → API Access.
                  </p>
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <strong>Your Tier:</strong> {userTier.charAt(0).toUpperCase() + userTier.slice(1)}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">2. Base URL</h4>
                  <div className="bg-gray-50 p-3 rounded-lg border">
                    <code className="text-sm">https://api.safetysync.ai</code>
                  </div>
                  <p className="text-sm text-blue-500">
                    All API requests should be made to this base URL with HTTPS.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">3. Authentication Headers</h4>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <pre className="text-sm">
{`Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
X-API-Version: 2025-01`}
                  </pre>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">4. Example Request</h4>
                <div className="bg-blue-800 text-green-400 p-4 rounded-lg">
                  <pre className="text-sm">
{`curl -X GET "https://api.safetysync.ai/employees" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="authentication" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Methods</CardTitle>
              <CardDescription>
                SafetySync.AI supports multiple authentication methods for different use cases
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    API Key Authentication
                  </h4>
                  <p className="text-sm text-blue-500">
                    Use API keys for server-to-server integrations and automated scripts.
                  </p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <code className="text-sm">Authorization: Bearer sk_live_abc123...</code>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    JWT Token Authentication
                  </h4>
                  <p className="text-sm text-blue-500">
                    Use JWT tokens for user session management in web applications.
                  </p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <code className="text-sm">Authorization: Bearer eyJhbGciOiJIUzI1...</code>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Rate Limits</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <h5 className="font-medium text-blue-900">Basic Tier</h5>
                    <p className="text-sm text-blue-700">1,000 requests/hour</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                    <h5 className="font-medium text-purple-900">Professional Tier</h5>
                    <p className="text-sm text-purple-700">5,000 requests/hour</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                    <h5 className="font-medium text-orange-900">Enterprise Tier</h5>
                    <p className="text-sm text-orange-700">25,000 requests/hour</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-6">
          {endpoints.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle>{category.category}</CardTitle>
                <CardDescription>
                  {category.category === 'Authentication' && 'Manage user sessions and API access'}
                  {category.category === 'Compliance Reports' && 'Generate and retrieve compliance reports'}
                  {category.category === 'Employee Management' && 'Manage employees and their compliance status'}
                  {category.category === 'Training Management' && 'Assign and track training courses'}
                  {category.category === 'Webhooks' && 'Configure real-time event notifications'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {category.methods.map((method, methodIndex) => (
                  <div key={methodIndex} className={`space-y-4 ${!canAccessTier(method.tier) ? 'opacity-50' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant={method.method === 'GET' ? 'default' : method.method === 'POST' ? 'secondary' : 'outline'}>
                          {method.method}
                        </Badge>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">{method.endpoint}</code>
                        {getTierBadge(method.tier)}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(method.example, method.endpoint)}
                        disabled={!canAccessTier(method.tier)}
                      >
                        {copiedEndpoint === method.endpoint ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    
                    <p className="text-sm text-blue-500">{method.description}</p>
                    
                    {!canAccessTier(method.tier) && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <p className="text-sm text-orange-800">
                          This endpoint requires {method.tier.charAt(0).toUpperCase() + method.tier.slice(1)} tier or higher.
                        </p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium mb-2">Example Request</h5>
                        <div className="bg-blue-800 text-green-400 p-3 rounded-lg overflow-x-auto">
                          <pre className="text-xs">{method.example}</pre>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-2">Example Response</h5>
                        <div className="bg-gray-50 p-3 rounded-lg overflow-x-auto">
                          <pre className="text-xs text-blue-600">{method.response}</pre>
                        </div>
                      </div>
                    </div>
                    
                    {methodIndex < category.methods.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Events</CardTitle>
              <CardDescription>
                Get real-time notifications when important events occur in your SafetySync.AI account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Available Events</h4>
                  <div className="space-y-2">
                    {[
                      { event: 'employee.created', description: 'New employee added to system' },
                      { event: 'certification.expired', description: 'Employee certification has expired' },
                      { event: 'training.completed', description: 'Employee completed training course' },
                      { event: 'compliance.violation', description: 'Compliance violation detected' },
                      { event: 'report.generated', description: 'New compliance report available' }
                    ].map((item, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <code className="text-sm font-medium">{item.event}</code>
                        <p className="text-xs text-blue-500 mt-1">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Webhook Payload Example</h4>
                  <div className="bg-blue-800 text-green-400 p-4 rounded-lg">
                    <pre className="text-xs">
{`{
  "event": "certification.expired",
  "timestamp": "2025-01-15T10:30:00Z",
  "data": {
    "employee": {
      "id": 101,
      "name": "Jane Smith",
      "email": "jane@company.com"
    },
    "certification": {
      "name": "OSHA 10-Hour Construction",
      "expiredAt": "2025-01-15T00:00:00Z"
    }
  },
  "webhook_id": "wh_abc123"
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-800">Need Help Getting Started?</h3>
            <p className="text-blue-500">Our integration team can help you get up and running quickly.</p>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
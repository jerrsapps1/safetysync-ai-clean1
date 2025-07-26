import { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { ApiDocumentation } from "@/components/ui/api-documentation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Code, 
  Key, 
  Shield, 
  Zap, 
  Database, 
  BookOpen, 
  Download, 
  Github, 
  Terminal,
  Puzzle,
  Globe,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";

export default function DeveloperPortal() {
  const [selectedLibrary, setSelectedLibrary] = useState('javascript');
  const [apiKey, setApiKey] = useState('');
  const [testEndpoint, setTestEndpoint] = useState('/api/employees');

  const sdkLibraries = [
    {
      name: 'JavaScript/Node.js',
      id: 'javascript',
      icon: '🟨',
      install: 'npm install safetysync-api',
      example: `import { SafetySyncAPI } from 'safetysync-api';

const client = new SafetySyncAPI({
  apiKey: 'your_api_key',
  baseUrl: 'https://api.safetysync.ai'
});

// Get all employees
const employees = await client.employees.list();

// Generate compliance report
const report = await client.compliance.generateReport({
  reportType: 'full',
  periodStart: '2025-01-01',
  periodEnd: '2025-01-31'
});`
    },
    {
      name: 'Python',
      id: 'python',
      icon: '🐍',
      install: 'pip install safetysync-python',
      example: `from safetysync import SafetySyncClient

client = SafetySyncClient(
    api_key="your_api_key",
    base_url="https://api.safetysync.ai"
)

# Get all employees
employees = client.employees.list()

# Generate compliance report
report = client.compliance.generate_report(
    report_type="full",
    period_start="2025-01-01",
    period_end="2025-01-31"
)`
    },
    {
      name: 'PHP',
      id: 'php',
      icon: '🐘',
      install: 'composer require safetysync/api-client',
      example: `<?php
use SafetySync\\ApiClient;

$client = new ApiClient([
    'api_key' => 'your_api_key',
    'base_url' => 'https://api.safetysync.ai'
]);

// Get all employees
$employees = $client->employees()->list();

// Generate compliance report
$report = $client->compliance()->generateReport([
    'reportType' => 'full',
    'periodStart' => '2025-01-01',
    'periodEnd' => '2025-01-31'
]);`
    },
    {
      name: 'C# / .NET',
      id: 'csharp',
      icon: '🟦',
      install: 'dotnet add package SafetySync.Api',
      example: `using SafetySync.Api;

var client = new SafetySyncClient(
    apiKey: "your_api_key",
    baseUrl: "https://api.safetysync.ai"
);

// Get all employees
var employees = await client.Employees.ListAsync();

// Generate compliance report
var report = await client.Compliance.GenerateReportAsync(new {
    ReportType = "full",
    PeriodStart = "2025-01-01",
    PeriodEnd = "2025-01-31"
});`
    }
  ];

  const integrationExamples = [
    {
      name: 'HRIS Integration',
      description: 'Sync employee data from your HR system',
      difficulty: 'Easy',
      time: '30 minutes',
      tags: ['Employee Management', 'Data Sync'],
      example: `// Sync employees from HRIS to SafetySync
const hrEmployees = await hrisApi.getEmployees();

for (const employee of hrEmployees) {
  await safetySyncClient.employees.create({
    name: employee.fullName,
    email: employee.workEmail,
    department: employee.department,
    hireDate: employee.startDate,
    requiredCertifications: getCertificationsByRole(employee.role)
  });
}`
    },
    {
      name: 'Training Platform Webhook',
      description: 'Automatically update certifications when training is completed',
      difficulty: 'Medium',
      time: '1 hour',
      tags: ['Webhooks', 'Training', 'Automation'],
      example: `// Express.js webhook endpoint
app.post('/training-completed', async (req, res) => {
  const { employeeEmail, courseName, completionDate } = req.body;
  
  await safetySyncClient.certifications.update({
    employeeEmail,
    certification: courseName,
    status: 'completed',
    completedAt: completionDate,
    expiresAt: calculateExpirationDate(courseName, completionDate)
  });
  
  res.status(200).send('OK');
});`
    },
    {
      name: 'Automated Compliance Reports',
      description: 'Generate and email monthly compliance reports',
      difficulty: 'Medium',
      time: '45 minutes',
      tags: ['Reports', 'Automation', 'Email'],
      example: `// Scheduled job for monthly reports
cron.schedule('0 9 1 * *', async () => {
  const report = await safetySyncClient.compliance.generateReport({
    reportType: 'summary',
    periodStart: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
    periodEnd: moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')
  });
  
  await emailService.send({
    to: 'safety-team@company.com',
    subject: 'Monthly Safety Compliance Report',
    attachment: report.pdfUrl
  });
});`
    }
  ];

  const statusEndpoints = [
    { endpoint: '/api/auth', status: 'operational', latency: '45ms' },
    { endpoint: '/api/employees', status: 'operational', latency: '62ms' },
    { endpoint: '/api/compliance', status: 'operational', latency: '128ms' },
    { endpoint: '/api/training', status: 'operational', latency: '89ms' },
    { endpoint: '/api/webhooks', status: 'operational', latency: '34ms' }
  ];

  return (
    <div className="min-h-screen bg-blue-50">
      <Navigation 
        onTrialClick={() => {}} 
        onDemoClick={() => {}} 
        onLoginClick={() => {}} 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Code className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-blue-800 mb-4">
            SafetySync.AI Developer Portal
          </h1>
          <p className="text-xl text-blue-500 max-w-3xl mx-auto mb-8">
            Build powerful OSHA compliance integrations with our comprehensive API, SDKs, and developer tools.
            Automate safety management across your entire technology stack.
          </p>
          
          <div className="flex justify-center items-center gap-8 text-sm text-blue-400">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              <span>Global CDN</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-500" />
              <span>&lt;200ms Response</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="quick-start" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="quick-start">Quick Start</TabsTrigger>
            <TabsTrigger value="api-docs">API Reference</TabsTrigger>
            <TabsTrigger value="sdks">SDKs & Libraries</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="status">API Status</TabsTrigger>
          </TabsList>

          <TabsContent value="quick-start" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5 text-blue-600" />
                    1. Get API Key
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-500 mb-4">
                    Generate your API key from your dashboard to authenticate requests.
                  </p>
                  <Button className="w-full">
                    Generate API Key
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5 text-green-600" />
                    2. Install SDK
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-500 mb-4">
                    Choose from our official SDKs for popular programming languages.
                  </p>
                  <div className="bg-blue-800 text-green-400 p-2 rounded text-xs">
                    npm install safetysync-api
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-purple-600" />
                    3. Make First Call
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-500 mb-4">
                    Test your integration with a simple API call to list employees.
                  </p>
                  <Button variant="outline" className="w-full">
                    Test API Call
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>API Testing Playground</CardTitle>
                <CardDescription>
                  Test API endpoints directly from your browser
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <Input 
                      id="api-key"
                      type="password"
                      placeholder="sk_live_..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endpoint">Endpoint</Label>
                    <select 
                      id="endpoint" 
                      className="w-full px-3 py-2 border border-blue-300 rounded-md"
                      value={testEndpoint}
                      onChange={(e) => setTestEndpoint(e.target.value)}
                    >
                      <option value="/api/employees">GET /api/employees</option>
                      <option value="/api/compliance/reports">GET /api/compliance/reports</option>
                      <option value="/api/training/courses">GET /api/training/courses</option>
                    </select>
                  </div>
                </div>
                <Button className="w-full md:w-auto">
                  <Terminal className="w-4 h-4 mr-2" />
                  Send Test Request
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Documentation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a href="#" className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <h4 className="font-medium">API Reference</h4>
                    <p className="text-sm text-blue-500">Complete endpoint documentation with examples</p>
                  </a>
                  <a href="#" className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <h4 className="font-medium">Authentication Guide</h4>
                    <p className="text-sm text-blue-500">Learn about API keys, JWT tokens, and security</p>
                  </a>
                  <a href="#" className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <h4 className="font-medium">Webhook Documentation</h4>
                    <p className="text-sm text-blue-500">Set up real-time event notifications</p>
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Github className="w-5 h-5" />
                    Code Examples
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a href="#" className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <h4 className="font-medium">GitHub Repository</h4>
                    <p className="text-sm text-blue-500">Sample applications and integration examples</p>
                  </a>
                  <a href="#" className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <h4 className="font-medium">Postman Collection</h4>
                    <p className="text-sm text-blue-500">Ready-to-use API calls for testing</p>
                  </a>
                  <a href="#" className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <h4 className="font-medium">Integration Templates</h4>
                    <p className="text-sm text-blue-500">Common integration patterns and workflows</p>
                  </a>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="api-docs">
            <ApiDocumentation userTier="professional" />
          </TabsContent>

          <TabsContent value="sdks" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Official SDKs & Libraries</h2>
              <p className="text-blue-500 max-w-2xl mx-auto">
                Use our official SDKs to integrate SafetySync.AI into your applications with minimal code.
                All SDKs are open source and actively maintained.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {sdkLibraries.map((library) => (
                <Card 
                  key={library.id} 
                  className={`cursor-pointer transition-all ${selectedLibrary === library.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'}`}
                  onClick={() => setSelectedLibrary(library.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">{library.icon}</div>
                    <h3 className="font-medium">{library.name}</h3>
                    <Badge variant="outline" className="mt-2">
                      Official
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>
                  {sdkLibraries.find(lib => lib.id === selectedLibrary)?.name} SDK
                </CardTitle>
                <CardDescription>
                  Installation and usage example for {sdkLibraries.find(lib => lib.id === selectedLibrary)?.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Installation</h4>
                  <div className="bg-blue-800 text-green-400 p-3 rounded-lg">
                    <code>{sdkLibraries.find(lib => lib.id === selectedLibrary)?.install}</code>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Example Usage</h4>
                  <div className="bg-blue-50 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm text-blue-600">
                      {sdkLibraries.find(lib => lib.id === selectedLibrary)?.example}
                    </pre>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline">
                    <Github className="w-4 h-4 mr-2" />
                    View on GitHub
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download Examples
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Integration Examples</h2>
              <p className="text-blue-500 max-w-2xl mx-auto">
                Common integration patterns to help you get started quickly with SafetySync.AI.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {integrationExamples.map((integration, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <Badge variant={integration.difficulty === 'Easy' ? 'default' : 'secondary'}>
                        {integration.difficulty}
                      </Badge>
                    </div>
                    <CardDescription>{integration.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-blue-500">
                      <Clock className="w-4 h-4" />
                      <span>{integration.time}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {integration.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <pre className="text-xs text-blue-600 overflow-x-auto">
                        {integration.example}
                      </pre>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <BookOpen className="w-4 h-4 mr-2" />
                      View Full Tutorial
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Puzzle className="w-5 h-5" />
                  Popular Integrations
                </CardTitle>
                <CardDescription>
                  Pre-built integrations with popular business tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Slack', status: 'Available' },
                    { name: 'Microsoft Teams', status: 'Available' },
                    { name: 'Salesforce', status: 'Beta' },
                    { name: 'Workday', status: 'Coming Soon' },
                    { name: 'BambooHR', status: 'Available' },
                    { name: 'Jira', status: 'Available' },
                    { name: 'Monday.com', status: 'Beta' },
                    { name: 'Zapier', status: 'Available' }
                  ].map((integration, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium text-sm">{integration.name}</span>
                      <Badge 
                        variant={integration.status === 'Available' ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {integration.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="status" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">API Status Dashboard</h2>
              <p className="text-blue-500">
                Real-time status and performance metrics for SafetySync.AI API services
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="font-semibold text-green-700">All Systems Operational</h3>
                  <p className="text-sm text-blue-500">99.9% Uptime</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">156ms</div>
                  <h3 className="font-medium">Avg Response Time</h3>
                  <p className="text-sm text-blue-500">Last 24 hours</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">1.2M</div>
                  <h3 className="font-medium">API Calls Today</h3>
                  <p className="text-sm text-blue-500">+12% from yesterday</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">0</div>
                  <h3 className="font-medium">Active Incidents</h3>
                  <p className="text-sm text-blue-500">Last 30 days</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Service Status</CardTitle>
                <CardDescription>
                  Current operational status of all API endpoints
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {statusEndpoints.map((endpoint, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="font-mono text-sm">{endpoint.endpoint}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="text-green-700 border-green-300">
                          Operational
                        </Badge>
                        <span className="text-sm text-blue-500">{endpoint.latency}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">API v2025.1 Released</p>
                      <p className="text-sm text-blue-500">New webhook events and improved rate limiting</p>
                      <p className="text-xs text-blue-400">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Maintenance Window Completed</p>
                      <p className="text-sm text-blue-500">Database performance optimizations applied</p>
                      <p className="text-xs text-blue-400">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">New SDK Released</p>
                      <p className="text-sm text-blue-500">Python SDK v2.1.0 with async support</p>
                      <p className="text-xs text-blue-400">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
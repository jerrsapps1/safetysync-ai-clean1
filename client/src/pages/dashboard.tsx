import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { ComplianceReportGenerator } from "@/components/ui/compliance-report-generator";
import { AICloneDetector } from "@/components/ui/ai-clone-detector";
import { CollaborationLayer } from "@/components/ui/collaboration-layer";
import { AIQuickActions } from "@/components/ui/ai-quick-actions";
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Users, 
  FileText, 
  Calendar,
  TrendingUp,
  Shield,
  Bell,
  Download,
  Plus,
  Search,
  Home,
  ArrowLeft,
  Brain,
  Eye,
  Palette,
  Upload,
  RefreshCw,
  Building,
  MapPin,
  Edit,
  BookOpen
} from "lucide-react";

interface ComplianceRecord {
  id: number;
  employeeName: string;
  training: string;
  status: 'completed' | 'pending' | 'expired';
  dueDate: string;
  completedDate?: string;
  certificateUrl?: string;
}

interface DashboardStats {
  totalEmployees: number;
  compliantEmployees: number;
  pendingTraining: number;
  expiringCertifications: number;
  complianceScore: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 45,
    compliantEmployees: 42,
    pendingTraining: 8,
    expiringCertifications: 3,
    complianceScore: 93
  });

  const [records, setRecords] = useState<ComplianceRecord[]>([
    {
      id: 1,
      employeeName: "Sarah Johnson",
      training: "OSHA 10-Hour Construction",
      status: "completed",
      dueDate: "2025-12-15",
      completedDate: "2024-11-20",
      certificateUrl: "#"
    },
    {
      id: 2,
      employeeName: "Mike Chen",
      training: "Hazard Communication",
      status: "pending",
      dueDate: "2025-01-30"
    },
    {
      id: 3,
      employeeName: "Lisa Rodriguez",
      training: "Fall Protection",
      status: "expired",
      dueDate: "2024-12-01"
    },
    {
      id: 4,
      employeeName: "David Kim",
      training: "Respiratory Protection",
      status: "completed",
      dueDate: "2025-06-15",
      completedDate: "2024-05-10",
      certificateUrl: "#"
    },
    {
      id: 5,
      employeeName: "Emma Thompson",
      training: "Lockout/Tagout",
      status: "pending",
      dueDate: "2025-02-20"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'expired': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* AI Quick Actions Sidebar */}
      <AIQuickActions 
        currentPage="dashboard"
        onActionExecute={(actionId) => {
          console.log('AI Action executed:', actionId);
          // Handle specific actions based on actionId
        }}
      />
      
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SafetySync.AI
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/testimonials">
                <Button variant="ghost" size="sm">Testimonials</Button>
              </Link>
              <Link href="/case-studies">
                <Button variant="ghost" size="sm">Case Studies</Button>
              </Link>
              <Link href="/pricing">
                <Button variant="ghost" size="sm">Pricing</Button>
              </Link>
              <Link href="/user-guide">
                <Button variant="ghost" size="sm">User Guide</Button>
              </Link>
              {/* Admin link hidden from regular users - only visible to admin */}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Compliance Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor and manage your OSHA compliance status in real-time
          </p>
        </div>

        {/* Quick Navigation Helper */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">Getting Started Guide</h3>
                  <p className="text-sm text-blue-700">Follow the tabs in order: Employees → Training → Branding → Reports for optimal setup</p>
                </div>
              </div>
              <Link href="/user-guide">
                <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Full Guide
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Employees</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalEmployees}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Compliant</p>
                  <p className="text-3xl font-bold text-green-600">{stats.compliantEmployees}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Training</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pendingTraining}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                  <p className="text-3xl font-bold text-red-600">{stats.expiringCertifications}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Score */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Overall Compliance Score
            </CardTitle>
            <CardDescription>
              Your organization's current OSHA compliance rating
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Progress value={stats.complianceScore} className="h-3" />
              </div>
              <div className="text-2xl font-bold text-green-600">
                {stats.complianceScore}%
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Excellent compliance! You're above industry average.
            </p>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="generator">Report Generator</TabsTrigger>
            <TabsTrigger value="collaboration">Team Review</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="audit-settings">Audit Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">Sarah Johnson completed OSHA 10-Hour Training</p>
                      <p className="text-sm text-gray-600">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-medium">Mike Chen's Hazard Communication training due in 15 days</p>
                      <p className="text-sm text-gray-600">Yesterday</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-medium">Lisa Rodriguez's Fall Protection certification expired</p>
                      <p className="text-sm text-gray-600">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Real-Time Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Real-Time Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Overall Risk Score */}
                  <div className="bg-gradient-to-r from-green-50 to-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Overall Risk Level</span>
                      <Badge className="bg-yellow-100 text-yellow-800">MODERATE</Badge>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{width: '35%'}}></div>
                      </div>
                      <span className="ml-3 text-sm font-medium">35/100</span>
                    </div>
                  </div>

                  {/* Risk Factors */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                      <span className="text-sm">Expired Certifications</span>
                      <Badge variant="destructive" className="text-xs">HIGH</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                      <span className="text-sm">Training Overdue</span>
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">MEDIUM</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm">Safety Incidents</span>
                      <Badge className="bg-green-100 text-green-800 text-xs">LOW</Badge>
                    </div>
                  </div>

                  {/* AI Recommendations */}
                  <div className="border-t pt-3">
                    <h4 className="text-sm font-medium mb-2">AI Recommendations</h4>
                    <div className="space-y-2 text-xs">
                      <p className="text-gray-600">• Prioritize renewal for 3 expired fall protection certifications</p>
                      <p className="text-gray-600">• Schedule mandatory safety meeting for Manufacturing team</p>
                      <p className="text-gray-600">• Review incident reports from Q4 2024</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {records.filter(r => r.status === 'pending').map(record => (
                    <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{record.employeeName}</p>
                        <p className="text-sm text-gray-600">{record.training}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{record.dueDate}</p>
                        <Badge variant="outline" className="text-xs">
                          Due Soon
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employees" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Employee Certification Records</CardTitle>
                  <div className="flex space-x-2">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="cert-upload"
                      multiple
                    />
                    <Button 
                      variant="outline"
                      onClick={() => document.getElementById('cert-upload')?.click()}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Upload Certificates
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        // Generate CSV data
                        const csvData = records.map(record => ({
                          Employee: record.employeeName,
                          Training: record.training,
                          Status: record.status,
                          'Due Date': record.dueDate,
                          'Completed Date': record.completedDate || 'N/A'
                        }));
                        
                        // Convert to CSV string
                        const headers = Object.keys(csvData[0]).join(',');
                        const rows = csvData.map(row => Object.values(row).join(','));
                        const csvContent = [headers, ...rows].join('\n');
                        
                        // Download CSV
                        const blob = new Blob([csvContent], { type: 'text/csv' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `employee-certifications-${new Date().toISOString().split('T')[0]}.csv`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Employee
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {records.map(record => (
                    <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {record.employeeName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{record.employeeName}</p>
                          <p className="text-sm text-gray-600">{record.training}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">OSHA 10</Badge>
                            <Badge variant="outline" className="text-xs">Safety Training</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Documents</p>
                          <div className="flex space-x-1 mt-1">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <FileText className="w-3 h-3 text-blue-600" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <FileText className="w-3 h-3 text-green-600" />
                            </Button>
                          </div>
                        </div>
                        <Badge className={getStatusColor(record.status)}>
                          {getStatusIcon(record.status)}
                          <span className="ml-1">{record.status.charAt(0).toUpperCase() + record.status.slice(1)}</span>
                        </Badge>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {record.status === 'completed' ? 'Completed' : 'Due'}: {record.completedDate || record.dueDate}
                          </p>
                          <div className="flex space-x-1 mt-2">
                            {record.certificateUrl && (
                              <Button variant="outline" size="sm">
                                <Download className="w-3 h-3 mr-1" />
                                Certificate
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Training Programs</CardTitle>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Training
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "OSHA 10-Hour Construction", enrolled: 12, completed: 10 },
                    { name: "Hazard Communication", enrolled: 8, completed: 6 },
                    { name: "Fall Protection", enrolled: 15, completed: 13 },
                    { name: "Respiratory Protection", enrolled: 6, completed: 5 },
                    { name: "Lockout/Tagout", enrolled: 10, completed: 8 },
                    { name: "Confined Space Entry", enrolled: 4, completed: 3 }
                  ].map((training, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-2">{training.name}</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{training.completed}/{training.enrolled}</span>
                          </div>
                          <Progress value={(training.completed / training.enrolled) * 100} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locations" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Multi-Location Management
                  </CardTitle>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Location
                  </Button>
                </div>
                <CardDescription>
                  Manage compliance across multiple facilities and locations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      name: "Headquarters",
                      address: "123 Main St, New York, NY",
                      employees: 45,
                      compliance: 92,
                      manager: "John Smith",
                      status: "active"
                    },
                    {
                      name: "Manufacturing Plant",
                      address: "456 Industrial Blvd, Detroit, MI",
                      employees: 128,
                      compliance: 87,
                      manager: "Sarah Johnson",
                      status: "active"
                    },
                    {
                      name: "Warehouse East",
                      address: "789 Logistics Dr, Atlanta, GA",
                      employees: 32,
                      compliance: 95,
                      manager: "Mike Wilson",
                      status: "active"
                    }
                  ].map((location, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-medium text-lg">{location.name}</h3>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              {location.address}
                            </div>
                          </div>
                          <Badge 
                            className={location.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                          >
                            {location.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Employees</span>
                            <span className="font-medium">{location.employees}</span>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Compliance Score</span>
                              <span className="font-medium">{location.compliance}%</span>
                            </div>
                            <Progress value={location.compliance} className="h-2" />
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Manager</span>
                            <span className="font-medium">{location.manager}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* Location Analytics */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Cross-Location Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">3</p>
                        <p className="text-sm text-gray-600">Total Locations</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">205</p>
                        <p className="text-sm text-gray-600">Total Employees</p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <p className="text-2xl font-bold text-orange-600">91%</p>
                        <p className="text-sm text-gray-600">Avg Compliance</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">12</p>
                        <p className="text-sm text-gray-600">Pending Items</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Compliance Reports
                </CardTitle>
                <CardDescription>
                  Generate and download audit-ready compliance reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Monthly Compliance Report</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Comprehensive overview of all training and certifications
                      </p>
                      <Button className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Employee Training Summary</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Individual employee training records and certificates
                      </p>
                      <Button variant="outline" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Export Data
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Audit Preparation</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Complete documentation package for OSHA audits
                      </p>
                      <Button variant="outline" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Prepare Audit
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Custom Report</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Build custom reports with specific criteria
                      </p>
                      <Button variant="outline" className="w-full">
                        <Search className="w-4 h-4 mr-2" />
                        Create Custom
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generator" className="space-y-6">
            <ComplianceReportGenerator />
          </TabsContent>

          <TabsContent value="collaboration" className="space-y-6">
            <CollaborationLayer
              documentId="safety-review-2025"
              teamMembers={[
                {
                  id: '1',
                  name: 'Sarah Johnson',
                  role: 'Safety Manager',
                  isOnline: true,
                  avatar: undefined
                },
                {
                  id: '2',
                  name: 'Mike Chen',
                  role: 'Compliance Officer',
                  isOnline: true,
                  avatar: undefined
                },
                {
                  id: '3',
                  name: 'David Wilson',
                  role: 'HR Director',
                  isOnline: false,
                  avatar: undefined,
                  lastSeen: '2 hours ago'
                },
                {
                  id: '4',
                  name: 'Lisa Martinez',
                  role: 'Operations Manager',
                  isOnline: true,
                  avatar: undefined
                },
                {
                  id: '5',
                  name: 'John Smith',
                  role: 'Site Supervisor',
                  isOnline: false,
                  avatar: undefined,
                  lastSeen: '1 day ago'
                }
              ]}
              onAnnotationAdd={(annotation) => {
                console.log('New annotation added:', annotation);
              }}
              onAnnotationUpdate={(annotation) => {
                console.log('Annotation updated:', annotation);
              }}
              onAnnotationDelete={(annotationId) => {
                console.log('Annotation deleted:', annotationId);
              }}
            />
          </TabsContent>

          <TabsContent value="branding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Custom Branding Settings
                </CardTitle>
                <CardDescription>
                  Customize your SafetySync.AI platform with your company branding
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Logo Upload */}
                <div className="space-y-4">
                  <h3 className="font-medium">Company Logo</h3>
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Palette className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">Current Logo</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.svg"
                        className="hidden"
                        id="logo-upload"
                      />
                      <Button 
                        variant="outline"
                        onClick={() => document.getElementById('logo-upload')?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Logo
                      </Button>
                      <p className="text-xs text-gray-500">PNG, JPG, SVG up to 2MB</p>
                    </div>
                  </div>
                </div>

                {/* Color Scheme */}
                <div className="space-y-4">
                  <h3 className="font-medium">Color Scheme</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Primary Color</label>
                      <div className="flex items-center space-x-2">
                        <input type="color" defaultValue="#2563eb" className="w-8 h-8 rounded border" />
                        <input type="text" defaultValue="#2563eb" className="flex-1 px-3 py-2 border rounded text-sm" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Secondary Color</label>
                      <div className="flex items-center space-x-2">
                        <input type="color" defaultValue="#10b981" className="w-8 h-8 rounded border" />
                        <input type="text" defaultValue="#10b981" className="flex-1 px-3 py-2 border rounded text-sm" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Accent Color</label>
                      <div className="flex items-center space-x-2">
                        <input type="color" defaultValue="#f59e0b" className="w-8 h-8 rounded border" />
                        <input type="text" defaultValue="#f59e0b" className="flex-1 px-3 py-2 border rounded text-sm" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Text Color</label>
                      <div className="flex items-center space-x-2">
                        <input type="color" defaultValue="#374151" className="w-8 h-8 rounded border" />
                        <input type="text" defaultValue="#374151" className="flex-1 px-3 py-2 border rounded text-sm" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Information */}
                <div className="space-y-4">
                  <h3 className="font-medium">Company Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company Name</label>
                      <input type="text" placeholder="Your Company Name" className="w-full px-3 py-2 border rounded" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company URL</label>
                      <input type="url" placeholder="https://yourcompany.com" className="w-full px-3 py-2 border rounded" />
                    </div>
                  </div>
                </div>

                {/* Email Templates */}
                <div className="space-y-4">
                  <h3 className="font-medium">Email Branding</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Use custom email signature</label>
                      <Switch defaultChecked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Include company logo in emails</label>
                      <Switch defaultChecked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Brand notification emails</label>
                      <Switch defaultChecked={false} />
                    </div>
                  </div>
                </div>

                {/* Report Branding */}
                <div className="space-y-4">
                  <h3 className="font-medium">Report Customization</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Add company header to reports</label>
                      <Switch defaultChecked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Include company logo on reports</label>
                      <Switch defaultChecked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Custom report footer</label>
                      <Switch defaultChecked={false} />
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="border-t pt-6">
                  <h3 className="font-medium mb-4">Preview</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="bg-white border rounded-lg p-4 max-w-md mx-auto">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                          <span className="text-white text-sm font-bold">YC</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Your Company</h4>
                          <p className="text-sm text-gray-600">SafetySync.AI Platform</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">This is how your branded interface will look to users.</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset to Default
                  </Button>
                  <Button>Save Branding Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit-settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Automated Audit Review Settings
                </CardTitle>
                <CardDescription>
                  Configure automated monthly compliance gap analysis and reporting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-blue-900">Monthly Audit Review</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Automated analysis of your compliance data to identify gaps and generate improvement recommendations
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-blue-700">Enable</span>
                    <Switch defaultChecked={true} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Review Schedule</label>
                    <select className="px-3 py-2 border rounded-md">
                      <option>1st of every month</option>
                      <option>15th of every month</option>
                      <option>Last day of every month</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Report Format</label>
                    <select className="px-3 py-2 border rounded-md">
                      <option>PDF Report</option>
                      <option>Email Summary</option>
                      <option>Both PDF and Email</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Notification Recipients</label>
                    <input 
                      type="email" 
                      placeholder="admin@company.com"
                      className="px-3 py-2 border rounded-md w-64"
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Review Scope</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <label className="text-sm">Training completion gaps</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <label className="text-sm">Expiring certifications</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <label className="text-sm">Compliance score trends</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <label className="text-sm">Risk assessment updates</label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline">Preview Sample Report</Button>
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>


        </Tabs>
      </div>
    </div>
  );
}
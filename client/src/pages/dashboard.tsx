import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComplianceReportGenerator } from "@/components/ui/compliance-report-generator";
import { AICloneDetector } from "@/components/ui/ai-clone-detector";
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
  Search
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
    <div className="min-h-screen bg-gray-50 pt-16">
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="generator">Report Generator</TabsTrigger>
            <TabsTrigger value="clone-detector">Clone Detector</TabsTrigger>
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
                  <CardTitle>Employee Compliance Records</CardTitle>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Employee
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {records.map(record => (
                    <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        {getStatusIcon(record.status)}
                        <div>
                          <p className="font-medium">{record.employeeName}</p>
                          <p className="text-sm text-gray-600">{record.training}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={getStatusColor(record.status)}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </Badge>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {record.status === 'completed' ? 'Completed' : 'Due'}: {record.completedDate || record.dueDate}
                          </p>
                          {record.certificateUrl && (
                            <Button variant="outline" size="sm" className="mt-1">
                              <Download className="w-3 h-3 mr-1" />
                              Certificate
                            </Button>
                          )}
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

          <TabsContent value="clone-detector" className="space-y-6">
            <AICloneDetector 
              onScanComplete={(results) => {
                console.log('Clone detection scan completed:', results);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
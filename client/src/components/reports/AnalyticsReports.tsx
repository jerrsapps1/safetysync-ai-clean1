import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Download, 
  FileText, 
  Calendar,
  Users,
  Award,
  CheckCircle,
  AlertTriangle,
  Clock,
  Target,
  Database,
  Brain,
  Shield,
  Eye,
  Filter,
  RefreshCw
} from 'lucide-react';
import { SafetySyncIcon } from "@/components/ui/safetysync-icon";

interface DashboardMetrics {
  totalEmployees: number;
  compliantEmployees: number;
  complianceRate: number;
  totalCertificates: number;
  expiringCertificates: number;
  trainingHours: number;
  averageScore: number;
  trend: 'up' | 'down' | 'stable';
}

interface DepartmentMetrics {
  name: string;
  employees: number;
  compliantEmployees: number;
  complianceRate: number;
  trainingHours: number;
  certificates: number;
  riskScore: number;
}

interface TrainingAnalytics {
  courseName: string;
  totalEnrolled: number;
  completed: number;
  completionRate: number;
  averageScore: number;
  averageTime: number;
  lastUpdated: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'compliance' | 'training' | 'safety' | 'audit';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  lastGenerated: string;
  icon: React.ReactNode;
}

const mockMetrics: DashboardMetrics = {
  totalEmployees: 147,
  compliantEmployees: 129,
  complianceRate: 87.8,
  totalCertificates: 234,
  expiringCertificates: 12,
  trainingHours: 1247,
  averageScore: 92.3,
  trend: 'up'
};

const mockDepartments: DepartmentMetrics[] = [
  {
    name: 'Construction',
    employees: 45,
    compliantEmployees: 42,
    complianceRate: 93.3,
    trainingHours: 478,
    certificates: 89,
    riskScore: 15
  },
  {
    name: 'Manufacturing',
    employees: 38,
    compliantEmployees: 32,
    complianceRate: 84.2,
    trainingHours: 342,
    certificates: 67,
    riskScore: 28
  },
  {
    name: 'Maintenance',
    employees: 24,
    compliantEmployees: 21,
    complianceRate: 87.5,
    trainingHours: 189,
    certificates: 45,
    riskScore: 22
  },
  {
    name: 'Office',
    employees: 40,
    compliantEmployees: 34,
    complianceRate: 85.0,
    trainingHours: 238,
    certificates: 33,
    riskScore: 8
  }
];

const mockTraining: TrainingAnalytics[] = [
  {
    courseName: 'Fall Protection Training',
    totalEnrolled: 45,
    completed: 42,
    completionRate: 93.3,
    averageScore: 94.2,
    averageTime: 3.2,
    lastUpdated: '2025-01-10'
  },
  {
    courseName: 'OSHA 10-Hour General Industry',
    totalEnrolled: 38,
    completed: 35,
    completionRate: 92.1,
    averageScore: 89.7,
    averageTime: 10.5,
    lastUpdated: '2025-01-08'
  },
  {
    courseName: 'First Aid/CPR Certification',
    totalEnrolled: 52,
    completed: 48,
    completionRate: 92.3,
    averageScore: 96.1,
    averageTime: 4.0,
    lastUpdated: '2025-01-05'
  },
  {
    courseName: 'Hazard Communication',
    totalEnrolled: 67,
    completed: 58,
    completionRate: 86.6,
    averageScore: 87.3,
    averageTime: 2.8,
    lastUpdated: '2025-01-03'
  }
];

const mockReportTemplates: ReportTemplate[] = [
  {
    id: 'compliance-monthly',
    name: 'Monthly Compliance Report',
    description: 'Comprehensive compliance status by department',
    type: 'compliance',
    frequency: 'monthly',
    lastGenerated: '2025-01-10',
    icon: <CheckCircle className="w-5 h-5 text-green-400" />
  },
  {
    id: 'training-analytics',
    name: 'Training Analytics Report',
    description: 'Training completion rates and performance metrics',
    type: 'training',
    frequency: 'weekly',
    lastGenerated: '2025-01-08',
    icon: <BarChart3 className="w-5 h-5 text-blue-400" />
  },
  {
    id: 'safety-dashboard',
    name: 'Safety Performance Dashboard',
    description: 'Real-time safety metrics and trend analysis',
    type: 'safety',
    frequency: 'daily',
    lastGenerated: '2025-01-12',
    icon: <Shield className="w-5 h-5 text-purple-400" />
  },
  {
    id: 'audit-ready',
    name: 'Audit-Ready Report',
    description: 'OSHA compliance documentation and evidence',
    type: 'audit',
    frequency: 'quarterly',
    lastGenerated: '2025-01-01',
    icon: <FileText className="w-5 h-5 text-orange-400" />
  }
];

export default function AnalyticsReports() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const { toast } = useToast();

  const handleViewReport = (reportName: string) => {
    toast({
      title: "Opening Report",
      description: `Loading ${reportName} in new window...`
    });
    
    // Simulate opening a report in a new window
    setTimeout(() => {
      window.open(`/reports/${reportName.toLowerCase().replace(/\s+/g, '-')}.pdf`, '_blank');
    }, 1000);
  };

  const handleDownloadReport = (reportName: string) => {
    toast({
      title: "Downloading Report",
      description: `Generating ${reportName} for download...`
    });
    
    // Simulate downloading a report
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = `/api/reports/download/${reportName.toLowerCase().replace(/\s+/g, '-')}`;
      link.download = `${reportName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Complete",
        description: `${reportName} has been downloaded successfully.`
      });
    }, 2000);
  };

  const getRiskColor = (score: number) => {
    if (score < 15) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (score < 25) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const getComplianceColor = (rate: number) => {
    if (rate >= 90) return 'text-green-400';
    if (rate >= 80) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <TrendingUp className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Tech grid background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 opacity-10 rounded-lg"></div>
      
      {/* Floating tech icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 animate-float">
          <BarChart3 className="w-8 h-8 text-blue-400/30" />
        </div>
        <div className="absolute top-32 right-20 animate-float-delay-1">
          <Brain className="w-10 h-10 text-purple-400/30" />
        </div>
        <div className="absolute bottom-20 left-20 animate-float-delay-2">
          <TrendingUp className="w-6 h-6 text-green-400/30" />
        </div>
        <div className="absolute bottom-32 right-32 animate-float-delay-3">
          <Shield className="w-7 h-7 text-emerald-400/30" />
        </div>
      </div>

      <div className="flex items-center justify-between relative z-10">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <SafetySyncIcon size={32} className="rounded-lg" />
            Analytics & Reports
          </h2>
          <p className="text-gray-400">Comprehensive analytics, reporting, and compliance insights</p>
          <p className="text-blue-300 text-sm mt-1">
            📊 AI-powered insights • {mockMetrics.complianceRate}% compliance rate • {mockMetrics.totalCertificates} active certificates
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
            onClick={() => handleDownloadReport("Analytics Dashboard Export")}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button 
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => {
              toast({
                title: "Refreshing Analytics",
                description: "Updating all data and metrics..."
              });
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Compliance Rate</p>
                <p className="text-2xl font-bold text-white">{mockMetrics.complianceRate}%</p>
                <p className="text-green-400 text-sm flex items-center gap-1">
                  {getTrendIcon(mockMetrics.trend)}
                  🤖 AI-Tracked
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Employees</p>
                <p className="text-2xl font-bold text-white">{mockMetrics.totalEmployees}</p>
                <p className="text-blue-400 text-sm">{mockMetrics.compliantEmployees} compliant</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Training Hours</p>
                <p className="text-2xl font-bold text-white">{mockMetrics.trainingHours.toLocaleString()}</p>
                <p className="text-purple-400 text-sm">This period</p>
              </div>
              <Clock className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Certificates</p>
                <p className="text-2xl font-bold text-white">{mockMetrics.totalCertificates}</p>
                <p className="text-orange-400 text-sm">{mockMetrics.expiringCertificates} expiring</p>
              </div>
              <Award className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="relative z-10">
        <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-sm border-gray-800">
          <TabsTrigger 
            value="overview" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200"
          >
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="departments" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200"
          >
            <Users className="h-4 w-4" />
            Departments
          </TabsTrigger>
          <TabsTrigger 
            value="training" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200"
          >
            <Target className="h-4 w-4" />
            Training
          </TabsTrigger>
          <TabsTrigger 
            value="reports" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200"
          >
            <FileText className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Compliance Trend</CardTitle>
                <CardDescription className="text-gray-400">
                  Overall compliance rate over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border border-gray-700 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                    <p className="text-gray-400">Compliance trend chart</p>
                    <p className="text-gray-500 text-sm">87.8% current rate, trending up</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Training Progress</CardTitle>
                <CardDescription className="text-gray-400">
                  Training completion and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border border-gray-700 rounded-lg">
                  <div className="text-center">
                    <Target className="w-12 h-12 text-green-400 mx-auto mb-2" />
                    <p className="text-gray-400">Training analytics chart</p>
                    <p className="text-gray-500 text-sm">Average score: {mockMetrics.averageScore}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Key Performance Indicators</CardTitle>
              <CardDescription className="text-gray-400">
                Critical metrics for safety and compliance management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {mockMetrics.complianceRate}%
                  </div>
                  <p className="text-gray-300">Overall Compliance</p>
                  <p className="text-green-400 text-sm">Target: 90%</p>
                </div>
                <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {mockMetrics.averageScore}%
                  </div>
                  <p className="text-gray-300">Average Training Score</p>
                  <p className="text-blue-400 text-sm">Target: 85%</p>
                </div>
                <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {mockMetrics.expiringCertificates}
                  </div>
                  <p className="text-gray-300">Expiring Certificates</p>
                  <p className="text-purple-400 text-sm">Next 30 days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {mockDepartments.map((dept) => (
              <Card key={dept.name} className="bg-black/20 backdrop-blur-sm border-gray-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">{dept.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getRiskColor(dept.riskScore)}>
                        Risk: {dept.riskScore}
                      </Badge>
                      <Badge className={`${getComplianceColor(dept.complianceRate)} bg-opacity-20`}>
                        {dept.complianceRate}% Compliant
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{dept.employees}</div>
                      <p className="text-gray-400 text-sm">Employees</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{dept.compliantEmployees}</div>
                      <p className="text-gray-400 text-sm">Compliant</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{dept.trainingHours}</div>
                      <p className="text-gray-400 text-sm">Training Hours</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{dept.certificates}</div>
                      <p className="text-gray-400 text-sm">Certificates</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-400">{dept.riskScore}</div>
                      <p className="text-gray-400 text-sm">Risk Score</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {mockTraining.map((training) => (
              <Card key={training.courseName} className="bg-black/20 backdrop-blur-sm border-gray-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">{training.courseName}</CardTitle>
                    <Badge className={`${getComplianceColor(training.completionRate)} bg-opacity-20`}>
                      {training.completionRate}% Complete
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{training.totalEnrolled}</div>
                      <p className="text-gray-400 text-sm">Total Enrolled</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{training.completed}</div>
                      <p className="text-gray-400 text-sm">Completed</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{training.averageScore}%</div>
                      <p className="text-gray-400 text-sm">Average Score</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{training.averageTime}h</div>
                      <p className="text-gray-400 text-sm">Average Time</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-400">{training.lastUpdated}</div>
                      <p className="text-gray-400 text-sm">Last Updated</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockReportTemplates.map((template) => (
              <Card key={template.id} className="bg-black/20 backdrop-blur-sm border-gray-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {template.icon}
                      <div>
                        <CardTitle className="text-white">{template.name}</CardTitle>
                        <CardDescription className="text-gray-400">
                          {template.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-400">
                      {template.frequency}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Last Generated</span>
                    <span className="text-white">{template.lastGenerated}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={() => handleViewReport(template.name)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Report
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-emerald-500 hover:bg-emerald-600 text-white"
                      onClick={() => handleDownloadReport(template.name)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
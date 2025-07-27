import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Award,
  AlertTriangle,
  Brain,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  RefreshCw,
  Download,
  Filter,
  Zap,
  Shield,
  ShieldCheck,
  MapPin,
  Building,
  Briefcase
} from 'lucide-react';

interface Employee {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
  department?: string;
  division?: string;
  location?: string;
  status: 'active' | 'inactive' | 'terminated';
  employeeIdVerified?: boolean;
  hireDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface Certificate {
  id: number;
  certificateName: string;
  issueDate: Date;
  expirationDate: Date;
  certificateNumber: string;
  status: 'active' | 'expired' | 'expiring';
  employeeId: number;
}

interface TrainingSession {
  id: number;
  programId: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  employeeId: number;
  scheduledDate: Date;
  completedDate?: Date;
  score?: number;
}

const CHART_COLORS = [
  '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', 
  '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#64748b'
];

export function EmployeeInsightsDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch data
  const { data: employees = [], isLoading: employeesLoading } = useQuery({
    queryKey: ['/api/employees'],
    select: (data: Employee[]) => data.map(emp => ({
      ...emp,
      hireDate: new Date(emp.hireDate),
      createdAt: new Date(emp.createdAt),
      updatedAt: new Date(emp.updatedAt)
    }))
  });

  const { data: certificates = [], isLoading: certificatesLoading } = useQuery({
    queryKey: ['/api/certificates'],
    select: (data: Certificate[]) => data.map(cert => ({
      ...cert,
      issueDate: new Date(cert.issueDate),
      expirationDate: new Date(cert.expirationDate)
    }))
  });

  const { data: trainingSessions = [], isLoading: trainingLoading } = useQuery({
    queryKey: ['/api/training-sessions'],
    select: (data: TrainingSession[]) => data.map(session => ({
      ...session,
      scheduledDate: new Date(session.scheduledDate),
      completedDate: session.completedDate ? new Date(session.completedDate) : undefined
    }))
  });

  const isLoading = employeesLoading || certificatesLoading || trainingLoading;

  // Comprehensive analytics calculations
  const insights = useMemo(() => {
    if (!employees.length) return null;

    const filteredEmployees = selectedDepartment === 'all' 
      ? employees 
      : employees.filter(emp => emp.department === selectedDepartment);

    // Basic metrics
    const totalEmployees = filteredEmployees.length;
    const activeEmployees = filteredEmployees.filter(emp => emp.status === 'active').length;
    const verifiedEmployees = filteredEmployees.filter(emp => emp.employeeIdVerified).length;
    const terminatedEmployees = filteredEmployees.filter(emp => emp.status === 'terminated').length;

    // Department distribution
    const departmentStats = [...new Set(employees.map(emp => emp.department).filter(Boolean))]
      .map(dept => ({
        name: dept,
        count: employees.filter(emp => emp.department === dept).length,
        activeCount: employees.filter(emp => emp.department === dept && emp.status === 'active').length,
        verifiedCount: employees.filter(emp => emp.department === dept && emp.employeeIdVerified).length
      }));

    // Location distribution
    const locationStats = [...new Set(employees.map(emp => emp.location).filter(Boolean))]
      .map(loc => ({
        name: loc,
        count: employees.filter(emp => emp.location === loc).length,
        activeCount: employees.filter(emp => emp.location === loc && emp.status === 'active').length
      }));

    // Hiring trends (last 12 months)
    const hiringTrends = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const hiredCount = employees.filter(emp => {
        const hireMonth = emp.hireDate.getMonth();
        const hireYear = emp.hireDate.getFullYear();
        return hireMonth === date.getMonth() && hireYear === date.getFullYear();
      }).length;
      hiringTrends.push({ month: monthYear, hired: hiredCount });
    }

    // Certificate compliance
    const activeCertificates = certificates.filter(cert => cert.status === 'active').length;
    const expiringCertificates = certificates.filter(cert => cert.status === 'expiring').length;
    const expiredCertificates = certificates.filter(cert => cert.status === 'expired').length;

    // Training completion rates
    const completedTraining = trainingSessions.filter(session => session.status === 'completed').length;
    const totalTraining = trainingSessions.length;
    const trainingCompletionRate = totalTraining > 0 ? (completedTraining / totalTraining) * 100 : 0;

    // AI-powered insights
    const aiInsights = [];
    
    if (verifiedEmployees / totalEmployees < 0.8) {
      aiInsights.push({
        type: 'warning',
        title: 'ID Verification Gap',
        description: `${((1 - verifiedEmployees / totalEmployees) * 100).toFixed(1)}% of employees need ID verification`,
        priority: 'high',
        action: 'Review and verify employee IDs'
      });
    }

    if (expiringCertificates > 0) {
      aiInsights.push({
        type: 'alert',
        title: 'Expiring Certificates',
        description: `${expiringCertificates} certificates expiring soon`,
        priority: 'medium',
        action: 'Schedule certificate renewals'
      });
    }

    if (trainingCompletionRate < 70) {
      aiInsights.push({
        type: 'warning',
        title: 'Training Completion Low',
        description: `${trainingCompletionRate.toFixed(1)}% completion rate needs improvement`,
        priority: 'high',
        action: 'Implement training reminders'
      });
    }

    const topPerformingDept = departmentStats.reduce((prev, current) => 
      (prev.activeCount / prev.count) > (current.activeCount / current.count) ? prev : current
    );

    if (topPerformingDept) {
      aiInsights.push({
        type: 'success',
        title: 'Top Performing Department',
        description: `${topPerformingDept.name} has ${((topPerformingDept.activeCount / topPerformingDept.count) * 100).toFixed(1)}% active employees`,
        priority: 'info',
        action: 'Apply best practices to other departments'
      });
    }

    return {
      totalEmployees,
      activeEmployees,
      verifiedEmployees,
      terminatedEmployees,
      departmentStats,
      locationStats,
      hiringTrends,
      activeCertificates,
      expiringCertificates,
      expiredCertificates,
      trainingCompletionRate,
      aiInsights,
      verificationRate: totalEmployees > 0 ? (verifiedEmployees / totalEmployees) * 100 : 0,
      activeRate: totalEmployees > 0 ? (activeEmployees / totalEmployees) * 100 : 0,
      complianceScore: totalEmployees > 0 ? 
        ((verifiedEmployees + activeCertificates + completedTraining) / (totalEmployees * 3)) * 100 : 0
    };
  }, [employees, certificates, trainingSessions, selectedDepartment]);

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Employee Insights Dashboard</h2>
          <RefreshCw className="h-6 w-6 text-white animate-spin" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="bg-blue-700/50 border-blue-600/50">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-blue-600 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-blue-600 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="p-8 text-center">
        <Users className="h-12 w-12 text-white mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No Employee Data</h3>
        <p className="text-white">Add employees to see insights and analytics</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 text-violet-400" />
          <h2 className="text-2xl font-bold text-white">Employee Insights Dashboard</h2>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48 bg-blue-700/50 border-blue-600/50 text-white">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {insights.departmentStats.map(dept => (
                <SelectItem key={dept.name} value={dept.name}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32 bg-blue-700/50 border-blue-600/50 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-blue-600 text-white /50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-blue-700/50 border-blue-600/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">Total Employees</p>
                <p className="text-2xl font-bold text-white">{insights.totalEmployees}</p>
                <p className="text-xs text-violet-400 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {insights.activeRate.toFixed(1)}% active
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-700/50 border-blue-600/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">ID Verified</p>
                <p className="text-2xl font-bold text-white">{insights.verifiedEmployees}</p>
                <p className="text-xs text-violet-400 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  {insights.verificationRate.toFixed(1)}% verified
                </p>
              </div>
              <Shield className="h-8 w-8 text-violet-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-700/50 border-blue-600/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">Active Certificates</p>
                <p className="text-2xl font-bold text-white">{insights.activeCertificates}</p>
                <p className="text-xs text-yellow-400 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {insights.expiringCertificates} expiring
                </p>
              </div>
              <Award className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-700/50 border-blue-600/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">Compliance Score</p>
                <p className="text-2xl font-bold text-white">{insights.complianceScore.toFixed(1)}%</p>
                <p className="text-xs text-purple-400 flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  AI-calculated
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-blue-700/50 border-blue-600/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Distribution */}
            <Card className="bg-blue-700/50 border-blue-600/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Department Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={insights.departmentStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {insights.departmentStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Location Distribution */}
            <Card className="bg-blue-700/50 border-blue-600/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={insights.locationStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" />
                    <Bar dataKey="activeCount" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Hiring Trends */}
          <Card className="bg-blue-700/50 border-blue-600/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Hiring Trends (Last 12 Months)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={insights.hiringTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="hired" 
                    stroke="#8b5cf6" 
                    fill="#8b5cf6" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {insights.departmentStats.map((dept, index) => (
              <Card key={dept.name} className="bg-blue-700/50 border-blue-600/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">{dept.name}</h3>
                    <Badge variant="outline" className="text-white border-blue-500">
                      {dept.count} employees
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-400">{dept.count}</p>
                      <p className="text-sm text-white">Total</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-violet-400">{dept.activeCount}</p>
                      <p className="text-sm text-white">Active</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-400">{dept.verifiedCount}</p>
                      <p className="text-sm text-white">Verified</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-400">
                        {dept.count > 0 ? ((dept.activeCount / dept.count) * 100).toFixed(1) : 0}%
                      </p>
                      <p className="text-sm text-white">Active Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="bg-blue-700/50 border-blue-600/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <LineChartIcon className="h-5 w-5" />
                Employee Growth Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={insights.hiringTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="hired" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {insights.aiInsights.map((insight, index) => (
              <Card key={index} className="bg-blue-700/50 border-blue-600/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-full ${
                      insight.type === 'success' ? 'bg-violet-500/20 text-violet-400' :
                      insight.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                      insight.type === 'alert' ? 'bg-red-500/20 text-red-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {insight.type === 'success' ? <CheckCircle className="h-5 w-5" /> :
                       insight.type === 'warning' ? <AlertTriangle className="h-5 w-5" /> :
                       insight.type === 'alert' ? <XCircle className="h-5 w-5" /> :
                       <Brain className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">{insight.title}</h3>
                        <Badge 
                          variant="outline" 
                          className={`${
                            insight.priority === 'high' ? 'text-red-400 border-red-400' :
                            insight.priority === 'medium' ? 'text-yellow-400 border-yellow-400' :
                            'text-blue-400 border-blue-400'
                          }`}
                        >
                          {insight.priority}
                        </Badge>
                      </div>
                      <p className="text-white mb-3">{insight.description}</p>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-purple-400" />
                        <span className="text-sm text-purple-400 font-medium">Recommended Action:</span>
                        <span className="text-sm text-white">{insight.action}</span>
                      </div>
                    </div>
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
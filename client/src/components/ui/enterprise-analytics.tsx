import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Calendar,
  Building,
  FileText,
  Clock,
  DollarSign,
  Target,
  Award,
  Zap,
  Download,
  Filter
} from 'lucide-react';

interface EnterpriseAnalyticsProps {
  userTier?: string;
  companySize?: string;
}

export function EnterpriseAnalytics({ userTier = 'enterprise', companySize = 'large' }: EnterpriseAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('last-30-days');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Comprehensive mock data for enterprise analytics
  const complianceOverview = {
    overallScore: 94.2,
    totalEmployees: 2847,
    compliantEmployees: 2681,
    pendingTraining: 166,
    expiredCertifications: 23,
    riskScore: 'low',
    trendsChange: {
      score: +2.1,
      compliant: +45,
      pending: -12
    }
  };

  const departmentCompliance = [
    { department: 'Manufacturing', score: 96.8, employees: 845, compliant: 818, risk: 'low', change: +1.2 },
    { department: 'Warehouse', score: 93.4, employees: 623, compliant: 582, risk: 'medium', change: +0.8 },
    { department: 'Construction', score: 91.2, employees: 456, compliant: 416, risk: 'medium', change: -0.5 },
    { department: 'Quality Control', score: 98.1, employees: 234, compliant: 230, risk: 'low', change: +2.1 },
    { department: 'Maintenance', score: 89.7, employees: 189, compliant: 170, risk: 'high', change: -1.2 },
    { department: 'Safety Team', score: 99.2, employees: 89, compliant: 88, risk: 'low', change: +0.3 },
    { department: 'Administration', score: 97.5, employees: 234, compliant: 228, risk: 'low', change: +1.8 },
    { department: 'Field Operations', score: 87.3, employees: 177, compliant: 155, risk: 'high', change: -2.1 }
  ];

  const trainingMetrics = [
    { month: 'Jul', completed: 234, scheduled: 189, overdue: 12 },
    { month: 'Aug', completed: 267, scheduled: 223, overdue: 8 },
    { month: 'Sep', completed: 289, scheduled: 245, overdue: 15 },
    { month: 'Oct', completed: 312, scheduled: 267, overdue: 9 },
    { month: 'Nov', completed: 345, scheduled: 289, overdue: 6 },
    { month: 'Dec', completed: 378, scheduled: 312, overdue: 11 },
    { month: 'Jan', completed: 401, scheduled: 334, overdue: 4 }
  ];

  const incidentTrends = [
    { month: 'Jul', incidents: 12, nearMisses: 45, reportedHazards: 23 },
    { month: 'Aug', incidents: 8, nearMisses: 52, reportedHazards: 34 },
    { month: 'Sep', incidents: 6, nearMisses: 38, reportedHazards: 28 },
    { month: 'Oct', incidents: 4, nearMisses: 41, reportedHazards: 31 },
    { month: 'Nov', incidents: 3, nearMisses: 29, reportedHazards: 26 },
    { month: 'Dec', incidents: 2, nearMisses: 25, reportedHazards: 19 },
    { month: 'Jan', incidents: 1, nearMisses: 18, reportedHazards: 15 }
  ];

  const costAnalysis = [
    { category: 'Training Costs', current: 124500, previous: 142300, savings: 17800 },
    { category: 'Compliance Fines', current: 0, previous: 25000, savings: 25000 },
    { category: 'Incident Response', current: 8900, previous: 34200, savings: 25300 },
    { category: 'Audit Preparation', current: 15600, previous: 67800, savings: 52200 },
    { category: 'Documentation', current: 3200, previous: 18900, savings: 15700 },
    { category: 'External Consulting', current: 12000, previous: 89000, savings: 77000 }
  ];

  const certificationStatus = [
    { name: 'OSHA 10-Hour', count: 1245, percentage: 87.3, color: '#22c55e' },
    { name: 'OSHA 30-Hour', count: 456, percentage: 16.0, color: '#3b82f6' },
    { name: 'First Aid/CPR', count: 2234, percentage: 78.5, color: '#f59e0b' },
    { name: 'Forklift Safety', count: 567, percentage: 19.9, color: '#ef4444' },
    { name: 'Hazmat Handling', count: 234, percentage: 8.2, color: '#8b5cf6' },
    { name: 'Confined Space', count: 189, percentage: 6.6, color: '#06b6d4' }
  ];

  const riskMetrics = {
    highRiskAreas: [
      { area: 'Heavy Machinery Operation', riskLevel: 'High', incidents: 3, employees: 234, trend: 'improving' },
      { area: 'Chemical Storage', riskLevel: 'Medium', incidents: 1, employees: 89, trend: 'stable' },
      { area: 'Height Work', riskLevel: 'High', incidents: 2, employees: 156, trend: 'improving' },
      { area: 'Electrical Systems', riskLevel: 'Medium', incidents: 0, employees: 67, trend: 'improving' }
    ],
    auditResults: {
      lastAudit: '2024-12-15',
      score: 96.2,
      findings: 8,
      criticalFindings: 0,
      nextAudit: '2025-06-15'
    }
  };

  const getRiskBadge = (risk: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return <Badge className={colors[risk as keyof typeof colors]}>{risk.toUpperCase()}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-800">Enterprise Analytics Dashboard</h1>
          <p className="text-blue-500 mt-2">Comprehensive safety and compliance intelligence for enterprise operations</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 Days</SelectItem>
              <SelectItem value="last-30-days">Last 30 Days</SelectItem>
              <SelectItem value="last-quarter">Last Quarter</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-500">Overall Compliance Score</p>
                <p className="text-3xl font-bold text-green-600">{complianceOverview.overallScore}%</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{complianceOverview.trendsChange.score}% this month</span>
                </div>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-500">Total Employees</p>
                <p className="text-3xl font-bold text-blue-600">{complianceOverview.totalEmployees.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-blue-500">{complianceOverview.compliantEmployees} compliant</span>
                </div>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-500">Pending Training</p>
                <p className="text-3xl font-bold text-orange-600">{complianceOverview.pendingTraining}</p>
                <div className="flex items-center mt-2">
                  <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">{complianceOverview.trendsChange.pending} vs last month</span>
                </div>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-500">Risk Level</p>
                <p className="text-3xl font-bold text-green-600">LOW</p>
                <div className="flex items-center mt-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-sm text-blue-500">{complianceOverview.expiredCertifications} expired certs</span>
                </div>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="compliance" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="compliance">Compliance Overview</TabsTrigger>
          <TabsTrigger value="training">Training Analytics</TabsTrigger>
          <TabsTrigger value="incidents">Incident Trends</TabsTrigger>
          <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
          <TabsTrigger value="risk">Risk Management</TabsTrigger>
        </TabsList>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Department Compliance Scores</CardTitle>
                <CardDescription>Compliance performance across all departments</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={departmentCompliance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" angle={-45} textAnchor="end" height={100} />
                    <YAxis domain={[80, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Compliance Score']} />
                    <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Certification Distribution</CardTitle>
                <CardDescription>Current certification coverage</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={certificationStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {certificationStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value, name]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {certificationStatus.map((cert, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cert.color }}></div>
                        <span>{cert.name}</span>
                      </div>
                      <span className="font-medium">{cert.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Department Performance Details</CardTitle>
              <CardDescription>Detailed breakdown of compliance metrics by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Department</th>
                      <th className="text-right py-3 px-4">Score</th>
                      <th className="text-right py-3 px-4">Employees</th>
                      <th className="text-right py-3 px-4">Compliant</th>
                      <th className="text-center py-3 px-4">Risk Level</th>
                      <th className="text-right py-3 px-4">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentCompliance.map((dept, index) => (
                      <tr key={index} className="border-b hover:bg-blue-50">
                        <td className="py-3 px-4 font-medium">{dept.department}</td>
                        <td className="py-3 px-4 text-right">{dept.score}%</td>
                        <td className="py-3 px-4 text-right">{dept.employees}</td>
                        <td className="py-3 px-4 text-right">{dept.compliant}</td>
                        <td className="py-3 px-4 text-center">{getRiskBadge(dept.risk)}</td>
                        <td className="py-3 px-4 text-right">
                          <div className={`flex items-center justify-end gap-1 ${dept.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {dept.change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            {Math.abs(dept.change)}%
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Training Completion Trends</CardTitle>
                <CardDescription>Monthly training metrics and progress</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trainingMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="completed" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.8} />
                    <Area type="monotone" dataKey="scheduled" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.8} />
                    <Area type="monotone" dataKey="overdue" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.8} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Training Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators for training programs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">92.3%</div>
                    <div className="text-sm text-blue-500">Completion Rate</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">4.8</div>
                    <div className="text-sm text-blue-500">Avg. Score (5.0)</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">2.1</div>
                    <div className="text-sm text-blue-500">Days Avg. Time</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">96%</div>
                    <div className="text-sm text-blue-500">First-time Pass</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Top Performing Courses</h4>
                  {[
                    { course: 'OSHA 10-Hour Construction', completion: 98.2 },
                    { course: 'First Aid/CPR Certification', completion: 96.8 },
                    { course: 'Forklift Operation Safety', completion: 95.4 },
                    { course: 'Hazmat Transportation', completion: 94.1 }
                  ].map((course, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{course.course}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-blue-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${course.completion}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{course.completion}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Incident and Safety Trends</CardTitle>
              <CardDescription>Tracking incidents, near misses, and reported hazards over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={incidentTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="incidents" stroke="#ef4444" strokeWidth={3} name="Incidents" />
                  <Line type="monotone" dataKey="nearMisses" stroke="#f59e0b" strokeWidth={2} name="Near Misses" />
                  <Line type="monotone" dataKey="reportedHazards" stroke="#3b82f6" strokeWidth={2} name="Reported Hazards" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-red-600">1</div>
                <div className="text-sm text-blue-500">Incidents This Month</div>
                <div className="text-xs text-green-600 mt-1">-67% vs last month</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-yellow-600">18</div>
                <div className="text-sm text-blue-500">Near Misses</div>
                <div className="text-xs text-green-600 mt-1">-28% vs last month</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-blue-600">15</div>
                <div className="text-sm text-blue-500">Hazards Reported</div>
                <div className="text-xs text-green-600 mt-1">-21% vs last month</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="costs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cost Savings Analysis</CardTitle>
              <CardDescription>Financial impact of safety and compliance initiatives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {costAnalysis.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{item.category}</h4>
                      <div className="flex items-center gap-4 text-sm text-blue-500">
                        <span>Current: {formatCurrency(item.current)}</span>
                        <span>Previous: {formatCurrency(item.previous)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        {formatCurrency(item.savings)}
                      </div>
                      <div className="text-sm text-green-600">Saved</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">Total Annual Savings</h3>
                    <p className="text-sm text-green-600">Compared to previous year</p>
                  </div>
                  <div className="text-3xl font-bold text-green-700">
                    {formatCurrency(costAnalysis.reduce((sum, item) => sum + item.savings, 0))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>High-Risk Areas</CardTitle>
                <CardDescription>Areas requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskMetrics.highRiskAreas.map((area, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{area.area}</h4>
                        <p className="text-sm text-blue-500">{area.employees} employees • {area.incidents} incidents</p>
                      </div>
                      <div className="text-right space-y-1">
                        {getRiskBadge(area.riskLevel.toLowerCase())}
                        <div className={`text-xs ${area.trend === 'improving' ? 'text-green-600' : 'text-blue-500'}`}>
                          {area.trend}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audit Summary</CardTitle>
                <CardDescription>Latest compliance audit results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{riskMetrics.auditResults.score}</div>
                    <div className="text-sm text-blue-500">Audit Score</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{riskMetrics.auditResults.findings}</div>
                    <div className="text-sm text-blue-500">Total Findings</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-500">Last Audit:</span>
                    <span className="text-sm font-medium">{riskMetrics.auditResults.lastAudit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-500">Critical Findings:</span>
                    <span className="text-sm font-medium text-green-600">{riskMetrics.auditResults.criticalFindings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-500">Next Audit:</span>
                    <span className="text-sm font-medium">{riskMetrics.auditResults.nextAudit}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">Excellent Compliance Status</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    No critical findings in the last audit. Keep up the excellent work!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
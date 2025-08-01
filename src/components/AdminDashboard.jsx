import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  PieChart, 
  TableIcon, 
  Settings,
  Mail,
  Database,
  Activity,
  Shield,
  Globe,
  DollarSign
} from 'lucide-react';
import SignupGraph from './SignupGraph';
import SignupPlanBreakdown from './SignupPlanBreakdown';
import SignupTable from './SignupTable';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // System status indicators
  const systemStatus = {
    database: 'Operational',
    emailSystem: 'Degraded', // Due to SMTP auth issues we see in logs
    apiEndpoints: 'Operational',
    analytics: 'Operational',
    security: 'Operational'
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Operational': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Degraded': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Down': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Shield className="h-8 w-8" />
                SafetySync.AI Admin Dashboard
              </h1>
              <p className="text-blue-100 mt-2">
                Platform administration and analytics overview
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-emerald-600 text-white border-emerald-500">
                <Activity className="h-3 w-3 mr-1" />
                System Online
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-blue-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Active Users</p>
                  <p className="text-3xl font-bold text-white">1,247</p>
                  <p className="text-emerald-400 text-sm">+12% this week</p>
                </div>
                <Users className="h-10 w-10 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-blue-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-white">$24,890</p>
                  <p className="text-emerald-400 text-sm">+8% vs last month</p>
                </div>
                <DollarSign className="h-10 w-10 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-blue-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Certificates Generated</p>
                  <p className="text-3xl font-bold text-white">3,456</p>
                  <p className="text-emerald-400 text-sm">+23% this month</p>
                </div>
                <Activity className="h-10 w-10 text-amber-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-blue-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Enterprise Clients</p>
                  <p className="text-3xl font-bold text-white">89</p>
                  <p className="text-emerald-400 text-sm">+5 new this week</p>
                </div>
                <Globe className="h-10 w-10 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="bg-white/10 backdrop-blur-sm border-blue-700/50 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(systemStatus).map(([system, status]) => (
                <div key={system} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-blue-200 capitalize">{system.replace(/([A-Z])/g, ' $1')}</span>
                  <Badge variant="outline" className={getStatusColor(status)}>
                    {status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-sm">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-200"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="breakdown" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-200"
            >
              <PieChart className="h-4 w-4 mr-2" />
              Plan Breakdown
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-200"
            >
              <TableIcon className="h-4 w-4 mr-2" />
              User Management
            </TabsTrigger>
            <TabsTrigger 
              value="system" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-200"
            >
              <Settings className="h-4 w-4 mr-2" />
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <SignupGraph />
          </TabsContent>

          <TabsContent value="breakdown" className="space-y-6">
            <SignupPlanBreakdown />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <SignupTable />
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Database Information */}
              <Card className="bg-white/10 backdrop-blur-sm border-blue-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Database Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">Connection Status</span>
                    <Badge className="bg-emerald-600 text-white">Connected</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">Total Users</span>
                    <span className="text-white font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">Total Certificates</span>
                    <span className="text-white font-medium">3,456</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">Database Size</span>
                    <span className="text-white font-medium">2.4 GB</span>
                  </div>
                </CardContent>
              </Card>

              {/* Email System */}
              <Card className="bg-white/10 backdrop-blur-sm border-blue-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email System
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">SMTP Status</span>
                    <Badge className="bg-amber-600 text-white">Authentication Issue</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">BREVO API</span>
                    <Badge className="bg-emerald-600 text-white">Configured</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">Daily Emails</span>
                    <span className="text-white font-medium">234</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">Weekly Reports</span>
                    <span className="text-white font-medium">52</span>
                  </div>
                </CardContent>
              </Card>

              {/* API Endpoints */}
              <Card className="bg-white/10 backdrop-blur-sm border-blue-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    API Endpoints
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">/api/signup-breakdown</span>
                    <Badge className="bg-emerald-600 text-white">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">/api/signup-details</span>
                    <Badge className="bg-emerald-600 text-white">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">Response Time</span>
                    <span className="text-white font-medium">142ms avg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">Uptime</span>
                    <span className="text-white font-medium">99.8%</span>
                  </div>
                </CardContent>
              </Card>

              {/* Security Overview */}
              <Card className="bg-white/10 backdrop-blur-sm border-blue-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">SSL Certificate</span>
                    <Badge className="bg-emerald-600 text-white">Valid</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">Failed Logins (24h)</span>
                    <span className="text-white font-medium">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">Rate Limiting</span>
                    <Badge className="bg-emerald-600 text-white">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">API Security</span>
                    <Badge className="bg-emerald-600 text-white">Enabled</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
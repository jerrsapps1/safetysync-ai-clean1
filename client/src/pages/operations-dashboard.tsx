import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { 
  Command, 
  Server, 
  Database, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Users,
  Activity,
  Clock,
  Zap,
  BarChart3,
  Settings,
  ExternalLink,
  RefreshCw,
  Bell,
  Info
} from "lucide-react";

export default function OperationsDashboard() {
  const [systemMetrics, setSystemMetrics] = useState({
    uptime: 99.97,
    responseTime: 145,
    throughput: 1247,
    errorRate: 0.03,
    activeUsers: 89,
    totalRequests: 1456789
  });

  const [refreshTime, setRefreshTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        ...prev,
        responseTime: Math.max(100, Math.min(300, prev.responseTime + (Math.random() - 0.5) * 20)),
        throughput: Math.max(1000, Math.min(2000, prev.throughput + (Math.random() - 0.5) * 100)),
        activeUsers: Math.max(50, Math.min(150, prev.activeUsers + (Math.random() - 0.5) * 10)),
        totalRequests: prev.totalRequests + Math.floor(Math.random() * 50)
      }));
      setRefreshTime(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const quickActions = [
    {
      title: "System Health",
      description: "Monitor real-time system performance",
      icon: <Activity className="w-5 h-5" />,
      link: "/system-health",
      status: "healthy",
      color: "bg-green-500"
    },
    {
      title: "Backup & Recovery",
      description: "Manage data backups and recovery",
      icon: <Database className="w-5 h-5" />,
      link: "/backup-recovery",
      status: "active",
      color: "bg-blue-500"
    },
    {
      title: "Incident Response",
      description: "Handle security and operational incidents",
      icon: <AlertTriangle className="w-5 h-5" />,
      link: "/incident-response",
      status: "monitoring",
      color: "bg-yellow-500"
    },
    {
      title: "DNS Management",
      description: "Configure domain and DNS settings",
      icon: <Server className="w-5 h-5" />,
      link: "/dns-management",
      status: "configured",
      color: "bg-purple-500"
    }
  ];

  const systemServices = [
    {
      name: "Web Application",
      status: "operational",
      uptime: "99.97%",
      users: 89,
      lastIncident: "None"
    },
    {
      name: "API Gateway",
      status: "operational",
      uptime: "99.95%",
      users: 156,
      lastIncident: "None"
    },
    {
      name: "Database",
      status: "operational",
      uptime: "99.99%",
      users: 245,
      lastIncident: "2 days ago"
    },
    {
      name: "Email Service",
      status: "degraded",
      uptime: "98.45%",
      users: 12,
      lastIncident: "Active"
    },
    {
      name: "AI Services",
      status: "operational",
      uptime: "99.89%",
      users: 34,
      lastIncident: "None"
    }
  ];

  const recentAlerts = [
    {
      id: 1,
      type: "warning",
      title: "High API Response Time",
      message: "Average response time above 200ms threshold",
      time: "5 minutes ago",
      severity: "medium"
    },
    {
      id: 2,
      type: "info",
      title: "Scheduled Maintenance Complete",
      message: "Database maintenance completed successfully",
      time: "2 hours ago",
      severity: "low"
    },
    {
      id: 3,
      type: "success",
      title: "Backup Completed",
      message: "Daily backup completed successfully",
      time: "3 hours ago",
      severity: "low"
    }
  ];

  const operationalStats = [
    {
      category: "Performance",
      metrics: [
        { name: "Avg Response Time", value: `${systemMetrics.responseTime}ms`, target: "< 200ms", status: systemMetrics.responseTime < 200 ? "good" : "warning" },
        { name: "Throughput", value: `${systemMetrics.throughput} req/min`, target: "> 1000", status: "good" },
        { name: "Error Rate", value: `${systemMetrics.errorRate}%`, target: "< 0.1%", status: "good" }
      ]
    },
    {
      category: "Availability",
      metrics: [
        { name: "System Uptime", value: `${systemMetrics.uptime}%`, target: "> 99.9%", status: "good" },
        { name: "Active Users", value: systemMetrics.activeUsers.toString(), target: "< 500", status: "good" },
        { name: "Total Requests", value: systemMetrics.totalRequests.toLocaleString(), target: "Growing", status: "good" }
      ]
    },
    {
      category: "Security",
      metrics: [
        { name: "Failed Logins", value: "3", target: "< 10", status: "good" },
        { name: "Security Alerts", value: "0", target: "0", status: "good" },
        { name: "SSL Status", value: "Valid", target: "Valid", status: "good" }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
      case "healthy":
      case "good":
        return "bg-green-500";
      case "degraded":
      case "warning":
        return "bg-yellow-500";
      case "outage":
      case "error":
        return "bg-red-500";
      default:
        return "bg-blue-400";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "info":
        return <Info className="w-4 h-4 text-blue-400" />;
      default:
        return <Bell className="w-4 h-4 text-blue-300" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Command className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Operations Dashboard</h1>
              <p className="text-blue-300">Enterprise operations center for SafetySync.AI</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-blue-300">Last updated</p>
              <p className="text-white">{refreshTime.toLocaleTimeString()}</p>
            </div>
            <Button variant="outline" size="sm" className="text-white border-white/30">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* System Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-300">System Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-xl font-bold text-white">Operational</span>
                  </div>
                </div>
                <Badge className="bg-green-500 text-white">All Systems</Badge>
              </div>
              <div className="mt-4">
                <p className="text-sm text-blue-300">Uptime: {systemMetrics.uptime}%</p>
                <Progress value={systemMetrics.uptime} className="mt-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-300">Active Incidents</p>
                  <div className="flex items-center gap-2 mt-1">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    <span className="text-xl font-bold text-white">1</span>
                  </div>
                </div>
                <Badge className="bg-yellow-500 text-white">Medium</Badge>
              </div>
              <div className="mt-4">
                <p className="text-sm text-blue-300">Email service degraded</p>
                <Button size="sm" variant="outline" className="mt-2 text-white border-white/30">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-300">Performance</p>
                  <div className="flex items-center gap-2 mt-1">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <span className="text-xl font-bold text-white">{systemMetrics.responseTime}ms</span>
                  </div>
                </div>
                <Badge className={`${systemMetrics.responseTime < 200 ? 'bg-green-500' : 'bg-yellow-500'} text-white`}>
                  {systemMetrics.responseTime < 200 ? 'Good' : 'Warning'}
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-sm text-blue-300">Avg response time</p>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={Math.max(0, Math.min(100, (300 - systemMetrics.responseTime) / 2))} className="flex-1" />
                  <span className="text-xs text-blue-300">Target: &lt;200ms</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.link}>
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${action.color}`}>
                        {action.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{action.title}</h3>
                        <p className="text-sm text-blue-300">{action.description}</p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {action.status}
                        </Badge>
                      </div>
                      <ExternalLink className="w-4 h-4 text-blue-300" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-sm">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-4">
            <h2 className="text-xl font-semibold text-white">System Services</h2>
            <div className="grid gap-4">
              {systemServices.map((service) => (
                <Card key={service.name} className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)}`} />
                        <div>
                          <h3 className="font-semibold text-white">{service.name}</h3>
                          <p className="text-sm text-blue-300">
                            {service.users} active users • Uptime: {service.uptime}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(service.status)} text-white`}>
                          {service.status}
                        </Badge>
                        <Button size="sm" variant="outline" className="text-white border-white/30">
                          <Settings className="w-3 h-3 mr-1" />
                          Manage
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-blue-300">
                      Last incident: {service.lastIncident}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Operational Metrics</h2>
            <div className="space-y-6">
              {operationalStats.map((category) => (
                <div key={category.category}>
                  <h3 className="text-lg font-semibold text-white mb-3">{category.category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {category.metrics.map((metric) => (
                      <Card key={metric.name} className="bg-white/10 backdrop-blur-sm border-white/20">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm text-blue-300">{metric.name}</p>
                              <p className="text-xl font-bold text-white">{metric.value}</p>
                            </div>
                            <Badge className={`${getStatusColor(metric.status)} text-white`}>
                              {metric.status}
                            </Badge>
                          </div>
                          <div className="mt-2">
                            <p className="text-xs text-blue-300">Target: {metric.target}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Recent Alerts</h2>
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <Alert key={alert.id} className={`${
                  alert.type === 'warning' ? 'bg-yellow-900/50 border-yellow-600' :
                  alert.type === 'success' ? 'bg-green-900/50 border-green-600' :
                  'bg-blue-900/50 border-blue-600'
                }`}>
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <AlertDescription className="text-white">
                        <strong>{alert.title}</strong>
                        <br />
                        {alert.message}
                        <br />
                        <span className="text-sm text-blue-300">{alert.time}</span>
                      </AlertDescription>
                    </div>
                    <Badge variant="outline" className="text-white">
                      {alert.severity}
                    </Badge>
                  </div>
                </Alert>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Operations Settings</h2>
            <div className="grid gap-4">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Alert Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-white">
                      <input type="checkbox" defaultChecked />
                      Email notifications for critical alerts
                    </label>
                    <label className="flex items-center gap-2 text-white">
                      <input type="checkbox" defaultChecked />
                      SMS notifications for system outages
                    </label>
                    <label className="flex items-center gap-2 text-white">
                      <input type="checkbox" />
                      Slack integration for incident updates
                    </label>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Monitoring Thresholds</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-blue-300">Response Time Warning</label>
                      <input 
                        type="number" 
                        defaultValue="200"
                        className="w-full p-2 bg-white/5 border border-white/20 rounded text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-blue-300">Error Rate Alert</label>
                      <input 
                        type="number" 
                        defaultValue="0.1"
                        step="0.01"
                        className="w-full p-2 bg-white/5 border border-white/20 rounded text-white"
                      />
                    </div>
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
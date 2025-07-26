import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  Server, 
  Database, 
  Wifi, 
  Shield, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  BarChart3,
  Zap
} from "lucide-react";

export default function SystemHealth() {
  const [realTimeData, setRealTimeData] = useState({
    cpu: 45,
    memory: 62,
    disk: 38,
    network: 23
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        cpu: Math.max(20, Math.min(80, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(30, Math.min(90, prev.memory + (Math.random() - 0.5) * 8)),
        disk: Math.max(20, Math.min(70, prev.disk + (Math.random() - 0.5) * 5)),
        network: Math.max(10, Math.min(50, prev.network + (Math.random() - 0.5) * 15))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const systemServices = [
    {
      name: "Web Application",
      status: "healthy",
      uptime: "99.97%",
      responseTime: "145ms",
      lastCheck: "30 seconds ago",
      endpoint: "https://safetysync.ai"
    },
    {
      name: "API Gateway",
      status: "healthy",
      uptime: "99.95%",
      responseTime: "89ms",
      lastCheck: "15 seconds ago",
      endpoint: "https://api.safetysync.ai"
    },
    {
      name: "Database Primary",
      status: "healthy",
      uptime: "99.99%",
      responseTime: "12ms",
      lastCheck: "10 seconds ago",
      endpoint: "PostgreSQL Cluster"
    },
    {
      name: "Database Replica",
      status: "healthy",
      uptime: "99.98%",
      responseTime: "15ms",
      lastCheck: "20 seconds ago",
      endpoint: "Read Replica"
    },
    {
      name: "Email Service",
      status: "warning",
      uptime: "98.45%",
      responseTime: "234ms",
      lastCheck: "1 minute ago",
      endpoint: "Microsoft 365 SMTP"
    },
    {
      name: "File Storage",
      status: "healthy",
      uptime: "99.96%",
      responseTime: "67ms",
      lastCheck: "45 seconds ago",
      endpoint: "AWS S3"
    },
    {
      name: "AI Services",
      status: "healthy",
      uptime: "99.89%",
      responseTime: "892ms",
      lastCheck: "25 seconds ago",
      endpoint: "OpenAI API"
    },
    {
      name: "Clone Detection",
      status: "healthy",
      uptime: "99.92%",
      responseTime: "156ms",
      lastCheck: "35 seconds ago",
      endpoint: "Internal Service"
    }
  ];

  const performanceMetrics = [
    {
      metric: "Average Response Time",
      value: "167ms",
      trend: "down",
      change: "-12ms",
      target: "< 200ms",
      status: "good"
    },
    {
      metric: "Error Rate",
      value: "0.03%",
      trend: "down",
      change: "-0.01%",
      target: "< 0.1%",
      status: "good"
    },
    {
      metric: "Throughput",
      value: "1,247 req/min",
      trend: "up",
      change: "+23 req/min",
      target: "> 1,000 req/min",
      status: "good"
    },
    {
      metric: "Concurrent Users",
      value: "89",
      trend: "up",
      change: "+7",
      target: "< 500",
      status: "good"
    }
  ];

  const securityStatus = [
    {
      component: "SSL Certificate",
      status: "valid",
      expires: "2025-06-15",
      issuer: "Let's Encrypt",
      daysRemaining: 158
    },
    {
      component: "Firewall",
      status: "active",
      rules: 47,
      blocked: 1247,
      allowed: 45678
    },
    {
      component: "Intrusion Detection",
      status: "active",
      threats: 0,
      lastScan: "5 minutes ago",
      nextScan: "55 minutes"
    },
    {
      component: "Backup Encryption",
      status: "enabled",
      algorithm: "AES-256",
      lastBackup: "2 hours ago",
      nextBackup: "22 hours"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "good":
      case "valid":
      case "active":
      case "enabled":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "critical":
      case "error":
        return "bg-red-500";
      default:
        return "bg-blue-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
      case "good":
      case "valid":
      case "active":
      case "enabled":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case "critical":
      case "error":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-blue-300" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Activity className="w-8 h-8 text-green-400" />
            <h1 className="text-3xl font-bold text-white">System Health</h1>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Real-time monitoring and performance metrics for SafetySync.AI infrastructure
          </p>
        </div>

        {/* Real-time System Resources */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Server className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-300">CPU Usage</p>
                    <p className="text-xl font-bold text-white">{realTimeData.cpu.toFixed(1)}%</p>
                  </div>
                </div>
                <div className="w-16">
                  <Progress value={realTimeData.cpu} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-300">Memory</p>
                    <p className="text-xl font-bold text-white">{realTimeData.memory.toFixed(1)}%</p>
                  </div>
                </div>
                <div className="w-16">
                  <Progress value={realTimeData.memory} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-300">Disk Usage</p>
                    <p className="text-xl font-bold text-white">{realTimeData.disk.toFixed(1)}%</p>
                  </div>
                </div>
                <div className="w-16">
                  <Progress value={realTimeData.disk} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wifi className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-sm text-gray-300">Network I/O</p>
                    <p className="text-xl font-bold text-white">{realTimeData.network.toFixed(1)} MB/s</p>
                  </div>
                </div>
                <div className="w-16">
                  <Progress value={realTimeData.network * 2} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-sm">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-4">
            <h2 className="text-xl font-semibold text-white">System Services Status</h2>
            <div className="grid gap-4">
              {systemServices.map((service) => (
                <Card key={service.name} className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(service.status)}
                        <div>
                          <h3 className="font-semibold text-white">{service.name}</h3>
                          <p className="text-sm text-gray-300">{service.endpoint}</p>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(service.status)} text-white`}>
                        {service.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                      <div>
                        <p className="text-blue-300">Uptime</p>
                        <p className="text-white font-semibold">{service.uptime}</p>
                      </div>
                      <div>
                        <p className="text-blue-300">Response Time</p>
                        <p className="text-white font-semibold">{service.responseTime}</p>
                      </div>
                      <div>
                        <p className="text-blue-300">Last Check</p>
                        <p className="text-white font-semibold">{service.lastCheck}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Performance Metrics</h2>
            <div className="grid gap-4">
              {performanceMetrics.map((metric) => (
                <Card key={metric.metric} className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-white">{metric.metric}</h3>
                        <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={`${getStatusColor(metric.status)} text-white`}>
                          {metric.status}
                        </Badge>
                        <div className="flex items-center gap-1 mt-2">
                          <TrendingUp className={`w-4 h-4 ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`} />
                          <span className="text-sm text-gray-300">{metric.change}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-blue-300">Target: {metric.target}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Security Status</h2>
            <div className="grid gap-4">
              {securityStatus.map((item) => (
                <Card key={item.component} className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-blue-400" />
                        <div>
                          <h3 className="font-semibold text-white">{item.component}</h3>
                          <div className="mt-2 text-sm text-gray-300">
                            {item.component === "SSL Certificate" && (
                              <div className="space-y-1">
                                <p>Expires: {item.expires}</p>
                                <p>Issuer: {item.issuer}</p>
                                <p>Days Remaining: {item.daysRemaining}</p>
                              </div>
                            )}
                            {item.component === "Firewall" && (
                              <div className="space-y-1">
                                <p>Active Rules: {item.rules}</p>
                                <p>Blocked: {item.blocked}</p>
                                <p>Allowed: {item.allowed}</p>
                              </div>
                            )}
                            {item.component === "Intrusion Detection" && (
                              <div className="space-y-1">
                                <p>Threats Detected: {item.threats}</p>
                                <p>Last Scan: {item.lastScan}</p>
                                <p>Next Scan: {item.nextScan}</p>
                              </div>
                            )}
                            {item.component === "Backup Encryption" && (
                              <div className="space-y-1">
                                <p>Algorithm: {item.algorithm}</p>
                                <p>Last Backup: {item.lastBackup}</p>
                                <p>Next Backup: {item.nextBackup}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(item.status)} text-white`}>
                        {item.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <h2 className="text-xl font-semibold text-white">System Alerts</h2>
            <div className="space-y-3">
              <Alert className="bg-yellow-900/50 border-yellow-600">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-white">
                  <strong>Warning:</strong> Email service response time above normal (234ms vs 150ms average)
                  <br />
                  <span className="text-sm text-gray-300">Detected 15 minutes ago</span>
                </AlertDescription>
              </Alert>
              
              <Alert className="bg-blue-900/50 border-blue-600">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-white">
                  <strong>Info:</strong> Scheduled maintenance completed successfully
                  <br />
                  <span className="text-sm text-gray-300">Completed 2 hours ago</span>
                </AlertDescription>
              </Alert>
              
              <Alert className="bg-green-900/50 border-green-600">
                <Zap className="h-4 w-4" />
                <AlertDescription className="text-white">
                  <strong>Success:</strong> All system backups completed successfully
                  <br />
                  <span className="text-sm text-gray-300">Completed 3 hours ago</span>
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
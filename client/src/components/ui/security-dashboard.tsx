import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Alert, AlertDescription } from './alert';
import { Progress } from './progress';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Eye, 
  AlertTriangle, 
  Lock, 
  Unlock,
  Activity,
  Globe,
  Server,
  Database,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface SecurityDashboardProps {
  isRealTime?: boolean;
}

export function SecurityDashboard({ isRealTime = true }: SecurityDashboardProps) {
  const [activeThreats, setActiveThreats] = useState(3);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [systemStatus, setSystemStatus] = useState('secure');

  // Real-time threat data simulation
  const securityMetrics = {
    threatLevel: 'medium',
    blockedAttacks: 1247,
    activeSessions: 342,
    dataEncryption: 99.9,
    systemUptime: 99.97,
    vulnerabilities: {
      critical: 0,
      high: 2,
      medium: 8,
      low: 15
    }
  };

  const threatHistory = [
    { time: '00:00', malware: 23, phishing: 12, ddos: 3, intrusion: 5 },
    { time: '04:00', malware: 31, phishing: 18, ddos: 1, intrusion: 8 },
    { time: '08:00', malware: 45, phishing: 24, ddos: 7, intrusion: 12 },
    { time: '12:00', malware: 67, phishing: 32, ddos: 4, intrusion: 15 },
    { time: '16:00', malware: 54, phishing: 28, ddos: 9, intrusion: 11 },
    { time: '20:00', malware: 38, phishing: 19, ddos: 2, intrusion: 7 }
  ];

  const geoThreats = [
    { country: 'Russia', threats: 234, risk: 'high' },
    { country: 'China', threats: 189, risk: 'high' },
    { country: 'North Korea', threats: 156, risk: 'high' },
    { country: 'Iran', threats: 98, risk: 'medium' },
    { country: 'Unknown', threats: 145, risk: 'medium' }
  ];

  const complianceStatus = [
    { framework: 'SOC 2 Type II', status: 'compliant', lastAudit: '2024-11-15', nextAudit: '2025-11-15' },
    { framework: 'ISO 27001', status: 'compliant', lastAudit: '2024-10-22', nextAudit: '2025-10-22' },
    { framework: 'GDPR', status: 'compliant', lastAudit: '2024-12-01', nextAudit: '2025-12-01' },
    { framework: 'HIPAA', status: 'compliant', lastAudit: '2024-09-18', nextAudit: '2025-09-18' },
    { framework: 'PCI DSS', status: 'compliant', lastAudit: '2024-08-30', nextAudit: '2025-08-30' }
  ];

  const activeAlerts = [
    {
      id: 1,
      type: 'Suspicious Login',
      severity: 'medium',
      description: 'Multiple failed login attempts from unusual location',
      timestamp: '2025-01-06 20:15:22',
      source: '192.168.1.100',
      status: 'investigating'
    },
    {
      id: 2,
      type: 'Data Access Anomaly',
      severity: 'high',
      description: 'Unusual data access pattern detected in employee records',
      timestamp: '2025-01-06 19:45:10',
      source: 'Internal User: j.smith@company.com',
      status: 'investigating'
    },
    {
      id: 3,
      type: 'Website Clone Detected',
      severity: 'high',
      description: 'AI system detected potential website clone at suspicious-domain.com',
      timestamp: '2025-01-06 18:32:45',
      source: 'AI Clone Monitor',
      status: 'confirmed'
    }
  ];

  const systemHealth = [
    { component: 'Web Application Firewall', status: 'operational', uptime: 99.98 },
    { component: 'Intrusion Detection System', status: 'operational', uptime: 99.95 },
    { component: 'AI Threat Analysis', status: 'operational', uptime: 99.99 },
    { component: 'Database Encryption', status: 'operational', uptime: 100.0 },
    { component: 'Clone Detection Engine', status: 'operational', uptime: 99.97 },
    { component: 'Authentication Service', status: 'operational', uptime: 99.94 }
  ];

  const vulnerabilityData = [
    { name: 'Critical', value: securityMetrics.vulnerabilities.critical, color: '#ef4444' },
    { name: 'High', value: securityMetrics.vulnerabilities.high, color: '#f97316' },
    { name: 'Medium', value: securityMetrics.vulnerabilities.medium, color: '#eab308' },
    { name: 'Low', value: securityMetrics.vulnerabilities.low, color: '#22c55e' }
  ];

  // Simulate real-time updates
  useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      setLastUpdate(new Date());
      setActiveThreats(prev => Math.max(0, prev + Math.floor(Math.random() * 3) - 1));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [isRealTime]);

  const getThreatBadge = (level: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
      critical: 'bg-red-200 text-red-900'
    };
    return <Badge className={colors[level as keyof typeof colors]}>{level.toUpperCase()}</Badge>;
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
      case 'critical':
        return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Shield className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-800">Security Operations Center</h1>
          <p className="text-blue-500 mt-2">Real-time security monitoring and threat intelligence</p>
          <div className="flex items-center gap-2 mt-2 text-sm text-blue-400">
            <Activity className="w-4 h-4" />
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            {isRealTime && (
              <Badge variant="outline" className="ml-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                LIVE
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Security Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-500">Threat Level</p>
                <p className="text-2xl font-bold text-yellow-600">MEDIUM</p>
                <div className="flex items-center mt-2">
                  <Shield className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-sm text-blue-500">{activeThreats} active threats</span>
                </div>
              </div>
              <ShieldAlert className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-500">Blocked Attacks</p>
                <p className="text-2xl font-bold text-green-600">{securityMetrics.blockedAttacks.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+23% this week</span>
                </div>
              </div>
              <ShieldCheck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-500">Active Sessions</p>
                <p className="text-2xl font-bold text-blue-600">{securityMetrics.activeSessions}</p>
                <div className="flex items-center mt-2">
                  <Eye className="w-4 h-4 text-blue-500 mr-1" />
                  <span className="text-sm text-blue-500">Real-time monitoring</span>
                </div>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-500">System Uptime</p>
                <p className="text-2xl font-bold text-green-600">{securityMetrics.systemUptime}%</p>
                <div className="flex items-center mt-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">All systems operational</span>
                </div>
              </div>
              <Server className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Active Security Alerts
          </CardTitle>
          <CardDescription>Real-time security incidents requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeAlerts.map((alert) => (
              <Alert key={alert.id} className="border-l-4 border-l-red-500">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(alert.severity)}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{alert.type}</h4>
                        {getThreatBadge(alert.severity)}
                        <Badge variant="outline" className="text-xs">
                          {alert.status.toUpperCase()}
                        </Badge>
                      </div>
                      <AlertDescription className="text-sm text-blue-500">
                        {alert.description}
                      </AlertDescription>
                      <div className="mt-2 text-xs text-blue-400">
                        <span>{alert.timestamp}</span> • <span>{alert.source}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Investigate
                  </Button>
                </div>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Threat Activity Timeline</CardTitle>
            <CardDescription>24-hour threat detection and blocking activity</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={threatHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="malware" stroke="#ef4444" strokeWidth={2} name="Malware" />
                <Line type="monotone" dataKey="phishing" stroke="#f97316" strokeWidth={2} name="Phishing" />
                <Line type="monotone" dataKey="ddos" stroke="#eab308" strokeWidth={2} name="DDoS" />
                <Line type="monotone" dataKey="intrusion" stroke="#3b82f6" strokeWidth={2} name="Intrusion" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vulnerability Distribution</CardTitle>
            <CardDescription>Current security vulnerabilities by severity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={vulnerabilityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {vulnerabilityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {vulnerabilityData.map((vuln, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: vuln.color }}></div>
                    <span className="text-sm">{vuln.name}</span>
                  </div>
                  <span className="text-sm font-medium">{vuln.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Threats and System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Geographic Threat Sources
            </CardTitle>
            <CardDescription>Top threat origins by country</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {geoThreats.map((threat, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-red-700">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium">{threat.country}</h4>
                      <p className="text-sm text-blue-500">{threat.threats} threats detected</p>
                    </div>
                  </div>
                  {getThreatBadge(threat.risk)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              System Health Status
            </CardTitle>
            <CardDescription>Security component operational status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemHealth.map((component, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{component.component}</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600">{component.uptime}%</span>
                    </div>
                  </div>
                  <Progress value={component.uptime} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Compliance & Certification Status
          </CardTitle>
          <CardDescription>Current compliance with security frameworks and standards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {complianceStatus.map((framework, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{framework.framework}</h4>
                  <Badge className="bg-green-100 text-green-800">COMPLIANT</Badge>
                </div>
                <div className="space-y-1 text-sm text-blue-500">
                  <div className="flex justify-between">
                    <span>Last Audit:</span>
                    <span>{framework.lastAudit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next Audit:</span>
                    <span>{framework.nextAudit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            AI-Powered Security Recommendations
          </CardTitle>
          <CardDescription>Intelligent suggestions to enhance security posture</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Enable Multi-Factor Authentication</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Implement MFA for all administrative accounts to reduce unauthorized access risk by 99.9%.
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Configure MFA
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">Update Security Policies</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Review and update password policies to meet latest security standards.
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Review Policies
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">Enhanced Clone Detection</h4>
                <p className="text-sm text-green-700 mt-1">
                  Your AI clone detection system is performing excellently. Consider expanding monitoring to social media platforms.
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Expand Monitoring
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
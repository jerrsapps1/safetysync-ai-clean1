import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Lock, Eye, EyeOff, RefreshCw } from 'lucide-react';

export default function SecurityDashboard() {
  const [showDetails, setShowDetails] = useState(false);

  const securityStatus = {
    overall: 'Good',
    score: 85,
    lastCheck: new Date().toLocaleString(),
    features: [
      { name: 'Password Security', status: 'Active', description: 'Strong password requirements enforced' },
      { name: 'Rate Limiting', status: 'Active', description: 'Login attempts limited to prevent brute force' },
      { name: 'Session Management', status: 'Active', description: 'Secure token-based authentication' },
      { name: 'Account Lockout', status: 'Active', description: 'Automatic lockout after failed attempts' },
      { name: 'Security Headers', status: 'Active', description: 'CSRF, XSS, and clickjacking protection' },
      { name: 'Audit Logging', status: 'Active', description: 'All security events are logged' }
    ],
    recentEvents: [
      { event: 'Successful login', user: 'testuser', time: '2 minutes ago', severity: 'info' },
      { event: 'Password changed', user: 'admin', time: '1 hour ago', severity: 'info' },
      { event: 'Failed login attempt', user: 'unknown', time: '3 hours ago', severity: 'warning' }
    ]
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Security Dashboard</h1>
          <p className="text-gray-600">Monitor and manage your platform security</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh Status
        </Button>
      </div>

      {/* Security Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Security Score
          </CardTitle>
          <CardDescription>Overall security health of your platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-green-600">{securityStatus.score}/100</div>
            <div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {securityStatus.overall}
              </Badge>
              <p className="text-sm text-gray-600 mt-1">Last checked: {securityStatus.lastCheck}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card>
        <CardHeader>
          <CardTitle>Active Security Features</CardTitle>
          <CardDescription>Security measures currently protecting your platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {securityStatus.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{feature.name}</h3>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                      {feature.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recent Security Events
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2"
            >
              {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showDetails ? 'Hide' : 'Show'} Details
            </Button>
          </CardTitle>
          <CardDescription>Latest security-related activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityStatus.recentEvents.map((event, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                {event.severity === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                ) : (
                  <Lock className="w-5 h-5 text-green-600" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{event.event}</span>
                    {showDetails && (
                      <Badge variant="outline" className="text-xs">
                        {event.user}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{event.time}</p>
                </div>
                <Badge 
                  variant={event.severity === 'warning' ? 'destructive' : 'secondary'}
                  className="text-xs"
                >
                  {event.severity}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Security Recommendations</CardTitle>
          <CardDescription>Suggestions to improve your security posture</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900">Enable Two-Factor Authentication</h3>
                <p className="text-sm text-blue-700 mt-1">Add an extra layer of security to user accounts</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Shield className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-green-900">Regular Security Audits</h3>
                <p className="text-sm text-green-700 mt-1">Schedule monthly security reviews</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
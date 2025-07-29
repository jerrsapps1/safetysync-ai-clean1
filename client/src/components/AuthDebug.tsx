import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AuthStatus {
  status: string;
  database: string;
  timestamp: string;
  environment: string;
  jwtSecret: string;
  users: {
    testuser: string;
    demouser: string;
  };
}

export default function AuthDebug() {
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAuthStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/debug/auth-status');
      const data = await response.json();
      setAuthStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch auth status');
    } finally {
      setLoading(false);
    }
  };

  const createProductionUser = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/create-production-user', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        alert(`Production user created!\nUsername: ${data.credentials.username}\nPassword: ${data.credentials.password}`);
        checkAuthStatus(); // Refresh status
      } else {
        alert(`Failed to create user: ${data.message}`);
      }
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Authentication System Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={checkAuthStatus} disabled={loading}>
            {loading ? 'Checking...' : 'Check Status'}
          </Button>
          <Button onClick={createProductionUser} disabled={loading} variant="outline">
            Create Production User
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">Error: {error}</p>
          </div>
        )}

        {authStatus && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Status:</span>
                <Badge variant={authStatus.status === 'success' ? 'default' : 'destructive'} className="ml-2">
                  {authStatus.status}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Database:</span>
                <Badge variant={authStatus.database === 'connected' ? 'default' : 'destructive'} className="ml-2">
                  {authStatus.database}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Environment:</span>
                <Badge variant="outline" className="ml-2">
                  {authStatus.environment}
                </Badge>
              </div>
              <div>
                <span className="font-medium">JWT Secret:</span>
                <Badge variant={authStatus.jwtSecret === 'configured' ? 'default' : 'secondary'} className="ml-2">
                  {authStatus.jwtSecret}
                </Badge>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Available Users:</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span>testuser:</span>
                  <Badge variant={authStatus.users.testuser === 'exists' ? 'default' : 'destructive'} className="ml-2">
                    {authStatus.users.testuser}
                  </Badge>
                </div>
                <div>
                  <span>demouser:</span>
                  <Badge variant={authStatus.users.demouser === 'exists' ? 'default' : 'destructive'} className="ml-2">
                    {authStatus.users.demouser}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Last checked: {new Date(authStatus.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Test Credentials</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>Username:</strong> testuser | <strong>Password:</strong> password</p>
            <p><strong>Username:</strong> produser | <strong>Password:</strong> password</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
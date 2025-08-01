import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function AuthTest() {
  const [username, setUsername] = useState('testuser');
  const [password, setPassword] = useState('password');
  const [apiTest, setApiTest] = useState('');
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  const { toast } = useToast();

  const testDirectLogin = async () => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      setApiTest(JSON.stringify(result, null, 2));
      
      if (result.success) {
        toast({
          title: "Direct API Test Successful",
          description: "Backend authentication is working",
        });
      }
    } catch (error) {
      setApiTest(`Error: ${error}`);
      toast({
        title: "Direct API Test Failed",
        description: "Backend authentication error",
        variant: "destructive"
      });
    }
  };

  const testHookLogin = async () => {
    try {
      const result = await login(username, password);
      if (result.success) {
        toast({
          title: "Hook Login Successful",
          description: "Authentication hook is working",
        });
      } else {
        toast({
          title: "Hook Login Failed",
          description: result.message || "Authentication hook error",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Hook Login Error",
        description: "Authentication hook error",
        variant: "destructive"
      });
    }
  };

  const checkStorageAccess = () => {
    try {
      // Test sessionStorage access
      sessionStorage.setItem('test', 'value');
      const testValue = sessionStorage.getItem('test');
      sessionStorage.removeItem('test');
      
      toast({
        title: "Storage Access Test",
        description: `sessionStorage working: ${testValue === 'value' ? 'Yes' : 'No'}`,
      });
    } catch (error) {
      toast({
        title: "Storage Access Failed",
        description: "sessionStorage is not accessible",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Debug Tool</CardTitle>
            <CardDescription>Test authentication system for deployment debugging</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Current Auth State */}
            <div className="bg-blue-100 p-4 rounded">
              <h3 className="font-semibold mb-2">Current Authentication State</h3>
              <div className="space-y-1 text-sm">
                <p>Loading: {isLoading.toString()}</p>
                <p>Authenticated: {isAuthenticated.toString()}</p>
                <p>User: {user ? JSON.stringify(user, null, 2) : 'null'}</p>
                <p>Token in sessionStorage: {sessionStorage.getItem('auth_token') ? 'Present' : 'Missing'}</p>
              </div>
            </div>

            {/* Login Form */}
            <div className="space-y-4">
              <h3 className="font-semibold">Test Login</h3>
              <div className="flex gap-4">
                <Input
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={testDirectLogin}>
                  Test Direct API Call
                </Button>
                <Button onClick={testHookLogin}>
                  Test useAuth Hook
                </Button>
                <Button onClick={checkStorageAccess}>
                  Test Storage Access
                </Button>
                {isAuthenticated && (
                  <Button onClick={logout} variant="destructive">
                    Logout
                  </Button>
                )}
              </div>
            </div>

            {/* API Response */}
            {apiTest && (
              <div className="bg-blue-100 p-4 rounded">
                <h3 className="font-semibold mb-2">Direct API Response</h3>
                <pre className="text-xs overflow-auto">{apiTest}</pre>
              </div>
            )}

            {/* Environment Info */}
            <div className="bg-blue-100 p-4 rounded">
              <h3 className="font-semibold mb-2">Environment Information</h3>
              <div className="space-y-1 text-sm">
                <p>Location: {window.location.href}</p>
                <p>User Agent: {navigator.userAgent}</p>
                <p>Cookies Enabled: {navigator.cookieEnabled.toString()}</p>
                <p>Storage Support: {typeof(Storage) !== "undefined" ? 'Yes' : 'No'}</p>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
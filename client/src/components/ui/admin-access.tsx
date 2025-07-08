import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Lock, Eye, EyeOff, Home, Brain } from "lucide-react";

interface AdminAccessProps {
  onAccessGranted: () => void;
}

export function AdminAccess({ onAccessGranted }: AdminAccessProps) {
  const [adminKey, setAdminKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Check if admin access is already granted
  useEffect(() => {
    const savedKey = localStorage.getItem('admin_key');
    if (savedKey) {
      verifyAdminAccess(savedKey);
    }
  }, []);

  const verifyAdminAccess = async (key: string) => {
    setIsVerifying(true);
    setError("");

    try {
      const response = await fetch('/api/admin/users', {
        headers: { 'x-admin-key': key }
      });

      if (response.ok) {
        localStorage.setItem('admin_key', key);
        onAccessGranted();
      } else {
        setError("Invalid admin key. Access denied.");
        localStorage.removeItem('admin_key');
      }
    } catch (error) {
      setError("Unable to verify admin access. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKey.trim()) {
      verifyAdminAccess(adminKey.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SafetySync.AI
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/industry-research">
                <Button variant="ghost" size="sm">Industry Research</Button>
              </Link>
              <Link href="/case-studies">
                <Button variant="ghost" size="sm">Case Studies</Button>
              </Link>
              <Link href="/pricing">
                <Button variant="ghost" size="sm">Pricing</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Admin Access Required</CardTitle>
          <CardDescription>
            This area is restricted to administrators only. Please enter your admin key to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adminKey">Admin Key</Label>
              <div className="relative">
                <Input
                  id="adminKey"
                  type={showKey ? "text" : "password"}
                  placeholder="Enter admin key"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            {error && (
              <Alert variant="destructive">
                <Lock className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isVerifying || !adminKey.trim()}
            >
              {isVerifying ? "Verifying..." : "Access Admin Panel"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have admin access? Contact the system administrator.
            </p>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
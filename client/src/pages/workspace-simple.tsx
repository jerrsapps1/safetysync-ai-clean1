import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Users, 
  FileText,
  Home,
  Settings,
  BarChart3
} from "lucide-react";

export default function WorkspaceSimple() {
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Handle authentication state
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      console.log('🏢 WORKSPACE: Not authenticated, redirecting to client portal');
      window.location.href = '/client-portal';
    }
  }, [authLoading, isAuthenticated]);

  // Track workspace access with Clarity analytics
  useEffect(() => {
    if (window.clarity) window.clarity('set', 'workspace_accessed', true);
  }, []);

  console.log('🏢 WORKSPACE SIMPLE: Component render', { 
    isAuthenticated, 
    authLoading, 
    hasUser: !!user
  });

  // Show loading state while authentication is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-blue-200">Please wait while we load your workspace</p>
        </div>
      </div>
    );
  }

  // Show authentication required if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-blue-200">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-blue-400/30 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">SafetySync.AI Workspace</h1>
            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
              {user?.userTier || 'Free Trial'}
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-blue-200">Welcome, {user?.name}</span>
            <Button
              onClick={logout}
              variant="outline"
              className="border-blue-400/30 text-blue-200 hover:bg-blue-600/20"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-black/20 backdrop-blur-sm border-r border-blue-400/30 min-h-screen p-4">
          <div className="space-y-2">
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
              className="w-full justify-start text-white"
              onClick={() => setActiveTab('dashboard')}
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === 'employees' ? 'default' : 'ghost'}
              className="w-full justify-start text-white"
              onClick={() => setActiveTab('employees')}
            >
              <Users className="w-4 h-4 mr-2" />
              Employee Management
            </Button>
            <Button
              variant={activeTab === 'training' ? 'default' : 'ghost'}
              className="w-full justify-start text-white"
              onClick={() => setActiveTab('training')}
            >
              <FileText className="w-4 h-4 mr-2" />
              Training Documents
            </Button>
            <Button
              variant={activeTab === 'reports' ? 'default' : 'ghost'}
              className="w-full justify-start text-white"
              onClick={() => setActiveTab('reports')}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Compliance Reports
            </Button>
            <Button
              variant={activeTab === 'settings' ? 'default' : 'ghost'}
              className="w-full justify-start text-white"
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white mb-6">Dashboard Overview</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-black/20 backdrop-blur-sm border-blue-400/30">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-blue-200">Total Employees</CardTitle>
                    <Users className="h-4 w-4 text-blue-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">12</div>
                    <p className="text-xs text-blue-300">Active employees in system</p>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 backdrop-blur-sm border-blue-400/30">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-blue-200">Compliant</CardTitle>
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">9</div>
                    <p className="text-xs text-blue-300">Employees up to date</p>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 backdrop-blur-sm border-blue-400/30">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-blue-200">Pending Training</CardTitle>
                    <Clock className="h-4 w-4 text-amber-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">3</div>
                    <p className="text-xs text-blue-300">Employees need training</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="bg-black/20 backdrop-blur-sm border-blue-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                  <CardDescription className="text-blue-300">Latest training and compliance updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                      <span className="text-blue-200">John Smith completed Fall Protection training</span>
                      <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
                        Today
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                      <span className="text-blue-200">Safety certification expires in 30 days for 2 employees</span>
                      <Badge variant="secondary" className="bg-amber-500/20 text-amber-300 border-amber-400/30">
                        Alert
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FileText className="h-4 w-4 text-blue-400" />
                      <span className="text-blue-200">New OSHA training document uploaded</span>
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-400/30">
                        Yesterday
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'employees' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white mb-6">Employee Management</h2>
              <Card className="bg-black/20 backdrop-blur-sm border-blue-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Employee Database</CardTitle>
                  <CardDescription className="text-blue-300">Manage your workforce and training records</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-200">Employee management features will be available here.</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'training' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white mb-6">Training Documents</h2>
              <Card className="bg-black/20 backdrop-blur-sm border-blue-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Document Hub</CardTitle>
                  <CardDescription className="text-blue-300">Upload and manage training materials</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-200">Training document management features will be available here.</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white mb-6">Compliance Reports</h2>
              <Card className="bg-black/20 backdrop-blur-sm border-blue-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Audit Ready Reports</CardTitle>
                  <CardDescription className="text-blue-300">Generate compliance documentation</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-200">Compliance reporting features will be available here.</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white mb-6">Settings</h2>
              <Card className="bg-black/20 backdrop-blur-sm border-blue-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Workspace Configuration</CardTitle>
                  <CardDescription className="text-blue-300">Customize your workspace</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-200">Settings panel will be available here.</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
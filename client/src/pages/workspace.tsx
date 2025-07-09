import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { ComplianceReportGenerator } from "@/components/ui/compliance-report-generator";
import { AICloneDetector } from "@/components/ui/ai-clone-detector";
import { CollaborationLayer } from "@/components/ui/collaboration-layer";
import { AIQuickActions } from "@/components/ui/ai-quick-actions";
import { AIPatternSkeleton } from "@/components/ui/ai-skeleton";
import SafetyTrendsDashboard from "@/components/safety-trends-dashboard";
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Users, 
  FileText, 
  Calendar,
  TrendingUp,
  Shield,
  Bell,
  Download,
  Plus,
  Search,
  Home,
  ArrowLeft,
  Brain,
  Eye,
  Palette,
  Upload,
  RefreshCw,
  Building,
  MapPin,
  Edit,
  BookOpen,
  Award,
  CreditCard,
  Package,
  Calculator,
  Database,
  Activity,
  BarChart3,
  Settings,
  User,
  LogOut,
  Menu,
  X
} from "lucide-react";

interface ComplianceRecord {
  id: number;
  employeeName: string;
  training: string;
  status: 'completed' | 'pending' | 'expired';
  dueDate: string;
  completedDate?: string;
  certificateUrl?: string;
}

interface DashboardStats {
  totalEmployees: number;
  compliantEmployees: number;
  pendingTraining: number;
  expiringCertifications: number;
  complianceScore: number;
}

interface WorkspaceSettings {
  companyName: string;
  companyLogo: string;
  primaryColor: string;
  secondaryColor: string;
  customDomain: string;
  showBranding: boolean;
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      toast({
        title: "Login Successful",
        description: "Welcome to your SafetySync.AI workspace!",
      });
      window.location.reload();
    } else {
      toast({
        title: "Login Failed",
        description: result.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">SafetySync.AI</h1>
          <p className="text-blue-100">Access your safety management workspace</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Sign in to your workspace</CardTitle>
            <CardDescription className="text-blue-100">
              Enter your credentials to access your safety management tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder-blue-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder-blue-200"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-blue-100 text-sm">
            Don't have an account?{" "}
            <a href="/" className="text-white hover:underline">
              Learn more about SafetySync.AI
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function WorkspacePage() {
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [workspaceSettings, setWorkspaceSettings] = useState<WorkspaceSettings>({
    companyName: "SafetySync.AI",
    companyLogo: "",
    primaryColor: "#10B981",
    secondaryColor: "#3B82F6",
    customDomain: "",
    showBranding: true
  });

  // Mock data - in production this would come from your API
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 147,
    compliantEmployees: 129,
    pendingTraining: 8,
    expiringCertifications: 3,
    complianceScore: 88
  });

  const [complianceRecords, setComplianceRecords] = useState<ComplianceRecord[]>([
    {
      id: 1,
      employeeName: "John Smith",
      training: "Fall Protection",
      status: "completed",
      dueDate: "2024-12-15",
      completedDate: "2024-06-15",
      certificateUrl: "/certificates/john-smith-fall-protection.pdf"
    },
    {
      id: 2,
      employeeName: "Sarah Johnson",
      training: "Forklift Operation",
      status: "pending",
      dueDate: "2024-08-20",
    },
    {
      id: 3,
      employeeName: "Mike Davis",
      training: "First Aid/CPR",
      status: "expired",
      dueDate: "2024-07-01",
      completedDate: "2023-07-01"
    }
  ]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <AIPatternSkeleton variant="dashboard" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-black/20 backdrop-blur-sm border-r border-gray-800 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-semibold">
                    {workspaceSettings.showBranding ? workspaceSettings.companyName : "SafetySync.AI"}
                  </h2>
                  <p className="text-gray-400 text-sm">Workspace</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <Button
            variant={activeTab === "overview" ? "secondary" : "ghost"}
            className="w-full justify-start text-gray-300 hover:text-white"
            onClick={() => setActiveTab("overview")}
          >
            <Home className="w-5 h-5 mr-3" />
            {sidebarOpen && "Overview"}
          </Button>
          <Button
            variant={activeTab === "employees" ? "secondary" : "ghost"}
            className="w-full justify-start text-gray-300 hover:text-white"
            onClick={() => setActiveTab("employees")}
          >
            <Users className="w-5 h-5 mr-3" />
            {sidebarOpen && "Employees"}
          </Button>
          <Button
            variant={activeTab === "training" ? "secondary" : "ghost"}
            className="w-full justify-start text-gray-300 hover:text-white"
            onClick={() => setActiveTab("training")}
          >
            <BookOpen className="w-5 h-5 mr-3" />
            {sidebarOpen && "Training"}
          </Button>
          <Button
            variant={activeTab === "certificates" ? "secondary" : "ghost"}
            className="w-full justify-start text-gray-300 hover:text-white"
            onClick={() => setActiveTab("certificates")}
          >
            <Award className="w-5 h-5 mr-3" />
            {sidebarOpen && "Certificates"}
          </Button>
          <Button
            variant={activeTab === "reports" ? "secondary" : "ghost"}
            className="w-full justify-start text-gray-300 hover:text-white"
            onClick={() => setActiveTab("reports")}
          >
            <FileText className="w-5 h-5 mr-3" />
            {sidebarOpen && "Reports"}
          </Button>
          <Button
            variant={activeTab === "trends" ? "secondary" : "ghost"}
            className="w-full justify-start text-gray-300 hover:text-white"
            onClick={() => setActiveTab("trends")}
          >
            <TrendingUp className="w-5 h-5 mr-3" />
            {sidebarOpen && "Safety Trends"}
          </Button>
          <Button
            variant={activeTab === "settings" ? "secondary" : "ghost"}
            className="w-full justify-start text-gray-300 hover:text-white"
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="w-5 h-5 mr-3" />
            {sidebarOpen && "Settings"}
          </Button>
        </nav>

        {/* User Menu */}
        <div className="p-4 border-t border-gray-800">
          {sidebarOpen && (
            <div className="mb-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{user?.name || "User"}</p>
                  <p className="text-gray-400 text-xs">Safety Manager</p>
                </div>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            {sidebarOpen && "Sign Out"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-black/20 backdrop-blur-sm border-b border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {activeTab === "overview" && "Workspace Overview"}
                {activeTab === "employees" && "Employee Management"}
                {activeTab === "training" && "Training Management"}
                {activeTab === "certificates" && "Certificate Generation"}
                {activeTab === "reports" && "Compliance Reports"}
                {activeTab === "trends" && "Safety Trends"}
                {activeTab === "settings" && "Workspace Settings"}
              </h1>
              <p className="text-gray-400">
                {activeTab === "overview" && "Monitor your safety compliance at a glance"}
                {activeTab === "employees" && "Manage employee certifications and training"}
                {activeTab === "training" && "Schedule and track safety training"}
                {activeTab === "certificates" && "Generate professional certificates and cards"}
                {activeTab === "reports" && "Generate compliance reports for audits"}
                {activeTab === "trends" && "Analyze safety trends and performance"}
                {activeTab === "settings" && "Configure your workspace and branding"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-800">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <a href="/" className="text-gray-400 hover:text-white text-sm">
                ← Back to SafetySync.AI
              </a>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Total Employees</p>
                        <p className="text-2xl font-bold text-white">{stats.totalEmployees}</p>
                      </div>
                      <Users className="w-8 h-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Compliant</p>
                        <p className="text-2xl font-bold text-emerald-400">{stats.compliantEmployees}</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Pending Training</p>
                        <p className="text-2xl font-bold text-yellow-400">{stats.pendingTraining}</p>
                      </div>
                      <Clock className="w-8 h-8 text-yellow-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Compliance Score</p>
                        <p className="text-2xl font-bold text-white">{stats.complianceScore}%</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {complianceRecords.slice(0, 3).map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{record.employeeName}</p>
                            <p className="text-gray-400 text-sm">{record.training}</p>
                          </div>
                        </div>
                        <Badge variant={record.status === 'completed' ? 'default' : record.status === 'pending' ? 'secondary' : 'destructive'}>
                          {record.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "employees" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Employee Management</h2>
                <Button className="bg-emerald-500 hover:bg-emerald-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Employee
                </Button>
              </div>
              <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Employee Management</h3>
                    <p className="text-gray-400">Your SafetyTracker app integration will display all employee management features here.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "training" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Training Management</h2>
                <Button className="bg-emerald-500 hover:bg-emerald-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Training
                </Button>
              </div>
              <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Training Management</h3>
                    <p className="text-gray-400">Your SafetyTracker app integration will display all training management features here.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "certificates" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Certificate Generation</h2>
                <Button className="bg-emerald-500 hover:bg-emerald-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Certificate
                </Button>
              </div>
              <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Certificate Generation</h3>
                    <p className="text-gray-400">Your SafetyTracker app integration will display certificate generation features here.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="space-y-6">
              <ComplianceReportGenerator />
            </div>
          )}

          {activeTab === "trends" && (
            <div className="space-y-6">
              <SafetyTrendsDashboard />
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Workspace Settings</CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure your white-label workspace appearance and branding
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="companyName" className="text-white">Company Name</Label>
                      <Input
                        id="companyName"
                        value={workspaceSettings.companyName}
                        onChange={(e) => setWorkspaceSettings({...workspaceSettings, companyName: e.target.value})}
                        className="bg-gray-800/50 border-gray-700 text-white"
                        placeholder="Your Company Name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="primaryColor" className="text-white">Primary Color</Label>
                      <Input
                        id="primaryColor"
                        type="color"
                        value={workspaceSettings.primaryColor}
                        onChange={(e) => setWorkspaceSettings({...workspaceSettings, primaryColor: e.target.value})}
                        className="bg-gray-800/50 border-gray-700 h-12 w-20"
                      />
                    </div>

                    <div>
                      <Label htmlFor="customDomain" className="text-white">Custom Domain</Label>
                      <Input
                        id="customDomain"
                        value={workspaceSettings.customDomain}
                        onChange={(e) => setWorkspaceSettings({...workspaceSettings, customDomain: e.target.value})}
                        className="bg-gray-800/50 border-gray-700 text-white"
                        placeholder="safety.yourcompany.com"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="showBranding"
                        checked={workspaceSettings.showBranding}
                        onCheckedChange={(checked) => setWorkspaceSettings({...workspaceSettings, showBranding: checked})}
                      />
                      <Label htmlFor="showBranding" className="text-white">Show SafetySync.AI Branding</Label>
                    </div>
                  </div>

                  <Button className="bg-emerald-500 hover:bg-emerald-600">
                    Save Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* AI Quick Actions */}
      <AIQuickActions />
    </div>
  );
}
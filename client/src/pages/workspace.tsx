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
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
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
  X,
  GripVertical,
  EyeOff,
  RotateCcw
} from "lucide-react";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardWidget {
  id: string;
  title: string;
  component: React.ReactNode;
  defaultProps: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  icon: React.ReactNode;
  visible: boolean;
}

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

  // Widget icon mapping
  const getWidgetIcon = (id: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      "total-employees": <Users className="w-5 h-5" />,
      "compliant-employees": <CheckCircle className="w-5 h-5" />,
      "pending-training": <Clock className="w-5 h-5" />,
      "compliance-score": <TrendingUp className="w-5 h-5" />,
      "recent-activity": <Activity className="w-5 h-5" />,
      "training-calendar": <Calendar className="w-5 h-5" />,
      "safety-alerts": <AlertTriangle className="w-5 h-5" />,
      "certification-progress": <Award className="w-5 h-5" />,
      "compliance-trends": <BarChart3 className="w-5 h-5" />,
    };
    return iconMap[id] || <Settings className="w-5 h-5" />;
  };

  // Default widget configuration (without React components)
  const defaultWidgetConfig = [
    {
      id: "total-employees",
      title: "Total Employees",
      defaultProps: { x: 0, y: 0, w: 3, h: 2 },
      visible: true
    },
    {
      id: "compliant-employees",
      title: "Compliant Employees",
      defaultProps: { x: 3, y: 0, w: 3, h: 2 },
      visible: true
    },
    {
      id: "pending-training",
      title: "Pending Training",
      defaultProps: { x: 6, y: 0, w: 3, h: 2 },
      visible: true
    },
    {
      id: "compliance-score",
      title: "Compliance Score",
      defaultProps: { x: 9, y: 0, w: 3, h: 2 },
      visible: true
    },
    {
      id: "recent-activity",
      title: "Recent Activity",
      defaultProps: { x: 0, y: 2, w: 6, h: 4 },
      visible: true
    },
    {
      id: "training-calendar",
      title: "Training Calendar",
      defaultProps: { x: 6, y: 2, w: 6, h: 4 },
      visible: true
    },
    {
      id: "safety-alerts",
      title: "Safety Alerts",
      defaultProps: { x: 0, y: 6, w: 4, h: 3 },
      visible: true
    },
    {
      id: "certification-progress",
      title: "Certification Progress",
      defaultProps: { x: 4, y: 6, w: 4, h: 3 },
      visible: true
    },
    {
      id: "compliance-trends",
      title: "Compliance Trends",
      defaultProps: { x: 8, y: 6, w: 4, h: 3 },
      visible: true
    }
  ];

  // Create widgets with icons
  const createWidgets = (config: any[]) => {
    return config.map(widget => ({
      ...widget,
      component: null,
      icon: getWidgetIcon(widget.id)
    }));
  };

  // Widget management state with persistence
  const [widgets, setWidgets] = useState<DashboardWidget[]>(() => {
    const saved = localStorage.getItem('workspace-widgets');
    if (saved) {
      const savedWidgets = JSON.parse(saved);
      // Merge saved visibility state with default widget configuration
      const mergedConfig = defaultWidgetConfig.map(widget => {
        const savedWidget = savedWidgets.find((w: any) => w.id === widget.id);
        return savedWidget ? { ...widget, visible: savedWidget.visible } : widget;
      });
      return createWidgets(mergedConfig);
    }
    return createWidgets(defaultWidgetConfig);
  });

  const [layouts, setLayouts] = useState(() => {
    const saved = localStorage.getItem('workspace-layouts');
    console.log('Loading layouts from localStorage:', saved);
    const parsedLayouts = saved ? JSON.parse(saved) : {};
    console.log('Parsed layouts:', parsedLayouts);
    return parsedLayouts;
  });
  
  const [showWidgetManager, setShowWidgetManager] = useState(false);

  // Save widget visibility to localStorage (not the full widget objects with React components)
  useEffect(() => {
    const widgetVisibility = widgets.map(widget => ({
      id: widget.id,
      visible: widget.visible
    }));
    localStorage.setItem('workspace-widgets', JSON.stringify(widgetVisibility));
  }, [widgets]);

  // Save layouts to localStorage whenever they change
  useEffect(() => {
    console.log('Saving layouts to localStorage:', layouts);
    localStorage.setItem('workspace-layouts', JSON.stringify(layouts));
  }, [layouts]);

  // Widget management functions
  const toggleWidgetVisibility = (widgetId: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === widgetId 
        ? { ...widget, visible: !widget.visible }
        : widget
    ));
  };

  const resetWidgetLayout = () => {
    // Reset to default layout and visibility
    setLayouts({});
    setWidgets(createWidgets(defaultWidgetConfig));
    
    // Clear localStorage
    localStorage.removeItem('workspace-layouts');
    localStorage.removeItem('workspace-widgets');
  };

  const handleLayoutChange = (layout: any, layouts: any) => {
    console.log('handleLayoutChange called with:', { layout, layouts });
    setLayouts(layouts);
  };

  // Generate widget content
  const generateWidgetContent = (widget: DashboardWidget) => {
    switch (widget.id) {
      case "total-employees":
        return (
          <div className="flex items-center justify-between h-full">
            <div>
              <p className="text-gray-400 text-sm">Total Employees</p>
              <p className="text-2xl font-bold text-white">{stats.totalEmployees}</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        );
      case "compliant-employees":
        return (
          <div className="flex items-center justify-between h-full">
            <div>
              <p className="text-gray-400 text-sm">Compliant</p>
              <p className="text-2xl font-bold text-emerald-400">{stats.compliantEmployees}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
        );
      case "pending-training":
        return (
          <div className="flex items-center justify-between h-full">
            <div>
              <p className="text-gray-400 text-sm">Pending Training</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.pendingTraining}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        );
      case "compliance-score":
        return (
          <div className="flex items-center justify-between h-full">
            <div>
              <p className="text-gray-400 text-sm">Compliance Score</p>
              <p className="text-2xl font-bold text-white">{stats.complianceScore}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-400" />
          </div>
        );
      case "recent-activity":
        return (
          <div className="h-full">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {complianceRecords.slice(0, 3).map((record) => (
                <div key={record.id} className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{record.employeeName}</p>
                      <p className="text-gray-400 text-xs">{record.training}</p>
                    </div>
                  </div>
                  <Badge variant={record.status === 'completed' ? 'default' : record.status === 'pending' ? 'secondary' : 'destructive'}>
                    {record.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        );
      case "training-calendar":
        return (
          <div className="h-full">
            <h3 className="text-lg font-semibold text-white mb-4">Upcoming Training</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-2 bg-gray-800/50 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-white text-sm font-medium">Fall Protection Training</p>
                  <p className="text-gray-400 text-xs">July 15, 2025 - 9:00 AM</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-2 bg-gray-800/50 rounded-lg">
                <Calendar className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white text-sm font-medium">OSHA 30 Hour</p>
                  <p className="text-gray-400 text-xs">July 22, 2025 - 8:00 AM</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-2 bg-gray-800/50 rounded-lg">
                <Calendar className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-white text-sm font-medium">First Aid/CPR</p>
                  <p className="text-gray-400 text-xs">July 29, 2025 - 1:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        );
      case "safety-alerts":
        return (
          <div className="h-full">
            <h3 className="text-lg font-semibold text-white mb-4">Safety Alerts</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-2 bg-red-900/20 rounded-lg border border-red-500/20">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-white text-sm font-medium">3 Expired Certifications</p>
                  <p className="text-gray-400 text-xs">Immediate action required</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-2 bg-yellow-900/20 rounded-lg border border-yellow-500/20">
                <Clock className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-white text-sm font-medium">8 Certifications Expiring Soon</p>
                  <p className="text-gray-400 text-xs">Within 30 days</p>
                </div>
              </div>
            </div>
          </div>
        );
      case "certification-progress":
        return (
          <div className="h-full">
            <h3 className="text-lg font-semibold text-white mb-4">Certification Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">Fall Protection</span>
                  <span className="text-sm text-white">87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">OSHA 10</span>
                  <span className="text-sm text-white">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">First Aid</span>
                  <span className="text-sm text-white">76%</span>
                </div>
                <Progress value={76} className="h-2" />
              </div>
            </div>
          </div>
        );
      case "compliance-trends":
        return (
          <div className="h-full">
            <h3 className="text-lg font-semibold text-white mb-4">Compliance Trends</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">This Month</span>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm">+5%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Last Quarter</span>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm">+12%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">YTD</span>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm">+18%</span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div className="h-full flex items-center justify-center text-gray-400">Widget content</div>;
    }
  };

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
              {/* Widget Management Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowWidgetManager(!showWidgetManager)}
                    className="text-gray-300 border-gray-600 hover:bg-gray-800"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Widgets
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetWidgetLayout}
                    className="text-gray-300 border-gray-600 hover:bg-gray-800"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Layout
                  </Button>
                </div>
                <div className="text-sm text-gray-400">
                  Drag widgets to reposition • Click manage to show/hide
                </div>
              </div>

              {/* Widget Manager Panel */}
              {showWidgetManager && (
                <Card className="bg-black/20 backdrop-blur-sm border-gray-800 mb-6">
                  <CardHeader>
                    <CardTitle className="text-white">Widget Manager</CardTitle>
                    <CardDescription className="text-gray-400">
                      Toggle widgets on/off to customize your dashboard
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {widgets.map((widget) => (
                        <div
                          key={widget.id}
                          className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg"
                        >
                          <Switch
                            checked={widget.visible}
                            onCheckedChange={() => toggleWidgetVisibility(widget.id)}
                          />
                          <div className="flex items-center space-x-2">
                            {widget.icon}
                            <span className="text-white text-sm">{widget.title}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Repositionable Widget Dashboard */}
              <div className="dashboard-container" style={{ minHeight: '800px' }}>
                <ResponsiveGridLayout
                  className="layout"
                  layouts={layouts}
                  onLayoutChange={handleLayoutChange}
                  breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                  cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                  rowHeight={60}
                  isDraggable={true}
                  isResizable={true}
                  draggableHandle=".drag-handle"
                  containerPadding={[0, 0]}
                  margin={[16, 16]}
                >
                  {widgets
                    .filter(widget => widget.visible)
                    .map((widget) => (
                      <div
                        key={widget.id}
                        data-grid={widget.defaultProps}
                        className="widget-container"
                      >
                        <Card className="bg-black/20 backdrop-blur-sm border-gray-800 h-full group relative">
                          <CardContent className="p-4 h-full">
                            {/* Drag Handle */}
                            <div className="drag-handle absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
                              <GripVertical className="w-4 h-4 text-gray-400" />
                            </div>
                            
                            {/* Widget Content */}
                            <div className="h-full">
                              {generateWidgetContent(widget)}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                </ResponsiveGridLayout>
              </div>
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
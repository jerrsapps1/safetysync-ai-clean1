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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ComplianceReportGenerator } from "@/components/ui/compliance-report-generator";
import { AICloneDetector } from "@/components/ui/ai-clone-detector";
import { CollaborationLayer } from "@/components/ui/collaboration-layer";
import { AIQuickActions } from "@/components/ui/ai-quick-actions";
import { AIPatternSkeleton } from "@/components/ui/ai-skeleton";
import SafetyTrendsDashboard from "@/components/safety-trends-dashboard";
import QuickSearchWidget from "@/components/safetytracker/QuickSearchWidget";
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
  RotateCcw,
  Save,
  GraduationCap,
  Network,
  FileUser,
  Inbox,
  Monitor
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
  const { toast } = useToast();
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
      "quick-search": <Search className="w-5 h-5" />,
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
    },
    {
      id: "quick-search",
      title: "Quick Search",
      defaultProps: { x: 0, y: 9, w: 12, h: 6 },
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
      console.log('Loaded saved widgets:', savedWidgets);
      // Merge saved visibility state with default widget configuration
      const mergedConfig = defaultWidgetConfig.map(widget => {
        const savedWidget = savedWidgets.find((w: any) => w.id === widget.id);
        return savedWidget ? { 
          ...widget, 
          visible: savedWidget.visible
        } : widget;
      });
      return createWidgets(mergedConfig);
    }
    console.log('Using default widgets');
    return createWidgets(defaultWidgetConfig);
  });

  const [layouts, setLayouts] = useState(() => {
    const saved = localStorage.getItem('workspace-layouts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        console.log('Loaded saved layouts:', parsed);
        return parsed;
      } catch (error) {
        console.error('Error parsing saved layouts:', error);
      }
    }
    
    // Return default layouts if no saved layouts
    const defaultLayouts = {
      lg: defaultWidgetConfig.map(widget => ({ ...widget.defaultProps, i: widget.id })),
      md: defaultWidgetConfig.map(widget => ({ ...widget.defaultProps, i: widget.id })),
      sm: defaultWidgetConfig.map(widget => ({ ...widget.defaultProps, i: widget.id })),
      xs: defaultWidgetConfig.map(widget => ({ ...widget.defaultProps, i: widget.id })),
      xxs: defaultWidgetConfig.map(widget => ({ ...widget.defaultProps, i: widget.id })),
    };
    console.log('Using default layouts:', defaultLayouts);
    return defaultLayouts;
  });
  
  const [showWidgetManager, setShowWidgetManager] = useState(false);

  // Interactive functionality state
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showAddTraining, setShowAddTraining] = useState(false);
  const [showAddCertificate, setShowAddCertificate] = useState(false);
  const [showAddInstructor, setShowAddInstructor] = useState(false);
  const [showAddPoster, setShowAddPoster] = useState(false);
  const [showScheduleTraining, setShowScheduleTraining] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [selectedTraining, setSelectedTraining] = useState<any>(null);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
  const [showTrainingDetails, setShowTrainingDetails] = useState(false);
  
  // Form state for Add Employee
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    hireDate: "",
    status: "Active"
  });
  const [employees, setEmployees] = useState<any[]>([
    { id: 1, name: "John Smith", department: "Construction", email: "john.smith@company.com", phone: "(555) 123-4567", position: "Site Manager", hireDate: "2023-01-15", certifications: ["Fall Protection", "First Aid/CPR"], status: "Active" },
    { id: 2, name: "Sarah Johnson", department: "Manufacturing", email: "sarah.johnson@company.com", phone: "(555) 234-5678", position: "Safety Coordinator", hireDate: "2022-08-20", certifications: ["OSHA 30", "Forklift Operation"], status: "Active" },
    { id: 3, name: "Mike Davis", department: "Maintenance", email: "mike.davis@company.com", phone: "(555) 345-6789", position: "Maintenance Lead", hireDate: "2021-03-10", certifications: ["Lockout/Tagout", "Electrical Safety"], status: "Active" },
  ]);
  const [trainingSessions, setTrainingSessions] = useState<any[]>([
    { id: 1, title: "Fall Protection Training", date: "2025-07-15", time: "9:00 AM - 12:00 PM", instructor: "John Smith", location: "Training Center A", enrolled: 12, capacity: 20, type: "Mandatory" },
    { id: 2, title: "OSHA 10 Construction", date: "2025-07-22", time: "8:00 AM - 5:00 PM", instructor: "Sarah Johnson", location: "Conference Room B", enrolled: 8, capacity: 15, type: "Certification" },
    { id: 3, title: "First Aid/CPR", date: "2025-07-29", time: "1:00 PM - 4:00 PM", instructor: "Mike Davis", location: "Training Center A", enrolled: 15, capacity: 20, type: "Mandatory" },
  ]);
  const [instructors, setInstructors] = useState<any[]>([
    { id: 1, name: "John Smith", certifications: ["OSHA 30", "First Aid/CPR"], specialties: ["Fall Protection", "Construction Safety"], email: "john.smith@company.com", phone: "(555) 123-4567", experience: "10 years" },
    { id: 2, name: "Sarah Johnson", certifications: ["OSHA 500", "Safety Management"], specialties: ["Industrial Safety", "Training Development"], email: "sarah.johnson@company.com", phone: "(555) 234-5678", experience: "8 years" },
    { id: 3, name: "Mike Davis", certifications: ["Electrical Safety", "Lockout/Tagout"], specialties: ["Electrical Safety", "Maintenance"], email: "mike.davis@company.com", phone: "(555) 345-6789", experience: "12 years" },
  ]);

  // Handler functions for interactive buttons
  const handleAddEmployee = () => {
    setShowAddEmployee(true);
  };

  const handleSubmitEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmployee.name || !newEmployee.email || !newEmployee.department) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const employee = {
      ...newEmployee,
      id: employees.length + 1,
      certifications: [],
      hireDate: newEmployee.hireDate || new Date().toISOString().split('T')[0]
    };

    setEmployees([...employees, employee]);
    setNewEmployee({
      name: "",
      email: "",
      phone: "",
      department: "",
      position: "",
      hireDate: "",
      status: "Active"
    });
    setShowAddEmployee(false);
    
    toast({
      title: "Employee Added",
      description: `${employee.name} has been successfully added to the system.`,
    });
  };

  const handleAddTraining = () => {
    setShowAddTraining(true);
    toast({
      title: "Add Training",
      description: "Opening training creation form...",
    });
  };

  const handleAddCertificate = () => {
    setShowAddCertificate(true);
    toast({
      title: "Generate Certificate",
      description: "Opening certificate generation wizard...",
    });
  };

  const handleAddInstructor = () => {
    setShowAddInstructor(true);
    toast({
      title: "Add Instructor",
      description: "Opening instructor registration form...",
    });
  };

  const handleAddPoster = () => {
    setShowAddPoster(true);
    toast({
      title: "Add Poster",
      description: "Opening poster upload form...",
    });
  };

  const handleScheduleTraining = () => {
    setShowScheduleTraining(true);
    toast({
      title: "Schedule Training",
      description: "Opening training scheduler...",
    });
  };

  const handleViewEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setShowEmployeeDetails(true);
    toast({
      title: `Viewing ${employee.name}`,
      description: "Loading employee details...",
    });
  };

  const handleViewTraining = (training: any) => {
    setSelectedTraining(training);
    setShowTrainingDetails(true);
    toast({
      title: `Viewing ${training.title}`,
      description: "Loading training details...",
    });
  };

  const handleManageTraining = (training: any) => {
    setSelectedTraining(training);
    toast({
      title: `Managing ${training.title}`,
      description: "Opening training management panel...",
    });
  };

  const handleViewPoster = (posterName: string) => {
    toast({
      title: `Viewing ${posterName}`,
      description: "Opening poster in viewer...",
    });
  };

  const handleUpdatePoster = (posterName: string) => {
    toast({
      title: `Updating ${posterName}`,
      description: "Opening poster update form...",
    });
  };

  const handleSchedulePoster = (posterName: string) => {
    toast({
      title: `Scheduling ${posterName}`,
      description: "Opening poster review scheduler...",
    });
  };

  // Save widget visibility to localStorage (not the full widget objects with React components)
  useEffect(() => {
    const widgetSettings = widgets.map(widget => ({
      id: widget.id,
      visible: widget.visible
    }));
    localStorage.setItem('workspace-widgets', JSON.stringify(widgetSettings));
  }, [widgets]);

  // Save layouts to localStorage whenever they change
  useEffect(() => {
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
    localStorage.removeItem('workspace-custom-defaults');
    
    // Show success toast
    toast({
      title: "Layout Reset",
      description: "Dashboard has been reset to the original default layout.",
    });
  };

  const saveAsDefault = () => {
    // Save current layout and widget settings as user's personal default
    const currentDefaults = {
      widgets: widgets.map(widget => ({
        id: widget.id,
        visible: widget.visible
      })),
      layouts: layouts
    };
    
    localStorage.setItem('workspace-custom-defaults', JSON.stringify(currentDefaults));
    
    // Show success toast
    toast({
      title: "Default Layout Saved",
      description: "Your current layout has been saved as your personal default.",
    });
  };

  const loadCustomDefaults = () => {
    const customDefaults = localStorage.getItem('workspace-custom-defaults');
    if (customDefaults) {
      const defaults = JSON.parse(customDefaults);
      
      // Apply custom default widget visibility
      const mergedConfig = defaultWidgetConfig.map(widget => {
        const savedWidget = defaults.widgets.find((w: any) => w.id === widget.id);
        return savedWidget ? { 
          ...widget, 
          visible: savedWidget.visible
        } : widget;
      });
      
      setWidgets(createWidgets(mergedConfig));
      setLayouts(defaults.layouts);
      
      // Show success toast
      toast({
        title: "Custom Default Loaded",
        description: "Your personal default layout has been applied to the dashboard.",
      });
    }
  };

  const hasCustomDefaults = () => {
    return localStorage.getItem('workspace-custom-defaults') !== null;
  };

  const handleLayoutChange = (layout: any, layouts: any) => {
    // Only update if the layouts are actually different to prevent infinite loops
    if (layouts && Object.keys(layouts).length > 0) {
      setLayouts(prevLayouts => {
        // Check if the layouts are actually different
        const layoutsString = JSON.stringify(layouts);
        const prevLayoutsString = JSON.stringify(prevLayouts);
        if (layoutsString !== prevLayoutsString) {
          return layouts;
        }
        return prevLayouts;
      });
    }
  };

  // Generate widget content with responsive styling based on widget dimensions
  const generateWidgetContent = (widget: DashboardWidget, layoutItem?: any) => {
    // Determine if widget is small based on actual dimensions
    const isSmall = layoutItem ? (layoutItem.w <= 3 && layoutItem.h <= 2) : false;
    const textSize = isSmall ? 'text-lg' : 'text-2xl';
    const iconSize = isSmall ? 'w-6 h-6' : 'w-8 h-8';
    const labelSize = isSmall ? 'text-xs' : 'text-sm';
    
    switch (widget.id) {
      case "total-employees":
        return (
          <div className="flex items-center justify-between h-full">
            <div className="flex-1 min-w-0">
              <p className={`text-gray-400 ${labelSize} truncate`}>Total Employees</p>
              <p className={`${textSize} font-bold text-white truncate`}>{stats.totalEmployees}</p>
            </div>
            <Users className={`${iconSize} text-blue-400 flex-shrink-0 ml-2`} />
          </div>
        );
      case "compliant-employees":
        return (
          <div className="flex items-center justify-between h-full">
            <div className="flex-1 min-w-0">
              <p className={`text-gray-400 ${labelSize} truncate`}>Compliant</p>
              <p className={`${textSize} font-bold text-emerald-400 truncate`}>{stats.compliantEmployees}</p>
            </div>
            <CheckCircle className={`${iconSize} text-emerald-400 flex-shrink-0 ml-2`} />
          </div>
        );
      case "pending-training":
        return (
          <div className="flex items-center justify-between h-full">
            <div className="flex-1 min-w-0">
              <p className={`text-gray-400 ${labelSize} truncate`}>Pending Training</p>
              <p className={`${textSize} font-bold text-yellow-400 truncate`}>{stats.pendingTraining}</p>
            </div>
            <Clock className={`${iconSize} text-yellow-400 flex-shrink-0 ml-2`} />
          </div>
        );
      case "compliance-score":
        return (
          <div className="flex items-center justify-between h-full">
            <div className="flex-1 min-w-0">
              <p className={`text-gray-400 ${labelSize} truncate`}>Compliance Score</p>
              <p className={`${textSize} font-bold text-white truncate`}>{stats.complianceScore}%</p>
            </div>
            <TrendingUp className={`${iconSize} text-blue-400 flex-shrink-0 ml-2`} />
          </div>
        );
      case "recent-activity":
        return (
          <div className="h-full overflow-hidden">
            <h3 className={`${isSmall ? 'text-sm' : 'text-lg'} font-semibold text-white mb-2`}>Recent Activity</h3>
            <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100% - 2rem)' }}>
              {complianceRecords.slice(0, isSmall ? 2 : 3).map((record) => (
                <div key={record.id} className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <div className={`${isSmall ? 'w-6 h-6' : 'w-8 h-8'} bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0`}>
                      <User className={`${isSmall ? 'w-3 h-3' : 'w-4 h-4'} text-white`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-white ${isSmall ? 'text-xs' : 'text-sm'} font-medium truncate`}>{record.employeeName}</p>
                      <p className={`text-gray-400 ${isSmall ? 'text-xs' : 'text-xs'} truncate`}>{record.training}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={record.status === 'completed' ? 'default' : record.status === 'pending' ? 'secondary' : 'destructive'}
                    className={`${isSmall ? 'text-xs px-1' : ''} flex-shrink-0`}
                  >
                    {record.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        );
      case "training-calendar":
        return (
          <div className="h-full overflow-hidden">
            <h3 className={`${isSmall ? 'text-sm' : 'text-lg'} font-semibold text-white mb-2`}>Upcoming Training</h3>
            <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100% - 2rem)' }}>
              <div className="flex items-center space-x-2 p-2 bg-gray-800/50 rounded-lg">
                <Calendar className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} text-blue-400 flex-shrink-0`} />
                <div className="min-w-0 flex-1">
                  <p className={`text-white ${isSmall ? 'text-xs' : 'text-sm'} font-medium truncate`}>Fall Protection Training</p>
                  <p className={`text-gray-400 ${isSmall ? 'text-xs' : 'text-xs'} truncate`}>July 15, 2025 - 9:00 AM</p>
                </div>
              </div>
              {!isSmall && (
                <>
                  <div className="flex items-center space-x-2 p-2 bg-gray-800/50 rounded-lg">
                    <Calendar className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm font-medium truncate">OSHA 30 Hour</p>
                      <p className="text-gray-400 text-xs truncate">July 22, 2025 - 8:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-gray-800/50 rounded-lg">
                    <Calendar className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm font-medium truncate">First Aid/CPR</p>
                      <p className="text-gray-400 text-xs truncate">July 29, 2025 - 1:00 PM</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      case "safety-alerts":
        return (
          <div className="h-full overflow-hidden">
            <h3 className={`${isSmall ? 'text-sm' : 'text-lg'} font-semibold text-white mb-2`}>Safety Alerts</h3>
            <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100% - 2rem)' }}>
              <div className="flex items-center space-x-2 p-2 bg-red-900/20 rounded-lg border border-red-500/20">
                <AlertTriangle className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} text-red-400 flex-shrink-0`} />
                <div className="min-w-0 flex-1">
                  <p className={`text-white ${isSmall ? 'text-xs' : 'text-sm'} font-medium truncate`}>3 Expired Certifications</p>
                  <p className={`text-gray-400 ${isSmall ? 'text-xs' : 'text-xs'} truncate`}>Immediate action required</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-yellow-900/20 rounded-lg border border-yellow-500/20">
                <Clock className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} text-yellow-400 flex-shrink-0`} />
                <div className="min-w-0 flex-1">
                  <p className={`text-white ${isSmall ? 'text-xs' : 'text-sm'} font-medium truncate`}>8 Certifications Expiring Soon</p>
                  <p className={`text-gray-400 ${isSmall ? 'text-xs' : 'text-xs'} truncate`}>Within 30 days</p>
                </div>
              </div>
            </div>
          </div>
        );
      case "certification-progress":
        return (
          <div className="h-full overflow-hidden">
            <h3 className={`${isSmall ? 'text-sm' : 'text-lg'} font-semibold text-white mb-2`}>Certification Progress</h3>
            <div className="space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100% - 2rem)' }}>
              <div>
                <div className="flex justify-between mb-1">
                  <span className={`${isSmall ? 'text-xs' : 'text-sm'} text-gray-400 truncate`}>Fall Protection</span>
                  <span className={`${isSmall ? 'text-xs' : 'text-sm'} text-white flex-shrink-0`}>87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className={`${isSmall ? 'text-xs' : 'text-sm'} text-gray-400 truncate`}>OSHA 10</span>
                  <span className={`${isSmall ? 'text-xs' : 'text-sm'} text-white flex-shrink-0`}>92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              {!isSmall && (
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-400 truncate">First Aid</span>
                    <span className="text-sm text-white flex-shrink-0">76%</span>
                  </div>
                  <Progress value={76} className="h-2" />
                </div>
              )}
            </div>
          </div>
        );
      case "compliance-trends":
        return (
          <div className="h-full overflow-hidden">
            <h3 className={`${isSmall ? 'text-sm' : 'text-lg'} font-semibold text-white mb-2`}>Compliance Trends</h3>
            <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100% - 2rem)' }}>
              <div className="flex items-center justify-between">
                <span className={`text-gray-400 ${isSmall ? 'text-xs' : 'text-sm'} truncate`}>This Month</span>
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <TrendingUp className={`${isSmall ? 'w-3 h-3' : 'w-4 h-4'} text-green-400`} />
                  <span className={`text-green-400 ${isSmall ? 'text-xs' : 'text-sm'}`}>+5%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-gray-400 ${isSmall ? 'text-xs' : 'text-sm'} truncate`}>Last Quarter</span>
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <TrendingUp className={`${isSmall ? 'w-3 h-3' : 'w-4 h-4'} text-green-400`} />
                  <span className={`text-green-400 ${isSmall ? 'text-xs' : 'text-sm'}`}>+12%</span>
                </div>
              </div>
              {!isSmall && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm truncate">YTD</span>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm">+18%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case "quick-search":
        return (
          <div className="h-full overflow-hidden">
            <QuickSearchWidget />
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
            variant={activeTab === "instructors" ? "secondary" : "ghost"}
            className="w-full justify-start text-gray-300 hover:text-white"
            onClick={() => setActiveTab("instructors")}
          >
            <GraduationCap className="w-5 h-5 mr-3" />
            {sidebarOpen && "Instructors"}
          </Button>
          <Button
            variant={activeTab === "organization" ? "secondary" : "ghost"}
            className="w-full justify-start text-gray-300 hover:text-white"
            onClick={() => setActiveTab("organization")}
          >
            <Network className="w-5 h-5 mr-3" />
            {sidebarOpen && "Organization"}
          </Button>
          <Button
            variant={activeTab === "employee-portal" ? "secondary" : "ghost"}
            className="w-full justify-start text-gray-300 hover:text-white"
            onClick={() => setActiveTab("employee-portal")}
          >
            <FileUser className="w-5 h-5 mr-3" />
            {sidebarOpen && "Employee Portal"}
          </Button>
          <Button
            variant={activeTab === "notifications" ? "secondary" : "ghost"}
            className="w-full justify-start text-gray-300 hover:text-white"
            onClick={() => setActiveTab("notifications")}
          >
            <Inbox className="w-5 h-5 mr-3" />
            {sidebarOpen && "Notifications"}
          </Button>
          <Button
            variant={activeTab === "workplace-poster" ? "secondary" : "ghost"}
            className="w-full justify-start text-gray-300 hover:text-white"
            onClick={() => setActiveTab("workplace-poster")}
          >
            <FileText className="w-5 h-5 mr-3" />
            {sidebarOpen && "Workplace Poster"}
          </Button>
          <Button
            variant={activeTab === "training-calendar" ? "secondary" : "ghost"}
            className="w-full justify-start text-gray-300 hover:text-white"
            onClick={() => setActiveTab("training-calendar")}
          >
            <Calendar className="w-5 h-5 mr-3" />
            {sidebarOpen && "Training Calendar"}
          </Button>
          <Button
            variant={activeTab === "subscription-billing" ? "secondary" : "ghost"}
            className="w-full justify-start text-gray-300 hover:text-white"
            onClick={() => setActiveTab("subscription-billing")}
          >
            <CreditCard className="w-5 h-5 mr-3" />
            {sidebarOpen && "Subscription"}
          </Button>
          <Button
            variant={activeTab === "analytics-reports" ? "secondary" : "ghost"}
            className="w-full justify-start text-gray-300 hover:text-white"
            onClick={() => setActiveTab("analytics-reports")}
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            {sidebarOpen && "Analytics"}
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
                {activeTab === "instructors" && "Instructor Management"}
                {activeTab === "organization" && "Organization Structure"}
                {activeTab === "employee-portal" && "Employee Portal"}
                {activeTab === "notifications" && "Notifications & Alerts"}
                {activeTab === "workplace-poster" && "Workplace Poster Management"}
                {activeTab === "training-calendar" && "Training Calendar"}
                {activeTab === "subscription-billing" && "Subscription & Billing"}
                {activeTab === "analytics-reports" && "Analytics & Reports"}
                {activeTab === "settings" && "Workspace Settings"}
              </h1>
              <p className="text-gray-400">
                {activeTab === "overview" && "Monitor your safety compliance at a glance"}
                {activeTab === "employees" && "Manage employee certifications and training"}
                {activeTab === "training" && "Schedule and track safety training"}
                {activeTab === "certificates" && "Generate professional certificates and cards"}
                {activeTab === "reports" && "Generate compliance reports for audits"}
                {activeTab === "trends" && "Analyze safety trends and performance"}
                {activeTab === "instructors" && "Manage certified instructors and their credentials"}
                {activeTab === "organization" && "Configure departments and organizational structure"}
                {activeTab === "employee-portal" && "Self-service portal for employee access"}
                {activeTab === "notifications" && "Manage alerts and notification preferences"}
                {activeTab === "workplace-poster" && "Track and manage mandatory workplace safety posters"}
                {activeTab === "training-calendar" && "Schedule and manage training sessions"}
                {activeTab === "subscription-billing" && "Manage your plan and billing information"}
                {activeTab === "analytics-reports" && "Generate comprehensive analytics and reports"}
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
                    onClick={saveAsDefault}
                    className="text-gray-300 border-gray-600 hover:bg-gray-800"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save as Default
                  </Button>
                  {hasCustomDefaults() && (
                    <Button
                      variant="outline"
                      onClick={loadCustomDefaults}
                      className="text-gray-300 border-gray-600 hover:bg-gray-800"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Load My Default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={resetWidgetLayout}
                    className="text-gray-300 border-gray-600 hover:bg-gray-800"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset to Original
                  </Button>
                </div>
                <div className="text-sm text-gray-400">
                  Drag widgets to reposition • Drag corners to resize • Click manage to show/hide
                </div>
              </div>

              {/* Widget Manager Panel */}
              {showWidgetManager && (
                <Card className="bg-black/20 backdrop-blur-sm border-gray-800 mb-6">
                  <CardHeader>
                    <CardTitle className="text-white">Widget Manager</CardTitle>
                    <CardDescription className="text-gray-400">
                      Toggle widgets on/off and drag to resize them on your dashboard
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {widgets.map((widget) => (
                        <div
                          key={widget.id}
                          className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <Switch
                              checked={widget.visible}
                              onCheckedChange={() => toggleWidgetVisibility(widget.id)}
                            />
                            <div className="flex items-center space-x-2">
                              {widget.icon}
                              <span className="text-white text-sm">{widget.title}</span>
                            </div>
                          </div>
                          <div className="text-gray-400 text-xs">
                            Drag to resize
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
                  compactType="vertical"
                  preventCollision={false}
                >
                  {widgets
                    .filter(widget => widget.visible)
                    .map((widget) => {
                      // Get current layout for this widget
                      const currentLayout = layouts.lg?.find(l => l.i === widget.id);
                      
                      return (
                        <div
                          key={widget.id}
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
                                {generateWidgetContent(widget, currentLayout)}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      );
                    })}
                </ResponsiveGridLayout>
              </div>
            </div>
          )}

          {activeTab === "employees" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Employee Management</h2>
                <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={handleAddEmployee}>
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
                <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={handleAddCertificate}>
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

          {activeTab === "instructors" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Instructor Management</h2>
                <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={handleAddInstructor}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Instructor
                </Button>
              </div>
              <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">John Smith</h3>
                            <p className="text-gray-400 text-sm">Senior Safety Instructor</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Certifications</span>
                            <Badge className="bg-green-100 text-green-700">5 Active</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Students Trained</span>
                            <span className="text-white">247</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Specialization</span>
                            <span className="text-white">Fall Protection</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">Sarah Johnson</h3>
                            <p className="text-gray-400 text-sm">Equipment Training Specialist</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Certifications</span>
                            <Badge className="bg-green-100 text-green-700">7 Active</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Students Trained</span>
                            <span className="text-white">189</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Specialization</span>
                            <span className="text-white">Forklift Operation</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">Mike Rodriguez</h3>
                            <p className="text-gray-400 text-sm">OSHA Training Coordinator</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Certifications</span>
                            <Badge className="bg-green-100 text-green-700">4 Active</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Students Trained</span>
                            <span className="text-white">312</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Specialization</span>
                            <span className="text-white">OSHA 30 Hour</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "organization" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Organization Structure</h2>
                <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={() => toast({ title: "Add Department", description: "Opening department creation form..." })}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Department
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Department Structure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Building className="w-5 h-5 text-blue-400" />
                          <div>
                            <p className="text-white font-medium">Construction</p>
                            <p className="text-gray-400 text-sm">45 employees</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700">93% Compliant</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Building className="w-5 h-5 text-purple-400" />
                          <div>
                            <p className="text-white font-medium">Safety</p>
                            <p className="text-gray-400 text-sm">12 employees</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700">100% Compliant</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Building className="w-5 h-5 text-orange-400" />
                          <div>
                            <p className="text-white font-medium">Operations</p>
                            <p className="text-gray-400 text-sm">68 employees</p>
                          </div>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-700">87% Compliant</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Building className="w-5 h-5 text-green-400" />
                          <div>
                            <p className="text-white font-medium">Management</p>
                            <p className="text-gray-400 text-sm">22 employees</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700">95% Compliant</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Location Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-red-400" />
                          <div>
                            <p className="text-white font-medium">Site A - Downtown</p>
                            <p className="text-gray-400 text-sm">89 employees</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700">91% Compliant</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-blue-400" />
                          <div>
                            <p className="text-white font-medium">Site B - Industrial</p>
                            <p className="text-gray-400 text-sm">58 employees</p>
                          </div>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-700">85% Compliant</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-green-400" />
                          <div>
                            <p className="text-white font-medium">Main Office</p>
                            <p className="text-gray-400 text-sm">35 employees</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700">97% Compliant</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "employee-portal" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Employee Portal</h2>
                <Button className="bg-emerald-500 hover:bg-emerald-600">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Portal
                </Button>
              </div>
              <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Self-Service Portal Features</CardTitle>
                  <CardDescription className="text-gray-400">
                    Employees can access their training records, certificates, and schedule through the portal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3 mb-3">
                        <FileUser className="w-8 h-8 text-blue-400" />
                        <div>
                          <h3 className="text-white font-semibold">Training Records</h3>
                          <p className="text-gray-400 text-sm">View completion status</p>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm">Employees can view their training history, upcoming requirements, and completion certificates.</p>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3 mb-3">
                        <Calendar className="w-8 h-8 text-green-400" />
                        <div>
                          <h3 className="text-white font-semibold">Training Schedule</h3>
                          <p className="text-gray-400 text-sm">Book training sessions</p>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm">Self-service scheduling for upcoming training sessions and recertification requirements.</p>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3 mb-3">
                        <Download className="w-8 h-8 text-purple-400" />
                        <div>
                          <h3 className="text-white font-semibold">Certificate Downloads</h3>
                          <p className="text-gray-400 text-sm">Access digital certificates</p>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm">Download and print certificates and wallet cards for field verification.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Notifications & Alerts</h2>
                <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={() => toast({ title: "Create Alert", description: "Opening alert creation form..." })}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Alert
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Active Alerts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 bg-red-900/20 rounded-lg border border-red-500/20">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <div className="flex-1">
                          <p className="text-white font-medium">3 Certifications Expired</p>
                          <p className="text-gray-400 text-sm">Immediate action required</p>
                        </div>
                        <Badge className="bg-red-100 text-red-700">High Priority</Badge>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-yellow-900/20 rounded-lg border border-yellow-500/20">
                        <Clock className="w-5 h-5 text-yellow-400" />
                        <div className="flex-1">
                          <p className="text-white font-medium">8 Certifications Expiring Soon</p>
                          <p className="text-gray-400 text-sm">Within 30 days</p>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-700">Medium Priority</Badge>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-blue-900/20 rounded-lg border border-blue-500/20">
                        <Bell className="w-5 h-5 text-blue-400" />
                        <div className="flex-1">
                          <p className="text-white font-medium">New Training Session Available</p>
                          <p className="text-gray-400 text-sm">Fall Protection - July 15</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700">Info</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Notification Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Email Notifications</p>
                          <p className="text-gray-400 text-sm">Receive alerts via email</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">SMS Alerts</p>
                          <p className="text-gray-400 text-sm">Critical alerts via SMS</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Dashboard Notifications</p>
                          <p className="text-gray-400 text-sm">Show in-app notifications</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Weekly Reports</p>
                          <p className="text-gray-400 text-sm">Weekly compliance summary</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "workplace-poster" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Workplace Poster Management</h2>
                <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={handleAddPoster}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Poster
                </Button>
              </div>
              <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Required OSHA Posters</CardTitle>
                  <CardDescription className="text-gray-400">
                    Track and manage mandatory workplace safety posters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <div>
                            <p className="text-white font-medium">OSHA Job Safety Poster</p>
                            <p className="text-gray-400 text-sm">Current - Updated 2024</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleViewPoster("OSHA Job Safety Poster")}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <div>
                            <p className="text-white font-medium">Emergency Contact Info</p>
                            <p className="text-gray-400 text-sm">Current - Updated 2024</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className="w-5 h-5 text-yellow-400" />
                          <div>
                            <p className="text-white font-medium">Equal Opportunity Poster</p>
                            <p className="text-gray-400 text-sm">Needs Update - 2023</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleUpdatePoster("Equal Opportunity Poster")}>
                          <Upload className="w-4 h-4 mr-2" />
                          Update
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <div>
                            <p className="text-white font-medium">Workers' Compensation</p>
                            <p className="text-gray-400 text-sm">Current - Updated 2024</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <div>
                            <p className="text-white font-medium">Right to Know Act</p>
                            <p className="text-gray-400 text-sm">Current - Updated 2024</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Clock className="w-5 h-5 text-blue-400" />
                          <div>
                            <p className="text-white font-medium">Minimum Wage Notice</p>
                            <p className="text-gray-400 text-sm">Review Due - July 2025</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleSchedulePoster("Minimum Wage Notice")}>
                          <Calendar className="w-4 h-4 mr-2" />
                          Schedule
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "training-calendar" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Training Calendar</h2>
                <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={handleScheduleTraining}>
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Training
                </Button>
              </div>
              <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Upcoming Training Sessions</CardTitle>
                  <CardDescription className="text-gray-400">
                    View and manage scheduled training sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">Fall Protection Training</h3>
                          <p className="text-gray-400">July 15, 2025 - 9:00 AM to 12:00 PM</p>
                          <p className="text-gray-400 text-sm">Instructor: John Smith • Room: Training Center A</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-blue-100 text-blue-700">12 Enrolled</Badge>
                        <Button variant="outline" size="sm">
                          <Users className="w-4 h-4 mr-2" />
                          Manage
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">OSHA 30 Hour Course</h3>
                          <p className="text-gray-400">July 22, 2025 - 8:00 AM to 5:00 PM</p>
                          <p className="text-gray-400 text-sm">Instructor: Mike Rodriguez • Room: Training Center B</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-700">8 Enrolled</Badge>
                        <Button variant="outline" size="sm">
                          <Users className="w-4 h-4 mr-2" />
                          Manage
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">First Aid/CPR Certification</h3>
                          <p className="text-gray-400">July 29, 2025 - 1:00 PM to 4:00 PM</p>
                          <p className="text-gray-400 text-sm">Instructor: Sarah Johnson • Room: Training Center A</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-purple-100 text-purple-700">15 Enrolled</Badge>
                        <Button variant="outline" size="sm">
                          <Users className="w-4 h-4 mr-2" />
                          Manage
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "subscription-billing" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Subscription & Billing</h2>
                <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={() => toast({ title: "Manage Billing", description: "Opening billing management panel..." })}>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Manage Billing
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Current Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-emerald-900/20 rounded-lg border border-emerald-500/20">
                        <h3 className="text-2xl font-bold text-white">Professional</h3>
                        <p className="text-emerald-400 font-semibold">$95.00/month</p>
                        <p className="text-gray-400 text-sm">Billed annually</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Plan Started</span>
                          <span className="text-white">January 1, 2025</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Next Billing</span>
                          <span className="text-white">August 1, 2025</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Payment Method</span>
                          <span className="text-white">•••• 4242</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Usage This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Certificates Generated</span>
                          <span className="text-white">23 / 50</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '46%' }}></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Digital Wallet Cards</span>
                          <span className="text-white">31 / 50</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '62%' }}></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Additional Charges</span>
                          <span className="text-white">$0.00</span>
                        </div>
                        <p className="text-gray-400 text-sm">Usage within plan limits</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "analytics-reports" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Analytics & Reports</h2>
                <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={() => toast({ title: "Export Report", description: "Generating report for download..." })}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Total Employees</p>
                        <p className="text-2xl font-bold text-white">147</p>
                      </div>
                      <Users className="w-8 h-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Compliance Rate</p>
                        <p className="text-2xl font-bold text-white">88%</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Training Hours</p>
                        <p className="text-2xl font-bold text-white">1,247</p>
                      </div>
                      <Clock className="w-8 h-8 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Certificates Issued</p>
                        <p className="text-2xl font-bold text-white">89</p>
                      </div>
                      <Award className="w-8 h-8 text-yellow-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Report Templates</CardTitle>
                  <CardDescription className="text-gray-400">
                    Generate comprehensive reports for compliance tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <BarChart3 className="w-8 h-8 text-blue-400" />
                      <span className="text-white">Monthly Compliance</span>
                      <span className="text-gray-400 text-sm">Department breakdown</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <TrendingUp className="w-8 h-8 text-green-400" />
                      <span className="text-white">Training Analytics</span>
                      <span className="text-gray-400 text-sm">Progress tracking</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <FileText className="w-8 h-8 text-purple-400" />
                      <span className="text-white">Audit Ready Report</span>
                      <span className="text-gray-400 text-sm">OSHA compliance</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
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

      {/* Add Employee Dialog */}
      <Dialog open={showAddEmployee} onOpenChange={setShowAddEmployee}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">Add New Employee</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter employee information to add them to your SafetySync.AI workspace
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEmployee} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Full Name *</Label>
                <Input
                  id="name"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
                  placeholder="John Smith"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
                  placeholder="john.smith@company.com"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department" className="text-white">Department *</Label>
                <Select value={newEmployee.department} onValueChange={(value) => setNewEmployee({...newEmployee, department: value})}>
                  <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="Construction">Construction</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Safety">Safety</SelectItem>
                    <SelectItem value="Administration">Administration</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Quality Control">Quality Control</SelectItem>
                    <SelectItem value="Warehouse">Warehouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position" className="text-white">Position/Title</Label>
                <Input
                  id="position"
                  value={newEmployee.position}
                  onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
                  placeholder="Site Manager"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hireDate" className="text-white">Hire Date</Label>
                <Input
                  id="hireDate"
                  type="date"
                  value={newEmployee.hireDate}
                  onChange={(e) => setNewEmployee({...newEmployee, hireDate: e.target.value})}
                  className="bg-gray-800/50 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-white">Employment Status</Label>
              <Select value={newEmployee.status} onValueChange={(value) => setNewEmployee({...newEmployee, status: value})}>
                <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                  <SelectItem value="Terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddEmployee(false)}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <Users className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
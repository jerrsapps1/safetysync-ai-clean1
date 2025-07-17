import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { useDynamicAchievements } from "@/hooks/useDynamicAchievements";
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
import EmployeeManagement from "@/components/enterprise/EmployeeManagement";
import { EmployeeInsightsDashboard } from "@/components/enterprise/EmployeeInsightsDashboard";
import DocumentManager from "@/components/enterprise/DocumentManager";
import CompanyProfile from "@/components/enterprise/CompanyProfile";
import TrainingManagement from "@/components/training/TrainingManagement";
import CertificateGeneration from "@/components/certificates/CertificateGeneration";
import EmployeePortal from "@/components/portal/EmployeePortal";
import NotificationSystem from "@/components/notifications/NotificationSystem";


import SubscriptionBilling from "@/components/billing/SubscriptionBilling";
import AnalyticsReports from "@/components/reports/AnalyticsReports";
import AchievementBadges from "@/components/achievements/AchievementBadges";
import DynamicAchievementWidget from "@/components/achievements/DynamicAchievementWidget";
import { AchievementNotificationManager } from "@/components/achievements/DynamicAchievementNotification";
import { InstructorSignInGenerator } from "@/components/ui/instructor-signin-generator";
import TrainingRecordsManager from "@/components/records/TrainingRecordsManager";
import FileExplorer from "@/components/FileExplorer";

import { AIPatternSkeleton } from "@/components/ui/ai-skeleton";
import { SmoothLoading } from "@/components/ui/smooth-loading";
import SafetyTrendsDashboard from "@/components/safety-trends-dashboard";
import QuickSearchWidget from "@/components/safetytracker/QuickSearchWidget";
import { SafetySyncIcon } from "@/components/ui/safetysync-icon";

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
  TrendingDown,
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
  ChevronDown,
  ChevronRight,
  BookOpen,
  Settings,
  Edit,
  Award,
  CreditCard,
  Package,
  Calculator,
  Database,
  Activity,
  BarChart3,
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
  Monitor,
  Trash2,
  MousePointer,
  CheckSquare,
  Square,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Folder
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
      // Redirect to client portal after successful login
      window.location.href = '/client-portal';
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
            <SafetySyncIcon size={64} className="rounded-lg" />
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

// Animation variants for sidebar transitions
const sidebarVariants = {
  open: {
    width: "16rem",
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  closed: {
    width: "4rem",
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

const navButtonVariants = {
  idle: {
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.15,
      ease: "easeInOut"
    }
  },
  active: {
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

const chevronVariants = {
  closed: {
    rotate: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  open: {
    rotate: 90,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

const expandedSectionVariants = {
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  open: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      ease: "easeInOut",
      delayChildren: 0.1,
      staggerChildren: 0.05
    }
  }
};

const subItemVariants = {
  closed: {
    opacity: 0,
    x: -10,
    transition: {
      duration: 0.15,
      ease: "easeInOut"
    }
  },
  open: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

export default function WorkspacePage() {
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth();
  const { trackMilestone } = useDynamicAchievements();
  const [location, setLocation] = useLocation();
  
  // Extract tab from URL or default to overview
  const getActiveTabFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('tab') || 'unified-dashboard';
  };
  
  const [activeTab, setActiveTab] = useState(getActiveTabFromUrl());
  
  // Hierarchical navigation state
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'compliance-reporting': false,
    'employee-management': false,
    'organization': false,
    'system-tools': false,
    'training-certification': false
  });
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { toast } = useToast();
  
  // Track initial login milestone for achievements
  useEffect(() => {
    if (isAuthenticated && user) {
      trackMilestone('login', { timestamp: new Date() });
    }
  }, [isAuthenticated, user, trackMilestone]);
  const [workspaceSettings, setWorkspaceSettings] = useState<WorkspaceSettings>({
    companyName: "SafetySync.AI",
    companyLogo: "",
    primaryColor: "#10B981",
    secondaryColor: "#3B82F6",
    customDomain: "",
    showBranding: true
  });

  // Memoize tab switching to prevent freezing and persist in URL
  const handleTabSwitch = useCallback((tab: string) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      // Update URL to persist tab state
      const newUrl = `/workspace?tab=${tab}`;
      window.history.pushState({}, '', newUrl);
      
      // Track tab navigation achievement
      trackMilestone('tab_navigation', { tabName: tab, timestamp: new Date() });
    }
  }, [activeTab, trackMilestone]);

  // Toggle section expansion
  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  }, []);

  // Handle URL changes and browser navigation
  useEffect(() => {
    const handlePopState = () => {
      const newTab = getActiveTabFromUrl();
      if (newTab !== activeTab) {
        setActiveTab(newTab);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeTab]);

  // Track login event when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      trackMilestone('login', { 
        userId: user.id, 
        timestamp: new Date(),
        sessionId: `session-${Date.now()}`
      });
    }
  }, [isAuthenticated, user, trackMilestone]);

  // Widget icon mapping
  const getWidgetIcon = (id: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      "welcome-widget": <Home className="w-5 h-5" />,
      "total-employees": <Users className="w-5 h-5" />,
      "compliant-employees": <CheckCircle className="w-5 h-5" />,
      "pending-training": <Clock className="w-5 h-5" />,
      "compliance-score": <TrendingUp className="w-5 h-5" />,
      "recent-activity": <Activity className="w-5 h-5" />,

      "safety-alerts": <AlertTriangle className="w-5 h-5" />,
      "certification-progress": <Award className="w-5 h-5" />,
      "compliance-trends": <BarChart3 className="w-5 h-5" />,
      "quick-search": <Search className="w-5 h-5" />,
      "achievement-progress": <Award className="w-5 h-5" />,
      // Trends widget icons
      "safety-trends-chart": <Activity className="w-5 h-5" />,
      "compliance-metrics": <TrendingUp className="w-5 h-5" />,
      "department-performance": <Users className="w-5 h-5" />,
      "risk-analysis": <Shield className="w-5 h-5" />,
      "training-completion": <GraduationCap className="w-5 h-5" />,
      "ai-insights": <Brain className="w-5 h-5" />,
      "safety-score": <CheckCircle className="w-5 h-5" />,
    };
    return iconMap[id] || <Settings className="w-5 h-5" />;
  };

  // Default widget configuration (without React components)
  const defaultWidgetConfig = [
    {
      id: "welcome-widget",
      title: "Welcome",
      defaultProps: { x: 0, y: 0, w: 24, h: 3 },
      visible: true
    },
    {
      id: "total-employees",
      title: "Total Employees",
      defaultProps: { x: 0, y: 3, w: 6, h: 2 },
      visible: true
    },
    {
      id: "compliant-employees",
      title: "Compliant Employees",
      defaultProps: { x: 6, y: 3, w: 6, h: 2 },
      visible: true
    },
    {
      id: "pending-training",
      title: "Pending Training",
      defaultProps: { x: 12, y: 3, w: 6, h: 2 },
      visible: true
    },
    {
      id: "compliance-score",
      title: "Compliance Score",
      defaultProps: { x: 18, y: 3, w: 6, h: 2 },
      visible: true
    },
    {
      id: "recent-activity",
      title: "Recent Activity",
      defaultProps: { x: 0, y: 5, w: 12, h: 4 },
      visible: true
    },

    {
      id: "safety-alerts",
      title: "Safety Alerts",
      defaultProps: { x: 0, y: 9, w: 8, h: 3 },
      visible: true
    },
    {
      id: "certification-progress",
      title: "Certification Progress",
      defaultProps: { x: 8, y: 9, w: 8, h: 3 },
      visible: true
    },
    {
      id: "compliance-trends",
      title: "Compliance Trends",
      defaultProps: { x: 16, y: 9, w: 8, h: 3 },
      visible: true
    },
    {
      id: "quick-search",
      title: "Quick Search",
      defaultProps: { x: 0, y: 12, w: 24, h: 6 },
      visible: true
    },
    // Extended widgets now in the same grid
    {
      id: "quick-actions",
      title: "Quick Actions & Reports",
      defaultProps: { x: 0, y: 18, w: 12, h: 5 },
      visible: true
    },
    {
      id: "analytics-overview",
      title: "Analytics Overview",
      defaultProps: { x: 12, y: 18, w: 12, h: 5 },
      visible: true
    },
    {
      id: "achievement-progress",
      title: "Achievement Progress",
      defaultProps: { x: 0, y: 23, w: 12, h: 6 },
      visible: true
    },
    {
      id: "department-performance",
      title: "Department Performance",
      defaultProps: { x: 12, y: 23, w: 12, h: 7 },
      visible: true
    },
    {
      id: "osha-training",
      title: "OSHA Training Requirements",
      defaultProps: { x: 12, y: 23, w: 12, h: 8 },
      visible: true
    }
  ];

  // Extended dashboard widgets configuration
  // Extended widgets are now merged into defaultWidgetConfig above

  // Create widgets with icons
  const createWidgets = (config: any[]) => {
    return config.map(widget => ({
      ...widget,
      component: null,
      icon: getWidgetIcon(widget.id)
    }));
  };

  // Trends widget configuration
  const trendsWidgetConfig = [
    {
      id: "safety-trends-chart",
      title: "Safety Trends Chart",
      defaultProps: { x: 0, y: 0, w: 8, h: 6 },
      visible: true
    },
    {
      id: "compliance-metrics",
      title: "Compliance Metrics",
      defaultProps: { x: 8, y: 0, w: 4, h: 6 },
      visible: true
    },
    {
      id: "department-performance",
      title: "Department Performance",
      defaultProps: { x: 0, y: 6, w: 6, h: 5 },
      visible: true
    },
    {
      id: "risk-analysis",
      title: "Risk Analysis",
      defaultProps: { x: 6, y: 6, w: 6, h: 5 },
      visible: true
    },
    {
      id: "training-completion",
      title: "Training Completion",
      defaultProps: { x: 0, y: 11, w: 4, h: 4 },
      visible: true
    },
    {
      id: "ai-insights",
      title: "AI Safety Insights",
      defaultProps: { x: 4, y: 11, w: 4, h: 4 },
      visible: true
    },
    {
      id: "safety-score",
      title: "Safety Score",
      defaultProps: { x: 8, y: 11, w: 4, h: 4 },
      visible: true
    }
  ];

  // Create trends widgets
  const createTrendsWidgets = (config: any[]) => {
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
  
  // Group selection state
  const [selectedWidgets, setSelectedWidgets] = useState<Set<string>>(new Set());
  const [isGroupSelectionMode, setIsGroupSelectionMode] = useState(false);

  // Trends widget management state
  const [trendsWidgets, setTrendsWidgets] = useState<DashboardWidget[]>(() => {
    const saved = localStorage.getItem('trends-widgets');
    if (saved) {
      const savedWidgets = JSON.parse(saved);
      console.log('Loaded saved trends widgets:', savedWidgets);
      const mergedConfig = trendsWidgetConfig.map(widget => {
        const savedWidget = savedWidgets.find((w: any) => w.id === widget.id);
        return savedWidget ? { 
          ...widget, 
          visible: savedWidget.visible
        } : widget;
      });
      return createTrendsWidgets(mergedConfig);
    }
    console.log('Using default trends widgets');
    return createTrendsWidgets(trendsWidgetConfig);
  });

  const [trendsLayouts, setTrendsLayouts] = useState(() => {
    const saved = localStorage.getItem('trends-layouts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        console.log('Loaded saved trends layouts:', parsed);
        return parsed;
      } catch (error) {
        console.error('Error parsing saved trends layouts:', error);
      }
    }
    
    const defaultLayouts = {
      lg: trendsWidgetConfig.map(widget => ({ ...widget.defaultProps, i: widget.id })),
      md: trendsWidgetConfig.map(widget => ({ ...widget.defaultProps, i: widget.id })),
      sm: trendsWidgetConfig.map(widget => ({ ...widget.defaultProps, i: widget.id })),
      xs: trendsWidgetConfig.map(widget => ({ ...widget.defaultProps, i: widget.id })),
      xxs: trendsWidgetConfig.map(widget => ({ ...widget.defaultProps, i: widget.id })),
    };
    console.log('Using default trends layouts:', defaultLayouts);
    return defaultLayouts;
  });

  // Extended widgets are now merged into main widgets system above
  
  const [showTrendsWidgetManager, setShowTrendsWidgetManager] = useState(false);

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
    division: "",
    position: "",
    hireDate: "",
    status: "Active"
  });

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  // Dynamic organizational structure
  const [organizationalStructure, setOrganizationalStructure] = useState({
    divisions: [
      "Operations",
      "Safety",
      "Administration",
      "Engineering",
      "Quality Control"
    ],
    departmentsByDivision: {
      "Operations": ["Construction", "Manufacturing", "Maintenance", "Production", "Field Services"],
      "Safety": ["Safety Management", "Environmental Health", "Emergency Response", "Risk Management"],
      "Administration": ["Human Resources", "Finance", "IT", "Legal", "Procurement"],
      "Engineering": ["Project Engineering", "Design", "Quality Engineering", "Technical Support"],
      "Quality Control": ["Quality Assurance", "Testing", "Inspection", "Compliance"]
    }
  });

  // Dialog states for organization management
  const [showAddDivision, setShowAddDivision] = useState(false);
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [newDivisionName, setNewDivisionName] = useState("");
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [selectedDivisionForDepartment, setSelectedDivisionForDepartment] = useState("");
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

  const handleDownloadTemplate = () => {
    // Create CSV content
    const csvContent = `firstName,lastName,employeeId,email,department,position,status
John,Doe,EMP001,john.doe@company.com,Construction,Site Manager,active
Jane,Smith,EMP002,jane.smith@company.com,Safety,Safety Officer,active
Mike,Johnson,EMP003,mike.johnson@company.com,Manufacturing,Supervisor,active`;
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Template Downloaded",
      description: "Employee import template has been downloaded successfully.",
    });
  };

  const handleImportEmployees = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          // Parse CSV and add employees
          const lines = text.split('\n');
          const headers = lines[0].split(',');
          let importedCount = 0;
          
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            if (values.length >= headers.length && values[0].trim()) {
              const employee = {
                id: employees.length + importedCount + 1,
                name: `${values[0].trim()} ${values[1].trim()}`,
                email: values[3].trim(),
                phone: "",
                department: values[4].trim(),
                position: values[5].trim(),
                hireDate: new Date().toISOString().split('T')[0],
                status: values[6].trim() === 'active' ? 'Active' : 'Inactive',
                certifications: []
              };
              setEmployees(prev => [...prev, employee]);
              importedCount++;
            }
          }
          
          toast({
            title: "Import Successful",
            description: `Successfully imported ${importedCount} employees.`,
          });
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleSubmitEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmployee.name || !newEmployee.email || !newEmployee.department || !newEmployee.division) {
      toast({
        title: "Error",
        description: "Please fill in all required fields including division and department.",
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
      division: "",
      position: "",
      hireDate: "",
      status: "Active"
    });
    setShowAddEmployee(false);
    
    toast({
      title: "Employee Added",
      description: `${employee.name} has been successfully added to ${employee.division} - ${employee.department}.`,
    });
  };

  // Organization management functions
  const handleAddDivision = () => {
    if (!newDivisionName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a division name.",
        variant: "destructive",
      });
      return;
    }

    if (organizationalStructure.divisions.includes(newDivisionName.trim())) {
      toast({
        title: "Error",
        description: "This division already exists.",
        variant: "destructive",
      });
      return;
    }

    setOrganizationalStructure(prev => ({
      ...prev,
      divisions: [...prev.divisions, newDivisionName.trim()],
      departmentsByDivision: {
        ...prev.departmentsByDivision,
        [newDivisionName.trim()]: []
      }
    }));

    setNewDivisionName("");
    setShowAddDivision(false);
    
    toast({
      title: "Division Added",
      description: `${newDivisionName.trim()} division has been created successfully.`,
    });
  };

  const handleAddDepartment = () => {
    if (!newDepartmentName.trim() || !selectedDivisionForDepartment) {
      toast({
        title: "Error",
        description: "Please enter a department name and select a division.",
        variant: "destructive",
      });
      return;
    }

    if (organizationalStructure.departmentsByDivision[selectedDivisionForDepartment]?.includes(newDepartmentName.trim())) {
      toast({
        title: "Error",
        description: "This department already exists in the selected division.",
        variant: "destructive",
      });
      return;
    }

    setOrganizationalStructure(prev => ({
      ...prev,
      departmentsByDivision: {
        ...prev.departmentsByDivision,
        [selectedDivisionForDepartment]: [
          ...(prev.departmentsByDivision[selectedDivisionForDepartment] || []),
          newDepartmentName.trim()
        ]
      }
    }));

    setNewDepartmentName("");
    setSelectedDivisionForDepartment("");
    setShowAddDepartment(false);
    
    toast({
      title: "Department Added",
      description: `${newDepartmentName.trim()} department has been added to ${selectedDivisionForDepartment}.`,
    });
  };

  const handleDeleteDivision = (divisionName: string) => {
    // Check if any employees are assigned to this division
    const employeesInDivision = employees.filter(emp => emp.division === divisionName);
    if (employeesInDivision.length > 0) {
      toast({
        title: "Cannot Delete Division",
        description: `${employeesInDivision.length} employees are assigned to this division. Reassign them first.`,
        variant: "destructive",
      });
      return;
    }

    setOrganizationalStructure(prev => {
      const newDivisions = prev.divisions.filter(div => div !== divisionName);
      const newDepartmentsByDivision = { ...prev.departmentsByDivision };
      delete newDepartmentsByDivision[divisionName];
      
      return {
        divisions: newDivisions,
        departmentsByDivision: newDepartmentsByDivision
      };
    });

    toast({
      title: "Division Deleted",
      description: `${divisionName} division has been removed.`,
    });
  };

  const handleDeleteDepartment = (divisionName: string, departmentName: string) => {
    // Check if any employees are assigned to this department
    const employeesInDepartment = employees.filter(emp => emp.department === departmentName);
    if (employeesInDepartment.length > 0) {
      toast({
        title: "Cannot Delete Department",
        description: `${employeesInDepartment.length} employees are assigned to this department. Reassign them first.`,
        variant: "destructive",
      });
      return;
    }

    setOrganizationalStructure(prev => ({
      ...prev,
      departmentsByDivision: {
        ...prev.departmentsByDivision,
        [divisionName]: prev.departmentsByDivision[divisionName].filter(dept => dept !== departmentName)
      }
    }));

    toast({
      title: "Department Deleted",
      description: `${departmentName} department has been removed from ${divisionName}.`,
    });
  };

  // Filter employees based on search and filter criteria
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.division?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || employee.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter;
    const matchesDivision = divisionFilter === "all" || employee.division === divisionFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesDivision;
  });

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

  // Extended widgets localStorage removed - now part of main widgets system

  // Save layouts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('workspace-layouts', JSON.stringify(layouts));
  }, [layouts]);

  // Save trends widget visibility to localStorage
  useEffect(() => {
    const trendsWidgetSettings = trendsWidgets.map(widget => ({
      id: widget.id,
      visible: widget.visible
    }));
    localStorage.setItem('trends-widgets', JSON.stringify(trendsWidgetSettings));
  }, [trendsWidgets]);

  // Save trends layouts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('trends-layouts', JSON.stringify(trendsLayouts));
  }, [trendsLayouts]);

  // Widget management functions
  const toggleWidgetVisibility = useCallback((widgetId: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === widgetId 
        ? { ...widget, visible: !widget.visible }
        : widget
    ));
    
    // Track widget interaction achievement
    trackMilestone('widget_customized', { 
      widgetId, 
      action: 'toggle_visibility',
      timestamp: new Date() 
    });
  }, [trackMilestone]);

  // Group selection functions
  const toggleWidgetSelection = useCallback((widgetId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    setSelectedWidgets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(widgetId)) {
        newSet.delete(widgetId);
      } else {
        newSet.add(widgetId);
      }
      return newSet;
    });
  }, []);

  const selectAllWidgets = useCallback(() => {
    const visibleWidgetIds = widgets.filter(w => w.visible).map(w => w.id);
    setSelectedWidgets(new Set(visibleWidgetIds));
  }, [widgets]);

  const clearSelection = useCallback(() => {
    setSelectedWidgets(new Set());
  }, []);

  const toggleGroupSelectionMode = useCallback(() => {
    setIsGroupSelectionMode(prev => !prev);
    if (isGroupSelectionMode) {
      clearSelection();
    }
  }, [isGroupSelectionMode, clearSelection]);

  // Group move function
  const moveSelectedWidgets = useCallback((deltaX: number, deltaY: number) => {
    if (selectedWidgets.size === 0) return;
    
    setLayouts(prev => {
      const newLayouts = { ...prev };
      
      Object.keys(newLayouts).forEach(breakpoint => {
        newLayouts[breakpoint] = newLayouts[breakpoint].map((item: any) => {
          if (selectedWidgets.has(item.i)) {
            return {
              ...item,
              x: Math.max(0, item.x + deltaX),
              y: Math.max(0, item.y + deltaY)
            };
          }
          return item;
        });
      });
      
      return newLayouts;
    });
  }, [selectedWidgets]);

  // toggleExtendedWidgetVisibility removed as extended widgets are now part of main widgets

  // Use ref to track if layout is being updated to prevent infinite loops
  const layoutUpdateRef = useRef(false);
  
  // Layout change handler with proper comparison
  const handleLayoutChange = useCallback((newLayout: any, allLayouts: any) => {
    // Prevent infinite loops during layout updates
    if (layoutUpdateRef.current) {
      return;
    }
    
    // Only update if there are actual changes to prevent excessive updates
    const currentLayoutString = JSON.stringify(layouts);
    const newLayoutString = JSON.stringify(allLayouts);
    
    if (currentLayoutString !== newLayoutString && widgets.length > 0) {
      layoutUpdateRef.current = true;
      setLayouts(allLayouts);
      
      // Track widget layout customization achievement
      trackMilestone('widget_customized', { 
        action: 'layout_change',
        widgetCount: widgets.length,
        timestamp: new Date() 
      });
      
      // Reset the flag after a short delay
      setTimeout(() => {
        layoutUpdateRef.current = false;
      }, 20);
    }
  }, [layouts, widgets.length, trackMilestone]);

  // Trends widget management functions
  const toggleTrendsWidgetVisibility = useCallback((widgetId: string) => {
    setTrendsWidgets(prev => prev.map(widget => 
      widget.id === widgetId 
        ? { ...widget, visible: !widget.visible }
        : widget
    ));
  }, []);

  const handleTrendsLayoutChange = useCallback((newLayout: any, allLayouts: any) => {
    const currentLayoutString = JSON.stringify(trendsLayouts);
    const newLayoutString = JSON.stringify(allLayouts);
    
    if (currentLayoutString !== newLayoutString && trendsWidgets.length > 0) {
      setTrendsLayouts(allLayouts);
    }
  }, [trendsLayouts, trendsWidgets.length]);

  // handleExtendedLayoutChange removed as extended widgets are now part of main widgets



  const resetWidgetLayout = () => {
    // Reset to default layout and visibility
    const defaultLayouts = {
      lg: defaultWidgetConfig.map(widget => ({ ...widget.defaultProps, i: widget.id })),
      md: defaultWidgetConfig.map(widget => ({ ...widget.defaultProps, i: widget.id })),
      sm: defaultWidgetConfig.map(widget => ({ ...widget.defaultProps, i: widget.id })),
      xs: defaultWidgetConfig.map(widget => ({ ...widget.defaultProps, i: widget.id })),
      xxs: defaultWidgetConfig.map(widget => ({ ...widget.defaultProps, i: widget.id })),
    };
    
    setLayouts(defaultLayouts);
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



  // Generate widget content with responsive styling based on widget dimensions
  const generateWidgetContent = (widget: DashboardWidget, layoutItem?: any) => {
    // Determine if widget is small based on actual dimensions
    const isSmall = layoutItem ? (layoutItem.w <= 3 && layoutItem.h <= 2) : false;
    const textSize = isSmall ? 'text-lg' : 'text-2xl';
    const iconSize = isSmall ? 'w-6 h-6' : 'w-8 h-8';
    const labelSize = isSmall ? 'text-xs' : 'text-sm';
    
    switch (widget.id) {
      case "welcome-widget":
        const currentTime = new Date().getHours();
        const getGreeting = () => {
          if (currentTime < 12) return "Good morning";
          if (currentTime < 17) return "Good afternoon";
          return "Good evening";
        };
        
        const getMotivationalMessage = () => {
          const messages = [
            "Stay focused on keeping your team safe and compliant.",
            "Every training session makes your workplace safer.",
            "Your dedication to safety compliance protects everyone.",
            "Building a culture of safety starts with you.",
            "Excellence in safety is a journey, not a destination."
          ];
          return messages[Math.floor(Math.random() * messages.length)];
        };

        return (
          <div className="h-full bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-4 overflow-hidden">
            <div className="flex items-center justify-between h-full">
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Home className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <h3 className="text-lg font-bold text-white truncate">
                    {getGreeting()}, {user?.name?.split(' ')[0] || 'Safety Manager'}!
                  </h3>
                </div>
                <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                  {getMotivationalMessage()}
                </p>
                <div className="flex items-center space-x-4 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse flex-shrink-0" />
                    <span className="text-gray-400">System Online</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3 h-3 text-blue-400 flex-shrink-0" />
                    <span className="text-gray-400 hidden sm:inline">
                      {new Date().toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3 flex-shrink-0">
                <div className="text-right">
                  <p className="text-xl font-bold text-white">{stats.complianceScore}%</p>
                  <p className="text-gray-400 text-xs">Compliance</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        );
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
      case "quick-actions":
        return (
          <div className="h-full overflow-hidden">
            <h3 className={`${isSmall ? 'text-sm' : 'text-lg'} font-semibold text-white mb-2`}>Quick Actions</h3>
            <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100% - 2rem)' }}>
              <button className="w-full flex items-center space-x-2 p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                <Plus className={`${isSmall ? 'w-3 h-3' : 'w-4 h-4'}`} />
                <span className={`${isSmall ? 'text-xs' : 'text-sm'} font-medium`}>Add Employee</span>
              </button>
              <button className="w-full flex items-center space-x-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <Calendar className={`${isSmall ? 'w-3 h-3' : 'w-4 h-4'}`} />
                <span className={`${isSmall ? 'text-xs' : 'text-sm'} font-medium`}>Schedule Training</span>
              </button>
              {!isSmall && (
                <button className="w-full flex items-center space-x-2 p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm font-medium">Generate Report</span>
                </button>
              )}
            </div>
          </div>
        );
      case "analytics-overview":
        return (
          <div className="h-full overflow-hidden">
            <h3 className={`${isSmall ? 'text-sm' : 'text-lg'} font-semibold text-white mb-2`}>Analytics Overview</h3>
            <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100% - 2rem)' }}>
              <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                <span className={`${isSmall ? 'text-xs' : 'text-sm'} text-gray-400`}>Monthly Progress</span>
                <span className={`${isSmall ? 'text-xs' : 'text-sm'} text-emerald-400 font-semibold`}>+12%</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                <span className={`${isSmall ? 'text-xs' : 'text-sm'} text-gray-400`}>Compliance Rate</span>
                <span className={`${isSmall ? 'text-xs' : 'text-sm'} text-blue-400 font-semibold`}>94.2%</span>
              </div>
              {!isSmall && (
                <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                  <span className="text-sm text-gray-400">Training Hours</span>
                  <span className="text-sm text-yellow-400 font-semibold">2,847</span>
                </div>
              )}
            </div>
          </div>
        );
      case "achievement-progress":
        return (
          <div className="h-full overflow-hidden">
            <DynamicAchievementWidget isSmall={isSmall} />
          </div>
        );
      case "osha-training":
        return (
          <div className="h-full overflow-hidden">
            <h3 className={`${isSmall ? 'text-sm' : 'text-lg'} font-semibold text-white mb-2`}>OSHA Training</h3>
            <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100% - 2rem)' }}>
              <div className="flex items-center justify-between p-2 bg-orange-900/20 rounded-lg border border-orange-500/20">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className={`${isSmall ? 'w-3 h-3' : 'w-4 h-4'} text-orange-400`} />
                  <span className={`${isSmall ? 'text-xs' : 'text-sm'} text-white`}>Fall Protection</span>
                </div>
                <span className={`${isSmall ? 'text-xs' : 'text-sm'} text-orange-400`}>Due Soon</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-green-900/20 rounded-lg border border-green-500/20">
                <div className="flex items-center space-x-2">
                  <CheckCircle className={`${isSmall ? 'w-3 h-3' : 'w-4 h-4'} text-green-400`} />
                  <span className={`${isSmall ? 'text-xs' : 'text-sm'} text-white`}>Hazcom</span>
                </div>
                <span className={`${isSmall ? 'text-xs' : 'text-sm'} text-green-400`}>Current</span>
              </div>
              {!isSmall && (
                <div className="flex items-center justify-between p-2 bg-blue-900/20 rounded-lg border border-blue-500/20">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-white">Respirator</span>
                  </div>
                  <span className="text-sm text-blue-400">Scheduled</span>
                </div>
              )}
            </div>
          </div>
        );
      case "training-completion":
        return (
          <div className="h-full overflow-hidden">
            <h3 className={`${isSmall ? 'text-sm' : 'text-lg'} font-semibold text-white mb-2`}>Training Completion</h3>
            <div className="space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100% - 2rem)' }}>
              <div className="flex items-center justify-between">
                <span className={`${isSmall ? 'text-xs' : 'text-sm'} text-gray-400 truncate`}>Overall Progress</span>
                <span className={`${isSmall ? 'text-xs' : 'text-sm'} text-white flex-shrink-0`}>87%</span>
              </div>
              <Progress value={87} className="h-2" />
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-gray-800/30 rounded">
                  <div className={`${isSmall ? 'text-sm' : 'text-lg'} font-bold text-emerald-400`}>42</div>
                  <div className={`${isSmall ? 'text-xs' : 'text-xs'} text-gray-400`}>Completed</div>
                </div>
                <div className="text-center p-2 bg-gray-800/30 rounded">
                  <div className={`${isSmall ? 'text-sm' : 'text-lg'} font-bold text-yellow-400`}>8</div>
                  <div className={`${isSmall ? 'text-xs' : 'text-xs'} text-gray-400`}>Pending</div>
                </div>
              </div>
            </div>
          </div>
        );
      case "ai-insights":
        return (
          <div className="h-full overflow-hidden">
            <h3 className={`${isSmall ? 'text-sm' : 'text-lg'} font-semibold text-white mb-2`}>AI Insights</h3>
            <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100% - 2rem)' }}>
              <div className="flex items-start space-x-2 p-2 bg-blue-900/20 rounded-lg border border-blue-500/20">
                <Brain className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} text-blue-400 flex-shrink-0 mt-0.5`} />
                <div className="min-w-0 flex-1">
                  <p className={`text-white ${isSmall ? 'text-xs' : 'text-sm'} font-medium`}>Schedule fall protection training for Construction department</p>
                  <p className={`text-gray-400 ${isSmall ? 'text-xs' : 'text-xs'} mt-1`}>High confidence recommendation</p>
                </div>
              </div>
              {!isSmall && (
                <div className="flex items-start space-x-2 p-2 bg-green-900/20 rounded-lg border border-green-500/20">
                  <Brain className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm font-medium">Compliance rate improved by 12% this quarter</p>
                    <p className="text-gray-400 text-xs mt-1">Trend analysis</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case "safety-score":
        return (
          <div className="flex items-center justify-between h-full">
            <div className="flex-1 min-w-0">
              <p className={`text-gray-400 ${labelSize} truncate`}>Safety Score</p>
              <p className={`${textSize} font-bold text-emerald-400 truncate`}>A+</p>
              <p className={`text-gray-400 ${isSmall ? 'text-xs' : 'text-sm'} truncate`}>88% Overall</p>
            </div>
            <div className="flex flex-col items-center flex-shrink-0 ml-2">
              <CheckCircle className={`${iconSize} text-emerald-400`} />
              <TrendingUp className={`${isSmall ? 'w-3 h-3' : 'w-4 h-4'} text-green-400 mt-1`} />
            </div>
          </div>
        );
      case "safety-trends-chart":
        return (
          <div className="h-full overflow-hidden">
            <h3 className={`${isSmall ? 'text-sm' : 'text-lg'} font-semibold text-white mb-2`}>Safety Trends</h3>
            <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100% - 2rem)' }}>
              <div className="flex items-center justify-between p-2 bg-gray-800/30 rounded-lg">
                <span className={`${isSmall ? 'text-xs' : 'text-sm'} text-gray-400`}>Incident Rate</span>
                <div className="flex items-center space-x-1">
                  <span className={`${isSmall ? 'text-xs' : 'text-sm'} text-emerald-400`}>↓ 15%</span>
                  <TrendingDown className={`${isSmall ? 'w-3 h-3' : 'w-4 h-4'} text-emerald-400`} />
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-800/30 rounded-lg">
                <span className={`${isSmall ? 'text-xs' : 'text-sm'} text-gray-400`}>Near Misses</span>
                <div className="flex items-center space-x-1">
                  <span className={`${isSmall ? 'text-xs' : 'text-sm'} text-yellow-400`}>↑ 8%</span>
                  <TrendingUp className={`${isSmall ? 'w-3 h-3' : 'w-4 h-4'} text-yellow-400`} />
                </div>
              </div>
              {!isSmall && (
                <div className="flex items-center justify-between p-2 bg-gray-800/30 rounded-lg">
                  <span className="text-sm text-gray-400">Training Hours</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-emerald-400">↑ 22%</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case "compliance-metrics":
        return (
          <div className="h-full overflow-hidden">
            <h3 className={`${isSmall ? 'text-sm' : 'text-lg'} font-semibold text-white mb-2`}>Compliance Metrics</h3>
            <div className="space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100% - 2rem)' }}>
              <div className="flex items-center justify-between">
                <span className={`${isSmall ? 'text-xs' : 'text-sm'} text-gray-400`}>OSHA Compliance</span>
                <span className={`${isSmall ? 'text-xs' : 'text-sm'} text-emerald-400 font-semibold`}>94%</span>
              </div>
              <Progress value={94} className="h-2" />
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-gray-800/30 rounded">
                  <div className={`${isSmall ? 'text-sm' : 'text-lg'} font-bold text-white`}>147</div>
                  <div className={`${isSmall ? 'text-xs' : 'text-xs'} text-gray-400`}>Total Audits</div>
                </div>
                <div className="text-center p-2 bg-gray-800/30 rounded">
                  <div className={`${isSmall ? 'text-sm' : 'text-lg'} font-bold text-green-400`}>138</div>
                  <div className={`${isSmall ? 'text-xs' : 'text-xs'} text-gray-400`}>Passed</div>
                </div>
              </div>
            </div>
          </div>
        );
      case "department-performance":
        return (
          <div className="h-full overflow-hidden">
            <h3 className={`${isSmall ? 'text-sm' : 'text-lg'} font-semibold text-white mb-2`}>Department Performance</h3>
            <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100% - 2rem)' }}>
              <div className="flex items-center justify-between p-2 bg-gray-800/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Building className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} text-blue-400`} />
                  <span className={`${isSmall ? 'text-xs' : 'text-sm'} text-white`}>Construction</span>
                </div>
                <span className={`${isSmall ? 'text-xs' : 'text-sm'} text-emerald-400`}>93%</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-800/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Building className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} text-purple-400`} />
                  <span className={`${isSmall ? 'text-xs' : 'text-sm'} text-white`}>Manufacturing</span>
                </div>
                <span className={`${isSmall ? 'text-xs' : 'text-sm'} text-yellow-400`}>84%</span>
              </div>
              {!isSmall && (
                <div className="flex items-center justify-between p-2 bg-gray-800/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Building className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-white">Safety</span>
                  </div>
                  <span className="text-sm text-emerald-400">100%</span>
                </div>
              )}
            </div>
          </div>
        );
      case "risk-analysis":
        return (
          <div className="h-full overflow-hidden">
            <h3 className={`${isSmall ? 'text-sm' : 'text-lg'} font-semibold text-white mb-2`}>Risk Analysis</h3>
            <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100% - 2rem)' }}>
              <div className="flex items-center justify-between p-2 bg-red-900/20 rounded-lg border border-red-500/20">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} text-red-400`} />
                  <span className={`${isSmall ? 'text-xs' : 'text-sm'} text-white`}>High Risk</span>
                </div>
                <span className={`${isSmall ? 'text-xs' : 'text-sm'} text-red-400`}>3</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-yellow-900/20 rounded-lg border border-yellow-500/20">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} text-yellow-400`} />
                  <span className={`${isSmall ? 'text-xs' : 'text-sm'} text-white`}>Medium Risk</span>
                </div>
                <span className={`${isSmall ? 'text-xs' : 'text-sm'} text-yellow-400`}>12</span>
              </div>
              {!isSmall && (
                <div className="flex items-center justify-between p-2 bg-green-900/20 rounded-lg border border-green-500/20">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-white">Low Risk</span>
                  </div>
                  <span className="text-sm text-green-400">85</span>
                </div>
              )}
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
        <div className="max-w-md w-full mx-auto">
          <SmoothLoading 
            variant="ai-skeleton" 
            text="Loading workspace..." 
            className="w-full"
          />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to client portal for authentication
    window.location.href = '/client-portal';
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <SafetySyncIcon size={64} className="mx-auto mb-4 animate-pulse" />
          <p className="text-white text-lg">Redirecting to client portal...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex flex-col md:flex-row">
      {/* Sidebar */}
      <motion.div 
        className={`${sidebarOpen ? 'w-full md:w-64' : 'w-full md:w-16'} ${sidebarOpen ? 'h-auto' : 'h-16'} md:h-auto bg-black/20 backdrop-blur-sm border-r border-gray-800 flex flex-col md:border-r md:border-b-0 border-b`}
        variants={sidebarVariants}
        animate={sidebarOpen ? "open" : "closed"}
        initial={sidebarOpen ? "open" : "closed"}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            {sidebarOpen ? (
              <div className="flex items-center space-x-3">
                <SafetySyncIcon size={40} className="rounded-lg" />
                <div>
                  <h2 className="text-white font-semibold text-sm md:text-base">
                    {workspaceSettings.showBranding ? workspaceSettings.companyName : "SafetySync.AI"}
                  </h2>
                  <p className="text-gray-400 text-xs md:text-sm">Workspace</p>
                </div>
              </div>
            ) : (
              <SafetySyncIcon size={32} className="rounded-lg" />
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
        <nav className={`${sidebarOpen ? 'block' : 'hidden'} md:block flex-1 p-4 space-y-2`}>
          {/* Dashboard - Standalone */}
          <motion.div
            variants={navButtonVariants}
            initial="idle"
            whileHover="hover"
            animate={activeTab === "unified-dashboard" ? "active" : "idle"}
          >
            <Button
              variant="ghost"
              className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 pl-3 ${
                activeTab === "unified-dashboard" ? "text-white bg-gray-700/30" : ""
              }`}
              onClick={() => handleTabSwitch("unified-dashboard")}
              title="Dashboard"
            >
              <Home className="w-5 h-5 mr-3 flex-shrink-0" />
              {sidebarOpen && <span className="truncate">Dashboard</span>}
            </Button>
          </motion.div>

          {/* Compliance & Reporting Section */}
          <div className="space-y-1">
            <motion.div
              variants={navButtonVariants}
              initial="idle"
              whileHover="hover"
            >
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 pl-3"
                onClick={() => toggleSection('compliance-reporting')}
                title="Compliance & Reporting"
              >
                <FileText className="w-5 h-5 mr-3 flex-shrink-0" />
                {sidebarOpen && <span className="truncate">Compliance & Reporting</span>}
                {sidebarOpen && (
                  <motion.div
                    variants={chevronVariants}
                    animate={expandedSections['compliance-reporting'] ? "open" : "closed"}
                    className="ml-auto flex-shrink-0"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.div>
                )}
              </Button>
            </motion.div>
            <AnimatePresence>
              {expandedSections['compliance-reporting'] && (
                <motion.div 
                  className="ml-6 space-y-1"
                  variants={expandedSectionVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  <motion.div variants={subItemVariants}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 pl-3 ${
                        activeTab === "analytics-reports" ? "text-white border-b-2 border-blue-400 rounded-b-none bg-gray-700/30" : ""
                      }`}
                      onClick={() => handleTabSwitch("analytics-reports")}
                      title="Analytics & Reports"
                    >
                      <BarChart3 className="w-4 h-4 mr-3 flex-shrink-0" />
                      {sidebarOpen && <span className="truncate">Analytics & Reports</span>}
                    </Button>
                  </motion.div>
                  <motion.div variants={subItemVariants}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 pl-3 ${
                        activeTab === "reports" ? "text-white border-b-2 border-blue-400 rounded-b-none bg-gray-700/30" : ""
                      }`}
                      onClick={() => handleTabSwitch("reports")}
                      title="Compliance Reports"
                    >
                      <FileText className="w-4 h-4 mr-3 flex-shrink-0" />
                      {sidebarOpen && <span className="truncate">Compliance Reports</span>}
                    </Button>
                  </motion.div>
                  <motion.div variants={subItemVariants}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 pl-3 ${
                        activeTab === "document-manager" ? "text-white border-b-2 border-blue-400 rounded-b-none bg-gray-700/30" : ""
                      }`}
                      onClick={() => handleTabSwitch("document-manager")}
                      title="Document Management"
                    >
                      <Database className="w-4 h-4 mr-3 flex-shrink-0" />
                      {sidebarOpen && <span className="truncate">Document Management</span>}
                    </Button>
                  </motion.div>
                  <motion.div variants={subItemVariants}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 pl-3 ${
                        activeTab === "trends" ? "text-white border-b-2 border-blue-400 rounded-b-none bg-gray-700/30" : ""
                      }`}
                      onClick={() => handleTabSwitch("trends")}
                      title="Safety Trends"
                    >
                      <TrendingUp className="w-4 h-4 mr-3 flex-shrink-0" />
                      {sidebarOpen && <span className="truncate">Safety Trends</span>}
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Employee Management Section */}
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 pl-3"
              onClick={() => toggleSection('employee-management')}
              title="Employee Management"
            >
              <Users className="w-5 h-5 mr-3 flex-shrink-0" />
              {sidebarOpen && <span className="truncate">Employee Management</span>}
              {sidebarOpen && (
                expandedSections['employee-management'] ? 
                  <ChevronDown className="w-4 h-4 ml-auto flex-shrink-0" /> : 
                  <ChevronRight className="w-4 h-4 ml-auto flex-shrink-0" />
              )}
            </Button>
            {expandedSections['employee-management'] && (
              <div className="ml-6 space-y-1">
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 pl-3 ${
                    activeTab === "employees" ? "text-white border-b-2 border-blue-400 rounded-b-none bg-gray-700/30" : ""
                  }`}
                  onClick={() => handleTabSwitch("employees")}
                  title="Employee Management"
                >
                  <Users className="w-4 h-4 mr-3 flex-shrink-0" />
                  {sidebarOpen && <span className="truncate">Employee Management</span>}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 pl-3 ${
                    activeTab === "employee-insights" ? "text-white border-b-2 border-blue-400 rounded-b-none bg-gray-700/30" : ""
                  }`}
                  onClick={() => handleTabSwitch("employee-insights")}
                  title="Employee Insights"
                >
                  <Brain className="w-4 h-4 mr-3 flex-shrink-0" />
                  {sidebarOpen && <span className="truncate">Employee Insights</span>}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 pl-3 ${
                    activeTab === "employee-portal" ? "text-white border-b-2 border-blue-400 rounded-b-none bg-gray-700/30" : ""
                  }`}
                  onClick={() => handleTabSwitch("employee-portal")}
                  title="Employee Portal"
                >
                  <FileUser className="w-4 h-4 mr-3 flex-shrink-0" />
                  {sidebarOpen && <span className="truncate">Employee Portal</span>}
                </Button>
              </div>
            )}
          </div>

          {/* Organization Section */}
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 pl-3"
              onClick={() => toggleSection('organization')}
              title="Organization"
            >
              <Building className="w-5 h-5 mr-3 flex-shrink-0" />
              {sidebarOpen && <span className="truncate">Organization</span>}
              {sidebarOpen && (
                expandedSections['organization'] ? 
                  <ChevronDown className="w-4 h-4 ml-auto flex-shrink-0" /> : 
                  <ChevronRight className="w-4 h-4 ml-auto flex-shrink-0" />
              )}
            </Button>
            {expandedSections['organization'] && (
              <div className="ml-6 space-y-1">
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 pl-3 ${
                    activeTab === "company-profile" ? "text-white border-b-2 border-blue-400 rounded-b-none bg-gray-700/30" : ""
                  }`}
                  onClick={() => handleTabSwitch("company-profile")}
                  title="Company Profile"
                >
                  <Building className="w-4 h-4 mr-3 flex-shrink-0" />
                  {sidebarOpen && <span className="truncate">Company Profile</span>}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 pl-3 ${
                    activeTab === "instructors" ? "text-white border-b-2 border-blue-400 rounded-b-none bg-gray-700/30" : ""
                  }`}
                  onClick={() => handleTabSwitch("instructors")}
                  title="Instructor Management"
                >
                  <GraduationCap className="w-4 h-4 mr-3 flex-shrink-0" />
                  {sidebarOpen && <span className="truncate">Instructor Management</span>}
                </Button>
              </div>
            )}
          </div>
          {/* System & Tools Section */}
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 pl-3"
              onClick={() => toggleSection('system-tools')}
              title="System & Tools"
            >
              <Settings className="w-5 h-5 mr-3 flex-shrink-0" />
              {sidebarOpen && <span className="truncate">System & Tools</span>}
              {sidebarOpen && (
                expandedSections['system-tools'] ? 
                  <ChevronDown className="w-4 h-4 ml-auto flex-shrink-0" /> : 
                  <ChevronRight className="w-4 h-4 ml-auto flex-shrink-0" />
              )}
            </Button>
            {expandedSections['system-tools'] && (
              <div className="ml-6 space-y-1">
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 pl-3 ${
                    activeTab === "achievements" ? "text-white border-b-2 border-blue-400 rounded-b-none bg-gray-700/30" : ""
                  }`}
                  onClick={() => handleTabSwitch("achievements")}
                  title="Achievements & Milestones"
                >
                  <Award className="w-4 h-4 mr-3 flex-shrink-0" />
                  {sidebarOpen && <span className="truncate">Achievements & Milestones</span>}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 pl-3 ${
                    activeTab === "notifications" ? "text-white border-b-2 border-blue-400 rounded-b-none bg-gray-700/30" : ""
                  }`}
                  onClick={() => handleTabSwitch("notifications")}
                  title="Notifications & Alerts"
                >
                  <Bell className="w-4 h-4 mr-3 flex-shrink-0" />
                  {sidebarOpen && <span className="truncate">Notifications & Alerts</span>}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 pl-3 ${
                    activeTab === "settings" ? "text-white border-b-2 border-blue-400 rounded-b-none bg-gray-700/30" : ""
                  }`}
                  onClick={() => handleTabSwitch("settings")}
                  title="Workspace Settings"
                >
                  <Settings className="w-4 h-4 mr-3 flex-shrink-0" />
                  {sidebarOpen && <span className="truncate">Workspace Settings</span>}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 pl-3 ${
                    activeTab === "subscription-billing" ? "text-white border-b-2 border-blue-400 rounded-b-none bg-gray-700/30" : ""
                  }`}
                  onClick={() => handleTabSwitch("subscription-billing")}
                  title="Subscription & Billing"
                >
                  <CreditCard className="w-4 h-4 mr-3 flex-shrink-0" />
                  {sidebarOpen && <span className="truncate">Subscription & Billing</span>}
                </Button>
              </div>
            )}
          </div>

          {/* Training & Certification Section */}
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 pl-3"
              onClick={() => toggleSection('training-certification')}
              title="Training & Certification"
            >
              <BookOpen className="w-5 h-5 mr-3 flex-shrink-0" />
              {sidebarOpen && <span className="truncate">Training & Certification</span>}
              {sidebarOpen && (
                expandedSections['training-certification'] ? 
                  <ChevronDown className="w-4 h-4 ml-auto flex-shrink-0" /> : 
                  <ChevronRight className="w-4 h-4 ml-auto flex-shrink-0" />
              )}
            </Button>
            {expandedSections['training-certification'] && (
              <div className="ml-6 space-y-1">
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 pl-3 ${
                    activeTab === "certificates" ? "text-white border-b-2 border-blue-400 rounded-b-none bg-gray-700/30" : ""
                  }`}
                  onClick={() => handleTabSwitch("certificates")}
                  title="Certificate Generation"
                >
                  <Award className="w-4 h-4 mr-3 flex-shrink-0" />
                  {sidebarOpen && <span className="truncate">Certificate Generation</span>}
                </Button>

                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 pl-3 ${
                    activeTab === "instructor-signin" ? "text-white border-b-2 border-blue-400 rounded-b-none bg-gray-700/30" : ""
                  }`}
                  onClick={() => handleTabSwitch("instructor-signin")}
                  title="Instructor Sign-In Sheets"
                >
                  <FileText className="w-4 h-4 mr-3 flex-shrink-0" />
                  {sidebarOpen && <span className="truncate">Instructor Sign-In Sheets</span>}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 pl-3 ${
                    activeTab === "training-records" ? "text-white border-b-2 border-blue-400 rounded-b-none bg-gray-700/30" : ""
                  }`}
                  onClick={() => handleTabSwitch("training-records")}
                  title="Training Records"
                >
                  <Database className="w-4 h-4 mr-3 flex-shrink-0" />
                  {sidebarOpen && <span className="truncate">Training Records</span>}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 pl-3 ${
                    activeTab === "training" ? "text-white border-b-2 border-blue-400 rounded-b-none bg-gray-700/30" : ""
                  }`}
                  onClick={() => handleTabSwitch("training")}
                  title="Training Management"
                >
                  <BookOpen className="w-4 h-4 mr-3 flex-shrink-0" />
                  {sidebarOpen && <span className="truncate">Training Management</span>}
                </Button>
              </div>
            )}
          </div>

        </nav>

        {/* User Menu */}
        <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block p-4 border-t border-gray-800`}>
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
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            {sidebarOpen && "Sign Out"}
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Top Bar */}
        <div className="bg-black/20 backdrop-blur-sm border-b border-gray-800 p-2 md:p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg md:text-2xl font-bold text-white truncate">
                {activeTab === "unified-dashboard" && "Dashboard"}
                {activeTab === "employees" && "Employee Management"}
                {activeTab === "employee-insights" && "Employee Insights"}
                {activeTab === "training" && "Training Management"}
                {activeTab === "certificates" && "Certificate Generation"}
                {activeTab === "reports" && "Compliance Reports"}

                {activeTab === "trends" && "Safety Trends"}
                {activeTab === "instructors" && "Instructor Management"}
                {activeTab === "organization" && "Organization Structure"}
                {activeTab === "employee-portal" && "Employee Portal"}
                {activeTab === "notifications" && "Notifications & Alerts"}

                {activeTab === "instructor-signin" && "Instructor Sign-In Sheets"}
                {activeTab === "training-records" && "Training Records"}

                {activeTab === "subscription-billing" && "Subscription & Billing"}
                {activeTab === "analytics-reports" && "Analytics & Reports"}
                {activeTab === "achievements" && "Achievements & Milestones"}
                {activeTab === "document-manager" && "Document Management"}
                {activeTab === "company-profile" && "Company Profile"}
                {activeTab === "settings" && "Workspace Settings"}
              </h1>
              <p className="text-gray-400 text-sm md:text-base">
                {activeTab === "unified-dashboard" && (
                  <span>
                    Comprehensive overview combining analytics, compliance management, and actionable insights
                    <span className="hidden lg:inline text-gray-500 text-sm ml-4">• Drag widgets to reposition • Drag corners to resize • Click manage to show/hide</span>
                  </span>
                )}
                {activeTab === "employees" && "Manage employee certifications and training"}
                {activeTab === "employee-insights" && "AI-powered analytics and insights for employee data"}
                {activeTab === "training" && "Schedule and track safety training"}
                {activeTab === "certificates" && "Generate professional certificates and cards"}
                {activeTab === "reports" && "Generate compliance reports for audits"}

                {activeTab === "trends" && "Analyze safety trends and performance"}
                {activeTab === "instructors" && "Manage certified instructors and their credentials"}
                {activeTab === "organization" && "Configure departments and organizational structure"}
                {activeTab === "employee-portal" && "Self-service portal for employee access"}
                {activeTab === "notifications" && "Manage alerts and notification preferences"}

                {activeTab === "instructor-signin" && "Generate sign-in sheets for training classes and manage instructor documentation"}
                {activeTab === "training-records" && "Comprehensive training session documentation and attendee tracking"}

                {activeTab === "subscription-billing" && "Manage your plan and billing information"}
                {activeTab === "analytics-reports" && "Generate comprehensive analytics and reports"}
                {activeTab === "achievements" && "Track your safety milestones and earn achievement badges"}
                {activeTab === "document-manager" && "Upload, organize, and manage safety documents"}
                {activeTab === "company-profile" && "Manage your company profile and business information"}
                {activeTab === "settings" && "Configure your workspace and branding"}
              </p>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <Button variant="secondary" className="bg-gray-800/50 text-gray-300 border-gray-600 hover:bg-gray-700/50 p-2 md:px-4 md:py-2">
                <Bell className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Notifications</span>
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  logout();
                  window.location.href = '/';
                }}
                className="bg-red-800/20 text-red-300 border-red-600 hover:bg-red-700/50 p-2 md:px-4 md:py-2"
              >
                <LogOut className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Logout</span>
              </Button>
              <a href="/" className="hidden md:inline text-gray-400 hover:text-white hover:bg-gray-700/50 px-2 py-1 rounded text-sm">
                ← Back to SafetySync.AI
              </a>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-2 md:p-6 overflow-y-auto min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
          {activeTab === "unified-dashboard" && (
            <div className="space-y-6">
              {/* Widget Management Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <Button
                    variant="secondary"
                    onClick={() => setShowWidgetManager(!showWidgetManager)}
                    className="bg-gray-800/50 text-gray-300 border-gray-600 hover:bg-gray-700/50 text-sm"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Widgets
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={saveAsDefault}
                    className="bg-gray-800/50 text-gray-300 border-gray-600 hover:bg-gray-700/50 text-sm"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Save as Default</span>
                    <span className="sm:hidden">Save</span>
                  </Button>
                  {hasCustomDefaults() && (
                    <Button
                      variant="secondary"
                      onClick={loadCustomDefaults}
                      className="bg-gray-800/50 text-gray-300 border-gray-600 hover:bg-gray-700/50 text-sm"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Load My Default</span>
                      <span className="sm:hidden">Load</span>
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    onClick={resetWidgetLayout}
                    className="bg-gray-800/50 text-gray-300 border-gray-600 hover:bg-gray-700/50 text-sm"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Reset to Original</span>
                    <span className="sm:hidden">Reset</span>
                  </Button>
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
                    <div className="space-y-6">
                      {/* Group Selection Controls */}
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h3 className="text-white font-medium mb-3">Group Widget Selection</h3>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant={isGroupSelectionMode ? "default" : "outline"}
                            onClick={toggleGroupSelectionMode}
                            className={`${isGroupSelectionMode ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gray-800/50 text-gray-300 border-gray-600 hover:bg-gray-700/50'}`}
                          >
                            <MousePointer className="w-4 h-4 mr-2" />
                            {isGroupSelectionMode ? 'Exit Selection Mode' : 'Select Multiple'}
                          </Button>
                          {isGroupSelectionMode && (
                            <>
                              <Button
                                variant="outline"
                                onClick={selectAllWidgets}
                                className="bg-gray-800/50 text-gray-300 border-gray-600 hover:bg-gray-700/50"
                              >
                                <CheckSquare className="w-4 h-4 mr-2" />
                                Select All
                              </Button>
                              <Button
                                variant="outline"
                                onClick={clearSelection}
                                className="bg-gray-800/50 text-gray-300 border-gray-600 hover:bg-gray-700/50"
                              >
                                <Square className="w-4 h-4 mr-2" />
                                Clear Selection
                              </Button>
                              {selectedWidgets.size > 0 && (
                                <div className="flex items-center space-x-2">
                                  <span className="text-gray-400 text-sm">
                                    {selectedWidgets.size} selected
                                  </span>
                                  <Button
                                    variant="outline"
                                    onClick={() => moveSelectedWidgets(-1, 0)}
                                    className="bg-gray-800/50 text-gray-300 border-gray-600 hover:bg-gray-700/50 p-2"
                                  >
                                    <ArrowLeft className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => moveSelectedWidgets(1, 0)}
                                    className="bg-gray-800/50 text-gray-300 border-gray-600 hover:bg-gray-700/50 p-2"
                                  >
                                    <ArrowRight className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => moveSelectedWidgets(0, -1)}
                                    className="bg-gray-800/50 text-gray-300 border-gray-600 hover:bg-gray-700/50 p-2"
                                  >
                                    <ArrowUp className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => moveSelectedWidgets(0, 1)}
                                    className="bg-gray-800/50 text-gray-300 border-gray-600 hover:bg-gray-700/50 p-2"
                                  >
                                    <ArrowDown className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        {isGroupSelectionMode && (
                          <div className="text-sm text-gray-400 mt-2">
                            Click widgets to select them, then use arrow buttons or drag to move selected widgets together
                          </div>
                        )}
                      </div>

                      {/* Main Dashboard Widgets */}
                      <div>
                        <h3 className="text-white font-medium mb-3">Main Dashboard Widgets</h3>
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
                      </div>

                      {/* Extended widgets are now part of main widgets section above */}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Repositionable Widget Dashboard */}
              <div className="dashboard-container" style={{ minHeight: '100vh', width: '100%' }}>
                <ResponsiveGridLayout
                  className="layout"
                  layouts={layouts}
                  onLayoutChange={handleLayoutChange}
                  breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                  cols={{ lg: 24, md: 16, sm: 12, xs: 8, xxs: 4 }}
                  rowHeight={50}
                  isDraggable={!isGroupSelectionMode}
                  isResizable={!isGroupSelectionMode}
                  draggableHandle=".drag-handle"
                  containerPadding={[4, 4]}
                  margin={[4, 4]}
                  compactType="vertical"
                  preventCollision={false}
                  useCSSTransforms={true}
                  maxRows={Infinity}
                  autoSize={true}
                  allowOverlap={false}
                  isBounded={false}
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
                          onClick={isGroupSelectionMode ? (e) => toggleWidgetSelection(widget.id, e) : undefined}
                        >
                          <Card className={`bg-black/20 backdrop-blur-sm border-gray-800 h-full group relative transition-all duration-200 ${
                            selectedWidgets.has(widget.id) ? 'ring-2 ring-emerald-500 bg-emerald-500/10' : ''
                          } ${isGroupSelectionMode ? 'cursor-pointer hover:bg-gray-800/30' : ''}`}>
                            <CardContent className="p-4 h-full">
                              {/* Selection Indicator */}
                              {isGroupSelectionMode && (
                                <div className="absolute top-2 left-2 z-10">
                                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                    selectedWidgets.has(widget.id) 
                                      ? 'bg-emerald-500 border-emerald-500' 
                                      : 'border-gray-400 bg-gray-800/50'
                                  }`}>
                                    {selectedWidgets.has(widget.id) && (
                                      <CheckSquare className="w-3 h-3 text-white" />
                                    )}
                                  </div>
                                </div>
                              )}
                              
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
              
              {/* Extended widgets are now part of main grid above */}
            </div>
          )}

          {activeTab === "employees" && (
            <div className="rounded-lg p-2 md:p-6">
              <EmployeeManagement />
            </div>
          )}

          {activeTab === "employee-insights" && (
            <div className="rounded-lg">
              <EmployeeInsightsDashboard />
            </div>
          )}

          {activeTab === "training" && (
            <div className="p-2 md:p-8">
              <TrainingManagement />
            </div>
          )}

          {activeTab === "certificates" && (
            <div className="p-2 md:p-8">
              <CertificateGeneration />
            </div>
          )}

          {activeTab === "reports" && (
            <div className="space-y-6">
              <ComplianceReportGenerator />
            </div>
          )}

          {activeTab === "document-manager" && (
            <div className="space-y-6">
              <DocumentManager />
            </div>
          )}



          {activeTab === "trends" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-bold text-white">Safety Trends</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Safety Trends Chart */}
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-blue-400" />
                      Safety Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Compliance Rate</span>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3 text-green-400" />
                          <span className="text-green-400 text-sm">96%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Training Completion</span>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3 text-blue-400" />
                          <span className="text-blue-400 text-sm">89%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Safety Score</span>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3 text-yellow-400" />
                          <span className="text-yellow-400 text-sm">92%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Compliance Metrics */}
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm flex items-center">
                      <BarChart3 className="w-4 h-4 mr-2 text-blue-400" />
                      Compliance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-400 text-sm">Overall Compliance</span>
                          <span className="text-green-400 text-sm">96%</span>
                        </div>
                        <Progress value={96} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-400 text-sm">Training Progress</span>
                          <span className="text-blue-400 text-sm">89%</span>
                        </div>
                        <Progress value={89} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-400 text-sm">Safety Score</span>
                          <span className="text-yellow-400 text-sm">92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Department Performance */}
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm flex items-center">
                      <Users className="w-4 h-4 mr-2 text-blue-400" />
                      Department Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                        <span className="text-gray-300 text-sm">Construction</span>
                        <span className="text-green-400 text-sm">96%</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                        <span className="text-gray-300 text-sm">Manufacturing</span>
                        <span className="text-green-400 text-sm">98%</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                        <span className="text-gray-300 text-sm">Maintenance</span>
                        <span className="text-yellow-400 text-sm">94%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Risk Analysis */}
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2 text-blue-400" />
                      Risk Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 p-2 bg-green-900/20 rounded-lg border border-green-500/20">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">Low Risk</p>
                          <p className="text-gray-400 text-xs">65% of operations</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 p-2 bg-yellow-900/20 rounded-lg border border-yellow-500/20">
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">Medium Risk</p>
                          <p className="text-gray-400 text-xs">25% of operations</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 p-2 bg-red-900/20 rounded-lg border border-red-500/20">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">High Risk</p>
                          <p className="text-gray-400 text-xs">10% of operations</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Training Completion */}
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm flex items-center">
                      <BookOpen className="w-4 h-4 mr-2 text-blue-400" />
                      Training Completion
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-400 text-sm">Fall Protection</span>
                          <span className="text-white text-sm">87%</span>
                        </div>
                        <Progress value={87} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-400 text-sm">OSHA 10</span>
                          <span className="text-white text-sm">92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-400 text-sm">First Aid</span>
                          <span className="text-white text-sm">76%</span>
                        </div>
                        <Progress value={76} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Safety Score */}
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-blue-400" />
                      Safety Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center h-24">
                      <div className="text-3xl font-bold text-green-400 mb-2">92%</div>
                      <p className="text-gray-400 text-sm text-center">Overall Safety Score</p>
                      <div className="w-full mt-3">
                        <Progress value={92} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "instructors" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                <h2 className="text-xl font-semibold text-white">Instructor Management</h2>
                <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={handleAddInstructor}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Instructor
                </Button>
              </div>
              <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                <CardContent className="p-2 md:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
                <div className="flex gap-2">
                  <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => setShowAddDivision(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Division
                  </Button>
                  <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={() => setShowAddDepartment(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Department
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Division & Department Structure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {organizationalStructure.divisions.map((division, divisionIndex) => (
                        <div key={division} className="border border-gray-700 rounded-lg p-4 bg-gray-800/30">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <Building className="w-6 h-6 text-blue-400" />
                              <div>
                                <p className="text-white font-semibold text-lg">{division}</p>
                                <p className="text-gray-400 text-sm">
                                  {employees.filter(emp => emp.division === division).length} employees
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className="bg-green-100 text-green-700">
                                {Math.round((employees.filter(emp => emp.division === division && emp.status === 'Active').length / Math.max(employees.filter(emp => emp.division === division).length, 1)) * 100)}% Active
                              </Badge>
                              <Button
                                variant="secondary"
                                size="sm"
                                className="bg-red-400/10 text-red-400 border-red-400 hover:bg-red-400/20"
                                onClick={() => handleDeleteDivision(division)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="pl-6 space-y-2">
                            {organizationalStructure.departmentsByDivision[division]?.map((department, deptIndex) => (
                              <div key={department} className="flex items-center justify-between p-2 bg-gray-700/50 rounded-lg">
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                  <div>
                                    <p className="text-white font-medium">{department}</p>
                                    <p className="text-gray-400 text-sm">
                                      {employees.filter(emp => emp.department === department).length} employees
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="secondary" className="bg-gray-800/50 text-gray-300 border-gray-600">
                                    {Math.round((employees.filter(emp => emp.department === department && emp.status === 'Active').length / Math.max(employees.filter(emp => emp.department === department).length, 1)) * 100)}% Active
                                  </Badge>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    className="bg-red-400/10 text-red-400 border-red-400 hover:bg-red-400/20"
                                    onClick={() => handleDeleteDepartment(division, department)}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                            {(!organizationalStructure.departmentsByDivision[division] || organizationalStructure.departmentsByDivision[division].length === 0) && (
                              <p className="text-gray-500 text-sm italic pl-4">No departments yet</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "employee-portal" && (
            <div className="p-8">
              <EmployeePortal />
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="p-8">
              <NotificationSystem />
            </div>
          )}



          {activeTab === "instructor-signin" && (
            <div className="p-8">
              <InstructorSignInGenerator />
            </div>
          )}

          {activeTab === "training-records" && (
            <div className="p-8 min-h-screen">
              <TrainingRecordsManager />
            </div>
          )}



          {activeTab === "subscription-billing" && (
            <div className="p-8">
              <SubscriptionBilling />
            </div>
          )}

          {activeTab === "analytics-reports" && (
            <div className="p-8">
              <AnalyticsReports />
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="p-8">
              <AchievementBadges />
            </div>
          )}

          {activeTab === "company-profile" && (
            <div className="p-8">
              <CompanyProfile />
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
                <Label htmlFor="division" className="text-white">Division *</Label>
                <Select value={newEmployee.division} onValueChange={(value) => setNewEmployee({...newEmployee, division: value, department: ""})}>
                  <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                    <SelectValue placeholder="Select Division" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    {organizationalStructure.divisions.map(division => (
                      <SelectItem key={division} value={division}>{division}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department" className="text-white">Department *</Label>
                <Select 
                  value={newEmployee.department} 
                  onValueChange={(value) => setNewEmployee({...newEmployee, department: value})}
                  disabled={!newEmployee.division}
                >
                  <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                    <SelectValue placeholder={newEmployee.division ? "Select Department" : "Select Division First"} />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    {newEmployee.division && organizationalStructure.departmentsByDivision[newEmployee.division]?.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddEmployee(false)}
                className="border-gray-700 text-gray-300 hover:bg-gray-700/50"
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

      {/* Add Division Dialog */}
      <Dialog open={showAddDivision} onOpenChange={setShowAddDivision}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Add New Division</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Division Name</Label>
              <Input
                value={newDivisionName}
                onChange={(e) => setNewDivisionName(e.target.value)}
                placeholder="Enter division name"
                className="bg-gray-800/50 border-gray-700 text-white mt-1"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAddDivision(false);
                  setNewDivisionName("");
                }}
                className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddDivision}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Add Division
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Department Dialog */}
      <Dialog open={showAddDepartment} onOpenChange={setShowAddDepartment}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Add New Department</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Select Division</Label>
              <Select value={selectedDivisionForDepartment} onValueChange={setSelectedDivisionForDepartment}>
                <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white mt-1">
                  <SelectValue placeholder="Select a division" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {organizationalStructure.divisions.map(division => (
                    <SelectItem key={division} value={division}>{division}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-300">Department Name</Label>
              <Input
                value={newDepartmentName}
                onChange={(e) => setNewDepartmentName(e.target.value)}
                placeholder="Enter department name"
                className="bg-gray-800/50 border-gray-700 text-white mt-1"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAddDepartment(false);
                  setNewDepartmentName("");
                  setSelectedDivisionForDepartment("");
                }}
                className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddDepartment}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                Add Department
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Achievement Notification System */}
      <AchievementNotificationManager />
      


    </div>
  );
}
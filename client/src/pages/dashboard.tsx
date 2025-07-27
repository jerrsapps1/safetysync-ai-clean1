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

import { AIPatternSkeleton } from "@/components/ui/ai-skeleton";
import { SmoothLoading, ContentWrapper } from "@/components/ui/smooth-loading";
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
  BarChart3
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
        description: "Welcome back to SafetySync.AI!",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-blue-900/60 backdrop-blur-sm border border-violet-500/30 rounded-lg p-6 shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">SafetySync.AI</h1>
            <p className="text-white/70">Sign in to your workspace</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-blue-900/60 border-violet-500/30 text-white placeholder-white/50"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-blue-900/60 border-violet-500/30 text-white placeholder-white/50"
                placeholder="Enter your password"
              />
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth();
  
  // Debug logging
  console.log('Dashboard render - isAuthenticated:', isAuthenticated, 'user:', user, 'authLoading:', authLoading);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    compliantEmployees: 0,
    pendingTraining: 0,
    expiringCertifications: 0,
    complianceScore: 0
  });

  // Fetch dashboard statistics on component mount
  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!isAuthenticated) return;
      
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('/api/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const dashboardStats = await response.json();
          setStats(dashboardStats);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchDashboardStats();
  }, [isAuthenticated]);

  const [records, setRecords] = useState<ComplianceRecord[]>([
    {
      id: 1,
      employeeName: "Sarah Johnson",
      training: "OSHA 10-Hour Construction",
      status: "completed",
      dueDate: "2025-12-15",
      completedDate: "2024-11-20",
      certificateUrl: "#"
    },
    {
      id: 2,
      employeeName: "Mike Chen",
      training: "Hazard Communication",
      status: "pending",
      dueDate: "2025-01-30"
    },
    {
      id: 3,
      employeeName: "Lisa Rodriguez",
      training: "Fall Protection",
      status: "expired",
      dueDate: "2024-12-01"
    },
    {
      id: 4,
      employeeName: "David Kim",
      training: "Respiratory Protection",
      status: "completed",
      dueDate: "2025-06-15",
      completedDate: "2024-05-10",
      certificateUrl: "#"
    },
    {
      id: 5,
      employeeName: "Emma Thompson",
      training: "Lockout/Tagout",
      status: "pending",
      dueDate: "2025-02-20"
    }
  ]);

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'expired': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 relative overflow-hidden">
      {/* Tech Grid Background */}
      <div className="absolute inset-0 tech-grid opacity-20"></div>
      
      {/* Floating Tech Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 floating-animation">
          <Brain className="w-6 h-6 text-blue-400 opacity-30" />
        </div>
        <div className="absolute top-32 right-20 floating-animation" style={{ animationDelay: '0.5s' }}>
          <Database className="w-5 h-5 text-purple-400 opacity-30" />
        </div>
        <div className="absolute bottom-20 left-20 floating-animation" style={{ animationDelay: '1s' }}>
          <Shield className="w-6 h-6 text-green-400 opacity-30" />
        </div>
        <div className="absolute bottom-32 right-10 floating-animation" style={{ animationDelay: '1.5s' }}>
          <TrendingUp className="w-5 h-5 text-yellow-400 opacity-30" />
        </div>
      </div>


      
      {/* Navigation Header */}
      <div className="bg-black/10 backdrop-blur-md border-b border-violet-500/30 relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-blue-900/60 transition-all duration-300">
                  <Home className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Home</span>
                </Button>
              </Link>
              <div className="flex items-center space-x-2 group">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md flex items-center justify-center group-hover:pulse-glow transition-all duration-300">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  SafetySync.AI
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Link href="/user-guide">
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-blue-900/60 transition-all duration-300">
                  <span className="hidden sm:inline">Guide</span>
                  <BookOpen className="w-4 h-4 sm:hidden" />
                </Button>
              </Link>
              <Button 
                onClick={simulateLoading}
                variant="ghost" 
                size="sm" 
                className="text-white/70 hover:text-white hover:bg-blue-900/60 transition-all duration-300"
                title="Test Loading"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white hover:bg-blue-900/60 transition-all duration-300"
                onClick={logout}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 text-white text-sm font-medium mb-4 backdrop-blur-sm border border-blue-500/30">
            <Brain className="w-4 h-4 mr-2" />
            AI-Powered Compliance Dashboard
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Compliance Dashboard
            </span>
          </h1>
          <p className="text-white text-lg">
            Monitor and manage your OSHA compliance status with intelligent automation
          </p>
        </div>

        {/* Quick Navigation Helper */}
        <Card className="mb-6 bg-blue-500/10 border-blue-500/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full flex items-center justify-center pulse-glow">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-white">AI-Powered Setup Guide</h3>
                  <p className="text-sm text-white/80">Follow the intelligent workflow: Employees → Training → Branding → Reports for optimal setup</p>
                </div>
              </div>
              <Link href="/user-guide">
                <Button variant="outline" size="sm" className="border-blue-400/50 text-white hover:bg-blue-400/20 hover:border-blue-400 transition-all duration-300">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Full Guide
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* AI-Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isLoading ? (
            <div className="contents">
              <AIPatternSkeleton variant="stats" />
              <AIPatternSkeleton variant="stats" />
              <AIPatternSkeleton variant="stats" />
              <AIPatternSkeleton variant="stats" />
            </div>
          ) : (
            <div className="contents content-fade-in">
              <Card className="bg-blue-500/10 border-blue-500/30 backdrop-blur-sm hover:bg-blue-500/20 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">🤖 AI-Verified Compliant</p>
                      <p className="text-3xl font-bold text-white">{stats.totalEmployees}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg flex items-center justify-center group-hover:pulse-glow">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-500/10 border-green-500/30 backdrop-blur-sm hover:bg-green-500/20 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-300">🤖 AI Analysis: Compliant</p>
                      <p className="text-3xl font-bold text-white">{stats.compliantEmployees}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-500 rounded-lg flex items-center justify-center group-hover:pulse-glow">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-yellow-500/10 border-yellow-500/30 backdrop-blur-sm hover:bg-yellow-500/20 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-300">Smart Training Queue</p>
                      <p className="text-3xl font-bold text-white">{stats.pendingTraining}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-lg flex items-center justify-center group-hover:pulse-glow">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-500/10 border-red-500/30 backdrop-blur-sm hover:bg-red-500/20 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-300">AI Alert: Expiring Soon</p>
                      <p className="text-3xl font-bold text-white">{stats.expiringCertifications}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-500 rounded-lg flex items-center justify-center group-hover:pulse-glow">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Compliance Score */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Overall Compliance Score
            </CardTitle>
            <CardDescription>
              Your organization's current OSHA compliance rating
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Progress value={stats.complianceScore} className="h-3" />
              </div>
              <div className="text-2xl font-bold text-green-600">
                {stats.complianceScore}%
              </div>
            </div>
            <p className="text-sm text-white/70 mt-2">
              Excellent compliance! You're above industry average.
            </p>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-11 bg-blue-900/5 border-violet-500/30 backdrop-blur-sm">
            <TabsTrigger value="overview" className="text-white/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white hover:text-white transition-all duration-300">
              Overview
            </TabsTrigger>
            <TabsTrigger value="employees" className="text-white/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white hover:text-white transition-all duration-300">
              Employees
            </TabsTrigger>
            <TabsTrigger value="training" className="text-white/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white hover:text-white transition-all duration-300">
              Training
            </TabsTrigger>
            <TabsTrigger value="branding" className="text-white/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white hover:text-white transition-all duration-300">
              Branding
            </TabsTrigger>
            <TabsTrigger value="reports" className="text-white/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white hover:text-white transition-all duration-300">
              Reports
            </TabsTrigger>
            <TabsTrigger value="generator" className="text-white/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white hover:text-white transition-all duration-300">
              Report Generator
            </TabsTrigger>
            <TabsTrigger value="certificates" className="text-white/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white hover:text-white transition-all duration-300">
              Certificates
            </TabsTrigger>
            <TabsTrigger value="collaboration" className="text-white/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white hover:text-white transition-all duration-300">
              Team Review
            </TabsTrigger>
            <TabsTrigger value="locations" className="text-white/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white hover:text-white transition-all duration-300">
              Locations
            </TabsTrigger>
            <TabsTrigger value="safety-trends" className="text-white/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white hover:text-white transition-all duration-300">
              Safety Trends
            </TabsTrigger>
            <TabsTrigger value="audit-settings" className="text-white/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white hover:text-white transition-all duration-300">
              Audit Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* AI-Enhanced Recent Activity */}
            <Card className="bg-blue-900/5 border-violet-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  AI-Monitored Recent Activity
                </CardTitle>
                <CardDescription className="text-white">
                  Real-time intelligent compliance tracking and notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-green-500/10 border-green-500/30 rounded-lg hover:bg-green-500/20 transition-all duration-300">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-green-300">🤖 AI Verified: Sarah Johnson completed OSHA 10-Hour Training</p>
                      <p className="text-sm text-green-200">2 hours ago • Compliance score updated automatically</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border-yellow-500/30 rounded-lg hover:bg-yellow-500/20 transition-all duration-300">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Mike Chen's Hazard Communication training due in 15 days</p>
                      <p className="text-sm text-white/60">Yesterday</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-medium">Lisa Rodriguez's Fall Protection certification expired</p>
                      <p className="text-sm text-white/60">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Real-Time Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Real-Time Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Overall Risk Score */}
                  <div className="bg-gradient-to-r from-green-50 to-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Overall Risk Level</span>
                      <Badge className="bg-yellow-100 text-yellow-800">MODERATE</Badge>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-1 bg-blue-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{width: '35%'}}></div>
                      </div>
                      <span className="ml-3 text-sm font-medium">35/100</span>
                    </div>
                  </div>

                  {/* Risk Factors */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                      <span className="text-sm">Expired Certifications</span>
                      <Badge variant="destructive" className="text-xs">HIGH</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                      <span className="text-sm">Training Overdue</span>
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">MEDIUM</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm">Safety Incidents</span>
                      <Badge className="bg-green-100 text-green-800 text-xs">LOW</Badge>
                    </div>
                  </div>

                  {/* AI Recommendations */}
                  <div className="border-t pt-3">
                    <h4 className="text-sm font-medium mb-2">AI Recommendations</h4>
                    <div className="space-y-2 text-xs">
                      <p className="text-white/80">• Upload missing practical evaluations for 3 forklift operators</p>
                      <p className="text-white/80">• Schedule annual evaluation uploads for respiratory protection training</p>
                      <p className="text-white/80">• Prioritize renewal for 3 expired fall protection certifications</p>
                      <p className="text-white/80">• Schedule mandatory safety meeting for Manufacturing team</p>
                      <p className="text-white/80">• Review incident reports from Q4 2024</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Deadlines & Evaluation Reminders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {records.filter(r => r.status === 'pending').map(record => (
                    <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{record.employeeName}</p>
                        <p className="text-sm text-white/70">{record.training}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{record.dueDate}</p>
                        <Badge variant="outline" className="text-xs">
                          Due Soon
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  {/* Training Evaluation Reminders */}
                  <div className="border-t pt-3">
                    <h4 className="text-sm font-semibold mb-3 text-orange-800">Training Evaluation Reminders</h4>
                    {[
                      { employee: "Mark Anderson", training: "Power Industrial Trucks", type: "Practical Evaluation", dueDate: "2025-01-15", priority: "REQUIRED" },
                      { employee: "Jennifer Wong", training: "Fall Protection", type: "Hands-on Assessment", dueDate: "2025-01-20", priority: "REQUIRED" },
                      { employee: "Carlos Rivera", training: "Earth-moving Equipment", type: "Field Evaluation", dueDate: "2025-01-25", priority: "REQUIRED" },
                      { employee: "All Staff", training: "Respiratory Protection", type: "Annual Evaluation Upload", dueDate: "2025-02-01", priority: "RECOMMENDED" },
                      { employee: "Warehouse Team", training: "Material Handling", type: "Yearly Assessment", dueDate: "2025-02-15", priority: "RECOMMENDED" }
                    ].map((reminder, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg mb-2">
                        <div>
                          <p className="font-medium text-orange-900">{reminder.employee}</p>
                          <p className="text-sm text-orange-700">{reminder.training} - {reminder.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-orange-900">{reminder.dueDate}</p>
                          <Badge 
                            variant={reminder.priority === "REQUIRED" ? "destructive" : "outline"} 
                            className="text-xs"
                          >
                            {reminder.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employees" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Employee Certification Records</CardTitle>
                  <div className="flex space-x-2">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="cert-upload"
                      multiple
                    />
                    <Button 
                      variant="outline"
                      onClick={() => document.getElementById('cert-upload')?.click()}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Upload Certificates
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        // Generate CSV data
                        const csvData = records.map(record => ({
                          Employee: record.employeeName,
                          Training: record.training,
                          Status: record.status,
                          'Due Date': record.dueDate,
                          'Completed Date': record.completedDate || 'N/A'
                        }));
                        
                        // Convert to CSV string
                        const headers = Object.keys(csvData[0]).join(',');
                        const rows = csvData.map(row => Object.values(row).join(','));
                        const csvContent = [headers, ...rows].join('\n');
                        
                        // Download CSV
                        const blob = new Blob([csvContent], { type: 'text/csv' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `employee-certifications-${new Date().toISOString().split('T')[0]}.csv`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Employee
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {records.map(record => (
                    <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-blue-50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-800/30 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {record.employeeName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{record.employeeName}</p>
                          <p className="text-sm text-white/70">{record.training}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">OSHA 10</Badge>
                            <Badge variant="outline" className="text-xs">Safety Training</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-xs text-white/60">Documents</p>
                          <div className="flex space-x-1 mt-1">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <FileText className="w-3 h-3 text-blue-600" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <FileText className="w-3 h-3 text-green-600" />
                            </Button>
                          </div>
                        </div>
                        <Badge className={getStatusColor(record.status)}>
                          {getStatusIcon(record.status)}
                          <span className="ml-1">{record.status.charAt(0).toUpperCase() + record.status.slice(1)}</span>
                        </Badge>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {record.status === 'completed' ? 'Completed' : 'Due'}: {record.completedDate || record.dueDate}
                          </p>
                          <div className="flex space-x-1 mt-2">
                            {record.certificateUrl && (
                              <Button variant="outline" size="sm">
                                <Download className="w-3 h-3 mr-1" />
                                Certificate
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Training Programs & OSHA Requirements</CardTitle>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Training
                  </Button>
                </div>
                <CardDescription>
                  Each training includes the complete OSHA-required syllabus to ensure full compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { 
                      name: "Fall Protection", 
                      enrolled: 15, 
                      completed: 13,
                      duration: "4 hours + demonstration",
                      regulation: "29 CFR 1910.30 / 1926.503",
                      syllabus: [
                        "Introduction to Fall Hazards (leading edges, skylights, scaffolding)",
                        "Incident statistics and real-world case studies",
                        "OSHA Fall Protection Requirements - Review of 1910.30 or 1926.503",
                        "Trigger heights (4', 6', etc.) - Role of the competent person",
                        "Fall Protection Systems Overview (Guardrails, nets, PFAS)",
                        "Anchorage points and connector types",
                        "Using PFAS - Full-body harness components and sizing",
                        "Proper lanyard and lifeline setup",
                        "Inspection and Maintenance - Daily inspection checklists",
                        "Storage and damage recognition",
                        "Hands-On Demonstration - Donning and doffing PPE",
                        "Simulated fall arrest and rescue",
                        "Knowledge Review & Practical Evaluation"
                      ],
                      recertification: "Initial",
                      audience: "Workers using PFAS"
                    },
                    { 
                      name: "HAZWOPER Training", 
                      enrolled: 8, 
                      completed: 6,
                      duration: "8 hours (Annual Refresher)",
                      regulation: "29 CFR 1910.120 / 1926.65",
                      syllabus: [
                        "Regulatory Overview - Scope of 1910.120 / 1926.65",
                        "Roles: General site worker, TSD, emergency responder",
                        "Toxicology & Exposure Limits - Routes of entry, PELs, STELs, IDLH",
                        "Chemical Hazard Recognition - SDS interpretation",
                        "Physical and health hazards",
                        "PPE and Respiratory Protection - Level A-D PPE",
                        "Donning/doffing, fit testing",
                        "Monitoring & Detection - Use of gas meters, colorimetric tubes",
                        "Monitoring strategies",
                        "Decontamination - Zone setup (hot, warm, cold)",
                        "Decon procedures",
                        "Emergency Response - Spill scenarios, Evacuation procedures",
                        "Site Control Plans & Safety Programs",
                        "Health & safety plans, Job hazard analysis",
                        "Hands-On Practical Exercises - Level B suit drill",
                        "Site setup simulation",
                        "Written Test & Certificate Issuance"
                      ],
                      recertification: "Annual",
                      audience: "Hazardous waste workers"
                    },
                    { 
                      name: "Hazard Communication (HazCom)", 
                      enrolled: 24, 
                      completed: 22,
                      duration: "2 hours",
                      regulation: "29 CFR 1910.1200 / 1926.59",
                      syllabus: [
                        "GHS & OSHA Standard Overview",
                        "Label elements, pictograms",
                        "Signal words and precautionary statements",
                        "Safety Data Sheets (SDS) - 16-section format",
                        "How to find key info (hazards, PPE, first aid)",
                        "Chemical Labeling - Primary and secondary containers",
                        "In-house labeling systems",
                        "Employee Rights & Employer Duties",
                        "Access to SDSs",
                        "Reporting exposure or hazards",
                        "Hands-On Practice - SDS interpretation",
                        "Labeling exercise"
                      ],
                      recertification: "Annual",
                      audience: "All employees exposed to chemicals"
                    },
                    { 
                      name: "Hearing Conservation", 
                      enrolled: 18, 
                      completed: 16,
                      duration: "2 hours",
                      regulation: "29 CFR 1910.95",
                      syllabus: [
                        "Noise and Hearing Loss - Anatomy of hearing",
                        "Effects of occupational noise",
                        "Monitoring and Controls - Noise dosimetry",
                        "Engineering vs. administrative controls",
                        "Hearing Protection Devices (HPDs)",
                        "Types: earplugs, earmuffs",
                        "Fitting demonstration",
                        "Audiometric Testing - Baseline, annual tests",
                        "Employee rights"
                      ],
                      recertification: "Annual",
                      audience: ">85 dBA exposure group"
                    },
                    { 
                      name: "Personal Protective Equipment (PPE)", 
                      enrolled: 32, 
                      completed: 30,
                      duration: "2 hours",
                      regulation: "29 CFR 1910.132 / 1926.28",
                      syllabus: [
                        "Hazard Assessment - Workplace walkthrough",
                        "Job safety analysis (JSA)",
                        "PPE Types and Use - Eye, hand, foot, head protection",
                        "Limitations and proper use",
                        "Inspection, Care, and Maintenance",
                        "When to replace",
                        "Cleaning, storage",
                        "Demonstration & Evaluation - Proper donning",
                        "Correct selection scenarios"
                      ],
                      recertification: "Initial/Annual",
                      audience: "All PPE users"
                    },
                    { 
                      name: "First Aid & CPR", 
                      enrolled: 6, 
                      completed: 5,
                      duration: "6-8 hours",
                      regulation: "29 CFR 1926.23 / 1910.151",
                      syllabus: [
                        "Medical Response Basics - Scene safety",
                        "Universal precautions",
                        "CPR & AED - Adult compression-only CPR",
                        "AED use scenarios",
                        "First Aid Techniques - Wounds, burns, fractures",
                        "Heat/cold emergencies",
                        "Documentation & Reporting - OSHA injury logs",
                        "Emergency services interface"
                      ],
                      recertification: "Biennial",
                      audience: "Site responders"
                    },
                    { 
                      name: "Lockout/Tagout (LOTO)", 
                      enrolled: 10, 
                      completed: 8,
                      duration: "3 hours",
                      regulation: "29 CFR 1910.147",
                      syllabus: [
                        "Energy Control Program Development",
                        "Hazardous Energy Source Identification",
                        "Lockout/Tagout Device Requirements",
                        "Energy Isolation Procedures",
                        "Authorized vs. Affected Employee Training",
                        "Group Lockout Procedures",
                        "Shift or Personnel Changes",
                        "Periodic Inspection Requirements",
                        "Outside Personnel Coordination"
                      ],
                      recertification: "Initial",
                      audience: "Maintenance, authorized employees"
                    },
                    { 
                      name: "Respiratory Protection", 
                      enrolled: 12, 
                      completed: 10,
                      duration: "2 hours + fit testing",
                      regulation: "29 CFR 1910.134",
                      syllabus: [
                        "Respiratory Hazard Assessment",
                        "Medical Evaluation Requirements",
                        "Fit Testing Procedures and Requirements",
                        "Respirator Selection Criteria",
                        "Proper Use and Maintenance Procedures",
                        "Cleaning, Disinfecting, and Storage",
                        "Training and Program Evaluation",
                        "Emergency Use Procedures",
                        "Voluntary Use Guidelines"
                      ],
                      recertification: "Annual",
                      audience: "Respirator users"
                    },
                    { 
                      name: "Power Industrial Trucks", 
                      enrolled: 8, 
                      completed: 6,
                      duration: "4 hours + practical evaluation",
                      regulation: "29 CFR 1910.178",
                      syllabus: [
                        "Power Industrial Truck Types and Classifications",
                        "Vehicle Inspection Requirements (daily, weekly, annual)",
                        "Load Capacity and Stability Principles",
                        "Operating Procedures and Controls",
                        "Hazard Recognition and Avoidance",
                        "Fueling and Charging Safety",
                        "Maintenance Requirements and Procedures",
                        "Hands-on Vehicle Operation Training",
                        "Written and Practical Evaluation"
                      ],
                      recertification: "3-Year",
                      audience: "Forklift and PIT operators"
                    },
                    { 
                      name: "Material Handling Equipment", 
                      enrolled: 12, 
                      completed: 10,
                      duration: "3 hours + demonstration",
                      regulation: "29 CFR 1910.176 / 1926.602",
                      syllabus: [
                        "Manual Material Handling Techniques",
                        "Mechanical Lifting Aids and Equipment",
                        "Conveyor Systems and Safety",
                        "Equipment Inspection and Maintenance",
                        "Load Securing and Storage Practices",
                        "Ergonomic Principles and Injury Prevention",
                        "Hazard Recognition in Material Handling",
                        "Safe Lifting Demonstration",
                        "Equipment Operation Training"
                      ],
                      recertification: "Annual",
                      audience: "Equipment operators, warehouse staff"
                    },
                    { 
                      name: "Earth-moving Equipment", 
                      enrolled: 5, 
                      completed: 4,
                      duration: "6 hours + field demonstration",
                      regulation: "29 CFR 1926.602",
                      syllabus: [
                        "Earth-moving Equipment Types and Applications",
                        "Pre-operation Inspection Procedures",
                        "Equipment Controls and Operating Systems",
                        "Stability Factors and Safe Operating Practices",
                        "Underground Utility Location and Protection",
                        "Spotting and Communication Procedures",
                        "Emergency Procedures and Equipment Shutdown",
                        "Site-specific Hazard Recognition",
                        "Hands-on Field Demonstration and Evaluation"
                      ],
                      recertification: "3-Year",
                      audience: "Heavy equipment operators"
                    }
                  ].map((training, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-medium text-lg mb-2">{training.name}</h3>
                            <div className="flex flex-wrap gap-4 text-sm text-white/70 mb-3">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {training.duration}
                              </span>
                              <span className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                {training.regulation}
                              </span>
                              <span className="flex items-center gap-1">
                                <RefreshCw className="w-3 h-3" />
                                Recert: {training.recertification}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {training.audience}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-white mb-1">
                              {training.completed}/{training.enrolled}
                            </div>
                            <div className="text-sm text-white/70">Completed</div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <Progress value={(training.completed / training.enrolled) * 100} className="h-2" />
                        </div>

                        <div className="border-t pt-4">
                          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-blue-600" />
                            OSHA Required Syllabus Content
                          </h4>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                            {training.syllabus.map((item, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-white/80">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4 pt-4 border-t">
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-3 h-3 mr-1" />
                            Syllabus PDF
                          </Button>
                          <Button size="sm">
                            <Users className="w-3 h-3 mr-1" />
                            Assign Training
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Annual Training Calendar - Based on OSHA Template */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Annual Training Calendar (OSHA Compliant Schedule)
                </CardTitle>
                <CardDescription>
                  Comprehensive training schedule for systematic compliance management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {[
                    { month: "January", training: "Hazard Communication (1910.1200)", audience: "All employees exposed to chemicals", type: "Annual", duration: "2 hrs" },
                    { month: "February", training: "PPE (1910.132)", audience: "All PPE users", type: "Initial/Annual", duration: "2 hrs" },
                    { month: "March", training: "Fall Protection (1910.30 / 1926.503)", audience: "Workers using PFAS", type: "Initial", duration: "4 hrs + demo" },
                    { month: "April", training: "First Aid & CPR", audience: "Site responders", type: "Biennial", duration: "6-8 hrs" },
                    { month: "May", training: "Lockout/Tagout (1910.147)", audience: "Maintenance, authorized employees", type: "Initial", duration: "3 hrs" },
                    { month: "June", training: "Respiratory Protection (1910.134)", audience: "Respirator users", type: "Annual", duration: "2 hrs + fit" },
                    { month: "July", training: "HAZWOPER Refresher (1910.120)", audience: "Hazardous waste workers", type: "Annual", duration: "8 hrs" },
                    { month: "August", training: "Hearing Conservation (1910.95)", audience: ">85 dBA exposure group", type: "Annual", duration: "2 hrs" },
                    { month: "September", training: "Power Industrial Trucks (1910.178) + Evaluation", audience: "Forklift and PIT operators", type: "3-Year", duration: "4 hrs + practical" },
                    { month: "October", training: "Material Handling Equipment (1910.176/1926.602) + Evaluation", audience: "Equipment operators, warehouse staff", type: "Annual", duration: "3 hrs + demo" },
                    { month: "November", training: "Earth-moving Equipment (1926.602) + Evaluation", audience: "Heavy equipment operators", type: "3-Year", duration: "6 hrs + field demo" },
                    { month: "December", training: "Annual Evaluation Upload Reminder", audience: "All employees with practical training", type: "Yearly", duration: "Document upload" }
                  ].map((item, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-medium text-blue-900">{item.month}</h4>
                          <Badge variant="outline" className="text-xs">
                            {item.type}
                          </Badge>
                        </div>
                        <h5 className="font-medium text-sm mb-2 text-blue-800">
                          {item.training}
                        </h5>
                        <div className="space-y-1 text-xs text-blue-500">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{item.audience}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{item.duration}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="w-full mt-3">
                          Schedule Training
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-2">OSHA Compliance Training</h4>
                      <p className="text-sm text-blue-800">
                        Comprehensive training calendar with expanded modules, hands-on training, 
                        written/practical evaluations, and built-in assessment records to exceed 
                        minimum compliance standards.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-900 mb-2">Training Evaluation Storage Requirements</h4>
                      <p className="text-sm text-amber-800 mb-3">
                        Training evaluations must be stored with training documents, especially when OSHA standards require evaluations (such as for Forklift Operators under 29 CFR 1910.178).
                      </p>
                      <div className="space-y-2 text-sm text-amber-800">
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2"></div>
                          <span><strong>Required for:</strong> Power Industrial Trucks, Fall Protection, Earth-moving Equipment, and other practical skill-based training</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2"></div>
                          <span><strong>Best Practice:</strong> Upload new evaluations yearly, even when not required, to maintain comprehensive training records</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2"></div>
                          <span><strong>Storage:</strong> Keep evaluations with corresponding training certificates for easy audit access</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locations" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Multi-Location Management
                  </CardTitle>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Location
                  </Button>
                </div>
                <CardDescription>
                  Manage compliance across multiple facilities and locations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      name: "Headquarters",
                      address: "123 Main St, New York, NY",
                      employees: 45,
                      compliance: 92,
                      manager: "John Smith",
                      status: "active"
                    },
                    {
                      name: "Manufacturing Plant",
                      address: "456 Industrial Blvd, Detroit, MI",
                      employees: 128,
                      compliance: 87,
                      manager: "Sarah Johnson",
                      status: "active"
                    },
                    {
                      name: "Warehouse East",
                      address: "789 Logistics Dr, Atlanta, GA",
                      employees: 32,
                      compliance: 95,
                      manager: "Mike Wilson",
                      status: "active"
                    }
                  ].map((location, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-medium text-lg">{location.name}</h3>
                            <div className="flex items-center text-sm text-blue-500 mt-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              {location.address}
                            </div>
                          </div>
                          <Badge 
                            className={location.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-700'}
                          >
                            {location.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-blue-500">Employees</span>
                            <span className="font-medium">{location.employees}</span>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm text-blue-500">Compliance Score</span>
                              <span className="font-medium">{location.compliance}%</span>
                            </div>
                            <Progress value={location.compliance} className="h-2" />
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-sm text-blue-500">Manager</span>
                            <span className="font-medium">{location.manager}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* Location Analytics */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Cross-Location Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">3</p>
                        <p className="text-sm text-blue-500">Total Locations</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">205</p>
                        <p className="text-sm text-blue-500">Total Employees</p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <p className="text-2xl font-bold text-orange-600">91%</p>
                        <p className="text-sm text-blue-500">Avg Compliance</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">12</p>
                        <p className="text-sm text-blue-500">Pending Items</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Compliance Reports
                </CardTitle>
                <CardDescription>
                  Generate and download audit-ready compliance reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Monthly Compliance Report</h3>
                      <p className="text-sm text-blue-500 mb-4">
                        Comprehensive overview of all training and certifications
                      </p>
                      <Button className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Employee Training Summary</h3>
                      <p className="text-sm text-blue-500 mb-4">
                        Individual employee training records and certificates
                      </p>
                      <Button variant="outline" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Export Data
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Audit Preparation</h3>
                      <p className="text-sm text-blue-500 mb-4">
                        Complete documentation package for OSHA audits
                      </p>
                      <Button variant="outline" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Prepare Audit
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Custom Report</h3>
                      <p className="text-sm text-blue-500 mb-4">
                        Build custom reports with specific criteria
                      </p>
                      <Button variant="outline" className="w-full">
                        <Search className="w-4 h-4 mr-2" />
                        Create Custom
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generator" className="space-y-6">
            <ComplianceReportGenerator />
          </TabsContent>

          <TabsContent value="collaboration" className="space-y-6">
            <CollaborationLayer
              documentId="safety-review-2025"
              teamMembers={[
                {
                  id: '1',
                  name: 'Sarah Johnson',
                  role: 'Safety Manager',
                  isOnline: true,
                  avatar: undefined
                },
                {
                  id: '2',
                  name: 'Mike Chen',
                  role: 'Compliance Officer',
                  isOnline: true,
                  avatar: undefined
                },
                {
                  id: '3',
                  name: 'David Wilson',
                  role: 'HR Director',
                  isOnline: false,
                  avatar: undefined,
                  lastSeen: '2 hours ago'
                },
                {
                  id: '4',
                  name: 'Lisa Martinez',
                  role: 'Operations Manager',
                  isOnline: true,
                  avatar: undefined
                },
                {
                  id: '5',
                  name: 'John Smith',
                  role: 'Site Supervisor',
                  isOnline: false,
                  avatar: undefined,
                  lastSeen: '1 day ago'
                }
              ]}
              onAnnotationAdd={(annotation) => {
                console.log('New annotation added:', annotation);
              }}
              onAnnotationUpdate={(annotation) => {
                console.log('Annotation updated:', annotation);
              }}
              onAnnotationDelete={(annotationId) => {
                console.log('Annotation deleted:', annotationId);
              }}
            />
          </TabsContent>

          <TabsContent value="branding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Custom Branding Settings
                </CardTitle>
                <CardDescription>
                  Customize your SafetySync.AI platform with your company branding
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Logo Upload */}
                <div className="space-y-4">
                  <h3 className="font-medium">Company Logo</h3>
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 bg-blue-100 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Palette className="w-8 h-8 text-white mx-auto mb-2" />
                        <p className="text-xs text-blue-400">Current Logo</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.svg"
                        className="hidden"
                        id="logo-upload"
                      />
                      <Button 
                        variant="outline"
                        onClick={() => document.getElementById('logo-upload')?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Logo
                      </Button>
                      <p className="text-xs text-blue-400">PNG, JPG, SVG up to 2MB</p>
                    </div>
                  </div>
                </div>

                {/* Color Scheme */}
                <div className="space-y-4">
                  <h3 className="font-medium">Color Scheme</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Primary Color</label>
                      <div className="flex items-center space-x-2">
                        <input type="color" defaultValue="#2563eb" className="w-8 h-8 rounded border" />
                        <input type="text" defaultValue="#2563eb" className="flex-1 px-3 py-2 border rounded text-sm" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Secondary Color</label>
                      <div className="flex items-center space-x-2">
                        <input type="color" defaultValue="#10b981" className="w-8 h-8 rounded border" />
                        <input type="text" defaultValue="#10b981" className="flex-1 px-3 py-2 border rounded text-sm" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Accent Color</label>
                      <div className="flex items-center space-x-2">
                        <input type="color" defaultValue="#f59e0b" className="w-8 h-8 rounded border" />
                        <input type="text" defaultValue="#f59e0b" className="flex-1 px-3 py-2 border rounded text-sm" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Text Color</label>
                      <div className="flex items-center space-x-2">
                        <input type="color" defaultValue="#374151" className="w-8 h-8 rounded border" />
                        <input type="text" defaultValue="#374151" className="flex-1 px-3 py-2 border rounded text-sm" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Information */}
                <div className="space-y-4">
                  <h3 className="font-medium">Company Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company Name</label>
                      <input type="text" placeholder="Your Company Name" className="w-full px-3 py-2 border rounded" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company URL</label>
                      <input type="url" placeholder="https://yourcompany.com" className="w-full px-3 py-2 border rounded" />
                    </div>
                  </div>
                </div>

                {/* Email Templates */}
                <div className="space-y-4">
                  <h3 className="font-medium">Email Branding</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Use custom email signature</label>
                      <Switch defaultChecked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Include company logo in emails</label>
                      <Switch defaultChecked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Brand notification emails</label>
                      <Switch defaultChecked={false} />
                    </div>
                  </div>
                </div>

                {/* Report Branding */}
                <div className="space-y-4">
                  <h3 className="font-medium">Report Customization</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Add company header to reports</label>
                      <Switch defaultChecked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Include company logo on reports</label>
                      <Switch defaultChecked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Custom report footer</label>
                      <Switch defaultChecked={false} />
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="border-t pt-6">
                  <h3 className="font-medium mb-4">Preview</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="bg-blue-900 border rounded-lg p-4 max-w-md mx-auto">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                          <span className="text-white text-sm font-bold">YC</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Your Company</h4>
                          <p className="text-sm text-blue-500">SafetySync.AI Platform</p>
                        </div>
                      </div>
                      <p className="text-sm text-blue-600">This is how your branded interface will look to users.</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset to Default
                  </Button>
                  <Button>Save Branding Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit-settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Automated Audit Review Settings
                </CardTitle>
                <CardDescription>
                  Configure automated monthly compliance gap analysis and reporting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-blue-900">Monthly Audit Review</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Automated analysis of your compliance data to identify gaps and generate improvement recommendations
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-blue-700">Enable</span>
                    <Switch defaultChecked={true} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Review Schedule</label>
                    <select className="px-3 py-2 border rounded-md">
                      <option>1st of every month</option>
                      <option>15th of every month</option>
                      <option>Last day of every month</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Report Format</label>
                    <select className="px-3 py-2 border rounded-md">
                      <option>PDF Report</option>
                      <option>Email Summary</option>
                      <option>Both PDF and Email</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Notification Recipients</label>
                    <input 
                      type="email" 
                      placeholder="admin@company.com"
                      className="px-3 py-2 border rounded-md w-64"
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Review Scope</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <label className="text-sm">Training completion gaps</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <label className="text-sm">Expiring certifications</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <label className="text-sm">Compliance score trends</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <label className="text-sm">Risk assessment updates</label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline">Preview Sample Report</Button>
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certificate & Card Services */}
          <TabsContent value="certificates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Certificate & Card Services
                </CardTitle>
                <CardDescription>
                  Generate professional certificates and digital wallet cards for completed training
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Certificate Generation */}
                  <Card className="border-2 border-blue-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-blue-600" />
                        Certificate Generation
                      </CardTitle>
                      <CardDescription>Pay-per-use: $5.95 per certificate or digital card</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-900 mb-2">Professional Certificate Features:</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Professional centered layout with employee name prominently displayed</li>
                            <li>• OSHA/ANSI/CFR compliance references (29 CFR 1910.178, EM 385-1-1, etc.)</li>
                            <li>• Contact hours (CEU), completion date, and expiration date</li>
                            <li>• Unique certificate number for verification and audit trails</li>
                            <li>• Instructor credentials and company contact information</li>
                            <li>• High-resolution PDF (300 DPI) ready for professional printing</li>
                          </ul>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Select Employee</label>
                          <select className="w-full p-2 border rounded-md">
                            <option>Mark Anderson - Forklift Operator</option>
                            <option>Jennifer Wong - Safety Coordinator</option>
                            <option>Carlos Rivera - Equipment Technician</option>
                            <option>Sarah Mitchell - Warehouse Supervisor</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Training Completed</label>
                          <select className="w-full p-2 border rounded-md">
                            <option>Power Industrial Trucks (29 CFR 1910.178, EM 385-1-1)</option>
                            <option>Mobile Elevated Work Platforms (29 CFR 1926.453, EM 385-1-1)</option>
                            <option>Material Handling Equipment (29 CFR 1926.602, EM 385-1-1)</option>
                            <option>Earth-moving Equipment (29 CFR 1926.602, EM 385-1-1)</option>
                            <option>Fall Protection (29 CFR 1926.501, EM 385-1-1)</option>
                            <option>HAZWOPER (29 CFR 1910.120)</option>
                            <option>First Aid/CPR</option>
                          </select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Instructor Name</label>
                            <input 
                              type="text" 
                              className="w-full p-2 border rounded-md text-sm" 
                              placeholder="Name, Credentials"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Instructor Position</label>
                            <input 
                              type="text" 
                              className="w-full p-2 border rounded-md text-sm" 
                              placeholder="EH&S Manager"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Company</label>
                          <input 
                            type="text" 
                            className="w-full p-2 border rounded-md text-sm bg-blue-50" 
                            value="ACME Corp"
                            readOnly
                          />
                          <p className="text-xs text-blue-400">Auto-filled from company profile</p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button className="flex-1">
                            <Award className="w-4 h-4 mr-2" />
                            Generate Certificate ($5.95*)
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-blue-400 mt-2">
                          *All certificates: $5.95 each, automatically billed to monthly subscription. No free inclusions. Instructors can add EM 385-1-1 references themselves when generating certificates.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Digital Wallet Card Service */}
                  <Card className="border-2 border-green-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-green-600" />
                        Digital Wallet Cards
                      </CardTitle>
                      <CardDescription>Pay-per-use: $5.95 per certificate or digital card</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-green-900 mb-2">Digital Wallet Card Features:</h4>
                          <ul className="text-sm text-green-800 space-y-1">
                            <li>• Digital-only format for viewing on phones, tablets, computers</li>
                            <li>• Front: Company logo, employee name, primary certification</li>
                            <li>• Back: Specific equipment authorizations (JLG, Genie, CAT, etc.)</li>
                            <li>• Multiple certifications consolidated on one card</li>
                            <li>• OSHA/ANSI/EM 385-1-1 compliance statements</li>
                            <li>• Custom equipment addition capability</li>
                            <li>• Always accessible - never lost or damaged</li>
                          </ul>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Select Employee</label>
                          <select className="w-full p-2 border rounded-md">
                            <option>Mark Anderson - Forklift Operator</option>
                            <option>Jennifer Wong - Safety Coordinator</option>
                            <option>Carlos Rivera - Equipment Technician</option>
                            <option>Sarah Mitchell - Warehouse Supervisor</option>
                          </select>
                        </div>
                        

                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Instructor Name</label>
                            <input 
                              type="text" 
                              className="w-full p-2 border rounded-md text-sm" 
                              placeholder="Name, Credentials"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Instructor Position</label>
                            <input 
                              type="text" 
                              className="w-full p-2 border rounded-md text-sm" 
                              placeholder="EH&S Manager"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Company</label>
                          <input 
                            type="text" 
                            className="w-full p-2 border rounded-md text-sm bg-blue-50" 
                            value="ACME Corp"
                            readOnly
                          />
                          <p className="text-xs text-blue-400">Auto-filled from company profile</p>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Specific Equipment Authorized</label>
                          <div className="grid grid-cols-2 gap-1 max-h-32 overflow-y-auto border rounded p-2">
                            {['JLG 40 AJ', 'JLG 60 AJ', 'JLG 80 AJ', 'Genie Z62/40', 'Genie GTH-636', 'CAT 315 FL Zero Turn Track Excavator', 'CAT TL 642', 'Volvo Excavator ECR88D', '259D3 CAT Skidsteer', 'Sit-down Forklift', 'Stand-up Forklift', 'Reach Truck'].map((equipment) => (
                              <div key={equipment} className="flex items-center space-x-1">
                                <input type="checkbox" id={`card-${equipment}`} className="rounded border-blue-300" />
                                <label htmlFor={`card-${equipment}`} className="text-xs leading-tight">{equipment}</label>
                              </div>
                            ))}
                          </div>
                          <textarea 
                            placeholder="Add custom equipment (one per line)..."
                            className="w-full p-2 border rounded-md text-sm"
                            rows={2}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="multi-card" className="rounded border-blue-300" />
                            <label htmlFor="multi-card" className="text-sm font-medium">Generate additional cards if equipment list exceeds space</label>
                          </div>
                          <p className="text-xs text-blue-400">
                            When checked, equipment will automatically continue on additional digital cards if the list is too long for one card. 
                            Each additional card: $5.95.
                          </p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button className="flex-1">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Generate Digital Wallet Card(s) ($5.95*)
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-blue-400 mt-2">
                          *All digital cards: $5.95 each, automatically billed to monthly subscription. No free inclusions. Instructors can add EM 385-1-1 references themselves when generating cards.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>



                {/* Sample Outputs */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Sample Certificate & Card Outputs
                    </CardTitle>
                    <CardDescription>
                      Examples of professional-quality certificates and digital wallet cards generated by SafetySync.AI
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Certificate Sample */}
                      <div className="space-y-3">
                        <h4 className="font-semibold">Professional Certificate Sample</h4>
                        <div className="border rounded-lg p-6 bg-blue-50 text-center text-sm">
                          <div className="text-lg font-bold mb-4">CERTIFICATE OF COMPLETION</div>
                          <div className="text-xl font-semibold mb-4">Mark Anderson</div>
                          <div className="mb-2">has successfully achieved the certification</div>
                          <div className="text-lg font-bold mb-4">POWER INDUSTRIAL TRUCKS OPERATOR</div>
                          <div className="text-sm mb-2">MEETS AND EXCEEDS OSHA 29 CFR 1910.178</div>
                          <div className="flex justify-between text-xs mt-6">
                            <div>
                              <div>CEU: 3.2</div>
                              <div>Contact Hours: 32</div>
                              <div>Completion Date: January 06, 2025</div>
                              <div>Expiration Date: January 06, 2027</div>
                            </div>
                            <div>
                              <div>Certificate: 10015987</div>
                              <div>Instructor: Safety Team</div>
                              <div>SafetySync.AI Verified</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Wallet Card Sample */}
                      <div className="space-y-3">
                        <h4 className="font-semibold">Professional Wallet Card Sample</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {/* Front of Card */}
                          <div className="border rounded-lg p-4 bg-blue-900 text-xs aspect-[3.375/2.125]">
                            <div className="font-bold text-lg mb-2">COMPANY LOGO</div>
                            <div className="text-sm mb-1">Safety Training Certification Card</div>
                            <div className="font-bold text-lg mt-3">Mark Anderson</div>
                            <div className="text-xs mt-2">
                              has successfully completed Power Industrial Trucks Training in compliance with OSHA 29 CFR 1910.178, ANSI Z359, and EM 385 1-1
                            </div>
                          </div>
                          
                          {/* Back of Card */}
                          <div className="border rounded-lg p-4 bg-blue-900 text-xs aspect-[3.375/2.125]">
                            <div className="text-xs mb-2">Training compliant with OSHA for MEWPs 1926.453, ANSI A92, PIT 1910.178, and MHE 1926.602, and is authorized to operate the following equipment:</div>
                            <div className="space-y-1 text-xs">
                              <div>• Power Industrial Trucks</div>
                              <div>• Material Handling Equipment</div>
                              <div>• Mobile Elevated Work Platforms</div>
                            </div>
                            <div className="mt-3 text-xs">
                              <div>Training Conducted: 01/06/2025</div>
                              <div>Training Expires: 01/06/2027</div>
                              <div>Instructor: Safety Team, CHST</div>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-blue-400 text-center">
                          CR80 Format (3.375" x 2.125") - Optimized for 30mil PVC Cards
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Order History */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Recent Orders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { date: "2025-01-05", type: "Certificate", employee: "Mark Anderson", training: "Power Industrial Trucks", status: "Completed", cost: "$15" },
                        { date: "2025-01-04", type: "Wallet Card", employee: "Jennifer Wong", training: "Fall Protection", status: "Processing", cost: "$8" },
                        { date: "2025-01-03", type: "Bulk Order", employee: "5 Employees", training: "HAZWOPER Certification", status: "Completed", cost: "$97.50" },
                        { date: "2025-01-02", type: "Certificate", employee: "Carlos Rivera", training: "First Aid/CPR", status: "Completed", cost: "$15" }
                      ].map((order, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${order.status === 'Completed' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                            <div>
                              <div className="font-medium">{order.type} - {order.employee}</div>
                              <div className="text-sm text-blue-500">{order.training}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{order.cost}</div>
                            <div className="text-sm text-blue-500">{order.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="safety-trends" className="space-y-6">
            <Card className="bg-blue-900/5 border-violet-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Activity className="w-5 h-5 text-blue-400" />
                  Interactive Safety Trends Dashboard
                </CardTitle>
                <CardDescription className="text-white">
                  Real-time safety analytics with predictive intelligence and animated trend visualizations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4">
                  <Link href="/safety-trends">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Launch Safety Trends Dashboard
                    </Button>
                  </Link>
                  <p className="text-sm text-white mt-3 text-center">
                    Access comprehensive safety trend analysis, real-time metrics, and AI-powered insights
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
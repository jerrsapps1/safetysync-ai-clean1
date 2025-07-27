import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { SafetySyncIcon } from '@/components/ui/safetysync-icon';
import ClientOnboardingTutorial from '@/components/ClientOnboardingTutorial';
import {
  Home,
  LogIn,
  LogOut,
  Star,
  Gift,
  Rocket,
  Code,
  MessageCircle,
  ThumbsUp,
  Calendar,
  Bell,
  Settings,
  User,
  ArrowRight,
  Sparkles,
  Zap,
  Heart,
  Send,
  Eye,
  EyeOff,
  TrendingUp,
  BookOpen,
  Play,
  X,
  CheckCircle,
  Shield,
  Clock,
  DollarSign,
  Users,
  FileText,
  Award,
  BarChart3
} from 'lucide-react';

interface Special {
  id: number;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  badge: string;
  category: string;
}

interface FeatureUpdate {
  id: number;
  title: string;
  description: string;
  releaseDate: string;
  status: 'released' | 'coming-soon';
  category: string;
}

interface UpcomingSoftware {
  id: number;
  title: string;
  description: string;
  expectedRelease: string;
  votes: number;
  category: string;
  userVoted: boolean;
}

interface Comment {
  id: number;
  user: string;
  text: string;
  timestamp: string;
  likes: number;
  userLiked: boolean;
}

export default function ClientPortal() {
  const [activeTab, setActiveTab] = useState<'specials' | 'updates' | 'upcoming' | 'feedback'>('specials');
  const [newComment, setNewComment] = useState('');
  const [showOnboardingTutorial, setShowOnboardingTutorial] = useState(false);
  const [completedOnboardingSteps, setCompletedOnboardingSteps] = useState<number[]>([]);
  const [userName, setUserName] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPopupPassword, setShowPopupPassword] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [forceShowLogin, setForceShowLogin] = useState(false);
  const [showBusinessImpactDialog, setShowBusinessImpactDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<Special | null>(null);
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  // Initialize authentication state and load onboarding progress
  useEffect(() => {
    // Only force login if not already authenticated and not loading
    if (!isLoading && !isAuthenticated) {
      setForceShowLogin(true);
    } else if (!isLoading && isAuthenticated) {
      setForceShowLogin(false);
    }
    
    // Load completed onboarding steps
    const savedSteps = localStorage.getItem('completedOnboardingSteps');
    if (savedSteps) {
      try {
        setCompletedOnboardingSteps(JSON.parse(savedSteps));
      } catch (e) {
        console.error('Failed to parse saved onboarding steps:', e);
      }
    }
  }, [isAuthenticated, isLoading]);

  const handleSuccessfulLogin = async (username: string, password: string, remember: boolean = false) => {
    setIsAuthenticating(true);
    try {
      const result = await login(username, password, remember);
      if (result.success) {
        setForceShowLogin(false);
        toast({
          title: "Welcome Back!",
          description: remember ? "You will stay logged in" : "You have been successfully logged in",
          variant: "default"
        });
        // Redirect to workspace after successful login
        setTimeout(() => {
          window.location.href = '/workspace';
        }, 1000);
      } else {
        toast({
          title: "Login Failed",
          description: result.message || "Invalid username or password",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log in. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Sample data - in production, this would come from your API
  const specials: Special[] = [
    {
      id: 1,
      title: "Multi-Location Expansion Package",
      description: "Add up to 5 additional locations to your current plan at 40% off regular pricing. Perfect for growing businesses.",
      discount: "40% OFF",
      validUntil: "2025-01-31",
      badge: "Limited Time",
      category: "expansion"
    },
    {
      id: 2,
      title: "Advanced Analytics Add-on",
      description: "Unlock predictive safety analytics, custom dashboards, and executive reporting features.",
      discount: "$99/month",
      validUntil: "2025-02-15",
      badge: "Popular",
      category: "analytics"
    },
    {
      id: 3,
      title: "HRIS Integration Bundle",
      description: "Connect with ADP, BambooHR, Workday, and 15+ other HR systems. Includes setup and support.",
      discount: "50% OFF Setup",
      validUntil: "2025-01-20",
      badge: "New",
      category: "integration"
    }
  ];

  const featureUpdates: FeatureUpdate[] = [
    {
      id: 1,
      title: "AI-Powered Risk Assessment",
      description: "New machine learning algorithms analyze your safety data to predict potential incidents before they occur.",
      releaseDate: "2025-01-15",
      status: "released",
      category: "ai"
    },
    {
      id: 2,
      title: "Mobile App for Field Workers",
      description: "Native iOS and Android apps for real-time safety data entry and certificate access in the field.",
      releaseDate: "2025-02-01",
      status: "coming-soon",
      category: "mobile"
    },
    {
      id: 3,
      title: "Enhanced Reporting Engine",
      description: "New drag-and-drop report builder with 50+ templates and automated email delivery.",
      releaseDate: "2025-01-08",
      status: "released",
      category: "reporting"
    }
  ];

  const upcomingSoftware: UpcomingSoftware[] = [
    {
      id: 1,
      title: "SafetySync Fleet Management",
      description: "Comprehensive vehicle safety tracking, driver certification management, and DOT compliance automation.",
      expectedRelease: "Q2 2025",
      votes: 247,
      category: "fleet",
      userVoted: false
    },
    {
      id: 2,
      title: "SafetySync Environmental Monitoring",
      description: "Real-time air quality monitoring, chemical exposure tracking, and environmental compliance management.",
      expectedRelease: "Q3 2025",
      votes: 189,
      category: "environmental",
      userVoted: true
    },
    {
      id: 3,
      title: "SafetySync Construction Site Manager",
      description: "Specialized tools for construction safety, equipment tracking, and subcontractor management.",
      expectedRelease: "Q4 2025",
      votes: 156,
      category: "construction",
      userVoted: false
    }
  ];

  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      user: "Sarah M.",
      text: "Love the idea of fleet management integration! We manage 50+ vehicles and this would be a game-changer.",
      timestamp: "2025-01-10",
      likes: 12,
      userLiked: false
    },
    {
      id: 2,
      user: "Mike R.",
      text: "The mobile app can't come soon enough. Our field teams are constantly asking for this.",
      timestamp: "2025-01-09",
      likes: 8,
      userLiked: true
    }
  ]);

  const handleSubmitComment = () => {
    if (!newComment.trim() || !userName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your name and comment",
        variant: "destructive"
      });
      return;
    }

    const comment: Comment = {
      id: comments.length + 1,
      user: userName,
      text: newComment,
      timestamp: new Date().toISOString().split('T')[0],
      likes: 0,
      userLiked: false
    };

    setComments([comment, ...comments]);
    setNewComment('');
    toast({
      title: "Comment Posted",
      description: "Thank you for your feedback!",
      variant: "default"
    });
  };

  const handleVote = (softwareId: number) => {
    toast({
      title: "Vote Recorded",
      description: "Thanks for helping us prioritize development!",
      variant: "default"
    });
  };

  const handleLike = (commentId: number) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.userLiked ? comment.likes - 1 : comment.likes + 1, userLiked: !comment.userLiked }
        : comment
    ));
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsAuthenticating(true);
    
    try {
      const result = await login(loginUsername, loginPassword, rememberMe);
      if (result.success) {
        setForceShowLogin(false);
        setLoginUsername('');
        setLoginPassword('');
        
        toast({
          title: "Welcome Back!",
          description: rememberMe ? "You will stay logged in" : "You have been successfully signed in",
          duration: 3000,
        });
      } else {
        toast({
          title: "Sign In Failed",
          description: result.message || "Please check your credentials and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Sign In Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
      variant: "default"
    });
    // Force page reload to clear any remaining state
    window.location.reload();
  };

  const handleLearnMore = (special: Special) => {
    setSelectedService(special);
    setShowBusinessImpactDialog(true);
  };

  const getBusinessImpactContent = (special: Special) => {
    switch (special.id) {
      case 1: // AI Training Document Processing
        return {
          benefits: [
            "Reduce document processing time from hours to minutes with 95% accuracy",
            "Eliminate manual data entry errors that cost $3,000+ per mistake",
            "Process 10x more training documents with same staff resources",
            "Automatic OSHA compliance validation prevents costly violations"
          ],
          roi: "Save 15+ hours weekly on administrative tasks = $780/week cost reduction",
          industries: "Perfect for construction, manufacturing, healthcare, and logistics companies",
          implementation: "Ready in 24 hours - upload existing documents and see immediate AI processing results"
        };
      case 2: // Digital Certificate System
        return {
          benefits: [
            "Eliminate lost paper certificates costing $50-200 per replacement",
            "Instant verification via QR codes reduces audit preparation time by 75%",
            "Mobile access means workers always have current certifications on-site",
            "Automatic expiration alerts prevent compliance gaps and fines"
          ],
          roi: "Prevent $5,000+ OSHA violations and reduce certificate management costs by 80%",
          industries: "Essential for any business with equipment operators, safety personnel, or skilled trades",
          implementation: "Generate first digital certificates in minutes - works with existing training records"
        };
      case 3: // Compliance Automation Suite
        return {
          benefits: [
            "Automate 90% of compliance reporting tasks saving 20+ hours monthly",
            "Real-time tracking prevents missed training deadlines and violations",
            "AI-powered risk assessment identifies problems before they become costly",
            "One-click audit reports impress inspectors and reduce citation risk"
          ],
          roi: "Avoid $10,000+ in OSHA fines while reducing compliance staff workload by 60%",
          industries: "Critical for high-risk industries: construction, oil & gas, chemical, heavy manufacturing",
          implementation: "Full automation setup within 48 hours with dedicated implementation specialist"
        };
      default:
        return {
          benefits: ["Streamline safety operations", "Reduce compliance risks", "Save time and money"],
          roi: "Significant cost savings and efficiency improvements",
          industries: "All industries with safety compliance requirements",
          implementation: "Quick setup with expert guidance"
        };
    }
  };

  // Debug logging
  console.log('Client Portal - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated, 'user:', user, 'forceShowLogin:', forceShowLogin);

  const handleWorkspaceAccess = () => {
    // Always show the popup for workspace access - regardless of current auth state
    // This ensures users see the client portal interface, not the login form
    setShowAuthPopup(true);
  };

  const handlePopupAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    
    try {
      const result = await login(loginUsername, loginPassword);
      if (result.success) {
        setShowAuthPopup(false);
        setLoginUsername('');
        setLoginPassword('');
        
        // Navigate to workspace after successful authentication
        setTimeout(() => {
          window.location.replace('/workspace');
        }, 500);
        
        toast({
          title: "Authentication Successful",
          description: "Welcome to your workspace!",
          duration: 3000,
        });
      } else {
        toast({
          title: "Authentication Failed",
          description: result.message || "Please check your credentials and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center">
        <div className="text-center">
          <SafetySyncIcon size={64} className="mx-auto mb-4 animate-pulse" />
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Show client portal with sign-in form in top right corner

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.2),transparent_50%)]" />
      
      {/* Tech Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Header */}
      <header className="relative z-10 bg-black/40 backdrop-blur-sm border-b border-violet-500/30">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          {/* Mobile Header - Stack vertically */}
          <div className="md:hidden">
            {/* Top row with logo and home button */}
            <div className="flex justify-between items-center h-14 border-b border-blue-400/30">
              <div className="flex items-center min-w-0 flex-1">
                <SafetySyncIcon size={28} className="mr-2 flex-shrink-0" />
                <span className="text-base font-bold text-white truncate">SafetySync.AI Client Portal</span>
              </div>
              <Button 
                onClick={() => window.location.href = '/'}
                variant="ghost"
                size="sm"
                className="text-blue-100 hover:text-blue-200 hover:bg-blue-600/50 px-2"
              >
                <Home className="w-4 h-4" />
              </Button>
            </div>
            {/* Bottom row with login form */}
            {(!isAuthenticated || forceShowLogin) && (
              <div className="py-3">
                <form onSubmit={handleLogin} className="flex items-center justify-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Username"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="w-24 h-8 text-xs bg-blue-900/60 border-violet-500/30 text-white placeholder-blue-300 focus:border-blue-400 focus:ring-blue-400/50"
                    disabled={isAuthenticating}
                    autoComplete="username"
                  />
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-24 h-8 text-xs bg-blue-900/60 border-violet-500/30 text-white placeholder-blue-300 pr-6 focus:border-blue-400 focus:ring-blue-400/50"
                      disabled={isAuthenticating}
                      autoComplete="current-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 p-1 text-blue-100 hover:text-blue-200 h-6 w-6"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isAuthenticating}
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </Button>
                  </div>
                  <Button
                    type="submit"
                    disabled={isAuthenticating || !loginUsername.trim() || !loginPassword.trim()}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 text-xs px-3 h-8"
                  >
                    {isAuthenticating ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                    ) : "Sign In"}
                  </Button>
                </form>
                <div className="flex items-center justify-center space-x-2 text-xs mt-2">
                  <input
                    id="remember-me-mobile"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3 w-3 rounded border-violet-500/30 bg-blue-900/60 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="remember-me-mobile" className="text-white cursor-pointer">
                    Remember me
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Header - Single row */}
          <div className="hidden md:flex justify-between items-center h-20">
            <div className="flex items-center min-w-0 flex-1">
              <SafetySyncIcon size={32} className="mr-3 flex-shrink-0" />
              <span className="text-xl font-bold text-white truncate">SafetySync.AI Client Portal</span>
            </div>
            <div className="flex items-center space-x-4 flex-shrink-0">
              <Button 
                onClick={() => window.location.href = '/'}
                variant="ghost"
                size="sm"
                className="text-blue-100 hover:text-blue-200 hover:bg-blue-600/50 px-2 md:px-3"
              >
                <Home className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Home</span>
              </Button>
              {(!isAuthenticated || forceShowLogin) ? (
                <div className="space-y-2">
                  <form onSubmit={handleLogin} className="flex items-center space-x-1 md:space-x-2">
                    <Input
                      type="text"
                      placeholder="Username"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      className="w-28 md:w-40 h-8 text-sm bg-blue-900/60 border-violet-500/30 text-white placeholder-blue-300 focus:border-blue-400 focus:ring-blue-400/50"
                      disabled={isAuthenticating}
                      autoComplete="username"
                    />
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-28 md:w-40 h-8 text-sm bg-blue-900/60 border-violet-500/30 text-white placeholder-blue-300 pr-8 focus:border-blue-400 focus:ring-blue-400/50"
                        disabled={isAuthenticating}
                        autoComplete="current-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 text-blue-100 hover:text-blue-200 h-6 w-6"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isAuthenticating}
                      >
                        {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </Button>
                    </div>
                    <Button
                      type="submit"
                      disabled={isAuthenticating || !loginUsername.trim() || !loginPassword.trim()}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 min-w-[70px]"
                    >
                      {isAuthenticating ? (
                        <div className="flex items-center space-x-1">
                          <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                        </div>
                      ) : "Sign In"}
                    </Button>
                  </form>
                  <div className="flex items-center space-x-2 text-sm">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-3 w-3 rounded border-violet-500/30 bg-blue-900/60 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="remember-me" className="text-white cursor-pointer">
                      Remember me
                    </label>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  {/* Account Status Alert in Header */}
                  <div className="flex items-center space-x-3 p-2 bg-violet-500/20 rounded-lg border border-violet-500/30">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
                      <div className="text-emerald-300 text-sm font-medium">
                        Active • {user?.userTier}
                      </div>
                    </div>
                  </div>
                  
                  <span className="text-white text-sm">Welcome, {user?.name}</span>
                  <Button 
                    onClick={() => setShowOnboardingTutorial(true)}
                    variant="ghost"
                    className="text-white hover:text-blue-200 hover:bg-blue-700/50"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Setup Guide
                  </Button>
                  <Button 
                    onClick={() => {
                      // Direct navigation since user is already authenticated
                      window.location.href = '/workspace';
                    }}
                    variant="ghost"
                    className="text-emerald-300 hover:text-emerald-200 hover:bg-emerald-700/50"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Access Workspace
                  </Button>
                  <Button 
                    onClick={handleLogout}
                    variant="ghost"
                    className="text-red-300 hover:text-red-200 hover:bg-red-700/50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Client Portal
            </h1>
            <p className="text-xl text-white mb-6">
              {(!isAuthenticated || forceShowLogin)
                ? "Sign in using the form in the top right corner to access your workspace and manage your safety compliance."
                : `Welcome back, ${user?.name}! Access your workspace and explore our client features below.`
              }
            </p>
            
            {/* Access Workspace Button for Unauthenticated Users */}
            {(!isAuthenticated || forceShowLogin) && (
              <div className="mb-8">
                <Button 
                  onClick={handleWorkspaceAccess}
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg font-semibold"
                >
                  <Settings className="w-5 h-5 mr-2" />
                  Access Client Workspace
                </Button>
                <p className="text-sm text-white mt-2">
                  Requires client authentication
                </p>
              </div>
            )}
          </div>



          {/* Client Portal Content */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Client Portal Features
              </h2>
              <p className="text-white mb-6">
                Stay updated on the latest features, exclusive offers, and upcoming software. 
                Your feedback helps us build the safety management tools you need.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
          {[
            { key: 'specials', label: 'Current Specials', icon: Gift },
            { key: 'updates', label: 'Feature Updates', icon: Rocket },
            { key: 'upcoming', label: 'Upcoming Software', icon: Code },
            { key: 'feedback', label: 'Community Feedback', icon: MessageCircle }
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              onClick={() => setActiveTab(key as any)}
              variant={activeTab === key ? "default" : "secondary"}
              className={`${
                activeTab === key 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                  : 'bg-blue-900/60 text-white border-violet-500/30 hover:bg-blue-900/20'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </Button>
          ))}
        </div>

            {/* Content Sections */}
            <div className="grid gap-8">
          {/* Current Specials */}
          {activeTab === 'specials' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {specials.map((special) => (
                <Card key={special.id} className="bg-black/40 border-blue-400/30 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge className="bg-emerald-600 text-white mb-2">
                        {special.badge}
                      </Badge>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-violet-400">{special.discount}</div>
                        <div className="text-sm text-white">Until {special.validUntil}</div>
                      </div>
                    </div>
                    <CardTitle className="text-white">{special.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white mb-4">{special.description}</p>
                    <Button 
                      onClick={() => handleLearnMore(special)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Gift className="w-4 h-4 mr-2" />
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Feature Updates */}
          {activeTab === 'updates' && (
            <div className="grid md:grid-cols-2 gap-6">
              {featureUpdates.map((update) => (
                <Card key={update.id} className="bg-black/40 border-blue-400/30 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge className={`${
                        update.status === 'released' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-blue-600 text-white'
                      }`}>
                        {update.status === 'released' ? 'Released' : 'Coming Soon'}
                      </Badge>
                      <div className="text-sm text-white">{update.releaseDate}</div>
                    </div>
                    <CardTitle className="text-white">{update.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white mb-4">{update.description}</p>
                    <Button 
                      variant="outline" 
                      className="border-violet-500/30 text-white hover:bg-blue-900/60"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Upcoming Software */}
          {activeTab === 'upcoming' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingSoftware.map((software) => (
                <Card key={software.id} className="bg-black/40 border-blue-400/30 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge className="bg-purple-600 text-white">
                        {software.expectedRelease}
                      </Badge>
                      <div className="flex items-center text-violet-400">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        <span className="font-semibold">{software.votes}</span>
                      </div>
                    </div>
                    <CardTitle className="text-white">{software.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white mb-4">{software.description}</p>
                    <Button 
                      onClick={() => handleVote(software.id)}
                      className={`w-full ${
                        software.userVoted 
                          ? 'bg-emerald-600 hover:bg-emerald-700' 
                          : 'bg-blue-500 hover:bg-blue-600'
                      } text-white`}
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      {software.userVoted ? 'Voted!' : 'Vote for This'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Community Feedback */}
          {activeTab === 'feedback' && (
            <div className="max-w-4xl mx-auto">
              {/* New Comment Form */}
              <Card className="bg-black/40 border-blue-400/30 backdrop-blur-sm mb-8">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Share Your Ideas
                  </CardTitle>
                  <CardDescription className="text-white">
                    Tell us what features you'd like to see in future updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input
                      placeholder="Your name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="bg-black/20 border-blue-400/30 text-white placeholder-blue-300"
                    />
                    <Textarea
                      placeholder="Share your ideas, feedback, or feature requests..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="bg-black/20 border-blue-400/30 text-white placeholder-blue-300"
                      rows={3}
                    />
                    <Button 
                      onClick={handleSubmitComment}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Post Comment
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <Card key={comment.id} className="bg-black/40 border-blue-400/30 backdrop-blur-sm">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-white" />
                          <span className="font-semibold text-white">{comment.user}</span>
                        </div>
                        <span className="text-sm text-white">{comment.timestamp}</span>
                      </div>
                      <p className="text-white mb-3">{comment.text}</p>
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(comment.id)}
                          className={`${
                            comment.userLiked 
                              ? 'text-violet-400 hover:text-emerald-300' 
                              : 'text-blue-100 hover:text-blue-200'
                          }`}
                        >
                          <Heart className={`w-4 h-4 mr-1 ${comment.userLiked ? 'fill-current' : ''}`} />
                          {comment.likes}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-black/20 backdrop-blur-sm border-t border-blue-400/30 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <SafetySyncIcon size={24} className="mr-2" />
              <span className="text-lg font-semibold text-white">SafetySync.AI</span>
            </div>
            <p className="text-white">
              Building the future of workplace safety management
            </p>
          </div>
        </div>
      </footer>

      {/* Authentication Popup */}
      {showAuthPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-blue-800 border border-blue-400/30 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <SafetySyncIcon size={48} className="mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Secure Authentication</h2>
              <p className="text-white">
                Please confirm your credentials to access your workspace
              </p>
            </div>
            
            <form onSubmit={handlePopupAuth} className="space-y-4">
              <div>
                <label htmlFor="popup-username" className="block text-sm font-medium text-white mb-2">
                  Username
                </label>
                <Input
                  id="popup-username"
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="bg-blue-900/60 border-violet-500/30 text-white placeholder-blue-300"
                  placeholder="Enter your username"
                />
              </div>
              
              <div>
                <label htmlFor="popup-password" className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="popup-password"
                    type={showPopupPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="bg-blue-900/60 border-violet-500/30 text-white placeholder-blue-300 pr-10"
                    placeholder="Enter your password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 text-blue-100 hover:text-blue-200"
                    onClick={() => setShowPopupPassword(!showPopupPassword)}
                  >
                    {showPopupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button 
                  type="submit" 
                  disabled={isAuthenticating}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isAuthenticating ? 'Authenticating...' : 'Access Workspace'}
                </Button>
                <Button 
                  type="button"
                  onClick={() => setShowAuthPopup(false)}
                  variant="secondary"
                  className="flex-1 bg-blue-900/60 border-violet-500/30 text-white hover:bg-blue-900/20"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Business Impact Dialog */}
      <Dialog open={showBusinessImpactDialog} onOpenChange={setShowBusinessImpactDialog}>
        <DialogContent className="max-w-4xl bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 border-violet-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              How {selectedService?.title} Helps Your Business
            </DialogTitle>
            <DialogDescription className="text-blue-200 text-lg">
              Discover the real-world business impact and ROI of implementing this solution
            </DialogDescription>
          </DialogHeader>
          
          {selectedService && (
            <div className="space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Key Benefits */}
              <div className="bg-blue-900/40 border border-emerald-500/30 rounded-lg p-6">
                <h3 className="flex items-center gap-2 text-xl font-semibold mb-4 text-emerald-400">
                  <CheckCircle className="w-6 h-6" />
                  Key Business Benefits
                </h3>
                <div className="grid gap-3">
                  {getBusinessImpactContent(selectedService).benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-white">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ROI & Cost Savings */}
              <div className="bg-green-900/40 border border-green-500/30 rounded-lg p-6">
                <h3 className="flex items-center gap-2 text-xl font-semibold mb-4 text-green-400">
                  <DollarSign className="w-6 h-6" />
                  Return on Investment
                </h3>
                <p className="text-white text-lg font-medium">
                  {getBusinessImpactContent(selectedService).roi}
                </p>
              </div>

              {/* Industry Applications */}
              <div className="bg-purple-900/40 border border-purple-500/30 rounded-lg p-6">
                <h3 className="flex items-center gap-2 text-xl font-semibold mb-4 text-purple-400">
                  <Users className="w-6 h-6" />
                  Industry Applications
                </h3>
                <p className="text-white">
                  {getBusinessImpactContent(selectedService).industries}
                </p>
              </div>

              {/* Implementation Timeline */}
              <div className="bg-blue-900/40 border border-blue-500/30 rounded-lg p-6">
                <h3 className="flex items-center gap-2 text-xl font-semibold mb-4 text-blue-400">
                  <Clock className="w-6 h-6" />
                  Implementation Timeline
                </h3>
                <p className="text-white">
                  {getBusinessImpactContent(selectedService).implementation}
                </p>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-r from-emerald-600/20 to-blue-600/20 border border-emerald-500/30 rounded-lg p-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-3 text-emerald-400">Ready to Transform Your Business?</h3>
                  <p className="text-white mb-4">
                    Join 500+ companies already saving time and money with SafetySync.AI
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button 
                      onClick={() => {
                        setShowBusinessImpactDialog(false);
                        handleWorkspaceAccess();
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Rocket className="w-4 h-4 mr-2" />
                      Start 6-Hour Trial
                    </Button>
                    <Button 
                      onClick={() => {
                        setShowBusinessImpactDialog(false);
                        window.open('https://calendly.com/safetysync-demo', '_blank');
                      }}
                      variant="outline"
                      className="border-blue-400/30 text-white hover:bg-blue-800/30"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Demo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Onboarding Tutorial */}
      <ClientOnboardingTutorial
        isOpen={showOnboardingTutorial}
        onClose={() => setShowOnboardingTutorial(false)}
        onStepComplete={(stepId) => {
          setCompletedOnboardingSteps(prev => [...prev, stepId]);
          localStorage.setItem('completedOnboardingSteps', JSON.stringify([...completedOnboardingSteps, stepId]));
        }}
        completedSteps={completedOnboardingSteps}
      />
    </div>
  );
}
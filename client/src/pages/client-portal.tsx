import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { SafetySyncIcon } from '@/components/ui/safetysync-icon';
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
  TrendingUp
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
  const [userName, setUserName] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [forceShowLogin, setForceShowLogin] = useState(true);
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  // Force authentication check on client portal
  useEffect(() => {
    // Clear any existing authentication tokens for client portal
    localStorage.removeItem('auth_token');
    setForceShowLogin(true);
  }, []);

  const handleSuccessfulLogin = async (email: string, password: string) => {
    setIsAuthenticating(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        setForceShowLogin(false);
        toast({
          title: "Welcome Back!",
          description: "You have been successfully logged in",
          variant: "default"
        });
      } else {
        toast({
          title: "Login Failed",
          description: result.message || "Invalid email or password",
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSuccessfulLogin(loginEmail, loginPassword);
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

  // Debug logging
  console.log('Client Portal - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated, 'user:', user);

  const handleWorkspaceAccess = () => {
    // Always show the popup for workspace access - regardless of current auth state
    // This ensures users see the client portal interface, not the login form
    setShowAuthPopup(true);
  };

  const handlePopupAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    
    try {
      await login(loginEmail, loginPassword);
      setShowAuthPopup(false);
      setLoginEmail('');
      setLoginPassword('');
      
      // Redirect to workspace after successful authentication
      window.location.href = '/workspace';
      
      toast({
        title: "Authentication Successful",
        description: "Welcome to your workspace!",
        duration: 3000,
      });
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <SafetySyncIcon size={64} className="mx-auto mb-4 animate-pulse" />
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Always show sign-in form - don't bypass authentication
  if (forceShowLogin || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.2),transparent_50%)]" />
        
        {/* Tech Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

        {/* Header */}
        <header className="relative z-10 bg-black/20 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <SafetySyncIcon size={32} className="mr-3" />
                <span className="text-xl font-bold text-white">SafetySync.AI Client Portal</span>
              </div>
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={() => window.location.href = '/'}
                  variant="ghost"
                  className="text-gray-300 hover:text-white"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Centered Sign In Form */}
        <div className="relative z-10 min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
          <div className="w-full max-w-md">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
              <CardHeader className="text-center pb-8">
                <div className="mx-auto mb-4">
                  <SafetySyncIcon size={48} />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Sign In</CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  For existing clients only
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      id="remember"
                      name="remember"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                      Remember my browser so I can sign in faster
                    </label>
                  </div>
                  <Button
                    type="submit"
                    disabled={isAuthenticating}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    {isAuthenticating ? "Signing in..." : "Secure Sign In"}
                  </Button>
                </form>
                <div className="mt-6 text-center space-y-2">
                  <div className="text-sm text-gray-600">
                    <a href="#" className="text-blue-600 hover:text-blue-800">
                      Forgot Username?
                    </a>
                    <span className="mx-2">•</span>
                    <a href="#" className="text-blue-600 hover:text-blue-800">
                      Forgot Password?
                    </a>
                  </div>
                  <div className="text-sm text-gray-600">
                    <a href="/" className="text-blue-600 hover:text-blue-800">
                      Set up Online Account Access
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="mt-6 text-center">
              <p className="text-white/80 text-sm">
                Don't have an account?{" "}
                <a href="/" className="text-blue-400 hover:text-blue-300 underline">
                  Sign up for a free trial
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.2),transparent_50%)]" />
      
      {/* Tech Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <SafetySyncIcon size={32} className="mr-3" />
              <span className="text-xl font-bold text-white">SafetySync.AI Client Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => window.location.href = '/'}
                variant="ghost"
                className="text-gray-300 hover:text-white"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              {isAuthenticated && (
                <Button 
                  onClick={handleLogout}
                  variant="ghost"
                  className="text-red-300 hover:text-red-200"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Login Form */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-bold text-white mb-4">
                Client Portal Access
              </h1>
              <p className="text-xl text-gray-300 mb-6">
                Sign in to access your workspace and manage your safety compliance.
              </p>
            </div>

            {!isAuthenticated ? (
              <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Sign In to Your Account</CardTitle>
                  <CardDescription className="text-gray-300">
                    Enter your credentials to access your safety management workspace
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-white font-medium">Email</label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-white font-medium">Password</label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isAuthenticating}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3"
                    >
                      {isAuthenticating ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Welcome Back, {user?.name}!</CardTitle>
                  <CardDescription className="text-gray-300">
                    You are successfully logged in to your SafetySync.AI account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                      <div>
                        <div className="text-white font-medium">Account Status</div>
                        <div className="text-emerald-300 text-sm">Active • {user?.userTier}</div>
                      </div>
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    </div>
                    <Button
                      onClick={() => window.location.href = '/workspace'}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3"
                    >
                      <Settings className="w-5 h-5 mr-2" />
                      Access Your Workspace
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="text-center lg:text-left">
              <p className="text-gray-300 text-sm">
                Don't have an account?{" "}
                <a href="/" className="text-emerald-400 hover:text-emerald-300 underline">
                  Sign up for a free trial
                </a>
              </p>
            </div>
          </div>

          {/* Right Side - Client Portal Content */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-white mb-4">
                Client Portal Features
              </h2>
              <p className="text-gray-300 mb-6">
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
              variant={activeTab === key ? "default" : "outline"}
              className={`${
                activeTab === key 
                  ? 'bg-emerald-600 text-white' 
                  : 'border-white/20 text-white hover:bg-white/10'
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
                <Card key={special.id} className="bg-black/40 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge className="bg-emerald-600 text-white mb-2">
                        {special.badge}
                      </Badge>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-400">{special.discount}</div>
                        <div className="text-sm text-gray-400">Until {special.validUntil}</div>
                      </div>
                    </div>
                    <CardTitle className="text-white">{special.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">{special.description}</p>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
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
                <Card key={update.id} className="bg-black/40 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge className={`${
                        update.status === 'released' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-blue-600 text-white'
                      }`}>
                        {update.status === 'released' ? 'Released' : 'Coming Soon'}
                      </Badge>
                      <div className="text-sm text-gray-400">{update.releaseDate}</div>
                    </div>
                    <CardTitle className="text-white">{update.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">{update.description}</p>
                    <Button 
                      variant="outline" 
                      className="border-white/20 text-white hover:bg-white/10"
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
                <Card key={software.id} className="bg-black/40 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge className="bg-purple-600 text-white">
                        {software.expectedRelease}
                      </Badge>
                      <div className="flex items-center text-emerald-400">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        <span className="font-semibold">{software.votes}</span>
                      </div>
                    </div>
                    <CardTitle className="text-white">{software.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">{software.description}</p>
                    <Button 
                      onClick={() => handleVote(software.id)}
                      className={`w-full ${
                        software.userVoted 
                          ? 'bg-emerald-600 hover:bg-emerald-700' 
                          : 'bg-gray-600 hover:bg-gray-700'
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
              <Card className="bg-black/40 border-white/10 backdrop-blur-sm mb-8">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Share Your Ideas
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Tell us what features you'd like to see in future updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input
                      placeholder="Your name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="bg-black/20 border-white/10 text-white placeholder-gray-400"
                    />
                    <Textarea
                      placeholder="Share your ideas, feedback, or feature requests..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="bg-black/20 border-white/10 text-white placeholder-gray-400"
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
                  <Card key={comment.id} className="bg-black/40 border-white/10 backdrop-blur-sm">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="font-semibold text-white">{comment.user}</span>
                        </div>
                        <span className="text-sm text-gray-400">{comment.timestamp}</span>
                      </div>
                      <p className="text-gray-300 mb-3">{comment.text}</p>
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(comment.id)}
                          className={`${
                            comment.userLiked 
                              ? 'text-emerald-400 hover:text-emerald-300' 
                              : 'text-gray-400 hover:text-gray-300'
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
      <footer className="relative z-10 bg-black/20 backdrop-blur-sm border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <SafetySyncIcon size={24} className="mr-2" />
              <span className="text-lg font-semibold text-white">SafetySync.AI</span>
            </div>
            <p className="text-gray-400">
              Building the future of workplace safety management
            </p>
          </div>
        </div>
      </footer>

      {/* Authentication Popup */}
      {showAuthPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-white/10 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <SafetySyncIcon size={48} className="mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Secure Authentication</h2>
              <p className="text-gray-300">
                Please confirm your credentials to access your workspace
              </p>
            </div>
            
            <form onSubmit={handlePopupAuth} className="space-y-4">
              <div>
                <label htmlFor="popup-email" className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <Input
                  id="popup-email"
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label htmlFor="popup-password" className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <Input
                  id="popup-password"
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  placeholder="Enter your password"
                />
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
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
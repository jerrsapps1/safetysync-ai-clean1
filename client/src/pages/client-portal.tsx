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

  // Initialize authentication state
  useEffect(() => {
    // Only force login if not already authenticated
    if (!isAuthenticated) {
      setForceShowLogin(true);
    } else {
      setForceShowLogin(false);
    }
  }, [isAuthenticated]);

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

  // Show client portal with sign-in form in top right corner

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
              {(!isAuthenticated || forceShowLogin) ? (
                <div className="flex items-center space-x-2">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-40 h-8 text-sm bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-40 h-8 text-sm bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                  <Button
                    onClick={handleLogin}
                    disabled={isAuthenticating}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isAuthenticating ? "..." : "Sign In"}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  {/* Account Status Alert in Header */}
                  <div className="flex items-center space-x-3 p-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <div className="text-emerald-300 text-sm font-medium">
                        Active • {user?.userTier}
                      </div>
                    </div>
                  </div>
                  
                  <span className="text-white text-sm">Welcome, {user?.name}</span>
                  <Button 
                    onClick={() => window.location.href = '/workspace'}
                    variant="ghost"
                    className="text-emerald-300 hover:text-emerald-200"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Workspace
                  </Button>
                  <Button 
                    onClick={handleLogout}
                    variant="ghost"
                    className="text-red-300 hover:text-red-200"
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
            <p className="text-xl text-gray-300 mb-6">
              {(!isAuthenticated || forceShowLogin)
                ? "Sign in using the form in the top right corner to access your workspace and manage your safety compliance."
                : `Welcome back, ${user?.name}! Access your workspace and explore our client features below.`
              }
            </p>
          </div>

          {/* Show workspace access after login */}
          {isAuthenticated && !forceShowLogin && (
            <div className="max-w-2xl mx-auto">
              <Card className="bg-emerald-900/40 border-emerald-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-emerald-300">Ready to Work</CardTitle>
                  <CardDescription className="text-emerald-100">
                    Access your safety management workspace
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => window.location.href = '/workspace'}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3"
                  >
                    <Settings className="w-5 h-5 mr-2" />
                    Access Your Workspace
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Client Portal Content */}
          <div className="space-y-8">
            <div className="text-center">
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
              variant={activeTab === key ? "default" : "secondary"}
              className={`${
                activeTab === key 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
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
                  variant="secondary"
                  className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
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
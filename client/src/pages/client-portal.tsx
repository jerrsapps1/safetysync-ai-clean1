import { useState } from 'react';
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
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

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
    
    try {
      const result = await login(loginEmail, loginPassword);
      
      if (result.success) {
        toast({
          title: "Welcome Back!",
          description: "You have been successfully logged in",
          variant: "default"
        });
        // No need to refresh - useAuth will handle state updates
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
    }
  };

  const handleLogout = () => {
    // Clear auth and redirect to landing page
    fetch('/api/auth/logout', { method: 'POST' });
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
      variant: "default"
    });
    // Redirect to landing page
    window.location.href = '/';
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

  // Always show client portal content - authentication is handled via popup
  // This ensures users always see the client portal interface, not a login form
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
            {/* Header navigation removed - authentication now handled by popup */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to Your Client Portal
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            Stay updated on the latest features, exclusive offers, and upcoming software. 
            Your feedback helps us build the safety management tools you need.
          </p>
          
          {/* Quick Access Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button 
              onClick={handleWorkspaceAccess}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg"
            >
              <Settings className="w-5 h-5 mr-3" />
              Enter Your Workspace
            </Button>
            <Button 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
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
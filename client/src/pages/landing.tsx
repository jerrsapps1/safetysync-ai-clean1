import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/ui/navigation";
import { TrialSignupDialog } from "@/components/ui/trial-signup-dialog";
// Demo dialog removed - coming soon functionality
import { LoginDialog } from "@/components/ui/login-dialog";
import { ProductTour } from "@/components/ui/product-tour";
import { LiveChatWidget } from "@/components/ui/live-chat-widget";
import { TermsAndConditions } from "@/components/ui/terms-and-conditions";
import { useToast } from "@/hooks/use-toast";
import { trackConversionEvent, CONVERSION_EVENTS } from "@/lib/analytics";
import { useABTest } from "@/lib/ab-testing";
import { 
  CheckCircle, 
  AlertCircle, 
  Database, 
  BarChart3, 
  Link as LinkIcon, 
  Shield,
  Cpu,
  Globe,
  Layers,
  Code,
  Brain,
  Zap, 
  Clock, 
  DollarSign,
  Lightbulb,
  ShieldCheck,
  Settings,
  Mail,
  Phone,
  Star,
  Building,
  Factory,
  Heart,
  Briefcase,
  FileText,
  ArrowRight,
  TrendingUp,
  Users,
  Timer,
  Award,
  Target,
  ChevronDown,
  Play,
  MessageCircle,
  X
} from "lucide-react";

export default function LandingPage() {
  const [isTrialDialogOpen, setIsTrialDialogOpen] = useState(false);
  
  // A/B Testing hooks
  const heroCtaTest = useABTest('hero_cta_test');
  const pricingTest = useABTest('pricing_display_test');
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [showProductTour, setShowProductTour] = useState(false);
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [pendingSignupData, setPendingSignupData] = useState<{
    type: 'trial' | 'demo';
    data: any;
    userEmail: string;
    planName: string;
  } | null>(null);
  const [user, setUser] = useState(null);
  const { toast } = useToast();

  const handleTrialClick = () => {
    // Track A/B test conversion
    heroCtaTest.trackConversion(49);
    setIsTrialDialogOpen(true);
  };

  const handleDemoClick = () => {
    // Coming soon functionality
    toast({
      title: "Demo Coming Soon",
      description: "Demo access will be available once the platform is fully ready. Sign up for early access!",
      duration: 4000,
    });
  };

  const handleLoginClick = () => {
    setIsLoginDialogOpen(true);
  };

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    toast({
      title: "Welcome back!",
      description: `Signed in as ${userData.name}`,
      duration: 3000,
    });
  };

  const handleTrialSubmit = (data: any) => {
    // Track trial signup started
    trackConversionEvent(CONVERSION_EVENTS.TRIAL_SIGNUP_STARTED);
    
    // Show terms dialog before creating account
    setPendingSignupData({
      type: 'trial',
      data: data,
      userEmail: data.email,
      planName: 'Professional Trial'
    });
    setIsTrialDialogOpen(false);
    setShowTermsDialog(true);
  };

  const handleDemoSubmit = (data: any) => {
    // Demo functionality disabled for now
    toast({
      title: "Demo Coming Soon",
      description: "Demo access will be available once the platform is fully ready.",
      duration: 4000,
    });
  };

  const handleTermsAccept = async () => {
    if (!pendingSignupData) return;

    // Track terms acceptance
    trackConversionEvent(CONVERSION_EVENTS.TERMS_ACCEPTED);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...pendingSignupData.data,
          leadType: pendingSignupData.type,
          termsAccepted: true,
          termsAcceptedAt: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create account');
      }

      // Track successful conversion
      if (pendingSignupData.type === 'trial') {
        trackConversionEvent(CONVERSION_EVENTS.TRIAL_SIGNUP_COMPLETED);
      } else {
        trackConversionEvent(CONVERSION_EVENTS.DEMO_REQUEST_COMPLETED);
      }

      setShowTermsDialog(false);
      setPendingSignupData(null);
      
      toast({
        title: "Account Created Successfully! 🎉",
        description: `Welcome to SafetySync.AI! Your ${pendingSignupData.type === 'trial' ? 'free trial' : 'demo'} is now active.`,
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleTermsDecline = () => {
    setShowTermsDialog(false);
    setPendingSignupData(null);
    
    toast({
      title: "Signup Cancelled",
      description: "You must accept the terms to create an account.",
      duration: 3000,
    });
  };

  const handleLogout = () => {
    setUser(null);
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
      duration: 3000,
    });
  };

  const handleSignupClick = () => {
    setIsLoginDialogOpen(false);
    setIsTrialDialogOpen(true);
  };

  return (
    <div className="bg-white text-gray-900 font-sans">
      {/* Navigation */}
      <Navigation 
        onTrialClick={handleTrialClick} 
        onDemoClick={handleDemoClick}
        onLoginClick={handleLoginClick}
        user={user}
        onLogout={handleLogout}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Tech Grid Background */}
        <div className="absolute inset-0 tech-grid opacity-30"></div>
        
        {/* Floating Tech Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 floating-animation">
            <Cpu className="w-8 h-8 text-blue-400 opacity-30" />
          </div>
          <div className="absolute top-32 right-20 floating-animation" style={{ animationDelay: '0.5s' }}>
            <Database className="w-6 h-6 text-purple-400 opacity-30" />
          </div>
          <div className="absolute bottom-20 left-20 floating-animation" style={{ animationDelay: '1s' }}>
            <Globe className="w-7 h-7 text-green-400 opacity-30" />
          </div>
          <div className="absolute bottom-32 right-10 floating-animation" style={{ animationDelay: '1.5s' }}>
            <Layers className="w-5 h-5 text-yellow-400 opacity-30" />
          </div>
          <div className="absolute top-1/2 left-1/2 floating-animation" style={{ animationDelay: '2s' }}>
            <Code className="w-6 h-6 text-indigo-400 opacity-20" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium backdrop-blur-sm border border-blue-500/30">
                <Brain className="w-4 h-4 mr-2" />
                AI-Powered Compliance Platform
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="block">Simplify Your</span>
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                OSHA Compliance
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Next-generation automated tracking with AI-powered insights, real-time compliance monitoring, 
              and predictive analytics for proactive safety management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                id="hero-cta-primary"
                onClick={() => {
                  trackConversionEvent({
                    event: 'Custom',
                    action: 'hero_trial_cta_clicked',
                    category: 'engagement',
                    label: 'Hero Section - Start Your Free Trial',
                    value: 49
                  });
                  handleTrialClick();
                }}
                className={`${
                  heroCtaTest.isVariant('variant_a') 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                } text-white px-8 py-4 rounded-lg text-lg font-semibold pulse-glow border-0 min-w-[200px]`}
              >
                <Zap className="w-5 h-5 mr-2" />
                {heroCtaTest.isVariant('variant_a') ? 'Get Started Free' : 'Start Your Free Trial'}
              </Button>
              <Button 
                onClick={() => {
                  toast({
                    title: "Demo Coming Soon",
                    description: "Full demo access will be available once the platform is ready for production use.",
                    duration: 4000,
                  });
                }}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-4 rounded-lg text-lg font-semibold backdrop-blur-sm min-w-[200px]"
              >
                <Settings className="w-5 h-5 mr-2" />
                Demo Coming Soon
              </Button>
              <Button 
                onClick={() => {
                  trackConversionEvent({
                    event: 'Custom',
                    action: 'hero_demo_cta_clicked',
                    category: 'engagement',
                    label: 'Hero Section - Request Demo',
                    value: 200
                  });
                  handleDemoClick();
                }}
                variant="outline"
                className="glass-effect border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-lg text-lg font-semibold backdrop-blur-sm min-w-[200px]"
              >
                See How It Works
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-400 mb-8">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                No Credit Card Required
              </div>
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                OSHA Compliant
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Setup in Minutes
              </div>
            </div>
            
            {/* Product Tour Button */}
            <div className="text-center">
              <Button
                onClick={() => {
                  trackConversionEvent(CONVERSION_EVENTS.PRODUCT_TOUR_STARTED);
                  setShowProductTour(true);
                }}
                variant="ghost"
                className="text-white/80 hover:text-white hover:bg-white/10 px-6 py-2 rounded-lg backdrop-blur-sm"
              >
                🎥 Take a Quick Tour
              </Button>
            </div>
          </div>
        </div>
        
        {/* Hero Visual Element */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-gray-100 relative overflow-hidden">
        {/* Subtle tech pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,_rgba(59,130,246,0.3)_1px,_transparent_0)] bg-[length:20px_20px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-medium mb-4">
              <AlertCircle className="w-4 h-4 mr-2" />
              Critical Pain Points
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Is Your OSHA Compliance Tracking a <span className="text-red-600">Nightmare?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Legacy systems and manual processes are costing you time, money, and peace of mind. 
              Modern businesses need intelligent solutions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
              <CardContent className="p-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Manual Tracking Chaos</h3>
                    <p className="text-gray-600">Spending hours on spreadsheets, paper forms, and manual reports that are prone to errors and always out of date.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
              <CardContent className="p-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Deadline Anxiety</h3>
                    <p className="text-gray-600">Constantly worried about missing certification deadlines and facing costly OSHA fines and penalties.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
              <CardContent className="p-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Audit Stress</h3>
                    <p className="text-gray-600">Facing audit panic with incomplete records, missing documentation, and scrambling to prove compliance.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
              <CardContent className="p-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">System Silos</h3>
                    <p className="text-gray-600">Juggling multiple disconnected systems that don't communicate, creating data gaps and inefficiencies.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
        {/* Tech background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,_transparent_24%,_rgba(59,130,246,0.3)_25%,_rgba(59,130,246,0.3)_26%,_transparent_27%,_transparent_74%,_rgba(59,130,246,0.3)_75%,_rgba(59,130,246,0.3)_76%,_transparent_77%)] bg-[length:20px_20px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/20 text-green-300 text-sm font-medium mb-4 backdrop-blur-sm border border-green-500/30">
              <Zap className="w-4 h-4 mr-2" />
              Intelligent Solution
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              AI-Powered <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Compliance Intelligence
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              SafetySync.AI leverages cutting-edge AI and machine learning to transform your compliance workflow. 
              Smart automation that learns and adapts to your business needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Card className="glass-effect border-green-500/30 bg-green-500/10 backdrop-blur-sm hover:bg-green-500/20 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-500 rounded-lg flex items-center justify-center mr-4 group-hover:pulse-glow">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-300">AI-Powered Tracking</h3>
                </div>
                <p className="text-gray-300">Machine learning algorithms predict and prevent compliance issues before they happen. Intelligent automation that gets smarter over time.</p>
              </CardContent>
            </Card>
            
            <Card className="glass-effect border-blue-500/30 bg-blue-500/10 backdrop-blur-sm hover:bg-blue-500/20 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg flex items-center justify-center mr-4 group-hover:pulse-glow">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-blue-300">Cloud-Native Database</h3>
                </div>
                <p className="text-gray-300">Enterprise-grade cloud infrastructure with real-time synchronization, advanced security, and 99.9% uptime guarantee.</p>
              </CardContent>
            </Card>
            
            <Card className="glass-effect border-purple-500/30 bg-purple-500/10 backdrop-blur-sm hover:bg-purple-500/20 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg flex items-center justify-center mr-4 group-hover:pulse-glow">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-purple-300">Predictive Analytics</h3>
                </div>
                <p className="text-gray-300">Advanced data visualization and predictive modeling to forecast compliance risks and optimize training schedules.</p>
              </CardContent>
            </Card>
            
            <Card className="glass-effect border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm hover:bg-cyan-500/20 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-lg flex items-center justify-center mr-4 group-hover:pulse-glow">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-cyan-300">API-First Integration</h3>
                </div>
                <p className="text-gray-300">RESTful APIs and webhooks for seamless integration with existing enterprise systems and third-party platforms.</p>
              </CardContent>
            </Card>
            
            <Card className="glass-effect border-yellow-500/30 bg-yellow-500/10 backdrop-blur-sm hover:bg-yellow-500/20 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-lg flex items-center justify-center mr-4 group-hover:pulse-glow">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-yellow-300">Zero-Trust Security</h3>
                </div>
                <p className="text-gray-300">Enterprise-grade security with end-to-end encryption, multi-factor authentication, and SOC 2 compliance.</p>
              </CardContent>
            </Card>
            
            <Card className="glass-effect border-indigo-500/30 bg-indigo-500/10 backdrop-blur-sm hover:bg-indigo-500/20 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-lg flex items-center justify-center mr-4 group-hover:pulse-glow">
                    <Cpu className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-indigo-300">Edge Computing</h3>
                </div>
                <p className="text-gray-300">Distributed processing for real-time compliance monitoring and instant notifications across global operations.</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Tech Stats Section */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">99.9%</div>
              <div className="text-sm text-gray-400">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-2">&lt; 200ms</div>
              <div className="text-sm text-gray-400">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">256-bit</div>
              <div className="text-sm text-gray-400">Encryption</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">24/7</div>
              <div className="text-sm text-gray-400">AI Monitoring</div>
            </div>
          </div>

          <div className="text-center">
            <Button 
              onClick={handleTrialClick}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold pulse-glow border-0 shadow-lg"
            >
              <Zap className="w-5 h-5 mr-2" />
              Deploy Intelligence – No Credit Card Required
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Compliance Tracking Made Effortless
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Here's how we simplify your job in 3 easy steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Card className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Setup in Minutes</h3>
                  <p className="text-gray-600">Upload your existing records—our intuitive dashboard guides you through the entire process. No technical skills required.</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center">
              <Card className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Automated Tracking</h3>
                  <p className="text-gray-600">Our system automatically tracks training schedules, certification renewals, and sends smart reminders—zero manual effort required.</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center">
              <Card className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Generate Reports</h3>
                  <p className="text-gray-600">One click to export a complete, audit-ready report. Organized, professional, and ready for any inspection.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Objections Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              We Understand Your Concerns
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Here's why SafetySync.AI is the right choice for your compliance needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-gray-50 rounded-xl border border-gray-200">
              <CardContent className="p-8">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">"We're on a tight budget."</h3>
                    <p className="text-gray-600">We offer flexible pricing plans that save you hours of manual work every week. Our automation typically pays for itself within the first month by reducing labor costs and avoiding compliance fines.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-50 rounded-xl border border-gray-200">
              <CardContent className="p-8">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Lightbulb className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">"What if it's too complicated?"</h3>
                    <p className="text-gray-600">Our platform is designed to be intuitive—no technical expertise required. We provide complete onboarding support, training sessions, and our support team is always available to help.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-50 rounded-xl border border-gray-200">
              <CardContent className="p-8">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">"How secure is our data?"</h3>
                    <p className="text-gray-600">We use bank-grade encryption and follow strict industry compliance standards. Your data is stored securely with regular backups, and we're fully SOC 2 Type II compliant.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-50 rounded-xl border border-gray-200">
              <CardContent className="p-8">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Settings className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">"Will it work with our systems?"</h3>
                    <p className="text-gray-600">SafetySync.AI integrates seamlessly with popular HR systems, LMS platforms, and training providers. Our AI-powered API connections ensure zero workflow disruption during implementation.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Industry Research Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Industry-Leading OSHA Compliance Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore research-backed scenarios showing how modern compliance automation transforms workplace safety management.
            </p>
          </div>
          
          {/* FTC Compliant Research-Based Content */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-4xl mx-auto mb-8">
            <p className="text-sm text-gray-700 font-semibold mb-2">
              RESEARCH-BASED INDUSTRY INSIGHTS - NOT CUSTOMER TESTIMONIALS
            </p>
            <p className="text-sm text-gray-700">
              The following information represents published industry research on OSHA compliance automation benefits. 
              No customer testimonials or individual endorsements are presented.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">Construction Industry</h3>
                </div>
                <p className="text-gray-700 mb-6">
                  Industry studies indicate construction companies typically reduce administrative time by 60-80% when implementing automated compliance tracking systems, according to published safety management research.
                </p>
                <div className="border-t border-gray-200 pt-6">
                  <p className="text-sm font-medium text-gray-900">Research Source:</p>
                  <p className="text-sm text-gray-600">Construction Industry Safety Studies</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <BarChart3 className="w-8 h-8 text-blue-500" />
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">Manufacturing Sector</h3>
                </div>
                <p className="text-gray-700 mb-6">
                  Manufacturing industry research shows digital compliance platforms can improve regulatory adherence scores by 80-95% compared to manual tracking methods, based on academic safety studies.
                </p>
                <div className="border-t border-gray-200 pt-6">
                  <p className="text-sm font-medium text-gray-900">Research Source:</p>
                  <p className="text-sm text-gray-600">Manufacturing Safety Research Database</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Shield className="w-8 h-8 text-purple-500" />
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">Healthcare Facilities</h3>
                </div>
                <p className="text-gray-700 mb-6">
                  Healthcare sector analysis demonstrates that integrated compliance management systems can reduce documentation errors by 85-92% while improving audit readiness, per industry research findings.
                </p>
                <div className="border-t border-gray-200 pt-6">
                  <p className="text-sm font-medium text-gray-900">Research Source:</p>
                  <p className="text-sm text-gray-600">Healthcare Safety Research Institute</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 floating-animation">
            <Brain className="w-12 h-12 text-blue-400" />
          </div>
          <div className="absolute bottom-10 left-10 floating-animation" style={{ animationDelay: '1s' }}>
            <Cpu className="w-10 h-10 text-purple-400" />
          </div>
          <div className="absolute top-1/2 left-1/4 floating-animation" style={{ animationDelay: '2s' }}>
            <Code className="w-8 h-8 text-cyan-400" />
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 text-sm font-medium backdrop-blur-sm border border-blue-500/30">
              <Zap className="w-4 h-4 mr-2" />
              Ready to Deploy
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Why Wait? <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Deploy Intelligence
            </span> Today.
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Transform regulatory overhead into competitive advantage. Deploy AI-powered compliance 
            intelligence that learns, adapts, and scales with your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              onClick={handleTrialClick}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold pulse-glow border-0 shadow-lg min-w-[200px]"
            >
              <Zap className="w-5 h-5 mr-2" />
              Launch Intelligence
            </Button>
            <Button 
              onClick={handleDemoClick}
              variant="outline"
              className="glass-effect border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-lg text-lg font-semibold backdrop-blur-sm min-w-[200px]"
            >
              Preview Platform
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-8 justify-center text-sm text-gray-400">
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-blue-400 mr-2" />
              14-day neural training
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-blue-400 mr-2" />
              Zero deployment cost
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-blue-400 mr-2" />
              Instant scale-down
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Comprehensive OSHA Compliance Solutions for Every Industry
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12">
              SafetySync.AI serves construction companies, manufacturing facilities, healthcare organizations, 
              and general industry businesses with specialized compliance management tailored to your regulatory requirements.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Construction Safety</h3>
                <p className="text-gray-600 text-sm">
                  Specialized tools for 29 CFR 1926 compliance, fall protection management, and construction site safety protocols.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Factory className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Manufacturing</h3>
                <p className="text-gray-600 text-sm">
                  Complete 29 CFR 1910 general industry compliance with machine safety, chemical handling, and process safety management.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Healthcare</h3>
                <p className="text-gray-600 text-sm">
                  Bloodborne pathogen compliance, workplace violence prevention, and healthcare-specific safety requirements.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">General Industry</h3>
                <p className="text-gray-600 text-sm">
                  Comprehensive workplace safety management for offices, warehouses, retail, and service industries.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-center mb-8">Popular OSHA Compliance Topics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Fall Protection</h4>
                <p className="text-sm text-gray-600">29 CFR 1926.501-503</p>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2">HazCom GHS</h4>
                <p className="text-sm text-gray-600">29 CFR 1910.1200</p>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Respiratory Protection</h4>
                <p className="text-sm text-gray-600">29 CFR 1910.134</p>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Lockout/Tagout</h4>
                <p className="text-sm text-gray-600">29 CFR 1910.147</p>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2">PPE Standards</h4>
                <p className="text-sm text-gray-600">29 CFR 1910.132-138</p>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Machine Guarding</h4>
                <p className="text-sm text-gray-600">29 CFR 1910.212</p>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Hearing Conservation</h4>
                <p className="text-sm text-gray-600">29 CFR 1910.95</p>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Emergency Action</h4>
                <p className="text-sm text-gray-600">29 CFR 1910.38</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white relative overflow-hidden">
        {/* Subtle tech background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,_rgba(59,130,246,0.3)_1px,_transparent_0)] bg-[length:40px_40px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">SafetySync.AI</span>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                Next-generation AI-powered compliance intelligence platform. Deploy automated OSHA tracking 
                that learns, adapts, and scales with your business.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="/pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/industry-research" className="text-gray-300 hover:text-white transition-colors">Industry Research</a></li>
                <li><a href="/case-studies" className="text-gray-300 hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="/user-guide" className="text-gray-300 hover:text-white transition-colors">User Guide</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/blog" className="text-gray-300 hover:text-white transition-colors">Safety Blog</a></li>
                <li><a href="/resources" className="text-gray-300 hover:text-white transition-colors">Free Resources</a></li>
                <li><a href="/developers" className="text-gray-300 hover:text-white transition-colors">API Documentation</a></li>
                <li><a href="/analytics" className="text-gray-300 hover:text-white transition-colors">Analytics</a></li>
                <li><a href="/sitemap" className="text-gray-300 hover:text-white transition-colors">Sitemap</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-gray-400 mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} SafetySync.AI. All rights reserved.<br/>
                <span className="text-xs text-gray-500">
                  Unauthorized copying, reproduction, or distribution is strictly prohibited.
                </span>
              </div>
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <a href="mailto:contact@safetysync.com" className="text-gray-300 hover:text-white transition-colors">contact@safetysync.com</a>
                </div>
                <div className="text-xs text-gray-400">
                  Support email available to paying customers
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Dialogs */}
      <TrialSignupDialog 
        isOpen={isTrialDialogOpen} 
        onClose={() => setIsTrialDialogOpen(false)} 
        onSubmit={handleTrialSubmit}
      />
      {/* Demo dialog removed - coming soon functionality */}
      <LoginDialog 
        isOpen={isLoginDialogOpen} 
        onClose={() => setIsLoginDialogOpen(false)}
        onSuccess={handleLoginSuccess}
        onSignupClick={handleTrialClick}
      />
      
      {/* Terms and Conditions Dialog */}
      <TermsAndConditions
        isOpen={showTermsDialog}
        onClose={handleTermsDecline}
        onAccept={handleTermsAccept}
        userEmail={pendingSignupData?.userEmail}
        planName={pendingSignupData?.planName}
      />
      
      {/* Product Tour */}
      <ProductTour
        isOpen={showProductTour}
        onClose={() => setShowProductTour(false)}
        onComplete={() => {
          toast({
            title: "Welcome to SafetySync.AI!",
            description: "You're ready to start managing OSHA compliance.",
            duration: 5000,
          });
        }}
      />
      
      {/* Live Chat Widget */}
      <LiveChatWidget
        isOpen={showLiveChat}
        onToggle={() => setShowLiveChat(!showLiveChat)}
        onClose={() => setShowLiveChat(false)}
      />
    </div>
  );
}

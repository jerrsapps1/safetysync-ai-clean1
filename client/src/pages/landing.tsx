import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/ui/navigation";
import { TrialSignupDialog } from "@/components/ui/trial-signup-dialog";
import { DemoRequestDialog } from "@/components/ui/demo-request-dialog";
import { Toaster } from "@/components/ui/toaster";

import { ProductTour } from "@/components/ui/product-tour";
import { LiveChatWidget } from "@/components/ui/live-chat-widget";
import { TermsAndConditions } from "@/components/ui/terms-and-conditions";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
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
  const [isDemoDialogOpen, setIsDemoDialogOpen] = useState(false);
  
  // Authentication hook
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth();
  
  // A/B Testing hooks
  const heroCtaTest = useABTest('hero_cta_test');
  const pricingTest = useABTest('pricing_display_test');

  const [showProductTour, setShowProductTour] = useState(false);
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [pendingSignupData, setPendingSignupData] = useState<{
    type: 'trial' | 'demo';
    data: any;
    userEmail: string;
    planName: string;
  } | null>(null);
  const { toast } = useToast();

  const handleTrialClick = () => {
    // Track A/B test conversion
    heroCtaTest.trackConversion(49);
    setIsTrialDialogOpen(true);
  };

  const handleDemoClick = () => {
    setIsDemoDialogOpen(true);
  };

  const handleLoginClick = () => {
    if (isAuthenticated) {
      // User is already logged in, go to dashboard
      window.location.href = '/dashboard';
    } else {
      // User needs to log in, go to dashboard login form
      window.location.href = '/dashboard';
    }
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
    // Demo requests are now enabled and handled by the DemoRequestDialog
    console.log("Demo request submitted:", data);
  };

  const handleTermsAccept = async () => {
    if (!pendingSignupData) return;

    // Track terms acceptance
    trackConversionEvent(CONVERSION_EVENTS.TERMS_ACCEPTED);

    try {
      let response;
      
      if (pendingSignupData.type === 'trial') {
        // Create user account for trial users
        response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: pendingSignupData.data.name,
            email: pendingSignupData.data.email,
            password: pendingSignupData.data.password,
            company: pendingSignupData.data.company,
            userTier: 'free_trial',
            subscriptionStatus: 'active',
            termsAccepted: true,
            termsAcceptedAt: new Date().toISOString()
          }),
        });
      } else {
        // Create lead for demo requests
        response = await fetch('/api/leads', {
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
      }

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
      
      // Redirect new trial users to dashboard
      if (pendingSignupData.type === 'trial') {
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000); // Longer delay to show success message
      }
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
    logout();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
      duration: 3000,
    });
  };

  const handleSignupClick = () => {
    setIsTrialDialogOpen(true);
  };

  const handleSignupSuccess = () => {
    // Handle successful signup - this is used by the trial dialog
    toast({
      title: "Account Created Successfully! 🎉",
      description: "Welcome to SafetySync.AI! Your free trial is now active.",
      duration: 5000,
    });
    
    // Redirect to dashboard after a short delay
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 2000);
  };

  return (
    <div className="bg-white text-gray-900 font-sans">
      {/* Navigation */}
      <Navigation 
        onTrialClick={handleTrialClick} 
        onDemoClick={handleDemoClick}
        onLoginClick={handleLoginClick}
        user={user}
        onLogout={logout}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Tech Grid Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }}></div>
          </div>
          
          {/* Floating Tech Icons */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 animate-float">
              <Cpu className="w-8 h-8 text-blue-400 opacity-60" />
            </div>
            <div className="absolute top-40 right-32 animate-float-delay-1">
              <Database className="w-6 h-6 text-purple-400 opacity-60" />
            </div>
            <div className="absolute bottom-32 left-40 animate-float-delay-2">
              <Globe className="w-10 h-10 text-cyan-400 opacity-60" />
            </div>
            <div className="absolute top-60 right-20 animate-float-delay-3">
              <Layers className="w-7 h-7 text-indigo-400 opacity-60" />
            </div>
            <div className="absolute bottom-20 right-60 animate-float-delay-4">
              <Code className="w-8 h-8 text-green-400 opacity-60" />
            </div>
            <div className="absolute top-32 right-1/2 animate-float-delay-5">
              <Brain className="w-9 h-9 text-pink-400 opacity-60" />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="text-left">
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-cyan-300 text-sm font-medium backdrop-blur-sm border border-cyan-300/30">
                  <Brain className="w-4 h-4 mr-2" />
                  AI-Powered OSHA Platform
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="block text-white">Next-Generation</span>
                <span className="block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Safety Intelligence
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-xl mb-8 leading-relaxed">
                Revolutionary AI-powered OSHA compliance platform with automated tracking, intelligent reporting, and real-time safety insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
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
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 pulse-glow"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  {heroCtaTest.isVariant('variant_a') ? 'Launch AI Trial' : 'Start AI-Powered Trial'}
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
                  className="border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 px-8 py-4 rounded-lg text-lg font-semibold backdrop-blur-sm"
                >
                  <Settings className="w-5 h-5 mr-2" />
                  Demo Coming Soon
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 text-sm text-gray-400 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  No Credit Card Required
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Enterprise Security
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Setup in Minutes
                </div>
              </div>
            </div>
            
            {/* Right side - Features showcase */}
            <div className="relative">
              <div className="bg-navy-800 rounded-lg p-8 border border-navy-700">
                <h3 className="text-xl font-semibold text-white mb-6">Platform Features</h3>
                <div className="space-y-4">
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    Automated compliance tracking
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    Digital certification management
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    Real-time safety monitoring
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    Professional reporting tools
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Hero Visual Element */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-md bg-navy-100 text-navy-700 text-sm font-medium mb-4">
              <Shield className="w-4 h-4 mr-2" />
              Platform Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Everything You Need for <span className="text-navy-900">OSHA Compliance</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive safety management tools designed for modern organizations to maintain compliance effortlessly.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-navy-100 rounded-lg flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-navy-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Employee Management</h3>
                    <p className="text-gray-600">Centralized database for all employee certifications, training records, and compliance status.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                    <FileText className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital Certificates</h3>
                    <p className="text-gray-600">Generate professional certification documents and digital wallet cards for employees.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <BarChart3 className="w-6 h-6 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Automated Reporting</h3>
                    <p className="text-gray-600">Generate comprehensive compliance reports with one-click export to PDF, CSV, or Excel.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <Clock className="w-6 h-6 text-purple-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Reminders</h3>
                    <p className="text-gray-600">Automated notifications for certification renewals, training deadlines, and compliance requirements.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                    <TrendingUp className="w-6 h-6 text-orange-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Safety Analytics</h3>
                    <p className="text-gray-600">Interactive dashboards with real-time safety metrics and trend analysis for informed decision-making.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                    <Shield className="w-6 h-6 text-red-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Risk Management</h3>
                    <p className="text-gray-600">Comprehensive risk assessment tools with automated compliance gap analysis and recommendations.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-navy-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Safety Management?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of organizations using SafetySync.AI to streamline compliance, reduce risks, and focus on what matters most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleTrialClick}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg text-lg font-semibold"
            >
              Start Your Free Trial
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
              className="border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-lg text-lg font-semibold"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-navy-900 rounded-lg flex items-center justify-center mr-3">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-navy-900">SafetySync.AI</span>
              </div>
              <p className="text-gray-600">
                Professional OSHA compliance management for modern organizations.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#features" className="hover:text-navy-900">Features</a></li>
                <li><a href="/pricing" className="hover:text-navy-900">Pricing</a></li>
                <li><a href="/case-studies" className="hover:text-navy-900">Case Studies</a></li>
                <li><a href="/resources" className="hover:text-navy-900">Resources</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="/industry-research" className="hover:text-navy-900">Industry Research</a></li>
                <li><a href="/blog" className="hover:text-navy-900">Blog</a></li>
                <li><a href="/developer" className="hover:text-navy-900">Developer API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="/user-guide" className="hover:text-navy-900">User Guide</a></li>
                <li><p className="text-gray-500">Support: Available to paying customers</p></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2025 SafetySync.AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* Dialogs */}
      <TrialSignupDialog 
        isOpen={isTrialDialogOpen} 
        onOpenChange={setIsTrialDialogOpen}
        onSuccess={handleSignupSuccess}
      />
      
      <Toaster />
    </div>
  );
};

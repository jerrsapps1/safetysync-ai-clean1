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
  X,
  AlertTriangle,
  FileX
} from "lucide-react";
import { SafetySyncIcon } from "@/components/ui/safetysync-icon";

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
      // User is already logged in, go to workspace
      window.location.href = '/workspace';
    } else {
      // User needs to log in, go to workspace login form
      window.location.href = '/workspace';
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
      
      // Redirect new trial users to workspace
      if (pendingSignupData.type === 'trial') {
        setTimeout(() => {
          window.location.href = '/workspace';
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
    
    // Redirect to workspace after a short delay
    setTimeout(() => {
      window.location.href = '/workspace';
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
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white pt-32 pb-32 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center overflow-hidden">
        {/* Floating Background Icons */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 animate-float opacity-20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="absolute top-40 right-32 animate-float-delay-1 opacity-15">
            <Database className="w-5 h-5 text-blue-200" />
          </div>
          <div className="absolute bottom-32 left-40 animate-float-delay-2 opacity-25">
            <BarChart3 className="w-7 h-7 text-white" />
          </div>
          <div className="absolute top-60 right-20 animate-float-delay-3 opacity-20">
            <Users className="w-6 h-6 text-blue-100" />
          </div>
          <div className="absolute bottom-20 right-60 animate-float-delay-4 opacity-15">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="absolute top-32 right-1/2 animate-float-delay-5 opacity-20">
            <CheckCircle className="w-6 h-6 text-blue-200" />
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 text-blue-200 text-sm font-medium backdrop-blur-sm border border-blue-300/30">
              <Shield className="w-4 h-4 mr-2" />
              AI-Powered Compliance Platform
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            <span className="block text-white">Modern Safety Management,</span>
            <span className="block text-emerald-300">Made Simple</span>
          </h1>
          
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-12 leading-relaxed">
            Ditch the spreadsheets. SafetySync.AI brings all your safety and compliance workflows into one smart, powerful platform—so you can stay inspection-ready, reduce risk, and focus on what matters most.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              onClick={handleDemoClick}
              className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-2xl shadow hover:bg-gray-100 transition-all duration-200 hover:scale-105"
            >
              Book a Demo
            </Button>
            <Button 
              onClick={handleTrialClick}
              variant="outline"
              className="border border-white text-white font-semibold px-6 py-3 rounded-2xl hover:bg-white hover:text-blue-700 transition-all duration-200 hover:scale-105"
            >
              Get Started Free
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center text-sm text-blue-200 mb-8">
            <div className="flex items-center justify-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              No Credit Card Required
            </div>
            <div className="flex items-center justify-center">
              <Shield className="w-4 h-4 mr-2" />
              OSHA Compliant
            </div>
            <div className="flex items-center justify-center">
              <Timer className="w-4 h-4 mr-2" />
              Setup in Minutes
            </div>
          </div>
          
          <div className="text-center">
            <Button 
              onClick={() => setShowProductTour(true)}
              variant="link"
              className="text-blue-200 hover:text-white underline"
            >
              Take a Quick Tour
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Built for Safety Leaders Who Do It All
        </h2>
        <div className="grid md:grid-cols-2 gap-8 text-left">
          <div className="bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">Real-Time Dashboards</h3>
            <p>Stay ahead of inspections with live visibility into training, audits, and corrective actions.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">Mobile-First Access</h3>
            <p>Assign tasks and complete checklists from any device—field to office, online or offline.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">Training Management</h3>
            <p>Easily assign, track, and verify required safety trainings across teams, roles, and locations.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">Compliance Automation</h3>
            <p>Simplify OSHA recordkeeping, deadline reminders, and documentation—zero guesswork, full confidence.</p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              A Simple Solution to Stay <span className="text-emerald-600">OSHA-Compliant</span>
            </h2>
            <h3 className="text-xl text-gray-600 mb-8">
              Automated, Accurate, and Always Ready
            </h3>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-12">
              SafetySync.AI is the all-in-one compliance tracker designed specifically for companies like yours. We handle the tedious documentation work—so you don't have to.
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Automated Tracking & Reminders</h3>
                    <p className="text-gray-600">Eliminate manual paperwork and get automatic alerts for training expiration dates and certification renewals.</p>
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Centralized Database</h3>
                    <p className="text-gray-600">All your employee training records and certifications in one easy-to-navigate system.</p>
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Audit-Ready Reports</h3>
                    <p className="text-gray-600">Generate detailed, audit-proof reports in minutes—no more scrambling for documents when the inspectors arrive.</p>
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Integration</h3>
                    <p className="text-gray-600">Seamlessly integrates with your existing HR or training systems—no disruption to your workflow.</p>
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete Peace of Mind</h3>
                    <p className="text-gray-600">Trust that your compliance is always up-to-date and accurate, with secure data storage that meets industry standards.</p>
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Reduce Risk & Liability</h3>
                    <p className="text-gray-600">Minimize the risk of penalties by ensuring all employee training is properly documented and up-to-date.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-16">
            <Button 
              onClick={handleTrialClick}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg text-lg font-semibold"
            >
              Try It for Free – No Credit Card Required
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="bg-blue-50 py-16 px-6 text-center">
        <blockquote className="max-w-3xl mx-auto text-xl italic text-gray-700">
          "SafetySync.AI gave us back hours every week. No more hunting for reports or worrying about audits. It's everything I needed in one place."
        </blockquote>
        <p className="mt-4 font-semibold">— Safety Manager, Industrial Services</p>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6 text-center bg-gray-900 text-white">
        <h2 className="text-3xl font-bold mb-4">
          Get Peace of Mind—Without the Paper Chase
        </h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Join safety professionals across construction, manufacturing, and industrial services who trust SafetySync.AI to streamline their compliance.
        </p>
        <div className="flex justify-center gap-4">
          <Button 
            onClick={handleDemoClick}
            className="bg-white text-gray-900 font-semibold px-6 py-3 rounded-2xl hover:bg-gray-100 transition"
          >
            Book a Demo
          </Button>
          <Button 
            onClick={handleTrialClick}
            variant="outline"
            className="border border-white text-white font-semibold px-6 py-3 rounded-2xl hover:bg-white hover:text-gray-900 transition"
          >
            Start Free — No Credit Card Required
          </Button>
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
        onClose={() => setIsTrialDialogOpen(false)}
        onSubmit={handleSignupSuccess}
      />
      
      <DemoRequestDialog 
        isOpen={isDemoDialogOpen} 
        onClose={() => setIsDemoDialogOpen(false)}
        onSubmit={handleDemoSubmit}
      />
      
      <TermsAndConditions 
        isOpen={showTermsDialog}
        onClose={() => setShowTermsDialog(false)}
        onAccept={handleTermsAccept}
        userEmail={pendingSignupData?.userEmail || ''}
        planName={pendingSignupData?.planName || ''}
      />
      
      <ProductTour 
        isOpen={showProductTour}
        onClose={() => setShowProductTour(false)}
      />
      
      <LiveChatWidget 
        isOpen={showLiveChat}
        onClose={() => setShowLiveChat(false)}
      />
      
      <Toaster />
    </div>
  );
};

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { TrialSignupDialog } from "@/components/ui/trial-signup-dialog";
import { DemoRequestDialog } from "@/components/ui/demo-request-dialog";
import { Toaster } from "@/components/ui/toaster";
import { Link } from "wouter";

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
      // User is already logged in, go to client portal
      window.location.href = '/client-portal';
    } else {
      // User needs to log in, go to workspace login form
      window.location.href = '/workspace';
    }
  };



  const handleTrialSubmit = (data: any) => {
    // This is now handled directly in the TrialSignupDialog component
    // No need for terms dialog for simplified user experience
    console.log("Trial signup completed via direct registration");
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
            username: pendingSignupData.data.username,
            email: pendingSignupData.data.email,
            password: pendingSignupData.data.password,
            company: pendingSignupData.data.company,
            userTier: 'free_trial',
            subscriptionStatus: 'active',
            termsAccepted: true,
            termsAcceptedAt: new Date().toISOString()
          }),
        });

        // If registration was successful, automatically log the user in
        if (response.ok) {
          const loginResponse = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: pendingSignupData.data.username,
              password: pendingSignupData.data.password
            }),
          });

          if (loginResponse.ok) {
            const loginResult = await loginResponse.json();
            if (loginResult.success) {
              // Store the authentication token
              localStorage.setItem('auth_token', loginResult.token);
              console.log('User automatically logged in after registration');
            }
          }
        }
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
        title: "Account Created Successfully!",
        description: `Welcome to SafetySync.AI! Your ${pendingSignupData.type === 'trial' ? 'free trial' : 'demo'} is now active. You're being redirected to your workspace.`,
        duration: 4000,
      });
      
      // Redirect new trial users to workspace
      if (pendingSignupData.type === 'trial') {
        setTimeout(() => {
          window.location.href = '/workspace';
        }, 2000); // Longer delay to show success message
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "Unable to create your account. Please check your information and try again.",
        variant: "destructive",
        duration: 4000,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white font-sans">
      {/* Navigation */}
      <PageHeader />
      

      
      {/* Main Content with Sidebar Margin */}
      <div className="md:ml-16">

      {/* Hero Section */}
      <section className="relative pt-16 md:pt-32 pb-12 md:pb-32 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center overflow-hidden">
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
            <span className="inline-flex items-center px-6 py-3 rounded-full bg-black/20 backdrop-blur-sm border border-gray-800 text-emerald-300 text-sm font-medium">
              <Shield className="w-4 h-4 mr-2 text-emerald-400" />
              AI-Powered Compliance Platform
            </span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 md:mb-6">
            <span className="block text-white">Modern Safety Management,</span>
            <span className="block text-emerald-300">Made Simple</span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto mb-6 md:mb-8 lg:mb-12 leading-relaxed px-4">
            Ditch the spreadsheets. SafetySync.AI brings all your safety and compliance workflows into one smart, powerful platform—so you can stay inspection-ready, reduce risk, and focus on what matters most.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 md:mb-12 px-4">
            <Button 
              onClick={handleDemoClick}
              className="bg-black/20 backdrop-blur-sm border border-gray-800 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base rounded-2xl hover:bg-gray-800/30 hover:scale-105 transform transition-all duration-300"
            >
              Book a Demo
            </Button>
            <Button 
              onClick={handleTrialClick}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base rounded-2xl hover:scale-105 transform transition-all duration-300"
            >
              Get Started Free
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center text-xs sm:text-sm text-gray-300 mb-6 md:mb-8 px-4">
            <div className="flex items-center justify-center">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-emerald-400 flex-shrink-0" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center justify-center">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-emerald-400 flex-shrink-0" />
              <span>OSHA Compliant</span>
            </div>
            <div className="flex items-center justify-center">
              <Timer className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-emerald-400 flex-shrink-0" />
              <span>Setup in Minutes</span>
            </div>
          </div>
          
          <div className="text-center">
            <Button 
              onClick={() => setShowProductTour(true)}
              variant="link"
              className="text-gray-300 hover:text-emerald-400 underline transition-colors duration-300"
            >
              Take a Quick Tour
            </Button>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-12 md:py-16 px-4 md:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Sound Familiar?
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            You're juggling compliance requirements while trying to keep your team safe. These challenges shouldn't slow you down.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-16">
          <div className="bg-black/20 border border-gray-800 border-l-4 border-red-500 p-6 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-red-200 mb-2">Spreadsheet Chaos</h3>
                <p className="text-red-300">Training records scattered across multiple Excel files, outdated certifications slipping through cracks, and manual tracking eating up hours every week.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-black/20 border border-gray-800 border-l-4 border-red-500 p-6 rounded-lg">
            <div className="flex items-start">
              <Clock className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-red-200 mb-2">Last-Minute Panic</h3>
                <p className="text-red-300">OSHA inspections announced with little warning, scrambling to find documentation, and spending sleepless nights preparing compliance reports.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-black/20 border border-gray-800 border-l-4 border-red-500 p-6 rounded-lg">
            <div className="flex items-start">
              <FileX className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-red-200 mb-2">Paperwork Overload</h3>
                <p className="text-red-300">Drowning in forms, certificates, and training documentation that's impossible to organize, search, or access when you need it most.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-black/20 border border-gray-800 border-l-4 border-red-500 p-6 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-red-200 mb-2">Compliance Blind Spots</h3>
                <p className="text-red-300">Never knowing if you're truly compliant, missing renewal deadlines, and worrying about violations that could cost thousands in fines.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="inline-flex items-center px-6 py-3 bg-black/20 border border-gray-800 rounded-lg">
            <CheckCircle className="w-5 h-5 text-emerald-400 mr-2" />
            <span className="text-emerald-200 font-medium">There's a better way. Let us show you.</span>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-16 px-4 md:px-6 max-w-6xl mx-auto bg-black/20 border border-gray-800 rounded-lg">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Why SafetySync.AI is Different
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Stop fighting compliance chaos. Start confidently managing safety with automated tracking that works.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl hover:bg-gray-800/70 transition-all duration-300">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mr-4">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Automate Compliance Tracking</h3>
                <p className="text-gray-300">Track all OSHA-required training in one place and never worry about expired certifications again. Automated alerts keep you ahead of deadlines.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl hover:bg-gray-800/70 transition-all duration-300">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mr-4">
                <FileText className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Simplify Audits</h3>
                <p className="text-gray-300">Quickly generate reports that prove your compliance, so you're always audit-ready. No more scrambling when inspectors arrive.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl hover:bg-gray-800/70 transition-all duration-300">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mr-4">
                <Clock className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Stay Ahead of Deadlines</h3>
                <p className="text-gray-300">Receive reminders for upcoming training and expiration dates, helping you stay ahead of regulatory requirements before they become problems.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl hover:bg-gray-800/70 transition-all duration-300">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mr-4">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Reduce Risk & Liability</h3>
                <p className="text-gray-300">Minimize the risk of penalties by ensuring all employee training is properly documented and up-to-date with enterprise-grade security.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Objection Handling Section */}
      <section className="py-16 px-4 md:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Common Concerns? We've Got You Covered
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            We understand your hesitations. Here's how we address the most common concerns from safety managers like you.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-black/20 border border-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-200 mb-3">💰 Cost Concerns</h3>
            <p className="text-blue-300 mb-2 font-medium">"This might be too expensive for our budget."</p>
            <p className="text-blue-400 text-sm">We offer flexible pricing plans to match companies of all sizes. Most clients save more in avoided fines than they spend on our platform.</p>
          </div>
          
          <div className="bg-black/20 border border-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-200 mb-3">🔧 Complexity Worries</h3>
            <p className="text-blue-300 mb-2 font-medium">"Our team isn't tech-savvy enough."</p>
            <p className="text-blue-400 text-sm">Our software is easy to integrate and use—no steep learning curve. Most teams are up and running in under an hour.</p>
          </div>
          
          <div className="bg-black/20 border border-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-200 mb-3">🔗 Integration Issues</h3>
            <p className="text-blue-300 mb-2 font-medium">"Will this work with our current systems?"</p>
            <p className="text-blue-400 text-sm">Built to integrate seamlessly with existing HR and training platforms. We handle data migration so you don't lose anything.</p>
          </div>
          
          <div className="bg-black/20 border border-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-200 mb-3">⚙️ Customization Needs</h3>
            <p className="text-blue-300 mb-2 font-medium">"Our processes are very specific."</p>
            <p className="text-blue-400 text-sm">Highly customizable to match your unique workflows, industry requirements, and compliance standards. Built for flexibility.</p>
          </div>
          
          <div className="bg-black/20 border border-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-200 mb-3">🔐 Security Concerns</h3>
            <p className="text-blue-300 mb-2 font-medium">"How secure is our sensitive data?"</p>
            <p className="text-blue-400 text-sm">Enterprise-grade security with SOC 2 compliance, encrypted data storage, and regular security audits. Your data is safer than spreadsheets.</p>
          </div>
          
          <div className="bg-black/20 border border-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-200 mb-3">🤝 Trust & Reliability</h3>
            <p className="text-blue-300 mb-2 font-medium">"How do I know you're reliable?"</p>
            <p className="text-blue-400 text-sm">Trusted by 500+ companies with 99.9% uptime, dedicated customer success team, and proven track record in safety compliance.</p>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Button 
            onClick={handleTrialClick}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg text-lg font-semibold"
          >
            Still Have Questions? Start Your Free Trial
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 px-4 md:px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-white">
          Built for Safety Leaders Who Do It All
        </h2>
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 text-left">
          <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-2xl hover:bg-gray-800/70 transition-all duration-300">
            <h3 className="text-xl font-semibold mb-2 text-white">Real-Time Dashboards</h3>
            <p className="text-gray-300">Stay ahead of inspections with live visibility into training, audits, and corrective actions.</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-2xl hover:bg-gray-800/70 transition-all duration-300">
            <h3 className="text-xl font-semibold mb-2 text-white">Mobile-First Access</h3>
            <p className="text-gray-300">Assign tasks and complete checklists from any device—field to office, online or offline.</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-2xl hover:bg-gray-800/70 transition-all duration-300">
            <h3 className="text-xl font-semibold mb-2 text-white">Training Management</h3>
            <p className="text-gray-300">Easily assign, track, and verify required safety trainings across teams, roles, and locations.</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-2xl hover:bg-gray-800/70 transition-all duration-300">
            <h3 className="text-xl font-semibold mb-2 text-white">Compliance Automation</h3>
            <p className="text-gray-300">Simplify OSHA recordkeeping, deadline reminders, and documentation—zero guesswork, full confidence.</p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              A Simple Solution to Stay <span className="text-emerald-400">OSHA-Compliant</span>
            </h2>
            <h3 className="text-xl text-gray-200 mb-8">
              Automated, Accurate, and Always Ready
            </h3>
            <p className="text-lg text-gray-200 max-w-3xl mx-auto mb-12">
              SafetySync.AI is the all-in-one compliance tracker designed specifically for companies like yours. We handle the tedious documentation work—so you don't have to.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gray-700/40 rounded-xl border border-gray-600 hover:bg-gray-700/60 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-500/30 rounded-lg flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Automated Tracking & Reminders</h3>
                    <p className="text-gray-200">Eliminate manual paperwork and get automatic alerts for training expiration dates and certification renewals.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-700/40 rounded-xl border border-gray-600 hover:bg-gray-700/60 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-500/30 rounded-lg flex items-center justify-center mr-4">
                    <FileText className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Centralized Database</h3>
                    <p className="text-gray-200">All your employee training records and certifications in one easy-to-navigate system.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-700/40 rounded-xl border border-gray-600 hover:bg-gray-700/60 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500/30 rounded-lg flex items-center justify-center mr-4">
                    <BarChart3 className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Audit-Ready Reports</h3>
                    <p className="text-gray-200">Generate detailed, audit-proof reports in minutes—no more scrambling for documents when the inspectors arrive.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-700/40 rounded-xl border border-gray-600 hover:bg-gray-700/60 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-500/30 rounded-lg flex items-center justify-center mr-4">
                    <Clock className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Easy Integration</h3>
                    <p className="text-gray-200">Seamlessly integrates with your existing HR or training systems—no disruption to your workflow.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-700/40 rounded-xl border border-gray-600 hover:bg-gray-700/60 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-500/30 rounded-lg flex items-center justify-center mr-4">
                    <TrendingUp className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Complete Peace of Mind</h3>
                    <p className="text-gray-200">Trust that your compliance is always up-to-date and accurate, with secure data storage that meets industry standards.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-700/40 rounded-xl border border-gray-600 hover:bg-gray-700/60 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mr-4">
                    <Shield className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Reduce Risk & Liability</h3>
                    <p className="text-gray-300">Minimize the risk of penalties by ensuring all employee training is properly documented and up-to-date.</p>
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
      <section className="py-20 px-6 text-center bg-gray-700/50 text-white">
        <h2 className="text-3xl font-bold mb-4">
          Get Peace of Mind—Without the Paper Chase
        </h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-100">
          Join safety professionals across construction, manufacturing, and industrial services who trust SafetySync.AI to streamline their compliance.
        </p>
        <div className="flex justify-center gap-4">
          <Button 
            onClick={handleDemoClick}
            className="bg-gray-800/60 border border-gray-600 text-white font-semibold px-6 py-3 rounded-2xl hover:bg-gray-700/60 transition-all duration-200 hover:scale-105 hover:shadow-lg transform"
          >
            Book a Demo
          </Button>
          <Button 
            onClick={handleTrialClick}
            className="bg-emerald-500 text-white font-semibold px-6 py-3 rounded-2xl hover:bg-emerald-600 transition-all duration-200 hover:scale-105 hover:shadow-lg transform"
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
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg transform"
            >
              Start Your Free Trial
            </Button>
            <Button 
              onClick={handleDemoClick}
              className="bg-gray-800/60 border border-gray-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-700/60 transition-all duration-200 hover:scale-105 hover:shadow-lg transform"
            >
              Book a Demo
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
        onToggle={() => setShowLiveChat(!showLiveChat)}
        onClose={() => setShowLiveChat(false)}
      />
      
      <Toaster />
      </div>
    </div>
  );
};

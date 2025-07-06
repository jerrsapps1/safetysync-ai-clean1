import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/ui/navigation";
import { TrialSignupDialog } from "@/components/ui/trial-signup-dialog";
import { DemoRequestDialog } from "@/components/ui/demo-request-dialog";
import { 
  CheckCircle, 
  AlertCircle, 
  Database, 
  BarChart3, 
  Link as LinkIcon, 
  Shield, 
  Clock, 
  DollarSign,
  Lightbulb,
  ShieldCheck,
  Settings,
  Mail,
  Phone,
  Star
} from "lucide-react";

export default function LandingPage() {
  const [isTrialDialogOpen, setIsTrialDialogOpen] = useState(false);
  const [isDemoDialogOpen, setIsDemoDialogOpen] = useState(false);

  const handleTrialClick = () => {
    setIsTrialDialogOpen(true);
  };

  const handleDemoClick = () => {
    setIsDemoDialogOpen(true);
  };

  return (
    <div className="bg-white text-gray-900 font-sans">
      {/* Navigation */}
      <Navigation onTrialClick={handleTrialClick} onDemoClick={handleDemoClick} />

      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="block">Simplify Your</span>
              <span className="block text-green-400">OSHA Compliance</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Automate tracking, stay audit-ready, and protect your business with the easiest compliance management platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                onClick={handleTrialClick}
                className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors shadow-lg min-w-[200px]"
              >
                Start Your Free Trial
              </Button>
              <Button 
                onClick={handleDemoClick}
                variant="outline"
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-slate-900 transition-colors min-w-[200px]"
              >
                See How It Works
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
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
          </div>
        </div>
        
        {/* Hero Visual Element */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Is Your OSHA Compliance Tracking a Nightmare?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Keeping track of training requirements, certifications, and deadlines shouldn't be a burden. 
              If you're like most compliance officers, you're overwhelmed with manual processes.
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
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              A Simple Solution to Stay OSHA-Compliant
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              SafetySync Software is the all-in-one compliance tracker built for businesses like yours. 
              We handle the tedious documentation—so you don't have to.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Card className="bg-green-50 rounded-xl border border-green-200">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-900">Automated Tracking</h3>
                </div>
                <p className="text-green-700">Never miss a deadline with intelligent reminders and automatic renewal tracking for all certifications.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 rounded-xl border border-green-200">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-900">Centralized Database</h3>
                </div>
                <p className="text-green-700">All training records, certifications, and employee data in one secure, searchable location.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 rounded-xl border border-green-200">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-900">Instant Reports</h3>
                </div>
                <p className="text-green-700">Generate comprehensive, audit-ready reports in seconds with just one click.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 rounded-xl border border-green-200">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                    <LinkIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-900">Seamless Integration</h3>
                </div>
                <p className="text-green-700">Connect with your existing HR systems, LMS platforms, and training providers effortlessly.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 rounded-xl border border-green-200">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-900">Secure & Compliant</h3>
                </div>
                <p className="text-green-700">Bank-grade security with full data encryption and industry compliance standards.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 rounded-xl border border-green-200">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-900">24/7 Support</h3>
                </div>
                <p className="text-green-700">Expert support team available around the clock to help you stay compliant and productive.</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center">
            <Button 
              onClick={handleTrialClick}
              className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
            >
              Try It for Free – No Credit Card Required
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
              Here's why SafetySync is the right choice for your compliance needs.
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
                    <p className="text-gray-600">SafetySync integrates seamlessly with popular HR systems, LMS platforms, and training providers. Our API connections ensure zero workflow disruption during implementation.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Our Customers Trust Us—And You Can Too
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how SafetySync has transformed compliance management for businesses like yours.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="flex text-green-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                </div>
                <blockquote className="text-gray-700 mb-6">
                  "No more endless spreadsheets—everything is organized in one place. The automatic reminders ensure I never miss a certification deadline again."
                </blockquote>
                <div className="border-t border-gray-200 pt-6">
                  <p className="font-semibold text-gray-900">Sarah Johnson</p>
                  <p className="text-sm text-gray-600">Safety Manager, Construction Plus</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="flex text-green-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                </div>
                <blockquote className="text-gray-700 mb-6">
                  "With SafetySync, I can generate a comprehensive compliance report in just minutes. We've never felt more confident during an OSHA audit."
                </blockquote>
                <div className="border-t border-gray-200 pt-6">
                  <p className="font-semibold text-gray-900">Michael Chen</p>
                  <p className="text-sm text-gray-600">HR Manager, TechFlow Industries</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="flex text-green-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                </div>
                <blockquote className="text-gray-700 mb-6">
                  "The integration with our existing HR system was seamless. I have complete confidence that our data is secure and compliant."
                </blockquote>
                <div className="border-t border-gray-200 pt-6">
                  <p className="font-semibold text-gray-900">Lisa Rodriguez</p>
                  <p className="text-sm text-gray-600">Compliance Officer, MedTech Solutions</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Why Wait? Take Control of Your Compliance Today.
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Compliance doesn't have to be complicated. SafetySync makes it easy to manage OSHA training, 
            organize records, and prepare for audits—all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              onClick={handleTrialClick}
              className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors shadow-lg min-w-[200px]"
            >
              Start My Free Trial
            </Button>
            <Button 
              onClick={handleDemoClick}
              variant="outline"
              className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-600 hover:text-white transition-colors min-w-[200px]"
            >
              Schedule a Demo
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-8 justify-center text-sm text-gray-600">
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              14-day free trial
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              No setup fees
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">SafetySync</span>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                The complete OSHA compliance tracking solution that automates your safety management and keeps you audit-ready.
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
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-gray-400 mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} SafetySync Software. All rights reserved.
              </div>
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <a href="mailto:support@safetysync.com" className="text-gray-300 hover:text-white transition-colors">support@safetysync.com</a>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="text-gray-300">(555) 123-4567</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Dialogs */}
      <TrialSignupDialog isOpen={isTrialDialogOpen} onClose={() => setIsTrialDialogOpen(false)} />
      <DemoRequestDialog isOpen={isDemoDialogOpen} onClose={() => setIsDemoDialogOpen(false)} />
    </div>
  );
}

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Users,
  FileText,
  BarChart3,
  Shield,
  Bell,
  Settings
} from "lucide-react";

interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  content: React.ReactNode;
  duration: number;
  position: 'center' | 'left' | 'right' | 'top' | 'bottom';
  voiceoverScript?: string; // For future voiceover implementation
  keyPoints?: string[]; // Main points for voiceover
}

interface ProductTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export function ProductTour({ isOpen, onClose, onComplete }: ProductTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false); // For future voiceover feature

  const tourSteps: TourStep[] = [
    {
      id: "welcome",
      title: "Welcome to SafetySync.ai",
      description: "Your comprehensive AI-powered OSHA compliance management platform",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Shield className="w-20 h-20 mx-auto mb-4 text-blue-600" />
            <h2 className="text-2xl font-bold mb-3">Welcome to SafetySync.ai</h2>
            <p className="text-gray-700 text-lg mb-4">
              The first AI-powered OSHA compliance platform designed specifically for construction, 
              manufacturing, and industrial businesses. Let's explore how we revolutionize safety management.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Save 15+ hours weekly</strong> on compliance management while ensuring 
                100% OSHA regulatory adherence through intelligent automation.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg">
              <Users className="w-10 h-10 mx-auto mb-2 text-blue-600" />
              <div className="text-sm font-semibold">AI Employee Tracking</div>
              <div className="text-xs text-gray-600">Smart certification monitoring</div>
            </div>
            <div className="p-3 bg-gradient-to-b from-green-50 to-green-100 rounded-lg">
              <FileText className="w-10 h-10 mx-auto mb-2 text-green-600" />
              <div className="text-sm font-semibold">Instant Audit Reports</div>
              <div className="text-xs text-gray-600">One-click compliance docs</div>
            </div>
            <div className="p-3 bg-gradient-to-b from-purple-50 to-purple-100 rounded-lg">
              <BarChart3 className="w-10 h-10 mx-auto mb-2 text-purple-600" />
              <div className="text-sm font-semibold">Predictive Analytics</div>
              <div className="text-xs text-gray-600">Risk assessment AI</div>
            </div>
          </div>
        </div>
      ),
      duration: 12000,
      position: 'center'
    },
    {
      id: "dashboard",
      title: "AI-Powered Compliance Dashboard",
      description: "Revolutionary real-time compliance monitoring with predictive analytics",
      content: (
        <div className="space-y-5">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-5 rounded-lg border border-blue-200">
            <h3 className="font-bold mb-3 text-lg text-blue-800">AI Compliance Intelligence</h3>
            <div className="flex items-center gap-4 mb-3">
              <div className="text-4xl font-bold text-green-600">94%</div>
              <div className="flex-1">
                <Progress value={94} className="mb-1" />
                <div className="text-xs text-gray-600">Real-time compliance score calculated by AI</div>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              Our AI continuously monitors 47 different compliance factors across all departments, 
              automatically calculating risk levels and predicting compliance issues before they occur.
            </p>
            <div className="bg-white/70 rounded p-3 text-xs">
              <strong>AI Features:</strong> Predictive risk assessment • Automated gap analysis • 
              Smart training recommendations • Regulatory change alerts
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-8 h-8 mx-auto text-green-600 mb-1" />
              <div className="text-sm font-bold">156 Compliant</div>
              <div className="text-xs text-gray-600">Active certifications</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <Bell className="w-8 h-8 mx-auto text-yellow-600 mb-1" />
              <div className="text-sm font-bold">8 Expiring Soon</div>
              <div className="text-xs text-gray-600">Auto-alerts sent</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <BarChart3 className="w-8 h-8 mx-auto text-blue-600 mb-1" />
              <div className="text-sm font-bold">23 Insights</div>
              <div className="text-xs text-gray-600">AI recommendations</div>
            </div>
          </div>
        </div>
      ),
      duration: 15000,
      position: 'center'
    },
    {
      id: "employees",
      title: "Intelligent Employee Management",
      description: "AI-powered workforce compliance with automated tracking and predictions",
      content: (
        <div className="space-y-5">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-bold mb-3 text-lg text-green-800">Smart Employee Compliance</h3>
            <p className="text-sm text-gray-700 mb-3">
              Every employee gets personalized compliance profiles with AI-driven training recommendations, 
              automated certification tracking, and predictive renewal alerts. No more manual spreadsheets or missed renewals.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white/70 p-2 rounded">
                <strong>AI Features:</strong> Predictive training needs • Smart scheduling • Risk profiling
              </div>
              <div className="bg-white/70 p-2 rounded">
                <strong>Automation:</strong> Cert renewal alerts • Training assignments • Compliance scoring
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { name: "Sarah Johnson", dept: "Construction", status: "compliant", training: "OSHA 30-Hour Construction", date: "Valid until Dec 2024", score: 96, certCount: 8 },
              { name: "Mike Chen", dept: "Manufacturing", status: "pending", training: "Fall Protection Certification", date: "Due in 15 days", score: 82, certCount: 5 },
              { name: "Lisa Rodriguez", dept: "General Industry", status: "expired", training: "Hazard Communication", date: "Expired 3 days ago", score: 74, certCount: 3 }
            ].map((emp, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{emp.name}</div>
                  <div className="text-sm text-gray-600">{emp.dept} • {emp.training}</div>
                  <div className="text-xs text-gray-500 mt-1">{emp.certCount} active certifications</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-sm font-bold text-blue-600">{emp.score}%</div>
                    <Badge variant={emp.status === 'compliant' ? 'default' : emp.status === 'pending' ? 'secondary' : 'destructive'}>
                      {emp.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">{emp.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
      duration: 18000,
      position: 'center'
    },
    {
      id: "reports",
      title: "AI-Generated Audit Reports",
      description: "Revolutionary one-click compliance reporting with AI-powered insights",
      content: (
        <div className="space-y-5">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-5 rounded-lg border border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-12 h-12 text-blue-600" />
              <div>
                <h3 className="font-bold text-lg text-green-800">AI-Powered Report Generation</h3>
                <p className="text-sm text-gray-600">Audit-ready reports in seconds, not hours</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              Our AI analyzes your entire compliance database and generates comprehensive, 
              audit-ready reports that automatically highlight risks, gaps, and recommendations. 
              Perfect for OSHA inspections, insurance audits, and internal reviews.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/70 p-3 rounded text-xs">
                <strong>AI Analysis:</strong> Risk assessment • Gap identification • Trend analysis • Predictive insights
              </div>
              <div className="bg-white/70 p-3 rounded text-xs">
                <strong>Report Types:</strong> Full compliance • Department-specific • Training status • Audit-ready
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-xs">📄 PDF Reports</Button>
              <Button size="sm" variant="outline" className="text-xs">📊 Excel Analytics</Button>
              <Button size="sm" variant="outline" className="text-xs">📋 CSV Data</Button>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Sample Report Features:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
              <div>✓ Executive compliance summary</div>
              <div>✓ Department-by-department analysis</div>
              <div>✓ Employee certification matrix</div>
              <div>✓ Training completion tracking</div>
              <div>✓ Risk assessment scoring</div>
              <div>✓ Regulatory compliance gaps</div>
              <div>✓ Renewal timeline projections</div>
              <div>✓ AI-powered recommendations</div>
            </div>
          </div>
        </div>
      ),
      duration: 16000,
      position: 'center'
    },
    {
      id: "automation",
      title: "AI-Powered Automation Engine",
      description: "Revolutionary AI that works 24/7 to maintain perfect compliance",
      content: (
        <div className="space-y-5">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-5 rounded-lg border border-purple-200">
            <div className="flex items-center gap-3 mb-3">
              <Settings className="w-12 h-12 text-purple-600" />
              <div>
                <h3 className="font-bold text-lg text-purple-800">Intelligent Automation</h3>
                <p className="text-sm text-gray-600">AI that never sleeps, never misses deadlines</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              Our AI continuously monitors your entire workforce, automatically scheduling training, 
              sending personalized reminders, and even predicting future compliance needs. 
              It's like having a dedicated compliance manager working 24/7 for your business.
            </p>
            <div className="grid grid-cols-1 gap-3 mb-4">
              <div className="bg-white/70 p-3 rounded text-xs">
                <strong>Smart Scheduling:</strong> AI automatically books training sessions based on employee availability, 
                certification expiry dates, and seasonal workload patterns
              </div>
              <div className="bg-white/70 p-3 rounded text-xs">
                <strong>Predictive Alerts:</strong> System predicts compliance risks 90 days in advance, 
                automatically creating action plans to prevent violations
              </div>
              <div className="bg-white/70 p-3 rounded text-xs">
                <strong>Personalized Communication:</strong> AI crafts personalized reminder messages 
                for each employee based on their role, training history, and preferred communication style
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-l-4 border-yellow-400">
              <Bell className="w-6 h-6 text-yellow-600" />
              <div className="flex-1">
                <div className="font-semibold text-yellow-800">AI Prediction Alert</div>
                <div className="text-sm text-gray-700">System predicts 8 employees will need Fall Protection renewal in Q2 2025</div>
                <div className="text-xs text-gray-600 mt-1">✓ Training sessions auto-scheduled • ✓ Instructors notified • ✓ Reminders sent</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-400">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div className="flex-1">
                <div className="font-semibold text-green-800">Smart Completion</div>
                <div className="text-sm text-gray-700">AI detected Mike's training completion via instructor portal integration</div>
                <div className="text-xs text-gray-600 mt-1">✓ Certificate generated • ✓ Compliance score updated • ✓ Next training scheduled</div>
              </div>
            </div>
          </div>
        </div>
      ),
      duration: 20000,
      position: 'center'
    },
    {
      id: "complete",
      title: "Experience the SafetySync.ai Difference",
      description: "The future of OSHA compliance management is here",
      content: (
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold">AI</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to the Future of Safety
          </h2>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200 max-w-2xl mx-auto">
            <p className="text-gray-700 text-lg mb-4">
              You've just discovered the most advanced OSHA compliance platform ever created. 
              SafetySync.ai doesn't just track compliance—it predicts it, automates it, and perfects it.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div className="text-left">
                <strong className="text-blue-700">🚀 Revolutionary AI:</strong> First platform to use predictive compliance analytics
              </div>
              <div className="text-left">
                <strong className="text-green-700">⚡ Instant Results:</strong> 15+ hours saved weekly on compliance tasks
              </div>
              <div className="text-left">
                <strong className="text-purple-700">🛡️ 100% Compliance:</strong> Zero OSHA violations with our AI monitoring
              </div>
              <div className="text-left">
                <strong className="text-orange-700">📊 Enterprise Ready:</strong> Scales from 10 to 10,000+ employees
              </div>
            </div>
            <div className="bg-white/70 rounded-lg p-4 text-sm text-gray-700">
              <strong>What Makes Us Different:</strong> While others offer basic tracking, SafetySync.ai provides 
              intelligent automation, predictive analytics, and AI-powered insights that transform how businesses 
              manage safety compliance. Our platform learns your business patterns and proactively prevents violations.
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8 max-w-md mx-auto">
            <Button variant="outline" onClick={onClose} className="text-blue-600 border-blue-600 hover:bg-blue-50">
              🔍 Explore Platform
            </Button>
            <Button onClick={() => { onComplete?.(); onClose(); }} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              🚀 Start Free Trial
            </Button>
          </div>
          <div className="text-xs text-gray-500 mt-4">
            💡 Pro Tip: Future voiceover tours will provide even deeper insights into our AI capabilities
          </div>
        </div>
      ),
      duration: 0,
      position: 'center'
    }
  ];

  useEffect(() => {
    if (!isPlaying || currentStep >= tourSteps.length - 1) return;
    
    const stepDuration = tourSteps[currentStep].duration;
    if (stepDuration === 0) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setCurrentStep(curr => curr + 1);
          return 0;
        }
        return prev + (100 / (stepDuration / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, currentStep, tourSteps]);

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setProgress(0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setProgress(0);
    }
  };

  const restart = () => {
    setCurrentStep(0);
    setProgress(0);
    setIsPlaying(false);
  };

  if (!isOpen) return null;

  const currentTourStep = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;
  
  // Calculate progress: show 100% when on final step, otherwise calculate normally
  const calculateProgress = () => {
    if (isLastStep) return 100;
    return ((currentStep + (progress / 100)) / (tourSteps.length - 1)) * 100;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Product Tour
                {audioEnabled && (
                  <Badge variant="secondary" className="text-xs">
                    🎧 Audio Ready
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Step {currentStep + 1} of {tourSteps.length} - {currentTourStep.title}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="text-purple-600 hover:text-purple-700"
                title="Future voiceover feature"
              >
                🎙️
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Progress</span>
              <span>{Math.round(calculateProgress())}%</span>
            </div>
            <Progress value={calculateProgress()} />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step Content */}
          <div className="min-h-[300px]">
            {currentTourStep.content}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={isLastStep}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button variant="outline" size="sm" onClick={restart}>
                <RotateCcw className="w-4 h-4" />
                Restart
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                size="sm"
                onClick={nextStep}
                disabled={isLastStep}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center gap-2">
            {tourSteps.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-blue-600'
                    : index < currentStep
                    ? 'bg-green-600'
                    : 'bg-gray-300'
                }`}
                onClick={() => {
                  setCurrentStep(index);
                  setProgress(0);
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
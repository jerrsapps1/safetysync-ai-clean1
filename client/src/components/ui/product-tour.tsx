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
              The revolutionary AI-powered training documentation platform designed to become the largest 
              collection of training documents for companies. Built with enterprise-grade security and streamlined signup.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Save 15+ hours weekly</strong> on training compliance while ensuring companies 
                pass OSHA inspections without training-related citations.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg">
              <Users className="w-10 h-10 mx-auto mb-2 text-blue-600" />
              <div className="text-sm font-semibold">Enterprise Authentication</div>
              <div className="text-xs text-gray-600">Professional validation for all users</div>
            </div>
            <div className="p-3 bg-gradient-to-b from-green-50 to-green-100 rounded-lg">
              <FileText className="w-10 h-10 mx-auto mb-2 text-green-600" />
              <div className="text-sm font-semibold">AI Document Processing</div>
              <div className="text-xs text-gray-600">Revolutionary training doc extraction</div>
            </div>
            <div className="p-3 bg-gradient-to-b from-purple-50 to-purple-100 rounded-lg">
              <BarChart3 className="w-10 h-10 mx-auto mb-2 text-purple-600" />
              <div className="text-sm font-semibold">Employee-Centric QR</div>
              <div className="text-xs text-gray-600">Mobile verification system</div>
            </div>
          </div>
        </div>
      ),
      duration: 12000,
      position: 'center'
    },
    {
      id: "dashboard",
      title: "Revolutionary AI Document Processing", 
      description: "Transform training sign-in sheets into structured compliance data automatically",
      content: (
        <div className="space-y-5">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-5 rounded-lg border border-blue-200">
            <h3 className="font-bold mb-3 text-lg text-blue-800">AI Document Processing Engine</h3>
            <div className="flex items-center gap-4 mb-3">
              <div className="text-4xl font-bold text-green-600">97%</div>
              <div className="flex-1">
                <Progress value={97} className="mb-1" />
                <div className="text-xs text-gray-600">Accuracy rate for training document extraction</div>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              Upload training sign-in sheets or certification documents and watch our AI 
              instantly extract employee names, training details, instructor credentials, and compliance standards.
            </p>
            <div className="bg-white/70 rounded p-3 text-xs">
              <strong>AI Capabilities:</strong> Multi-layer PDF extraction • Intelligent data recognition • 
              Automatic certificate generation • Real-time verification
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-8 h-8 mx-auto text-green-600 mb-1" />
              <div className="text-sm font-bold">PDF Processing</div>
              <div className="text-xs text-gray-600">Multi-layer extraction</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <Bell className="w-8 h-8 mx-auto text-yellow-600 mb-1" />
              <div className="text-sm font-bold">Auto Detection</div>
              <div className="text-xs text-gray-600">Smart data recognition</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <BarChart3 className="w-8 h-8 mx-auto text-blue-600 mb-1" />
              <div className="text-sm font-bold">Instant Certs</div>
              <div className="text-xs text-gray-600">Generated automatically</div>
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
              Employee-centric approach with QR code verification. Each employee has their own 
              profile with digital wallet cards that replace physical certification cards for easy verification.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white/70 p-2 rounded">
                <strong>QR Features:</strong> Mobile verification • Digital wallet cards • Real-time access
              </div>
              <div className="bg-white/70 p-2 rounded">
                <strong>Training Focus:</strong> Document processing • Certificate generation • OSHA compliance
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
              Revolutionary AI document processing extracts training data from PDFs and generates 
              inspector-ready documentation. Ensures companies pass OSHA inspections without training-related citations.
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
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center gap-3 mb-3">
              <Settings className="w-10 h-10 text-purple-600" />
              <div>
                <h3 className="font-bold text-lg text-purple-800">24/7 AI Automation</h3>
                <p className="text-sm text-gray-600">Never miss deadlines, prevent violations automatically</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              AI monitors your workforce, schedules training, sends reminders, and predicts compliance needs automatically.
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-white/70 p-2 rounded text-center">
                <strong>Smart Scheduling</strong><br/>Auto-books sessions
              </div>
              <div className="bg-white/70 p-2 rounded text-center">
                <strong>Predictive Alerts</strong><br/>90-day forecasting
              </div>
              <div className="bg-white/70 p-2 rounded text-center">
                <strong>Personal Comms</strong><br/>Custom messages
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-l-4 border-yellow-400">
              <Bell className="w-5 h-5 text-yellow-600" />
              <div className="flex-1">
                <div className="font-semibold text-yellow-800 text-sm">AI Prediction</div>
                <div className="text-xs text-gray-700">8 renewals needed Q2</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-400">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <div className="font-semibold text-green-800 text-sm">Auto-Complete</div>
                <div className="text-xs text-gray-700">Cert generated instantly</div>
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
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-3">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold">AI</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to the Future of Safety
          </h2>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200 max-w-xl mx-auto">
            <p className="text-gray-700 mb-3">
              SafetySync.ai doesn't just track compliance—it predicts it, automates it, and perfects it.
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div className="text-left">
                <strong className="text-blue-700">🚀 Revolutionary AI:</strong> Predictive analytics
              </div>
              <div className="text-left">
                <strong className="text-green-700">⚡ Save Time:</strong> 15+ hours weekly
              </div>
              <div className="text-left">
                <strong className="text-purple-700">🛡️ Zero Violations:</strong> AI monitoring
              </div>
              <div className="text-left">
                <strong className="text-orange-700">📊 Enterprise Ready:</strong> Unlimited scale
              </div>
            </div>
            <div className="bg-white/70 rounded-lg p-3 text-sm text-gray-700">
              <strong>What Makes Us Different:</strong> Intelligent automation and predictive analytics that transform safety compliance.
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-6 max-w-sm mx-auto">
            <Button variant="outline" onClick={onClose} className="text-blue-600 border-blue-600 hover:bg-blue-50 text-sm">
              🔍 Explore Platform
            </Button>
            <Button onClick={() => { onComplete?.(); onClose(); }} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm">
              🚀 Start Free Trial
            </Button>
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
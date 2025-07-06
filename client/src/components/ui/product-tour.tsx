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

  const tourSteps: TourStep[] = [
    {
      id: "welcome",
      title: "Welcome to SafetySync",
      description: "Your comprehensive OSHA compliance management platform",
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h2 className="text-2xl font-bold mb-2">Welcome to SafetySync</h2>
            <p className="text-gray-600">
              Let's take a quick tour to show you how SafetySync simplifies OSHA compliance
              and keeps your workplace safe.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="text-sm font-medium">Employee Tracking</div>
            </div>
            <div>
              <FileText className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="text-sm font-medium">Instant Reports</div>
            </div>
            <div>
              <BarChart3 className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <div className="text-sm font-medium">Real-time Analytics</div>
            </div>
          </div>
        </div>
      ),
      duration: 8000,
      position: 'center'
    },
    {
      id: "dashboard",
      title: "Compliance Dashboard",
      description: "Get a complete overview of your compliance status",
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Real-time Compliance Score</h3>
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold text-green-600">94%</div>
              <Progress value={94} className="flex-1" />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Track your organization's compliance in real-time with automated calculations
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-green-50 rounded">
              <CheckCircle className="w-6 h-6 mx-auto text-green-600 mb-1" />
              <div className="text-sm font-medium">42 Compliant</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded">
              <Bell className="w-6 h-6 mx-auto text-yellow-600 mb-1" />
              <div className="text-sm font-medium">3 Expiring Soon</div>
            </div>
          </div>
        </div>
      ),
      duration: 10000,
      position: 'center'
    },
    {
      id: "employees",
      title: "Employee Management",
      description: "Track every employee's training and certification status",
      content: (
        <div className="space-y-4">
          <h3 className="font-semibold">Employee Compliance Tracking</h3>
          <div className="space-y-3">
            {[
              { name: "Sarah Johnson", status: "compliant", training: "OSHA 30-Hour", date: "Valid until Dec 2024" },
              { name: "Mike Chen", status: "pending", training: "Fall Protection", date: "Due in 15 days" },
              { name: "Lisa Rodriguez", status: "expired", training: "Hazard Communication", date: "Expired 3 days ago" }
            ].map((emp, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium">{emp.name}</div>
                  <div className="text-sm text-gray-600">{emp.training}</div>
                </div>
                <div className="text-right">
                  <Badge variant={emp.status === 'compliant' ? 'default' : emp.status === 'pending' ? 'secondary' : 'destructive'}>
                    {emp.status}
                  </Badge>
                  <div className="text-xs text-gray-500 mt-1">{emp.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
      duration: 12000,
      position: 'center'
    },
    {
      id: "reports",
      title: "One-Click Reports",
      description: "Generate comprehensive compliance reports instantly",
      content: (
        <div className="space-y-4">
          <h3 className="font-semibold">Instant Report Generation</h3>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
            <FileText className="w-8 h-8 text-blue-600 mb-2" />
            <h4 className="font-medium mb-2">Full Compliance Report</h4>
            <p className="text-sm text-gray-600 mb-3">
              Generate audit-ready reports with all employee data, training records, and compliance metrics
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">PDF</Button>
              <Button size="sm" variant="outline">Excel</Button>
              <Button size="sm" variant="outline">CSV</Button>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            ✓ Automated data collection<br/>
            ✓ Real-time compliance calculations<br/>
            ✓ Multiple export formats<br/>
            ✓ Audit-ready formatting
          </div>
        </div>
      ),
      duration: 10000,
      position: 'center'
    },
    {
      id: "alerts",
      title: "Smart Notifications",
      description: "Never miss important deadlines with automated alerts",
      content: (
        <div className="space-y-4">
          <h3 className="font-semibold">Automated Alert System</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
              <Bell className="w-5 h-5 text-yellow-600" />
              <div>
                <div className="font-medium">3 certifications expiring in 30 days</div>
                <div className="text-sm text-gray-600">Fall Protection, OSHA 10-Hour, First Aid</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium">New training completed</div>
                <div className="text-sm text-gray-600">Sarah Johnson completed Hazard Communication</div>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Set custom reminder periods, get email notifications, and ensure nothing falls through the cracks.
          </div>
        </div>
      ),
      duration: 8000,
      position: 'center'
    },
    {
      id: "complete",
      title: "You're Ready to Go!",
      description: "Start managing your OSHA compliance with confidence",
      content: (
        <div className="text-center space-y-4">
          <CheckCircle className="w-16 h-16 mx-auto text-green-600" />
          <h2 className="text-2xl font-bold">You're All Set!</h2>
          <p className="text-gray-600">
            You now know the basics of SafetySync. Start by adding your employees
            and their current training status to get your compliance score.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Button variant="outline" onClick={onClose}>
              Explore More
            </Button>
            <Button onClick={() => { onComplete?.(); onClose(); }}>
              Start Using SafetySync Software
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Product Tour
              </CardTitle>
              <CardDescription>
                Step {currentStep + 1} of {tourSteps.length} - {currentTourStep.title}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Progress</span>
              <span>{Math.round(((currentStep + (progress / 100)) / tourSteps.length) * 100)}%</span>
            </div>
            <Progress value={((currentStep + (progress / 100)) / tourSteps.length) * 100} />
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
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  FileText, 
  BarChart3, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  X,
  Play
} from "lucide-react";

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: any;
  content: string;
  actionText: string;
  actionRoute?: string;
  estimatedTime: string;
  importance: "critical" | "recommended" | "optional";
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "Company Profile Setup",
    description: "Establish your company identity and customize your platform experience",
    icon: Building2,
    content: "Set up your company profile by uploading your logo, entering company details, and selecting your industry type. This customizes the entire platform to match your business needs and ensures you see relevant OSHA standards and compliance requirements.",
    actionText: "Set Up Company Profile",
    actionRoute: "/workspace/company-profile",
    estimatedTime: "3-5 minutes",
    importance: "critical"
  },
  {
    id: 2,
    title: "Employee Management",
    description: "Import or add your employees to begin tracking their training and certifications",
    icon: Users,
    content: "Add your employees to the system either by importing a CSV file with employee data or by manually entering employee information. This creates the foundation for all training tracking, certification management, and compliance reporting.",
    actionText: "Add Employees",
    actionRoute: "/workspace/employee-management",
    estimatedTime: "5-10 minutes",
    importance: "critical"
  },
  {
    id: 3,
    title: "Training Standards Configuration",
    description: "Configure OSHA and industry-specific training requirements for your workforce",
    icon: ShieldCheck,
    content: "Select the OSHA standards that apply to your industry, set up training requirements by job role, and configure compliance timelines. This ensures your training tracking aligns with actual regulatory requirements.",
    actionText: "Configure Standards",
    actionRoute: "/workspace/compliance-manager",
    estimatedTime: "10-15 minutes",
    importance: "critical"
  },
  {
    id: 4,
    title: "Document Upload & Processing",
    description: "Upload existing training records and let AI extract employee training data",
    icon: FileText,
    content: "Upload your existing training sign-in sheets, certificates, and training records. Our AI will automatically extract employee information, training dates, and certification details to populate your compliance database.",
    actionText: "Upload Documents",
    actionRoute: "/workspace/document-hub",
    estimatedTime: "15-20 minutes",
    importance: "recommended"
  },
  {
    id: 5,
    title: "Dashboard & Reporting Tour",
    description: "Learn how to monitor compliance, generate reports, and track training progress",
    icon: BarChart3,
    content: "Explore your compliance dashboard, learn how to generate audit-ready reports, set up automated alerts for expiring certifications, and understand how to use the platform for ongoing compliance management.",
    actionText: "Take Dashboard Tour",
    actionRoute: "/workspace/dashboard",
    estimatedTime: "5-10 minutes",
    importance: "recommended"
  }
];

interface ClientOnboardingTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onStepComplete: (stepId: number) => void;
  completedSteps: number[];
}

export default function ClientOnboardingTutorial({ 
  isOpen, 
  onClose, 
  onStepComplete, 
  completedSteps 
}: ClientOnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isMinimized, setIsMinimized] = useState(false);

  const currentStepData = onboardingSteps.find(step => step.id === currentStep);
  const progress = (completedSteps.length / onboardingSteps.length) * 100;
  const totalEstimatedTime = "35-60 minutes";

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "critical": return "bg-red-500/20 text-red-300 border-red-500/30";
      case "recommended": return "bg-blue-500/20 text-white border-blue-500/30";
      case "optional": return "bg-blue-400/20 text-white border-blue-400/30";
      default: return "bg-blue-400/20 text-white border-blue-400/30";
    }
  };

  const handleStepAction = () => {
    if (currentStepData?.actionRoute) {
      // Navigate to the specific page
      window.location.href = currentStepData.actionRoute;
      onStepComplete(currentStep);
    }
  };

  const handleNext = () => {
    if (currentStep < onboardingSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkipForNow = () => {
    onClose();
  };

  if (!currentStepData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-blue-800 border-blue-600 text-white">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
              <Play className="w-5 h-5 text-violet-400" />
              Company Setup Guide
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-blue-100 hover:text-blue-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Progress Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white">
                Step {currentStep} of {onboardingSteps.length}
              </span>
              <span className="text-white">
                Total time: {totalEstimatedTime}
              </span>
            </div>
            <Progress value={progress} className="h-2 bg-blue-700" />
            <div className="text-xs text-white">
              {completedSteps.length} of {onboardingSteps.length} steps completed ({Math.round(progress)}%)
            </div>
          </div>
        </DialogHeader>

        {/* Current Step Content */}
        <div className="space-y-6">
          {/* Step Header */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <currentStepData.icon className="w-6 h-6 text-violet-400" />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white">{currentStepData.title}</h3>
                <Badge className={`text-xs ${getImportanceColor(currentStepData.importance)}`}>
                  {currentStepData.importance}
                </Badge>
                {completedSteps.includes(currentStep) && (
                  <CheckCircle className="w-4 h-4 text-violet-400" />
                )}
              </div>
              <p className="text-white text-sm">{currentStepData.description}</p>
              <div className="text-xs text-white">
                Estimated time: {currentStepData.estimatedTime}
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-blue-700/50 rounded-lg p-4 border border-blue-600">
            <p className="text-blue-200 leading-relaxed">
              {currentStepData.content}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-blue-600">
            <Button
              onClick={handleStepAction}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {currentStepData.actionText}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="border-blue-500 text-white hover:bg-blue-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <Button
                variant="outline"
                onClick={handleNext}
                disabled={currentStep === onboardingSteps.length}
                className="border-blue-500 text-white hover:bg-blue-700"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Skip Options */}
          <div className="flex justify-center pt-2">
            <Button
              variant="ghost"
              onClick={handleSkipForNow}
              className="text-blue-100 hover:text-blue-200 text-sm"
            >
              Skip for now (return anytime from Settings)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
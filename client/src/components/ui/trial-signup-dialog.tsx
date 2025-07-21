import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, CheckCircle, Eye, EyeOff } from "lucide-react";
import PasswordStrengthIndicator from "@/components/PasswordStrengthIndicator";

interface TrialSignupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

export function TrialSignupDialog({ isOpen, onClose, onSubmit }: TrialSignupDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordStrong, setIsPasswordStrong] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    company: "",
    password: "",
    message: "",
    leadType: "trial"
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    // Username validation - professional standards
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username = "Username can only contain letters, numbers, hyphens, and underscores";
    } else if (formData.username.length > 30) {
      newErrors.username = "Username must be less than 30 characters";
    }
    
    // Email validation - professional standards
    if (!formData.email.trim()) {
      newErrors.email = "Work email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = "Please enter a valid work email address";
    } else if (formData.email.includes("@gmail.com") || formData.email.includes("@yahoo.com") || formData.email.includes("@hotmail.com")) {
      newErrors.email = "Please use your work email address (not personal email)";
    }
    
    // Company validation
    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
    } else if (formData.company.trim().length < 2) {
      newErrors.company = "Company name must be at least 2 characters";
    }

    // Password validation - enterprise standards
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (!isPasswordStrong) {
      newErrors.password = "Password must meet all security requirements below";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call the parent component's submit handler
      if (onSubmit) {
        onSubmit(formData);
      }
      
      // Close the dialog after successful submission
      handleClose();
    } catch (error) {
      console.error("Error during submission:", error);
      toast({
        title: "Submission Failed", 
        description: "Unable to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleClose = () => {
    setFormData({ name: "", username: "", email: "", company: "", password: "", message: "", leadType: "trial" });
    setErrors({});
    setShowPassword(false);
    onClose();
  };



  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start Your Free Trial</DialogTitle>
          <DialogDescription>
            Get full access to SafetySync.ai for 14 days. No credit card required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="John Smith"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
              placeholder="john_smith or john-smith"
              className={errors.username ? "border-red-500" : ""}
              maxLength={30}
            />
            <p className="text-xs text-gray-500">3-30 characters. Letters, numbers, hyphens, and underscores only.</p>
            {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Work Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value.toLowerCase())}
              placeholder="john@company.com"
              className={errors.email ? "border-red-500" : ""}
              autoComplete="work email"
            />
            <p className="text-xs text-gray-500">Use your work email address for account security</p>
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company">Company Name *</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
              placeholder="Your Company"
              className={errors.company ? "border-red-500" : ""}
            />
            {errors.company && <p className="text-sm text-red-500">{errors.company}</p>}
          </div>
          
          
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Create a secure password"
                className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            <PasswordStrengthIndicator 
              password={formData.password} 
              onStrengthChange={setIsPasswordStrong}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">How can we help? (Optional)</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="Tell us about your compliance needs..."
              rows={3}
            />
          </div>
          
          <div className="flex space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Starting Trial...
                </>
              ) : (
                "Start Free Trial"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

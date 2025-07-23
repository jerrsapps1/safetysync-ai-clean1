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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordStrong, setIsPasswordStrong] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    company: "",
    password: "",
    confirmPassword: "",
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
      newErrors.email = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Company validation


    // Password validation - enterprise standards
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (!isPasswordStrong) {
      newErrors.password = "Password must meet all security requirements below";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Password confirmation validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      console.log("🔐 TRIAL SIGNUP: Starting registration process", { 
        username: formData.username, 
        email: formData.email, 
        company: formData.company,
        nameLength: formData.name.length,
        passwordLength: formData.password.length 
      });
      
      // Prepare registration data
      const registrationData = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        name: formData.name.trim(),
        company: formData.company.trim() || null
      };
      
      console.log("🔐 TRIAL SIGNUP: Sending registration data", registrationData);
      
      // Direct API call to register the user
      const response = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(registrationData)
      });

      console.log("🔐 TRIAL SIGNUP: Registration response received", response);

      // Don't auto-login anymore - require email verification first
      console.log("🔐 TRIAL SIGNUP: Registration complete, verification email sent");

      toast({
        title: "Account Created! Check Your Email 📧",
        description: "We've sent a verification email to your inbox. Please check your email and click the verification link to access your workspace.",
        duration: 8000,
      });
      
      // Close dialog first
      handleClose();
      
      // Show warm popup about checking email
      setTimeout(() => {
        toast({
          title: "📬 Check Your Email",
          description: `We sent a verification link to ${formData.email}. Click the link to verify your account and access SafetySync.AI!`,
          duration: 10000,
        });
      }, 2000);
      
    } catch (error: any) {
      console.error("🔐 TRIAL SIGNUP: Registration failed", error);
      console.error("🔐 TRIAL SIGNUP: Error details", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      let errorMessage = "Unable to create your account. Please try again.";
      
      if (error.message) {
        // Extract useful error message from API response
        if (error.message.includes("duplicate key value violates unique constraint")) {
          if (error.message.includes("users_email_unique")) {
            errorMessage = "An account with this email already exists. Please try logging in instead.";
          } else if (error.message.includes("users_username_unique")) {
            errorMessage = "Username is already taken. Please choose a different username.";
          }
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Registration Failed", 
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
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
    setFormData({ name: "", username: "", email: "", company: "", password: "", confirmPassword: "", message: "", leadType: "trial" });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsPasswordStrong(false);
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
            <Label htmlFor="trial-email">Email *</Label>
            <Input
              id="trial-email"
              name="trial-email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value.toLowerCase())}
              placeholder="john@company.com"
              className={errors.email ? "border-red-500" : ""}
              autoComplete="trial-email"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
              placeholder="Your Company (Optional)"
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
                autoComplete="new-password"
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
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                placeholder="Confirm your password"
                className={`pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                autoComplete="new-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Passwords match
              </p>
            )}
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

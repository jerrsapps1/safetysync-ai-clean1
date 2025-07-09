import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, CheckCircle, Copy, Star, Gift, Percent, Clock, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DemoRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

export function DemoRequestDialog({ isOpen, onClose, onSubmit }: DemoRequestDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
    leadType: "demo"
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Promo codes system - moved from pricing calculator
  const promoCodes = {
    // Essential Tier - Generous discounts for customer acquisition
    'SMALLBIZ': { 
      type: 'percentage', 
      value: 35, 
      description: 'Small Business Special - 35% Off', 
      maxEmployees: 50,
      allowedTiers: ['Essential'],
      validUntil: '2025-12-31' 
    },
    'FREEMONTH': { 
      type: 'months', 
      value: 1, 
      description: 'First Month Free', 
      maxEmployees: 50,
      allowedTiers: ['Essential'],
      validUntil: '2025-12-31' 
    },
    'STARTUP40': { 
      type: 'percentage', 
      value: 40, 
      description: 'Startup Special - 40% Off First 3 Months', 
      maxEmployees: 25,
      allowedTiers: ['Essential'],
      duration: 3,
      validUntil: '2025-12-31' 
    },
    
    // Professional Tier - Moderate discounts for growth companies
    'NEWCLIENT': { 
      type: 'percentage', 
      value: 20, 
      description: 'New Client Discount - 20% Off', 
      maxDiscount: 300,
      allowedTiers: ['Essential', 'Professional'],
      validUntil: '2025-06-30' 
    },
    'LAUNCH25': { 
      type: 'percentage', 
      value: 25, 
      description: 'Launch Special - 25% Off', 
      maxDiscount: 500,
      allowedTiers: ['Professional'],
      validUntil: '2025-12-31' 
    },
    'SAVE100': { 
      type: 'fixed', 
      value: 100, 
      description: '$100 Off Your First Year', 
      allowedTiers: ['Professional'],
      validUntil: '2025-12-31' 
    },
    'GROWTH15': { 
      type: 'percentage', 
      value: 15, 
      description: 'Growth Company Special - 15% Off', 
      minEmployees: 51,
      maxEmployees: 250,
      allowedTiers: ['Professional'],
      validUntil: '2025-12-31' 
    },
    
    // Enterprise Tier - Conservative discounts for high-value clients
    'ENTERPRISE15': { 
      type: 'percentage', 
      value: 15, 
      description: 'Enterprise Special - 15% Off', 
      minEmployees: 251,
      maxEmployees: 1000,
      allowedTiers: ['Enterprise'],
      validUntil: '2025-12-31' 
    },
    'CORP500': { 
      type: 'fixed', 
      value: 500, 
      description: '$500 Off Enterprise Setup', 
      minEmployees: 500,
      allowedTiers: ['Enterprise'],
      validUntil: '2025-12-31' 
    }
  };

  const copyPromoCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Promo Code Copied!",
      description: `${code} has been copied to your clipboard`,
      duration: 3000,
    });
  };

  const getRelevantPromoCodes = () => {
    // Get all active promo codes
    const activePromoCodes = Object.entries(promoCodes).filter(([code, promo]) => {
      const now = new Date();
      const validUntil = new Date(promo.validUntil);
      return now <= validUntil;
    });

    // Return top 3 most valuable promo codes
    return activePromoCodes.slice(0, 3);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
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
      const response = await apiRequest("POST", "/api/leads", formData);
      const result = await response.json();
      
      if (result.success) {
        setIsSuccess(true);
        toast({
          title: "Demo Scheduled!",
          description: "We'll contact you within 24 hours to schedule your demo.",
          duration: 5000,
        });
      } else {
        throw new Error(result.message || "Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting demo request:", error);
      toast({
        title: "Error",
        description: "Failed to schedule your demo. Please try again.",
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
    setIsSuccess(false);
    setFormData({ name: "", email: "", company: "", message: "", leadType: "demo" });
    setErrors({});
    onClose();
  };

  if (isSuccess) {
    const relevantPromoCodes = getRelevantPromoCodes();
    
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center">Demo Request Received!</DialogTitle>
            <DialogDescription className="text-center mb-6">
              Thank you for your interest in SafetySync.AI! One of our compliance experts will contact you within 24 hours to schedule your personalized demo.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Exclusive Promo Codes Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <Gift className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">Exclusive Demo Offers</h3>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Star className="w-3 h-3 mr-1" />
                  Limited Time
                </Badge>
              </div>
              
              <p className="text-sm text-blue-700 mb-4">
                As a demo request, you have access to our best promotional offers. Use these codes during checkout to maximize your savings:
              </p>
              
              <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                {relevantPromoCodes.map(([code, promo]) => (
                  <Card key={code} className="bg-white/80 backdrop-blur-sm border-blue-200 hover:border-blue-300 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {promo.type === 'percentage' && <Percent className="w-4 h-4 text-green-600" />}
                          {promo.type === 'fixed' && <DollarSign className="w-4 h-4 text-green-600" />}
                          {promo.type === 'months' && <Clock className="w-4 h-4 text-green-600" />}
                          <CardTitle className="text-lg font-mono text-blue-900">{code}</CardTitle>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => copyPromoCode(code)}
                          className="h-8 w-8 p-0 bg-blue-50 border-blue-200 hover:bg-blue-100"
                        >
                          <Copy className="w-3 h-3 text-blue-600" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600 mb-2">{promo.description}</p>
                      <div className="text-xs text-gray-500">
                        Valid until: {new Date(promo.validUntil).toLocaleDateString()}
                      </div>
                      {promo.allowedTiers && (
                        <div className="flex gap-1 mt-2">
                          {promo.allowedTiers.map((tier) => (
                            <Badge key={tier} variant="outline" className="text-xs">
                              {tier}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <p className="text-xs text-blue-800 font-medium">
                  💡 Pro Tip: These codes will be automatically applied at checkout when you choose the right plan tier. Our expert will help you select the best option during your demo.
                </p>
              </div>
            </div>
            
            {/* Next Steps */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">What happens next?</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• You'll receive a confirmation email with demo details</li>
                <li>• Our compliance expert will contact you within 24 hours</li>
                <li>• We'll schedule a personalized demo at your convenience</li>
                <li>• Your promo codes will be ready to use during checkout</li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button onClick={handleClose} className="bg-green-600 hover:bg-green-700">
              Perfect, Thank You!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Your Demo</DialogTitle>
          <DialogDescription>
            See SafetySync in action with a personalized demo tailored to your needs.
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
            <Label htmlFor="email">Work Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="john@company.com"
              className={errors.email ? "border-red-500" : ""}
            />
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
            <Label htmlFor="message">Tell us about your compliance needs</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="Number of employees, current compliance challenges, industry..."
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
                  Scheduling...
                </>
              ) : (
                "Schedule Demo"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

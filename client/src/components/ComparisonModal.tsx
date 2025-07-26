import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  X, 
  Star, 
  Users, 
  Shield, 
  Zap, 
  Building,
  Crown,
  Sparkles
} from 'lucide-react';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlans?: string[];
}

interface PlanFeature {
  feature: string;
  basic: boolean | string;
  pro: boolean | string;
  professional: boolean | string;
  enterprise: boolean | string;
  category: 'core' | 'advanced' | 'enterprise' | 'support';
}

const planFeatures: PlanFeature[] = [
  // Core Features
  { feature: "AI Document Processing", basic: true, pro: true, professional: true, enterprise: true, category: "core" },
  { feature: "Employee Management", basic: "Up to 50", pro: "Up to 200", professional: "Up to 1,000", enterprise: "Unlimited", category: "core" },
  { feature: "OSHA Compliance Tracking", basic: true, pro: true, professional: true, enterprise: true, category: "core" },
  { feature: "Certificate Generation", basic: "$5.95 each", pro: "$5.95 each", professional: "$5.95 each", enterprise: "$5.95 each", category: "core" },
  { feature: "Digital Wallet Cards", basic: "$5.95 each", pro: "$5.95 each", professional: "$5.95 each", enterprise: "$5.95 each", category: "core" },
  { feature: "Basic Reporting", basic: true, pro: true, professional: true, enterprise: true, category: "core" },
  
  // Advanced Features
  { feature: "Advanced Analytics", basic: false, pro: true, professional: true, enterprise: true, category: "advanced" },
  { feature: "Bulk Operations", basic: false, pro: true, professional: true, enterprise: true, category: "advanced" },
  { feature: "API Access", basic: false, pro: false, professional: true, enterprise: true, category: "advanced" },
  { feature: "Custom Branding", basic: false, pro: false, professional: true, enterprise: true, category: "advanced" },
  { feature: "Multi-Location Management", basic: false, pro: false, professional: true, enterprise: true, category: "advanced" },
  { feature: "Audit Trail & Logging", basic: false, pro: false, professional: true, enterprise: true, category: "advanced" },
  
  // Enterprise Features
  { feature: "SSO Integration", basic: false, pro: false, professional: false, enterprise: true, category: "enterprise" },
  { feature: "Advanced Security Controls", basic: false, pro: false, professional: false, enterprise: true, category: "enterprise" },
  { feature: "Custom Workflows", basic: false, pro: false, professional: false, enterprise: true, category: "enterprise" },
  { feature: "Data Export/Import", basic: false, pro: false, professional: "Limited", enterprise: "Full", category: "enterprise" },
  { feature: "Compliance Automation", basic: false, pro: false, professional: false, enterprise: true, category: "enterprise" },
  { feature: "White-label Options", basic: false, pro: false, professional: false, enterprise: true, category: "enterprise" },
  
  // Support
  { feature: "Email Support", basic: true, pro: true, professional: true, enterprise: true, category: "support" },
  { feature: "Priority Support", basic: false, pro: true, professional: true, enterprise: true, category: "support" },
  { feature: "Phone Support", basic: false, pro: false, professional: true, enterprise: true, category: "support" },
  { feature: "Dedicated Account Manager", basic: false, pro: false, professional: false, enterprise: true, category: "support" },
  { feature: "Custom Training", basic: false, pro: false, professional: false, enterprise: true, category: "support" },
  { feature: "24/7 Support", basic: false, pro: false, professional: false, enterprise: true, category: "support" }
];

const planInfo = {
  basic: {
    name: "Basic",
    price: "$49",
    period: "/month",
    description: "Perfect for small teams getting started with OSHA compliance",
    icon: Users,
    color: "text-blue-400",
    bgColor: "bg-blue-600",
    popular: false
  },
  pro: {
    name: "Pro",
    price: "$99",
    period: "/month", 
    description: "Ideal for growing companies with advanced compliance needs",
    icon: Star,
    color: "text-emerald-400",
    bgColor: "bg-emerald-600",
    popular: true
  },
  professional: {
    name: "Professional",
    price: "$199",
    period: "/month",
    description: "Comprehensive solution for multi-location enterprises",
    icon: Building,
    color: "text-amber-400",
    bgColor: "bg-amber-600",
    popular: false
  },
  enterprise: {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Complete platform with dedicated support and customization",
    icon: Crown,
    color: "text-purple-400", 
    bgColor: "bg-purple-600",
    popular: false
  }
};

const categories = [
  { id: 'core', label: 'Core Features', icon: Zap },
  { id: 'advanced', label: 'Advanced Features', icon: Sparkles },
  { id: 'enterprise', label: 'Enterprise Features', icon: Building },
  { id: 'support', label: 'Support & Training', icon: Shield }
];

export default function ComparisonModal({ isOpen, onClose, selectedPlans = ['basic', 'pro', 'professional', 'enterprise'] }: ComparisonModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFeatures = selectedCategory === 'all' 
    ? planFeatures 
    : planFeatures.filter(feature => feature.category === selectedCategory);

  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="h-5 w-5 text-emerald-400 mx-auto" />
      ) : (
        <X className="h-5 w-5 text-gray-500 mx-auto" />
      );
    }
    return (
      <span className="text-white text-sm font-medium">{value}</span>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 border-blue-700">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-white text-center mb-4">
            Plan Comparison
          </DialogTitle>
          <p className="text-blue-200 text-center max-w-2xl mx-auto">
            Compare all SafetySync.AI plans to find the perfect fit for your organization's safety management needs
          </p>
        </DialogHeader>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
            className={selectedCategory === 'all' ? 'bg-blue-600 text-white' : 'border-blue-600 text-blue-200 hover:bg-blue-600 hover:text-white'}
          >
            All Features
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={selectedCategory === category.id ? 'bg-blue-600 text-white' : 'border-blue-600 text-blue-200 hover:bg-blue-600 hover:text-white'}
            >
              <category.icon className="h-4 w-4 mr-2" />
              {category.label}
            </Button>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-blue-700/50 overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-5 bg-white/20">
            <div className="p-4 border-r border-blue-700/50">
              <div className="text-white font-semibold">Features</div>
            </div>
            {selectedPlans.map((planKey) => {
              const plan = planInfo[planKey as keyof typeof planInfo];
              const PlanIcon = plan.icon;
              
              return (
                <div key={planKey} className="p-4 text-center border-r border-blue-700/50 last:border-r-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <PlanIcon className={`h-5 w-5 ${plan.color}`} />
                      <span className="text-white font-bold">{plan.name}</span>
                      {plan.popular && (
                        <Badge className="bg-emerald-600 text-white text-xs">Popular</Badge>
                      )}
                    </div>
                    <div className="text-center">
                      <span className="text-2xl font-bold text-white">{plan.price}</span>
                      <span className="text-blue-200 text-sm">{plan.period}</span>
                    </div>
                    <p className="text-blue-200 text-xs">{plan.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Feature Rows */}
          <div className="divide-y divide-blue-700/30">
            {filteredFeatures.map((feature, index) => (
              <div key={index} className="grid grid-cols-5 hover:bg-white/5 transition-colors">
                <div className="p-4 border-r border-blue-700/30">
                  <span className="text-white font-medium">{feature.feature}</span>
                </div>
                <div className="p-4 text-center border-r border-blue-700/30">
                  {renderFeatureValue(feature.basic)}
                </div>
                <div className="p-4 text-center border-r border-blue-700/30">
                  {renderFeatureValue(feature.pro)}
                </div>
                <div className="p-4 text-center border-r border-blue-700/30">
                  {renderFeatureValue(feature.professional)}
                </div>
                <div className="p-4 text-center">
                  {renderFeatureValue(feature.enterprise)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Button 
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
            onClick={onClose}
          >
            <Check className="h-5 w-5 mr-2" />
            Start Your Trial
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold"
            onClick={onClose}
          >
            <Users className="h-5 w-5 mr-2" />
            Contact Sales
          </Button>
        </div>

        <div className="text-center mt-4">
          <p className="text-blue-200 text-sm">
            6-hour trial • No credit card required • All plans include $5.95 per certificate/wallet card
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
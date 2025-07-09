import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calculator,
  Users,
  Building,
  Shield,
  CheckCircle,
  Star,
  TrendingUp,
  DollarSign,
  Percent,
  Clock
} from "lucide-react";

interface PricingTier {
  name: string;
  basePrice: number;
  perEmployee: number;
  maxEmployees: number;
  features: string[];
  popular?: boolean;
  enterprise?: boolean;
}

interface PricingCalculatorProps {
  onSelectPlan?: (plan: string, cost: number) => void;
}

export function PricingCalculator({ onSelectPlan }: PricingCalculatorProps) {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [companySize, setCompanySize] = useState<'small' | 'medium' | 'large' | 'enterprise'>('medium');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<any>(null);

  const pricingTiers: PricingTier[] = [
    {
      name: "Essential",
      basePrice: 49,
      perEmployee: 1.5,
      maxEmployees: 50,
      features: [
        "Basic compliance tracking",
        "Employee certification records",
        "Standard reports",
        "Email notifications",
        "Basic dashboard",
        "Custom branding",
        "CSV exports",
        "Certificate & card generation (15 certificates + 15 digital cards included first month, additional items billed at $5.95 each to monthly subscription)"
      ]
    },
    {
      name: "Professional",
      basePrice: 112,
      perEmployee: 2.5,
      maxEmployees: 250,
      popular: true,
      features: [
        "Advanced compliance analytics",
        "Custom certification tracking",
        "Automated report generation",
        "Multi-location support",
        "Advanced dashboard",
        "API integrations",
        "Priority support",
        "Certificate & card generation (50 certificates + 50 digital cards included first month, additional items billed at $5.95 each to monthly subscription)"
      ]
    },
    {
      name: "Enterprise",
      basePrice: 258,
      perEmployee: 4,
      maxEmployees: 1000,
      features: [
        "Full compliance suite",
        "AI-powered recommendations",
        "Real-time risk assessment",
        "Advanced analytics",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 phone support",
        "SLA guarantee",
        "Custom workflows",
        "Audit assistance",
        "Certificate & card generation (100 certificates + 100 digital cards included first month, additional items billed at $5.95 each to monthly subscription)"
      ]
    },
    {
      name: "Enterprise Plus",
      basePrice: 686,
      perEmployee: 8,
      maxEmployees: 10000,
      enterprise: true,
      features: [
        "Everything in Enterprise",
        "Custom development",
        "On-premise deployment",
        "Advanced security features",
        "White-label solution",
        "Unlimited integrations",
        "Dedicated infrastructure",
        "Certificate & card generation (250 certificates + 250 digital cards included first month, additional items billed at $5.95 each to monthly subscription)"
      ]
    }
  ];

  const addons = [
    { name: "Advanced Analytics", price: 50, description: "Enhanced reporting and insights" },
    { name: "Mobile App", price: 30, description: "iOS and Android applications" },
    { name: "API Access", price: 40, description: "Full REST API integration" },
    { name: "Automated Audit Review", price: 99, description: "Monthly automated compliance gap analysis with auto-generated reports" },
    { name: "24/7 Support", price: 75, description: "Round-the-clock phone support" }
  ];

  // Tier-based promotional codes system for maximum profitability
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
    },
    
    // Enterprise Plus - No promo codes, volume discounts only
    // Custom negotiations and relationship-based pricing
  };

  // Determine which tier a customer qualifies for based on employee count
  const getQualifyingTier = (employeeCount: number): string => {
    if (employeeCount <= 50) return 'Essential';
    if (employeeCount <= 250) return 'Professional';
    if (employeeCount <= 1000) return 'Enterprise';
    return 'Enterprise Plus';
  };

  const applyPromoCode = () => {
    const code = promoCode.toUpperCase();
    const promo = promoCodes[code as keyof typeof promoCodes];
    
    if (!promo) {
      setAppliedPromo({ error: 'Invalid promo code' });
      return;
    }

    // Check if promo is still valid
    const now = new Date();
    const validUntil = new Date(promo.validUntil);
    if (now > validUntil) {
      setAppliedPromo({ error: 'Promo code has expired' });
      return;
    }

    // Check employee count restrictions
    const employees = employeeCount;
    const promoAny = promo as any;
    if (promoAny.minEmployees && employees < promoAny.minEmployees) {
      setAppliedPromo({ error: `This promo requires at least ${promoAny.minEmployees} employees` });
      return;
    }
    if (promoAny.maxEmployees && employees > promoAny.maxEmployees) {
      setAppliedPromo({ error: `This promo is only for companies with up to ${promoAny.maxEmployees} employees` });
      return;
    }

    // Check tier restrictions - NEW PROFITABILITY LOGIC
    const customerTier = getQualifyingTier(employees);
    if (promoAny.allowedTiers && !promoAny.allowedTiers.includes(customerTier)) {
      const tierNames = promoAny.allowedTiers.join(' or ');
      setAppliedPromo({ error: `This promo code is only valid for ${tierNames} tier customers` });
      return;
    }

    // Additional validation for Enterprise Plus (no promo codes allowed)
    if (customerTier === 'Enterprise Plus') {
      setAppliedPromo({ error: 'Enterprise Plus customers receive volume discounts instead of promo codes. Contact sales for custom pricing.' });
      return;
    }

    setAppliedPromo({ ...promo, code });
  };

  const clearPromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
  };

  // Get available promo codes for current customer tier
  const getAvailablePromoCodes = (employeeCount: number) => {
    const customerTier = getQualifyingTier(employeeCount);
    const available = Object.entries(promoCodes).filter(([code, promo]) => {
      const promoAny = promo as any;
      // Check if promo is valid for this tier
      if (promoAny.allowedTiers && !promoAny.allowedTiers.includes(customerTier)) {
        return false;
      }
      // Check employee count restrictions
      if (promoAny.minEmployees && employeeCount < promoAny.minEmployees) {
        return false;
      }
      if (promoAny.maxEmployees && employeeCount > promoAny.maxEmployees) {
        return false;
      }
      return true;
    });
    return available;
  };

  const calculatePrice = (tier: PricingTier) => {
    const employees = employeeCount;
    
    // Apply volume discounts for large enterprises
    let perEmployeeCost = tier.perEmployee;
    if (tier.name === 'Enterprise Plus' && employees >= 5000) {
      perEmployeeCost = tier.perEmployee * 0.8; // 20% volume discount for 5000+ employees
    } else if (tier.name === 'Enterprise Plus' && employees >= 2000) {
      perEmployeeCost = tier.perEmployee * 0.9; // 10% volume discount for 2000+ employees
    }
    
    const baseMonthly = tier.basePrice + (employees * perEmployeeCost);
    const addonsTotal = selectedAddons.reduce((sum, addonName) => {
      const addon = addons.find(a => a.name === addonName);
      return sum + (addon?.price || 0);
    }, 0);
    
    const monthlyTotal = baseMonthly + addonsTotal;
    let finalPrice = monthlyTotal;
    let promoDiscount = 0;
    let promoSavings = 0;
    let volumeDiscount = 0;
    
    // Calculate volume discount amount for display
    if (employees >= 2000 && tier.name === 'Enterprise Plus') {
      const originalCost = tier.basePrice + (employees * tier.perEmployee);
      volumeDiscount = originalCost - baseMonthly;
    }
    
    // Apply promotional discount if valid
    if (appliedPromo && !appliedPromo.error) {
      if (appliedPromo.type === 'percentage') {
        promoDiscount = (monthlyTotal * appliedPromo.value) / 100;
        if (appliedPromo.maxDiscount) {
          promoDiscount = Math.min(promoDiscount, appliedPromo.maxDiscount);
        }
      } else if (appliedPromo.type === 'fixed') {
        promoDiscount = appliedPromo.value;
      } else if (appliedPromo.type === 'months') {
        // Free months handled separately in UI
        promoSavings = monthlyTotal * appliedPromo.value;
      }
      
      finalPrice = Math.max(0, monthlyTotal - promoDiscount);
    }
    
    // Apply annual discount
    const annualDiscount = isAnnual ? 0.15 : 0; // 15% annual discount
    const annualDiscountAmount = finalPrice * annualDiscount;
    const finalAnnualPrice = finalPrice * (1 - annualDiscount);
    
    return {
      monthly: monthlyTotal,
      monthlyWithPromo: finalPrice,
      annual: finalAnnualPrice * 12,
      promoDiscount,
      promoSavings,
      volumeDiscount,
      annualDiscount: annualDiscountAmount,
      totalSavings: (isAnnual ? annualDiscountAmount * 12 : 0) + promoSavings + (isAnnual && promoDiscount ? promoDiscount * 12 : 0) + (volumeDiscount * 12)
    };
  };

  const getRecommendedPlan = () => {
    const employees = employeeCount;
    if (employees <= 50) return "Essential";
    if (employees <= 250) return "Professional";
    if (employees <= 1000) return "Enterprise";
    return "Enterprise Plus";
  };

  const roi = {
    timeReduction: 75,
    costSavings: 45000,
    complianceImprovement: 40,
    riskReduction: 60
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Calculator className="w-8 h-8 text-blue-600" />
          <h2 className="text-3xl font-bold">Pricing Calculator</h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Calculate the exact cost for your organization and see the ROI of implementing SafetySync
        </p>
      </div>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Configure Your Plan
          </CardTitle>
          <CardDescription>
            Adjust the settings below to see pricing for your organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Employee Count */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Number of Employees</label>
              <Badge variant="outline">{employeeCount} employees</Badge>
            </div>
            <Input
              type="number"
              value={employeeCount}
              onChange={(e) => {
                const value = e.target.value;
                // Allow empty input or valid numbers
                if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 10000)) {
                  setEmployeeCount(value === '' ? 0 : parseInt(value));
                }
              }}
              onBlur={(e) => {
                const value = parseInt(e.target.value);
                if (isNaN(value) || value < 0) {
                  setEmployeeCount(0);
                } else if (value > 10000) {
                  setEmployeeCount(10000);
                }
              }}
              min={0}
              max={10000}
              placeholder="Enter number of employees"
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Minimum: 0</span>
              <span>Maximum: 10,000</span>
            </div>
          </div>

          {/* Tier Indicator and Available Promo Codes */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">
                Your Qualifying Tier: {getQualifyingTier(employeeCount)}
              </span>
            </div>
            
            {(() => {
              const availablePromos = getAvailablePromoCodes(employeeCount);
              const currentTier = getQualifyingTier(employeeCount);
              
              if (currentTier === 'Enterprise Plus') {
                return (
                  <div className="space-y-2">
                    <p className="text-sm text-blue-700">
                      Enterprise Plus customers receive automatic volume discounts up to 20% off.
                    </p>
                    <p className="text-xs text-blue-600">
                      Contact our sales team for custom enterprise pricing and dedicated support.
                    </p>
                  </div>
                );
              }
              
              if (availablePromos.length > 0) {
                return (
                  <div className="space-y-2">
                    <p className="text-sm text-blue-700 font-medium">
                      Available Promo Codes for {currentTier} Tier:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {availablePromos.slice(0, 3).map(([code, promo]) => (
                        <button
                          key={code}
                          onClick={() => setPromoCode(code)}
                          className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded font-mono transition-colors"
                        >
                          {code}
                        </button>
                      ))}
                    </div>
                    {availablePromos.length > 3 && (
                      <p className="text-xs text-blue-600">
                        +{availablePromos.length - 3} more codes available
                      </p>
                    )}
                  </div>
                );
              }
              
              return (
                <p className="text-sm text-blue-700">
                  No promo codes available for your current configuration.
                </p>
              );
            })()}
          </div>

          {/* Billing Cycle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium">Annual Billing</div>
              <div className="text-sm text-gray-600">Save 15% with annual payments</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${!isAnnual ? 'font-medium' : 'text-gray-500'}`}>Monthly</span>
              <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
              <span className={`text-sm ${isAnnual ? 'font-medium' : 'text-gray-500'}`}>Annual</span>
              {isAnnual && <Badge variant="default" className="ml-2">Save 15%</Badge>}
            </div>
          </div>

          {/* Promotional Code */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="font-medium text-blue-900 mb-2">Have a Promo Code?</div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                className="flex-1 px-3 py-2 border rounded-md text-sm"
                onKeyPress={(e) => e.key === 'Enter' && applyPromoCode()}
              />
              <Button 
                onClick={applyPromoCode} 
                size="sm"
                disabled={!promoCode.trim()}
              >
                Apply
              </Button>
              {appliedPromo && !appliedPromo.error && (
                <Button 
                  onClick={clearPromo} 
                  variant="outline" 
                  size="sm"
                >
                  Clear
                </Button>
              )}
            </div>
            
            {/* Promo Status */}
            {appliedPromo && (
              <div className="mt-3">
                {appliedPromo.error ? (
                  <div className="text-sm text-red-600 flex items-center gap-1">
                    <span>❌</span> {appliedPromo.error}
                  </div>
                ) : (
                  <div className="text-sm text-green-600 flex items-center gap-1">
                    <span>✅</span> <strong>{appliedPromo.code}</strong> applied: {appliedPromo.description}
                  </div>
                )}
              </div>
            )}

            {/* Sample Promo Codes */}
            <div className="mt-3 text-xs text-blue-700">
              <div className="font-medium mb-1">Try these sample codes:</div>
              <div className="flex flex-wrap gap-2">
                <code className="bg-blue-100 px-2 py-1 rounded cursor-pointer hover:bg-blue-200" 
                      onClick={() => setPromoCode('LAUNCH25')}>LAUNCH25</code>
                <code className="bg-blue-100 px-2 py-1 rounded cursor-pointer hover:bg-blue-200" 
                      onClick={() => setPromoCode('SMALLBIZ')}>SMALLBIZ</code>
                <code className="bg-blue-100 px-2 py-1 rounded cursor-pointer hover:bg-blue-200" 
                      onClick={() => setPromoCode('FREEMONTH')}>FREEMONTH</code>
              </div>
            </div>
          </div>

          {/* Add-ons */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Add-on Services</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {addons.map((addon) => (
                <div key={addon.name} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <input
                    type="checkbox"
                    checked={selectedAddons.includes(addon.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAddons([...selectedAddons, addon.name]);
                      } else {
                        setSelectedAddons(selectedAddons.filter(a => a !== addon.name));
                      }
                    }}
                    className="rounded"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{addon.name}</div>
                    <div className="text-sm text-gray-600">{addon.description}</div>
                  </div>
                  <div className="font-medium">${addon.price}/mo</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pricingTiers.map((tier) => {
          const pricing = calculatePrice(tier);
          const isRecommended = tier.name === getRecommendedPlan();
          const isAvailable = employeeCount <= tier.maxEmployees;

          return (
            <Card key={tier.name} className={`relative ${isRecommended ? 'ring-2 ring-blue-500' : ''} ${!isAvailable ? 'opacity-60' : ''}`}>
              {tier.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              {isRecommended && (
                <Badge variant="default" className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <Star className="w-3 h-3 mr-1" />
                  Recommended
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  {tier.enterprise && <Building className="w-5 h-5" />}
                  {tier.name}
                </CardTitle>
                <div className="space-y-2">
                  {/* Show original price if promo is applied */}
                  {pricing.promoDiscount > 0 && (
                    <div className="text-lg text-gray-400 line-through">
                      ${Math.round(isAnnual ? pricing.monthly : pricing.monthly)}
                    </div>
                  )}
                  
                  <div className="text-3xl font-bold">
                    ${Math.round(isAnnual ? pricing.annual / 12 : pricing.monthlyWithPromo)}
                    <span className="text-sm font-normal text-gray-500">/month</span>
                  </div>
                  
                  {/* Show volume discount */}
                  {pricing.volumeDiscount > 0 && (
                    <div className="text-sm text-blue-600 font-medium">
                      💼 Volume Discount: Save ${Math.round(pricing.volumeDiscount)}/month
                    </div>
                  )}
                  
                  {/* Show promotional savings */}
                  {pricing.promoDiscount > 0 && (
                    <div className="text-sm text-orange-600 font-medium">
                      🎉 Promo: Save ${Math.round(pricing.promoDiscount)}/month
                    </div>
                  )}
                  
                  {/* Show free months */}
                  {appliedPromo && appliedPromo.type === 'months' && (
                    <div className="text-sm text-purple-600 font-medium">
                      🆓 {appliedPromo.value} month{appliedPromo.value > 1 ? 's' : ''} FREE
                    </div>
                  )}
                  
                  {isAnnual && pricing.totalSavings > 0 && (
                    <div className="text-sm text-green-600">
                      Total Savings: ${Math.round(pricing.totalSavings)}/year
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-500">
                    Up to {tier.maxEmployees} employees
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>

                <Button 
                  className="w-full" 
                  variant={isRecommended ? 'default' : 'outline'}
                  disabled={!isAvailable}
                  onClick={() => onSelectPlan?.(tier.name, isAnnual ? pricing.annual : pricing.monthly * 12)}
                >
                  {!isAvailable ? 'Contact Sales' : 'Choose Plan'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ROI Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Return on Investment
          </CardTitle>
          <CardDescription>
            See how SafetySync pays for itself through efficiency gains and risk reduction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="savings" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="savings">Cost Savings</TabsTrigger>
              <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
              <TabsTrigger value="risk">Risk Reduction</TabsTrigger>
            </TabsList>

            <TabsContent value="savings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold text-green-600">${roi.costSavings.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Annual Cost Savings</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Percent className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-600">{roi.timeReduction}%</div>
                  <div className="text-sm text-gray-600">Time Reduction</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold text-purple-600">6 months</div>
                  <div className="text-sm text-gray-600">Payback Period</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Based on average customer data: reduced administrative time, fewer compliance violations, 
                and streamlined audit processes.
              </div>
            </TabsContent>

            <TabsContent value="efficiency" className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Administrative Time Reduction</span>
                  <span className="font-bold">{roi.timeReduction}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Report Generation Speed</span>
                  <span className="font-bold">90% faster</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Compliance Score Improvement</span>
                  <span className="font-bold">{roi.complianceImprovement}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Audit Preparation Time</span>
                  <span className="font-bold">85% reduction</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="risk" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Risk Mitigation</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>OSHA Violation Risk</span>
                      <span className="text-green-600 font-medium">-{roi.riskReduction}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Workplace Incidents</span>
                      <span className="text-green-600 font-medium">-45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Insurance Claims</span>
                      <span className="text-green-600 font-medium">-30%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Financial Impact</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Avoided Fines</span>
                      <span className="text-green-600 font-medium">$25,000/year</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reduced Insurance</span>
                      <span className="text-green-600 font-medium">$15,000/year</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Productivity Gains</span>
                      <span className="text-green-600 font-medium">$35,000/year</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">Your Recommended Plan</h3>
            <div className="text-3xl font-bold text-blue-600">
              {getRecommendedPlan()} - ${Math.round(calculatePrice(pricingTiers.find(t => t.name === getRecommendedPlan())!).annual / 12)}/month
            </div>
            <p className="text-gray-600">
              Based on {employeeCount} employees with {selectedAddons.length} add-ons
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg">Start Free Trial</Button>
              <Button size="lg" variant="outline">Schedule Demo</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
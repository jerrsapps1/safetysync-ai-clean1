import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  ArrowRight, 
  Star, 
  Users, 
  Building, 
  Zap,
  Shield,
  Clock,
  Award
} from 'lucide-react';
import { Link } from 'wouter';

export default function Pricing() {
  const plans = [
    {
      name: "Essential",
      price: 49,
      period: "month",
      description: "Perfect for small teams getting started with compliance",
      badge: null,
      features: [
        "Up to 25 employees",
        "Basic training tracking",
        "Digital certificates",
        "Email reminders",
        "Standard support",
        "Certificate & card generation ($5.95 per certificate or digital card)"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Professional",
      price: 149,
      period: "month",
      description: "Advanced features for growing organizations",
      badge: "Most Popular",
      features: [
        "Up to 100 employees",
        "Advanced compliance tracking",
        "AI document processing",
        "Custom training matrix",
        "Automated workflows",
        "Priority support",
        "Advanced reporting",
        "Certificate & card generation ($5.95 per certificate or digital card)"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: 349,
      period: "month",
      description: "Full-featured solution for large organizations",
      badge: null,
      features: [
        "Unlimited employees",
        "Advanced AI features",
        "Multi-location support",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 phone support",
        "Custom branding",
        "API access",
        "Certificate & card generation ($5.95 per certificate or digital card)"
      ],
      cta: "Contact Sales",
      popular: false
    },
    {
      name: "Lifer Plan",
      price: 2999,
      period: "one-time",
      description: "Lifetime access with all future updates included",
      badge: "Best Value",
      features: [
        "Everything in Enterprise",
        "Lifetime access",
        "All future updates included",
        "No recurring fees",
        "Priority feature requests",
        "Grandfathered pricing protection",
        "Exclusive community access",
        "Certificate & card generation ($5.95 per certificate or digital card)"
      ],
      cta: "Join 127+ Companies",
      popular: false
    }
  ];

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Choose the plan that fits your organization. All plans include our core compliance features 
            with no hidden fees or surprise charges.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Clock className="w-4 h-4 mr-2" />
              6-Hour Free Trial
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Shield className="w-4 h-4 mr-2" />
              No Setup Fees
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Award className="w-4 h-4 mr-2" />
              Cancel Anytime
            </Badge>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 ${
                  plan.popular ? 'ring-2 ring-white/40 scale-105' : ''
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-emerald-500 text-white border-0">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-white text-2xl mb-2">
                    {plan.name}
                  </CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">
                      ${plan.price}
                    </span>
                    <span className="text-blue-100 ml-2">
                      /{plan.period}
                    </span>
                  </div>
                  <p className="text-blue-100 text-sm">
                    {plan.description}
                  </p>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-blue-100 text-sm">
                        <Check className="w-4 h-4 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Link href={plan.cta === "Contact Sales" ? "/contact" : "/"}>
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-white text-blue-600 hover:bg-gray-100' 
                          : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
                      }`}
                    >
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Volume Discounts */}
      <section className="py-20 bg-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Volume Discounts Available
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Generate multiple certificates and digital cards at once? Save with our volume pricing tiers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-emerald-400 mb-2">10% Off</div>
                <p className="text-white font-semibold mb-1">15-29 Items</p>
                <p className="text-blue-100 text-sm">Perfect for medium teams</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 ring-2 ring-white/40">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-emerald-400 mb-2">15% Off</div>
                <p className="text-white font-semibold mb-1">30-49 Items</p>
                <p className="text-blue-100 text-sm">Great for large teams</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-emerald-400 mb-2">20% Off</div>
                <p className="text-white font-semibold mb-1">50+ Items</p>
                <p className="text-blue-100 text-sm">Maximum savings</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            {[
              {
                question: "What's included in the 6-hour free trial?",
                answer: "Full access to all features in your chosen plan, including AI document processing, employee management, and certificate generation. No credit card required."
              },
              {
                question: "How does the certificate pricing work?",
                answer: "All plans use pay-per-use pricing at $5.95 per certificate or digital wallet card. Generate as many or as few as you need, with volume discounts for bulk orders."
              },
              {
                question: "Can I upgrade or downgrade my plan?",
                answer: "Yes, you can change your plan anytime. Upgrades take effect immediately, and downgrades take effect at your next billing cycle."
              },
              {
                question: "What's the difference between plans?",
                answer: "Plans differ in employee limits, features, and support levels. Essential is great for small teams, Professional adds AI features, and Enterprise includes unlimited employees and custom integrations."
              },
              {
                question: "Why choose the Lifer Plan?",
                answer: "The Lifer Plan offers lifetime access with no recurring fees. Over 127 companies have joined, saving thousands in the long run while getting all future updates included."
              }
            ].map((faq, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold text-lg mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-blue-100">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white/10 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of companies using SafetySync.AI to streamline their safety compliance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Talk to Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
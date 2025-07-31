// File: src/pages/pricing.jsx
import React from "react";

export default function Pricing() {
  const plans = [
    {
      name: "Essential",
      price: "$49",
      period: "/month",
      description: "Perfect for small teams getting started with OSHA compliance",
      features: [
        "Up to 25 employees",
        "Basic training tracking",
        "PDF certificate generation",
        "Email support",
        "Certificate & card generation ($5.95 per item)"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$149",
      period: "/month",
      description: "Ideal for growing companies with advanced compliance needs",
      features: [
        "Up to 100 employees",
        "AI document processing",
        "Digital wallet cards",
        "Compliance dashboard",
        "Priority support",
        "Certificate & card generation ($5.95 per item)"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$399",
      period: "/month",
      description: "Complete solution for large organizations with multiple locations",
      features: [
        "Unlimited employees",
        "Multi-location support",
        "Advanced analytics",
        "Custom integrations",
        "Dedicated support",
        "Certificate & card generation ($5.95 per item)"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Choose the plan that fits your organization's size and compliance needs. All plans include our core safety management features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className={`bg-white/10 backdrop-blur-sm rounded-xl p-8 relative ${plan.popular ? 'ring-2 ring-white/50 transform scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-white text-blue-600 px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-white mb-2">
                  {plan.price}<span className="text-lg font-normal text-blue-100">{plan.period}</span>
                </div>
                <p className="text-blue-100 text-sm">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-blue-100">
                    <span className="text-green-300 mr-3">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                plan.popular 
                  ? 'bg-white text-blue-600 hover:bg-blue-50' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}>
                Start Free Trial
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-blue-100 mb-4">
            All plans include 6-hour free trial • No setup fees • Cancel anytime
          </p>
          <p className="text-sm text-blue-200">
            Certificate and digital card generation available at $5.95 per item across all plans
          </p>
        </div>
      </div>
    </div>
  );
}
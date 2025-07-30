import React from "react";
import { Button } from "../components/ui/button";

export default function PricingPage() {
  return (
    <div className="bg-white text-gray-900 font-sans">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white text-center py-20 px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Pricing Made Simple</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Choose the plan that fits your team. All tiers include full access to SafetySync's AI-powered compliance tools. Pay only when you issue certificates or digital wallet cards.
        </p>
      </section>

      {/* Pricing Tiers */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Monthly Plans</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              title: "Essential",
              price: "$49/mo",
              idealFor: "Small teams or consultants",
              features: [
                "Up to 25 employees",
                "Single location",
                "AI document tools",
                "Certificate generator",
              ],
            },
            {
              title: "Professional",
              price: "$149/mo",
              idealFor: "Growing teams and safety pros",
              features: [
                "Up to 100 employees",
                "Multi-location support",
                "Digital wallet cards",
                "Compliance dashboard",
              ],
            },
            {
              title: "Enterprise",
              price: "$349/mo",
              idealFor: "Large businesses or HR teams",
              features: [
                "Up to 500 employees",
                "HR integration",
                "Audit exports",
                "Priority support",
              ],
            },
            {
              title: "Enterprise Plus",
              price: "$749/mo",
              idealFor: "Training centers & multi-client orgs",
              features: [
                "Unlimited employees",
                "Instructor access",
                "Custom branding",
                "Dedicated onboarding",
              ],
            },
          ].map((plan, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow border hover:shadow-md transition"
            >
              <h3 className="text-xl font-bold text-blue-700 mb-1">{plan.title}</h3>
              <p className="text-2xl font-semibold mb-2">{plan.price}</p>
              <p className="mb-4 text-sm text-gray-600">{plan.idealFor}</p>
              <ul className="text-sm text-gray-800 mb-6 list-disc list-inside space-y-2">
                {plan.features.map((f, idx) => (
                  <li key={idx}>{f}</li>
                ))}
              </ul>
              <Button className="w-full">Start Free Trial</Button>
            </div>
          ))}
        </div>
      </section>

      {/* Pay-Per-Use */}
      <section className="bg-blue-50 py-16 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Pay Only for What You Issue</h2>
        <p className="text-gray-700 max-w-2xl mx-auto mb-6">
          All plans include unlimited use of the platform. You only pay when you generate compliance documents:
        </p>
        <div className="text-lg font-medium text-blue-700">
          $5.95 per certificate or digital wallet card
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Volume discounts: 10% off (15–29), 15% off (30–49), 20% off (50+)
        </p>
      </section>

      {/* Persona Guidance */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10">Which Plan Is Right for You?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              persona: "EHS Manager",
              rec: "Professional or Enterprise",
              reason: "Track employee compliance, generate certificates, and prepare for audits across teams and locations.",
            },
            {
              persona: "HR Team",
              rec: "Enterprise",
              reason: "Sync compliance records with onboarding workflows and export reports for internal review.",
            },
            {
              persona: "Instructor / Consultant",
              rec: "Essential or Plus",
              reason: "Manage client training sessions and issue branded, verifiable certificates effortlessly.",
            },
            {
              persona: "Training Center",
              rec: "Enterprise Plus",
              reason: "Operate across many clients and classes, issue bulk certificates, and customize branding.",
            },
          ].map((user, i) => (
            <div key={i} className="bg-gray-100 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-blue-700 mb-1">{user.persona}</h3>
              <p className="mb-1">
                <strong>Recommended:</strong> {user.rec}
              </p>
              <p className="text-sm text-gray-700">{user.reason}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-blue-900 text-white text-center py-20 px-6">
        <h2 className="text-3xl font-bold mb-4">Ready to Automate Your Compliance?</h2>
        <p className="text-lg max-w-xl mx-auto mb-8">
          Try SafetySync free — and pay only when you issue documents. No hidden fees. No contracts.
        </p>
        <Button className="bg-white text-blue-800 hover:bg-gray-100 text-lg font-semibold px-6 py-3 rounded-xl">
          Start My Free Trial
        </Button>
      </section>
    </div>
  );
}
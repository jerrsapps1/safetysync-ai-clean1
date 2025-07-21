import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PricingCalculator } from "@/components/ui/pricing-calculator";
import { FAQSection } from "@/components/ui/faq-section";
import { LiveChatWidget } from "@/components/ui/live-chat-widget";
import { PageHeader } from "@/components/ui/page-header";
import { MessageCircle } from "lucide-react";

export default function PricingPage() {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your organization. All plans include our core compliance features 
            with a 30-day free trial and no setup fees.
          </p>
        </div>

        {/* Certificate & Digital Card Services Link */}
        <section className="mb-20">
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-8 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Professional Certificate & Digital Card Services</h2>
              <p className="text-xl text-gray-600 mb-6">
                Generate high-quality OSHA-compliant certificates and digital wallet cards with plan-specific allowances
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                  onClick={() => window.location.href = '/certificate-services'}
                >
                  View Certificate Services
                </Button>
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100"
                  onClick={() => window.location.href = '/certificate-services'}
                >
                  See Examples & Pricing
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Calculator */}
        <section className="mb-20">
          <PricingCalculator 
            onSelectPlan={(plan, cost) => {
              console.log(`Selected ${plan} plan at $${cost}/year`);
            }}
          />
        </section>

        {/* FAQ Section */}
        <section className="mb-20">
          <FAQSection />
        </section>

        {/* Live Chat */}
        {showChat && (
          <LiveChatWidget 
            isOpen={showChat}
            onToggle={() => setShowChat(!showChat)}
            onClose={() => setShowChat(false)}
          />
        )}

        {/* Chat Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setShowChat(!showChat)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        </div>


      </div>
    </div>
  );
}
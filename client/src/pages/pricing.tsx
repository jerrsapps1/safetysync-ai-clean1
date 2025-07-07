import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PricingCalculator } from "@/components/ui/pricing-calculator";
import { FAQSection } from "@/components/ui/faq-section";
import { LiveChatWidget } from "@/components/ui/live-chat-widget";
import { ArrowLeft, MessageCircle, Award, CreditCard } from "lucide-react";
import { Link } from "wouter";

export default function PricingPage() {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Link href="/">
            <Button variant="outline" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your organization. All plans include our core compliance features 
            with a 30-day free trial and no setup fees.
          </p>
        </div>

        {/* Pricing Calculator */}
        <section className="mb-20">
          <PricingCalculator 
            onSelectPlan={(plan, cost) => {
              console.log(`Selected ${plan} plan at $${cost}/year`);
            }}
          />
        </section>

        {/* Add-On Services Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Professional Add-On Services</h2>
            <p className="text-xl text-gray-600">
              Enhance your compliance program with professional certificate generation and wallet card services
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Certificate Generation Service */}
            <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-blue-600" />
                  Certificate Generation Service
                </CardTitle>
                <div className="text-2xl font-bold text-blue-600">$15/certificate</div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Professional completion certificates for your training programs, generated digitally for your printing needs.
                </p>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-gray-900">Professional Certificate Includes:</h4>
                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                      <li>• Centered layout with employee name prominently displayed</li>
                      <li>• Specific OSHA/ANSI/CFR compliance references</li>
                      <li>• Contact hours (CEU), completion and expiration dates</li>
                      <li>• Unique certificate number for verification and audits</li>
                      <li>• Instructor credentials and company contact information</li>
                      <li>• High-resolution PDF (300 DPI) ready for printing</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Perfect For:</p>
                    <p className="text-sm text-blue-800">Companies needing official documentation for audits, regulatory compliance, or employee records</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wallet Card Service */}
            <Card className="border-2 border-green-200 hover:border-green-300 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-green-600" />
                  Printable Wallet Card Service
                </CardTitle>
                <div className="text-2xl font-bold text-green-600">$8/card</div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Professional wallet-sized certification cards designed for PVC card printing systems.
                </p>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-gray-900">Professional Wallet Card Features:</h4>
                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                      <li>• CR80 format (3.375" x 2.125") for 30mil PVC cards</li>
                      <li>• Front: Company logo, employee name, primary certification</li>
                      <li>• Back: Equipment authorizations and compliance references</li>
                      <li>• Multiple certifications with training/expiry dates</li>
                      <li>• OSHA compliance statements (29 CFR, ANSI standards)</li>
                      <li>• HID printer compatible design for professional printing</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-green-900">Your Setup:</p>
                    <p className="text-sm text-green-800">We generate the files, you print with your HID printer on PVC cards. Perfect for employee ID badges and certification cards.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bulk Pricing */}
          <Card className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-center mb-4">Volume Discounts Available</h3>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-purple-600">10-50 items</div>
                  <div className="text-sm text-gray-600">15% discount</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-purple-600">51-100 items</div>
                  <div className="text-sm text-gray-600">25% discount</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-purple-600">100+ items</div>
                  <div className="text-sm text-gray-600">35% discount</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* FAQ Section */}
        <section className="mb-20">
          <FAQSection 
            onContactSupport={() => setShowChat(true)}
          />
        </section>

        {/* Contact CTA */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Start Your Compliance Journey?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of companies who trust SafetySync for their OSHA compliance needs.
              Start your free trial today - no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Start Free Trial
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                onClick={() => setShowChat(true)}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Sales
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Chat Widget */}
      <LiveChatWidget 
        isOpen={showChat}
        onToggle={() => setShowChat(!showChat)}
        onClose={() => setShowChat(false)}
      />
    </div>
  );
}
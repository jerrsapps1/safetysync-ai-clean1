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

        {/* Add-On Services Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Professional Certificate & Card Services</h2>
            <p className="text-xl text-gray-600">
              Essential plan includes certificate generation (FREE first 90 days, then $0.50 per item). Higher tiers available for bulk needs.
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

        {/* Pricing Calculator */}
        <section className="mb-20">
          <PricingCalculator 
            onSelectPlan={(plan, cost) => {
              console.log(`Selected ${plan} plan at $${cost}/year`);
            }}
          />
        </section>

        {/* Certificate Generation Pricing Update */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Certificate & Card Generation Pricing</h2>
            <p className="text-xl text-gray-600">
              All subscription plans include 90-day free certificate generation, then $0.50 per item. Stand-alone services also available.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* All Subscription Plans */}
            <Card className="border-2 border-green-200 hover:border-green-300 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-green-600" />
                  All Subscription Plans
                </CardTitle>
                <div className="text-lg font-bold text-green-600">FREE first 90 days</div>
                <div className="text-sm text-gray-600">Then $0.50 per certificate/card</div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Every subscription tier includes certificate generation benefits from day one.
                </p>
                
                <div className="space-y-3">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-green-900">90-Day Free Period:</p>
                    <p className="text-sm text-green-800">Generate unlimited certificates and cards at no extra cost</p>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">After 90 Days:</p>
                    <p className="text-sm text-blue-800">Only $0.50 per certificate or card, billed monthly</p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-gray-900">Same Professional Quality:</h4>
                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                      <li>• OSHA/ANSI/CFR compliance references</li>
                      <li>• Unique certificate numbers</li>
                      <li>• CR80 format wallet cards</li>
                      <li>• HID printer compatible</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Premium Stand-alone Service */}
            <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-blue-600" />
                  Premium Stand-alone Service
                </CardTitle>
                <div className="text-2xl font-bold text-blue-600">$15/certificate</div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  For companies needing one-time certificate generation without a subscription.
                </p>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-gray-900">Professional Certificate Includes:</h4>
                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                      <li>• Centered layout with employee name</li>
                      <li>• OSHA/ANSI/CFR compliance references</li>
                      <li>• Contact hours and expiration dates</li>
                      <li>• Unique certificate number</li>
                      <li>• High-resolution PDF (300 DPI)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Perfect For:</p>
                    <p className="text-sm text-blue-800">One-time needs, occasional use, or contractor certifications</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wallet Card Service */}
            <Card className="border-2 border-purple-200 hover:border-purple-300 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                  Wallet Card Service
                </CardTitle>
                <div className="text-2xl font-bold text-purple-600">$8/card</div>
                <div className="text-sm text-gray-600">(Or $0.50 with Essential plan)</div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Professional wallet-sized certification cards for PVC card printing systems.
                </p>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold text-gray-900">Wallet Card Features:</h4>
                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                      <li>• CR80 format (3.375" x 2.125")</li>
                      <li>• Front: Company logo, employee name</li>
                      <li>• Back: Equipment authorizations</li>
                      <li>• OSHA compliance statements</li>
                      <li>• HID printer compatible</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-purple-900">Your Setup:</p>
                    <p className="text-sm text-purple-800">We generate files, you print with HID printer on 30mil PVC cards</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Billing Notice */}
          <Card className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-center mb-4">Important Billing Information</h3>
              <div className="text-center space-y-2">
                <p className="text-gray-700">
                  <strong>All subscription plans:</strong> After your 90-day free period, certificate and card generation charges ($0.50 per item) will be added to your monthly billing automatically.
                </p>
                <p className="text-sm text-gray-600">
                  This usage-based billing ensures you only pay for what you actually generate while maintaining professional quality standards across all tiers.
                </p>
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
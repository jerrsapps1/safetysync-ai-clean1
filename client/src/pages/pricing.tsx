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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Professional Certificate & Digital Card Services</h2>
            <p className="text-xl text-gray-600">
              Plan-specific certificate and digital wallet card allowances included. Additional certificates and cards: $5.95 each, automatically billed to your monthly subscription.
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
                <div className="text-lg font-semibold text-blue-600">Plan-specific allowances + $5.95 per certificate</div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Each plan includes different certificate allowances for the first month. Additional certificates: $5.95 each, automatically added to your monthly bill. If the instructor needs to add an EM 385-1-1 reference to specific training, they'll be able to add it themselves when instructing the generators to produce the cert.
                </p>
                
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold text-blue-900 mb-2">Certificate Allowances by Plan:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>Essential:</strong> 15 certificates included</li>
                    <li>• <strong>Professional:</strong> 50 certificates included</li>
                    <li>• <strong>Enterprise:</strong> 100 certificates included</li>
                    <li>• <strong>Enterprise Plus:</strong> 250 certificates included</li>
                  </ul>
                </div>
                
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
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                    <p className="text-sm font-medium text-yellow-900">Billing Information:</p>
                    <p className="text-sm text-yellow-800">Additional certificates beyond your plan's allowance are automatically billed at $5.95 each as usage charges added to your monthly subscription. No service interruption - generate certificates as needed and pay for actual usage.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Digital Wallet Card Service */}
            <Card className="border-2 border-green-200 hover:border-green-300 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-green-600" />
                  Digital Wallet Card Service
                </CardTitle>
                <div className="text-lg font-semibold text-green-600">Plan-specific allowances + $5.95 per card</div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Each plan includes different digital wallet card allowances for the first month. Additional cards: $5.95 each, automatically added to your monthly bill. If the instructor needs to add an EM 385-1-1 reference to specific training, they'll be able to add it themselves when instructing the generators to produce the card.
                </p>
                
                <div className="bg-green-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold text-green-900 mb-2">Digital Card Allowances by Plan:</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• <strong>Essential:</strong> 15 digital wallet cards included</li>
                    <li>• <strong>Professional:</strong> 50 digital wallet cards included</li>
                    <li>• <strong>Enterprise:</strong> 100 digital wallet cards included</li>
                    <li>• <strong>Enterprise Plus:</strong> 250 digital wallet cards included</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-gray-900">Digital Wallet Card Features:</h4>
                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                      <li>• Digital-only format for viewing on phones, tablets, computers</li>
                      <li>• Front: Company logo, employee name, primary certification</li>
                      <li>• Back: Equipment authorizations and compliance references</li>
                      <li>• Multiple certifications with training/expiry dates</li>
                      <li>• OSHA compliance statements (29 CFR, ANSI standards)</li>
                      <li>• EM 385-1-1 compliance references with certification details</li>
                      <li>• Professional layout optimized for mobile and desktop viewing</li>
                      <li>• Instant access - view certifications anytime, anywhere</li>
                      <li>• No printing equipment required - completely digital</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-green-900">Perfect For:</p>
                    <p className="text-sm text-green-800">Companies wanting instant digital access to employee certifications without printing costs or equipment</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Key Benefits:</p>
                    <p className="text-sm text-blue-800">Always available, never lost, environmentally friendly, and accessible on any device</p>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                    <p className="text-sm font-medium text-yellow-900">Billing Information:</p>
                    <p className="text-sm text-yellow-800">Additional digital wallet cards beyond your plan's allowance are automatically billed at $5.95 each as usage charges added to your monthly subscription. No service interruption - generate cards as needed and pay for actual usage.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sample Output Examples */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center mb-8">Sample Certificate & Digital Card Outputs</h3>
            <p className="text-center text-gray-600 mb-12">Examples of professional-quality certificates (for printing) and digital wallet cards (for viewing) generated by SafetySync.AI</p>
            
            <div className="max-w-2xl mx-auto">
              {/* Certificate Sample */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg text-center">Professional Certificate Sample</h4>
                <div className="border-2 border-gray-300 rounded-lg p-8 bg-white shadow-lg">
                  <div className="text-center space-y-4">
                    <div className="text-2xl font-bold text-blue-800 mb-6">CERTIFICATE OF COMPLETION</div>
                    <div className="text-xl font-semibold mb-2">Mark Anderson</div>
                    <div className="text-gray-700 mb-2">has successfully achieved the certification</div>
                    <div className="text-xl font-bold text-blue-800 mb-4">POWER INDUSTRIAL TRUCKS OPERATOR</div>
                    <div className="text-sm text-gray-600 mb-4">
                      in accordance with 29 CFR 1910.178, ANSI/ITSDF B56.1, and EM 385-1-1 standards
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
                      <div>Contact Hours: 8 CEU</div>
                      <div>Completion Date: 07/06/2025</div>
                      <div>Expiration Date: 07/06/2028</div>
                      <div>Certificate #: SC-2025-001847</div>
                    </div>
                    <div className="border-t pt-4 text-xs text-gray-600">
                      <div>Instructor: Sarah Mitchell, CSP</div>
                      <div>SafetySync.AI Training Solutions</div>
                      <div>support@safetysync.ai</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <div className="bg-blue-50 p-6 rounded-lg max-w-4xl mx-auto">
                <h4 className="font-semibold text-blue-900 mb-2">Professional Quality Guaranteed</h4>
                <p className="text-blue-800 text-sm">
                  All certificates are generated with OSHA/ANSI/EM 385-1-1 compliance references, unique tracking numbers, 
                  specific equipment authorizations, and professional formatting ready for printing. Digital wallet cards provide 
                  instant access to certification details with professional formatting optimized for mobile and desktop viewing. 
                  Plan-specific allowances included (15-250 items per plan), additional certificates and digital wallet cards: $5.95 each, automatically billed to your monthly subscription.
                </p>
              </div>
            </div>
            
            {/* Digital Wallet Card Examples */}
            <div className="mt-12 max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h4 className="text-2xl font-bold text-gray-900 mb-2">Digital Wallet Card Examples</h4>
                <p className="text-gray-600">
                  Professional digital wallet cards with front-side certification details and back-side equipment authorizations, just like physical certification cards
                </p>
              </div>
              
              {/* Equipment Operator Cards - Front & Back Examples */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Equipment Operator Card 1 - FRONT */}
                <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden" style={{ aspectRatio: '1.586/1' }}>
                  <div className="bg-blue-600 text-white p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm">EQUIPMENT OPERATOR</span>
                      <span className="text-xs">FRONT</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-gray-200 rounded border mr-3 flex items-center justify-center">
                        <span className="text-xs text-gray-500">LOGO</span>
                      </div>
                      <div>
                        <div className="font-bold text-lg">Michael Torres</div>
                        <div className="text-sm text-gray-600">Heavy Equipment Operator</div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <h6 className="font-semibold text-xs mb-2">CERTIFICATIONS:</h6>
                      <div className="text-xs space-y-1">
                        <div>• Power Industrial Trucks (29 CFR 1910.178)</div>
                        <div>• Mobile Elevated Work Platforms</div>
                        <div>• Material Handling Equipment</div>
                        <div>• Earth-moving Equipment</div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 border-t pt-2">
                      <div>Certified: 07/09/2025 | Expires: 07/09/2028</div>
                      <div>Sarah Mitchell, CSP | SafetySync.AI</div>
                    </div>
                  </div>
                </div>

                {/* Equipment Operator Card 1 - BACK */}
                <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden" style={{ aspectRatio: '1.586/1' }}>
                  <div className="bg-blue-600 text-white p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm">EQUIPMENT OPERATOR</span>
                      <span className="text-xs">BACK</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-3">
                      <h6 className="font-semibold text-xs mb-2">AUTHORIZED EQUIPMENT:</h6>
                      <div className="text-xs space-y-1">
                        <div>• JLG 40 AJ Boom Lift</div>
                        <div>• CAT 315 FL Excavator</div>
                        <div>• Volvo ECR88D Compact</div>
                        <div>• Genie Z62/40 Articulating</div>
                        <div>• CAT TL 642 Telehandler</div>
                        <div>• 259D3 CAT Skidsteer</div>
                        <div>• Bobcat S650 Skid Steer</div>
                        <div>• John Deere 310L Backhoe</div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 border-t pt-2">
                      <div>Training compliant with OSHA 29 CFR 1910.178,</div>
                      <div>1926.453, 1926.602, ANSI/ITSDF B56.1,</div>
                      <div>ANSI A92, and EM 385-1-1 standards</div>
                    </div>
                  </div>
                </div>

                {/* Fall Protection Card - FRONT */}
                <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden" style={{ aspectRatio: '1.586/1' }}>
                  <div className="bg-red-600 text-white p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm">FALL PROTECTION</span>
                      <span className="text-xs">FRONT</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-gray-200 rounded border mr-3 flex items-center justify-center">
                        <span className="text-xs text-gray-500">LOGO</span>
                      </div>
                      <div>
                        <div className="font-bold text-lg">David Chen</div>
                        <div className="text-sm text-gray-600">Construction Safety Specialist</div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <h6 className="font-semibold text-xs mb-2">CERTIFICATIONS:</h6>
                      <div className="text-xs space-y-1">
                        <div>• Fall Protection Systems (29 CFR 1926.501)</div>
                        <div>• Personal Fall Arrest Systems</div>
                        <div>• Guardrail & Safety Net Systems</div>
                        <div>• Ladder & Scaffold Safety</div>
                        <div>• Competent Person Fall Protection</div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 border-t pt-2">
                      <div>Certified: 07/09/2025 | Expires: 07/09/2026</div>
                      <div>Lisa Adams, CSP | SafetySync.AI</div>
                    </div>
                  </div>
                </div>

                {/* Fall Protection Card - BACK */}
                <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden" style={{ aspectRatio: '1.586/1' }}>
                  <div className="bg-red-600 text-white p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm">FALL PROTECTION</span>
                      <span className="text-xs">BACK</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-3">
                      <h6 className="font-semibold text-xs mb-2">AUTHORIZED EQUIPMENT & SYSTEMS:</h6>
                      <div className="text-xs space-y-1">
                        <div>• Full Body Harness Systems</div>
                        <div>• Self-Retracting Lifelines (SRL)</div>
                        <div>• Horizontal Lifeline Systems</div>
                        <div>• Guardrail Installation</div>
                        <div>• Safety Net Systems</div>
                        <div>• Positioning Device Systems</div>
                        <div>• Fall Restraint Systems</div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 border-t pt-2">
                      <div>Training compliant with OSHA 29 CFR 1926.501,</div>
                      <div>1926.502, 1926.503, ANSI Z359 standards,</div>
                      <div>and EM 385-1-1 fall protection requirements</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional Front & Back Examples */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Crane Operator Card - FRONT */}
                <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden" style={{ aspectRatio: '1.586/1' }}>
                  <div className="bg-orange-600 text-white p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm">CRANE OPERATOR</span>
                      <span className="text-xs">FRONT</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-gray-200 rounded border mr-3 flex items-center justify-center">
                        <span className="text-xs text-gray-500">LOGO</span>
                      </div>
                      <div>
                        <div className="font-bold text-lg">Robert Kim</div>
                        <div className="text-sm text-gray-600">Certified Crane Operator</div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <h6 className="font-semibold text-xs mb-2">CERTIFICATIONS:</h6>
                      <div className="text-xs space-y-1">
                        <div>• Mobile Crane Operations</div>
                        <div>• Tower Crane Operations</div>
                        <div>• Overhead Bridge Crane</div>
                        <div>• Rough Terrain Crane</div>
                        <div>• Crane Rigging & Signaling</div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 border-t pt-2">
                      <div>Certified: 07/09/2025 | Expires: 07/09/2028</div>
                      <div>Tom Wilson, CIH | SafetySync.AI</div>
                    </div>
                  </div>
                </div>

                {/* Crane Operator Card - BACK */}
                <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden" style={{ aspectRatio: '1.586/1' }}>
                  <div className="bg-orange-600 text-white p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm">CRANE OPERATOR</span>
                      <span className="text-xs">BACK</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-3">
                      <h6 className="font-semibold text-xs mb-2">AUTHORIZED EQUIPMENT:</h6>
                      <div className="text-xs space-y-1">
                        <div>• Mobile Crane 25-Ton</div>
                        <div>• Tower Crane TC-6015</div>
                        <div>• Overhead Bridge Crane (15-Ton)</div>
                        <div>• Rough Terrain Crane RT540</div>
                        <div>• All-Terrain Crane AT-60</div>
                        <div>• Truck-Mounted Crane</div>
                        <div>• Jib Crane Systems</div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 border-t pt-2">
                      <div>Training compliant with OSHA 29 CFR 1926.1400,</div>
                      <div>ASME B30.5, NCCCO certification standards,</div>
                      <div>and EM 385-1-1 crane operation requirements</div>
                    </div>
                  </div>
                </div>

                {/* Forklift Operator Card - FRONT */}
                <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden" style={{ aspectRatio: '1.586/1' }}>
                  <div className="bg-purple-600 text-white p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm">FORKLIFT OPERATOR</span>
                      <span className="text-xs">FRONT</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-gray-200 rounded border mr-3 flex items-center justify-center">
                        <span className="text-xs text-gray-500">LOGO</span>
                      </div>
                      <div>
                        <div className="font-bold text-lg">Maria Santos</div>
                        <div className="text-sm text-gray-600">Warehouse Operations</div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <h6 className="font-semibold text-xs mb-2">CERTIFICATIONS:</h6>
                      <div className="text-xs space-y-1">
                        <div>• Power Industrial Trucks (29 CFR 1910.178)</div>
                        <div>• Forklift Operation & Safety</div>
                        <div>• Material Handling Equipment</div>
                        <div>• Warehouse Safety Training</div>
                        <div>• Load Handling & Stability</div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 border-t pt-2">
                      <div>Certified: 07/09/2025 | Expires: 07/09/2028</div>
                      <div>Carlos Rodriguez, CSP | SafetySync.AI</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 max-w-4xl mx-auto">
                  <h5 className="font-semibold text-blue-900 mb-2">Professional Digital Wallet Cards</h5>
                  <p className="text-blue-800 text-sm">
                    Each card features front-side certification details (company logo, employee info, certifications, dates, instructor) and back-side equipment authorizations 
                    (specific machinery, compliance standards). Cards are optimized for mobile viewing with professional formatting, unique tracking numbers, 
                    OSHA compliance references, and complete regulatory compliance information.
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-8">
                <div className="mb-6">
                  <h5 className="font-semibold text-orange-800 mb-2">Multi-Card Series Example</h5>
                  <p className="text-sm text-orange-700">
                    When operators are certified for extensive equipment fleets, the system automatically generates additional cards to accommodate all authorized machinery:
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Card 1 - FRONT */}
                  <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden" style={{ aspectRatio: '1/1.586' }}>
                    <div className="bg-blue-600 text-white p-3">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs">EQUIPMENT OPERATOR</span>
                        <span className="text-xs">FRONT</span>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center mb-3">
                        <div className="w-6 h-6 bg-gray-200 rounded border mr-2 flex items-center justify-center">
                          <span className="text-xs text-gray-500">LG</span>
                        </div>
                        <div>
                          <div className="font-bold text-sm">John Smith</div>
                          <div className="text-xs text-gray-600">Heavy Equipment Operator</div>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <h6 className="font-semibold text-xs mb-2">CERTIFICATIONS:</h6>
                        <div className="text-xs space-y-1">
                          <div>• Power Industrial Trucks</div>
                          <div>• Mobile Elevated Work Platforms</div>
                          <div>• Material Handling Equipment</div>
                          <div>• Earth-moving Equipment</div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 border-t pt-2">
                        <div>Certified: 07/09/2025</div>
                        <div>Expires: 07/09/2028</div>
                        <div>Sarah Mitchell, CSP</div>
                        <div className="font-medium text-orange-600">Card 1 of 2</div>
                      </div>
                    </div>
                  </div>

                  {/* Card 1 - BACK */}
                  <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden" style={{ aspectRatio: '1/1.586' }}>
                    <div className="bg-blue-600 text-white p-3">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs">EQUIPMENT OPERATOR</span>
                        <span className="text-xs">BACK</span>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="mb-3">
                        <h6 className="font-semibold text-xs mb-2">AUTHORIZED EQUIPMENT:</h6>
                        <div className="text-xs space-y-1">
                          <div>• JLG 40 AJ Boom Lift</div>
                          <div>• JLG 60 AJ Boom Lift</div>
                          <div>• JLG 80 AJ Boom Lift</div>
                          <div>• Genie Z62/40 Articulating</div>
                          <div>• CAT 315 FL Excavator</div>
                          <div>• Volvo ECR88D Compact</div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 border-t pt-2">
                        <div>OSHA 29 CFR 1910.178, 1926.453</div>
                        <div>ANSI A92, ITSDF B56.1</div>
                        <div>EM 385-1-1 standards</div>
                        <div className="font-medium text-orange-600">Continued on Card 2...</div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2 - FRONT */}
                  <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden" style={{ aspectRatio: '1/1.586' }}>
                    <div className="bg-blue-600 text-white p-3">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs">EQUIPMENT OPERATOR</span>
                        <span className="text-xs">FRONT</span>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center mb-3">
                        <div className="w-6 h-6 bg-gray-200 rounded border mr-2 flex items-center justify-center">
                          <span className="text-xs text-gray-500">LG</span>
                        </div>
                        <div>
                          <div className="font-bold text-sm">John Smith</div>
                          <div className="text-xs text-gray-600">Heavy Equipment Operator</div>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <h6 className="font-semibold text-xs mb-2">CERTIFICATIONS:</h6>
                        <div className="text-xs space-y-1">
                          <div>• Power Industrial Trucks</div>
                          <div>• Mobile Elevated Work Platforms</div>
                          <div>• Material Handling Equipment</div>
                          <div>• Earth-moving Equipment</div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 border-t pt-2">
                        <div>Certified: 07/09/2025</div>
                        <div>Expires: 07/09/2028</div>
                        <div>Sarah Mitchell, CSP</div>
                        <div className="font-medium text-orange-600">Card 2 of 2</div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2 - BACK */}
                  <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden" style={{ aspectRatio: '1/1.586' }}>
                    <div className="bg-blue-600 text-white p-3">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs">EQUIPMENT OPERATOR</span>
                        <span className="text-xs">BACK</span>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="mb-3">
                        <h6 className="font-semibold text-xs mb-2">ADDITIONAL EQUIPMENT:</h6>
                        <div className="text-xs space-y-1">
                          <div>• CAT TL 642 Telehandler</div>
                          <div>• Genie GTH-636 Telehandler</div>
                          <div>• 259D3 CAT Compact Track</div>
                          <div>• John Deere 310L Backhoe</div>
                          <div>• Bobcat S650 Skid Steer</div>
                          <div>• Komatsu PC210 Excavator</div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 border-t pt-2">
                        <div>OSHA 29 CFR 1926.602</div>
                        <div>ANSI B56.1, A92 standards</div>
                        <div>EM 385-1-1 compliance</div>
                        <div className="font-medium text-green-600">Series Complete</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-blue-800 font-medium">Professional Equipment Authorization</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Each card maintains full compliance with OSHA 29 CFR, ANSI standards, and EM 385-1-1 requirements. 
                        Additional cards are generated automatically when equipment lists exceed standard card capacity.
                      </p>
                    </div>
                  </div>
                </div>
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
                      <li>• Card printer compatible (.efi format)</li>
                    </ul>
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
                  <strong>Certificate & Card Generation:</strong> $49/month base plan includes 50 certificates + 50 digital wallet cards. Additional usage beyond included amounts is billed at $0.75 per item automatically.
                </p>
                <p className="text-sm text-gray-600">
                  This hybrid subscription model provides predictable monthly costs with fair overage pricing for heavier usage while maintaining professional quality standards.
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
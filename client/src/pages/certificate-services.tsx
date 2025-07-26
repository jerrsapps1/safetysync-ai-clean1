import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, CreditCard, Download, Eye, Shield, Star } from "lucide-react";

export default function CertificateServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-full px-4 py-2 mb-6">
            <Award className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 font-medium">Professional Certificate Generation</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Professional Certificate & Digital Card Services
          </h1>
          
          <p className="text-xl text-blue-300 mb-8 max-w-3xl mx-auto">
            Generate high-quality OSHA-compliant certificates and digital wallet cards that match industry standards. 
            Perfect for safety professionals who need authentic documentation for their training programs.
          </p>
        </div>
      </section>

      {/* Service Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Certificate Generation */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-yellow-400" />
                  Professional Certificates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-sm">OSHA-compliant format with regulatory citations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm">High-resolution PDF (300 DPI) for professional printing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-blue-400" />
                    <span className="text-sm">Custom company branding and instructor credentials</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-purple-400" />
                    <span className="text-sm">Unique certificate numbers for tracking</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Digital Wallet Cards */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-blue-400" />
                  Digital Wallet Cards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Always FREE - Digital view only</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-purple-400" />
                    <span className="text-sm">Front/back structure mimicking physical cards</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm">Equipment authorization lists and compliance standards</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-blue-400" />
                    <span className="text-sm">Optimized for mobile viewing and display</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Structure */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Certificate Generation Pricing</h2>
            <p className="text-blue-300 text-lg">
              Plan-specific allowances with transparent overage pricing
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm border-blue-400/30 text-white">
              <CardHeader className="text-center">
                <CardTitle className="text-blue-300">Essential</CardTitle>
                <div className="text-2xl font-bold">$49/month</div>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-lg font-semibold mb-2">15 items included</div>
                <div className="text-sm text-blue-300">First month: 15 certificates + 15 digital cards</div>
                <div className="text-sm text-blue-300 mt-2">Additional: $5.95 each</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm border-purple-400/30 text-white">
              <CardHeader className="text-center">
                <CardTitle className="text-purple-300">Professional</CardTitle>
                <div className="text-2xl font-bold">$112/month</div>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-lg font-semibold mb-2">50 items included</div>
                <div className="text-sm text-blue-300">First month: 50 certificates + 50 digital cards</div>
                <div className="text-sm text-blue-300 mt-2">Additional: $5.95 each</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-600/20 to-teal-600/20 backdrop-blur-sm border-green-400/30 text-white">
              <CardHeader className="text-center">
                <CardTitle className="text-green-300">Enterprise</CardTitle>
                <div className="text-2xl font-bold">$258/month</div>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-lg font-semibold mb-2">100 items included</div>
                <div className="text-sm text-blue-300">First month: 100 certificates + 100 digital cards</div>
                <div className="text-sm text-blue-300 mt-2">Additional: $5.95 each</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-sm border-yellow-400/30 text-white">
              <CardHeader className="text-center">
                <CardTitle className="text-yellow-300">Enterprise Plus</CardTitle>
                <div className="text-2xl font-bold">$686/month</div>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-lg font-semibold mb-2">250 items included</div>
                <div className="text-sm text-blue-300">First month: 250 certificates + 250 digital cards</div>
                <div className="text-sm text-blue-300 mt-2">Additional: $5.95 each</div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-blue-900/30 backdrop-blur-sm border border-blue-400/30 rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Billing Information</h3>
            <p className="text-blue-300">
              Additional certificates and digital cards are automatically billed to your monthly subscription at $5.95 each. 
              Service remains uninterrupted - generate as needed.
            </p>
          </div>
        </div>
      </section>

      {/* Digital Wallet Card Examples */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Digital Wallet Card Examples</h2>
            <p className="text-blue-300 text-lg">
              Professional credit card-sized examples showcasing generator capabilities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Heavy Equipment Operator Card - FRONT */}
            <div className="bg-white border-2 border-blue-300 rounded-lg shadow-lg overflow-hidden" style={{ aspectRatio: '1.586/1' }}>
              <div className="bg-blue-600 text-white p-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">EQUIPMENT OPERATOR</span>
                  <span className="text-xs">FRONT</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-blue-200 rounded border mr-3 flex items-center justify-center">
                    <span className="text-xs text-blue-400">LOGO</span>
                  </div>
                  <div>
                    <div className="font-bold text-lg">Michael Torres</div>
                    <div className="text-sm text-blue-500">Heavy Equipment Operator</div>
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
                
                <div className="text-xs text-blue-400 border-t pt-2">
                  <div>Certified: 07/09/2025 | Expires: 07/09/2028</div>
                  <div>Sarah Mitchell, CSP | SafetySync.AI</div>
                </div>
              </div>
            </div>

            {/* Equipment Operator Card - BACK */}
            <div className="bg-white border-2 border-blue-300 rounded-lg shadow-lg overflow-hidden" style={{ aspectRatio: '1.586/1' }}>
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
                
                <div className="text-xs text-blue-400 border-t pt-2">
                  <div>Training compliant with OSHA 29 CFR 1910.178,</div>
                  <div>1926.453, 1926.602, ANSI/ITSDF B56.1,</div>
                  <div>and ANSI A92 standards</div>
                </div>
              </div>
            </div>

            {/* Fall Protection Card - FRONT */}
            <div className="bg-white border-2 border-blue-300 rounded-lg shadow-lg overflow-hidden" style={{ aspectRatio: '1.586/1' }}>
              <div className="bg-red-600 text-white p-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">FALL PROTECTION</span>
                  <span className="text-xs">FRONT</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-blue-200 rounded border mr-3 flex items-center justify-center">
                    <span className="text-xs text-blue-400">LOGO</span>
                  </div>
                  <div>
                    <div className="font-bold text-lg">David Chen</div>
                    <div className="text-sm text-blue-500">Construction Safety Specialist</div>
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
                
                <div className="text-xs text-blue-400 border-t pt-2">
                  <div>Certified: 07/09/2025 | Expires: 07/09/2026</div>
                  <div>Lisa Adams, CSP | SafetySync.AI</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 max-w-4xl mx-auto">
              <h5 className="font-semibold text-blue-900 mb-2">Professional Digital Wallet Cards</h5>
              <p className="text-blue-800 text-sm">
                Each card features front-side certification details (company logo, employee info, certifications, dates, instructor) and back-side equipment authorizations 
                (specific machinery, compliance standards). Cards are optimized for mobile viewing with professional formatting, unique tracking numbers, 
                OSHA compliance references, and complete regulatory compliance information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-blue-300 text-lg mb-8">
            Choose a subscription plan that fits your needs and start generating professional certificates today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3"
              onClick={() => window.location.href = '/pricing'}
            >
              View Pricing Plans
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-3"
              onClick={() => window.location.href = '/'}
            >
              Start Free Trial
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
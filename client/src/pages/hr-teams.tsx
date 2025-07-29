import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  Award, 
  BarChart3, 
  Bell, 
  Shield,
  ArrowRight,
  CheckCircle,
  Clock,
  Search,
  Download
} from 'lucide-react';
import { Link } from 'wouter';

export default function HRTeams() {
  const features = [
    {
      icon: Users,
      title: "Employee Training Management",
      description: "Track training progress across your entire organization with automated assignment and completion tracking.",
      benefits: ["Bulk employee uploads", "Automated training assignments", "Progress tracking dashboard", "Skills gap analysis"]
    },
    {
      icon: FileText,
      title: "Compliance Documentation",
      description: "Maintain organized, audit-ready documentation for all OSHA and safety training requirements.",
      benefits: ["Automated compliance reports", "Document version control", "Audit trail logging", "Regulatory updates"]
    },
    {
      icon: Award,
      title: "Digital Certificates",
      description: "Issue and manage digital certificates and wallet cards that employees can access anywhere.",
      benefits: ["QR code verification", "Mobile-friendly cards", "Automatic renewals", "Brand customization"]
    },
    {
      icon: BarChart3,
      title: "Training Matrix",
      description: "Visual training matrix showing required vs completed training by role, department, and location.",
      benefits: ["Role-based requirements", "Department analytics", "Location tracking", "Competency mapping"]
    },
    {
      icon: Bell,
      title: "Automated Reminders",
      description: "Never miss training deadlines with automated email and SMS reminders for employees and managers.",
      benefits: ["Expiration alerts", "Manager notifications", "Escalation workflows", "Custom reminder schedules"]
    },
    {
      icon: Shield,
      title: "Reporting & Analytics",
      description: "Comprehensive reporting tools to demonstrate compliance and identify training needs.",
      benefits: ["Executive dashboards", "Compliance scorecards", "ROI tracking", "Custom reports"]
    }
  ];

  return (
    <div className="pt-16 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30">
              Built for HR Professionals
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Streamline Training Management for HR Teams
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Eliminate spreadsheets and manual tracking. SafetySync.AI gives HR teams the tools 
              to manage employee training, ensure compliance, and demonstrate ROI—all in one platform.
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
                  Schedule HR Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Everything HR Teams Need
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              From onboarding to compliance reporting, we've built the complete solution for HR training management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-white/20 rounded-lg mr-4">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-white text-xl">
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-100 mb-4">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="text-blue-100 text-sm flex items-start">
                        <CheckCircle className="w-4 h-4 text-emerald-400 mr-2 mt-0.5 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* HR-Specific Benefits */}
      <section className="py-20 bg-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Designed with HR Workflows in Mind
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                We understand the unique challenges HR teams face. That's why SafetySync.AI integrates seamlessly 
                with your existing HR processes and systems.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Clock className="w-6 h-6 text-emerald-400 mr-4 mt-1" />
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-2">Save 15+ Hours Per Week</h3>
                    <p className="text-blue-100">Eliminate manual tracking and report generation with automated workflows.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Search className="w-6 h-6 text-emerald-400 mr-4 mt-1" />
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-2">Instant Audit Readiness</h3>
                    <p className="text-blue-100">Generate compliance reports in seconds, not hours, whenever auditors arrive.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Download className="w-6 h-6 text-emerald-400 mr-4 mt-1" />
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-2">Executive Reporting</h3>
                    <p className="text-blue-100">Demonstrate training ROI and compliance status with executive-ready dashboards.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-emerald-400 mb-2">98.7%</div>
                    <p className="text-white font-semibold mb-1">Training Completion Rate</p>
                    <p className="text-blue-100 text-sm">Average across our HR customers</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-emerald-400 mb-2">75%</div>
                    <p className="text-white font-semibold mb-1">Reduction in Admin Time</p>
                    <p className="text-blue-100 text-sm">More time for strategic HR initiatives</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-emerald-400 mb-2">Zero</div>
                    <p className="text-white font-semibold mb-1">Training-Related Violations</p>
                    <p className="text-blue-100 text-sm">Perfect compliance record</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your HR Training Management?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of HR teams who have eliminated training headaches with SafetySync.AI.
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
                Talk to HR Specialist
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
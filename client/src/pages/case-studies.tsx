import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Building,
  BarChart3,
  Target
} from "lucide-react";
import { Link } from "wouter";

interface CaseStudy {
  id: number;
  company: string;
  industry: string;
  employees: string;
  challenge: string;
  solution: string;
  implementation: string[];
  results: {
    timeReduction: string;
    costSavings: string;
    complianceImprovement: string;
    roi: string;
  };
  timeline: string;
  featured: boolean;
  quote: string;
  author: string;
  authorTitle: string;
}

const caseStudies: CaseStudy[] = [
  {
    id: 1,
    company: "BuildRight Construction",
    industry: "Construction",
    employees: "150-200",
    challenge: "BuildRight Construction was struggling with manual OSHA compliance tracking across multiple job sites. Their safety director spent 20+ hours weekly managing spreadsheets, chasing expiring certifications, and preparing for audits. A failed OSHA inspection resulted in $25,000 in fines and project delays.",
    solution: "SafetySync's AI-powered platform automated their entire compliance workflow with predictive analytics, multi-site monitoring, and instant audit reports.",
    implementation: [
      "Migrated from Excel spreadsheets to cloud-based tracking",
      "Integrated with existing HR and payroll systems",
      "Set up automated certification alerts 30 days before expiration",
      "Deployed mobile app for field workers and supervisors",
      "Configured real-time compliance dashboards for management"
    ],
    results: {
      timeReduction: "90%",
      costSavings: "$45,000/year",
      complianceImprovement: "98%",
      roi: "300%"
    },
    timeline: "2 weeks implementation, results visible in 30 days",
    featured: true,
    quote: "SafetySync transformed our compliance from a liability into a competitive advantage. We went from failing inspections to becoming the industry benchmark.",
    author: "Sarah Mitchell",
    authorTitle: "Safety Director"
  },
  {
    id: 2,
    company: "SteelCore Manufacturing",
    industry: "Manufacturing",
    employees: "300-500",
    challenge: "SteelCore Manufacturing faced complex multi-state compliance requirements with varying OSHA standards. Managing 400+ employees across 6 facilities meant constant certification gaps and audit preparation nightmares. Manual tracking led to 15% non-compliance rates.",
    solution: "Implemented SafetySync's enterprise solution with multi-location dashboards, automated compliance mapping, and predictive analytics for proactive management.",
    implementation: [
      "Enterprise deployment across 6 manufacturing facilities",
      "Custom compliance mapping for multi-state regulations",
      "Integration with existing safety management systems",
      "Advanced analytics dashboard for C-suite visibility",
      "Automated reporting for regulatory submissions"
    ],
    results: {
      timeReduction: "85%",
      costSavings: "$78,000/year",
      complianceImprovement: "100%",
      roi: "425%"
    },
    timeline: "4 weeks implementation, 60-day optimization period",
    featured: true,
    quote: "The predictive analytics caught issues we didn't even know existed. Our last OSHA audit was our first with zero violations in company history.",
    author: "Michael Chen",
    authorTitle: "Operations Manager"
  },
  {
    id: 3,
    company: "ChemSafe Industries",
    industry: "Chemical Processing",
    employees: "200-300",
    challenge: "In the high-risk chemical processing industry, compliance isn't optional—it's life or death. ChemSafe struggled with complex hazmat certifications, frequent regulation changes, and the need for real-time incident tracking. Previous systems were reactive, not preventive.",
    solution: "SafetySync's specialized chemical industry module provided real-time monitoring, automated hazmat compliance tracking, and incident prediction algorithms.",
    implementation: [
      "Specialized chemical industry compliance modules",
      "Real-time hazmat certification monitoring",
      "Integration with emergency response systems",
      "Predictive analytics for incident prevention",
      "Automated regulatory change notifications"
    ],
    results: {
      timeReduction: "80%",
      costSavings: "$65,000/year",
      complianceImprovement: "99%",
      roi: "380%"
    },
    timeline: "3 weeks implementation with safety-critical phased rollout",
    featured: false,
    quote: "SafetySync's proactive approach has prevented multiple potential incidents. The ROI in safety alone is immeasurable.",
    author: "David Thompson",
    authorTitle: "Plant Manager"
  },
  {
    id: 4,
    company: "PowerGrid Energy",
    industry: "Energy/Utilities",
    employees: "500+",
    challenge: "PowerGrid Energy operates critical infrastructure with 800+ employees across 15 states. Complex federal and state regulations, high-voltage safety requirements, and 24/7 operations created a compliance nightmare. Manual systems couldn't scale with rapid growth.",
    solution: "Enterprise-grade SafetySync deployment with custom energy sector modules, 24/7 monitoring, and federal compliance automation.",
    implementation: [
      "Multi-state regulatory compliance automation",
      "24/7 real-time safety monitoring systems",
      "Federal energy sector compliance modules",
      "Emergency response integration protocols",
      "Executive dashboard with predictive insights"
    ],
    results: {
      timeReduction: "88%",
      costSavings: "$120,000/year",
      complianceImprovement: "97%",
      roi: "450%"
    },
    timeline: "6 weeks phased implementation across all facilities",
    featured: false,
    quote: "Managing compliance for critical infrastructure requires military-grade precision. SafetySync delivers exactly that.",
    author: "Robert Kim",
    authorTitle: "Compliance Manager"
  }
];

const industryMetrics = [
  { metric: "Average Time Reduction", value: "86%", icon: Clock },
  { metric: "Average Cost Savings", value: "$77K/year", icon: DollarSign },
  { metric: "Compliance Improvement", value: "98.5%", icon: Target },
  { metric: "Average ROI", value: "388%", icon: TrendingUp }
];

export default function CaseStudiesPage() {
  const featuredStudies = caseStudies.filter(study => study.featured);
  const allStudies = caseStudies.filter(study => !study.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400">
      <PageHeader />

      {/* Main Content with Sidebar Margin */}
      <div className="md:ml-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Real Results from Real Companies
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Discover how industry leaders across construction, manufacturing, and energy 
            sectors achieved dramatic compliance improvements with SafetySync.AI
          </p>
          
          {/* Industry Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {industryMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <metric.icon className="w-6 h-6 text-emerald-400 mr-2" />
                  <div className="text-2xl font-bold text-emerald-400">{metric.value}</div>
                </div>
                <div className="text-sm text-gray-300">{metric.metric}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Case Studies */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Featured Success Stories</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredStudies.map((study) => (
              <Card key={study.id} className="hover:shadow-xl transition-all duration-300 bg-blue-700/50 border-blue-600/50 backdrop-blur-sm hover:bg-blue-700/70">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                      Featured
                    </Badge>
                    <div className="text-sm text-gray-300">{study.timeline}</div>
                  </div>
                  <CardTitle className="text-xl text-white">{study.company}</CardTitle>
                  <CardDescription className="flex items-center gap-4 text-sm text-gray-300">
                    <span className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      {study.industry}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {study.employees} employees
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Challenge */}
                  <div>
                    <h4 className="font-semibold text-white mb-2">The Challenge</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">{study.challenge}</p>
                  </div>

                  {/* Solution */}
                  <div>
                    <h4 className="font-semibold text-white mb-2">SafetySync Solution</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">{study.solution}</p>
                  </div>

                  {/* Key Implementation Points */}
                  <div>
                    <h4 className="font-semibold text-white mb-2">Implementation Highlights</h4>
                    <ul className="space-y-1">
                      {study.implementation.slice(0, 3).map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Results Grid */}
                  <div className="bg-blue-600/50 rounded-lg p-4 backdrop-blur-sm">
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Measurable Results
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-400">{study.results.timeReduction}</div>
                        <div className="text-xs text-gray-300">Time Reduction</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{study.results.costSavings}</div>
                        <div className="text-xs text-gray-300">Annual Savings</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">{study.results.complianceImprovement}</div>
                        <div className="text-xs text-gray-300">Compliance Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-400">{study.results.roi}</div>
                        <div className="text-xs text-gray-300">ROI</div>
                      </div>
                    </div>
                  </div>

                  {/* Quote */}
                  <blockquote className="border-l-4 border-emerald-500/50 pl-4 italic text-gray-300">
                    "{study.quote}"
                    <footer className="mt-2 text-sm text-blue-300">
                      — {study.author}, {study.authorTitle}
                    </footer>
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* All Case Studies */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">More Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allStudies.map((study) => (
              <Card key={study.id} className="hover:shadow-lg transition-shadow bg-blue-700/50 border-blue-600/50 backdrop-blur-sm hover:bg-blue-700/70">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg text-white">{study.company}</CardTitle>
                    <div className="text-sm text-gray-300">{study.timeline}</div>
                  </div>
                  <CardDescription className="flex items-center gap-4 text-sm text-gray-300">
                    <span className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      {study.industry}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {study.employees} employees
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {study.challenge}
                  </p>
                  
                  {/* Results Summary */}
                  <div className="bg-blue-600/50 rounded-lg p-3 backdrop-blur-sm">
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div>
                        <div className="text-lg font-bold text-emerald-400">{study.results.timeReduction}</div>
                        <div className="text-xs text-gray-300">Time Saved</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-400">{study.results.roi}</div>
                        <div className="text-xs text-gray-300">ROI</div>
                      </div>
                    </div>
                  </div>

                  <blockquote className="text-sm italic text-gray-300 border-l-2 border-emerald-500/50 pl-3">
                    "{study.quote}"
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Industry Impact */}
        <section className="mb-16">
          <Card className="bg-blue-700/50 border-blue-600/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Industry-Wide Impact
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">1,200+</div>
                  <div className="text-gray-300">Companies Transformed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">$8.5M</div>
                  <div className="text-gray-300">Total Cost Savings</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">99.2%</div>
                  <div className="text-gray-300">Customer Satisfaction</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Write Your Success Story?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Join industry leaders who have transformed their OSHA compliance. 
              See measurable results in your first 30 days.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Start Your Transformation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="secondary" className="bg-white/10 border-white text-white hover:bg-white/20">
                  Schedule Strategy Call
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        </div>
      </div>
    </div>
  );
}
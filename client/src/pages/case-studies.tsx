import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Building, Factory, TrendingUp, Users, CheckCircle } from 'lucide-react';
import { Link } from 'wouter';
import { PageHeader } from '@/components/ui/page-header';

export default function CaseStudies() {
  const caseStudies = [
    {
      id: 1,
      company: "AcmeCorp Manufacturing",
      industry: "Manufacturing",
      employees: "500+",
      challenge: "Manual training tracking across 3 facilities, frequent OSHA violations",
      solution: "Automated compliance tracking, AI document processing, centralized training records",
      results: [
        "Zero OSHA violations in 18 months",
        "75% reduction in compliance preparation time",
        "100% on-time training completion rates"
      ],
      savings: "$50,000",
      timeframe: "6 months",
      icon: Factory,
      color: "bg-blue-500"
    },
    {
      id: 2,
      company: "BuildSafe Construction",
      industry: "Construction",
      employees: "200+",
      challenge: "Lost training certificates, expired certifications causing work delays",
      solution: "Digital wallet cards, QR code verification, automated renewal reminders",
      results: [
        "Eliminated work delays from expired certs",
        "90% faster onsite verification",
        "Reduced administrative overhead by 60%"
      ],
      savings: "$35,000",
      timeframe: "3 months",
      icon: Building,
      color: "bg-emerald-500"
    },
    {
      id: 3,
      company: "ChemTech Industries",
      industry: "Chemical Processing",
      employees: "300+",
      challenge: "Complex HAZWOPER training requirements, audit preparation stress",
      solution: "Automated compliance reporting, training matrix management, audit-ready documentation",
      results: [
        "Passed surprise OSHA audit with zero findings",
        "80% reduction in audit preparation time",
        "Improved training completion rates by 45%"
      ],
      savings: "$75,000",
      timeframe: "4 months",
      icon: Factory,
      color: "bg-purple-500"
    }
  ];

  return (
    <>
      <PageHeader />
      <div className="md:ml-16 pt-16 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Real Results from Real Companies
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            See how SafetySync.AI has transformed safety management for companies across industries, 
            eliminating compliance headaches and reducing costs.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <TrendingUp className="w-4 h-4 mr-2" />
              Average 70% Time Savings
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Users className="w-4 h-4 mr-2" />
              1000+ Employees Managed
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <CheckCircle className="w-4 h-4 mr-2" />
              Zero OSHA Violations
            </Badge>
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((study) => (
              <Card key={study.id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${study.color}`}>
                      <study.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                      {study.industry}
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-xl">
                    {study.company}
                  </CardTitle>
                  <p className="text-blue-100">
                    {study.employees} employees
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Challenge</h4>
                    <p className="text-blue-100 text-sm">{study.challenge}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">Solution</h4>
                    <p className="text-blue-100 text-sm">{study.solution}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">Results</h4>
                    <ul className="space-y-1">
                      {study.results.map((result, index) => (
                        <li key={index} className="text-blue-100 text-sm flex items-start">
                          <CheckCircle className="w-4 h-4 text-emerald-400 mr-2 mt-0.5 flex-shrink-0" />
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-white/20">
                    <div>
                      <p className="text-emerald-400 font-bold text-lg">{study.savings}</p>
                      <p className="text-blue-100 text-xs">Annual Savings</p>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{study.timeframe}</p>
                      <p className="text-blue-100 text-xs">Implementation</p>
                    </div>
                  </div>
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
            Ready to Join These Success Stories?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start your free trial today and see how SafetySync.AI can transform your safety management.
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
                Schedule Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
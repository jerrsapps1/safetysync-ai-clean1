import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Star, Quote, Building, Users, TrendingUp } from "lucide-react";
import { Link } from "wouter";

interface ResearchScenario {
  id: number;
  name: string;
  title: string;
  company: string;
  companySize: string;
  industry: string;
  rating: number;
  researchFindings: string;
  results: {
    timeReduction: string;
    complianceImprovement: string;
    costSavings: string;
  };
  image?: string;
}

// Note: These are hypothetical business scenarios for educational purposes only
// No actual customer testimonials or endorsements are represented
const researchScenarios: ResearchScenario[] = [
  {
    id: 1,
    name: "Construction Scenario #1",
    title: "Hypothetical Implementation",
    company: "Mid-Size Construction Business",
    companySize: "150-200 employees",
    industry: "Construction",
    rating: 0, // Remove star ratings to avoid testimonial appearance
    researchFindings: "Industry research suggests construction companies of this size typically face challenges with manual compliance tracking, requiring 15-20 hours weekly for OSHA documentation. Implementation scenarios show potential for automation to reduce administrative burden.",
    results: {
      timeReduction: "Research indicates: 60-80% reduction possible",
      complianceImprovement: "Industry studies show: 75-90% improvement potential",
      costSavings: "Estimated based on labor costs: $25,000-45,000/year"
    }
  },
  {
    id: 2,
    name: "Manufacturing Scenario #2",
    title: "Hypothetical Implementation",
    company: "Large Manufacturing Operation",
    companySize: "300-500 employees",
    industry: "Manufacturing",
    rating: 0,
    researchFindings: "Manufacturing industry data indicates facilities this size often struggle with tracking certifications across multiple departments. Academic studies on compliance automation suggest digital systems can significantly reduce manual oversight requirements.",
    results: {
      timeReduction: "Studies suggest: 65-80% reduction potential",
      complianceImprovement: "Research indicates: 80-95% improvement possible",
      costSavings: "Calculated from industry averages: $40,000-75,000/year"
    }
  },
  {
    id: 3,
    name: "Technology Scenario #3",
    title: "Hypothetical Implementation",
    company: "Growing Technology Business",
    companySize: "50-100 employees",
    industry: "Technology",
    rating: 0,
    researchFindings: "Technology sector research indicates growing companies often face compliance scaling challenges as headcount increases. Studies suggest digital platforms can help standardize safety protocols during rapid expansion phases.",
    results: {
      timeReduction: "Research suggests: 55-70% reduction potential",
      complianceImprovement: "Studies indicate: 75-90% improvement possible",
      costSavings: "Based on industry data: $12,000-22,000/year"
    }
  },
  {
    id: 4,
    name: "Chemical Processing Scenario #4",
    title: "Hypothetical Implementation", 
    company: "Chemical Processing Operation",
    companySize: "200-300 employees",
    industry: "Chemical Processing",
    rating: 0,
    researchFindings: "Chemical industry safety research highlights the complexity of managing multiple hazardous material certifications. Academic studies on high-risk facility automation suggest potential for reducing human error in compliance tracking.",
    results: {
      timeReduction: "Industry studies show: 60-75% reduction possible",
      complianceImprovement: "Research indicates: 85-95% improvement potential",
      costSavings: "Calculated from industry benchmarks: $35,000-65,000/year"
    }
  },
  {
    id: 5,
    name: "Logistics Scenario #5",
    title: "Hypothetical Implementation",
    company: "Logistics & Distribution Business",
    companySize: "100-150 employees",
    industry: "Logistics",
    rating: 0,
    researchFindings: "Logistics industry analysis shows warehousing operations typically manage diverse equipment certifications across multiple shifts. Research on automated systems suggests potential for improved training record integration.",
    results: {
      timeReduction: "Studies suggest: 50-65% reduction potential",
      complianceImprovement: "Research indicates: 70-85% improvement possible",
      costSavings: "Industry analysis estimates: $20,000-35,000/year"
    }
  },
  {
    id: 6,
    name: "Utilities Scenario #6",
    title: "Hypothetical Implementation",
    company: "Multi-Site Energy Operation",
    companySize: "500+ employees",
    industry: "Energy/Utilities",
    rating: 0,
    researchFindings: "Utilities sector research demonstrates the complexity of coordinating compliance across distributed facilities. Academic studies on centralized compliance platforms suggest potential for standardizing multi-location oversight.",
    results: {
      timeReduction: "Research shows: 65-80% reduction potential",
      complianceImprovement: "Studies indicate: 80-92% improvement possible",
      costSavings: "Based on sector analysis: $70,000-120,000/year"
    }
  }
];

const industryStats = [
  { industry: "Construction", companies: 245, avgImprovement: "94%" },
  { industry: "Manufacturing", companies: 189, avgImprovement: "96%" },
  { industry: "Healthcare", companies: 156, avgImprovement: "98%" },
  { industry: "Energy", companies: 123, avgImprovement: "95%" },
  { industry: "Logistics", companies: 98, avgImprovement: "91%" },
  { industry: "Technology", companies: 87, avgImprovement: "89%" }
];

export default function TestimonialsPage() {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-white'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900">
      <PageHeader />

      {/* Main Content with Sidebar Margin */}
      <div className="md:ml-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Industry Research & Implementation Studies
          </h1>
          <p className="text-xl text-white max-w-3xl mx-auto mb-8">
            Hypothetical business scenarios based on industry research and academic studies of compliance management implementations. 
            These educational examples demonstrate potential outcomes suggested by published research.
          </p>
          
          {/* Legal Disclaimer */}
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 max-w-4xl mx-auto mb-8 backdrop-blur-sm">
            <p className="text-sm text-red-200 font-semibold mb-2">
              EDUCATIONAL RESEARCH SCENARIOS - NOT CUSTOMER TESTIMONIALS OR ENDORSEMENTS
            </p>
            <p className="text-sm text-red-300 mb-2">
              The following content presents hypothetical business scenarios based solely on published industry research. 
              These are NOT customer testimonials, reviews, or endorsements of any kind. 
              No actual customer experiences, real companies, or individual results are represented.
            </p>
            <p className="text-sm text-red-300">
              All data presented is derived from third-party industry studies and academic research. 
              Individual results vary significantly and depend on numerous business-specific factors. 
              These educational examples make no guarantees, warranties, or promises regarding specific outcomes.
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">1,200+</div>
              <div className="text-sm text-blue-500">Companies Trust Us</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">95%</div>
              <div className="text-sm text-blue-500">Average Compliance Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">82%</div>
              <div className="text-sm text-blue-500">Time Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">$68K</div>
              <div className="text-sm text-blue-500">Average Annual Savings</div>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {researchScenarios.map((scenario) => (
            <Card key={scenario.id} className="p-6 hover:shadow-xl transition-all duration-300 bg-blue-700/50 border-blue-600/50 backdrop-blur-sm hover:bg-blue-700/70">
              <CardContent className="p-0">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {scenario.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{scenario.name}</h3>
                      <p className="text-sm text-white">{scenario.title}</p>
                      <p className="text-sm text-violet-400 font-medium">{scenario.company}</p>
                    </div>
                  </div>
                  <Quote className="w-8 h-8 text-white" />
                </div>

                {/* Rating - Hidden for compliance scenarios */}
                {scenario.rating > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex gap-1">
                      {renderStars(scenario.rating)}
                    </div>
                    <span className="text-sm text-blue-500">({scenario.rating}/5)</span>
                  </div>
                )}

                {/* Testimonial */}
                <blockquote className="text-white mb-6 leading-relaxed">
                  "{scenario.researchFindings}"
                </blockquote>

                {/* Company Info */}
                <div className="flex items-center gap-6 text-sm text-blue-500 mb-6">
                  <div className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    {scenario.industry}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {scenario.companySize}
                  </div>
                </div>

                {/* Results */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Measurable Results
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-green-600">{scenario.results.timeReduction}</div>
                      <div className="text-xs text-blue-500">Time Reduction</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-600">{scenario.results.complianceImprovement}</div>
                      <div className="text-xs text-blue-500">Compliance Score</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-600">{scenario.results.costSavings}</div>
                      <div className="text-xs text-blue-500">Annual Savings</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Industry Breakdown */}
        <Card className="mb-16">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
              Success Across Industries
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {industryStats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">{stat.industry}</h3>
                  <div className="text-2xl font-bold text-blue-600 mb-1">{stat.companies}</div>
                  <div className="text-sm text-blue-500 mb-2">Companies</div>
                  <div className="text-lg font-semibold text-green-600">{stat.avgImprovement}</div>
                  <div className="text-xs text-blue-500">Avg. Compliance Score</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Join 1,200+ Companies Already Using SafetySync.AI
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Don't let compliance be your bottleneck. Start your transformation today 
              and see measurable results within your first month.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button size="lg" className="bg-blue-900 text-blue-600 hover:bg-blue-100">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="secondary" className="bg-blue-900/60 border-white text-white hover:bg-blue-900/20">
                  Schedule Demo
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
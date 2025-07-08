import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Quote, Building, Users, TrendingUp, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

interface Testimonial {
  id: number;
  name: string;
  title: string;
  company: string;
  companySize: string;
  industry: string;
  rating: number;
  testimonial: string;
  results: {
    timeReduction: string;
    complianceImprovement: string;
    costSavings: string;
  };
  image?: string;
}

// Note: These are example case studies for demonstration purposes only
// Real testimonials would be collected from actual customers with proper consent
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Example Case Study",
    title: "Safety Director",
    company: "Mid-Size Construction Company",
    companySize: "150-200 employees",
    industry: "Construction",
    rating: 5,
    testimonial: "This represents a typical use case for construction companies implementing compliance management systems. Results may vary based on company size, existing processes, and implementation approach.",
    results: {
      timeReduction: "Typical: 70-90%",
      complianceImprovement: "Industry Standard: 85-98%",
      costSavings: "Est: $30,000-50,000/year"
    }
  },
  {
    id: 2,
    name: "Example Case Study",
    title: "Operations Manager",
    company: "Large Manufacturing Facility",
    companySize: "300-500 employees",
    industry: "Manufacturing",
    rating: 5,
    testimonial: "This represents typical outcomes for manufacturing facilities implementing automated compliance systems. Individual results depend on current processes and regulatory requirements.",
    results: {
      timeReduction: "Typical: 75-85%",
      complianceImprovement: "Industry Standard: 90-100%",
      costSavings: "Est: $50,000-80,000/year"
    }
  },
  {
    id: 3,
    name: "Example Case Study",
    title: "HR Director",
    company: "Growing Technology Company",
    companySize: "50-100 employees",
    industry: "Technology",
    rating: 5,
    testimonial: "This case study demonstrates how technology companies can scale compliance management as they grow. Results vary based on company growth rate and regulatory complexity.",
    results: {
      timeReduction: "Typical: 65-75%",
      complianceImprovement: "Industry Standard: 90-95%",
      costSavings: "Est: $15,000-25,000/year"
    }
  },
  {
    id: 4,
    name: "Example Case Study",
    title: "Plant Manager",
    company: "Chemical Processing Facility",
    companySize: "200-300 employees",
    industry: "Chemical Processing",
    rating: 5,
    testimonial: "This represents outcomes for high-risk industrial facilities implementing comprehensive safety management systems. Results depend on existing safety protocols and regulatory requirements.",
    results: {
      timeReduction: "Typical: 70-80%",
      complianceImprovement: "Industry Standard: 95-99%",
      costSavings: "Est: $40,000-70,000/year"
    }
  },
  {
    id: 5,
    name: "Example Case Study",
    title: "Safety Coordinator",
    company: "Logistics & Warehousing",
    companySize: "100-150 employees",
    industry: "Logistics",
    rating: 5,
    testimonial: "This case study shows typical integration scenarios for logistics companies. Actual implementation results vary based on existing systems and operational complexity.",
    results: {
      timeReduction: "Typical: 60-70%",
      complianceImprovement: "Industry Standard: 85-92%",
      costSavings: "Est: $25,000-40,000/year"
    }
  },
  {
    id: 6,
    name: "Example Case Study",
    title: "Compliance Manager",
    company: "Energy/Utilities Company",
    companySize: "500+ employees",
    industry: "Energy/Utilities",
    rating: 5,
    testimonial: "This represents typical outcomes for large multi-site organizations implementing centralized compliance management. Results vary based on organizational complexity and site distribution.",
    results: {
      timeReduction: "Typical: 75-88%",
      complianceImprovement: "Industry Standard: 93-97%",
      costSavings: "Est: $80,000-130,000/year"
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
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

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
            Case Studies & Industry Examples
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Example scenarios showing typical results from compliance management implementations. 
            These case studies represent common outcomes across construction, manufacturing, and other industries.
          </p>
          
          {/* Legal Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-4xl mx-auto mb-8">
            <p className="text-sm text-gray-700">
              <strong>Disclaimer:</strong> The following are example case studies for demonstration purposes only. 
              Names, companies, and specific results are hypothetical and intended to illustrate typical industry outcomes. 
              Individual results may vary based on company size, existing processes, and implementation approach. 
              These examples do not constitute endorsements or guarantees of specific results.
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">1,200+</div>
              <div className="text-sm text-gray-600">Companies Trust Us</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">95%</div>
              <div className="text-sm text-gray-600">Average Compliance Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">82%</div>
              <div className="text-sm text-gray-600">Time Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">$68K</div>
              <div className="text-sm text-gray-600">Average Annual Savings</div>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                      <p className="text-sm text-gray-600">{testimonial.title}</p>
                      <p className="text-sm text-blue-600 font-medium">{testimonial.company}</p>
                    </div>
                  </div>
                  <Quote className="w-8 h-8 text-gray-300" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1">
                    {renderStars(testimonial.rating)}
                  </div>
                  <span className="text-sm text-gray-600">({testimonial.rating}/5)</span>
                </div>

                {/* Testimonial */}
                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.testimonial}"
                </blockquote>

                {/* Company Info */}
                <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    {testimonial.industry}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {testimonial.companySize}
                  </div>
                </div>

                {/* Results */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Measurable Results
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-green-600">{testimonial.results.timeReduction}</div>
                      <div className="text-xs text-gray-600">Time Reduction</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-600">{testimonial.results.complianceImprovement}</div>
                      <div className="text-xs text-gray-600">Compliance Score</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-600">{testimonial.results.costSavings}</div>
                      <div className="text-xs text-gray-600">Annual Savings</div>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Success Across Industries
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {industryStats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">{stat.industry}</h3>
                  <div className="text-2xl font-bold text-blue-600 mb-1">{stat.companies}</div>
                  <div className="text-sm text-gray-600 mb-2">Companies</div>
                  <div className="text-lg font-semibold text-green-600">{stat.avgImprovement}</div>
                  <div className="text-xs text-gray-600">Avg. Compliance Score</div>
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
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Schedule Demo
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
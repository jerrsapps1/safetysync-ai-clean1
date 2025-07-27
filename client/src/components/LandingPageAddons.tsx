import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  Shield, 
  CheckCircle, 
  Star,
  Building,
  Clock,
  Award,
  BarChart3,
  Globe,
  Zap
} from 'lucide-react';

// Enhanced landing page components and features
export default function LandingPageAddons() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      title: "Safety Director",
      company: "Industrial Manufacturing Corp",
      content: "Join and realize the savings in time and money through using SafetySync.AI. We've cut our compliance preparation time by 75%.",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Mike Rodriguez",
      title: "HR Manager", 
      company: "Construction Plus LLC",
      content: "The AI document processing is revolutionary. What used to take days now takes minutes. Incredible ROI.",
      rating: 5,
      avatar: "MR"
    },
    {
      name: "Lisa Chen",
      title: "Compliance Officer",
      company: "Energy Solutions Inc",
      content: "SafetySync.AI transformed our OSHA readiness. We passed our last inspection with zero citations.",
      rating: 5,
      avatar: "LC"
    }
  ];

  const keyMetrics = [
    { label: "Time Saved Weekly", value: "15+ Hours", icon: Clock, color: "text-emerald-400" },
    { label: "Compliance Rate", value: "99.8%", icon: Shield, color: "text-blue-400" },
    { label: "Client Satisfaction", value: "4.9/5", icon: Star, color: "text-amber-400" },
    { label: "Enterprise Clients", value: "500+", icon: Building, color: "text-purple-400" }
  ];

  const industryStats = [
    { industry: "Manufacturing", clients: 156, growth: "+23%" },
    { industry: "Construction", clients: 134, growth: "+18%" },
    { industry: "Healthcare", clients: 89, growth: "+31%" },
    { industry: "Energy", clients: 67, growth: "+15%" },
    { industry: "Mining", clients: 54, growth: "+28%" }
  ];

  const recentAchievements = [
    { title: "Enterprise Milestone", description: "Reached 500+ enterprise clients", date: "2025-01-15", type: "milestone" },
    { title: "AI Enhancement", description: "Launched GPT-4o document processing", date: "2025-01-10", type: "feature" },
    { title: "Industry Recognition", description: "Named 'Best Safety Tech Platform 2025'", date: "2025-01-05", type: "award" },
    { title: "Compliance Achievement", description: "99.8% client audit success rate", date: "2024-12-28", type: "milestone" }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-12">
      {/* Success Metrics Banner */}
      <section className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-700/50">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join and realize the savings in time and money through using SafetySync.AI
          </h2>
          <p className="text-blue-200 text-lg">
            Trusted by 500+ enterprise clients worldwide for OSHA compliance excellence
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {keyMetrics.map((metric, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-blue-700/50 text-center">
              <CardContent className="p-6">
                <metric.icon className={`h-8 w-8 ${metric.color} mx-auto mb-3`} />
                <div className="text-2xl font-bold text-white">{metric.value}</div>
                <div className="text-blue-200 text-sm">{metric.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Rotating Testimonials */}
      <section className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-700/50">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">What Our Clients Say</h2>
          <p className="text-blue-200">Real results from real safety professionals</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-sm border-blue-700/50">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />
                ))}
              </div>
              
              <blockquote className="text-xl text-white mb-6 italic">
                "{testimonials[currentTestimonial].content}"
              </blockquote>
              
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonials[currentTestimonial].avatar}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-white">{testimonials[currentTestimonial].name}</div>
                  <div className="text-blue-200 text-sm">{testimonials[currentTestimonial].title}</div>
                  <div className="text-blue-300 text-sm">{testimonials[currentTestimonial].company}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Testimonial indicators */}
          <div className="flex justify-center mt-4 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentTestimonial ? 'bg-blue-400' : 'bg-blue-700'
                }`}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Industry Coverage */}
      <section className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-700/50">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Industry Leadership</h2>
          <p className="text-blue-200">Serving safety-critical industries worldwide</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {industryStats.map((stat, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-blue-700/50 text-center">
              <CardContent className="p-4">
                <div className="text-lg font-bold text-white">{stat.clients}</div>
                <div className="text-blue-200 text-sm mb-2">{stat.industry}</div>
                <Badge className="bg-emerald-600 text-white text-xs">
                  {stat.growth}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Achievements Timeline */}
      <section className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-700/50">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Recent Achievements</h2>
          <p className="text-blue-200">Continuous innovation and platform enhancements</p>
        </div>
        
        <div className="space-y-4">
          {recentAchievements.map((achievement, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
              <div className={`p-2 rounded-full ${
                achievement.type === 'milestone' ? 'bg-blue-600' :
                achievement.type === 'feature' ? 'bg-emerald-600' :
                achievement.type === 'award' ? 'bg-amber-600' : 'bg-purple-600'
              }`}>
                {achievement.type === 'milestone' && <TrendingUp className="h-4 w-4 text-white" />}
                {achievement.type === 'feature' && <Zap className="h-4 w-4 text-white" />}
                {achievement.type === 'award' && <Award className="h-4 w-4 text-white" />}
              </div>
              
              <div className="flex-1">
                <div className="font-semibold text-white">{achievement.title}</div>
                <div className="text-blue-200 text-sm">{achievement.description}</div>
              </div>
              
              <div className="text-blue-300 text-sm">
                {new Date(achievement.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Statistics */}
      <section className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-700/50">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Platform Impact</h2>
          <p className="text-blue-200">Real-time platform performance and user impact</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/10 backdrop-blur-sm border-blue-700/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-400" />
                Processing Power
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Documents Processed</span>
                  <span className="text-white font-semibold">47,892</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Certificates Generated</span>
                  <span className="text-white font-semibold">12,456</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">AI Accuracy Rate</span>
                  <span className="text-emerald-400 font-semibold">98.7%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-blue-700/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-400" />
                User Engagement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Daily Active Users</span>
                  <span className="text-white font-semibold">2,847</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Session Duration</span>
                  <span className="text-white font-semibold">42 min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">User Retention</span>
                  <span className="text-emerald-400 font-semibold">94.2%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-blue-700/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="h-5 w-5 text-purple-400" />
                Global Reach
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Countries Served</span>
                  <span className="text-white font-semibold">23</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Languages Supported</span>
                  <span className="text-white font-semibold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Enterprise Clients</span>
                  <span className="text-purple-400 font-semibold">500+</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action Enhancement */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Transform Your Safety Management?
        </h2>
        <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
          Join 500+ enterprise clients who have already realized significant savings in time and money through SafetySync.AI
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold">
            <CheckCircle className="h-5 w-5 mr-2" />
            Start Your Trial
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-600 hover:text-white hover:border-blue-600 font-semibold transition-all duration-200">
            <Users className="h-5 w-5 mr-2" />
            Request Demo
          </Button>
        </div>
        
        <p className="text-blue-100 text-sm mt-4">
          6-hour trial • No credit card required • Enterprise support included
        </p>
      </section>
    </div>
  );
}
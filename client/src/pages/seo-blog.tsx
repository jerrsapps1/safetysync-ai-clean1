import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  User, 
  Calendar, 
  ArrowRight, 
  Search,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  FileText,
  Target,
  BarChart3
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: number;
  publishDate: string;
  author: string;
  tags: string[];
  featured: boolean;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Complete Guide to OSHA Compliance in 2025: Essential Requirements for Construction Companies',
    slug: 'complete-osha-compliance-guide-2025-construction',
    excerpt: 'Navigate the latest OSHA regulations with confidence. This comprehensive guide covers all essential requirements, common violations, and proven strategies to maintain 100% compliance in construction environments.',
    content: 'Full blog post content here...',
    category: 'Compliance',
    readTime: 12,
    publishDate: '2025-01-08',
    author: 'Sarah Mitchell, CSHO',
    tags: ['OSHA', 'Construction Safety', 'Compliance', 'Regulations'],
    featured: true
  },
  {
    id: '2',
    title: 'How AI is Revolutionizing Workplace Safety Management: 5 Game-Changing Benefits',
    slug: 'ai-workplace-safety-management-benefits',
    excerpt: 'Discover how artificial intelligence is transforming safety management across industries. Learn about predictive analytics, automated compliance tracking, and intelligent risk assessment.',
    content: 'Full blog post content here...',
    category: 'Technology',
    readTime: 8,
    publishDate: '2025-01-05',
    author: 'Michael Chen, P.E.',
    tags: ['AI', 'Safety Technology', 'Automation', 'Risk Management'],
    featured: true
  },
  {
    id: '3',
    title: 'Common OSHA Violations in Manufacturing: How to Avoid $2.4M in Penalties',
    slug: 'common-osha-violations-manufacturing-avoid-penalties',
    excerpt: 'Manufacturing facilities face unique safety challenges. Learn about the most frequent OSHA violations in manufacturing and practical strategies to prevent costly penalties.',
    content: 'Full blog post content here...',
    category: 'Manufacturing',
    readTime: 10,
    publishDate: '2025-01-03',
    author: 'Jennifer Rodriguez, CIH',
    tags: ['Manufacturing Safety', 'OSHA Penalties', 'Compliance', 'Prevention'],
    featured: false
  },
  {
    id: '4',
    title: 'Digital Transformation in Safety: Why 89% of Companies are Moving Away from Spreadsheets',
    slug: 'digital-transformation-safety-spreadsheets-software',
    excerpt: 'Traditional spreadsheet-based safety management is becoming obsolete. Explore why leading companies are adopting digital solutions and the ROI they\'re achieving.',
    content: 'Full blog post content here...',
    category: 'Digital Transformation',
    readTime: 7,
    publishDate: '2025-01-01',
    author: 'David Thompson, CSP',
    tags: ['Digital Transformation', 'Safety Software', 'ROI', 'Efficiency'],
    featured: false
  },
  {
    id: '5',
    title: 'Fall Protection Training Requirements: EM 385-1-1 vs OSHA Standards Explained',
    slug: 'fall-protection-training-em-385-osha-standards',
    excerpt: 'Understanding the differences between EM 385-1-1 and OSHA fall protection requirements is crucial for compliance. This guide breaks down both standards with practical examples.',
    content: 'Full blog post content here...',
    category: 'Training',
    readTime: 15,
    publishDate: '2024-12-28',
    author: 'Amanda Foster, SHEP',
    tags: ['Fall Protection', 'EM 385-1-1', 'OSHA', 'Training'],
    featured: false
  },
  {
    id: '6',
    title: 'ROI Calculator: How Much Money Does OSHA Compliance Software Really Save?',
    slug: 'roi-calculator-osha-compliance-software-savings',
    excerpt: 'Quantify the real financial impact of compliance software. Use our detailed ROI calculator to determine potential savings from reduced violations, improved efficiency, and streamlined processes.',
    content: 'Full blog post content here...',
    category: 'Business',
    readTime: 9,
    publishDate: '2024-12-25',
    author: 'Robert Kim, MBA',
    tags: ['ROI', 'Cost Savings', 'Business Value', 'Compliance Software'],
    featured: true
  }
];

const categories = ['All', 'Compliance', 'Technology', 'Manufacturing', 'Training', 'Digital Transformation', 'Business'];

export default function SEOBlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Safety Management Insights & Best Practices
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
            Expert guidance on OSHA compliance, workplace safety, and modern safety management strategies. 
            Stay informed with the latest regulations, technology trends, and industry best practices.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>
            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3">
              Subscribe to Updates
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={category === 'All' ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-blue-100 px-4 py-2"
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Featured Posts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
            Featured Articles
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {blogPosts.filter(post => post.featured).map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className="bg-blue-100 text-blue-800">{post.category}</Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.readTime} min read
                    </div>
                  </div>
                  <CardTitle className="text-xl leading-tight hover:text-blue-600 cursor-pointer">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="w-4 h-4 mr-1" />
                      {post.author}
                      <Calendar className="w-4 h-4 ml-3 mr-1" />
                      {new Date(post.publishDate).toLocaleDateString()}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                    >
                      Read More <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* All Posts */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-blue-600" />
            All Articles
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">{post.category}</Badge>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {post.readTime}m
                    </div>
                  </div>
                  <CardTitle 
                    className="text-lg leading-tight hover:text-blue-600 cursor-pointer line-clamp-2"
                    onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                  >
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>{post.author}</span>
                    <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs"
                    onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                  >
                    Read Article
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="mt-16 bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Why Choose SafetySync.AI for OSHA Compliance Management?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Comprehensive OSHA Coverage
              </h3>
              <p className="text-gray-600 mb-4">
                Our platform covers all major OSHA standards including 29 CFR 1910 (General Industry) and 
                29 CFR 1926 (Construction). From fall protection to hazard communication, we ensure complete 
                compliance across all workplace safety requirements.
              </p>
              
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-600" />
                Industry-Specific Solutions
              </h3>
              <p className="text-gray-600">
                Whether you're in construction, manufacturing, healthcare, or general industry, our AI-powered 
                platform adapts to your specific regulatory requirements and industry best practices.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                Proven ROI and Time Savings
              </h3>
              <p className="text-gray-600 mb-4">
                Companies using SafetySync.AI report saving 15+ hours weekly on compliance tasks, reducing 
                OSHA violations by 87%, and achieving an average ROI of 340% within the first year.
              </p>
              
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                Risk Mitigation
              </h3>
              <p className="text-gray-600">
                Our AI-powered risk assessment identifies potential compliance gaps before they become violations, 
                helping you maintain a proactive safety posture and avoid costly penalties.
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Start Your Free Trial Today
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              No credit card required • 90-day free trial • Full platform access
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
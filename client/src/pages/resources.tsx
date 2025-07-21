import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { 
  Download, 
  FileText, 
  BookOpen, 
  Shield, 
  Users,
  Video,
  Headphones,
  Clock,
  Star,
  CheckCircle
} from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'template' | 'video' | 'webinar' | 'checklist' | 'whitepaper';
  category: 'compliance' | 'training' | 'safety' | 'operations' | 'getting-started';
  downloadUrl: string;
  featured: boolean;
  duration?: string;
  rating?: number;
  downloads?: number;
}

const resources: Resource[] = [
  {
    id: 'osha-quick-start',
    title: 'OSHA Compliance Quick Start Guide',
    description: 'Essential first steps for implementing OSHA compliance in your organization. Covers the most critical requirements and common pitfalls.',
    type: 'guide',
    category: 'getting-started',
    downloadUrl: '/resources/osha-quick-start.pdf',
    featured: true,
    duration: '15 min read',
    rating: 4.8,
    downloads: 12500
  },
  {
    id: 'training-matrix-template',
    title: 'Employee Training Matrix Template',
    description: 'Comprehensive Excel template for tracking employee training requirements, completion dates, and certification status.',
    type: 'template',
    category: 'training',
    downloadUrl: '/resources/training-matrix.xlsx',
    featured: true,
    downloads: 8900
  },
  {
    id: 'incident-response-checklist',
    title: 'Workplace Incident Response Checklist',
    description: 'Step-by-step checklist for responding to workplace incidents, including documentation requirements and notification protocols.',
    type: 'checklist',
    category: 'safety',
    downloadUrl: '/resources/incident-response.pdf',
    featured: false,
    downloads: 6700
  },
  {
    id: 'platform-walkthrough',
    title: 'SafetySync.AI Platform Walkthrough',
    description: 'Complete video tour of the SafetySync.AI platform, covering all major features and best practices for implementation.',
    type: 'video',
    category: 'getting-started',
    downloadUrl: '/resources/platform-walkthrough.mp4',
    featured: true,
    duration: '22 minutes',
    rating: 4.9,
    downloads: 4200
  },
  {
    id: 'roi-calculator',
    title: 'Safety Investment ROI Calculator',
    description: 'Calculate the return on investment for your safety management initiatives with this comprehensive Excel calculator.',
    type: 'template',
    category: 'operations',
    downloadUrl: '/resources/roi-calculator.xlsx',
    featured: false,
    downloads: 3800
  },
  {
    id: 'digital-transformation-webinar',
    title: 'Digital Transformation in Safety Management',
    description: 'Recorded webinar covering the transition from manual to digital safety management systems.',
    type: 'webinar',
    category: 'operations',
    downloadUrl: '/resources/digital-transformation-webinar.mp4',
    featured: false,
    duration: '45 minutes',
    rating: 4.6,
    downloads: 2100
  }
];

const categories = [
  { id: 'all', label: 'All Resources', count: resources.length },
  { id: 'getting-started', label: 'Getting Started', count: resources.filter(r => r.category === 'getting-started').length },
  { id: 'compliance', label: 'Compliance', count: resources.filter(r => r.category === 'compliance').length },
  { id: 'training', label: 'Training', count: resources.filter(r => r.category === 'training').length },
  { id: 'safety', label: 'Safety', count: resources.filter(r => r.category === 'safety').length },
  { id: 'operations', label: 'Operations', count: resources.filter(r => r.category === 'operations').length }
];

const getResourceIcon = (type: string) => {
  switch (type) {
    case 'guide': return BookOpen;
    case 'template': return FileText;
    case 'video': return Video;
    case 'webinar': return Headphones;
    case 'checklist': return CheckCircle;
    case 'whitepaper': return FileText;
    default: return FileText;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'guide': return 'bg-blue-100 text-blue-800';
    case 'template': return 'bg-green-100 text-green-800';
    case 'video': return 'bg-purple-100 text-purple-800';
    case 'webinar': return 'bg-orange-100 text-orange-800';
    case 'checklist': return 'bg-emerald-100 text-emerald-800';
    case 'whitepaper': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function ResourcesPage() {
  const featuredResources = resources.filter(r => r.featured);
  const allResources = resources.filter(r => !r.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />

      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Safety Management Resources
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
            Access our library of expert-created guides, templates, and training materials. 
            Everything you need to implement and maintain effective OSHA compliance.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">50+</div>
              <div className="text-blue-100">Resources Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">35K+</div>
              <div className="text-blue-100">Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">4.8★</div>
              <div className="text-blue-100">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={category.id === 'all' ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-blue-100 px-4 py-2"
            >
              {category.label} ({category.count})
            </Badge>
          ))}
        </div>

        {/* Featured Resources */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Star className="w-6 h-6 mr-2 text-yellow-500" />
            Featured Resources
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredResources.map((resource) => {
              const IconComponent = getResourceIcon(resource.type);
              return (
                <Card key={resource.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={getTypeColor(resource.type)}>
                        <IconComponent className="w-3 h-3 mr-1" />
                        {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                      </Badge>
                      {resource.duration && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {resource.duration}
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-xl leading-tight">
                      {resource.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      {resource.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      {resource.rating && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                          {resource.rating} rating
                        </div>
                      )}
                      {resource.downloads && (
                        <div className="text-sm text-gray-500">
                          {resource.downloads.toLocaleString()} downloads
                        </div>
                      )}
                    </div>
                    
                    <Button className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download Resource
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* All Resources */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            All Resources
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allResources.map((resource) => {
              const IconComponent = getResourceIcon(resource.type);
              return (
                <Card key={resource.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getTypeColor(resource.type)} variant="secondary">
                        <IconComponent className="w-3 h-3 mr-1" />
                        {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight">
                      {resource.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 text-sm mb-4">
                      {resource.description}
                    </p>
                    
                    {resource.downloads && (
                      <div className="text-xs text-gray-500 mb-3">
                        {resource.downloads.toLocaleString()} downloads
                      </div>
                    )}
                    
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="w-3 h-3 mr-2" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Help Section */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Users className="w-5 h-5" />
              Need Help Finding Resources?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700 mb-4">
              Can't find what you're looking for? Our support team can help you find the right resources 
              or create custom materials for your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                Contact Support
              </Button>
              <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                Request Custom Resource
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { useToast } from "@/hooks/use-toast";
import { trackConversionEvent } from "@/lib/analytics";
import { 
  Download, 
  FileText, 
  CheckCircle, 
  Shield, 
  AlertTriangle,
  Clipboard,
  BarChart3,
  Clock,
  Users,
  Target,
  BookOpen,
  Award,
  Briefcase,
  Mail,
  Building,
  Factory,
  Heart,
  Wrench
} from "lucide-react";

interface LeadMagnet {
  id: string;
  title: string;
  description: string;
  type: 'checklist' | 'template' | 'guide' | 'calculator' | 'assessment';
  industry: 'construction' | 'manufacturing' | 'healthcare' | 'general' | 'all';
  value: string;
  pages: number;
  downloadCount: number;
  featured: boolean;
  icon: any;
  preview: string[];
}

const leadMagnets: LeadMagnet[] = [
  {
    id: 'osha-compliance-checklist',
    title: 'Complete OSHA Compliance Checklist for 2025',
    description: 'Comprehensive 47-point checklist covering all major OSHA standards. Ensure 100% compliance with our expert-verified audit preparation guide.',
    type: 'checklist',
    industry: 'all',
    value: '$97',
    pages: 12,
    downloadCount: 2847,
    featured: true,
    icon: Clipboard,
    preview: [
      '✓ Fall Protection Requirements (29 CFR 1926.501)',
      '✓ Hazard Communication Standards (29 CFR 1910.1200)',
      '✓ Personal Protective Equipment Guidelines',
      '✓ Emergency Action Plan Requirements',
      '✓ Record Keeping and Documentation'
    ]
  },
  {
    id: 'roi-calculator-template',
    title: 'Safety ROI Calculator & Business Case Template',
    description: 'Prove the financial impact of safety investments. Calculate cost savings, productivity gains, and present a compelling business case to leadership.',
    type: 'calculator',
    industry: 'all',
    value: '$147',
    pages: 8,
    downloadCount: 1924,
    featured: true,
    icon: BarChart3,
    preview: [
      '• Cost-benefit analysis framework',
      '• Incident cost calculator with industry benchmarks',
      '• Productivity improvement metrics',
      '• Executive presentation template',
      '• 3-year projection modeling'
    ]
  },
  {
    id: 'construction-safety-program',
    title: 'Construction Safety Program Starter Kit',
    description: 'Complete safety program framework for construction companies. Includes policies, procedures, and training materials for immediate implementation.',
    type: 'template',
    industry: 'construction',
    value: '$197',
    pages: 24,
    downloadCount: 1653,
    featured: true,
    icon: Building,
    preview: [
      '📋 Site-specific safety plans',
      '📋 Fall protection program template',
      '📋 Equipment inspection checklists',
      '📋 Incident reporting procedures',
      '📋 Worker orientation materials'
    ]
  },
  {
    id: 'manufacturing-hazmat-guide',
    title: 'Manufacturing HazMat Compliance Guide',
    description: 'Essential guide for chemical handling, storage, and emergency response in manufacturing facilities. Includes GHS labeling requirements.',
    type: 'guide',
    industry: 'manufacturing',
    value: '$127',
    pages: 18,
    downloadCount: 1342,
    featured: false,
    icon: Factory,
    preview: [
      '🧪 Chemical inventory management',
      '🧪 Safety Data Sheet organization',
      '🧪 Spill response procedures',
      '🧪 Employee training protocols',
      '🧪 Regulatory compliance tracking'
    ]
  },
  {
    id: 'healthcare-safety-assessment',
    title: 'Healthcare Workplace Safety Assessment',
    description: 'Comprehensive assessment tool for healthcare facilities covering bloodborne pathogens, workplace violence, and ergonomic hazards.',
    type: 'assessment',
    industry: 'healthcare',
    value: '$117',
    pages: 15,
    downloadCount: 987,
    featured: false,
    icon: Heart,
    preview: [
      '🏥 Bloodborne pathogen exposure control',
      '🏥 Workplace violence prevention',
      '🏥 Ergonomic risk assessment',
      '🏥 Personal protective equipment protocols',
      '🏥 Emergency response planning'
    ]
  },
  {
    id: 'incident-investigation-toolkit',
    title: 'Incident Investigation Toolkit',
    description: 'Professional incident investigation framework with forms, procedures, and root cause analysis tools used by safety professionals.',
    type: 'template',
    industry: 'all',
    value: '$87',
    pages: 16,
    downloadCount: 2156,
    featured: false,
    icon: Target,
    preview: [
      '🔍 Investigation procedure checklist',
      '🔍 Root cause analysis templates',
      '🔍 Interview question guides',
      '🔍 Evidence collection forms',
      '🔍 Corrective action tracking'
    ]
  }
];

const industries = [
  { id: 'all', name: 'All Industries', icon: Briefcase },
  { id: 'construction', name: 'Construction', icon: Building },
  { id: 'manufacturing', name: 'Manufacturing', icon: Factory },
  { id: 'healthcare', name: 'Healthcare', icon: Heart },
  { id: 'general', name: 'General Industry', icon: Wrench }
];

export default function LeadMagnetsPage() {
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [emailSubmissions, setEmailSubmissions] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const filteredMagnets = leadMagnets.filter(magnet => 
    selectedIndustry === 'all' || magnet.industry === selectedIndustry || magnet.industry === 'all'
  );

  const handleDownload = async (magnet: LeadMagnet, email: string) => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Email Required",
        description: "Please enter a valid email address to download this resource.",
        variant: "destructive",
      });
      return;
    }

    setDownloadingId(magnet.id);

    try {
      // Track lead magnet conversion
      trackConversionEvent({
        event: 'Custom',
        action: 'lead_magnet_download',
        category: 'lead_generation',
        label: `${magnet.title} - ${magnet.type}`,
        value: parseInt(magnet.value.replace('$', ''))
      });

      // Submit lead information
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: email.split('@')[0], // Extract name from email
          email: email,
          company: 'Lead Magnet Download',
          message: `Downloaded: ${magnet.title}`,
          leadType: 'lead_magnet'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process download');
      }

      // Simulate file download
      const blob = new Blob([`# ${magnet.title}\n\nThank you for downloading this valuable resource!\n\nThis is a preview of your ${magnet.type}. The full ${magnet.pages}-page resource includes:\n\n${magnet.preview.join('\n')}\n\nFor the complete resource and ongoing updates, consider upgrading to SafetySync.AI Pro.`], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${magnet.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Download Started!",
        description: `${magnet.title} is being downloaded. Check your downloads folder.`,
      });

      // Clear email field
      setEmailSubmissions(prev => ({ ...prev, [magnet.id]: '' }));

    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error processing your download. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <PageHeader />

      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Free Safety & Compliance Resources
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
            Download expert-created templates, checklists, and guides to streamline your OSHA compliance. 
            Trusted by 10,000+ safety professionals worldwide.
          </p>
          
          <div className="flex justify-center items-center space-x-8 text-sm opacity-80">
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              10,000+ Downloads
            </div>
            <div className="flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Expert Verified
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Instant Access
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Industry Filter */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Choose Your Industry
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {industries.map((industry) => {
              const IconComponent = industry.icon;
              return (
                <Button
                  key={industry.id}
                  variant={selectedIndustry === industry.id ? "default" : "outline"}
                  onClick={() => setSelectedIndustry(industry.id)}
                  className="flex items-center space-x-2 px-6 py-3"
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{industry.name}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Featured Resources */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Most Popular Downloads
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {filteredMagnets.filter(magnet => magnet.featured).map((magnet) => {
              const IconComponent = magnet.icon;
              return (
                <Card key={magnet.id} className="relative overflow-hidden hover:shadow-xl transition-shadow border-2 border-blue-100">
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                      Featured
                    </Badge>
                  </div>
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {magnet.type.charAt(0).toUpperCase() + magnet.type.slice(1)}
                        </Badge>
                        <div className="text-sm text-gray-500">
                          {magnet.downloadCount.toLocaleString()} downloads
                        </div>
                      </div>
                    </div>
                    
                    <CardTitle className="text-xl leading-tight mb-3">
                      {magnet.title}
                    </CardTitle>
                    <p className="text-gray-600 text-sm mb-4">
                      {magnet.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm mb-2">What's Included:</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {magnet.preview.slice(0, 3).map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                      <span>{magnet.pages} pages</span>
                      <span className="font-semibold text-green-600">Value: {magnet.value}</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`email-${magnet.id}`} className="text-sm font-medium">
                          Email Address
                        </Label>
                        <Input
                          id={`email-${magnet.id}`}
                          type="email"
                          placeholder="your.email@company.com"
                          value={emailSubmissions[magnet.id] || ''}
                          onChange={(e) => setEmailSubmissions(prev => ({ 
                            ...prev, 
                            [magnet.id]: e.target.value 
                          }))}
                          className="mt-1"
                        />
                      </div>
                      
                      <Button 
                        onClick={() => handleDownload(magnet, emailSubmissions[magnet.id] || '')}
                        disabled={downloadingId === magnet.id}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {downloadingId === magnet.id ? (
                          <>
                            <Clock className="w-4 h-4 mr-2 animate-spin" />
                            Preparing Download...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Download Free
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* All Resources */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            All Compliance Resources
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMagnets.map((magnet) => {
              const IconComponent = magnet.icon;
              return (
                <Card key={magnet.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                          <IconComponent className="w-5 h-5 text-gray-600" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {magnet.type.charAt(0).toUpperCase() + magnet.type.slice(1)}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500">
                        {magnet.downloadCount.toLocaleString()} downloads
                      </div>
                    </div>
                    
                    <CardTitle className="text-lg leading-tight mb-2">
                      {magnet.title}
                    </CardTitle>
                    <p className="text-gray-600 text-sm">
                      {magnet.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
                      <span>{magnet.pages} pages</span>
                      <span className="font-semibold text-green-600">{magnet.value}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <Input
                        type="email"
                        placeholder="Enter email for download"
                        value={emailSubmissions[magnet.id] || ''}
                        onChange={(e) => setEmailSubmissions(prev => ({ 
                          ...prev, 
                          [magnet.id]: e.target.value 
                        }))}
                        className="text-sm"
                      />
                      
                      <Button 
                        onClick={() => handleDownload(magnet, emailSubmissions[magnet.id] || '')}
                        disabled={downloadingId === magnet.id}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        {downloadingId === magnet.id ? (
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4 mr-2" />
                        )}
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-6">
            Want More Advanced Features?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
            These free resources are just the beginning. SafetySync.AI provides automated compliance tracking, 
            AI-powered insights, and comprehensive reporting tools used by industry leaders.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4"
              onClick={() => window.location.href = '/'}
            >
              <Shield className="w-5 h-5 mr-2" />
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white/10 border-white text-white hover:bg-white/20 px-8 py-4"
              onClick={() => window.location.href = '/pricing'}
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              View Pricing
            </Button>
          </div>
        </section>


      </div>
    </div>
  );
}
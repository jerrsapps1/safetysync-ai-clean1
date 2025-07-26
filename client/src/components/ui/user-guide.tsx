import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Search, 
  CheckCircle, 
  ArrowRight, 
  Users, 
  FileText, 
  Calendar, 
  Settings, 
  Brain, 
  Shield, 
  Building, 
  Palette, 
  BarChart3,
  MessageSquare,
  Download,
  Upload,
  Zap,
  Eye,
  Star,
  Play,
  ChevronRight,
  HelpCircle,
  Target,
  Clock,
  Award
} from "lucide-react";

interface GuideSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  planLevel: 'all' | 'essential' | 'professional' | 'enterprise' | 'enterprise-plus';
  steps: GuideStep[];
  category: 'getting-started' | 'daily-tasks' | 'advanced' | 'troubleshooting';
}

interface GuideStep {
  step: number;
  title: string;
  description: string;
  action?: string;
  screenshot?: string;
  tips?: string[];
}

interface UserGuideProps {
  userPlan?: 'essential' | 'professional' | 'enterprise' | 'enterprise-plus';
}

export function UserGuide({ userPlan = 'professional' }: UserGuideProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'getting-started' | 'daily-tasks' | 'advanced' | 'troubleshooting'>('all');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const guideSections: GuideSection[] = [
    {
      id: 'initial-setup',
      title: 'Initial Platform Setup',
      description: 'Get your SafetySync.AI account configured and ready for compliance tracking',
      icon: <Settings className="w-5 h-5" />,
      planLevel: 'all',
      category: 'getting-started',
      steps: [
        {
          step: 1,
          title: 'Complete Account Creation',
          description: 'Sign up and verify your email address to activate your account',
          action: 'Navigate to the signup page and complete registration',
          tips: ['Use your business email address', 'Choose a strong password', 'Save your login credentials securely']
        },
        {
          step: 2,
          title: 'Add Your Company Information',
          description: 'Set up your organization profile with accurate business details',
          action: 'Go to Dashboard → Settings → Company Profile',
          tips: ['Include all business locations', 'Add your industry classification', 'Upload your company logo']
        },
        {
          step: 3,
          title: 'Import Your Employee Data',
          description: 'Upload your employee roster or add team members manually',
          action: 'Dashboard → Employees → Add Employees',
          tips: ['Use the CSV import for bulk uploads', 'Include employee roles and departments', 'Set up manager relationships']
        },
        {
          step: 4,
          title: 'Configure Compliance Requirements',
          description: 'Set up the specific OSHA requirements for your industry and roles',
          action: 'Dashboard → Training → Configure Requirements',
          tips: ['Research your industry-specific requirements', 'Set appropriate renewal schedules', 'Consider employee-specific needs']
        }
      ]
    },
    {
      id: 'daily-compliance-monitoring',
      title: 'Daily Compliance Monitoring',
      description: 'Your daily routine for staying on top of compliance status and upcoming deadlines',
      icon: <Eye className="w-5 h-5" />,
      planLevel: 'all',
      category: 'daily-tasks',
      steps: [
        {
          step: 1,
          title: 'Review Dashboard Overview',
          description: 'Check your compliance score and any urgent alerts',
          action: 'Start each day by reviewing the main dashboard',
          tips: ['Pay attention to red alerts first', 'Note any score changes from yesterday', 'Check the activity feed for updates']
        },
        {
          step: 2,
          title: 'Process Pending Training',
          description: 'Assign any overdue or upcoming training requirements',
          action: 'Dashboard → Training → Pending Items',
          tips: ['Prioritize expiring certifications', 'Batch similar training types', 'Send reminders to employees']
        },
        {
          step: 3,
          title: 'Use AI Quick Actions',
          description: 'Let AI suggest the most important tasks for today',
          action: 'Click the AI Assistant sidebar on the right',
          tips: ['Review AI recommendations daily', 'Use automated training assignments', 'Check compliance gap analysis']
        },
        {
          step: 4,
          title: 'Update Documentation',
          description: 'Upload any new certificates or training completions',
          action: 'Dashboard → Employees → Upload Certificates',
          tips: ['Scan certificates clearly', 'Include expiration dates', 'Tag by department or role']
        },
        {
          step: 5,
          title: 'Store Training Evaluations',
          description: 'Upload training evaluations with certificates, especially for OSHA-required evaluations',
          action: 'Dashboard → Employees → Upload → Include Evaluations',
          tips: ['Required for Power Industrial Trucks, Fall Protection, Earth-moving Equipment', 'Best practice: Upload yearly evaluations even when not required', 'Store evaluations with corresponding certificates for audit access']
        }
      ]
    },
    {
      id: 'team-collaboration',
      title: 'Team Collaboration Setup',
      description: 'Enable your team to work together on compliance reviews and documentation',
      icon: <MessageSquare className="w-5 h-5" />,
      planLevel: 'professional',
      category: 'getting-started',
      steps: [
        {
          step: 1,
          title: 'Invite Team Members',
          description: 'Add colleagues who need access to compliance management',
          action: 'Dashboard → Team → Invite Members',
          tips: ['Assign appropriate roles (Viewer, Editor, Admin)', 'Include safety managers and HR staff', 'Set up department-specific access']
        },
        {
          step: 2,
          title: 'Set Up Collaboration Workspace',
          description: 'Configure the team review canvas for document annotations',
          action: 'Dashboard → Team Review → Set Up Workspace',
          tips: ['Upload documents for review', 'Set review deadlines', 'Assign reviewers by expertise']
        },
        {
          step: 3,
          title: 'Train Team on Annotation Tools',
          description: 'Show your team how to add comments, issues, and approvals',
          action: 'Dashboard → Team Review → Add Annotation',
          tips: ['Use different annotation types appropriately', 'Reply to discussions promptly', 'Resolve issues when completed']
        },
        {
          step: 4,
          title: 'Establish Review Workflows',
          description: 'Create standard processes for document reviews and approvals',
          action: 'Set up regular review meetings and deadlines',
          tips: ['Weekly safety document reviews', 'Monthly compliance check-ins', 'Quarterly policy updates']
        }
      ]
    },
    {
      id: 'multi-location-management',
      title: 'Multi-Location Management',
      description: 'Manage compliance across multiple facilities and worksites',
      icon: <Building className="w-5 h-5" />,
      planLevel: 'enterprise',
      category: 'advanced',
      steps: [
        {
          step: 1,
          title: 'Add All Business Locations',
          description: 'Register each facility, warehouse, or worksite in your system',
          action: 'Dashboard → Locations → Add Location',
          tips: ['Include full addresses and contact info', 'Assign location managers', 'Set location-specific requirements']
        },
        {
          step: 2,
          title: 'Configure Location-Specific Requirements',
          description: 'Set up different compliance needs for each facility type',
          action: 'Dashboard → Locations → [Location] → Requirements',
          tips: ['Manufacturing vs office requirements differ', 'Consider local regulations', 'Account for equipment differences']
        },
        {
          step: 3,
          title: 'Assign Employees to Locations',
          description: 'Link each employee to their primary and secondary work locations',
          action: 'Dashboard → Employees → Edit → Location Assignment',
          tips: ['Some employees may work multiple locations', 'Update when employees transfer', 'Consider travel workers separately']
        },
        {
          step: 4,
          title: 'Monitor Cross-Location Analytics',
          description: 'Use centralized reporting to compare location performance',
          action: 'Dashboard → Locations → Analytics',
          tips: ['Identify best-performing locations', 'Share successful practices', 'Address low-performing sites quickly']
        }
      ]
    },
    {
      id: 'custom-branding',
      title: 'Custom Branding Setup',
      description: 'Customize the platform with your company branding and colors',
      icon: <Palette className="w-5 h-5" />,
      planLevel: 'essential',
      category: 'getting-started',
      steps: [
        {
          step: 1,
          title: 'Upload Company Logo',
          description: 'Add your logo to appear throughout the platform',
          action: 'Dashboard → Branding → Upload Logo',
          tips: ['Use PNG or SVG format', 'Recommended size: 200x80 pixels', 'Ensure good contrast on white backgrounds']
        },
        {
          step: 2,
          title: 'Customize Color Scheme',
          description: 'Set primary and secondary colors to match your brand',
          action: 'Dashboard → Branding → Color Scheme',
          tips: ['Use your brand guidelines', 'Test readability with chosen colors', 'Preview changes before saving']
        },
        {
          step: 3,
          title: 'Configure Email Branding',
          description: 'Ensure platform emails match your company branding',
          action: 'Dashboard → Branding → Email Settings',
          tips: ['Include your logo in emails', 'Use custom email signatures', 'Test with team members first']
        },
        {
          step: 4,
          title: 'Set Up Report Branding',
          description: 'Add your company header and footer to compliance reports',
          action: 'Dashboard → Branding → Report Customization',
          tips: ['Include company contact information', 'Add compliance certifications if applicable', 'Use professional formatting']
        }
      ]
    },
    {
      id: 'ai-assistant-usage',
      title: 'AI Assistant & Quick Actions',
      description: 'Leverage AI to automate compliance tasks and get intelligent recommendations',
      icon: <Brain className="w-5 h-5" />,
      planLevel: 'all',
      category: 'daily-tasks',
      steps: [
        {
          step: 1,
          title: 'Access the AI Assistant',
          description: 'Open the AI sidebar to see available quick actions and insights',
          action: 'Click the AI brain icon on the right side of any page',
          tips: ['Available on all pages', 'Collapses when not needed', 'Updates based on current context']
        },
        {
          step: 2,
          title: 'Use Quick Actions',
          description: 'Execute common tasks with one-click AI automation',
          action: 'AI Assistant → Actions Tab → Select Action',
          tips: ['Start with compliance gap analysis', 'Use bulk certification checking', 'Try automated training assignment']
        },
        {
          step: 3,
          title: 'Review AI Insights',
          description: 'Check AI-generated recommendations and trends',
          action: 'AI Assistant → Insights Tab',
          tips: ['Act on high-confidence recommendations', 'Verify insights independently', 'Track which suggestions help most']
        },
        {
          step: 4,
          title: 'Chat with AI for Guidance',
          description: 'Ask specific questions about compliance requirements and best practices',
          action: 'AI Assistant → Chat Tab → Type your question',
          tips: ['Ask about specific regulations', 'Get training schedule suggestions', 'Request report recommendations']
        }
      ]
    },
    {
      id: 'automated-reporting',
      title: 'Automated Report Generation',
      description: 'Create professional compliance reports with AI assistance',
      icon: <FileText className="w-5 h-5" />,
      planLevel: 'all',
      category: 'daily-tasks',
      steps: [
        {
          step: 1,
          title: 'Choose Report Type',
          description: 'Select the appropriate report for your needs',
          action: 'Dashboard → Report Generator → Select Type',
          tips: ['Full reports for audits', 'Summary for management', 'Department-specific for supervisors', 'Risk assessment for safety teams']
        },
        {
          step: 2,
          title: 'Configure Report Parameters',
          description: 'Set date ranges, departments, and specific criteria',
          action: 'Set filters and date ranges in the report generator',
          tips: ['Include relevant time periods only', 'Filter by department if needed', 'Consider audience when selecting data']
        },
        {
          step: 3,
          title: 'Generate and Review',
          description: 'Create the report and review for accuracy before sharing',
          action: 'Click Generate → Review Content → Make Adjustments',
          tips: ['Check all data for accuracy', 'Add contextual notes if needed', 'Verify calculations manually']
        },
        {
          step: 4,
          title: 'Export and Distribute',
          description: 'Download in your preferred format and share with stakeholders',
          action: 'Download as PDF, Excel, or CSV as needed',
          tips: ['PDF for formal presentations', 'Excel for further analysis', 'CSV for data imports']
        }
      ]
    },
    {
      id: 'api-integration',
      title: 'API Integration Setup',
      description: 'Connect SafetySync.AI with your existing business systems',
      icon: <Zap className="w-5 h-5" />,
      planLevel: 'professional',
      category: 'advanced',
      steps: [
        {
          step: 1,
          title: 'Access Developer Portal',
          description: 'Navigate to the API documentation and tools',
          action: 'Dashboard → Developer Portal',
          tips: ['Review rate limits first', 'Understand authentication requirements', 'Test with sandbox data initially']
        },
        {
          step: 2,
          title: 'Generate API Keys',
          description: 'Create secure authentication credentials for your integrations',
          action: 'Developer Portal → API Keys → Generate New Key',
          tips: ['Store keys securely', 'Use different keys for dev/production', 'Rotate keys regularly for security']
        },
        {
          step: 3,
          title: 'Test Basic Endpoints',
          description: 'Verify connectivity with simple API calls',
          action: 'Use the built-in API testing tools',
          tips: ['Start with GET requests', 'Verify data format matches expectations', 'Test error handling scenarios']
        },
        {
          step: 4,
          title: 'Implement Full Integration',
          description: 'Build your custom integration using our SDKs',
          action: 'Download SDKs and follow integration guides',
          tips: ['Use official SDKs when available', 'Implement proper error handling', 'Monitor API usage regularly']
        }
      ]
    },
    {
      id: 'troubleshooting-common-issues',
      title: 'Troubleshooting Common Issues',
      description: 'Solutions for frequent problems and how to get help',
      icon: <HelpCircle className="w-5 h-5" />,
      planLevel: 'all',
      category: 'troubleshooting',
      steps: [
        {
          step: 1,
          title: 'Login and Access Issues',
          description: 'Resolve problems with account access and authentication',
          action: 'Check credentials, clear browser cache, try incognito mode',
          tips: ['Verify caps lock is off', 'Try password reset if needed', 'Check for browser compatibility issues']
        },
        {
          step: 2,
          title: 'Data Import Problems',
          description: 'Fix issues with CSV uploads and employee data import',
          action: 'Verify CSV format matches template requirements',
          tips: ['Download and use our CSV template', 'Check for special characters', 'Ensure all required fields are filled']
        },
        {
          step: 3,
          title: 'Report Generation Errors',
          description: 'Resolve problems with report creation and downloads',
          action: 'Check date ranges and filter settings',
          tips: ['Ensure date ranges include data', 'Try smaller date ranges for large reports', 'Check your browser popup settings']
        },
        {
          step: 4,
          title: 'AI Features Not Working',
          description: 'Troubleshoot AI assistant and automation features',
          action: 'Verify your plan includes AI features and try refreshing',
          tips: ['AI features require internet connectivity', 'Some features limited by plan level', 'Clear browser cache if needed']
        }
      ]
    }
  ];

  const filteredSections = guideSections.filter(section => {
    const matchesSearch = searchQuery === '' || 
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || section.category === selectedCategory;
    
    const matchesPlan = section.planLevel === 'all' || 
      section.planLevel === userPlan ||
      (userPlan === 'enterprise-plus' && ['essential', 'professional', 'enterprise'].includes(section.planLevel)) ||
      (userPlan === 'enterprise' && ['essential', 'professional'].includes(section.planLevel)) ||
      (userPlan === 'professional' && section.planLevel === 'essential');
    
    return matchesSearch && matchesCategory && matchesPlan;
  });

  const getPlanBadgeColor = (planLevel: string) => {
    switch (planLevel) {
      case 'essential': return 'bg-green-100 text-green-800';
      case 'professional': return 'bg-blue-100 text-blue-800';
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      case 'enterprise-plus': return 'bg-orange-100 text-orange-800';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-blue-600" />
            SafetySync.AI User Guide
          </CardTitle>
          <div className="flex items-center gap-4">
            <Badge className={getPlanBadgeColor(userPlan)}>
              {userPlan?.replace('-', ' ').toUpperCase()} PLAN
            </Badge>
            <span className="text-sm text-blue-500">
              Complete step-by-step guidance for all platform features
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-4 h-4" />
                <Input
                  placeholder="Search guides and procedures..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {[
                { id: 'all', label: 'All Guides' },
                { id: 'getting-started', label: 'Getting Started' },
                { id: 'daily-tasks', label: 'Daily Tasks' },
                { id: 'advanced', label: 'Advanced' },
                { id: 'troubleshooting', label: 'Troubleshooting' }
              ].map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id as any)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Start Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Star className="w-4 h-4" />
              Quick Start Recommendation
            </h3>
            <p className="text-blue-800 text-sm mb-3">
              New to SafetySync.AI? Start with these essential guides in order:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button variant="outline" size="sm" className="justify-start">
                <Play className="w-3 h-3 mr-2" />
                1. Initial Setup
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <Play className="w-3 h-3 mr-2" />
                2. Daily Monitoring
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <Play className="w-3 h-3 mr-2" />
                3. AI Assistant
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guide Sections */}
      <div className="grid gap-6">
        {filteredSections.map((section) => (
          <Card key={section.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {section.icon}
                  <div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <p className="text-sm text-blue-500 mt-1">{section.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {section.planLevel !== 'all' && (
                    <Badge className={getPlanBadgeColor(section.planLevel)}>
                      {section.planLevel.replace('-', ' ').toUpperCase()}
                    </Badge>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExpandedSection(
                      expandedSection === section.id ? null : section.id
                    )}
                  >
                    {expandedSection === section.id ? 'Collapse' : 'View Steps'}
                    <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${
                      expandedSection === section.id ? 'rotate-90' : ''
                    }`} />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {expandedSection === section.id && (
              <CardContent>
                <div className="space-y-6">
                  {section.steps.map((step) => (
                    <div key={step.step} className="border-l-4 border-blue-200 pl-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-blue-800 mb-2">{step.title}</h4>
                          <p className="text-blue-600 mb-2">{step.description}</p>
                          
                          {step.action && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                              <div className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-1">
                                <Target className="w-4 h-4" />
                                Action Required:
                              </div>
                              <p className="text-sm text-blue-500">{step.action}</p>
                            </div>
                          )}

                          {step.tips && step.tips.length > 0 && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                              <div className="flex items-center gap-2 text-sm font-medium text-yellow-800 mb-2">
                                <Award className="w-4 h-4" />
                                Pro Tips:
                              </div>
                              <ul className="space-y-1">
                                {step.tips.map((tip, index) => (
                                  <li key={index} className="text-sm text-yellow-700">
                                    • {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-blue-500">
                    <Clock className="w-4 h-4" />
                    Estimated completion time: {section.steps.length * 3-5} minutes
                  </div>
                  <Button size="sm">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Complete
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Help Footer */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="font-semibold text-blue-800 mb-2">Need Additional Help?</h3>
            <p className="text-blue-500 mb-4">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline">
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline">
                <BookOpen className="w-4 h-4 mr-2" />
                Video Tutorials
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download PDF Guide
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
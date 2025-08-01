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
      id: 'getting-started',
      title: 'Getting Started with SafetySync.AI',
      description: 'Your complete onboarding guide to AI-powered OSHA compliance management',
      icon: <Settings className="w-5 h-5" />,
      planLevel: 'all',
      category: 'getting-started',
      steps: [
        {
          step: 1,
          title: 'Access Your Workspace',
          description: 'Start by logging into your SafetySync.AI workspace using your username and password',
          action: 'Visit the Client Portal and enter your credentials',
          tips: ['Bookmark the workspace URL for quick access', 'Use the "Remember Me" option for convenience', 'Your workspace is your central hub for all compliance activities']
        },
        {
          step: 2,
          title: 'Navigate the User Guide (First Tab)',
          description: 'The User Guide is your primary entry point - review platform capabilities and features',
          action: 'Click "User Guide" tab in workspace sidebar - this comprehensive guide explains all features',
          tips: ['Start here for complete platform understanding', 'Use the search function to find specific topics', 'Bookmark important sections for quick reference']
        },
        {
          step: 3,
          title: 'Explore Workspace View (Dashboard)',
          description: 'The Workspace View provides your main compliance dashboard with customizable widgets',
          action: 'Click "Workspace View" tab to see your compliance overview with real-time statistics',
          tips: ['Customize widget layout by dragging and dropping', 'Focus on red alerts for urgent items', 'Use the Widget Manager to show/hide components']
        },
        {
          step: 4,
          title: 'Set Up Company Profile',
          description: 'Configure your organization profile with business details and industry information',
          action: 'Go to "Company Profile" tab and enter your business information',
          tips: ['Select your industry for relevant OSHA guidance', 'Add multiple locations if applicable', 'Upload your company logo for branding']
        },
        {
          step: 5,
          title: 'Enable AI Contextual Help',
          description: 'Use the AI-powered help system for instant guidance on any page',
          action: 'Click the help button in the workspace header for contextual assistance',
          tips: ['Ask natural language questions about compliance', 'Get page-specific recommendations', 'Access quick actions for common tasks']
        }
      ]
    },
    {
      id: 'employee-management',
      title: 'Employee Management System',
      description: 'Comprehensive employee database with certificate tracking and compliance monitoring',
      icon: <Users className="w-5 h-5" />,
      planLevel: 'all',
      category: 'daily-tasks',
      steps: [
        {
          step: 1,
          title: 'Access Employee Management',
          description: 'Navigate to the Employee Management section with 200+ employee database',
          action: 'Click "Employee Management" under the Employee Management section in sidebar',
          tips: ['Use advanced search and filtering', 'Export employee data to CSV', 'View department analytics']
        },
        {
          step: 2,
          title: 'Add New Employees',
          description: 'Create employee profiles with complete information and ID verification',
          action: 'Click "Add Employee" button and fill in employee details',
          tips: ['Mark "Employee ID Verified" when confirming identity', 'Assign correct department and status', 'Include contact information for training notifications']
        },
        {
          step: 3,
          title: 'Employee Insights Dashboard',
          description: 'Access AI-powered analytics showing department performance and compliance trends',
          action: 'Click "Employee Insights" for comprehensive analytics with charts and AI insights',
          tips: ['Monitor hiring trends and department distribution', 'Track ID verification rates', 'Use AI recommendations for improvement']
        },
        {
          step: 4,
          title: 'Employee Portal Access',
          description: 'Individual employee portals with personal certificates and training records',
          action: 'Click "Employee Portal" to access individual employee profiles',
          tips: ['Each employee has a unique QR code for certificate access', 'Digital wallet cards replace physical certification cards', 'Mobile-friendly for field access']
        },
        {
          step: 5,
          title: 'Bulk Operations',
          description: 'Manage multiple employees efficiently with bulk selection and actions',
          action: 'Use checkboxes to select multiple employees, then use bulk action buttons',
          tips: ['Activate/deactivate multiple employees at once', 'Download filtered results', 'Apply training assignments to groups']
        }
      ]
    },
    {
      id: 'ai-document-processing',
      title: 'AI-Powered Document Processing',
      description: 'Revolutionary AI system that extracts training data from PDFs and generates certificates',
      icon: <Brain className="w-5 h-5" />,
      planLevel: 'professional',
      category: 'advanced',
      steps: [
        {
          step: 1,
          title: 'Access Training Document Hub',
          description: 'Navigate to the comprehensive document management system',
          action: 'Click "Training Document Hub" in the Training & Documents section',
          tips: ['Upload training sign-in sheets, certificates, and instructor materials', 'Use AI to extract employee data automatically', 'Generate professional certificates instantly']
        },
        {
          step: 2,
          title: 'Upload Training Documents',
          description: 'Upload PDF training documents for AI extraction and processing',
          action: 'Click "Upload Document" and select your training files',
          tips: ['AI works best with clear, high-quality PDFs', 'Supports sign-in sheets, training records, and certificates', 'Multiple file formats supported']
        },
        {
          step: 3,
          title: 'AI Document Processor',
          description: 'Use OpenAI GPT-4o integration for intelligent document analysis',
          action: 'Click "AI Document Processor" for advanced document extraction capabilities',
          tips: ['AI extracts employee names, training details, and instructor information', 'Automatically detects OSHA standards and compliance requirements', 'Creates structured data from unstructured documents']
        },
        {
          step: 4,
          title: 'Instructor Sign-In Generator',
          description: 'Generate professional training sign-in sheets with customizable classes',
          action: 'Click "Instructor Sign-In Generator" to create training documentation',
          tips: ['Create custom training classes with OSHA/ANSI references', 'Add instructor credentials and contact information', 'Export as PDF for printing and record-keeping']
        },
        {
          step: 5,
          title: 'Automated Certificate Generation',
          description: 'AI automatically creates employee certificates from processed training documents',
          action: 'Processed documents automatically generate certificates in employee profiles',
          tips: ['Certificates include QR codes for mobile verification', 'Digital wallet cards replace physical certification cards', 'Automatic integration with employee profiles']
        }
      ]
    },
    {
      id: 'compliance-reporting',
      title: 'Compliance Reporting & Analytics',
      description: 'Generate comprehensive reports and monitor compliance performance',
      icon: <BarChart3 className="w-5 h-5" />,
      planLevel: 'all',
      category: 'daily-tasks',
      steps: [
        {
          step: 1,
          title: 'Access Compliance Reports',
          description: 'Navigate to the comprehensive reporting dashboard',
          action: 'Click "Compliance Reports" in the Compliance & Reporting section',
          tips: ['Generate OSHA audit-ready reports', 'Export data in multiple formats', 'Schedule automated report delivery']
        },
        {
          step: 2,
          title: 'Monitor Training Compliance',
          description: 'Track employee training status and upcoming deadlines',
          action: 'Click "Training Compliance" to view training matrix and status',
          tips: ['Identify training gaps before they become violations', 'Track completion rates by department', 'Set automated renewal reminders']
        },
        {
          step: 3,
          title: 'Generate Audit Documentation',
          description: 'Create comprehensive audit packages for OSHA inspections',
          action: 'Click "Audit Reports" to compile inspection-ready documentation',
          tips: ['Include all required training records', 'Add instructor qualifications', 'Document competency evaluations']
        },
        {
          step: 4,
          title: 'Use Analytics Dashboard',
          description: 'Monitor compliance trends and identify improvement areas',
          action: 'Click "Analytics Dashboard" for data visualization and insights',
          tips: ['Track compliance scores over time', 'Identify top-performing departments', 'Use AI insights for improvement recommendations']
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Common Issues & Troubleshooting',
      description: 'Resolve common platform issues and optimize your SafetySync.AI experience',
      icon: <HelpCircle className="w-5 h-5" />,
      planLevel: 'all',
      category: 'troubleshooting',
      steps: [
        {
          step: 1,
          title: 'AI Document Processing Issues',
          description: 'Troubleshoot PDF extraction and certificate generation problems',
          action: 'Check document quality and file format compatibility',
          tips: ['Use high-quality PDF scans', 'Ensure text is readable and not skewed', 'Try re-uploading if extraction fails']
        },
        {
          step: 2,
          title: 'Login and Authentication Problems',
          description: 'Resolve workspace access and password issues',
          action: 'Verify username and password, check browser settings',
          tips: ['Try different browser or incognito mode', 'Clear browser cache and cookies', 'Contact support if persistent']
        },
        {
          step: 3,
          title: 'Performance Optimization',
          description: 'Improve platform speed and responsiveness',
          action: 'Optimize browser settings and clear unnecessary data',
          tips: ['Close unused browser tabs', 'Use latest browser version', 'Check internet connection speed']
        }
      ]
    }
  ];

  const filteredSections = guideSections.filter(section => {
    const matchesSearch = searchQuery === '' || 
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.steps.some(step => 
        step.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        step.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const matchesCategory = selectedCategory === 'all' || section.category === selectedCategory;
    
    const matchesPlan = 
      userPlan === 'essential' && ['all', 'essential'].includes(section.planLevel) ||
      userPlan === 'professional' && ['all', 'essential', 'professional'].includes(section.planLevel) ||
      userPlan === 'enterprise' && ['all', 'essential', 'professional', 'enterprise'].includes(section.planLevel) ||
      userPlan === 'enterprise-plus' && ['all', 'essential', 'professional', 'enterprise', 'enterprise-plus'].includes(section.planLevel);

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
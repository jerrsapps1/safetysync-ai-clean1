import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Building, 
  GraduationCap, 
  BookOpen, 
  Users, 
  Sitemap, 
  ClipboardList, 
  FolderOpen, 
  Award, 
  CreditCard, 
  QrCode, 
  BarChart3, 
  Bell, 
  Calendar, 
  Smartphone,
  ChevronRight,
  Plus,
  Download,
  Upload,
  Settings,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

export interface SafetyTrackerWidget {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  category: 'management' | 'training' | 'compliance' | 'analytics';
  features: string[];
}

const safetyTrackerWidgets: SafetyTrackerWidget[] = [
  {
    id: 'quick-search',
    title: 'Quick Search',
    description: 'Find employees by name, department, or status',
    icon: <Search className="w-6 h-6" />,
    color: 'bg-green-100 text-green-700',
    category: 'management',
    features: ['Search by name', 'Filter by department', 'Status filtering', 'Quick access']
  },
  {
    id: 'company-profile',
    title: 'Company Profile',
    description: 'Manage company information and branding',
    icon: <Building className="w-6 h-6" />,
    color: 'bg-purple-100 text-purple-700',
    category: 'management',
    features: ['Company details', 'Logo upload', 'Branding settings', 'Contact info']
  },
  {
    id: 'instructors',
    title: 'Instructors',
    description: 'Manage instructors and their specializations',
    icon: <GraduationCap className="w-6 h-6" />,
    color: 'bg-orange-100 text-orange-700',
    category: 'training',
    features: ['Instructor profiles', 'Specializations', 'Certifications', 'Schedule management']
  },
  {
    id: 'training-courses',
    title: 'Training Courses',
    description: 'Add and manage training programs',
    icon: <BookOpen className="w-6 h-6" />,
    color: 'bg-blue-100 text-blue-700',
    category: 'training',
    features: ['Course creation', 'Curriculum management', 'Requirements', 'Prerequisites']
  },
  {
    id: 'employee-management',
    title: 'Employee Management',
    description: 'Add, import, and manage employee database',
    icon: <Users className="w-6 h-6" />,
    color: 'bg-blue-100 text-blue-700',
    category: 'management',
    features: ['Employee profiles', 'Bulk import', 'Department assignment', 'Status tracking']
  },
  {
    id: 'organization-structure',
    title: 'Organization Structure',
    description: 'Manage company divisions and departments',
    icon: <Sitemap className="w-6 h-6" />,
    color: 'bg-blue-100 text-blue-600',
    category: 'management',
    features: ['Department hierarchy', 'Division management', 'Reporting structure', 'Role assignments']
  },
  {
    id: 'training-rosters',
    title: 'Training Rosters',
    description: 'Create and manage class sign-in rosters',
    icon: <ClipboardList className="w-6 h-6" />,
    color: 'bg-teal-100 text-teal-700',
    category: 'training',
    features: ['Class rosters', 'Sign-in sheets', 'Attendance tracking', 'Printable formats']
  },
  {
    id: 'training-records',
    title: 'Training Records',
    description: 'Organize training documents in folders',
    icon: <FolderOpen className="w-6 h-6" />,
    color: 'bg-blue-100 text-blue-700',
    category: 'training',
    features: ['Document storage', 'Folder organization', 'File management', 'Search capabilities']
  },
  {
    id: 'certificates-cards',
    title: 'Certificates & Cards',
    description: 'Manage certificates and digital wallet cards',
    icon: <Award className="w-6 h-6" />,
    color: 'bg-pink-100 text-pink-700',
    category: 'compliance',
    features: ['Certificate generation', 'Digital wallet cards', 'Templates', 'Bulk creation']
  },
  {
    id: 'subscription-billing',
    title: 'Subscription & Billing',
    description: 'Manage subscription and billing settings',
    icon: <CreditCard className="w-6 h-6" />,
    color: 'bg-purple-100 text-purple-700',
    category: 'management',
    features: ['Billing overview', 'Plan management', 'Payment methods', 'Usage tracking']
  },
  {
    id: 'workplace-poster',
    title: 'Workplace Poster',
    description: 'Generate QR code poster for employee lookup',
    icon: <QrCode className="w-6 h-6" />,
    color: 'bg-cyan-100 text-cyan-700',
    category: 'compliance',
    features: ['QR code generation', 'Poster templates', 'Employee lookup', 'Customizable design']
  },
  {
    id: 'analytics-reports',
    title: 'Analytics & Reports',
    description: 'Training compliance analytics and insights',
    icon: <BarChart3 className="w-6 h-6" />,
    color: 'bg-green-100 text-green-700',
    category: 'analytics',
    features: ['Compliance reports', 'Training analytics', 'Performance metrics', 'Export options']
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Manage training reminders and alerts',
    icon: <Bell className="w-6 h-6" />,
    color: 'bg-yellow-100 text-yellow-700',
    category: 'management',
    features: ['Email reminders', 'Alert settings', 'Notification templates', 'Schedule management']
  },
  {
    id: 'training-calendar',
    title: 'Training Calendar',
    description: 'Schedule and manage training sessions',
    icon: <Calendar className="w-6 h-6" />,
    color: 'bg-purple-100 text-purple-700',
    category: 'training',
    features: ['Session scheduling', 'Calendar view', 'Instructor assignments', 'Room booking']
  },
  {
    id: 'employee-portal',
    title: 'Employee Portal',
    description: 'Mobile-friendly self-service portal',
    icon: <Smartphone className="w-6 h-6" />,
    color: 'bg-red-100 text-red-700',
    category: 'compliance',
    features: ['Self-service access', 'Mobile optimization', 'Training status', 'Certificate access']
  }
];

interface SafetyTrackerWidgetProps {
  widget: SafetyTrackerWidget;
  onOpenWidget: (widgetId: string) => void;
}

const SafetyTrackerWidgetCard: React.FC<SafetyTrackerWidgetProps> = ({ widget, onOpenWidget }) => {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer group" onClick={() => onOpenWidget(widget.id)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-lg ${widget.color}`}>
            {widget.icon}
          </div>
          <ChevronRight className="w-5 h-5 text-blue-300 group-hover:text-blue-500 transition-colors" />
        </div>
        <CardTitle className="text-lg font-semibold">{widget.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-blue-500 mb-3">{widget.description}</p>
        <div className="flex flex-wrap gap-1">
          {widget.features.slice(0, 2).map((feature, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {feature}
            </Badge>
          ))}
          {widget.features.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{widget.features.length - 2} more
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface SafetyTrackerWidgetsProps {
  onOpenWidget: (widgetId: string) => void;
}

export const SafetyTrackerWidgets: React.FC<SafetyTrackerWidgetsProps> = ({ onOpenWidget }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Tools', count: safetyTrackerWidgets.length },
    { id: 'management', label: 'Management', count: safetyTrackerWidgets.filter(w => w.category === 'management').length },
    { id: 'training', label: 'Training', count: safetyTrackerWidgets.filter(w => w.category === 'training').length },
    { id: 'compliance', label: 'Compliance', count: safetyTrackerWidgets.filter(w => w.category === 'compliance').length },
    { id: 'analytics', label: 'Analytics', count: safetyTrackerWidgets.filter(w => w.category === 'analytics').length }
  ];

  const filteredWidgets = selectedCategory === 'all' 
    ? safetyTrackerWidgets 
    : safetyTrackerWidgets.filter(widget => widget.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center gap-2"
          >
            {category.label}
            <Badge variant="secondary" className="text-xs">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Widget Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWidgets.map((widget) => (
          <SafetyTrackerWidgetCard
            key={widget.id}
            widget={widget}
            onOpenWidget={onOpenWidget}
          />
        ))}
      </div>
    </div>
  );
};

export default SafetyTrackerWidgets;
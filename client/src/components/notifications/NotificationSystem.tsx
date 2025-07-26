import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Mail,
  Phone,
  Settings,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  Database,
  Brain,
  TrendingUp,
  Shield,
  Calendar,
  User,
  FileText,
  Award
} from 'lucide-react';
import { SafetySyncIcon } from "@/components/ui/safetysync-icon";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'success' | 'error';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'training' | 'certification' | 'compliance' | 'system';
  timestamp: string;
  isRead: boolean;
  actions?: Array<{
    label: string;
    action: string;
  }>;
  affectedUsers?: string[];
}

interface NotificationPreference {
  id: string;
  category: string;
  label: string;
  description: string;
  email: boolean;
  sms: boolean;
  inApp: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface AlertRule {
  id: number;
  name: string;
  condition: string;
  trigger: string;
  recipients: string[];
  channels: string[];
  isActive: boolean;
  lastTriggered?: string;
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "Certificate Expiration Alert",
    message: "5 employees have certifications expiring within 30 days",
    type: 'warning',
    priority: 'high',
    category: 'certification',
    timestamp: "2025-01-12T10:30:00Z",
    isRead: false,
    actions: [
      { label: "View Details", action: "view_expiring" },
      { label: "Schedule Renewal", action: "schedule_renewal" }
    ],
    affectedUsers: ["John Smith", "Sarah Johnson", "Mike Rodriguez", "Lisa Chen", "David Brown"]
  },
  {
    id: 2,
    title: "Training Compliance Update",
    message: "OSHA 1926.501 training completion rate increased to 92%",
    type: 'success',
    priority: 'medium',
    category: 'training',
    timestamp: "2025-01-12T09:15:00Z",
    isRead: false,
    affectedUsers: ["Training Department"]
  },
  {
    id: 3,
    title: "System Maintenance Scheduled",
    message: "Platform will be down for maintenance on Jan 15, 2025 from 2-4 AM EST",
    type: 'info',
    priority: 'medium',
    category: 'system',
    timestamp: "2025-01-11T16:00:00Z",
    isRead: true,
    affectedUsers: ["All Users"]
  },
  {
    id: 4,
    title: "Compliance Audit Due",
    message: "Monthly compliance audit report is due in 3 days",
    type: 'warning',
    priority: 'high',
    category: 'compliance',
    timestamp: "2025-01-11T14:30:00Z",
    isRead: false,
    actions: [
      { label: "Generate Report", action: "generate_report" },
      { label: "Review Data", action: "review_data" }
    ]
  },
  {
    id: 5,
    title: "New Training Module Available",
    message: "Updated Fall Protection training module is now available",
    type: 'info',
    priority: 'low',
    category: 'training',
    timestamp: "2025-01-10T11:45:00Z",
    isRead: true,
    affectedUsers: ["Safety Instructors"]
  }
];

const mockPreferences: NotificationPreference[] = [
  {
    id: 'cert_expiration',
    category: 'certification',
    label: 'Certificate Expiration',
    description: 'Alerts when certifications are about to expire',
    email: true,
    sms: true,
    inApp: true,
    priority: 'high'
  },
  {
    id: 'training_due',
    category: 'training',
    label: 'Training Due',
    description: 'Notifications for upcoming training requirements',
    email: true,
    sms: false,
    inApp: true,
    priority: 'medium'
  },
  {
    id: 'compliance_alerts',
    category: 'compliance',
    label: 'Compliance Alerts',
    description: 'Important compliance and regulatory updates',
    email: true,
    sms: true,
    inApp: true,
    priority: 'high'
  },
  {
    id: 'system_updates',
    category: 'system',
    label: 'System Updates',
    description: 'Platform updates and maintenance notifications',
    email: false,
    sms: false,
    inApp: true,
    priority: 'low'
  }
];

const mockAlertRules: AlertRule[] = [
  {
    id: 1,
    name: "Certificate Expiration - 30 Days",
    condition: "Certificates expiring within 30 days",
    trigger: "Daily at 9:00 AM",
    recipients: ["Safety Manager", "HR Department"],
    channels: ["Email", "In-App"],
    isActive: true,
    lastTriggered: "2025-01-12T09:00:00Z"
  },
  {
    id: 2,
    name: "Training Completion Below 80%",
    condition: "Department training completion < 80%",
    trigger: "Weekly on Monday",
    recipients: ["Department Managers"],
    channels: ["Email", "SMS"],
    isActive: true,
    lastTriggered: "2025-01-08T10:00:00Z"
  },
  {
    id: 3,
    name: "Compliance Audit Reminder",
    condition: "Monthly audit due in 3 days",
    trigger: "Monthly",
    recipients: ["Compliance Officer"],
    channels: ["Email", "In-App"],
    isActive: true,
    lastTriggered: "2025-01-11T14:30:00Z"
  }
];

export default function NotificationSystem() {
  const [activeTab, setActiveTab] = useState("notifications");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [preferences, setPreferences] = useState(mockPreferences);
  const [alertRules, setAlertRules] = useState(mockAlertRules);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'success': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'info': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-blue-400/20 text-blue-300 border-blue-400/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-blue-400/20 text-blue-300 border-blue-400/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'error': return <AlertTriangle className="w-5 h-5" />;
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'info': return <Bell className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const filteredNotifications = mockNotifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || notification.type === selectedType;
    return matchesSearch && matchesType;
  });

  const unreadCount = mockNotifications.filter(n => !n.isRead).length;
  const highPriorityCount = mockNotifications.filter(n => n.priority === 'high' || n.priority === 'urgent').length;
  const todayCount = mockNotifications.filter(n => {
    const today = new Date().toDateString();
    const notificationDate = new Date(n.timestamp).toDateString();
    return today === notificationDate;
  }).length;

  const updatePreference = (id: string, channel: string, value: boolean) => {
    setPreferences(prev => prev.map(pref => 
      pref.id === id ? { ...pref, [channel]: value } : pref
    ));
  };

  const toggleAlertRule = (id: number) => {
    setAlertRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  return (
    <div className="space-y-6 relative">
      {/* Tech grid background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 opacity-10 rounded-lg"></div>
      
      {/* Floating tech icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 animate-float">
          <Bell className="w-8 h-8 text-blue-400/30" />
        </div>
        <div className="absolute top-32 right-20 animate-float-delay-1">
          <Brain className="w-10 h-10 text-purple-400/30" />
        </div>
        <div className="absolute bottom-20 left-20 animate-float-delay-2">
          <TrendingUp className="w-6 h-6 text-green-400/30" />
        </div>
        <div className="absolute bottom-32 right-32 animate-float-delay-3">
          <Shield className="w-7 h-7 text-emerald-400/30" />
        </div>
      </div>

      <div className="flex items-center justify-between relative z-10">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <SafetySyncIcon size={32} className="rounded-lg" />
            Notifications & Alerts
          </h2>
          <p className="text-blue-300">Manage notifications, alerts, and communication preferences</p>
          <p className="text-blue-300 text-sm mt-1">
            🔔 AI-powered smart notifications • {unreadCount} unread alerts
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Alert
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            <Settings className="w-4 h-4 mr-2" />
            Preferences
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
        <Card className="bg-black/20 backdrop-blur-sm border-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm">Unread Notifications</p>
                <p className="text-2xl font-bold text-white">{unreadCount}</p>
                <p className="text-blue-400 text-sm">🤖 AI-Prioritized</p>
              </div>
              <Bell className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm">High Priority</p>
                <p className="text-2xl font-bold text-white">{highPriorityCount}</p>
                <p className="text-yellow-400 text-sm">Urgent Action</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm">Today's Alerts</p>
                <p className="text-2xl font-bold text-white">{todayCount}</p>
                <p className="text-green-400 text-sm">New Today</p>
              </div>
              <Calendar className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm">Active Rules</p>
                <p className="text-2xl font-bold text-white">{alertRules.filter(r => r.isActive).length}</p>
                <p className="text-purple-400 text-sm">Monitoring</p>
              </div>
              <Settings className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4 relative z-10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-300" />
          <Input
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-blue-700/50 border-blue-600 text-white placeholder-blue-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-300" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-blue-700/50 border-blue-600 text-white rounded-md px-3 py-2"
          >
            <option value="all">All Types</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="success">Success</option>
            <option value="info">Info</option>
          </select>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="relative z-10">
        <TabsList className="grid w-full grid-cols-3 bg-black/20 backdrop-blur-sm border-blue-700">
          <TabsTrigger 
            value="notifications" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200"
          >
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger 
            value="preferences" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200"
          >
            <Settings className="h-4 w-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger 
            value="alerts" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200"
          >
            <AlertTriangle className="h-4 w-4" />
            Alert Rules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          {filteredNotifications.map((notification) => (
            <Card key={notification.id} className={`bg-black/20 backdrop-blur-sm border-blue-700 ${!notification.isRead ? 'ring-1 ring-blue-500/30' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-white font-semibold">{notification.title}</h3>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-gray-300 mb-3">{notification.message}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={getTypeColor(notification.type)}>
                          {notification.type}
                        </Badge>
                        <Badge className={getPriorityColor(notification.priority)}>
                          {notification.priority}
                        </Badge>
                        <Badge variant="outline" className="text-blue-300 border-blue-500">
                          {notification.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-blue-300">
                        <Clock className="w-4 h-4" />
                        {new Date(notification.timestamp).toLocaleString()}
                      </div>
                      {notification.affectedUsers && (
                        <div className="flex items-center gap-2 text-sm text-blue-300 mt-2">
                          <User className="w-4 h-4" />
                          Affects: {notification.affectedUsers.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="border-blue-500 text-gray-300">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
                {notification.actions && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-blue-600">
                    {notification.actions.map((action, index) => (
                      <Button
                        key={index}
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card className="bg-black/20 backdrop-blur-sm border-blue-700">
            <CardHeader>
              <CardTitle className="text-white">Notification Preferences</CardTitle>
              <CardDescription className="text-blue-300">
                Configure how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {preferences.map((pref) => (
                  <div key={pref.id} className="border border-blue-600 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-white font-medium">{pref.label}</h4>
                        <p className="text-blue-300 text-sm">{pref.description}</p>
                      </div>
                      <Badge className={getPriorityColor(pref.priority)}>
                        {pref.priority}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`${pref.id}-email`}
                          checked={pref.email}
                          onCheckedChange={(checked) => updatePreference(pref.id, 'email', checked)}
                        />
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-blue-400" />
                          <Label htmlFor={`${pref.id}-email`} className="text-white">Email</Label>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`${pref.id}-sms`}
                          checked={pref.sms}
                          onCheckedChange={(checked) => updatePreference(pref.id, 'sms', checked)}
                        />
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-green-400" />
                          <Label htmlFor={`${pref.id}-sms`} className="text-white">SMS</Label>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`${pref.id}-inapp`}
                          checked={pref.inApp}
                          onCheckedChange={(checked) => updatePreference(pref.id, 'inApp', checked)}
                        />
                        <div className="flex items-center space-x-2">
                          <Bell className="w-4 h-4 text-purple-400" />
                          <Label htmlFor={`${pref.id}-inapp`} className="text-white">In-App</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {alertRules.map((rule) => (
            <Card key={rule.id} className="bg-black/20 backdrop-blur-sm border-blue-700">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-semibold">{rule.name}</h3>
                      <Badge className={rule.isActive ? 'bg-green-500/20 text-green-400' : 'bg-blue-400/20 text-blue-300'}>
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-gray-300 mb-3">{rule.condition}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-blue-300">Trigger:</p>
                        <p className="text-white">{rule.trigger}</p>
                      </div>
                      <div>
                        <p className="text-blue-300">Recipients:</p>
                        <p className="text-white">{rule.recipients.join(', ')}</p>
                      </div>
                      <div>
                        <p className="text-blue-300">Channels:</p>
                        <p className="text-white">{rule.channels.join(', ')}</p>
                      </div>
                      {rule.lastTriggered && (
                        <div>
                          <p className="text-blue-300">Last Triggered:</p>
                          <p className="text-white">{new Date(rule.lastTriggered).toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={rule.isActive}
                      onCheckedChange={() => toggleAlertRule(rule.id)}
                    />
                    <Button size="sm" variant="outline" className="border-blue-500 text-gray-300">
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Calendar, 
  Users, 
  Clock, 
  Plus, 
  Search,
  Filter,
  Download,
  Edit,
  Eye,
  AlertCircle,
  CheckCircle,
  Database,
  Brain,
  TrendingUp,
  Shield
} from 'lucide-react';
import { SafetySyncIcon } from "@/components/ui/safetysync-icon";
import { SmoothLoading } from "@/components/ui/smooth-loading";

interface TrainingSession {
  id: number;
  title: string;
  type: string;
  instructor: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  capacity: number;
  enrolled: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  description: string;
  requirements: string[];
  compliance: string[];
}

interface TrainingModule {
  id: number;
  title: string;
  category: string;
  description: string;
  duration: number;
  compliance: string[];
  prerequisites: string[];
  frequency: string;
  lastUpdated: string;
  completionRate: number;
  status: 'active' | 'draft' | 'archived';
}

const mockTrainingSessions: TrainingSession[] = [
  {
    id: 1,
    title: "Fall Protection Certification",
    type: "OSHA Required",
    instructor: "John Smith",
    date: "2025-01-15",
    time: "09:00",
    duration: 8,
    location: "Training Room A",
    capacity: 20,
    enrolled: 15,
    status: 'scheduled',
    description: "Comprehensive fall protection training covering OSHA 1926.501 requirements",
    requirements: ["Hard hat", "Safety harness", "Steel-toed boots"],
    compliance: ["OSHA 1926.501", "EM 385-1-1"]
  },
  {
    id: 2,
    title: "Forklift Operation Training",
    type: "Equipment Certification",
    instructor: "Sarah Johnson",
    date: "2025-01-18",
    time: "13:00",
    duration: 6,
    location: "Warehouse Floor",
    capacity: 8,
    enrolled: 6,
    status: 'scheduled',
    description: "Power Industrial Truck (PIT) operation training and certification",
    requirements: ["Safety vest", "Hard hat", "Valid driver's license"],
    compliance: ["OSHA 1910.178", "CFR 29"]
  },
  {
    id: 3,
    title: "HAZWOPER 40-Hour",
    type: "OSHA Required",
    instructor: "Mike Rodriguez",
    date: "2025-01-22",
    time: "08:00",
    duration: 40,
    location: "Main Conference Room",
    capacity: 25,
    enrolled: 18,
    status: 'scheduled',
    description: "Hazardous Waste Operations and Emergency Response training",
    requirements: ["Respirator fit test", "Medical clearance"],
    compliance: ["OSHA 1910.120", "EPA 40 CFR 311"]
  }
];

const mockTrainingModules: TrainingModule[] = [
  {
    id: 1,
    title: "Fall Protection Awareness",
    category: "Safety Training",
    description: "Basic fall protection awareness and hazard recognition",
    duration: 2,
    compliance: ["OSHA 1926.95", "OSHA 1926.501"],
    prerequisites: ["Safety Orientation"],
    frequency: "Annual",
    lastUpdated: "2025-01-10",
    completionRate: 92,
    status: 'active'
  },
  {
    id: 2,
    title: "Lockout/Tagout (LOTO)",
    category: "Energy Control",
    description: "Control of hazardous energy sources during maintenance",
    duration: 4,
    compliance: ["OSHA 1910.147"],
    prerequisites: ["Electrical Safety Basics"],
    frequency: "Annual",
    lastUpdated: "2025-01-08",
    completionRate: 88,
    status: 'active'
  },
  {
    id: 3,
    title: "Respiratory Protection",
    category: "PPE Training",
    description: "Proper use and maintenance of respiratory equipment",
    duration: 3,
    compliance: ["OSHA 1910.134"],
    prerequisites: ["Medical clearance", "Fit testing"],
    frequency: "Annual",
    lastUpdated: "2025-01-05",
    completionRate: 85,
    status: 'active'
  }
];

export default function TrainingManagement() {
  const [activeTab, setActiveTab] = useState("sessions");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'draft': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'archived': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredSessions = mockTrainingSessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || session.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredModules = mockTrainingModules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || module.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 relative">
      {/* Tech grid background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 opacity-10 rounded-lg"></div>
      
      {/* Floating tech icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 animate-float">
          <BookOpen className="w-8 h-8 text-blue-400/30" />
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
            Training Management
          </h2>
          <p className="text-gray-400">Schedule, track, and manage safety training programs</p>
          <p className="text-blue-300 text-sm mt-1">
            🎓 OSHA-compliant training modules with automated scheduling and compliance tracking
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 2000);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule Training
          </Button>
          <Button 
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 1500);
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Schedule
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
        <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Scheduled Sessions</p>
                <p className="text-2xl font-bold text-white">12</p>
                <p className="text-green-400 text-sm">🤖 AI-Scheduled</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Modules</p>
                <p className="text-2xl font-bold text-white">25</p>
                <p className="text-emerald-400 text-sm">OSHA Compliant</p>
              </div>
              <BookOpen className="w-8 h-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Enrolled</p>
                <p className="text-2xl font-bold text-white">156</p>
                <p className="text-blue-400 text-sm">Employees</p>
              </div>
              <Users className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completion Rate</p>
                <p className="text-2xl font-bold text-white">89%</p>
                <p className="text-green-400 text-sm">⬆ +5% this month</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4 relative z-10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search training sessions or modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-gray-800/50 border-gray-700 text-white rounded-md px-3 py-2"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="relative z-10">
        <TabsList className="grid w-full grid-cols-3 bg-black/20 backdrop-blur-sm border-gray-800">
          <TabsTrigger 
            value="sessions" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200"
          >
            <Calendar className="h-4 w-4" />
            Training Sessions
          </TabsTrigger>
          <TabsTrigger 
            value="modules" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200"
          >
            <BookOpen className="h-4 w-4" />
            Training Modules
          </TabsTrigger>
          <TabsTrigger 
            value="compliance" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200"
          >
            <Shield className="h-4 w-4" />
            Compliance Tracking
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SmoothLoading variant="ai-skeleton" text="Loading training sessions..." />
              <SmoothLoading variant="ai-skeleton" text="Loading training sessions..." />
              <SmoothLoading variant="ai-skeleton" text="Loading training sessions..." />
              <SmoothLoading variant="ai-skeleton" text="Loading training sessions..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 content-fade-in">
              {filteredSessions.map((session) => (
                <Card key={session.id} className="bg-black/20 backdrop-blur-sm border-gray-800">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white">{session.title}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {session.instructor} • {session.location}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(session.status)}>
                      {session.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300 text-sm">{session.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-300 text-sm">{session.time} ({session.duration}h)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300 text-sm">{session.enrolled}/{session.capacity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      <span className="text-gray-300 text-sm">{session.type}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-gray-300 text-sm">{session.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {session.compliance.map((comp, index) => (
                        <Badge key={index} variant="outline" className="text-xs text-blue-300 border-blue-500/30">
                          {comp}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                      <Eye className="w-3 h-3 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SmoothLoading variant="ai-skeleton" text="Loading training modules..." />
              <SmoothLoading variant="ai-skeleton" text="Loading training modules..." />
              <SmoothLoading variant="ai-skeleton" text="Loading training modules..." />
              <SmoothLoading variant="ai-skeleton" text="Loading training modules..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 content-fade-in">
              {filteredModules.map((module) => (
              <Card key={module.id} className="bg-black/20 backdrop-blur-sm border-gray-800">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white">{module.title}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {module.category} • {module.duration} hours
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(module.status)}>
                      {module.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 text-sm">{module.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Completion Rate</span>
                      <span className="text-white font-medium">{module.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${module.completionRate}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300 text-sm">Frequency: {module.frequency}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-300 text-sm">Updated: {module.lastUpdated}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm font-medium">Compliance Standards:</p>
                    <div className="flex flex-wrap gap-1">
                      {module.compliance.map((comp, index) => (
                        <Badge key={index} variant="outline" className="text-xs text-emerald-300 border-emerald-500/30">
                          {comp}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                      <BookOpen className="w-3 h-3 mr-1" />
                      View Module
                    </Button>
                    <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Compliance Overview */}
            <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  Compliance Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">OSHA 1926.501 (Fall Protection)</span>
                    <Badge className="bg-green-500/20 text-green-400">92% Compliant</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">OSHA 1910.178 (Forklift)</span>
                    <Badge className="bg-green-500/20 text-green-400">88% Compliant</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">OSHA 1910.120 (HAZWOPER)</span>
                    <Badge className="bg-yellow-500/20 text-yellow-400">75% Compliant</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">OSHA 1910.134 (Respiratory)</span>
                    <Badge className="bg-green-500/20 text-green-400">95% Compliant</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Renewals */}
            <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  Upcoming Renewals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Fall Protection</p>
                      <p className="text-gray-400 text-sm">15 employees</p>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-400">30 days</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">First Aid/CPR</p>
                      <p className="text-gray-400 text-sm">8 employees</p>
                    </div>
                    <Badge className="bg-red-500/20 text-red-400">7 days</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Forklift Certification</p>
                      <p className="text-gray-400 text-sm">12 employees</p>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-400">45 days</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
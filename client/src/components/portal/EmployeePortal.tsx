import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Calendar, 
  Award, 
  BookOpen, 
  AlertTriangle,
  CheckCircle, 
  Download,
  Eye,
  Clock,
  Shield,
  FileText,
  Phone,
  Mail,
  MapPin,
  Building,
  Database,
  Brain,
  TrendingUp,
  Bell,
  Settings,
  LogOut
} from 'lucide-react';
import { SafetySyncIcon } from "@/components/ui/safetysync-icon";

interface EmployeeProfile {
  id: string;
  name: string;
  employeeId: string;
  email: string;
  phone: string;
  department: string;
  division: string;
  position: string;
  startDate: string;
  photo: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

interface Certification {
  id: number;
  name: string;
  issueDate: string;
  expirationDate: string;
  instructor: string;
  status: 'active' | 'expired' | 'expiring';
  type: 'certificate' | 'wallet-card';
  certificateNumber: string;
  downloadUrl: string;
}

interface TrainingRecord {
  id: number;
  name: string;
  completionDate: string;
  status: 'completed' | 'in-progress' | 'pending';
  hours: number;
  score?: number;
  instructor: string;
}

interface UpcomingTraining {
  id: number;
  name: string;
  date: string;
  time: string;
  location: string;
  instructor: string;
  duration: number;
  status: 'enrolled' | 'required' | 'optional';
}

const mockEmployeeProfile: EmployeeProfile = {
  id: "EMP001",
  name: "John Smith",
  employeeId: "EMP001",
  email: "john.smith@safetysync.ai",
  phone: "(555) 123-4567",
  department: "Construction",
  division: "Field Operations",
  position: "Site Supervisor",
  startDate: "2023-06-15",
  photo: "/api/placeholder/150/150",
  emergencyContact: {
    name: "Jane Smith",
    phone: "(555) 987-6543",
    relationship: "Spouse"
  }
};

const mockCertifications: Certification[] = [
  {
    id: 1,
    name: "Fall Protection Certification",
    issueDate: "2025-01-10",
    expirationDate: "2026-01-10",
    instructor: "Sarah Johnson",
    status: 'active',
    type: 'certificate',
    certificateNumber: "FSC-2025-001",
    downloadUrl: "/certificates/FSC-2025-001.pdf"
  },
  {
    id: 2,
    name: "Forklift Operation Card",
    issueDate: "2024-08-15",
    expirationDate: "2027-08-15",
    instructor: "Mike Rodriguez",
    status: 'active',
    type: 'wallet-card',
    certificateNumber: "FLT-2024-002",
    downloadUrl: "/certificates/FLT-2024-002.pdf"
  },
  {
    id: 3,
    name: "First Aid/CPR",
    issueDate: "2024-03-20",
    expirationDate: "2025-03-20",
    instructor: "Lisa Chen",
    status: 'expiring',
    type: 'certificate',
    certificateNumber: "AID-2024-003",
    downloadUrl: "/certificates/AID-2024-003.pdf"
  }
];

const mockTrainingRecords: TrainingRecord[] = [
  {
    id: 1,
    name: "Fall Protection Training",
    completionDate: "2025-01-10",
    status: 'completed',
    hours: 8,
    score: 95,
    instructor: "Sarah Johnson"
  },
  {
    id: 2,
    name: "OSHA 10 Hour Construction",
    completionDate: "2024-11-15",
    status: 'completed',
    hours: 10,
    score: 88,
    instructor: "Mike Rodriguez"
  },
  {
    id: 3,
    name: "Scaffold Safety",
    completionDate: "2024-09-22",
    status: 'completed',
    hours: 4,
    score: 92,
    instructor: "David Brown"
  }
];

const mockUpcomingTraining: UpcomingTraining[] = [
  {
    id: 1,
    name: "Annual Safety Refresher",
    date: "2025-01-25",
    time: "09:00",
    location: "Training Room A",
    instructor: "Sarah Johnson",
    duration: 4,
    status: 'required'
  },
  {
    id: 2,
    name: "Equipment Maintenance",
    date: "2025-02-05",
    time: "14:00",
    location: "Workshop",
    instructor: "Mike Rodriguez",
    duration: 3,
    status: 'enrolled'
  },
  {
    id: 3,
    name: "Advanced Fall Protection",
    date: "2025-02-15",
    time: "10:00",
    location: "Field Site",
    instructor: "Lisa Chen",
    duration: 6,
    status: 'optional'
  }
];

export default function EmployeePortal() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profile] = useState(mockEmployeeProfile);
  const [certifications] = useState(mockCertifications);
  const [trainingRecords] = useState(mockTrainingRecords);
  const [upcomingTraining] = useState(mockUpcomingTraining);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'expired': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'expiring': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'in-progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'pending': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'enrolled': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'required': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'optional': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const activeCertifications = certifications.filter(cert => cert.status === 'active').length;
  const expiringCertifications = certifications.filter(cert => cert.status === 'expiring').length;
  const completedTrainings = trainingRecords.filter(record => record.status === 'completed').length;
  const totalTrainingHours = trainingRecords.reduce((sum, record) => sum + record.hours, 0);

  return (
    <div className="space-y-6 relative">
      {/* Tech grid background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 opacity-10 rounded-lg"></div>
      
      {/* Floating tech icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 animate-float">
          <User className="w-8 h-8 text-blue-400/30" />
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
            Employee Portal
          </h2>
          <p className="text-gray-400">Self-service portal for employees to manage their safety training and certifications</p>
          <p className="text-blue-300 text-sm mt-1">
            👤 Welcome back, {profile.name} • {profile.department}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </Button>
          <Button className="bg-gray-500 hover:bg-gray-600 text-white">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="relative z-10">
        <TabsList className="grid w-full grid-cols-5 bg-black/20 backdrop-blur-sm border-gray-800">
          <TabsTrigger 
            value="dashboard" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200"
          >
            <User className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger 
            value="certifications" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200"
          >
            <Award className="h-4 w-4" />
            Certifications
          </TabsTrigger>
          <TabsTrigger 
            value="training" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200"
          >
            <BookOpen className="h-4 w-4" />
            Training
          </TabsTrigger>
          <TabsTrigger 
            value="schedule" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200"
          >
            <Calendar className="h-4 w-4" />
            Schedule
          </TabsTrigger>
          <TabsTrigger 
            value="profile" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200"
          >
            <Settings className="h-4 w-4" />
            Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Dashboard Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Active Certifications</p>
                    <p className="text-2xl font-bold text-white">{activeCertifications}</p>
                    <p className="text-green-400 text-sm">Current & Valid</p>
                  </div>
                  <Award className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Expiring Soon</p>
                    <p className="text-2xl font-bold text-white">{expiringCertifications}</p>
                    <p className="text-yellow-400 text-sm">Next 30 days</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Completed Training</p>
                    <p className="text-2xl font-bold text-white">{completedTrainings}</p>
                    <p className="text-blue-400 text-sm">Programs</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Training Hours</p>
                    <p className="text-2xl font-bold text-white">{totalTrainingHours}</p>
                    <p className="text-purple-400 text-sm">Total Hours</p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Upcoming */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trainingRecords.slice(0, 3).map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="text-white font-medium">{record.name}</p>
                          <p className="text-gray-400 text-sm">{record.completionDate}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Upcoming Training</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingTraining.slice(0, 3).map((training) => (
                    <div key={training.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-white font-medium">{training.name}</p>
                          <p className="text-gray-400 text-sm">{training.date} at {training.time}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(training.status)}>
                        {training.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="certifications" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {certifications.map((cert) => (
              <Card key={cert.id} className="bg-black/20 backdrop-blur-sm border-gray-800">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white">{cert.name}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {cert.certificateNumber} • {cert.instructor}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(cert.status)}>
                      {cert.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300 text-sm">Issued: {cert.issueDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      <span className="text-gray-300 text-sm">Expires: {cert.expirationDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {trainingRecords.map((record) => (
              <Card key={record.id} className="bg-black/20 backdrop-blur-sm border-gray-800">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white">{record.name}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {record.instructor} • {record.hours} hours
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(record.status)}>
                      {record.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300 text-sm">Completed: {record.completionDate}</span>
                    </div>
                    {record.score && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300 text-sm">Score: {record.score}%</span>
                      </div>
                    )}
                  </div>

                  {record.score && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Performance</span>
                        <span className="text-white font-medium">{record.score}%</span>
                      </div>
                      <Progress value={record.score} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingTraining.map((training) => (
              <Card key={training.id} className="bg-black/20 backdrop-blur-sm border-gray-800">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white">{training.name}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {training.instructor} • {training.duration} hours
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(training.status)}>
                      {training.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300 text-sm">{training.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-300 text-sm">{training.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300 text-sm">{training.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                      <Eye className="w-3 h-3 mr-1" />
                      View Details
                    </Button>
                    {training.status === 'optional' && (
                      <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Enroll
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Employee Profile</CardTitle>
              <CardDescription className="text-gray-400">
                View and update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{profile.name}</h3>
                      <p className="text-gray-400">{profile.position}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300">{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">{profile.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-300">{profile.department}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">Emergency Contact</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-300">{profile.emergencyContact.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300">{profile.emergencyContact.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-purple-400" />
                        <span className="text-gray-300">{profile.emergencyContact.relationship}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
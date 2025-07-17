import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Database,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Award,
  Calendar,
  Users,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Trash2,
  BookOpen,
  Shield,
  User,
  Building,
  MapPin,
  GraduationCap,
  Archive,
  Brain,
  TrendingUp
} from 'lucide-react';
import { SafetySyncIcon } from "@/components/ui/safetysync-icon";

interface TrainingRecord {
  id: number;
  sessionId: string;
  sessionName: string;
  trainingType: string;
  instructorName: string;
  instructorCredentials: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  totalAttendees: number;
  completedAttendees: number;
  certificatesGenerated: number;
  status: 'completed' | 'in-progress' | 'scheduled' | 'cancelled';
  regulatoryReference: string;
  notes: string;
  createdAt: string;
  attendees: TrainingAttendee[];
}

interface TrainingAttendee {
  id: number;
  recordId: number;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  attendanceStatus: 'present' | 'absent' | 'late' | 'left-early';
  completionStatus: 'completed' | 'partial' | 'failed' | 'pending';
  certificateGenerated: boolean;
  certificateId?: string;
  notes: string;
  signedIn: string;
  signedOut: string;
}

export default function TrainingRecordsManager() {
  const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<TrainingRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState<TrainingRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRecordDialog, setShowRecordDialog] = useState(false);
  const [showAttendeeDialog, setShowAttendeeDialog] = useState(false);
  const [selectedAttendee, setSelectedAttendee] = useState<TrainingAttendee | null>(null);
  const { toast } = useToast();

  // Sample data - replace with API call
  const sampleRecords: TrainingRecord[] = [
    {
      id: 1,
      sessionId: "TRN-2025-001",
      sessionName: "Fall Protection Training",
      trainingType: "Safety Training",
      instructorName: "John Smith",
      instructorCredentials: "OSHA 30-Hour, CSP",
      date: "2025-01-15",
      startTime: "08:00",
      endTime: "12:00",
      location: "Training Center A",
      totalAttendees: 15,
      completedAttendees: 14,
      certificatesGenerated: 14,
      status: 'completed',
      regulatoryReference: "OSHA 1926.501, EM 385-1-1",
      notes: "Excellent participation, all safety protocols demonstrated",
      createdAt: "2025-01-15T12:00:00Z",
      attendees: [
        {
          id: 1,
          recordId: 1,
          employeeId: "EMP-001",
          employeeName: "Mike Johnson",
          department: "Construction",
          position: "Foreman",
          attendanceStatus: 'present',
          completionStatus: 'completed',
          certificateGenerated: true,
          certificateId: "CERT-001",
          notes: "Excellent performance",
          signedIn: "08:05",
          signedOut: "12:00"
        },
        {
          id: 2,
          recordId: 1,
          employeeId: "EMP-002",
          employeeName: "Sarah Davis",
          department: "Construction",
          position: "Operator",
          attendanceStatus: 'present',
          completionStatus: 'completed',
          certificateGenerated: true,
          certificateId: "CERT-002",
          notes: "Good understanding of safety procedures",
          signedIn: "08:00",
          signedOut: "12:00"
        }
      ]
    },
    {
      id: 2,
      sessionId: "TRN-2025-002",
      sessionName: "OSHA 30-Hour Construction",
      trainingType: "Certification",
      instructorName: "Lisa Chen",
      instructorCredentials: "OSHA Authorized Trainer",
      date: "2025-01-20",
      startTime: "08:00",
      endTime: "17:00",
      location: "Training Center B",
      totalAttendees: 12,
      completedAttendees: 0,
      certificatesGenerated: 0,
      status: 'in-progress',
      regulatoryReference: "OSHA 1926",
      notes: "Multi-day training program in progress",
      createdAt: "2025-01-20T08:00:00Z",
      attendees: []
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTrainingRecords(sampleRecords);
      setFilteredRecords(sampleRecords);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = trainingRecords;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.sessionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.instructorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.sessionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.trainingType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter(record => record.status === selectedStatus);
    }

    // Type filter
    if (selectedType !== "all") {
      filtered = filtered.filter(record => record.trainingType === selectedType);
    }

    // Date range filter
    if (selectedDateRange !== "all") {
      const now = new Date();
      const recordDate = new Date();
      
      switch (selectedDateRange) {
        case "today":
          filtered = filtered.filter(record => 
            new Date(record.date).toDateString() === now.toDateString()
          );
          break;
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(record => 
            new Date(record.date) >= weekAgo
          );
          break;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(record => 
            new Date(record.date) >= monthAgo
          );
          break;
      }
    }

    setFilteredRecords(filtered);
  }, [searchTerm, selectedStatus, selectedType, selectedDateRange, trainingRecords]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'scheduled': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getAttendanceColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'absent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'late': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'left-early': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCompletionColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'partial': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleBulkCertificateGeneration = (recordId: number) => {
    toast({
      title: "Bulk Certificate Generation",
      description: "Generating certificates for all completed attendees...",
    });
  };

  const handleExportRecords = () => {
    toast({
      title: "Export Records",
      description: "Training records exported successfully",
    });
  };

  const handleGenerateCertificate = (attendee: TrainingAttendee) => {
    toast({
      title: "Certificate Generated",
      description: `Certificate generated for ${attendee.employeeName}`,
    });
  };

  const calculateStats = () => {
    const total = trainingRecords.length;
    const completed = trainingRecords.filter(r => r.status === 'completed').length;
    const totalAttendees = trainingRecords.reduce((sum, r) => sum + r.totalAttendees, 0);
    const totalCertificates = trainingRecords.reduce((sum, r) => sum + r.certificatesGenerated, 0);
    
    return { total, completed, totalAttendees, totalCertificates };
  };

  const stats = calculateStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Database className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-pulse" />
          <p className="text-white">Loading training records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Floating tech icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 animate-float">
          <Database className="w-8 h-8 text-blue-400/30" />
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
            Training Records
          </h2>
          <p className="text-gray-400">Comprehensive training session documentation and tracking</p>
          <p className="text-blue-300 text-sm mt-1">
            📋 Complete audit trail for compliance documentation and certificate tracking
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
        <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Sessions</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-2xl font-bold text-white">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Attendees</p>
                <p className="text-2xl font-bold text-white">{stats.totalAttendees}</p>
              </div>
              <Users className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Certificates</p>
                <p className="text-2xl font-bold text-white">{stats.totalCertificates}</p>
              </div>
              <Award className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-black/20 backdrop-blur-sm border-gray-800 relative z-10">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-700 text-white"
              />
            </div>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Safety Training">Safety Training</SelectItem>
                <SelectItem value="Certification">Certification</SelectItem>
                <SelectItem value="Refresher">Refresher</SelectItem>
                <SelectItem value="Orientation">Orientation</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
              <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              onClick={handleExportRecords}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Records Table */}
      <Card className="bg-black/20 backdrop-blur-sm border-gray-800 relative z-10">
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left p-3 text-gray-400">Session</th>
                  <th className="text-left p-3 text-gray-400">Type</th>
                  <th className="text-left p-3 text-gray-400">Instructor</th>
                  <th className="text-left p-3 text-gray-400">Date</th>
                  <th className="text-left p-3 text-gray-400">Attendees</th>
                  <th className="text-left p-3 text-gray-400">Status</th>
                  <th className="text-left p-3 text-gray-400">Certificates</th>
                  <th className="text-left p-3 text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="p-3">
                      <div>
                        <p className="font-medium text-white">{record.sessionName}</p>
                        <p className="text-sm text-gray-400">{record.sessionId}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(record.trainingType)}>
                        {record.trainingType}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="text-white">{record.instructorName}</p>
                        <p className="text-sm text-gray-400">{record.instructorCredentials}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="text-white">{new Date(record.date).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-400">{record.startTime} - {record.endTime}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="text-white">{record.completedAttendees}/{record.totalAttendees}</p>
                        <p className="text-sm text-gray-400">completed</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-white">{record.certificatesGenerated}</span>
                        {record.status === 'completed' && record.certificatesGenerated < record.completedAttendees && (
                          <Button
                            size="sm"
                            onClick={() => handleBulkCertificateGeneration(record.id)}
                            className="bg-yellow-600 hover:bg-yellow-700"
                          >
                            <Award className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedRecord(record);
                            setShowRecordDialog(true);
                          }}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-400 hover:text-green-300"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Record Details Dialog */}
      <Dialog open={showRecordDialog} onOpenChange={setShowRecordDialog}>
        <DialogContent className="max-w-4xl bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>Training Record Details</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="space-y-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="attendees">Attendees</TabsTrigger>
                  <TabsTrigger value="certificates">Certificates</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                      <CardContent className="p-4">
                        <h4 className="text-white font-semibold mb-2">Session Information</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-gray-400">ID:</span> <span className="text-white">{selectedRecord.sessionId}</span></p>
                          <p><span className="text-gray-400">Name:</span> <span className="text-white">{selectedRecord.sessionName}</span></p>
                          <p><span className="text-gray-400">Type:</span> <span className="text-white">{selectedRecord.trainingType}</span></p>
                          <p><span className="text-gray-400">Date:</span> <span className="text-white">{new Date(selectedRecord.date).toLocaleDateString()}</span></p>
                          <p><span className="text-gray-400">Time:</span> <span className="text-white">{selectedRecord.startTime} - {selectedRecord.endTime}</span></p>
                          <p><span className="text-gray-400">Location:</span> <span className="text-white">{selectedRecord.location}</span></p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                      <CardContent className="p-4">
                        <h4 className="text-white font-semibold mb-2">Instructor Information</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-gray-400">Name:</span> <span className="text-white">{selectedRecord.instructorName}</span></p>
                          <p><span className="text-gray-400">Credentials:</span> <span className="text-white">{selectedRecord.instructorCredentials}</span></p>
                          <p><span className="text-gray-400">Regulatory Reference:</span> <span className="text-white">{selectedRecord.regulatoryReference}</span></p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
                    <CardContent className="p-4">
                      <h4 className="text-white font-semibold mb-2">Notes</h4>
                      <p className="text-gray-300 text-sm">{selectedRecord.notes}</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="attendees" className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-white">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left p-2 text-gray-400">Employee</th>
                          <th className="text-left p-2 text-gray-400">Department</th>
                          <th className="text-left p-2 text-gray-400">Attendance</th>
                          <th className="text-left p-2 text-gray-400">Completion</th>
                          <th className="text-left p-2 text-gray-400">Times</th>
                          <th className="text-left p-2 text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRecord.attendees.map((attendee) => (
                          <tr key={attendee.id} className="border-b border-gray-800/50">
                            <td className="p-2">
                              <div>
                                <p className="font-medium text-white">{attendee.employeeName}</p>
                                <p className="text-sm text-gray-400">{attendee.employeeId}</p>
                              </div>
                            </td>
                            <td className="p-2">
                              <div>
                                <p className="text-white">{attendee.department}</p>
                                <p className="text-sm text-gray-400">{attendee.position}</p>
                              </div>
                            </td>
                            <td className="p-2">
                              <Badge className={getAttendanceColor(attendee.attendanceStatus)}>
                                {attendee.attendanceStatus}
                              </Badge>
                            </td>
                            <td className="p-2">
                              <Badge className={getCompletionColor(attendee.completionStatus)}>
                                {attendee.completionStatus}
                              </Badge>
                            </td>
                            <td className="p-2">
                              <div className="text-sm">
                                <p className="text-white">In: {attendee.signedIn}</p>
                                <p className="text-gray-400">Out: {attendee.signedOut}</p>
                              </div>
                            </td>
                            <td className="p-2">
                              <div className="flex space-x-1">
                                {!attendee.certificateGenerated && attendee.completionStatus === 'completed' && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleGenerateCertificate(attendee)}
                                    className="bg-yellow-600 hover:bg-yellow-700"
                                  >
                                    <Award className="w-3 h-3" />
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedAttendee(attendee);
                                    setShowAttendeeDialog(true);
                                  }}
                                  className="text-blue-400 hover:text-blue-300"
                                >
                                  <Eye className="w-3 h-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="certificates" className="space-y-4">
                  <div className="text-center py-8">
                    <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Certificate management features coming soon</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
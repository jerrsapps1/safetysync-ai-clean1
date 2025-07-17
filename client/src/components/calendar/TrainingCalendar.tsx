import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  Plus, 
  Clock, 
  Users, 
  MapPin, 
  Edit, 
  Trash2, 
  Eye, 
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  User,
  Database,
  Brain,
  TrendingUp,
  Shield,
  Settings
} from 'lucide-react';
import { SafetySyncIcon } from "@/components/ui/safetysync-icon";

interface TrainingSession {
  id: number;
  title: string;
  type: 'certification' | 'refresher' | 'new-hire' | 'specialized';
  instructor: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  capacity: number;
  enrolled: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  requirements: string[];
  description: string;
  materials: string[];
  attendees: string[];
}

interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  type: 'training' | 'certification' | 'audit' | 'meeting';
  status: 'scheduled' | 'completed' | 'cancelled';
  participants: number;
}

const mockSessions: TrainingSession[] = [
  {
    id: 1,
    title: "Fall Protection Training",
    type: 'certification',
    instructor: "John Smith",
    date: "2025-01-15",
    time: "09:00",
    duration: 3,
    location: "Training Center A",
    capacity: 15,
    enrolled: 12,
    status: 'scheduled',
    requirements: ['Hard Hat', 'Safety Harness', 'Work Boots'],
    description: "Comprehensive fall protection training covering OSHA 1926.501 requirements",
    materials: ['Fall Protection Manual', 'Safety Harness', 'Training Video'],
    attendees: ['Mike Johnson', 'Sarah Davis', 'Tom Wilson', 'Lisa Chen']
  },
  {
    id: 2,
    title: "OSHA 30-Hour Construction",
    type: 'certification',
    instructor: "Mike Rodriguez",
    date: "2025-01-22",
    time: "08:00",
    duration: 8,
    location: "Training Center B",
    capacity: 20,
    enrolled: 8,
    status: 'scheduled',
    requirements: ['Valid ID', 'Notebook', 'Pen'],
    description: "Complete 30-hour OSHA construction safety training program",
    materials: ['OSHA Manual', 'Workbook', 'Reference Materials'],
    attendees: ['David Brown', 'Jennifer White', 'Robert Lee', 'Maria Garcia']
  },
  {
    id: 3,
    title: "First Aid/CPR Certification",
    type: 'certification',
    instructor: "Sarah Johnson",
    date: "2025-01-29",
    time: "13:00",
    duration: 4,
    location: "Training Center A",
    capacity: 12,
    enrolled: 15,
    status: 'scheduled',
    requirements: ['Comfortable Clothing', 'Closed-toe Shoes'],
    description: "American Red Cross First Aid and CPR certification training",
    materials: ['CPR Mannequin', 'First Aid Kit', 'Training Manual'],
    attendees: ['Kevin Adams', 'Nicole Taylor', 'James Miller', 'Amanda Clark']
  },
  {
    id: 4,
    title: "Hazcom Training Refresher",
    type: 'refresher',
    instructor: "David Anderson",
    date: "2025-02-05",
    time: "10:00",
    duration: 2,
    location: "Conference Room A",
    capacity: 25,
    enrolled: 18,
    status: 'scheduled',
    requirements: ['Previous HazCom Training'],
    description: "Annual hazard communication refresher training",
    materials: ['Updated SDS Sheets', 'Chemical Inventory', 'Training Slides'],
    attendees: ['Multiple Departments']
  },
  {
    id: 5,
    title: "Forklift Operator Training",
    type: 'specialized',
    instructor: "Mike Rodriguez",
    date: "2025-01-12",
    time: "14:00",
    duration: 6,
    location: "Warehouse Floor",
    capacity: 8,
    enrolled: 6,
    status: 'completed',
    requirements: ['Valid Driver License', 'Steel-toe Boots', 'Hard Hat'],
    description: "Complete forklift operator training and certification",
    materials: ['Forklift Manual', 'Safety Checklist', 'Practical Test'],
    attendees: ['Steve Martinez', 'Rachel Kim', 'Chris Johnson']
  }
];

const mockCalendarEvents: CalendarEvent[] = [
  { id: 1, title: "Fall Protection Training", date: "2025-01-15", time: "09:00", type: 'training', status: 'scheduled', participants: 12 },
  { id: 2, title: "Safety Audit", date: "2025-01-16", time: "10:00", type: 'audit', status: 'scheduled', participants: 3 },
  { id: 3, title: "OSHA 30-Hour", date: "2025-01-22", time: "08:00", type: 'certification', status: 'scheduled', participants: 8 },
  { id: 4, title: "Team Safety Meeting", date: "2025-01-24", time: "15:00", type: 'meeting', status: 'scheduled', participants: 25 },
  { id: 5, title: "First Aid/CPR", date: "2025-01-29", time: "13:00", type: 'certification', status: 'scheduled', participants: 15 },
  { id: 6, title: "HazCom Refresher", date: "2025-02-05", time: "10:00", type: 'training', status: 'scheduled', participants: 18 }
];

export default function TrainingCalendar() {
  const [activeTab, setActiveTab] = useState("calendar");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  // Fetch training sessions from API
  const { data: trainingSessions = [], isLoading, error } = useQuery({
    queryKey: ['training-sessions'],
    queryFn: async () => {
      const response = await fetch('/api/training-sessions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch training sessions');
      }
      return response.json();
    }
  });

  // Transform API data to calendar format
  const transformedSessions = trainingSessions.map((session: any) => {
    const startDate = new Date(session.startDate);
    const endDate = new Date(session.endDate);
    
    return {
      id: session.id,
      title: session.sessionName,
      type: 'certification' as const,
      instructor: session.instructor || 'TBD',
      date: startDate.toISOString().split('T')[0],
      time: startDate.toTimeString().split(' ')[0].substring(0, 5),
      duration: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)),
      location: session.location || 'TBD',
      capacity: session.capacity || 20,
      enrolled: 0,
      status: session.status as 'scheduled' | 'in-progress' | 'completed' | 'cancelled',
      requirements: [],
      description: session.notes || 'Training session',
      materials: [],
      attendees: []
    };
  });

  // Combine API sessions with mock sessions for now
  const allSessions = [...transformedSessions, ...mockSessions];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'certification': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'refresher': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'new-hire': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'specialized': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'training': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'audit': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'meeting': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredSessions = allSessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || session.type === selectedType;
    return matchesSearch && matchesType;
  });

  const upcomingSessions = allSessions.filter(session => 
    new Date(session.date) > new Date() && session.status === 'scheduled'
  ).length;

  const totalEnrolled = allSessions.reduce((sum, session) => sum + session.enrolled, 0);
  const totalCapacity = allSessions.reduce((sum, session) => sum + session.capacity, 0);
  const utilizationRate = Math.round((totalEnrolled / totalCapacity) * 100);

  const completedSessions = allSessions.filter(session => session.status === 'completed').length;

  // Generate calendar grid
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDayOfMonth = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-700"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = mockCalendarEvents.filter(event => event.date === dateStr);
      
      days.push(
        <div key={day} className="h-24 border border-gray-700 p-1 hover:bg-gray-800/50 transition-colors">
          <div className="text-white text-sm font-medium mb-1">{day}</div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map((event) => (
              <div key={event.id} className={`text-xs px-1 py-0.5 rounded ${getTypeColor(event.type)} truncate`}>
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-400">+{dayEvents.length - 2} more</div>
            )}
          </div>
        </div>
      );
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Tech grid background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 opacity-10 rounded-lg"></div>
      
      {/* Floating tech icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 animate-float">
          <Calendar className="w-8 h-8 text-blue-400/30" />
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
            Training Calendar
          </h2>
          <p className="text-gray-400">Schedule and manage training sessions, certifications, and safety events</p>
          <p className="text-blue-300 text-sm mt-1">
            📅 AI-optimized scheduling • {upcomingSessions} upcoming sessions • {utilizationRate}% utilization
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Schedule Training
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            <Settings className="w-4 h-4 mr-2" />
            Calendar Settings
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
        <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Upcoming Sessions</p>
                <p className="text-2xl font-bold text-white">{upcomingSessions}</p>
                <p className="text-blue-400 text-sm">🤖 AI-Scheduled</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Enrolled</p>
                <p className="text-2xl font-bold text-white">{totalEnrolled}</p>
                <p className="text-green-400 text-sm">Active Participants</p>
              </div>
              <Users className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Utilization Rate</p>
                <p className="text-2xl font-bold text-white">{utilizationRate}%</p>
                <p className="text-purple-400 text-sm">Capacity Usage</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed Sessions</p>
                <p className="text-2xl font-bold text-white">{completedSessions}</p>
                <p className="text-emerald-400 text-sm">This Month</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4 relative z-10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search training sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="certification">Certification</SelectItem>
              <SelectItem value="refresher">Refresher</SelectItem>
              <SelectItem value="new-hire">New Hire</SelectItem>
              <SelectItem value="specialized">Specialized</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="relative z-10">
        <TabsList className="grid w-full grid-cols-3 bg-black/20 backdrop-blur-sm border-gray-800">
          <TabsTrigger 
            value="calendar" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200"
          >
            <Calendar className="h-4 w-4" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger 
            value="sessions" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200"
          >
            <Users className="h-4 w-4" />
            Training Sessions
          </TabsTrigger>
          <TabsTrigger 
            value="schedule" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200"
          >
            <Clock className="h-4 w-4" />
            Schedule
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">
                  {months[selectedMonth]} {selectedYear}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigateMonth('prev')}
                    className="border-gray-600 text-gray-300"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigateMonth('next')}
                    className="border-gray-600 text-gray-300"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-gray-400 font-medium py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {renderCalendarGrid()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredSessions.map((session) => (
              <Card key={session.id} className="bg-black/20 backdrop-blur-sm border-gray-800">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white">{session.title}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {session.instructor} • {session.date} at {session.time}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getTypeColor(session.type)}>
                        {session.type}
                      </Badge>
                      <Badge className={getStatusColor(session.status)}>
                        {session.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300">{session.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300 text-sm">{session.duration} hours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-300 text-sm">{session.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300 text-sm">{session.enrolled}/{session.capacity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-emerald-400" />
                      <span className="text-gray-300 text-sm">{session.instructor}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Enrollment</span>
                      <span className="text-white font-medium">{session.enrolled} / {session.capacity}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(session.enrolled / session.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                      <Eye className="w-3 h-3 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                      <Users className="w-3 h-3 mr-1" />
                      Manage Enrollment
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
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Quick Schedule</CardTitle>
              <CardDescription className="text-gray-400">
                Schedule new training sessions and manage recurring events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <h4 className="text-white font-medium mb-2">Training Templates</h4>
                    <div className="space-y-2">
                      <Button className="w-full justify-start bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                        <Plus className="w-4 h-4 mr-2" />
                        OSHA 10-Hour Course
                      </Button>
                      <Button className="w-full justify-start bg-green-500/20 text-green-400 hover:bg-green-500/30">
                        <Plus className="w-4 h-4 mr-2" />
                        Fall Protection Training
                      </Button>
                      <Button className="w-full justify-start bg-purple-500/20 text-purple-400 hover:bg-purple-500/30">
                        <Plus className="w-4 h-4 mr-2" />
                        First Aid/CPR
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <h4 className="text-white font-medium mb-2">Recurring Events</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Weekly Safety Meetings</span>
                        <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Monthly Toolbox Talks</span>
                        <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Quarterly Safety Audits</span>
                        <Badge className="bg-blue-500/20 text-blue-400">Scheduled</Badge>
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
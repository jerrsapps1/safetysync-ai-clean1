import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertTriangle, 
  FileText, 
  Plus, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Shield,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Search,
  Filter,
  Download,
  Activity,
  Building,
  Camera,
  Clipboard,
  Timer,
  Target,
  Users,
  Brain,
  Archive
} from 'lucide-react';

interface Incident {
  id: string;
  title: string;
  type: 'injury' | 'near_miss' | 'property_damage' | 'environmental' | 'security' | 'equipment_failure' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'closed' | 'pending_review';
  description: string;
  location: string;
  department: string;
  reportedBy: string;
  reportedDate: string;
  incidentDate: string;
  incidentTime: string;
  injuredPerson?: string;
  witnessCount: number;
  witnesses: string[];
  immediateActions: string;
  rootCause?: string;
  correctiveActions?: string;
  preventiveActions?: string;
  investigator?: string;
  tags: string[];
  attachments: string[];
  followUpRequired: boolean;
  followUpDate?: string;
  oshaReportable: boolean;
  regulatoryNotification?: string;
  cost?: number;
  daysLostTime?: number;
}

const IncidentReporting: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [activeView, setActiveView] = useState<'list' | 'dashboard'>('list');
  const { toast } = useToast();

  // Mock data for demonstration
  const mockIncidents: Incident[] = [
    {
      id: 'inc001',
      title: 'Slip and Fall in Warehouse',
      type: 'injury',
      severity: 'medium',
      status: 'investigating',
      description: 'Employee slipped on wet floor near loading dock area. Sustained minor bruising to left shoulder.',
      location: 'Warehouse - Loading Dock Area',
      department: 'Warehouse',
      reportedBy: 'John Supervisor',
      reportedDate: '2024-12-15',
      incidentDate: '2024-12-15',
      incidentTime: '14:30',
      injuredPerson: 'Michael Johnson',
      witnessCount: 2,
      witnesses: ['Sarah Williams', 'Dave Martinez'],
      immediateActions: 'First aid administered, area cordoned off, spill cleaned up',
      rootCause: 'Leaking hydraulic fluid from forklift not cleaned up promptly',
      correctiveActions: 'Implement immediate spill response protocol, repair hydraulic leak',
      preventiveActions: 'Daily equipment inspection checklist, spill response training',
      investigator: 'Safety Manager',
      tags: ['slip', 'fall', 'warehouse', 'first aid', 'hydraulic'],
      attachments: ['incident_photos.pdf', 'witness_statements.pdf'],
      followUpRequired: true,
      followUpDate: '2024-12-22',
      oshaReportable: false,
      cost: 250,
      daysLostTime: 0
    },
    {
      id: 'inc002',
      title: 'Near Miss - Falling Object',
      type: 'near_miss',
      severity: 'high',
      status: 'closed',
      description: 'Heavy box fell from overhead shelf, missing employee by inches. No injury occurred.',
      location: 'Warehouse - Aisle 7',
      department: 'Warehouse',
      reportedBy: 'Maria Santos',
      reportedDate: '2024-12-10',
      incidentDate: '2024-12-10',
      incidentTime: '10:15',
      witnessCount: 1,
      witnesses: ['Tom Wilson'],
      immediateActions: 'Area evacuated, shelf inspection conducted, unsecured items removed',
      rootCause: 'Overloaded shelf with improper stacking technique',
      correctiveActions: 'Shelf reinforcement, weight limit signage installed',
      preventiveActions: 'Monthly shelf inspection program, proper stacking training',
      investigator: 'Warehouse Manager',
      tags: ['near miss', 'falling object', 'warehouse', 'overhead storage'],
      attachments: ['shelf_inspection.pdf'],
      followUpRequired: false,
      oshaReportable: false,
      cost: 150
    },
    {
      id: 'inc003',
      title: 'Chemical Spill - Cleaning Solution',
      type: 'environmental',
      severity: 'medium',
      status: 'open',
      description: 'Cleaning solution container leaked in maintenance room, creating potential slip hazard.',
      location: 'Maintenance Room B',
      department: 'Maintenance',
      reportedBy: 'Robert Kim',
      reportedDate: '2024-12-14',
      incidentDate: '2024-12-14',
      incidentTime: '16:45',
      witnessCount: 0,
      witnesses: [],
      immediateActions: 'Area cordoned off, spill contained with absorbent material',
      tags: ['chemical spill', 'environmental', 'maintenance', 'cleaning'],
      attachments: ['spill_cleanup.pdf'],
      followUpRequired: true,
      followUpDate: '2024-12-21',
      oshaReportable: false,
      cost: 75
    },
    {
      id: 'inc004',
      title: 'Equipment Malfunction - Conveyor Belt',
      type: 'equipment_failure',
      severity: 'high',
      status: 'investigating',
      description: 'Conveyor belt stopped suddenly, causing product backup and potential safety hazard.',
      location: 'Production Line 2',
      department: 'Production',
      reportedBy: 'Jennifer Rodriguez',
      reportedDate: '2024-12-13',
      incidentDate: '2024-12-13',
      incidentTime: '08:30',
      witnessCount: 3,
      witnesses: ['Alex Thompson', 'Lisa Chen', 'David Brown'],
      immediateActions: 'Line shut down, lockout/tagout procedures implemented',
      rootCause: 'Motor bearing failure due to lack of preventive maintenance',
      correctiveActions: 'Motor replacement, enhanced maintenance schedule',
      preventiveActions: 'Predictive maintenance program implementation',
      investigator: 'Maintenance Supervisor',
      tags: ['equipment failure', 'conveyor', 'production', 'maintenance'],
      attachments: ['equipment_inspection.pdf', 'maintenance_records.pdf'],
      followUpRequired: true,
      followUpDate: '2024-12-20',
      oshaReportable: false,
      cost: 3500,
      daysLostTime: 0
    },
    {
      id: 'inc005',
      title: 'Laceration - Sharp Edge',
      type: 'injury',
      severity: 'medium',
      status: 'closed',
      description: 'Employee cut hand on sharp metal edge while handling materials.',
      location: 'Assembly Area',
      department: 'Manufacturing',
      reportedBy: 'Safety Officer',
      reportedDate: '2024-12-08',
      incidentDate: '2024-12-08',
      incidentTime: '11:20',
      injuredPerson: 'Carlos Mendez',
      witnessCount: 1,
      witnesses: ['Anna Foster'],
      immediateActions: 'First aid administered, medical evaluation, sharp edge covered',
      rootCause: 'Unguarded sharp edge on equipment housing',
      correctiveActions: 'Edge guards installed, safety inspection completed',
      preventiveActions: 'Monthly hazard identification walks, edge guard maintenance',
      investigator: 'Safety Manager',
      tags: ['laceration', 'sharp edge', 'manufacturing', 'first aid'],
      attachments: ['medical_report.pdf', 'guard_installation.pdf'],
      followUpRequired: false,
      oshaReportable: true,
      regulatoryNotification: 'OSHA 300 Log Entry Required',
      cost: 850,
      daysLostTime: 1
    }
  ];

  useEffect(() => {
    setIncidents(mockIncidents);
  }, []);

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || incident.type === selectedType;
    const matchesSeverity = selectedSeverity === 'all' || incident.severity === selectedSeverity;
    const matchesStatus = selectedStatus === 'all' || incident.status === selectedStatus;
    const matchesDepartment = selectedDepartment === 'all' || incident.department === selectedDepartment;
    
    return matchesSearch && matchesType && matchesSeverity && matchesStatus && matchesDepartment;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-green-100 text-green-800';
      case 'pending_review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'injury': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'near_miss': return <Target className="w-4 h-4 text-orange-500" />;
      case 'property_damage': return <Building className="w-4 h-4 text-blue-500" />;
      case 'environmental': return <Shield className="w-4 h-4 text-green-500" />;
      case 'security': return <Shield className="w-4 h-4 text-purple-500" />;
      case 'equipment_failure': return <Activity className="w-4 h-4 text-gray-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleReportIncident = () => {
    toast({
      title: "Incident Reported",
      description: "Incident has been successfully reported and assigned for investigation.",
    });
    setIsReportDialogOpen(false);
  };

  const handleViewIncident = (incident: Incident) => {
    setSelectedIncident(incident);
    setIsViewDialogOpen(true);
  };

  const incidentStats = {
    total: incidents.length,
    open: incidents.filter(i => i.status === 'open').length,
    investigating: incidents.filter(i => i.status === 'investigating').length,
    closed: incidents.filter(i => i.status === 'closed').length,
    oshaReportable: incidents.filter(i => i.oshaReportable).length,
    totalCost: incidents.reduce((sum, i) => sum + (i.cost || 0), 0),
    totalLostTime: incidents.reduce((sum, i) => sum + (i.daysLostTime || 0), 0),
    nearMisses: incidents.filter(i => i.type === 'near_miss').length,
    thisMonth: incidents.filter(i => {
      const reportDate = new Date(i.reportedDate);
      const now = new Date();
      return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear();
    }).length
  };

  const severityDistribution = {
    low: incidents.filter(i => i.severity === 'low').length,
    medium: incidents.filter(i => i.severity === 'medium').length,
    high: incidents.filter(i => i.severity === 'high').length,
    critical: incidents.filter(i => i.severity === 'critical').length
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'list' | 'dashboard')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="list">Incident List</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300">Total Incidents</p>
                    <p className="text-2xl font-bold text-white">{incidentStats.total}</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300">Open Cases</p>
                    <p className="text-2xl font-bold text-red-400">{incidentStats.open}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300">This Month</p>
                    <p className="text-2xl font-bold text-yellow-400">{incidentStats.thisMonth}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300">OSHA Reportable</p>
                    <p className="text-2xl font-bold text-orange-400">{incidentStats.oshaReportable}</p>
                  </div>
                  <Shield className="w-8 h-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300">Total Cost Impact</p>
                    <p className="text-2xl font-bold text-white">${incidentStats.totalCost.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300">Lost Time Days</p>
                    <p className="text-2xl font-bold text-white">{incidentStats.totalLostTime}</p>
                  </div>
                  <Timer className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300">Near Misses</p>
                    <p className="text-2xl font-bold text-white">{incidentStats.nearMisses}</p>
                  </div>
                  <Target className="w-8 h-8 text-indigo-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Severity Distribution */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Severity Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{severityDistribution.low}</div>
                  <div className="text-sm text-gray-300">Low</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{severityDistribution.medium}</div>
                  <div className="text-sm text-gray-300">Medium</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">{severityDistribution.high}</div>
                  <div className="text-sm text-gray-300">High</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{severityDistribution.critical}</div>
                  <div className="text-sm text-gray-300">Critical</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          {/* Search and Filters */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search incidents by title, description, location, or tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-36 bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="injury">Injury</SelectItem>
                      <SelectItem value="near_miss">Near Miss</SelectItem>
                      <SelectItem value="property_damage">Property Damage</SelectItem>
                      <SelectItem value="environmental">Environmental</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="equipment_failure">Equipment Failure</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                    <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severity</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="investigating">Investigating</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="pending_review">Pending Review</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-red-600 hover:bg-red-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Report Incident
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] bg-gray-900 border-gray-700 max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-white">Report New Incident</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="title" className="text-white">Incident Title</Label>
                            <Input id="title" placeholder="Brief description of incident" className="bg-gray-800 border-gray-700 text-white" />
                          </div>
                          <div>
                            <Label htmlFor="type" className="text-white">Type</Label>
                            <Select>
                              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="injury">Injury</SelectItem>
                                <SelectItem value="near_miss">Near Miss</SelectItem>
                                <SelectItem value="property_damage">Property Damage</SelectItem>
                                <SelectItem value="environmental">Environmental</SelectItem>
                                <SelectItem value="security">Security</SelectItem>
                                <SelectItem value="equipment_failure">Equipment Failure</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="severity" className="text-white">Severity</Label>
                            <Select>
                              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                <SelectValue placeholder="Select severity" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="department" className="text-white">Department</Label>
                            <Select>
                              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Production">Production</SelectItem>
                                <SelectItem value="Warehouse">Warehouse</SelectItem>
                                <SelectItem value="Maintenance">Maintenance</SelectItem>
                                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                                <SelectItem value="Office">Office</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="description" className="text-white">Description</Label>
                          <Textarea 
                            id="description" 
                            placeholder="Detailed description of what happened..." 
                            className="bg-gray-800 border-gray-700 text-white h-24" 
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="location" className="text-white">Location</Label>
                            <Input id="location" placeholder="Specific location where incident occurred" className="bg-gray-800 border-gray-700 text-white" />
                          </div>
                          <div>
                            <Label htmlFor="injured" className="text-white">Injured Person (if applicable)</Label>
                            <Input id="injured" placeholder="Name of injured person" className="bg-gray-800 border-gray-700 text-white" />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="immediate" className="text-white">Immediate Actions Taken</Label>
                          <Textarea 
                            id="immediate" 
                            placeholder="What immediate actions were taken?" 
                            className="bg-gray-800 border-gray-700 text-white h-20" 
                          />
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleReportIncident} className="bg-red-600 hover:bg-red-700">
                            Report Incident
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Incident List */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="space-y-4">
                {filteredIncidents.map((incident) => (
                  <div key={incident.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex-shrink-0 mt-1">
                          {getTypeIcon(incident.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-medium">{incident.title}</h3>
                            {incident.oshaReportable && (
                              <Badge variant="destructive" className="text-xs">OSHA Reportable</Badge>
                            )}
                          </div>
                          
                          <p className="text-gray-300 text-sm mb-2">{incident.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge className={getSeverityColor(incident.severity)}>
                              {incident.severity}
                            </Badge>
                            <Badge className={getStatusColor(incident.status)}>
                              {incident.status.replace('_', ' ')}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {incident.type.replace('_', ' ')}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mb-2">
                            {incident.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {incident.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Building className="w-3 h-3" />
                              {incident.department}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(incident.incidentDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {incident.incidentTime}
                            </span>
                            {incident.cost && (
                              <span className="flex items-center gap-1">
                                <span>$</span>
                                {incident.cost.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewIncident(incident)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-gray-400 hover:text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredIncidents.length === 0 && (
                <div className="text-center py-12">
                  <AlertTriangle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-400 text-lg">No incidents found</p>
                  <p className="text-gray-500 text-sm">Try adjusting your search criteria or report a new incident</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Incident View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[900px] bg-gray-900 border-gray-700 max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Incident Details</DialogTitle>
          </DialogHeader>
          {selectedIncident && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Title</Label>
                  <p className="text-gray-300">{selectedIncident.title}</p>
                </div>
                <div>
                  <Label className="text-white">ID</Label>
                  <p className="text-gray-300">{selectedIncident.id}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-white">Type</Label>
                  <p className="text-gray-300">{selectedIncident.type.replace('_', ' ')}</p>
                </div>
                <div>
                  <Label className="text-white">Severity</Label>
                  <Badge className={getSeverityColor(selectedIncident.severity)}>
                    {selectedIncident.severity}
                  </Badge>
                </div>
                <div>
                  <Label className="text-white">Status</Label>
                  <Badge className={getStatusColor(selectedIncident.status)}>
                    {selectedIncident.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              
              <div>
                <Label className="text-white">Description</Label>
                <p className="text-gray-300">{selectedIncident.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Location</Label>
                  <p className="text-gray-300">{selectedIncident.location}</p>
                </div>
                <div>
                  <Label className="text-white">Department</Label>
                  <p className="text-gray-300">{selectedIncident.department}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Incident Date</Label>
                  <p className="text-gray-300">{new Date(selectedIncident.incidentDate).toLocaleDateString()} at {selectedIncident.incidentTime}</p>
                </div>
                <div>
                  <Label className="text-white">Reported By</Label>
                  <p className="text-gray-300">{selectedIncident.reportedBy}</p>
                </div>
              </div>
              
              {selectedIncident.injuredPerson && (
                <div>
                  <Label className="text-white">Injured Person</Label>
                  <p className="text-gray-300">{selectedIncident.injuredPerson}</p>
                </div>
              )}
              
              <div>
                <Label className="text-white">Immediate Actions Taken</Label>
                <p className="text-gray-300">{selectedIncident.immediateActions}</p>
              </div>
              
              {selectedIncident.rootCause && (
                <div>
                  <Label className="text-white">Root Cause</Label>
                  <p className="text-gray-300">{selectedIncident.rootCause}</p>
                </div>
              )}
              
              {selectedIncident.correctiveActions && (
                <div>
                  <Label className="text-white">Corrective Actions</Label>
                  <p className="text-gray-300">{selectedIncident.correctiveActions}</p>
                </div>
              )}
              
              <div>
                <Label className="text-white">Tags</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedIncident.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Incident
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IncidentReporting;
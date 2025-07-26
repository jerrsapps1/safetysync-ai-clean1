import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  Shield, 
  Clock, 
  CheckCircle, 
  Users, 
  MessageSquare,
  Phone,
  Mail,
  FileText,
  Search,
  Filter,
  Plus,
  AlertCircle,
  Zap,
  TrendingUp
} from "lucide-react";

export default function IncidentResponse() {
  const [newIncident, setNewIncident] = useState({
    title: "",
    description: "",
    severity: "medium",
    category: "security"
  });

  const activeIncidents = [
    {
      id: "INC-2025-001",
      title: "Email Service Response Time Degradation",
      severity: "medium",
      status: "investigating",
      created: "2025-01-08 21:45:00",
      assignee: "Sarah Johnson",
      category: "performance",
      affectedUsers: 12,
      lastUpdate: "2025-01-08 22:15:00"
    },
    {
      id: "INC-2025-002",
      title: "Intermittent Login Failures",
      severity: "high",
      status: "monitoring",
      created: "2025-01-08 19:30:00",
      assignee: "Mike Rodriguez",
      category: "security",
      affectedUsers: 3,
      lastUpdate: "2025-01-08 20:45:00"
    }
  ];

  const recentIncidents = [
    {
      id: "INC-2025-003",
      title: "Database Connection Pool Exhaustion",
      severity: "high",
      status: "resolved",
      created: "2025-01-07 14:20:00",
      resolved: "2025-01-07 16:45:00",
      assignee: "David Wilson",
      category: "infrastructure",
      affectedUsers: 89,
      resolution: "Increased connection pool size and implemented connection recycling"
    },
    {
      id: "INC-2025-004",
      title: "SSL Certificate Renewal Failed",
      severity: "critical",
      status: "resolved",
      created: "2025-01-06 09:15:00",
      resolved: "2025-01-06 10:30:00",
      assignee: "Lisa Chen",
      category: "security",
      affectedUsers: 234,
      resolution: "Manual certificate renewal and updated automated renewal process"
    },
    {
      id: "INC-2025-005",
      title: "Backup Service Interruption",
      severity: "medium",
      status: "resolved",
      created: "2025-01-05 03:00:00",
      resolved: "2025-01-05 08:45:00",
      assignee: "Emma Thompson",
      category: "infrastructure",
      affectedUsers: 0,
      resolution: "Restored backup service and implemented redundancy measures"
    }
  ];

  const responseTeam = [
    {
      name: "Sarah Johnson",
      role: "Incident Commander",
      status: "available",
      phone: "+1 (555) 0123",
      email: "sarah.johnson@safetysync.ai",
      expertise: ["Performance", "Monitoring", "Escalation"]
    },
    {
      name: "Mike Rodriguez",
      role: "Security Specialist",
      status: "on-call",
      phone: "+1 (555) 0124",
      email: "mike.rodriguez@safetysync.ai",
      expertise: ["Security", "Authentication", "Firewall"]
    },
    {
      name: "David Wilson",
      role: "Infrastructure Engineer",
      status: "available",
      phone: "+1 (555) 0125",
      email: "david.wilson@safetysync.ai",
      expertise: ["Database", "Networking", "Cloud"]
    },
    {
      name: "Lisa Chen",
      role: "DevOps Engineer",
      status: "busy",
      phone: "+1 (555) 0126",
      email: "lisa.chen@safetysync.ai",
      expertise: ["Deployment", "CI/CD", "Monitoring"]
    }
  ];

  const escalationMatrix = [
    {
      severity: "Low",
      responseTime: "4 hours",
      escalation: "8 hours",
      contacts: ["On-call Engineer"],
      approval: "Team Lead"
    },
    {
      severity: "Medium",
      responseTime: "2 hours",
      escalation: "4 hours",
      contacts: ["On-call Engineer", "Team Lead"],
      approval: "Engineering Manager"
    },
    {
      severity: "High",
      responseTime: "1 hour",
      escalation: "2 hours",
      contacts: ["On-call Engineer", "Team Lead", "Engineering Manager"],
      approval: "VP Engineering"
    },
    {
      severity: "Critical",
      responseTime: "15 minutes",
      escalation: "30 minutes",
      contacts: ["All Team Members", "Leadership", "External Support"],
      approval: "CTO"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-blue-500";
      default: return "bg-blue-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "bg-green-500";
      case "investigating": return "bg-blue-500";
      case "monitoring": return "bg-yellow-500";
      case "escalated": return "bg-red-500";
      default: return "bg-blue-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available": return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "on-call": return <Clock className="w-4 h-4 text-yellow-400" />;
      case "busy": return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-blue-300" />;
    }
  };

  const handleCreateIncident = () => {
    console.log("Creating incident:", newIncident);
    // Reset form
    setNewIncident({
      title: "",
      description: "",
      severity: "medium",
      category: "security"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <h1 className="text-3xl font-bold text-white">Incident Response</h1>
          </div>
          <p className="text-blue-300 max-w-2xl mx-auto">
            Comprehensive incident management and response coordination for SafetySync.AI
          </p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-sm text-blue-300">Active Incidents</p>
                  <p className="text-xl font-bold text-white">{activeIncidents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm text-blue-300">Affected Users</p>
                  <p className="text-xl font-bold text-white">15</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-sm text-blue-300">Avg Response Time</p>
                  <p className="text-xl font-bold text-white">23m</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm text-blue-300">Resolution Rate</p>
                  <p className="text-xl font-bold text-white">98.7%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/10 backdrop-blur-sm">
            <TabsTrigger value="active">Active Incidents</TabsTrigger>
            <TabsTrigger value="recent">Recent Incidents</TabsTrigger>
            <TabsTrigger value="team">Response Team</TabsTrigger>
            <TabsTrigger value="escalation">Escalation</TabsTrigger>
            <TabsTrigger value="create">Create Incident</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Active Incidents</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-white border-white/30">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="text-white border-white/30">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {activeIncidents.map((incident) => (
                <Card key={incident.id} className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-white">{incident.title}</h3>
                          <Badge className={`${getSeverityColor(incident.severity)} text-white`}>
                            {incident.severity}
                          </Badge>
                          <Badge className={`${getStatusColor(incident.status)} text-white`}>
                            {incident.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-blue-300">ID</p>
                            <p className="text-white">{incident.id}</p>
                          </div>
                          <div>
                            <p className="text-blue-300">Assignee</p>
                            <p className="text-white">{incident.assignee}</p>
                          </div>
                          <div>
                            <p className="text-blue-300">Affected Users</p>
                            <p className="text-white">{incident.affectedUsers}</p>
                          </div>
                          <div>
                            <p className="text-blue-300">Created</p>
                            <p className="text-white">{incident.created}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-white border-white/30">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Update
                        </Button>
                        <Button size="sm" variant="outline" className="text-white border-white/30">
                          <Zap className="w-4 h-4 mr-1" />
                          Escalate
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Recent Incidents</h2>
            <div className="space-y-4">
              {recentIncidents.map((incident) => (
                <Card key={incident.id} className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-white">{incident.title}</h3>
                          <Badge className={`${getSeverityColor(incident.severity)} text-white`}>
                            {incident.severity}
                          </Badge>
                          <Badge className={`${getStatusColor(incident.status)} text-white`}>
                            {incident.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-blue-300">ID</p>
                            <p className="text-white">{incident.id}</p>
                          </div>
                          <div>
                            <p className="text-blue-300">Assignee</p>
                            <p className="text-white">{incident.assignee}</p>
                          </div>
                          <div>
                            <p className="text-blue-300">Affected Users</p>
                            <p className="text-white">{incident.affectedUsers}</p>
                          </div>
                          <div>
                            <p className="text-blue-300">Resolution Time</p>
                            <p className="text-white">{Math.floor((new Date(incident.resolved!) - new Date(incident.created)) / 1000 / 60)}m</p>
                          </div>
                        </div>
                        {incident.resolution && (
                          <div className="mt-3 p-2 bg-green-900/30 rounded border border-green-600">
                            <p className="text-sm text-green-200">
                              <strong>Resolution:</strong> {incident.resolution}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-white border-white/30">
                          <FileText className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Response Team</h2>
            <div className="grid gap-4">
              {responseTeam.map((member) => (
                <Card key={member.name} className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(member.status)}
                        <div>
                          <h3 className="font-semibold text-white">{member.name}</h3>
                          <p className="text-sm text-blue-300">{member.role}</p>
                          <div className="flex gap-2 mt-1">
                            {member.expertise.map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-white border-white/30">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-white border-white/30">
                          <Mail className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="escalation" className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Escalation Matrix</h2>
            <div className="space-y-4">
              {escalationMatrix.map((level) => (
                <Card key={level.severity} className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className={`${getSeverityColor(level.severity.toLowerCase())} text-white`}>
                        {level.severity}
                      </Badge>
                      <h3 className="font-semibold text-white">{level.severity} Severity</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-blue-300">Response Time</p>
                        <p className="text-white">{level.responseTime}</p>
                      </div>
                      <div>
                        <p className="text-blue-300">Escalation Time</p>
                        <p className="text-white">{level.escalation}</p>
                      </div>
                      <div>
                        <p className="text-blue-300">Contacts</p>
                        <p className="text-white">{level.contacts.join(", ")}</p>
                      </div>
                      <div>
                        <p className="text-blue-300">Approval Required</p>
                        <p className="text-white">{level.approval}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Create New Incident</h2>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Incident Title
                  </label>
                  <Input
                    value={newIncident.title}
                    onChange={(e) => setNewIncident({...newIncident, title: e.target.value})}
                    placeholder="Brief description of the incident"
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Description
                  </label>
                  <Textarea
                    value={newIncident.description}
                    onChange={(e) => setNewIncident({...newIncident, description: e.target.value})}
                    placeholder="Detailed description of the incident, symptoms, and impact"
                    rows={4}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Severity
                    </label>
                    <select
                      value={newIncident.severity}
                      onChange={(e) => setNewIncident({...newIncident, severity: e.target.value})}
                      className="w-full p-2 bg-white/5 border border-white/20 rounded-md text-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Category
                    </label>
                    <select
                      value={newIncident.category}
                      onChange={(e) => setNewIncident({...newIncident, category: e.target.value})}
                      className="w-full p-2 bg-white/5 border border-white/20 rounded-md text-white"
                    >
                      <option value="security">Security</option>
                      <option value="performance">Performance</option>
                      <option value="infrastructure">Infrastructure</option>
                      <option value="application">Application</option>
                      <option value="network">Network</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleCreateIncident} className="bg-red-600 hover:bg-red-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Incident
                  </Button>
                  <Button variant="outline" className="text-white border-white/30">
                    Save Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
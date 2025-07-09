import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Ticket, Clock, User, AlertCircle, CheckCircle, MessageSquare, Brain } from 'lucide-react';

interface HelpDeskTicket {
  id: number;
  ticketNumber: string;
  userId: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  category: string;
  syncContext?: any;
  assignedTo?: string;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export default function HelpDeskManagement() {
  const [tickets, setTickets] = useState<HelpDeskTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<HelpDeskTicket | null>(null);
  const [assignedTo, setAssignedTo] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/help-desk/tickets', {
        headers: {
          'x-admin-key': 'dev-admin-key'
        }
      });
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast({
        title: "Error",
        description: "Failed to fetch help desk tickets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const assignTicket = async (ticketId: number) => {
    try {
      const response = await fetch(`/api/help-desk/tickets/${ticketId}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'dev-admin-key'
        },
        body: JSON.stringify({ assignedTo })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Ticket assigned successfully",
        });
        fetchTickets();
        setAssignedTo('');
      }
    } catch (error) {
      console.error('Error assigning ticket:', error);
      toast({
        title: "Error",
        description: "Failed to assign ticket",
        variant: "destructive",
      });
    }
  };

  const resolveTicket = async (ticketId: number) => {
    try {
      const response = await fetch(`/api/help-desk/tickets/${ticketId}/resolve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'dev-admin-key'
        },
        body: JSON.stringify({ resolutionNotes })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Ticket resolved successfully",
        });
        fetchTickets();
        setResolutionNotes('');
        setSelectedTicket(null);
      }
    } catch (error) {
      console.error('Error resolving ticket:', error);
      toast({
        title: "Error",
        description: "Failed to resolve ticket",
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'in_progress': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-300';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <CheckCircle className="w-4 h-4" />;
      default: return <Ticket className="w-4 h-4" />;
    }
  };

  const openTickets = tickets.filter(t => t.status === 'open');
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress');
  const resolvedTickets = tickets.filter(t => t.status === 'resolved');
  const syncEscalations = tickets.filter(t => t.category === 'sync_escalation');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading help desk tickets...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                <p className="text-2xl font-bold text-blue-600">{openTickets.length}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-purple-600">{inProgressTickets.length}</p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{resolvedTickets.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">SYNC Escalations</p>
                <p className="text-2xl font-bold text-orange-600">{syncEscalations.length}</p>
              </div>
              <Brain className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="w-5 h-5" />
            Help Desk Tickets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tickets.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No help desk tickets found
              </div>
            ) : (
              tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-blue-600">#{ticket.ticketNumber}</span>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(ticket.status)}>
                          {getStatusIcon(ticket.status)}
                          {ticket.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        {ticket.category === 'sync_escalation' && (
                          <Badge className="bg-orange-100 text-orange-800 border-orange-300">
                            <Brain className="w-3 h-3 mr-1" />
                            SYNC AI
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">{ticket.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                        {ticket.assignedTo && (
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {ticket.assignedTo}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedTicket(ticket)}>
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Ticket #{ticket.ticketNumber}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Title</h4>
                              <p className="text-sm">{ticket.title}</p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Description</h4>
                              <p className="text-sm whitespace-pre-wrap">{ticket.description}</p>
                            </div>
                            {ticket.syncContext && (
                              <div>
                                <h4 className="font-medium mb-2">SYNC Context</h4>
                                <div className="bg-gray-50 p-3 rounded text-sm">
                                  <p><strong>User Message:</strong> {ticket.syncContext.userMessage}</p>
                                  <p><strong>Timestamp:</strong> {new Date(ticket.syncContext.timestamp).toLocaleString()}</p>
                                </div>
                              </div>
                            )}
                            
                            {ticket.status === 'open' && (
                              <div>
                                <h4 className="font-medium mb-2">Assign Ticket</h4>
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Assign to..."
                                    value={assignedTo}
                                    onChange={(e) => setAssignedTo(e.target.value)}
                                  />
                                  <Button onClick={() => assignTicket(ticket.id)}>
                                    Assign
                                  </Button>
                                </div>
                              </div>
                            )}
                            
                            {ticket.status === 'in_progress' && (
                              <div>
                                <h4 className="font-medium mb-2">Resolve Ticket</h4>
                                <div className="space-y-2">
                                  <Textarea
                                    placeholder="Resolution notes..."
                                    value={resolutionNotes}
                                    onChange={(e) => setResolutionNotes(e.target.value)}
                                  />
                                  <Button onClick={() => resolveTicket(ticket.id)}>
                                    Resolve Ticket
                                  </Button>
                                </div>
                              </div>
                            )}
                            
                            {ticket.resolutionNotes && (
                              <div>
                                <h4 className="font-medium mb-2">Resolution Notes</h4>
                                <p className="text-sm whitespace-pre-wrap bg-green-50 p-3 rounded">
                                  {ticket.resolutionNotes}
                                </p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
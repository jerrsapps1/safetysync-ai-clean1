import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Ticket, 
  Plus, 
  Search, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  User,
  Calendar,
  Filter,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'wouter';
import { SafetySyncIcon } from '@/components/ui/safetysync-icon';

interface HelpdeskTicket {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'billing' | 'training' | 'general';
  createdAt: string;
  updatedAt: string;
  responses: TicketResponse[];
}

interface TicketResponse {
  id: number;
  message: string;
  isStaff: boolean;
  createdAt: string;
  author: string;
}

const statusColors = {
  open: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-blue-100 text-blue-700'
};

const priorityColors = {
  low: 'bg-blue-100 text-blue-700',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
};

export default function Helpdesk() {
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'technical'
  });
  const [newResponse, setNewResponse] = useState('');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch tickets
  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['/api/helpdesk/tickets'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Create ticket mutation
  const createTicketMutation = useMutation({
    mutationFn: async (ticketData: any) => {
      const response = await apiRequest('POST', '/api/helpdesk/tickets', ticketData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/helpdesk/tickets'] });
      setNewTicket({ title: '', description: '', priority: 'medium', category: 'technical' });
      toast({
        title: "Ticket Created",
        description: "Your support ticket has been submitted successfully.",
      });
    }
  });

  // Add response mutation
  const addResponseMutation = useMutation({
    mutationFn: async ({ ticketId, message }: { ticketId: number; message: string }) => {
      const response = await apiRequest('POST', `/api/helpdesk/tickets/${ticketId}/responses`, { message });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/helpdesk/tickets'] });
      setNewResponse('');
      toast({
        title: "Response Added",
        description: "Your message has been added to the ticket.",
      });
    }
  });

  const handleCreateTicket = () => {
    if (!newTicket.title || !newTicket.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    createTicketMutation.mutate(newTicket);
  };

  const handleAddResponse = (ticketId: number) => {
    if (!newResponse.trim()) return;
    addResponseMutation.mutate({ ticketId, message: newResponse });
  };

  const filteredTickets = tickets.filter((ticket: HelpdeskTicket) => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const selectedTicketData = tickets.find((t: HelpdeskTicket) => t.id === selectedTicket);

  if (selectedTicket && selectedTicketData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setSelectedTicket(null)}
                className="text-white hover:bg-blue-900/60"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tickets
              </Button>
              <div className="flex items-center gap-3">
                <SafetySyncIcon className="w-8 h-8" />
                <h1 className="text-2xl font-bold text-white">Support Ticket #{selectedTicketData.id}</h1>
              </div>
            </div>
            <Link href="/" className="text-white hover:text-white">
              <Button variant="ghost" className="text-white hover:bg-blue-900/60">
                Home
              </Button>
            </Link>
          </div>

          {/* Ticket Details */}
          <Card className="bg-blue-900/60 backdrop-blur-sm border-violet-500/30 mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-white text-xl mb-2">{selectedTicketData.title}</CardTitle>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={statusColors[selectedTicketData.status]}>
                      {selectedTicketData.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={priorityColors[selectedTicketData.priority]}>
                      {selectedTicketData.priority} priority
                    </Badge>
                    <Badge variant="outline" className="text-white border-white/30">
                      {selectedTicketData.category}
                    </Badge>
                  </div>
                </div>
                <div className="text-right text-sm text-white">
                  <p>Created: {new Date(selectedTicketData.createdAt).toLocaleDateString()}</p>
                  <p>Updated: {new Date(selectedTicketData.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-900/5 p-4 rounded-lg">
                <p className="text-blue-200 whitespace-pre-wrap">{selectedTicketData.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Responses */}
          <Card className="bg-blue-900/60 backdrop-blur-sm border-violet-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Conversation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {selectedTicketData.responses.map((response: TicketResponse) => (
                  <div key={response.id} className={`flex gap-3 ${response.isStaff ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      response.isStaff ? 'bg-blue-500' : 'bg-blue-400'
                    }`}>
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className={`flex-1 ${response.isStaff ? 'text-right' : ''}`}>
                      <div className={`inline-block max-w-[80%] p-3 rounded-lg ${
                        response.isStaff 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-blue-900/20 text-blue-200'
                      }`}>
                        <p className="whitespace-pre-wrap">{response.message}</p>
                      </div>
                      <p className="text-xs text-white mt-1">
                        {response.author} • {new Date(response.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Response */}
              <div className="border-t border-violet-500/30 pt-4">
                <Label htmlFor="response" className="text-white mb-2 block">Add Response</Label>
                <Textarea
                  id="response"
                  placeholder="Type your message here..."
                  value={newResponse}
                  onChange={(e) => setNewResponse(e.target.value)}
                  className="bg-blue-900/60 border-violet-500/30 text-white placeholder-blue-300 mb-3"
                  rows={3}
                />
                <Button 
                  onClick={() => handleAddResponse(selectedTicketData.id)}
                  disabled={!newResponse.trim() || addResponseMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {addResponseMutation.isPending ? 'Sending...' : 'Send Response'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <SafetySyncIcon className="w-8 h-8" />
            <h1 className="text-3xl font-bold text-white">Support Helpdesk</h1>
          </div>
          <Link href="/" className="text-white hover:text-white">
            <Button variant="ghost" className="text-white hover:bg-blue-900/60">
              Home
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="tickets" className="space-y-6">
          <TabsList className="bg-blue-900/60 border-violet-500/30">
            <TabsTrigger value="tickets" className="data-[state=active]:bg-blue-900/20">
              My Tickets
            </TabsTrigger>
            <TabsTrigger value="create" className="data-[state=active]:bg-blue-900/20">
              Create Ticket
            </TabsTrigger>
          </TabsList>

          {/* Tickets List */}
          <TabsContent value="tickets" className="space-y-6">
            {/* Search and Filters */}
            <Card className="bg-blue-900/60 backdrop-blur-sm border-violet-500/30">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-white" />
                      <Input
                        placeholder="Search tickets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-blue-900/60 border-violet-500/30 text-white placeholder-blue-300"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px] bg-blue-900/60 border-violet-500/30 text-white">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-[180px] bg-blue-900/60 border-violet-500/30 text-white">
                      <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Tickets Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="bg-blue-900/60 backdrop-blur-sm border-violet-500/30">
                    <CardContent className="p-6">
                      <div className="animate-pulse">
                        <div className="h-4 bg-blue-900/20 rounded mb-2"></div>
                        <div className="h-3 bg-blue-900/20 rounded w-3/4 mb-4"></div>
                        <div className="flex gap-2">
                          <div className="h-6 bg-blue-900/20 rounded w-16"></div>
                          <div className="h-6 bg-blue-900/20 rounded w-20"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTickets.map((ticket: HelpdeskTicket) => (
                  <Card
                    key={ticket.id}
                    className="bg-blue-900/60 backdrop-blur-sm border-violet-500/30 hover:bg-blue-900/20 transition-colors cursor-pointer"
                    onClick={() => setSelectedTicket(ticket.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-white truncate pr-2">{ticket.title}</h3>
                        <Ticket className="w-5 h-5 text-white flex-shrink-0" />
                      </div>
                      <p className="text-white text-sm mb-4 line-clamp-2">{ticket.description}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={statusColors[ticket.status]}>
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={priorityColors[ticket.priority]}>
                          {ticket.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-white">
                        <span>#{ticket.id}</span>
                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {filteredTickets.length === 0 && !isLoading && (
              <Card className="bg-blue-900/60 backdrop-blur-sm border-violet-500/30">
                <CardContent className="p-12 text-center">
                  <Ticket className="w-16 h-16 text-white mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No tickets found</h3>
                  <p className="text-white mb-4">You haven't created any support tickets yet.</p>
                  <Button
                    onClick={() => document.querySelector('[data-value="create"]')?.click()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Create Your First Ticket
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Create Ticket */}
          <TabsContent value="create">
            <Card className="bg-blue-900/60 backdrop-blur-sm border-violet-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create New Support Ticket
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Brief description of your issue"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                    className="bg-blue-900/60 border-violet-500/30 text-white placeholder-blue-300"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-white">Category</Label>
                    <Select value={newTicket.category} onValueChange={(value) => setNewTicket({ ...newTicket, category: value })}>
                      <SelectTrigger className="bg-blue-900/60 border-violet-500/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="billing">Billing & Account</SelectItem>
                        <SelectItem value="training">Training & Compliance</SelectItem>
                        <SelectItem value="general">General Question</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-white">Priority</Label>
                    <Select value={newTicket.priority} onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}>
                      <SelectTrigger className="bg-blue-900/60 border-violet-500/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed information about your issue..."
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                    className="bg-blue-900/60 border-violet-500/30 text-white placeholder-blue-300"
                    rows={6}
                  />
                </div>

                <Button
                  onClick={handleCreateTicket}
                  disabled={createTicketMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {createTicketMutation.isPending ? 'Creating...' : 'Create Ticket'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Clock, 
  User, 
  Mail, 
  Building, 
  AlertCircle, 
  CheckCircle2, 
  MessageSquare,
  Filter,
  Search,
  UserPlus,
  CheckSquare
} from 'lucide-react';

export default function AdminSupportPage() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterUrgency, setFilterUrgency] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [assignAgent, setAssignAgent] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Custom query function with authentication
  const adminQueryFn = async ({ queryKey }) => {
    const token = localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token');
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(queryKey[0], {
      headers,
      credentials: "include",
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        throw new Error('Authentication required. Please log in.');
      }
      throw new Error('Failed to fetch data');
    }
    return await res.json();
  };

  // Fetch all support tickets
  const { data: tickets = [], isLoading, refetch, error } = useQuery({
    queryKey: ['/api/support/'],
    queryFn: adminQueryFn,
    refetchInterval: 30000, // Refresh every 30 seconds
    retry: false,
  });

  // Update ticket mutation
  const updateTicketMutation = useMutation({
    mutationFn: async ({ id, updates }) => {
      const token = localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`/api/support/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update ticket');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['/api/support/']);
      toast({ title: 'Success', description: 'Ticket updated successfully' });
      setSelectedTicket(null);
      setInternalNotes('');
      setNewStatus('');
    },
    onError: () => {
      toast({ 
        title: 'Error', 
        description: 'Failed to update ticket',
        variant: 'destructive' 
      });
    },
  });

  // Assign ticket mutation
  const assignTicketMutation = useMutation({
    mutationFn: async ({ id, assignedTo }) => {
      const token = localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`/api/support/${id}/assign`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ assignedTo }),
      });
      if (!response.ok) throw new Error('Failed to assign ticket');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['/api/support/']);
      toast({ title: 'Success', description: 'Ticket assigned successfully' });
      setAssignAgent('');
    },
    onError: () => {
      toast({ 
        title: 'Error', 
        description: 'Failed to assign ticket',
        variant: 'destructive' 
      });
    },
  });

  // Resolve ticket mutation
  const resolveTicketMutation = useMutation({
    mutationFn: async ({ id, internalNotes }) => {
      const token = localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`/api/support/${id}/resolve`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ internalNotes }),
      });
      if (!response.ok) throw new Error('Failed to resolve ticket');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['/api/support/']);
      toast({ title: 'Success', description: 'Ticket resolved successfully' });
      setSelectedTicket(null);
      setInternalNotes('');
    },
    onError: () => {
      toast({ 
        title: 'Error', 
        description: 'Failed to resolve ticket',
        variant: 'destructive' 
      });
    },
  });

  // Filter tickets based on search and filters
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = searchTerm === '' || 
      ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesUrgency = filterUrgency === 'all' || ticket.urgency === filterUrgency;
    
    return matchesSearch && matchesStatus && matchesUrgency;
  });

  // Get status badge color
  const getStatusBadge = (status) => {
    const colors = {
      'New': 'bg-blue-100 text-blue-800',
      'Open': 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-purple-100 text-purple-800',
      'Pending': 'bg-orange-100 text-orange-800',
      'Resolved': 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Get urgency badge color
  const getUrgencyBadge = (urgency) => {
    const colors = {
      'Normal': 'bg-gray-100 text-gray-800',
      'High': 'bg-orange-100 text-orange-800',
      'Critical': 'bg-red-100 text-red-800',
    };
    return colors[urgency] || 'bg-gray-100 text-gray-800';
  };

  // Handle assign ticket
  const handleAssignTicket = (ticketId) => {
    if (!assignAgent.trim()) {
      toast({ 
        title: 'Error', 
        description: 'Please enter an agent name',
        variant: 'destructive' 
      });
      return;
    }
    assignTicketMutation.mutate({ id: ticketId, assignedTo: assignAgent });
  };

  // Handle update ticket
  const handleUpdateTicket = (ticketId) => {
    const updates = {};
    if (newStatus) updates.status = newStatus;
    if (internalNotes.trim()) updates.internalNotes = internalNotes;
    
    if (Object.keys(updates).length === 0) {
      toast({ 
        title: 'Error', 
        description: 'Please provide updates to save',
        variant: 'destructive' 
      });
      return;
    }
    
    updateTicketMutation.mutate({ id: ticketId, updates });
  };

  // Handle resolve ticket
  const handleResolveTicket = (ticketId) => {
    resolveTicketMutation.mutate({ id: ticketId, internalNotes });
  };

  const stats = {
    total: tickets.length,
    new: tickets.filter(t => t.status === 'New').length,
    open: tickets.filter(t => t.status === 'Open').length,
    pending: tickets.filter(t => t.status === 'Pending').length,
    resolved: tickets.filter(t => t.status === 'Resolved').length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="mt-4">Loading support tickets...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && error.message.includes('Authentication required')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-white mb-8">
            <h1 className="text-4xl font-bold mb-4">Admin Access Required</h1>
            <p className="text-xl text-blue-100">
              You need to be authenticated to access the support dashboard
            </p>
          </div>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
              <p className="text-white/80 mb-6">
                This admin dashboard requires valid authentication credentials. 
                Please log in with your admin account to manage support tickets.
              </p>
              <Button 
                onClick={() => window.location.href = '/login'}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center text-white mb-8">
          <h1 className="text-4xl font-bold mb-4">Support Ticket Management</h1>
          <p className="text-xl text-blue-100">
            Manage customer support requests and team workflow
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-blue-100">Total Tickets</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{stats.new}</div>
              <div className="text-blue-100">New</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{stats.open}</div>
              <div className="text-blue-100">Open</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{stats.pending}</div>
              <div className="text-blue-100">Pending</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{stats.resolved}</div>
              <div className="text-blue-100">Resolved</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="bg-white/20 border-white/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">Urgency</label>
                <Select value={filterUrgency} onValueChange={setFilterUrgency}>
                  <SelectTrigger className="bg-white/20 border-white/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Urgency</SelectItem>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">Actions</label>
                <Button 
                  onClick={() => refetch()}
                  className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tickets List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">
              Support Tickets ({filteredTickets.length})
            </h2>
            {filteredTickets.length === 0 ? (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-white/50 mx-auto mb-4" />
                  <p className="text-white/70">No tickets found matching your criteria</p>
                </CardContent>
              </Card>
            ) : (
              filteredTickets.map((ticket) => (
                <Card 
                  key={ticket.id} 
                  className={`bg-white/10 backdrop-blur-sm border-white/20 cursor-pointer transition-all duration-200 ${
                    selectedTicket?.id === ticket.id ? 'ring-2 ring-white/50' : ''
                  }`}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">#{ticket.id}</h3>
                        <div className="flex gap-2 mt-2">
                          <Badge className={getStatusBadge(ticket.status)}>
                            {ticket.status}
                          </Badge>
                          <Badge className={getUrgencyBadge(ticket.urgency)}>
                            {ticket.urgency}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-white/70 text-sm">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-white/90">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{ticket.name}</span>
                        <span className="text-white/70">({ticket.role})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{ticket.email}</span>
                      </div>
                      {ticket.company && (
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          <span>{ticket.company}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-medium">{ticket.topic}</span>
                      </div>
                    </div>
                    
                    <p className="text-white/80 mt-3 line-clamp-2">
                      {ticket.message}
                    </p>
                    
                    {ticket.assignedTo && (
                      <div className="mt-3 flex items-center gap-2 text-green-300">
                        <UserPlus className="h-4 w-4" />
                        <span>Assigned to: {ticket.assignedTo}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Ticket Details and Actions */}
          {selectedTicket && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white mb-4">
                Ticket #{selectedTicket.id} Details
              </h2>
              
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-white/90">
                    <strong>Name:</strong> {selectedTicket.name} ({selectedTicket.role})
                  </div>
                  <div className="text-white/90">
                    <strong>Email:</strong> {selectedTicket.email}
                  </div>
                  {selectedTicket.company && (
                    <div className="text-white/90">
                      <strong>Company:</strong> {selectedTicket.company}
                    </div>
                  )}
                  <div className="text-white/90">
                    <strong>Topic:</strong> {selectedTicket.topic}
                  </div>
                  <div className="text-white/90">
                    <strong>Created:</strong> {new Date(selectedTicket.createdAt).toLocaleString()}
                  </div>
                  <div className="text-white/90">
                    <strong>Last Updated:</strong> {new Date(selectedTicket.updatedAt).toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/90 whitespace-pre-wrap">
                    {selectedTicket.message}
                  </p>
                </CardContent>
              </Card>

              {selectedTicket.internalNotes && (
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Internal Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/90 whitespace-pre-wrap">
                      {selectedTicket.internalNotes}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Assign Ticket */}
              {!selectedTicket.assignedTo && (
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Assign Ticket</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Enter support agent name"
                      value={assignAgent}
                      onChange={(e) => setAssignAgent(e.target.value)}
                      className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                    />
                    <Button 
                      onClick={() => handleAssignTicket(selectedTicket.id)}
                      disabled={assignTicketMutation.isPending}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Assign Ticket
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Update Ticket */}
              {selectedTicket.status !== 'Resolved' && (
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Update Ticket</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-white text-sm font-medium">Status</label>
                      <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger className="bg-white/20 border-white/30 text-white">
                          <SelectValue placeholder="Select new status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Open">Open</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-white text-sm font-medium">Internal Notes</label>
                      <Textarea
                        placeholder="Add internal notes for the support team..."
                        value={internalNotes}
                        onChange={(e) => setInternalNotes(e.target.value)}
                        className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                        rows={4}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleUpdateTicket(selectedTicket.id)}
                        disabled={updateTicketMutation.isPending}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Update Ticket
                      </Button>
                      <Button 
                        onClick={() => handleResolveTicket(selectedTicket.id)}
                        disabled={resolveTicketMutation.isPending}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Resolve Ticket
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {selectedTicket.status === 'Resolved' && (
                <Card className="bg-green-500/20 backdrop-blur-sm border-green-400/30">
                  <CardContent className="p-6 text-center">
                    <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Ticket Resolved
                    </h3>
                    <p className="text-green-100">
                      This ticket has been successfully resolved
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
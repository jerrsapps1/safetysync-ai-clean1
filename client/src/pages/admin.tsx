import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { AdminAccess } from "@/components/ui/admin-access";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  Mail, 
  Phone, 
  Building, 
  Calendar,
  TrendingUp,
  Download,
  Search,
  Filter,
  Eye,
  Trash2,
  UserPlus,
  BarChart3,
  Globe,
  Clock,
  CheckCircle,
  Home,
  Brain
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Lead {
  id: number;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message?: string;
  leadType: 'trial' | 'demo';
  createdAt: string;
}

interface User {
  id: number;
  email: string;
  name?: string;
  company?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

interface AdminStats {
  totalLeads: number;
  totalUsers: number;
  trialSignups: number;
  demoRequests: number;
  conversionRate: number;
  activeUsers: number;
}

export default function AdminPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<'all' | 'trial' | 'demo'>('all');
  const [hasAdminAccess, setHasAdminAccess] = useState(false);

  // Custom query function with admin authentication
  const adminQueryFn = async ({ queryKey }: { queryKey: string[] }) => {
    const adminKey = localStorage.getItem('admin_key');
    const res = await fetch(queryKey[0], {
      headers: adminKey ? { 'x-admin-key': adminKey } : {},
      credentials: "include",
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    return await res.json();
  };

  // Fetch leads
  const { data: leads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ['/api/leads'],
    queryFn: adminQueryFn,
    enabled: hasAdminAccess
  });

  // Fetch users
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['/api/admin/users'],
    queryFn: adminQueryFn,
    enabled: hasAdminAccess,
    retry: false
  });

  // Calculate stats
  const stats: AdminStats = {
    totalLeads: leads.length,
    totalUsers: users.length,
    trialSignups: leads.filter((lead: Lead) => lead.leadType === 'trial').length,
    demoRequests: leads.filter((lead: Lead) => lead.leadType === 'demo').length,
    conversionRate: leads.length > 0 ? (users.length / leads.length * 100) : 0,
    activeUsers: users.filter((user: User) => user.isActive).length
  };

  // Filter leads
  const filteredLeads = leads.filter((lead: Lead) => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesFilter = filterType === 'all' || lead.leadType === filterType;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLeadTypeColor = (type: string) => {
    return type === 'trial' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  const exportLeads = () => {
    const csvContent = [
      ['Name', 'Email', 'Company', 'Phone', 'Type', 'Date', 'Message'].join(','),
      ...filteredLeads.map((lead: Lead) => [
        lead.name,
        lead.email,
        lead.company || '',
        lead.phone || '',
        lead.leadType,
        formatDate(lead.createdAt),
        (lead.message || '').replace(/,/g, ';')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Show admin access form if not authenticated
  if (!hasAdminAccess) {
    return <AdminAccess onAccessGranted={() => setHasAdminAccess(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SafetySync.AI
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Link href="/testimonials">
                <Button variant="ghost" size="sm">Testimonials</Button>
              </Link>
              <Link href="/case-studies">
                <Button variant="ghost" size="sm">Case Studies</Button>
              </Link>
              <Link href="/pricing">
                <Button variant="ghost" size="sm">Pricing</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage leads, users, and platform analytics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Leads</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalLeads}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Trial Signups</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.trialSignups}</p>
                </div>
                <UserPlus className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Demo Requests</p>
                  <p className="text-3xl font-bold text-green-600">{stats.demoRequests}</p>
                </div>
                <Eye className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-3xl font-bold text-green-600">{stats.activeUsers}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.conversionRate.toFixed(1)}%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="leads" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="leads">Lead Management</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="space-y-6">
            {/* Lead Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Lead Management</CardTitle>
                    <CardDescription>
                      Manage trial signups and demo requests
                    </CardDescription>
                  </div>
                  <Button onClick={exportLeads} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Label htmlFor="search">Search Leads</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Search by name, email, or company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="filter">Filter by Type</Label>
                    <select
                      id="filter"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as 'all' | 'trial' | 'demo')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Leads</option>
                      <option value="trial">Trial Signups</option>
                      <option value="demo">Demo Requests</option>
                    </select>
                  </div>
                </div>

                {/* Leads Table */}
                <div className="space-y-4">
                  {leadsLoading ? (
                    <div className="text-center py-8">Loading leads...</div>
                  ) : filteredLeads.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No leads found</div>
                  ) : (
                    filteredLeads.map((lead: Lead) => (
                      <Card key={lead.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              {lead.leadType === 'trial' ? (
                                <UserPlus className="w-5 h-5 text-blue-600" />
                              ) : (
                                <Eye className="w-5 h-5 text-green-600" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{lead.name}</h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {lead.email}
                                </span>
                                {lead.company && (
                                  <span className="flex items-center gap-1">
                                    <Building className="w-3 h-3" />
                                    {lead.company}
                                  </span>
                                )}
                                {lead.phone && (
                                  <span className="flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    {lead.phone}
                                  </span>
                                )}
                              </div>
                              {lead.message && (
                                <p className="text-sm text-gray-600 mt-1 max-w-md truncate">
                                  {lead.message}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge className={getLeadTypeColor(lead.leadType)}>
                              {lead.leadType === 'trial' ? 'Trial Signup' : 'Demo Request'}
                            </Badge>
                            <div className="text-right">
                              <p className="text-sm font-medium">{formatDate(lead.createdAt)}</p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            {/* User Management */}
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage registered users and their accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="text-center py-8">Loading users...</div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No users found</div>
                ) : (
                  <div className="space-y-4">
                    {users.map((user: User) => (
                      <Card key={user.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{user.name || 'No name'}</h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {user.email}
                                </span>
                                {user.company && (
                                  <span className="flex items-center gap-1">
                                    <Building className="w-3 h-3" />
                                    {user.company}
                                  </span>
                                )}
                                {user.lastLoginAt && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Last login: {formatDate(user.lastLoginAt)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge className={user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <div className="text-right">
                              <p className="text-sm font-medium">Joined {formatDate(user.createdAt)}</p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Lead Conversion Funnel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Website Visitors</span>
                      <span className="font-bold">~1,250</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Trial Signups</span>
                      <span className="font-bold text-blue-600">{stats.trialSignups}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Demo Requests</span>
                      <span className="font-bold text-green-600">{stats.demoRequests}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Converted Users</span>
                      <span className="font-bold text-purple-600">{stats.totalUsers}</span>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Conversion Rate</span>
                        <span className="font-bold text-orange-600">{stats.conversionRate.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <UserPlus className="w-4 h-4 text-blue-600" />
                      <div className="text-sm">
                        <p className="font-medium">New trial signup</p>
                        <p className="text-gray-600">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Eye className="w-4 h-4 text-green-600" />
                      <div className="text-sm">
                        <p className="font-medium">Demo request submitted</p>
                        <p className="text-gray-600">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <Users className="w-4 h-4 text-purple-600" />
                      <div className="text-sm">
                        <p className="font-medium">User account created</p>
                        <p className="text-gray-600">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
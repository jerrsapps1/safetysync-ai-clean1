import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { AdminAccess } from "@/components/ui/admin-access";
import { AICloneDetector } from "@/components/ui/ai-clone-detector";
import HelpDeskManagement from "@/components/ui/help-desk-management";
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
  Brain,
  Shield,
  Ticket
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
  isAdmin: boolean;
  userTier: 'free_trial' | 'basic' | 'professional' | 'enterprise';
  subscriptionStatus: 'active' | 'expired' | 'cancelled' | 'pending';
  subscriptionExpiresAt?: string;
  totalLogins?: number;
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
  const [userFilter, setUserFilter] = useState<'all' | 'free_trial' | 'basic' | 'professional' | 'enterprise'>('all');
  const [subscriptionFilter, setSubscriptionFilter] = useState<'all' | 'active' | 'expired' | 'cancelled' | 'pending'>('all');

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

  // User management mutations
  const updateUserTierMutation = useMutation({
    mutationFn: async ({ userId, tier }: { userId: number; tier: string }) => {
      const adminKey = localStorage.getItem('admin_key');
      const response = await fetch(`/api/admin/users/${userId}/tier`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey || ''
        },
        body: JSON.stringify({ tier })
      });
      if (!response.ok) throw new Error('Failed to update user tier');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({ title: "User tier updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update user tier", variant: "destructive" });
    }
  });

  const updateSubscriptionMutation = useMutation({
    mutationFn: async ({ userId, status, expiresAt }: { userId: number; status: string; expiresAt?: string }) => {
      const adminKey = localStorage.getItem('admin_key');
      const response = await fetch(`/api/admin/users/${userId}/subscription`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey || ''
        },
        body: JSON.stringify({ status, expiresAt })
      });
      if (!response.ok) throw new Error('Failed to update subscription');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({ title: "Subscription updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update subscription", variant: "destructive" });
    }
  });

  const toggleUserActiveMutation = useMutation({
    mutationFn: async ({ userId, activate }: { userId: number; activate: boolean }) => {
      const adminKey = localStorage.getItem('admin_key');
      const endpoint = activate ? 'activate' : 'deactivate';
      const response = await fetch(`/api/admin/users/${userId}/${endpoint}`, {
        method: 'PUT',
        headers: {
          'x-admin-key': adminKey || ''
        }
      });
      if (!response.ok) throw new Error(`Failed to ${endpoint} user`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({ title: "User status updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update user status", variant: "destructive" });
    }
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

  // Enhanced user filtering
  const filteredUsers = users.filter((user: User) => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = userFilter === 'all' || user.userTier === userFilter;
    const matchesSubscription = subscriptionFilter === 'all' || user.subscriptionStatus === subscriptionFilter;
    
    return matchesSearch && matchesTier && matchesSubscription;
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
              <Link href="/admin-dashboard">
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Admin Analytics
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Link href="/industry-research">
                <Button variant="ghost" size="sm">Industry Research</Button>
              </Link>
              <Link href="/case-studies">
                <Button variant="ghost" size="sm">Case Studies</Button>
              </Link>
              <Link href="/pricing">
                <Button variant="ghost" size="sm">Pricing</Button>
              </Link>
              <Link href="/dns-management">
                <Button variant="ghost" size="sm">DNS Management</Button>
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="leads">Lead Management</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="help-desk">Help Desk</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="security">Platform Security</TabsTrigger>
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
                  Manage registered users, subscriptions, and account tiers
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* User Filters */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Tier:</label>
                    <select 
                      value={userFilter} 
                      onChange={(e) => setUserFilter(e.target.value as any)}
                      className="px-3 py-1 border rounded-md text-sm"
                    >
                      <option value="all">All Tiers</option>
                      <option value="free_trial">Free Trial</option>
                      <option value="basic">Basic</option>
                      <option value="professional">Professional</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Subscription:</label>
                    <select 
                      value={subscriptionFilter} 
                      onChange={(e) => setSubscriptionFilter(e.target.value as any)}
                      className="px-3 py-1 border rounded-md text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="expired">Expired</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {usersLoading ? (
                  <div className="text-center py-8">Loading users...</div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No users found</div>
                ) : (
                  <div className="space-y-4">
                    {filteredUsers.map((user: User) => (
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
                            {/* User Tier Badge */}
                            <Badge className={
                              user.userTier === 'enterprise' ? 'bg-purple-100 text-purple-800' :
                              user.userTier === 'professional' ? 'bg-blue-100 text-blue-800' :
                              user.userTier === 'basic' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }>
                              {user.userTier?.replace('_', ' ').toUpperCase() || 'FREE TRIAL'}
                            </Badge>

                            {/* Subscription Status Badge */}
                            <Badge className={
                              user.subscriptionStatus === 'active' ? 'bg-green-100 text-green-800' :
                              user.subscriptionStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              user.subscriptionStatus === 'expired' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {user.subscriptionStatus?.toUpperCase() || 'PENDING'}
                            </Badge>

                            {/* Active Status Badge */}
                            <Badge className={user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </Badge>

                            {/* Admin Controls */}
                            <div className="flex items-center gap-2">
                              {/* Tier Management */}
                              <select 
                                value={user.userTier || 'free_trial'} 
                                onChange={(e) => updateUserTierMutation.mutate({ userId: user.id, tier: e.target.value })}
                                className="px-2 py-1 border rounded text-xs"
                                disabled={updateUserTierMutation.isPending}
                              >
                                <option value="free_trial">Free Trial</option>
                                <option value="basic">Basic</option>
                                <option value="professional">Professional</option>
                                <option value="enterprise">Enterprise</option>
                              </select>

                              {/* Subscription Management */}
                              <select 
                                value={user.subscriptionStatus || 'pending'} 
                                onChange={(e) => updateSubscriptionMutation.mutate({ 
                                  userId: user.id, 
                                  status: e.target.value,
                                  expiresAt: e.target.value === 'active' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : undefined
                                })}
                                className="px-2 py-1 border rounded text-xs"
                                disabled={updateSubscriptionMutation.isPending}
                              >
                                <option value="pending">Pending</option>
                                <option value="active">Active</option>
                                <option value="expired">Expired</option>
                                <option value="cancelled">Cancelled</option>
                              </select>

                              {/* User Activation Toggle */}
                              <Button
                                size="sm"
                                variant={user.isActive ? "destructive" : "default"}
                                onClick={() => toggleUserActiveMutation.mutate({ userId: user.id, activate: !user.isActive })}
                                disabled={toggleUserActiveMutation.isPending}
                              >
                                {user.isActive ? 'Deactivate' : 'Activate'}
                              </Button>
                            </div>

                            <div className="text-right">
                              <p className="text-sm font-medium">Joined {formatDate(user.createdAt)}</p>
                              {user.subscriptionExpiresAt && (
                                <p className="text-xs text-gray-500">
                                  Expires: {formatDate(user.subscriptionExpiresAt)}
                                </p>
                              )}
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

          <TabsContent value="help-desk" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-blue-600" />
                  Help Desk Management
                </h3>
                <p className="text-gray-600">Manage SYNC AI escalations and customer support tickets</p>
              </div>
            </div>
            <HelpDeskManagement />
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

          {/* Platform Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Platform Security
                </h3>
                <p className="text-gray-600">Monitor website clone detection and platform security threats</p>
              </div>
            </div>
            <AICloneDetector 
              onScanComplete={(results) => {
                console.log('Clone detection scan completed:', results);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
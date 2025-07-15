import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Plus, 
  Edit, 
  Trash2, 
  FileText, 
  Award, 
  Calendar,
  Download,
  Upload,
  Search,
  Filter,
  Users,
  Building,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Eye,
  Mail,
  Phone,
  BarChart3,
  PieChart,
  Activity,
  Archive,
  RefreshCw,
  Settings,
  CheckSquare,
  Square
} from 'lucide-react';

interface Employee {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
  department?: string;
  division?: string;
  location?: string;
  status: 'active' | 'inactive' | 'terminated';
  hireDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface Certificate {
  id: number;
  certificateName: string;
  issueDate: Date;
  expirationDate: Date;
  certificateNumber: string;
  status: 'active' | 'expired' | 'expiring';
  employeeId: number;
}

interface TrainingSession {
  id: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  instructor: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  maxParticipants: number;
  currentParticipants: number;
}

export default function EmployeeManagement() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [newEmployee, setNewEmployee] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    division: '',
    location: '',
    status: 'active' as const,
    hireDate: new Date()
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch employees
  const { data: employees = [], isLoading: employeesLoading } = useQuery<Employee[]>({
    queryKey: ['/api/employees'],
    retry: false,
  });

  // Fetch certificates
  const { data: certificates = [] } = useQuery<Certificate[]>({
    queryKey: ['/api/certificates'],
    retry: false,
  });

  // Fetch training sessions
  const { data: trainingSessions = [] } = useQuery<TrainingSession[]>({
    queryKey: ['/api/training-sessions'],
    retry: false,
  });

  // Fetch upcoming training sessions
  const { data: upcomingTraining = [] } = useQuery<TrainingSession[]>({
    queryKey: ['/api/training-sessions/upcoming'],
    retry: false,
  });

  // Create employee mutation
  const createEmployeeMutation = useMutation({
    mutationFn: async (employeeData: any) => {
      const response = await apiRequest('POST', '/api/employees', employeeData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/employees'] });
      setShowAddDialog(false);
      setNewEmployee({
        employeeId: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        division: '',
        location: '',
        status: 'active',
        hireDate: new Date()
      });
      toast({
        title: 'Employee Added',
        description: 'New employee has been successfully added.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to add employee. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Update employee mutation
  const updateEmployeeMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      const response = await apiRequest('PUT', `/api/employees/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/employees'] });
      setShowEditDialog(false);
      setSelectedEmployee(null);
      toast({
        title: 'Employee Updated',
        description: 'Employee information has been successfully updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update employee. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Delete employee mutation
  const deleteEmployeeMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/employees/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/employees'] });
      toast({
        title: 'Employee Deleted',
        description: 'Employee has been successfully removed.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete employee. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Enhanced filtering and sorting
  const filteredEmployees = useMemo(() => {
    let filtered = employees.filter(emp => {
      const matchesSearch = `${emp.firstName} ${emp.lastName} ${emp.email} ${emp.employeeId} ${emp.position}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesDepartment = filterDepartment === 'all' || emp.department === filterDepartment;
      const matchesStatus = filterStatus === 'all' || emp.status === filterStatus;
      const matchesLocation = filterLocation === 'all' || emp.location === filterLocation;
      
      return matchesSearch && matchesDepartment && matchesStatus && matchesLocation;
    });

    // Sort results
    filtered.sort((a, b) => {
      let aValue = '';
      let bValue = '';
      
      switch (sortBy) {
        case 'name':
          aValue = `${a.firstName} ${a.lastName}`;
          bValue = `${b.firstName} ${b.lastName}`;
          break;
        case 'department':
          aValue = a.department || '';
          bValue = b.department || '';
          break;
        case 'position':
          aValue = a.position || '';
          bValue = b.position || '';
          break;
        case 'hireDate':
          aValue = a.hireDate.toISOString();
          bValue = b.hireDate.toISOString();
          break;
        default:
          aValue = a.firstName;
          bValue = b.firstName;
      }
      
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [employees, searchTerm, filterDepartment, filterStatus, filterLocation, sortBy, sortOrder]);

  // Get unique departments and locations
  const departments = [...new Set(employees.map(emp => emp.department).filter(Boolean))];
  const locations = [...new Set(employees.map(emp => emp.location).filter(Boolean))];

  // Enhanced employee statistics
  const activeEmployees = employees.filter(emp => emp.status === 'active').length;
  const inactiveEmployees = employees.filter(emp => emp.status === 'inactive').length;
  const totalCertificates = certificates.length;
  const expiringCertificates = certificates.filter(cert => {
    const daysDiff = Math.ceil((new Date(cert.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= 30 && daysDiff > 0;
  }).length;
  const expiredCertificates = certificates.filter(cert => cert.status === 'expired').length;
  const upcomingTrainingCount = trainingSessions.filter(session => session.status === 'scheduled').length;
  const completedTrainingCount = trainingSessions.filter(session => session.status === 'completed').length;

  // Department analytics
  const departmentStats = departments.map(dept => ({
    department: dept,
    employeeCount: employees.filter(emp => emp.department === dept).length,
    activeCount: employees.filter(emp => emp.department === dept && emp.status === 'active').length,
    certificateCount: certificates.filter(cert => 
      employees.find(emp => emp.id === cert.employeeId)?.department === dept
    ).length,
    complianceRate: employees.filter(emp => emp.department === dept).length > 0 ? 
      Math.round((employees.filter(emp => emp.department === dept && emp.status === 'active').length / 
      employees.filter(emp => emp.department === dept).length) * 100) : 0
  }));

  // Bulk actions
  const handleBulkStatusChange = (newStatus: 'active' | 'inactive') => {
    selectedEmployees.forEach(empId => {
      updateEmployeeMutation.mutate({ id: empId, updates: { status: newStatus } });
    });
    setSelectedEmployees([]);
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map(emp => emp.id));
    }
  };

  const handleSelectEmployee = (empId: number) => {
    setSelectedEmployees(prev => 
      prev.includes(empId) 
        ? prev.filter(id => id !== empId)
        : [...prev, empId]
    );
  };

  const handleAddEmployee = () => {
    createEmployeeMutation.mutate(newEmployee);
  };

  const handleUpdateEmployee = (updates: any) => {
    if (selectedEmployee) {
      updateEmployeeMutation.mutate({ id: selectedEmployee.id, updates });
    }
  };

  const handleDeleteEmployee = (id: number) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      deleteEmployeeMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      inactive: { variant: 'secondary' as const, icon: AlertCircle, color: 'text-yellow-600' },
      terminated: { variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon size={12} className={config.color} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (employeesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Statistics */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Advanced Employee Management</h1>
          <p className="text-gray-600">Comprehensive workforce management and compliance tracking</p>
        </div>
        <div className="flex gap-2">
          {selectedEmployees.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => setShowBulkActions(true)}>
              <Settings size={16} className="mr-2" />
              Bulk Actions ({selectedEmployees.length})
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Upload size={16} className="mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            Export
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
          >
            {viewMode === 'list' ? <BarChart3 size={16} className="mr-2" /> : <Users size={16} className="mr-2" />}
            {viewMode === 'list' ? 'Grid View' : 'List View'}
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus size={16} className="mr-2" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input
                    id="employeeId"
                    value={newEmployee.employeeId}
                    onChange={(e) => setNewEmployee({...newEmployee, employeeId: e.target.value})}
                    placeholder="EMP-001"
                  />
                </div>
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={newEmployee.firstName}
                    onChange={(e) => setNewEmployee({...newEmployee, firstName: e.target.value})}
                    placeholder="John"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={newEmployee.lastName}
                    onChange={(e) => setNewEmployee({...newEmployee, lastName: e.target.value})}
                    placeholder="Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                    placeholder="john.doe@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={newEmployee.position}
                    onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                    placeholder="Safety Coordinator"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={newEmployee.department}
                    onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                    placeholder="Safety"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newEmployee.location}
                    onChange={(e) => setNewEmployee({...newEmployee, location: e.target.value})}
                    placeholder="Main Office"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddEmployee} disabled={createEmployeeMutation.isPending}>
                  {createEmployeeMutation.isPending ? 'Adding...' : 'Add Employee'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Employees</p>
                <p className="text-2xl font-bold text-green-600">{activeEmployees}</p>
                <p className="text-xs text-gray-500">
                  {employees.length > 0 ? Math.round((activeEmployees / employees.length) * 100) : 0}% of total
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-gray-600">{inactiveEmployees}</p>
                <p className="text-xs text-gray-500">
                  {employees.length > 0 ? Math.round((inactiveEmployees / employees.length) * 100) : 0}% of total
                </p>
              </div>
              <Activity className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Certificates</p>
                <p className="text-2xl font-bold text-blue-600">{totalCertificates}</p>
                <p className="text-xs text-gray-500">
                  {employees.length > 0 ? Math.round(totalCertificates / employees.length * 10) / 10 : 0} per employee
                </p>
              </div>
              <Award className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-yellow-600">{expiringCertificates}</p>
                <p className="text-xs text-gray-500">Next 30 days</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expired</p>
                <p className="text-2xl font-bold text-red-600">{expiredCertificates}</p>
                <p className="text-xs text-gray-500">Need renewal</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Training Sessions</p>
                <p className="text-2xl font-bold text-purple-600">{upcomingTrainingCount}</p>
                <p className="text-xs text-gray-500">{completedTrainingCount} completed</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Search and Filter Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            {/* Main Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, ID, position, email, or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="department">Department</SelectItem>
                    <SelectItem value="position">Position</SelectItem>
                    <SelectItem value="hireDate">Hire Date</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                  <Filter size={16} className="mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterLocation} onValueChange={setFilterLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map(loc => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterDepartment('all');
                    setFilterStatus('all');
                    setFilterLocation('all');
                  }}
                >
                  <RefreshCw size={16} className="mr-2" />
                  Clear All
                </Button>
              </div>
            )}

            {/* Results Summary and Bulk Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {filteredEmployees.length} of {employees.length} employees
                  </span>
                </div>
                {filteredEmployees.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    {selectedEmployees.length === filteredEmployees.length ? (
                      <>
                        <Square size={16} className="mr-2" />
                        Deselect All
                      </>
                    ) : (
                      <>
                        <CheckSquare size={16} className="mr-2" />
                        Select All
                      </>
                    )}
                  </Button>
                )}
              </div>
              {selectedEmployees.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkStatusChange('active')}
                  >
                    <CheckCircle size={16} className="mr-2" />
                    Activate ({selectedEmployees.length})
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkStatusChange('inactive')}
                  >
                    <Archive size={16} className="mr-2" />
                    Deactivate ({selectedEmployees.length})
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Department Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Department Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departmentStats.map((dept) => (
              <Card key={dept.department} className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">{dept.department}</h3>
                    <Badge variant="outline">{dept.employeeCount} employees</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Active: {dept.activeCount}</span>
                      <span>Certificates: {dept.certificateCount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={dept.complianceRate} className="flex-1" />
                      <span className="text-xs text-gray-600">{dept.complianceRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Employee Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Employee Directory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="text-left p-4">Employee</th>
                  <th className="text-left p-4">Contact</th>
                  <th className="text-left p-4">Position</th>
                  <th className="text-left p-4">Department</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(employee.id)}
                        onChange={() => handleSelectEmployee(employee.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{employee.firstName} {employee.lastName}</div>
                          <div className="text-sm text-gray-500">{employee.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{employee.email}</div>
                      <div className="text-sm text-gray-500">{employee.phone}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{employee.position}</div>
                      <div className="text-sm text-gray-500">{employee.division}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1">
                        <Building size={14} className="text-gray-400" />
                        <span className="text-sm">{employee.department}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-500">{employee.location}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(employee.status)}
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setShowEditDialog(true);
                          }}
                        >
                          <Eye size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setShowEditDialog(true);
                          }}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEmployee(employee.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={14} />
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

      {/* Edit Employee Dialog */}
      {selectedEmployee && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Edit Employee - {selectedEmployee.firstName} {selectedEmployee.lastName}</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="certificates">Certificates</TabsTrigger>
                <TabsTrigger value="training">Training</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editEmployeeId">Employee ID</Label>
                    <Input
                      id="editEmployeeId"
                      defaultValue={selectedEmployee.employeeId}
                      onChange={(e) => setSelectedEmployee({...selectedEmployee, employeeId: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editFirstName">First Name</Label>
                    <Input
                      id="editFirstName"
                      defaultValue={selectedEmployee.firstName}
                      onChange={(e) => setSelectedEmployee({...selectedEmployee, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editLastName">Last Name</Label>
                    <Input
                      id="editLastName"
                      defaultValue={selectedEmployee.lastName}
                      onChange={(e) => setSelectedEmployee({...selectedEmployee, lastName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editEmail">Email</Label>
                    <Input
                      id="editEmail"
                      type="email"
                      defaultValue={selectedEmployee.email}
                      onChange={(e) => setSelectedEmployee({...selectedEmployee, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editPhone">Phone</Label>
                    <Input
                      id="editPhone"
                      defaultValue={selectedEmployee.phone}
                      onChange={(e) => setSelectedEmployee({...selectedEmployee, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editPosition">Position</Label>
                    <Input
                      id="editPosition"
                      defaultValue={selectedEmployee.position}
                      onChange={(e) => setSelectedEmployee({...selectedEmployee, position: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editDepartment">Department</Label>
                    <Input
                      id="editDepartment"
                      defaultValue={selectedEmployee.department}
                      onChange={(e) => setSelectedEmployee({...selectedEmployee, department: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editLocation">Location</Label>
                    <Input
                      id="editLocation"
                      defaultValue={selectedEmployee.location}
                      onChange={(e) => setSelectedEmployee({...selectedEmployee, location: e.target.value})}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="certificates" className="space-y-4">
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No Certificates Yet</h3>
                  <p className="text-gray-500">Certificates will appear here once assigned to this employee.</p>
                </div>
              </TabsContent>
              <TabsContent value="training" className="space-y-4">
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No Training Records</h3>
                  <p className="text-gray-500">Training history will appear here once employee completes training.</p>
                </div>
              </TabsContent>
            </Tabs>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => handleUpdateEmployee(selectedEmployee)} disabled={updateEmployeeMutation.isPending}>
                {updateEmployeeMutation.isPending ? 'Updating...' : 'Update Employee'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
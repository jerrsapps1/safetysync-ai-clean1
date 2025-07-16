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
  sessionName: string;
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
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
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

  // Excel download function
  const downloadExcel = () => {
    const csvContent = generateCSV(employees);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `SafetySync_All_Employees_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Download Started',
        description: 'Employee data is being downloaded as Excel file.',
      });
    }
  };

  // Generate CSV content
  const generateCSV = (employeeData: Employee[]) => {
    const headers = [
      'Employee ID',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Position',
      'Department',
      'Division',
      'Location',
      'Status',
      'Hire Date',
      'Created Date',
      'Updated Date'
    ];
    
    const csvRows = [headers.join(',')];
    
    employeeData.forEach(employee => {
      const row = [
        employee.employeeId,
        employee.firstName,
        employee.lastName,
        employee.email,
        employee.phone || '',
        employee.position || '',
        employee.department || '',
        employee.division || '',
        employee.location || '',
        employee.status,
        new Date(employee.hireDate).toLocaleDateString(),
        new Date(employee.createdAt).toLocaleDateString(),
        new Date(employee.updatedAt).toLocaleDateString()
      ];
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
  };

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

  // Enhanced filtering and sorting - only show employees when searched for
  const filteredAndSortedEmployees = useMemo(() => {
    // Return empty array if no search term is provided
    if (searchTerm.trim() === '') {
      return [];
    }
    
    let filtered = employees.filter(employee => {
      const matchesSearch = 
        employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
      const matchesStatus = filterStatus === 'all' || employee.status === filterStatus;
      const matchesLocation = filterLocation === 'all' || employee.location === filterLocation;
      
      return matchesSearch && matchesDepartment && matchesStatus && matchesLocation;
    });
    
    // Sort employees
    filtered.sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (sortBy) {
        case 'name':
          aVal = `${a.firstName} ${a.lastName}`;
          bVal = `${b.firstName} ${b.lastName}`;
          break;
        case 'department':
          aVal = a.department || '';
          bVal = b.department || '';
          break;
        case 'position':
          aVal = a.position || '';
          bVal = b.position || '';
          break;
        case 'hireDate':
          aVal = new Date(a.hireDate);
          bVal = new Date(b.hireDate);
          break;
        case 'location':
          aVal = a.location || '';
          bVal = b.location || '';
          break;
        default:
          aVal = a.firstName;
          bVal = b.firstName;
      }
      
      if (sortOrder === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });
    
    return filtered;
  }, [employees, searchTerm, filterDepartment, filterStatus, filterLocation, sortBy, sortOrder]);

  // Analytics calculations
  const analytics = useMemo(() => {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(emp => emp.status === 'active').length;
    const inactiveEmployees = employees.filter(emp => emp.status === 'inactive').length;
    const terminatedEmployees = employees.filter(emp => emp.status === 'terminated').length;
    
    const departments = [...new Set(employees.map(emp => emp.department).filter(Boolean))];
    const locations = [...new Set(employees.map(emp => emp.location).filter(Boolean))];
    
    const departmentStats = departments.map(dept => ({
      name: dept,
      count: employees.filter(emp => emp.department === dept).length,
      activeCount: employees.filter(emp => emp.department === dept && emp.status === 'active').length
    }));
    
    const locationStats = locations.map(loc => ({
      name: loc,
      count: employees.filter(emp => emp.location === loc).length,
      activeCount: employees.filter(emp => emp.location === loc && emp.status === 'active').length
    }));
    
    // Certificate analytics
    const activeCertificates = certificates.filter(cert => cert.status === 'active').length;
    const expiringCertificates = certificates.filter(cert => cert.status === 'expiring').length;
    const expiredCertificates = certificates.filter(cert => cert.status === 'expired').length;
    
    // Training analytics
    const upcomingTrainingCount = upcomingTraining.length;
    const completedTrainingCount = trainingSessions.filter(session => session.status === 'completed').length;
    
    return {
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      terminatedEmployees,
      activeRate: totalEmployees > 0 ? Math.round((activeEmployees / totalEmployees) * 100) : 0,
      departments,
      locations,
      departmentStats,
      locationStats,
      activeCertificates,
      expiringCertificates,
      expiredCertificates,
      upcomingTrainingCount,
      completedTrainingCount,
      certificationComplianceRate: totalEmployees > 0 ? Math.round((activeCertificates / totalEmployees) * 100) : 0
    };
  }, [employees, certificates, trainingSessions, upcomingTraining]);

  // Bulk actions
  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    selectedEmployees.forEach(employeeId => {
      updateEmployeeMutation.mutate({
        id: employeeId,
        updates: { status }
      });
    });
    setSelectedEmployees([]);
    setShowBulkActions(false);
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === filteredAndSortedEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredAndSortedEmployees.map(emp => emp.id));
    }
  };

  const handleEmployeeSelect = (employeeId: number) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  // Export functionality
  const handleExportEmployees = () => {
    const csvData = filteredAndSortedEmployees.map(emp => ({
      'Employee ID': emp.employeeId,
      'First Name': emp.firstName,
      'Last Name': emp.lastName,
      'Email': emp.email,
      'Phone': emp.phone || '',
      'Position': emp.position || '',
      'Department': emp.department || '',
      'Division': emp.division || '',
      'Location': emp.location || '',
      'Status': emp.status,
      'Hire Date': new Date(emp.hireDate).toLocaleDateString(),
      'Created Date': new Date(emp.createdAt).toLocaleDateString()
    }));
    
    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Export Complete',
      description: `${filteredAndSortedEmployees.length} employees exported successfully.`
    });
  };

  // Employee form handlers
  const handleAddEmployee = () => {
    createEmployeeMutation.mutate(newEmployee);
  };

  const handleUpdateEmployee = (updates: any) => {
    if (selectedEmployee) {
      updateEmployeeMutation.mutate({
        id: selectedEmployee.id,
        updates
      });
    }
  };

  const handleDeleteEmployee = (id: number) => {
    deleteEmployeeMutation.mutate(id);
  };

  // Get certificates for specific employee
  const getEmployeeCertificates = (employeeId: number) => {
    return certificates.filter(cert => cert.employeeId === employeeId);
  };

  // Get training sessions for specific employee
  const getEmployeeTraining = (employeeId: number) => {
    return trainingSessions.filter(session => 
      session.currentParticipants > 0 // Mock check - in real app would check enrollment
    );
  };

  if (employeesLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-gray-600 mt-1">Manage your workforce with comprehensive employee tracking and analytics</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => setShowAddDialog(true)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
          <Button 
            variant="outline"
            onClick={downloadExcel}
            className="bg-blue-50 hover:bg-blue-100 border-blue-300"
          >
            <Download className="w-4 h-4 mr-2" />
            Download All Employees
          </Button>
          <Button 
            variant="outline"
            onClick={handleExportEmployees}
            disabled={filteredAndSortedEmployees.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Search Results
          </Button>
          <Button 
            variant="outline"
            onClick={() => setShowBulkActions(!showBulkActions)}
          >
            <CheckSquare className="w-4 h-4 mr-2" />
            Bulk Actions
          </Button>
        </div>
      </div>

      {/* Tip Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>💡 Search to View Employees:</strong> Use the search bar below to find specific employees by name, ID, position, or department. To view all {analytics.totalEmployees} employees, use the "Download All Employees" button above.
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalEmployees}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Employees</p>
                <p className="text-2xl font-bold text-emerald-600">{analytics.activeEmployees}</p>
                <p className="text-xs text-gray-500">{analytics.activeRate}% active rate</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Departments</p>
                <p className="text-2xl font-bold text-purple-600">{analytics.departments.length}</p>
              </div>
              <Building className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Certification Rate</p>
                <p className="text-2xl font-bold text-orange-600">{analytics.certificationComplianceRate}%</p>
              </div>
              <Award className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions Panel */}
      {showBulkActions && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedEmployees.length === filteredAndSortedEmployees.length ? (
                    <>
                      <Square className="w-4 h-4 mr-2" />
                      Deselect All
                    </>
                  ) : (
                    <>
                      <CheckSquare className="w-4 h-4 mr-2" />
                      Select All
                    </>
                  )}
                </Button>
                <span className="text-sm text-gray-600">
                  {selectedEmployees.length} selected
                </span>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleBulkStatusChange('active')}
                  disabled={selectedEmployees.length === 0}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Activate
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleBulkStatusChange('inactive')}
                  disabled={selectedEmployees.length === 0}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Deactivate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search and Filter Employees</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search employees by name, email, ID, position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              {searchTerm && (
                <p className="text-sm text-gray-600 mt-2">
                  Searching for: "{searchTerm}" - Found {filteredAndSortedEmployees.length} results
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {analytics.departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
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
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {analytics.locations.map(loc => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="department">Department</SelectItem>
                  <SelectItem value="position">Position</SelectItem>
                  <SelectItem value="hireDate">Hire Date</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? 
                  <TrendingUp className="w-4 h-4" /> : 
                  <TrendingDown className="w-4 h-4" />
                }
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.length === filteredAndSortedEmployees.length && filteredAndSortedEmployees.length > 0}
                        onChange={handleSelectAll}
                        className="rounded"
                      />
                      Employee
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Position</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Department</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Location</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Hire Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAndSortedEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedEmployees.includes(employee.id)}
                          onChange={() => handleEmployeeSelect(employee.id)}
                          className="rounded"
                        />
                        <div>
                          <div className="font-medium text-gray-900">
                            {employee.firstName} {employee.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{employee.email}</div>
                          <div className="text-xs text-gray-400">ID: {employee.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{employee.position}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{employee.department}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{employee.location}</td>
                    <td className="px-4 py-3">
                      <Badge 
                        variant={employee.status === 'active' ? 'default' : 
                                employee.status === 'inactive' ? 'secondary' : 'destructive'}
                      >
                        {employee.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(employee.hireDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setShowEditDialog(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setShowEditDialog(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteEmployee(employee.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {searchTerm.trim() === '' ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Search for Employees</h3>
              <p className="text-gray-600">
                Use the search bar above to find specific employees by name, ID, position, or department.
              </p>
            </div>
          ) : filteredAndSortedEmployees.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No employees found matching your search criteria</p>
              <p className="text-sm text-gray-500 mt-2">Try adjusting your search term or filters</p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Department Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Department Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.departmentStats.map((dept) => (
              <div key={dept.name} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{dept.name}</span>
                    <span className="text-sm text-gray-500">{dept.activeCount}/{dept.count}</span>
                  </div>
                  <Progress 
                    value={dept.count > 0 ? (dept.activeCount / dept.count) * 100 : 0}
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Employee Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  value={newEmployee.employeeId}
                  onChange={(e) => setNewEmployee({...newEmployee, employeeId: e.target.value})}
                  placeholder="EMP-001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={newEmployee.firstName}
                  onChange={(e) => setNewEmployee({...newEmployee, firstName: e.target.value})}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={newEmployee.lastName}
                  onChange={(e) => setNewEmployee({...newEmployee, lastName: e.target.value})}
                  placeholder="Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                  placeholder="john.doe@company.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                  placeholder="555-0123"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={newEmployee.position}
                  onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                  placeholder="Safety Coordinator"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={newEmployee.department} onValueChange={(value) => setNewEmployee({...newEmployee, department: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {analytics.departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select value={newEmployee.location} onValueChange={(value) => setNewEmployee({...newEmployee, location: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {analytics.locations.map(loc => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEmployee} disabled={createEmployeeMutation.isPending}>
                {createEmployeeMutation.isPending ? 'Adding...' : 'Add Employee'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Employee Details: {selectedEmployee?.firstName} {selectedEmployee?.lastName}
            </DialogTitle>
          </DialogHeader>
          
          {selectedEmployee && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="certificates">Certificates</TabsTrigger>
                <TabsTrigger value="training">Training</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Employee ID</Label>
                    <Input value={selectedEmployee.employeeId} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={selectedEmployee.email} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={selectedEmployee.phone || ''} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Position</Label>
                    <Input value={selectedEmployee.position || ''} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Input value={selectedEmployee.department || ''} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input value={selectedEmployee.location || ''} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Hire Date</Label>
                    <Input value={new Date(selectedEmployee.hireDate).toLocaleDateString()} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Badge variant={selectedEmployee.status === 'active' ? 'default' : 'secondary'}>
                      {selectedEmployee.status}
                    </Badge>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="certificates" className="space-y-4">
                <div className="space-y-2">
                  {getEmployeeCertificates(selectedEmployee.id).map((cert) => (
                    <Card key={cert.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{cert.certificateName}</h4>
                            <p className="text-sm text-gray-600">
                              Certificate #{cert.certificateNumber}
                            </p>
                            <p className="text-sm text-gray-600">
                              Expires: {new Date(cert.expirationDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={cert.status === 'active' ? 'default' : 
                                          cert.status === 'expiring' ? 'destructive' : 'secondary'}>
                            {cert.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {getEmployeeCertificates(selectedEmployee.id).length === 0 && (
                    <div className="text-center py-8">
                      <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No certificates found for this employee</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="training" className="space-y-4">
                <div className="space-y-2">
                  {getEmployeeTraining(selectedEmployee.id).map((training) => (
                    <Card key={training.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{training.sessionName}</h4>
                            <p className="text-sm text-gray-600">{training.description}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(training.startDate).toLocaleDateString()} - {new Date(training.endDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              Location: {training.location}
                            </p>
                          </div>
                          <Badge variant={training.status === 'completed' ? 'default' : 'secondary'}>
                            {training.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {getEmployeeTraining(selectedEmployee.id).length === 0 && (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No training sessions found for this employee</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
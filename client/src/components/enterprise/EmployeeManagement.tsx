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
import { SafetySyncIcon } from '@/components/ui/safetysync-icon';
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
  Square,
  Brain,
  Shield
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
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
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

  // Excel download function - downloads filtered results
  const downloadFilteredExcel = () => {
    const dataToExport = filteredAndSortedEmployees;
    const csvContent = generateCSV(dataToExport);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      const filename = `SafetySync_Filtered_Employees_${new Date().toISOString().split('T')[0]}.csv`;
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Download Started',
        description: `${dataToExport.length} filtered employee records are being downloaded as Excel file.`,
      });
    }
  };

  // Excel download function - downloads all employees
  const downloadAllExcel = () => {
    const csvContent = generateCSV(employees);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      const filename = `SafetySync_All_Employees_${new Date().toISOString().split('T')[0]}.csv`;
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Download Started',
        description: `All ${employees.length} employee records are being downloaded as Excel file.`,
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

  // Enhanced filtering and sorting - only show employees when filters are applied
  const filteredAndSortedEmployees = useMemo(() => {
    // Only show employees if there's a search term OR a filter selection
    const hasSearchTerm = searchTerm.trim() !== '';
    const hasFilterSelection = filterDepartment !== '' || filterStatus !== '' || filterLocation !== '';
    
    if (!hasSearchTerm && !hasFilterSelection) {
      return [];
    }
    
    let filtered = employees.filter(employee => {
      // Search term filtering (only apply if search term exists)
      const matchesSearch = searchTerm.trim() === '' || 
        employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter dropdown filtering
      const matchesDepartment = filterDepartment === '' || employee.department === filterDepartment;
      const matchesStatus = filterStatus === '' || employee.status === filterStatus;
      const matchesLocation = filterLocation === '' || employee.location === filterLocation;
      
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
    const divisions = [...new Set(employees.map(emp => emp.division).filter(Boolean))];
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
      divisions,
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
    <div className="space-y-6 relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-6 rounded-lg">
      {/* Tech grid background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 opacity-20 rounded-lg"></div>
      
      {/* Floating tech icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 animate-float">
          <Users className="w-8 h-8 text-blue-400/30" />
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

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <SafetySyncIcon size={32} className="rounded-lg" />
            Employee Management
          </h1>
          <p className="text-gray-400 mt-1">Manage your workforce with comprehensive employee tracking and analytics</p>
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
            onClick={downloadAllExcel}
            className="bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/30 text-blue-300 hover:text-blue-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Download All Employees ({analytics.totalEmployees})
          </Button>
          {filteredAndSortedEmployees.length > 0 && (
            <Button 
              variant="outline"
              onClick={downloadFilteredExcel}
              className="bg-green-500/20 hover:bg-green-500/30 border-green-500/30 text-green-300 hover:text-green-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Filtered Results ({filteredAndSortedEmployees.length})
            </Button>
          )}
          <Button 
            variant="outline"
            onClick={() => setShowBulkActions(!showBulkActions)}
            className="bg-gray-500/20 hover:bg-gray-500/30 border-gray-500/30 text-gray-300 hover:text-gray-200"
          >
            <CheckSquare className="w-4 h-4 mr-2" />
            Bulk Actions
          </Button>
        </div>
      </div>

      {/* Tip Section */}
      <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm relative z-10">
        <p className="text-sm text-blue-300">
          <strong>💡 Instructions:</strong> Use the search bar and filters below to find specific employees. The "Download All Employees" button exports all {analytics.totalEmployees} employees, while the "Download Filtered Results" button (when visible) exports only your current search/filter results.
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Employees</p>
                <p className="text-2xl font-bold text-white">{analytics.totalEmployees}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Employees</p>
                <p className="text-2xl font-bold text-emerald-400">{analytics.activeEmployees}</p>
                <p className="text-xs text-gray-500">{analytics.activeRate}% active rate</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Departments</p>
                <p className="text-2xl font-bold text-purple-400">{analytics.departments.length}</p>
              </div>
              <Building className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Certification Rate</p>
                <p className="text-2xl font-bold text-orange-400">{analytics.certificationComplianceRate}%</p>
              </div>
              <Award className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions Panel */}
      {showBulkActions && (
        <Card className="border-blue-500/30 bg-blue-500/20 backdrop-blur-sm relative z-10">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSelectAll}
                  className="bg-gray-500/20 hover:bg-gray-500/30 border-gray-500/30 text-gray-300 hover:text-gray-200"
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
                <span className="text-sm text-gray-300">
                  {selectedEmployees.length} selected
                </span>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleBulkStatusChange('active')}
                  disabled={selectedEmployees.length === 0}
                  className="bg-green-500/20 hover:bg-green-500/30 border-green-500/30 text-green-300 hover:text-green-200"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Activate
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleBulkStatusChange('inactive')}
                  disabled={selectedEmployees.length === 0}
                  className="bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-300 hover:text-red-200"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Deactivate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="bg-black/20 backdrop-blur-sm border-gray-800 rounded-lg p-6 shadow-sm relative z-10">
        <h3 className="text-lg font-semibold mb-4 text-white">Search and Filter Employees</h3>
        
        {/* Search Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Search Employees
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, ID, position, or department..."
            className="w-full px-3 py-2 border border-gray-600 bg-black/30 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchTerm && (
            <p className="text-sm text-gray-400 mt-2">
              Searching for: "{searchTerm}" - Found {filteredAndSortedEmployees.length} results
            </p>
          )}
          {!searchTerm && filteredAndSortedEmployees.length === 0 && (
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-md p-3 mt-2 backdrop-blur-sm">
              <p className="text-sm text-blue-300">
                <strong>Instructions:</strong> To view employees, either:
                <br />• Enter a search term in the box above, OR
                <br />• Select a Department, Status, or Location from the filters below
                <br />• Use multiple filters together to narrow your results
              </p>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Department</label>
            <select 
              value={filterDepartment} 
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 bg-black/30 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Department</option>
              {analytics.departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 bg-black/30 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
            <select 
              value={filterLocation} 
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 bg-black/30 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Location</option>
              {analytics.locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Sort By</label>
            <div className="flex gap-2">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-600 bg-black/30 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Name</option>
                <option value="department">Department</option>
                <option value="position">Position</option>
                <option value="hireDate">Hire Date</option>
                <option value="location">Location</option>
              </select>
              <button 
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 border border-gray-600 bg-black/30 text-white rounded-md hover:bg-gray-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Employee List */}
      <Card className="bg-black/20 backdrop-blur-sm border-gray-800 relative z-10">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50 border-b border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
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
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Position</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Department</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Location</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Hire Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredAndSortedEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-800/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedEmployees.includes(employee.id)}
                          onChange={() => handleEmployeeSelect(employee.id)}
                          className="rounded"
                        />
                        <div>
                          <div className="font-medium text-white">
                            {employee.firstName} {employee.lastName}
                          </div>
                          <div className="text-sm text-gray-400">{employee.email}</div>
                          <div className="text-xs text-gray-500">ID: {employee.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">{employee.position}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{employee.department}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{employee.location}</td>
                    <td className="px-4 py-3">
                      <Badge 
                        variant={employee.status === 'active' ? 'default' : 
                                employee.status === 'inactive' ? 'secondary' : 'destructive'}
                      >
                        {employee.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
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
                          className="bg-gray-500/20 hover:bg-gray-500/30 border-gray-500/30 text-gray-300 hover:text-gray-200"
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
                          className="bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/30 text-blue-300 hover:text-blue-200"
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
      <Card className="bg-black/20 backdrop-blur-sm border-gray-800 relative z-10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            Department Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.departmentStats.map((dept) => (
              <div key={dept.name} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-300">{dept.name}</span>
                    <span className="text-sm text-gray-400">{dept.activeCount}/{dept.count}</span>
                  </div>
                  <Progress 
                    value={dept.count > 0 ? (dept.activeCount / dept.count) * 100 : 0}
                    className="h-2 bg-gray-700"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Employee Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl bg-gray-900/95 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Add New Employee</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId" className="text-gray-300">Employee ID</Label>
                <Input
                  id="employeeId"
                  value={newEmployee.employeeId}
                  onChange={(e) => setNewEmployee({...newEmployee, employeeId: e.target.value})}
                  placeholder="EMP-001"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                <Input
                  id="firstName"
                  value={newEmployee.firstName}
                  onChange={(e) => setNewEmployee({...newEmployee, firstName: e.target.value})}
                  placeholder="John"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                <Input
                  id="lastName"
                  value={newEmployee.lastName}
                  onChange={(e) => setNewEmployee({...newEmployee, lastName: e.target.value})}
                  placeholder="Doe"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                  placeholder="john.doe@company.com"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-300">Phone</Label>
                <Input
                  id="phone"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                  placeholder="555-0123"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position" className="text-gray-300">Position</Label>
                <Input
                  id="position"
                  value={newEmployee.position}
                  onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                  placeholder="Safety Coordinator"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department" className="text-gray-300">Department</Label>
                <Select value={newEmployee.department} onValueChange={(value) => setNewEmployee({...newEmployee, department: value})}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {analytics.departments.map(dept => (
                      <SelectItem key={dept} value={dept} className="text-white hover:bg-gray-700">{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="division" className="text-gray-300">Division</Label>
                <Select value={newEmployee.division} onValueChange={(value) => setNewEmployee({...newEmployee, division: value})}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select division" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {analytics.divisions.map(div => (
                      <SelectItem key={div} value={div} className="text-white hover:bg-gray-700">{div}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-300">Location</Label>
                <Select value={newEmployee.location} onValueChange={(value) => setNewEmployee({...newEmployee, location: value})}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {analytics.locations.map(loc => (
                      <SelectItem key={loc} value={loc} className="text-white hover:bg-gray-700">{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowAddDialog(false)}
                className="bg-gray-800 hover:bg-gray-700 border-gray-700 text-white"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddEmployee} 
                disabled={createEmployeeMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {createEmployeeMutation.isPending ? 'Adding...' : 'Add Employee'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl bg-gray-900/95 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">
              Employee Details: {selectedEmployee?.firstName} {selectedEmployee?.lastName}
            </DialogTitle>
          </DialogHeader>
          
          {selectedEmployee && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
                <TabsTrigger value="details" className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white">Details</TabsTrigger>
                <TabsTrigger value="certificates" className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white">Certificates</TabsTrigger>
                <TabsTrigger value="training" className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white">Training</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Employee ID</Label>
                    <Input value={selectedEmployee.employeeId} readOnly className="bg-gray-800 border-gray-700 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Email</Label>
                    <Input value={selectedEmployee.email} readOnly className="bg-gray-800 border-gray-700 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Phone</Label>
                    <Input value={selectedEmployee.phone || ''} readOnly className="bg-gray-800 border-gray-700 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Position</Label>
                    <Input value={selectedEmployee.position || ''} readOnly className="bg-gray-800 border-gray-700 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Department</Label>
                    <Input value={selectedEmployee.department || ''} readOnly className="bg-gray-800 border-gray-700 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Division</Label>
                    <Input value={selectedEmployee.division || ''} readOnly className="bg-gray-800 border-gray-700 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Location</Label>
                    <Input value={selectedEmployee.location || ''} readOnly className="bg-gray-800 border-gray-700 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Hire Date</Label>
                    <Input value={new Date(selectedEmployee.hireDate).toLocaleDateString()} readOnly className="bg-gray-800 border-gray-700 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Status</Label>
                    <Badge variant={selectedEmployee.status === 'active' ? 'default' : 'secondary'} className="bg-emerald-600 text-white">
                      {selectedEmployee.status}
                    </Badge>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="certificates" className="space-y-4">
                <div className="space-y-2">
                  {getEmployeeCertificates(selectedEmployee.id).map((cert) => (
                    <Card key={cert.id} className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-white">{cert.certificateName}</h4>
                            <p className="text-sm text-gray-300">
                              Certificate #{cert.certificateNumber}
                            </p>
                            <p className="text-sm text-gray-300">
                              Expires: {new Date(cert.expirationDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={cert.status === 'active' ? 'default' : 
                                          cert.status === 'expiring' ? 'destructive' : 'secondary'}
                                className="bg-emerald-600 text-white">
                            {cert.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {getEmployeeCertificates(selectedEmployee.id).length === 0 && (
                    <div className="text-center py-8">
                      <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No certificates found for this employee</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="training" className="space-y-4">
                <div className="space-y-2">
                  {getEmployeeTraining(selectedEmployee.id).map((training) => (
                    <Card key={training.id} className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-white">{training.sessionName}</h4>
                            <p className="text-sm text-gray-300">{training.description}</p>
                            <p className="text-sm text-gray-300">
                              {new Date(training.startDate).toLocaleDateString()} - {new Date(training.endDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-300">
                              Location: {training.location}
                            </p>
                          </div>
                          <Badge variant={training.status === 'completed' ? 'default' : 'secondary'}
                                className="bg-emerald-600 text-white">
                            {training.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {getEmployeeTraining(selectedEmployee.id).length === 0 && (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No training sessions found for this employee</p>
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
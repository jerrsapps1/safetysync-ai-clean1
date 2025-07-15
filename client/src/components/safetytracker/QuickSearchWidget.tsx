import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Users, MapPin, Clock, Phone, Mail, Eye, Award, Calendar, Building, AlertCircle, Grid, List, Table, BarChart3 } from 'lucide-react';

interface Employee {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  name?: string;
  department: string;
  position: string;
  status: 'active' | 'inactive' | 'training' | 'on-leave';
  email: string;
  phone: string;
  hireDate: string;
  location: string;
  trainingStatus: string;
  certificateCount?: number;
  expiringCertificates?: number;
  upcomingTraining?: number;
}

interface Certificate {
  id: number;
  certificateName: string;
  issueDate: string;
  expirationDate: string;
  status: 'active' | 'expired' | 'expiring';
  employeeId: number;
}

interface TrainingSession {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  employeeId: number;
}

// Enhanced mock data with 200 employees
const mockEmployees: Employee[] = Array.from({ length: 200 }, (_, i) => {
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Jennifer', 'William', 'Amy', 'James', 'Maria', 'Christopher', 'Michelle', 'Daniel', 'Patricia', 'Matthew', 'Linda', 'Anthony', 'Elizabeth', 'Mark', 'Barbara', 'Donald', 'Susan', 'Steven', 'Jessica', 'Paul', 'Nancy', 'Andrew', 'Dorothy', 'Joshua', 'Lisa', 'Kenneth', 'Karen', 'Kevin', 'Helen', 'Brian', 'Sandra', 'George', 'Donna', 'Edward', 'Carol', 'Ronald', 'Ruth', 'Timothy', 'Sharon', 'Jason', 'Michelle', 'Jeffrey', 'Laura', 'Ryan', 'Sarah', 'Jacob', 'Kimberly', 'Gary', 'Deborah', 'Nicholas', 'Dorothy', 'Eric', 'Lisa', 'Jonathan', 'Nancy', 'Stephen', 'Karen', 'Larry', 'Betty', 'Justin', 'Helen', 'Scott', 'Sandra', 'Brandon', 'Donna', 'Benjamin', 'Carol', 'Samuel', 'Ruth', 'Frank', 'Sharon', 'Raymond', 'Michelle', 'Alexander', 'Laura', 'Patrick', 'Sarah', 'Jack', 'Kimberly', 'Dennis', 'Deborah', 'Jerry', 'Dorothy', 'Tyler', 'Lisa', 'Aaron', 'Nancy', 'Jose', 'Karen', 'Henry', 'Betty', 'Adam', 'Helen', 'Douglas', 'Sandra', 'Nathan', 'Donna', 'Peter', 'Carol', 'Zachary', 'Ruth', 'Kyle', 'Sharon', 'Walter', 'Michelle', 'Harold', 'Laura', 'Carl', 'Sarah', 'Arthur', 'Kimberly', 'Gerald', 'Deborah', 'Wayne', 'Dorothy', 'Louis', 'Lisa', 'Ralph', 'Nancy', 'Roy', 'Karen', 'Eugene', 'Betty', 'Louis', 'Helen', 'Philip', 'Sandra', 'Bobby', 'Donna'];
  
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson', 'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes', 'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez'];
  
  const departments = ['Construction', 'Safety', 'Operations', 'Management', 'Quality', 'Environmental', 'HR', 'Engineering', 'Warehouse', 'Manufacturing', 'Maintenance', 'Security', 'Administration', 'Transportation', 'Procurement', 'IT', 'Finance', 'Customer Service', 'Sales', 'Marketing', 'Legal', 'Research', 'Documentation', 'Risk Management', 'Insurance'];
  
  const positions = ['Safety Manager', 'Site Supervisor', 'Construction Worker', 'Equipment Operator', 'Quality Inspector', 'Environmental Specialist', 'HR Coordinator', 'Project Engineer', 'Warehouse Associate', 'Machine Operator', 'Maintenance Technician', 'Security Guard', 'Administrative Assistant', 'Truck Driver', 'Procurement Specialist', 'IT Support', 'Financial Analyst', 'Customer Service Rep', 'Sales Representative', 'Marketing Coordinator', 'Legal Assistant', 'Research Analyst', 'Documentation Specialist', 'Risk Analyst', 'Insurance Coordinator'];
  
  const locations = ['Main Office', 'Construction Site A', 'Construction Site B', 'Warehouse 1', 'Warehouse 2', 'Manufacturing Plant', 'Field Office', 'Remote Location', 'Corporate HQ', 'Training Center'];
  
  const statuses: ('active' | 'inactive' | 'training' | 'on-leave')[] = ['active', 'inactive', 'training', 'on-leave'];
  
  const firstName = firstNames[i % firstNames.length];
  const lastName = lastNames[i % lastNames.length];
  
  return {
    id: i + 1,
    employeeId: `EMP-${(i + 1).toString().padStart(4, '0')}`,
    firstName,
    lastName,
    name: `${firstName} ${lastName}`,
    department: departments[i % departments.length],
    position: positions[i % positions.length],
    status: statuses[i % statuses.length],
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
    phone: `555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    hireDate: `202${Math.floor(Math.random() * 5)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    location: locations[i % locations.length],
    trainingStatus: ['Current', 'Expiring Soon', 'Needs Renewal', 'No Certificates'][i % 4],
    certificateCount: Math.floor(Math.random() * 8) + 1,
    expiringCertificates: Math.floor(Math.random() * 3),
    upcomingTraining: Math.floor(Math.random() * 4)
  };
});

const QuickSearchWidget = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'card' | 'list' | 'table' | 'analytics'>('card');

  // Fetch real data from API with fallback to mock data
  const { data: employees = [], isLoading: employeesLoading, error: employeesError } = useQuery<Employee[]>({
    queryKey: ['/api/employees'],
    retry: false,
  });

  const { data: certificates = [], error: certificatesError } = useQuery<Certificate[]>({
    queryKey: ['/api/certificates'],
    retry: false,
  });

  const { data: trainingSessions = [], error: trainingError } = useQuery<TrainingSession[]>({
    queryKey: ['/api/training-sessions'],
    retry: false,
  });

  // Use mock data if API fails (for demonstration purposes)
  const actualEmployees = employeesError || employees.length === 0 ? mockEmployees : employees;
  const actualCertificates = certificatesError ? [] : certificates;
  const actualTrainingSessions = trainingError ? [] : trainingSessions;

  // Helper function to determine training status
  const getEmployeeTrainingStatus = (employeeId: number) => {
    const empCerts = actualCertificates.filter(cert => cert.employeeId === employeeId);
    if (empCerts.length === 0) return 'No Certificates';
    
    const expiring = empCerts.some(cert => cert.status === 'expiring');
    const expired = empCerts.some(cert => cert.status === 'expired');
    
    if (expired) return 'Needs Renewal';
    if (expiring) return 'Expiring Soon';
    return 'Current';
  };

  // Process employee data to include computed name and enhanced info
  const processedEmployees = actualEmployees.map(emp => ({
    ...emp,
    name: emp.name || `${emp.firstName} ${emp.lastName}`,
    employeeId: emp.employeeId || `EMP-${emp.id}`,
    trainingStatus: getEmployeeTrainingStatus(emp.id),
    certificateCount: actualCertificates.filter(cert => cert.employeeId === emp.id).length,
    expiringCertificates: actualCertificates.filter(cert => 
      cert.employeeId === emp.id && cert.status === 'expiring'
    ).length,
    upcomingTraining: actualTrainingSessions.filter(session => 
      session.employeeId === emp.id && session.status === 'scheduled'
    ).length
  }));

  // Get unique departments from processed data
  const departments = ['all', ...new Set(actualEmployees.map(emp => emp.department).filter(Boolean))];
  const statuses = ['all', 'active', 'inactive', 'training', 'on-leave'];

  // Enhanced filtering and sorting
  const filteredEmployees = React.useMemo(() => {
    // Only show results when user starts typing
    if (!searchTerm || searchTerm.trim() === '') {
      return [];
    }

    let filtered = processedEmployees;

    // Filter by search term
    filtered = filtered.filter(employee => 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply department filter
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(employee => employee.department === selectedDepartment);
    }

    // Apply status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(employee => employee.status === selectedStatus);
    }

    // Sort results
    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof Employee];
      let bValue = b[sortBy as keyof Employee];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [processedEmployees, searchTerm, selectedDepartment, selectedStatus, sortBy, sortOrder]);

  // Helper functions for status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      case 'training': return 'bg-blue-100 text-blue-700';
      case 'on-leave': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTrainingStatusColor = (status: string) => {
    switch (status) {
      case 'Current': return 'bg-green-100 text-green-700';
      case 'Expiring Soon': return 'bg-yellow-100 text-yellow-700';
      case 'Needs Renewal': return 'bg-red-100 text-red-700';
      case 'No Certificates': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Individual render functions for each view mode
  const renderCardView = () => (
    <div className="space-y-2 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      {filteredEmployees.map(employee => (
        <Card key={employee.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {employee.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h4 className="font-semibold">{employee.name}</h4>
                <p className="text-sm text-gray-600">{employee.position} • {employee.department}</p>
                <p className="text-xs text-gray-500">ID: {employee.employeeId}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={getStatusColor(employee.status)}>
                {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
              </Badge>
              <Badge className={getTrainingStatusColor(employee.trainingStatus)}>
                {employee.trainingStatus}
              </Badge>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {employee.email}
            </div>
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {employee.phone}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {employee.location}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Hired {employee.hireDate}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-1 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      {filteredEmployees.map(employee => (
        <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">
                {employee.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h4 className="font-medium">{employee.name}</h4>
              <p className="text-sm text-gray-600">{employee.position} • {employee.department}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(employee.status)}>
              {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
            </Badge>
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 text-left">Employee</th>
            <th className="p-2 text-left">Position</th>
            <th className="p-2 text-left">Department</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Training</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map(employee => (
            <tr key={employee.id} className="border-b hover:bg-gray-50">
              <td className="p-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-xs">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-xs text-gray-500">{employee.employeeId}</p>
                  </div>
                </div>
              </td>
              <td className="p-2">{employee.position}</td>
              <td className="p-2">{employee.department}</td>
              <td className="p-2">
                <Badge className={getStatusColor(employee.status)}>
                  {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                </Badge>
              </td>
              <td className="p-2">
                <Badge className={getTrainingStatusColor(employee.trainingStatus)}>
                  {employee.trainingStatus}
                </Badge>
              </td>
              <td className="p-2">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderAnalyticsView = () => {
    const departmentCounts = filteredEmployees.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusCounts = filteredEmployees.reduce((acc, emp) => {
      acc[emp.status] = (acc[emp.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const trainingStatusCounts = filteredEmployees.reduce((acc, emp) => {
      acc[emp.trainingStatus] = (acc[emp.trainingStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <h4 className="font-semibold mb-2">Department Distribution</h4>
            <div className="space-y-2">
              {Object.entries(departmentCounts).map(([dept, count]) => (
                <div key={dept} className="flex justify-between items-center">
                  <span className="text-sm">{dept}</span>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
            </div>
          </Card>
          
          <Card className="p-4">
            <h4 className="font-semibold mb-2">Status Distribution</h4>
            <div className="space-y-2">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="flex justify-between items-center">
                  <span className="text-sm">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                  <Badge className={getStatusColor(status)}>{count}</Badge>
                </div>
              ))}
            </div>
          </Card>
          
          <Card className="p-4">
            <h4 className="font-semibold mb-2">Training Status</h4>
            <div className="space-y-2">
              {Object.entries(trainingStatusCounts).map(([status, count]) => (
                <div key={status} className="flex justify-between items-center">
                  <span className="text-sm">{status}</span>
                  <Badge className={getTrainingStatusColor(status)}>{count}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Search Results Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{filteredEmployees.length}</div>
              <div className="text-sm text-gray-600">Total Results</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {filteredEmployees.filter(emp => emp.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredEmployees.filter(emp => emp.trainingStatus === 'Expiring Soon').length}
              </div>
              <div className="text-sm text-gray-600">Expiring Soon</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {filteredEmployees.filter(emp => emp.trainingStatus === 'Needs Renewal').length}
              </div>
              <div className="text-sm text-gray-600">Needs Renewal</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Adaptive Results Rendering Function
  const renderResults = () => {
    if (filteredEmployees.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>No employees found matching your search criteria</p>
        </div>
      );
    }

    switch (viewMode) {
      case 'card':
        return renderCardView();
      case 'list':
        return renderListView();
      case 'table':
        return renderTableView();
      case 'analytics':
        return renderAnalyticsView();
      default:
        return renderCardView();
    }
  };

  if (employeesLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Employee Quick Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Employee Quick Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Enhanced Search Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-2">
              <Input
                placeholder="Search by name, ID, position, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort and Filter Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {filteredEmployees.length} employees found
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
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
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* View Mode Controls */}
              <div className="flex items-center border rounded-lg">
                <Button
                  variant={viewMode === 'card' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('card')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-none"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="rounded-none"
                >
                  <Table className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'analytics' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('analytics')}
                  className="rounded-l-none"
                >
                  <BarChart3 className="w-4 h-4" />
                </Button>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </div>

          {/* Adaptive Results Visualization */}
          <div className="overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {renderResults()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickSearchWidget;
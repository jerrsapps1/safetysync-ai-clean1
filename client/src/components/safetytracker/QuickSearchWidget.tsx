import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Users, MapPin, Clock, Phone, Mail, Eye, Award, Calendar, Building, AlertCircle } from 'lucide-react';

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

const mockEmployees: Employee[] = [
  {
    id: 1,
    name: 'John Smith',
    department: 'Construction',
    position: 'Site Supervisor',
    status: 'active',
    email: 'john.smith@company.com',
    phone: '(555) 123-4567',
    hireDate: '2023-01-15',
    location: 'Site A',
    trainingStatus: 'Current'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    department: 'Safety',
    position: 'Safety Coordinator',
    status: 'active',
    email: 'sarah.j@company.com',
    phone: '(555) 234-5678',
    hireDate: '2022-08-20',
    location: 'Office',
    trainingStatus: 'Needs Renewal'
  },
  {
    id: 3,
    name: 'Mike Rodriguez',
    department: 'Operations',
    position: 'Equipment Operator',
    status: 'training',
    email: 'mike.r@company.com',
    phone: '(555) 345-6789',
    hireDate: '2023-03-10',
    location: 'Site B',
    trainingStatus: 'In Progress'
  },
  {
    id: 4,
    name: 'Lisa Chen',
    department: 'Management',
    position: 'Project Manager',
    status: 'active',
    email: 'lisa.chen@company.com',
    phone: '(555) 456-7890',
    hireDate: '2021-11-05',
    location: 'Office',
    trainingStatus: 'Current'
  },
  {
    id: 5,
    name: 'David Wilson',
    department: 'Quality',
    position: 'Quality Inspector',
    status: 'on-leave',
    email: 'david.w@company.com',
    phone: '(555) 567-8901',
    hireDate: '2023-02-28',
    location: 'Site A',
    trainingStatus: 'Pending'
  }
];

const QuickSearchWidget: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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
  const actualEmployees = employeesError ? mockEmployees : employees;
  const actualCertificates = certificatesError ? [] : certificates;
  const actualTrainingSessions = trainingError ? [] : trainingSessions;

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

  // Enhanced filtering and sorting
  const filteredEmployees = React.useMemo(() => {
    let filtered = processedEmployees;

    if (searchTerm) {
      filtered = filtered.filter(employee => 
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(employee => employee.department === selectedDepartment);
    }

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
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [processedEmployees, searchTerm, selectedDepartment, selectedStatus, sortBy, sortOrder]);

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
      case 'Needs Renewal': return 'bg-red-100 text-red-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
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
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>

          {/* Results */}
          <div className="space-y-2 overflow-y-auto max-h-96 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedEmployee(employee)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Employee Details - {employee.name}</DialogTitle>
                        </DialogHeader>
                        <Tabs defaultValue="overview" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="certificates">Certificates</TabsTrigger>
                            <TabsTrigger value="training">Training</TabsTrigger>
                          </TabsList>
                          <TabsContent value="overview" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-500">Employee ID</label>
                                <p className="text-sm">{employee.employeeId}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Status</label>
                                <div className="mt-1">
                                  <Badge className={getStatusColor(employee.status)}>
                                    {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                                  </Badge>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Department</label>
                                <p className="text-sm">{employee.department}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Position</label>
                                <p className="text-sm">{employee.position}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Email</label>
                                <p className="text-sm">{employee.email}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Phone</label>
                                <p className="text-sm">{employee.phone}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Location</label>
                                <p className="text-sm">{employee.location}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Hire Date</label>
                                <p className="text-sm">{employee.hireDate}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                  <Award className="w-4 h-4 text-green-600" />
                                  <span className="text-sm font-medium">Certificates</span>
                                </div>
                                <p className="text-2xl font-bold">{employee.certificateCount || 0}</p>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                                  <span className="text-sm font-medium">Expiring</span>
                                </div>
                                <p className="text-2xl font-bold">{employee.expiringCertificates || 0}</p>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                  <Calendar className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm font-medium">Training</span>
                                </div>
                                <p className="text-2xl font-bold">{employee.upcomingTraining || 0}</p>
                              </div>
                            </div>
                          </TabsContent>
                          <TabsContent value="certificates">
                            <div className="space-y-2">
                              {actualCertificates.filter(cert => cert.employeeId === employee.id).map(cert => (
                                <Card key={cert.id} className="p-3">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h4 className="font-medium">{cert.certificateName}</h4>
                                      <p className="text-sm text-gray-600">Expires: {cert.expirationDate}</p>
                                    </div>
                                    <Badge 
                                      className={
                                        cert.status === 'active' ? 'bg-green-100 text-green-700' :
                                        cert.status === 'expiring' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                      }
                                    >
                                      {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                                    </Badge>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </TabsContent>
                          <TabsContent value="training">
                            <div className="space-y-2">
                              {actualTrainingSessions.filter(session => session.employeeId === employee.id).map(session => (
                                <Card key={session.id} className="p-3">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h4 className="font-medium">{session.title}</h4>
                                      <p className="text-sm text-gray-600">{session.startDate} - {session.endDate}</p>
                                    </div>
                                    <Badge 
                                      className={
                                        session.status === 'completed' ? 'bg-green-100 text-green-700' :
                                        session.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                        'bg-gray-100 text-gray-700'
                                      }
                                    >
                                      {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                                    </Badge>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </TabsContent>
                        </Tabs>
                      </DialogContent>
                    </Dialog>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickSearchWidget;
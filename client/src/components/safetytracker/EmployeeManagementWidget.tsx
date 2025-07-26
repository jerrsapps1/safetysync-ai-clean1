import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Plus, Edit, Eye, Download, Upload, Calendar, Award, AlertTriangle, CheckCircle } from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  hireDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  location: string;
  certifications: {
    name: string;
    status: 'current' | 'expired' | 'expiring';
    expirationDate: string;
  }[];
  trainingCompleted: number;
  trainingRequired: number;
}

const mockEmployees: Employee[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@company.com',
    department: 'Construction',
    position: 'Site Supervisor',
    hireDate: '2023-01-15',
    status: 'active',
    location: 'Site A',
    certifications: [
      { name: 'Fall Protection', status: 'current', expirationDate: '2025-01-15' },
      { name: 'OSHA 30', status: 'current', expirationDate: '2025-06-20' },
      { name: 'First Aid/CPR', status: 'expiring', expirationDate: '2025-07-30' }
    ],
    trainingCompleted: 8,
    trainingRequired: 10
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@company.com',
    department: 'Safety',
    position: 'Safety Coordinator',
    hireDate: '2022-08-20',
    status: 'active',
    location: 'Office',
    certifications: [
      { name: 'OSHA 30', status: 'current', expirationDate: '2025-03-15' },
      { name: 'Confined Space', status: 'current', expirationDate: '2025-12-10' },
      { name: 'Fall Protection', status: 'expired', expirationDate: '2024-11-05' }
    ],
    trainingCompleted: 12,
    trainingRequired: 12
  },
  {
    id: 3,
    name: 'Mike Rodriguez',
    email: 'mike.r@company.com',
    department: 'Operations',
    position: 'Equipment Operator',
    hireDate: '2023-03-10',
    status: 'active',
    location: 'Site B',
    certifications: [
      { name: 'Forklift Operation', status: 'current', expirationDate: '2025-05-15' },
      { name: 'OSHA 10', status: 'current', expirationDate: '2025-09-20' },
      { name: 'Equipment Maintenance', status: 'expiring', expirationDate: '2025-08-05' }
    ],
    trainingCompleted: 6,
    trainingRequired: 8
  }
];

const EmployeeManagementWidget: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const departments = ['all', 'Construction', 'Safety', 'Operations', 'Management'];
  const statuses = ['all', 'active', 'inactive', 'on-leave'];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || employee.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-blue-100 text-blue-600';
      case 'on-leave': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-blue-100 text-blue-600';
    }
  };

  const getCertificationStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-green-100 text-green-700';
      case 'expired': return 'bg-red-100 text-red-700';
      case 'expiring': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-blue-100 text-blue-600';
    }
  };

  const getComplianceScore = (employee: Employee) => {
    const currentCerts = employee.certifications.filter(cert => cert.status === 'current').length;
    const totalCerts = employee.certifications.length;
    const trainingScore = (employee.trainingCompleted / employee.trainingRequired) * 100;
    const certScore = (currentCerts / totalCerts) * 100;
    return Math.round((trainingScore + certScore) / 2);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Employee Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="certifications">Certifications</TabsTrigger>
              <TabsTrigger value="training">Training</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="md:w-48">
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
                  <SelectTrigger className="md:w-48">
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
                <Button className="bg-emerald-500 hover:bg-emerald-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Employee
                </Button>
              </div>

              <div className="grid gap-4">
                {filteredEmployees.map(employee => (
                  <Card key={employee.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{employee.name}</h4>
                          <p className="text-sm text-blue-500">{employee.position} • {employee.department}</p>
                          <p className="text-sm text-blue-400">{employee.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <div className="text-lg font-semibold">{getComplianceScore(employee)}%</div>
                          <div className="text-xs text-blue-400">Compliance</div>
                        </div>
                        <Badge className={getStatusColor(employee.status)}>
                          {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                        </Badge>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="certifications" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Certification Status</h3>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
              
              <div className="grid gap-4">
                {filteredEmployees.map(employee => (
                  <Card key={employee.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">{employee.name}</h4>
                          <p className="text-sm text-blue-500">{employee.department}</p>
                        </div>
                        <Badge className={getComplianceScore(employee) >= 90 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                          {employee.certifications.filter(cert => cert.status === 'current').length}/{employee.certifications.length} Current
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {employee.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              {cert.status === 'current' && <CheckCircle className="w-4 h-4 text-green-500" />}
                              {cert.status === 'expired' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                              {cert.status === 'expiring' && <Calendar className="w-4 h-4 text-yellow-500" />}
                              <span className="text-sm font-medium">{cert.name}</span>
                            </div>
                            <Badge className={getCertificationStatusColor(cert.status)}>
                              {cert.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="training" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Training Progress</h3>
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Training
                </Button>
              </div>
              
              <div className="grid gap-4">
                {filteredEmployees.map(employee => (
                  <Card key={employee.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{employee.name}</h4>
                          <p className="text-sm text-blue-500">{employee.department}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">
                            {employee.trainingCompleted}/{employee.trainingRequired}
                          </div>
                          <div className="text-sm text-blue-400">Training Complete</div>
                        </div>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(employee.trainingCompleted / employee.trainingRequired) * 100}%` }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full justify-start" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export Employee List
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Import Employees
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Award className="w-4 h-4 mr-2" />
                      Generate Certificates
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-blue-500">Total Employees</span>
                        <span className="font-semibold">{employees.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-500">Active</span>
                        <span className="font-semibold">{employees.filter(e => e.status === 'active').length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-500">Avg. Compliance</span>
                        <span className="font-semibold">
                          {Math.round(employees.reduce((acc, emp) => acc + getComplianceScore(emp), 0) / employees.length)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeManagementWidget;
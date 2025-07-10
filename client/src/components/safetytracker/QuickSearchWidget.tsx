import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Users, MapPin, Clock, Phone, Mail, Eye } from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  department: string;
  position: string;
  status: 'active' | 'inactive' | 'training' | 'on-leave';
  email: string;
  phone: string;
  hireDate: string;
  location: string;
  trainingStatus: string;
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
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(mockEmployees);

  const departments = ['all', 'Construction', 'Safety', 'Operations', 'Management', 'Quality'];
  const statuses = ['all', 'active', 'inactive', 'training', 'on-leave'];

  const handleSearch = () => {
    let filtered = mockEmployees;

    if (searchTerm) {
      filtered = filtered.filter(employee => 
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(employee => employee.department === selectedDepartment);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(employee => employee.status === selectedStatus);
    }

    setFilteredEmployees(filtered);
  };

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

  React.useEffect(() => {
    handleSearch();
  }, [searchTerm, selectedDepartment, selectedStatus]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Quick Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-2">
              <Input
                placeholder="Search by name, position, or email..."
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

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {filteredEmployees.length} employees found
              </span>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>

          <div className="space-y-2">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickSearchWidget;
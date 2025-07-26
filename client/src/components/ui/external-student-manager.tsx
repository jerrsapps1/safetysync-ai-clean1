import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  UserPlus, 
  Edit, 
  Trash2, 
  Search,
  Users,
  Building,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Plus,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface ExternalStudent {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  company: string;
  position: string | null;
  department: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface InsertExternalStudent {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company: string;
  position?: string;
  department?: string;
}

interface ExternalStudentManagerProps {
  onSelectStudent?: (student: ExternalStudent) => void;
  selectedStudents?: ExternalStudent[];
  className?: string;
}

export function ExternalStudentManager({ 
  onSelectStudent, 
  selectedStudents = [], 
  className = "" 
}: ExternalStudentManagerProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingStudent, setEditingStudent] = useState<ExternalStudent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newStudent, setNewStudent] = useState<InsertExternalStudent>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    department: ''
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch external students
  const { data: students = [], isLoading } = useQuery({
    queryKey: ['/api/external-students'],
    queryFn: async () => {
      const response = await fetch('/api/external-students', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch external students');
      return response.json();
    }
  });

  // Search students
  const { data: searchResults = [] } = useQuery({
    queryKey: ['/api/external-students/search', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      const response = await fetch(`/api/external-students/search?q=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to search external students');
      return response.json();
    },
    enabled: searchQuery.trim().length > 0
  });

  // Create student mutation
  const createStudentMutation = useMutation({
    mutationFn: async (studentData: InsertExternalStudent) => {
      return await apiRequest('/api/external-students', 'POST', studentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/external-students'] });
      setShowAddDialog(false);
      resetForm();
      toast({
        title: "Success",
        description: "External student created successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create external student",
        variant: "destructive"
      });
    }
  });

  // Update student mutation
  const updateStudentMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<ExternalStudent>) => {
      return await apiRequest(`/api/external-students/${id}`, 'PUT', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/external-students'] });
      setEditingStudent(null);
      resetForm();
      toast({
        title: "Success",
        description: "External student updated successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update external student",
        variant: "destructive"
      });
    }
  });

  // Delete student mutation
  const deleteStudentMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/external-students/${id}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/external-students'] });
      toast({
        title: "Success",
        description: "External student deleted successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete external student",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setNewStudent({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      department: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      updateStudentMutation.mutate({ id: editingStudent.id, ...newStudent });
    } else {
      createStudentMutation.mutate(newStudent);
    }
  };

  const handleEdit = (student: ExternalStudent) => {
    setEditingStudent(student);
    setNewStudent({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone || '',
      company: student.company,
      position: student.position || '',
      department: student.department || ''
    });
    setShowAddDialog(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this external student?')) {
      deleteStudentMutation.mutate(id);
    }
  };

  const displayStudents = searchQuery.trim() ? searchResults : students;

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              External Students ({students.length})
            </span>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingStudent(null); resetForm(); }}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add External Student
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingStudent ? 'Edit External Student' : 'Add External Student'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={newStudent.firstName}
                        onChange={(e) => setNewStudent(prev => ({ ...prev, firstName: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={newStudent.lastName}
                        onChange={(e) => setNewStudent(prev => ({ ...prev, lastName: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newStudent.phone}
                      onChange={(e) => setNewStudent(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="company">Company *</Label>
                    <Input
                      id="company"
                      value={newStudent.company}
                      onChange={(e) => setNewStudent(prev => ({ ...prev, company: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={newStudent.position}
                      onChange={(e) => setNewStudent(prev => ({ ...prev, position: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={newStudent.department}
                      onChange={(e) => setNewStudent(prev => ({ ...prev, department: e.target.value }))}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button type="submit" disabled={createStudentMutation.isPending || updateStudentMutation.isPending}>
                      {editingStudent ? 'Update' : 'Create'} Student
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription>
            Manage external students for training sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-blue-300" />
              <Input
                placeholder="Search external students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {isLoading ? (
              <div className="text-center py-8">Loading external students...</div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {displayStudents.map((student: ExternalStudent) => (
                  <div key={student.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">
                          {student.firstName} {student.lastName}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          <Building className="w-3 h-3 mr-1" />
                          {student.company}
                        </Badge>
                      </div>
                      <div className="text-sm text-blue-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {student.email}
                        </span>
                        {student.phone && (
                          <span className="flex items-center gap-1 mt-1">
                            <Phone className="w-3 h-3" />
                            {student.phone}
                          </span>
                        )}
                        {student.position && (
                          <span className="flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {student.position}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {onSelectStudent && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onSelectStudent(student)}
                          disabled={selectedStudents.some(s => s.id === student.id)}
                        >
                          {selectedStudents.some(s => s.id === student.id) ? 'Selected' : 'Select'}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(student)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(student.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {displayStudents.length === 0 && (
                  <div className="text-center py-8 text-blue-400">
                    {searchQuery.trim() ? 'No external students found matching your search' : 'No external students added yet'}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
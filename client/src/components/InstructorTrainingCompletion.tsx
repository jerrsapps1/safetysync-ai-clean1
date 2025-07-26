import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  GraduationCap, 
  Users, 
  Calendar,
  MapPin,
  Clock,
  Shield,
  CheckCircle,
  User,
  FileText,
  Award
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface TrainingSession {
  id: number;
  title: string;
  date: string;
  location: string;
  duration: string;
  trainer: string;
  plannedAttendees: number;
  status: string;
  trainingStandards: string[];
  notes?: string;
}

interface Employee {
  name: string;
  employeeId?: string;
  signature: boolean;
  completionStatus: 'completed' | 'partial' | 'absent';
  department?: string;
  position?: string;
}

export default function InstructorTrainingCompletion() {
  const [selectedSession, setSelectedSession] = useState<TrainingSession | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [instructorNotes, setInstructorNotes] = useState('');
  const [isCompleting, setIsCompleting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch instructor's training sessions
  const { data: sessions, isLoading } = useQuery({
    queryKey: ['/api/instructor/training-sessions'],
    enabled: true
  });

  const completionMutation = useMutation({
    mutationFn: async (completionData: any) => {
      const response = await apiRequest('POST', '/api/instructor/complete-training', completionData);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/instructor/training-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/employees'] });
      
      // Show detailed success message with Employee Profile integration
      const profilesCreated = data.employeeProfileUpdates?.filter(e => e.profileCreated)?.length || 0;
      const totalEmployees = data.totalEmployeesProcessed || 0;
      
      toast({
        title: "Training Completion Success!",
        description: `✓ Generated ${data.certificatesGenerated} certificates and wallet cards
✓ ${profilesCreated} new employee profiles created
✓ ${totalEmployees} employees integrated with certificate system
✓ All certificates accessible via Employee Profile QR codes`,
      });

      // Reset form
      setSelectedSession(null);
      setEmployees([]);
      setInstructorNotes('');
      setIsCompleting(false);
      
      console.log('Instructor Training Completion Results:', data.employeeProfileUpdates);
    },
    onError: (error) => {
      toast({
        title: "Completion Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsCompleting(false);
    }
  });

  const addEmployee = () => {
    setEmployees(prev => [...prev, {
      name: '',
      employeeId: '',
      signature: false,
      completionStatus: 'absent',
      department: '',
      position: ''
    }]);
  };

  const updateEmployee = (index: number, field: string, value: any) => {
    setEmployees(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeEmployee = (index: number) => {
    setEmployees(prev => prev.filter((_, i) => i !== index));
  };

  const completeTraining = () => {
    if (!selectedSession) {
      toast({
        title: "No Session Selected",
        description: "Please select a training session to complete",
        variant: "destructive",
      });
      return;
    }

    const completedEmployees = employees.filter(e => e.completionStatus === 'completed');
    if (completedEmployees.length === 0) {
      toast({
        title: "No Completed Employees",
        description: "Please mark at least one employee as completed",
        variant: "destructive",
      });
      return;
    }

    setIsCompleting(true);

    const completionData = {
      sessionId: selectedSession.id,
      trainingTitle: selectedSession.title,
      instructorName: selectedSession.trainer,
      instructorCredentials: 'OSHA Authorized Trainer, Safety Professional',
      trainingDate: selectedSession.date,
      location: selectedSession.location,
      duration: selectedSession.duration,
      trainingStandards: selectedSession.trainingStandards || ['OSHA Standard'],
      employees: employees.filter(e => e.name.trim() !== ''), // Only send valid employees
      certificationEligible: true,
      evaluationRequired: false,
      instructorNotes: instructorNotes
    };

    completionMutation.mutate(completionData);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-6 w-6 text-blue-500" />
          <h2 className="text-2xl font-bold">Complete Instructor Training</h2>
        </div>
        <div className="text-center py-8">Loading training sessions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <GraduationCap className="h-6 w-6 text-blue-500" />
        <h2 className="text-2xl font-bold">Complete Instructor Training</h2>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Employee Profile Integration
        </Badge>
      </div>

      {/* Session Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Select Training Session</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {sessions?.sessions?.length > 0 ? (
              sessions.sessions
                .filter(session => session.status === 'scheduled' || session.status === 'in_progress')
                .map(session => (
                  <div
                    key={session.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedSession?.id === session.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedSession(session)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{session.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-blue-500 mt-2">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(session.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{session.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{session.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{session.plannedAttendees} planned</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={session.status === 'scheduled' ? 'secondary' : 'default'}>
                        {session.status}
                      </Badge>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-8 text-blue-400">
                No scheduled training sessions found. Create a training session first.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Employee Attendance */}
      {selectedSession && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Employee Attendance & Completion</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-blue-500">
                Mark employee attendance and completion status for certificate generation
              </p>
              <Button onClick={addEmployee} variant="outline" size="sm">
                Add Employee
              </Button>
            </div>

            <div className="space-y-4">
              {employees.map((employee, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                      <div className="space-y-2">
                        <Label>Employee Name *</Label>
                        <Input
                          value={employee.name}
                          onChange={(e) => updateEmployee(index, 'name', e.target.value)}
                          placeholder="Enter full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Employee ID</Label>
                        <Input
                          value={employee.employeeId}
                          onChange={(e) => updateEmployee(index, 'employeeId', e.target.value)}
                          placeholder="Optional ID"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Completion Status *</Label>
                        <Select
                          value={employee.completionStatus}
                          onValueChange={(value) => updateEmployee(index, 'completionStatus', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="completed">✅ Completed</SelectItem>
                            <SelectItem value="partial">⚠️ Partial</SelectItem>
                            <SelectItem value="absent">❌ Absent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button
                      onClick={() => removeEmployee(index)}
                      variant="outline"
                      size="sm"
                      className="ml-4 text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`signature-${index}`}
                      checked={employee.signature}
                      onCheckedChange={(checked) => updateEmployee(index, 'signature', checked)}
                    />
                    <Label htmlFor={`signature-${index}`} className="text-sm">
                      Employee signature verified (required for certificate generation)
                    </Label>
                  </div>

                  {employee.completionStatus === 'completed' && employee.signature && (
                    <div className="bg-green-50 p-3 rounded-lg flex items-center space-x-2">
                      <Award className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-700">
                        ✓ Will generate certificate and integrate with Employee Profile
                      </span>
                    </div>
                  )}
                </div>
              ))}

              {employees.length === 0 && (
                <div className="text-center py-8 text-blue-400 border-2 border-dashed border-gray-200 rounded-lg">
                  No employees added yet. Click "Add Employee" to start recording attendance.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructor Notes */}
      {selectedSession && employees.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Training Notes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Instructor Notes (Optional)</Label>
              <Textarea
                value={instructorNotes}
                onChange={(e) => setInstructorNotes(e.target.value)}
                placeholder="Add any notes about the training session, special circumstances, or additional observations..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Complete Training */}
      {selectedSession && employees.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Ready to Complete Training</h3>
                <p className="text-sm text-blue-500">
                  This will generate certificates for completed employees and integrate with Employee Profiles
                </p>
              </div>
              <Button
                onClick={completeTraining}
                disabled={isCompleting || employees.filter(e => e.completionStatus === 'completed').length === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                {isCompleting ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Training
                  </>
                )}
              </Button>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-sm text-blue-700">What happens next:</h4>
              <ul className="text-sm text-blue-600 mt-1 space-y-1">
                <li>• Employee profiles automatically created (if needed)</li>
                <li>• Professional certificates generated for completed employees</li>
                <li>• Digital wallet cards created with QR code access</li>
                <li>• All certificates integrated with Employee Profile system</li>
                <li>• QR codes available for real-world verification scenarios</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
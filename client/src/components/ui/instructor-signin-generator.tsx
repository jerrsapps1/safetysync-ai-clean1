import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Download, 
  Save, 
  Plus, 
  X, 
  Users, 
  Calendar,
  Clock,
  MapPin,
  Shield,
  Upload,
  CheckCircle,
  UserPlus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Employee {
  id: string;
  name: string;
  employeeId: string;
  company: string;
  signature?: string;
}

interface SignInSheet {
  id: string;
  classTitle: string;
  instructorName: string;
  instructorCredentials: string;
  instructorCompany: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  trainingType: string;
  oshaStandard: string;
  employees: Employee[];
  createdAt: string;
  status: 'draft' | 'generated' | 'completed' | 'uploaded';
}

const TRAINING_TYPES = [
  { value: 'fall-protection', label: 'Fall Protection Training', standard: '29 CFR 1926.503', retention: '3 years' },
  { value: 'hazcom', label: 'Hazard Communication', standard: '29 CFR 1910.1200', retention: '30 years' },
  { value: 'lockout-tagout', label: 'Lockout/Tagout (LOTO)', standard: '29 CFR 1910.147', retention: '3 years' },
  { value: 'respiratory', label: 'Respiratory Protection', standard: '29 CFR 1910.134', retention: '3 years' },
  { value: 'confined-space', label: 'Confined Space Entry', standard: '29 CFR 1910.146', retention: '3 years' },
  { value: 'forklift', label: 'Forklift/PIT Operation', standard: '29 CFR 1910.178', retention: '3 years' },
  { value: 'scaffolding', label: 'Scaffolding Safety', standard: '29 CFR 1926.451', retention: '3 years' },
  { value: 'electrical', label: 'Electrical Safety', standard: '29 CFR 1910.331', retention: '3 years' },
  { value: 'first-aid', label: 'First Aid/CPR', standard: 'OSHA/ANSI Standard', retention: '3 years' },
  { value: 'fire-safety', label: 'Fire Safety & Prevention', standard: '29 CFR 1910.157', retention: '3 years' },
  { value: 'custom', label: 'Custom Training Class', standard: 'Custom Standard', retention: '3 years' }
];

export function InstructorSignInGenerator() {
  const [formData, setFormData] = useState<Partial<SignInSheet>>({
    classTitle: '',
    instructorName: '',
    instructorCredentials: '',
    instructorCompany: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    trainingType: '',
    oshaStandard: '',
    employees: []
  });
  const [newEmployee, setNewEmployee] = useState({ name: '', employeeId: '', company: '' });
  const [savedSheets, setSavedSheets] = useState<SignInSheet[]>([]);
  const [activeTab, setActiveTab] = useState<'create' | 'saved'>('create');
  const [isCustomTraining, setIsCustomTraining] = useState(false);
  const [customClassName, setCustomClassName] = useState('');
  const [customStandard, setCustomStandard] = useState('');
  const [instructorType, setInstructorType] = useState<'existing' | 'visiting'>('existing');
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const { toast } = useToast();

  // Sample client instructors - in real implementation, this would come from the database
  const clientInstructors = [
    { id: '1', name: 'John Smith', credentials: 'CSP, CHST', company: 'SafetySync.ai' },
    { id: '2', name: 'Sarah Johnson', credentials: 'CIH, CSP', company: 'SafetySync.ai' },
    { id: '3', name: 'Mike Rodriguez', credentials: 'CHST, OHST', company: 'SafetySync.ai' },
    { id: '4', name: 'Lisa Chen', credentials: 'ASP, CSHM', company: 'SafetySync.ai' },
  ];

  const addEmployee = () => {
    if (!newEmployee.name || !newEmployee.employeeId) {
      toast({
        title: "Missing Information",
        description: "Please enter both employee name and ID",
        variant: "destructive"
      });
      return;
    }

    const employee: Employee = {
      id: Date.now().toString(),
      name: newEmployee.name,
      employeeId: newEmployee.employeeId,
      company: newEmployee.company || formData.instructorCompany || 'N/A'
    };

    setFormData(prev => ({
      ...prev,
      employees: [...(prev.employees || []), employee]
    }));

    setNewEmployee({ name: '', employeeId: '', company: '' });
    toast({
      title: "Employee Added",
      description: `${employee.name} has been added to the sign-in sheet`
    });
  };

  const removeEmployee = (employeeId: string) => {
    setFormData(prev => ({
      ...prev,
      employees: prev.employees?.filter(emp => emp.id !== employeeId) || []
    }));
  };

  const handleTrainingTypeChange = (value: string) => {
    const selectedType = TRAINING_TYPES.find(type => type.value === value);
    
    if (value === 'custom') {
      setIsCustomTraining(true);
      setFormData(prev => ({
        ...prev,
        trainingType: value,
        oshaStandard: '',
        classTitle: ''
      }));
    } else {
      setIsCustomTraining(false);
      setCustomClassName('');
      setCustomStandard('');
      setFormData(prev => ({
        ...prev,
        trainingType: value,
        oshaStandard: selectedType?.standard || '',
        classTitle: selectedType?.label || ''
      }));
    }
  };

  const handleInstructorSelection = (instructorId: string) => {
    const instructor = clientInstructors.find(i => i.id === instructorId);
    if (instructor) {
      setSelectedInstructor(instructorId);
      setFormData(prev => ({
        ...prev,
        instructorName: instructor.name,
        instructorCredentials: instructor.credentials,
        instructorCompany: instructor.company
      }));
    }
  };

  const handleInstructorTypeChange = (type: 'existing' | 'visiting') => {
    setInstructorType(type);
    setSelectedInstructor('');
    if (type === 'existing') {
      // Keep existing form data for visiting instructor
    } else {
      // Clear for visiting instructor manual entry
      setFormData(prev => ({
        ...prev,
        instructorName: '',
        instructorCredentials: '',
        instructorCompany: ''
      }));
    }
  };

  const generateSignInSheet = () => {
    if (!formData.classTitle || !formData.instructorName || !formData.date || !formData.employees?.length) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and add at least one employee",
        variant: "destructive"
      });
      return;
    }

    const sheet: SignInSheet = {
      id: Date.now().toString(),
      classTitle: formData.classTitle || '',
      instructorName: formData.instructorName || '',
      instructorCredentials: formData.instructorCredentials || '',
      instructorCompany: formData.instructorCompany || '',
      date: formData.date || '',
      startTime: formData.startTime || '',
      endTime: formData.endTime || '',
      location: formData.location || '',
      trainingType: formData.trainingType || '',
      oshaStandard: formData.oshaStandard || '',
      employees: formData.employees || [],
      createdAt: new Date().toISOString(),
      status: 'generated'
    };

    setSavedSheets(prev => [...prev, sheet]);
    
    // Generate and download the printable form
    generatePrintableForm(sheet);
    
    toast({
      title: "Sign-In Sheet Generated",
      description: `Generated for ${sheet.employees.length} employees. Ready to print and use in class.`,
      duration: 4000
    });
  };

  const generatePrintableForm = (sheet: SignInSheet) => {
    const selectedTraining = TRAINING_TYPES.find(t => t.value === sheet.trainingType);
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>OSHA Training Sign-In Sheet</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 15px; }
          .company-info { text-align: center; margin-bottom: 20px; }
          .training-details { margin-bottom: 25px; }
          .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
          .detail-item { margin-bottom: 8px; }
          .detail-label { font-weight: bold; display: inline-block; width: 120px; }
          .attendance-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .attendance-table th, .attendance-table td { border: 1px solid #000; padding: 8px; text-align: left; }
          .attendance-table th { background-color: #f0f0f0; font-weight: bold; }
          .signature-cell { width: 200px; height: 40px; }
          .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #000; }
          .compliance-note { background-color: #f9f9f9; padding: 15px; margin-top: 20px; border-left: 4px solid #007bff; }
          .page-break { page-break-before: always; }
          @media print {
            body { margin: 0; font-size: 11px; }
            .header { margin-bottom: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>OSHA TRAINING ATTENDANCE RECORD</h1>
          <h2>${sheet.classTitle}</h2>
        </div>
        
        <div class="company-info">
          <strong>Instructor Company:</strong> ${sheet.instructorCompany}<br>
          <strong>Training Location:</strong> ${sheet.location}
        </div>
        
        <div class="training-details">
          <div class="details-grid">
            <div>
              <div class="detail-item">
                <span class="detail-label">Instructor:</span> ${sheet.instructorName}
              </div>
              <div class="detail-item">
                <span class="detail-label">Credentials:</span> ${sheet.instructorCredentials}
              </div>
              <div class="detail-item">
                <span class="detail-label">Training Date:</span> ${sheet.date}
              </div>
              <div class="detail-item">
                <span class="detail-label">Start Time:</span> ${sheet.startTime}
              </div>
            </div>
            <div>
              <div class="detail-item">
                <span class="detail-label">End Time:</span> ${sheet.endTime}
              </div>
              <div class="detail-item">
                <span class="detail-label">OSHA Standard:</span> ${sheet.oshaStandard}
              </div>
              <div class="detail-item">
                <span class="detail-label">Record Retention:</span> ${selectedTraining?.retention || '3 years'}
              </div>
              <div class="detail-item">
                <span class="detail-label">Total Participants:</span> ${sheet.employees.length}
              </div>
            </div>
          </div>
        </div>
        
        <table class="attendance-table">
          <thead>
            <tr>
              <th style="width: 40px;">#</th>
              <th style="width: 200px;">Employee Name</th>
              <th style="width: 120px;">Employee ID</th>
              <th style="width: 150px;">Company</th>
              <th class="signature-cell">Signature</th>
              <th style="width: 80px;">Time In</th>
              <th style="width: 80px;">Time Out</th>
            </tr>
          </thead>
          <tbody>
            ${sheet.employees.map((employee, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${employee.name}</td>
                <td>${employee.employeeId}</td>
                <td>${employee.company}</td>
                <td class="signature-cell"></td>
                <td></td>
                <td></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <div style="margin-bottom: 20px;">
            <strong>Instructor Signature:</strong> _________________________________ 
            <strong style="margin-left: 50px;">Date:</strong> _____________
          </div>
          
          <div class="compliance-note">
            <h4>OSHA Compliance Requirements:</h4>
            <ul>
              <li>This attendance record must be maintained for ${selectedTraining?.retention || '3 years'} as required by ${sheet.oshaStandard}</li>
              <li>All participants must sign to acknowledge receipt of training</li>
              <li>Original document must be uploaded to SafetySync.ai compliance system</li>
              <li>Instructor certification must be current and on file</li>
            </ul>
          </div>
        </div>
        
        <div class="page-break"></div>
        
        <div class="header">
          <h2>UPLOAD INSTRUCTIONS</h2>
        </div>
        
        <div style="padding: 20px;">
          <h3>After Training Completion:</h3>
          <ol style="line-height: 1.6;">
            <li><strong>Collect Signatures:</strong> Ensure all participants have signed the attendance record</li>
            <li><strong>Instructor Signature:</strong> Sign and date the form as the certified instructor</li>
            <li><strong>Scan/Photograph:</strong> Create a high-quality digital copy of the completed form</li>
            <li><strong>Upload to Platform:</strong> 
              <ul>
                <li>Log into SafetySync.ai instructor portal</li>
                <li>Navigate to "Training Documentation" → "Sign-In Sheets"</li>
                <li>Find this training session (ID: ${sheet.id})</li>
                <li>Upload the completed, signed document</li>
              </ul>
            </li>
            <li><strong>Verification:</strong> System will automatically update employee training records</li>
          </ol>
          
          <div style="background-color: #fff3cd; padding: 15px; margin-top: 20px; border-left: 4px solid #ffc107;">
            <strong>Important:</strong> Upload must be completed within 48 hours of training completion for OSHA compliance tracking.
          </div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const saveAsDraft = () => {
    if (!formData.classTitle || !formData.instructorName) {
      toast({
        title: "Missing Information",
        description: "Please enter at least class title and instructor name to save draft",
        variant: "destructive"
      });
      return;
    }

    const draft: SignInSheet = {
      id: Date.now().toString(),
      classTitle: formData.classTitle || '',
      instructorName: formData.instructorName || '',
      instructorCredentials: formData.instructorCredentials || '',
      instructorCompany: formData.instructorCompany || '',
      date: formData.date || '',
      startTime: formData.startTime || '',
      endTime: formData.endTime || '',
      location: formData.location || '',
      trainingType: formData.trainingType || '',
      oshaStandard: formData.oshaStandard || '',
      employees: formData.employees || [],
      createdAt: new Date().toISOString(),
      status: 'draft'
    };

    setSavedSheets(prev => [...prev, draft]);
    toast({
      title: "Draft Saved",
      description: "Sign-in sheet saved as draft. You can complete it later."
    });
  };

  const loadDraft = (sheet: SignInSheet) => {
    setFormData(sheet);
    setActiveTab('create');
    toast({
      title: "Draft Loaded",
      description: "Sign-in sheet loaded for editing"
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-600" />
            Instructor Sign-In Sheet Generator
          </h1>
          <p className="text-gray-600 mt-2">
            Create OSHA-compliant attendance records for safety training classes
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'create' ? 'default' : 'outline'}
            onClick={() => setActiveTab('create')}
          >
            Create New
          </Button>
          <Button
            variant={activeTab === 'saved' ? 'default' : 'outline'}
            onClick={() => setActiveTab('saved')}
          >
            Saved Sheets ({savedSheets.length})
          </Button>
        </div>
      </div>

      {activeTab === 'create' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Training Information
                </CardTitle>
                <CardDescription>
                  Basic details about the safety training session
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="trainingType">Training Type *</Label>
                    <Select value={formData.trainingType} onValueChange={handleTrainingTypeChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Class" />
                      </SelectTrigger>
                      <SelectContent>
                        {TRAINING_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {isCustomTraining && (
                    <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Plus className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-800">Custom Training Setup</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsCustomTraining(false);
                            setCustomClassName('');
                            setCustomStandard('');
                            setFormData(prev => ({
                              ...prev,
                              trainingType: '',
                              classTitle: '',
                              oshaStandard: ''
                            }));
                          }}
                          className="text-xs"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Clear Selection
                        </Button>
                      </div>
                      
                      <div>
                        <Label htmlFor="customClassName">Custom Class Name *</Label>
                        <Input
                          id="customClassName"
                          value={customClassName}
                          onChange={(e) => {
                            setCustomClassName(e.target.value);
                            setFormData(prev => ({ ...prev, classTitle: e.target.value }));
                          }}
                          placeholder="Enter your custom class name"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="customStandard">OSHA/ANSI Reference</Label>
                        <Input
                          id="customStandard"
                          value={customStandard}
                          onChange={(e) => {
                            setCustomStandard(e.target.value);
                            setFormData(prev => ({ ...prev, oshaStandard: e.target.value }));
                          }}
                          placeholder="e.g., 29 CFR 1926.95, ANSI Z359.1, or custom standard"
                        />
                      </div>
                    </div>
                  )}
                  
                  {!isCustomTraining && (
                    <>
                      <div>
                        <Label htmlFor="classTitle">Class Title *</Label>
                        <Input
                          id="classTitle"
                          value={formData.classTitle}
                          onChange={(e) => setFormData(prev => ({ ...prev, classTitle: e.target.value }))}
                          placeholder="Enter class title"
                          disabled={!isCustomTraining}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="oshaStandard">OSHA/ANSI Standard</Label>
                        <Input
                          id="oshaStandard"
                          value={formData.oshaStandard}
                          onChange={(e) => setFormData(prev => ({ ...prev, oshaStandard: e.target.value }))}
                          placeholder="Auto-filled based on training type"
                          disabled={!isCustomTraining}
                        />
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Instructor Information
                </CardTitle>
                <CardDescription>
                  Details about the certified instructor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Instructor Type *</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant={instructorType === 'existing' ? 'default' : 'outline'}
                      onClick={() => handleInstructorTypeChange('existing')}
                      className="flex-1"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Select Instructor
                    </Button>
                    <Button
                      type="button"
                      variant={instructorType === 'visiting' ? 'default' : 'outline'}
                      onClick={() => handleInstructorTypeChange('visiting')}
                      className="flex-1"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Visiting Instructor
                    </Button>
                  </div>
                </div>

                {instructorType === 'existing' && (
                  <div>
                    <Label htmlFor="instructorSelect">Select Instructor *</Label>
                    <Select value={selectedInstructor} onValueChange={handleInstructorSelection}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Instructor" />
                      </SelectTrigger>
                      <SelectContent>
                        {clientInstructors.map(instructor => (
                          <SelectItem key={instructor.id} value={instructor.id}>
                            {instructor.name} - {instructor.credentials}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {instructorType === 'visiting' && (
                  <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <UserPlus className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-800">Visiting Instructor Information</span>
                    </div>
                    
                    <div>
                      <Label htmlFor="instructorName">Instructor Name *</Label>
                      <Input
                        id="instructorName"
                        value={formData.instructorName}
                        onChange={(e) => setFormData(prev => ({ ...prev, instructorName: e.target.value }))}
                        placeholder="Full name of visiting instructor"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="instructorCredentials">Instructor Credentials</Label>
                      <Input
                        id="instructorCredentials"
                        value={formData.instructorCredentials}
                        onChange={(e) => setFormData(prev => ({ ...prev, instructorCredentials: e.target.value }))}
                        placeholder="e.g., OSHA Authorized, CSP, CIH"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="instructorCompany">Instructor Company</Label>
                      <Input
                        id="instructorCompany"
                        value={formData.instructorCompany}
                        onChange={(e) => setFormData(prev => ({ ...prev, instructorCompany: e.target.value }))}
                        placeholder="Visiting instructor's company name"
                      />
                    </div>
                  </div>
                )}

                {instructorType === 'existing' && selectedInstructor && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <strong>Selected Instructor:</strong>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedInstructor('');
                          setFormData(prev => ({
                            ...prev,
                            instructorName: '',
                            instructorCredentials: '',
                            instructorCompany: ''
                          }));
                        }}
                        className="text-xs"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Clear Selection
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div><strong>Name:</strong> {formData.instructorName}</div>
                      <div><strong>Credentials:</strong> {formData.instructorCredentials}</div>
                      <div><strong>Company:</strong> {formData.instructorCompany}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Session Details
                </CardTitle>
                <CardDescription>
                  When and where the training will take place
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Training Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Training location"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Attendees ({formData.employees?.length || 0})
                </CardTitle>
                <CardDescription>
                  Add employees who will attend this training session
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label htmlFor="employeeName">Employee Name</Label>
                    <Input
                      id="employeeName"
                      value={newEmployee.name}
                      onChange={(e) => setNewEmployee(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Full name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="employeeId">Employee ID</Label>
                    <Input
                      id="employeeId"
                      value={newEmployee.employeeId}
                      onChange={(e) => setNewEmployee(prev => ({ ...prev, employeeId: e.target.value }))}
                      placeholder="Employee ID or badge number"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="employeeCompany">Company (optional)</Label>
                    <Input
                      id="employeeCompany"
                      value={newEmployee.company}
                      onChange={(e) => setNewEmployee(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Company name (if different from instructor)"
                    />
                  </div>
                  
                  <Button onClick={addEmployee} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Employee
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {formData.employees?.map((employee, index) => (
                    <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-gray-500">
                          ID: {employee.employeeId} • {employee.company}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEmployee(employee.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {(!formData.employees || formData.employees.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      No employees added yet. Add employees to generate sign-in sheet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button onClick={saveAsDraft} variant="outline" className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button onClick={generateSignInSheet} className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Generate & Print
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Saved Sign-In Sheets</CardTitle>
            <CardDescription>
              Manage your drafted and generated training attendance records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {savedSheets.map(sheet => (
                <div key={sheet.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{sheet.classTitle}</h3>
                      <p className="text-sm text-gray-600">
                        Instructor: {sheet.instructorName} • {sheet.date} • {sheet.employees.length} employees
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={sheet.status === 'draft' ? 'secondary' : 'default'}>
                          {sheet.status}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Created: {new Date(sheet.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {sheet.status === 'draft' && (
                        <Button variant="outline" size="sm" onClick={() => loadDraft(sheet)}>
                          Edit
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => generatePrintableForm(sheet)}>
                        <Download className="w-4 h-4 mr-1" />
                        Print
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {savedSheets.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No saved sign-in sheets yet. Create your first one to get started.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
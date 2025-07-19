import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  Download, 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2,
  Users,
  BookOpen,
  Award,
  Shield,
  ChevronDown,
  Eye,
  Calendar,
  Clock,
  User,
  Printer
} from 'lucide-react';
import { format } from 'date-fns';

// Document category configurations
const documentCategories = [
  { 
    id: 'sign_in_sheet', 
    name: 'Sign-In Sheets', 
    icon: Users, 
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    description: 'Instructor and student attendance records'
  },
  { 
    id: 'training_material', 
    name: 'Training Materials', 
    icon: BookOpen, 
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    description: 'Course syllabi, presentations, and educational content'
  },
  { 
    id: 'certificate', 
    name: 'Certificates', 
    icon: Award, 
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    description: 'Generated certificates and completions'
  },
  { 
    id: 'instructor_resource', 
    name: 'Instructor Resources', 
    icon: Shield, 
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    description: 'Instructor guides, evaluation forms, and teaching materials'
  },
  { 
    id: 'student_record', 
    name: 'Student Records', 
    icon: FileText, 
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    description: 'Student progress, evaluations, and training history'
  },
  { 
    id: 'compliance_document', 
    name: 'Compliance Documents', 
    icon: Shield, 
    color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    description: 'Regulatory requirements and compliance records'
  }
];

// Training subject configurations
const trainingSubjects = [
  'Fall Protection',
  'HAZWOPER',
  'Hazard Communication',
  'Hearing Conservation',
  'Personal Protective Equipment',
  'First Aid/CPR',
  'Lockout/Tagout',
  'Respiratory Protection',
  'Forklift Operation',
  'Crane Operation',
  'Excavation Safety',
  'Confined Space Entry',
  'Electrical Safety',
  'Chemical Safety',
  'Fire Safety',
  'Welding Safety',
  'Custom Training'
];

interface TrainingDocument {
  id: number;
  fileName: string;
  fileType: string;
  category: string;
  trainingSubject: string;
  trainingDate: Date;
  instructorName: string;
  studentCount: number;
  location: string;
  fileSize: number;
  uploadDate: Date;
  description?: string;
  expirationDate?: Date;
  generatedEmployees?: any[]; // Store actual employee data from sign-in generator
  oshaStandard?: string;
  customReference?: string;
  instructorCredentials?: string;
  instructorCompany?: string;
  startTime?: string;
  endTime?: string;
}

// Mock data for demonstration
const mockDocuments: TrainingDocument[] = [
  {
    id: 1,
    fileName: 'Fall_Protection_Sign_In_Sheet_2025-01-15.pdf',
    fileType: 'PDF',
    category: 'sign_in_sheet',
    trainingSubject: 'Fall Protection',
    trainingDate: new Date('2025-01-15'),
    instructorName: 'John Smith',
    studentCount: 12,
    location: 'Main Training Room',
    fileSize: 245760,
    uploadDate: new Date('2025-01-15T10:30:00'),
    description: 'Instructor and student attendance for Fall Protection training session'
  },
  {
    id: 2,
    fileName: 'HAZWOPER_Training_Materials_2025.pdf',
    fileType: 'PDF',
    category: 'training_material',
    trainingSubject: 'HAZWOPER',
    trainingDate: new Date('2025-01-20'),
    instructorName: 'Sarah Johnson',
    studentCount: 8,
    location: 'Conference Room B',
    fileSize: 1024000,
    uploadDate: new Date('2025-01-20T14:15:00'),
    description: 'Complete HAZWOPER training syllabus and presentation materials'
  },
  {
    id: 3,
    fileName: 'Forklift_Certification_Mike_Rodriguez.pdf',
    fileType: 'PDF',
    category: 'certificate',
    trainingSubject: 'Forklift Operation',
    trainingDate: new Date('2025-01-18'),
    instructorName: 'Lisa Chen',
    studentCount: 1,
    location: 'Warehouse Training Area',
    fileSize: 98304,
    uploadDate: new Date('2025-01-18T16:45:00'),
    description: 'Forklift operation certificate for Mike Rodriguez',
    expirationDate: new Date('2028-01-18')
  }
];

export default function TrainingDocumentHub() {
  const [documents, setDocuments] = useState<TrainingDocument[]>(() => {
    // Load existing documents from localStorage on component mount
    const savedDocuments = localStorage.getItem('trainingDocuments');
    return savedDocuments ? JSON.parse(savedDocuments) : mockDocuments;
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<TrainingDocument | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<Set<number>>(new Set());
  const [uploadData, setUploadData] = useState({
    category: '',
    trainingSubject: '',
    trainingDate: '',
    instructorName: '',
    studentCount: '',
    location: '',
    description: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Listen for new documents from sign-in generator
  React.useEffect(() => {
    const handleNewDocument = (event: CustomEvent) => {
      const newDocument = event.detail;
      setDocuments(prev => [newDocument, ...prev]);
      toast({
        title: "Document Added",
        description: `Sign-in sheet for ${newDocument.trainingSubject} has been added to the document hub.`,
      });
    };

    window.addEventListener('documentAdded', handleNewDocument as EventListener);
    return () => window.removeEventListener('documentAdded', handleNewDocument as EventListener);
  }, [toast]);

  // Filter documents based on category, subject, and search term
  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSubject = selectedSubject === 'all' || doc.trainingSubject === selectedSubject;
    const matchesSearch = searchTerm === '' || 
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.instructorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.trainingSubject.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSubject && matchesSearch;
  });

  // Get category info
  const getCategoryInfo = (categoryId: string) => {
    return documentCategories.find(cat => cat.id === categoryId) || documentCategories[0];
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle file upload
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Validate required fields
    if (!uploadData.category || !uploadData.trainingSubject || !uploadData.trainingDate || !uploadData.instructorName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before uploading.",
        variant: "destructive",
      });
      return;
    }

    // Create new document entry
    const newDocument: TrainingDocument = {
      id: Date.now(),
      fileName: file.name,
      fileType: file.type.split('/')[1]?.toUpperCase() || 'UNKNOWN',
      category: uploadData.category,
      trainingSubject: uploadData.trainingSubject,
      trainingDate: new Date(uploadData.trainingDate),
      instructorName: uploadData.instructorName,
      studentCount: parseInt(uploadData.studentCount) || 0,
      location: uploadData.location,
      fileSize: file.size,
      uploadDate: new Date(),
      description: uploadData.description
    };

    setDocuments(prev => [newDocument, ...prev]);
    setIsUploadDialogOpen(false);
    setUploadData({
      category: '',
      trainingSubject: '',
      trainingDate: '',
      instructorName: '',
      studentCount: '',
      location: '',
      description: ''
    });

    toast({
      title: "Upload Successful",
      description: `${file.name} has been uploaded to the Training Document Hub.`,
    });
  };

  // Handle document view
  const handleView = (doc: TrainingDocument) => {
    setViewingDocument(doc);
    setIsViewDialogOpen(true);
  };

  // Handle document regeneration/print
  const handleRegenerateDocument = (doc: TrainingDocument) => {
    console.log('Document category:', doc.category);
    console.log('Generated employees:', doc.generatedEmployees);
    console.log('Full document:', doc);
    
    if (doc.category === 'sign_in_sheet' && doc.generatedEmployees) {
      // Recreate the exact sign-in sheet with original data
      const regeneratedContent = generatePrintableSignInSheet(doc);
      
      // Create and download the regenerated file
      const blob = new Blob([regeneratedContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${doc.fileName.replace('.pdf', '_REGENERATED.txt')}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Document Regenerated",
        description: `${doc.fileName} has been regenerated with original data and downloaded.`,
      });
    } else {
      toast({
        title: "Cannot Regenerate",
        description: "This document type doesn't support regeneration or lacks original data.",
        variant: "destructive"
      });
    }
  };

  // Generate printable sign-in sheet content
  const generatePrintableSignInSheet = (doc: TrainingDocument) => {
    let attendeeList = '';
    
    if (doc.generatedEmployees && doc.generatedEmployees.length > 0) {
      attendeeList = doc.generatedEmployees
        .map((employee, index) => `${(index + 1).toString().padStart(2, '0')}. ${employee.name.padEnd(20)} ________________`)
        .join('\n');
    } else {
      // Create a realistic attendee list based on student count
      const fallbackNames = [
        'John Smith', 'Maria Garcia', 'David Johnson', 'Sarah Wilson', 
        'Michael Brown', 'Jennifer Davis', 'Robert Miller', 'Lisa Anderson',
        'James Taylor', 'Jessica Martinez', 'Christopher Lee', 'Amanda White',
        'Daniel Garcia', 'Ashley Thompson', 'Matthew Jackson', 'Emily Rodriguez'
      ];
      attendeeList = fallbackNames
        .slice(0, doc.studentCount || 8)
        .map((name, index) => `${(index + 1).toString().padStart(2, '0')}. ${name.padEnd(20)} ________________`)
        .join('\n');
    }

    const timeRange = doc.startTime && doc.endTime ? ` (${doc.startTime} - ${doc.endTime})` : '';
    const credentials = doc.instructorCredentials ? ` - ${doc.instructorCredentials}` : '';
    const company = doc.instructorCompany ? ` (${doc.instructorCompany})` : '';
    const standard = doc.oshaStandard || doc.customReference || 'N/A';

    return `TRAINING SIGN-IN SHEET

Training Subject: ${doc.trainingSubject}${timeRange}
Date: ${format(doc.trainingDate, 'MMMM dd, yyyy')}
Instructor: ${doc.instructorName}${credentials}${company}
Location: ${doc.location}
Total Students: ${doc.studentCount}
OSHA/Regulatory Standard: ${standard}

Description: ${doc.description || 'No description provided'}

STUDENT ATTENDANCE:
Name                     Signature
----------------------------------------
${attendeeList}

Instructor Signature: ________________    Date: ${format(doc.trainingDate, 'MM/dd/yyyy')}

This document serves as an official attendance record for the training session.
Generated from SafetySync.AI Training Document Hub`;
  };

  // Generate document preview content
  const generatePreviewContent = (doc: TrainingDocument) => {
    switch (doc.category) {
      case 'sign_in_sheet':
        // Use actual employee data if available from sign-in generator
        let attendeeList = '';
        if (doc.generatedEmployees && doc.generatedEmployees.length > 0) {
          attendeeList = doc.generatedEmployees
            .map((employee, index) => `${(index + 1).toString().padStart(2, '0')}. ${employee.name.padEnd(20)} ________________`)
            .join('\n');
        } else {
          // Fallback to generic names
          const studentNames = [
            'John Smith', 'Maria Garcia', 'David Johnson', 'Sarah Wilson', 
            'Michael Brown', 'Jennifer Davis', 'Robert Miller', 'Lisa Anderson',
            'James Taylor', 'Jessica Martinez', 'Christopher Lee', 'Amanda White',
            'Daniel Garcia', 'Ashley Thompson', 'Matthew Jackson', 'Emily Rodriguez'
          ];
          attendeeList = studentNames
            .slice(0, doc.studentCount || 8)
            .map((name, index) => `${(index + 1).toString().padStart(2, '0')}. ${name.padEnd(20)} ________________`)
            .join('\n');
        }

        const timeRange = doc.startTime && doc.endTime ? ` (${doc.startTime} - ${doc.endTime})` : '';
        const credentials = doc.instructorCredentials ? ` - ${doc.instructorCredentials}` : '';
        const company = doc.instructorCompany ? ` (${doc.instructorCompany})` : '';
        const standard = doc.oshaStandard || doc.customReference || 'N/A';

        return `TRAINING SIGN-IN SHEET

Training Subject: ${doc.trainingSubject || 'Safety Training'}${timeRange}
Date: ${format(doc.trainingDate, 'MMMM dd, yyyy')}
Instructor: ${doc.instructorName || 'N/A'}${credentials}${company}
Location: ${doc.location || 'N/A'}
Total Students: ${doc.studentCount || 'N/A'}
OSHA/Regulatory Standard: ${standard}

Description: ${doc.description || 'No description provided'}

STUDENT ATTENDANCE:
Name                     Signature
----------------------------------------
${attendeeList}

Instructor Signature: ________________    Date: ${format(doc.trainingDate, 'MM/dd/yyyy')}

This document serves as an official attendance record for the training session.`;
      
      case 'training_material':
        return `TRAINING MATERIALS

Document: ${doc.fileName}
Subject: ${doc.trainingSubject || 'Safety Training'}
Date: ${format(doc.trainingDate, 'MMMM dd, yyyy')}

Description: ${doc.description || 'No description provided'}

This document contains training materials for safety compliance.`;
      
      case 'certificate':
        return `TRAINING CERTIFICATE

Document: ${doc.fileName}
Subject: ${doc.trainingSubject || 'Safety Training'}
Date: ${format(doc.trainingDate, 'MMMM dd, yyyy')}
Instructor: ${doc.instructorName || 'N/A'}

Description: ${doc.description || 'No description provided'}

This certificate verifies completion of safety training requirements.`;
      
      case 'instructor_resource':
        return `INSTRUCTOR RESOURCES

Document: ${doc.fileName}
Subject: ${doc.trainingSubject || 'Safety Training'}
Date: ${format(doc.trainingDate, 'MMMM dd, yyyy')}

Description: ${doc.description || 'No description provided'}

This document contains resources for training instructors.`;
      
      case 'student_record':
        return `STUDENT RECORDS

Document: ${doc.fileName}
Subject: ${doc.trainingSubject || 'Safety Training'}
Date: ${format(doc.trainingDate, 'MMMM dd, yyyy')}
Student Count: ${doc.studentCount || 'N/A'}

Description: ${doc.description || 'No description provided'}

This document contains student training records.`;
      
      case 'compliance_document':
        return `COMPLIANCE DOCUMENT

Document: ${doc.fileName}
Subject: ${doc.trainingSubject || 'Safety Training'}
Date: ${format(doc.trainingDate, 'MMMM dd, yyyy')}

Description: ${doc.description || 'No description provided'}

This document contains compliance-related training information.`;
      
      default:
        return `TRAINING DOCUMENT

Document: ${doc.fileName}
Date: ${format(doc.trainingDate, 'MMMM dd, yyyy')}

Description: ${doc.description || 'No description provided'}

This is a training-related document.`;
    }
  };

  // Handle document download
  const handleDownload = async (doc: TrainingDocument) => {
    try {
      toast({
        title: "Download Started",
        description: `Downloading ${doc.fileName}...`,
      });

      // Create mock document content based on category
      let content = '';
      
      switch (doc.category) {
        case 'sign-in-sheets':
        case 'sign_in_sheet':
          // Use actual employee data if available from sign-in generator
          let downloadAttendeeList = '';
          if (doc.generatedEmployees && doc.generatedEmployees.length > 0) {
            downloadAttendeeList = doc.generatedEmployees
              .map((employee, index) => `${(index + 1).toString().padStart(2, '0')}. ${employee.name.padEnd(20)} ________________`)
              .join('\n');
          } else {
            // Fallback to generic names
            const downloadStudentNames = [
              'John Smith', 'Maria Garcia', 'David Johnson', 'Sarah Wilson', 
              'Michael Brown', 'Jennifer Davis', 'Robert Miller', 'Lisa Anderson',
              'James Taylor', 'Jessica Martinez', 'Christopher Lee', 'Amanda White',
              'Daniel Garcia', 'Ashley Thompson', 'Matthew Jackson', 'Emily Rodriguez'
            ];
            downloadAttendeeList = downloadStudentNames
              .slice(0, doc.studentCount || 8)
              .map((name, index) => `${(index + 1).toString().padStart(2, '0')}. ${name.padEnd(20)} ________________`)
              .join('\n');
          }

          const downloadTimeRange = doc.startTime && doc.endTime ? ` (${doc.startTime} - ${doc.endTime})` : '';
          const downloadCredentials = doc.instructorCredentials ? ` - ${doc.instructorCredentials}` : '';
          const downloadCompany = doc.instructorCompany ? ` (${doc.instructorCompany})` : '';
          const downloadStandard = doc.oshaStandard || doc.customReference || 'N/A';

          content = `TRAINING SIGN-IN SHEET

Training Subject: ${doc.trainingSubject || 'Safety Training'}${downloadTimeRange}
Date: ${new Date(doc.uploadDate).toLocaleDateString()}
Instructor: ${doc.instructorName || 'N/A'}${downloadCredentials}${downloadCompany}
Location: ${doc.location || 'N/A'}
Total Students: ${doc.studentCount || 'N/A'}
OSHA/Regulatory Standard: ${downloadStandard}

Description: ${doc.description || 'No description provided'}

STUDENT ATTENDANCE:
Name                     Signature
----------------------------------------
${downloadAttendeeList}

Instructor Signature: ________________    Date: ${new Date(doc.uploadDate).toLocaleDateString()}

This document serves as an official attendance record for the training session.`;
          break;
        case 'training-materials':
          content = `TRAINING MATERIALS\n\nDocument: ${doc.fileName}\nSubject: ${doc.trainingSubject || 'Safety Training'}\nDate: ${new Date(doc.uploadDate).toLocaleDateString()}\n\nDescription: ${doc.description || 'No description provided'}\n\nThis document contains training materials for safety compliance.`;
          break;
        case 'certificates':
          content = `TRAINING CERTIFICATE\n\nDocument: ${doc.fileName}\nSubject: ${doc.trainingSubject || 'Safety Training'}\nDate: ${new Date(doc.uploadDate).toLocaleDateString()}\nInstructor: ${doc.instructorName || 'N/A'}\n\nDescription: ${doc.description || 'No description provided'}\n\nThis certificate verifies completion of safety training requirements.`;
          break;
        case 'instructor-resources':
          content = `INSTRUCTOR RESOURCES\n\nDocument: ${doc.fileName}\nSubject: ${doc.trainingSubject || 'Safety Training'}\nDate: ${new Date(doc.uploadDate).toLocaleDateString()}\n\nDescription: ${doc.description || 'No description provided'}\n\nThis document contains resources for training instructors.`;
          break;
        case 'student-records':
          content = `STUDENT RECORDS\n\nDocument: ${doc.fileName}\nSubject: ${doc.trainingSubject || 'Safety Training'}\nDate: ${new Date(doc.uploadDate).toLocaleDateString()}\nStudent Count: ${doc.studentCount || 'N/A'}\n\nDescription: ${doc.description || 'No description provided'}\n\nThis document contains student training records.`;
          break;
        case 'compliance-documents':
          content = `COMPLIANCE DOCUMENT\n\nDocument: ${doc.fileName}\nSubject: ${doc.trainingSubject || 'Safety Training'}\nDate: ${new Date(doc.uploadDate).toLocaleDateString()}\n\nDescription: ${doc.description || 'No description provided'}\n\nThis document contains compliance-related training information.`;
          break;
        default:
          content = `TRAINING DOCUMENT\n\nDocument: ${doc.fileName}\nDate: ${new Date(doc.uploadDate).toLocaleDateString()}\n\nDescription: ${doc.description || 'No description provided'}\n\nThis is a demonstration of the download functionality.`;
      }

      // Create and download the file
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Download Complete",
        description: `${doc.fileName} has been downloaded successfully.`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading the file. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle document deletion
  const handleDelete = (docId: number) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
    toast({
      title: "Document Deleted",
      description: "The document has been removed from the hub.",
    });
  };

  // Handle checkbox selection
  const toggleDocumentSelection = (docId: number) => {
    setSelectedDocuments(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(docId)) {
        newSelection.delete(docId);
      } else {
        newSelection.add(docId);
      }
      return newSelection;
    });
  };



  // Handle bulk operations
  const handleBulkView = () => {
    if (selectedDocuments.size === 1) {
      const docId = Array.from(selectedDocuments)[0];
      const doc = documents.find(d => d.id === docId);
      if (doc) handleView(doc);
    } else {
      toast({
        title: "Multiple Documents Selected",
        description: "Please select only one document to view.",
        variant: "destructive",
      });
    }
  };

  const handleBulkDownload = () => {
    selectedDocuments.forEach(docId => {
      const doc = documents.find(d => d.id === docId);
      if (doc) handleDownload(doc);
    });
    toast({
      title: "Bulk Download Started",
      description: `Downloading ${selectedDocuments.size} documents.`,
    });
  };

  const handleBulkDelete = () => {
    setDocuments(prev => prev.filter(doc => !selectedDocuments.has(doc.id)));
    setSelectedDocuments(new Set());
    toast({
      title: "Documents Deleted",
      description: `${selectedDocuments.size} documents have been removed.`,
    });
  };

  // Statistics
  const totalDocuments = documents.length;
  const documentsByCategory = documentCategories.map(cat => ({
    ...cat,
    count: documents.filter(doc => doc.category === cat.id).length
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Floating tech icons background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-8 h-8 bg-blue-500/10 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-6 h-6 bg-emerald-500/10 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-40 left-20 w-10 h-10 bg-purple-500/10 rounded-full animate-pulse delay-2000" />
        <div className="absolute bottom-20 right-10 w-4 h-4 bg-yellow-500/10 rounded-full animate-pulse delay-3000" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Training Document Hub</h1>
              <p className="text-gray-300 text-lg">Centralized training documentation and record management</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{totalDocuments}</div>
                <div className="text-sm text-gray-300">Total Documents</div>
              </div>
              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-gray-800 border-gray-700" aria-describedby="upload-document-description">
                  <DialogHeader>
                    <DialogTitle className="text-white">Upload Training Document</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category" className="text-gray-300">Document Category *</Label>
                        <Select value={uploadData.category} onValueChange={(value) => setUploadData(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600">
                            {documentCategories.map(cat => (
                              <SelectItem key={cat.id} value={cat.id} className="text-white hover:bg-gray-600">
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="trainingSubject" className="text-gray-300">Training Subject *</Label>
                        <Select value={uploadData.trainingSubject} onValueChange={(value) => setUploadData(prev => ({ ...prev, trainingSubject: value }))}>
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600">
                            {trainingSubjects.map(subject => (
                              <SelectItem key={subject} value={subject} className="text-white hover:bg-gray-600">
                                {subject}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="trainingDate" className="text-gray-300">Training Date *</Label>
                        <Input
                          id="trainingDate"
                          type="date"
                          value={uploadData.trainingDate}
                          onChange={(e) => setUploadData(prev => ({ ...prev, trainingDate: e.target.value }))}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="instructorName" className="text-gray-300">Instructor Name *</Label>
                        <Input
                          id="instructorName"
                          value={uploadData.instructorName}
                          onChange={(e) => setUploadData(prev => ({ ...prev, instructorName: e.target.value }))}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="Enter instructor name"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="studentCount" className="text-gray-300">Student Count</Label>
                        <Input
                          id="studentCount"
                          type="number"
                          value={uploadData.studentCount}
                          onChange={(e) => setUploadData(prev => ({ ...prev, studentCount: e.target.value }))}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="Number of students"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location" className="text-gray-300">Location</Label>
                        <Input
                          id="location"
                          value={uploadData.location}
                          onChange={(e) => setUploadData(prev => ({ ...prev, location: e.target.value }))}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="Training location"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="description" className="text-gray-300">Description</Label>
                      <Input
                        id="description"
                        value={uploadData.description}
                        onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Brief description of the document"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="file" className="text-gray-300">Select File</Label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.xlsx,.ppt,.pptx"
                        onChange={(e) => handleFileUpload(e.target.files)}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-emerald-600 file:text-white hover:file:bg-emerald-700"
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsUploadDialogOpen(false)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Document
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Category Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {documentsByCategory.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card key={category.id} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <IconComponent className="w-5 h-5 text-emerald-400" />
                      <div>
                        <div className="text-sm font-medium text-white">{category.name}</div>
                        <div className="text-xs text-gray-400">{category.count} documents</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters and Search */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm mb-6">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="all" className="text-white hover:bg-gray-600">All Categories</SelectItem>
                    {documentCategories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id} className="text-white hover:bg-gray-600">
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-gray-400" />
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Filter by subject" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="all" className="text-white hover:bg-gray-600">All Subjects</SelectItem>
                    {trainingSubjects.map(subject => (
                      <SelectItem key={subject} value={subject} className="text-white hover:bg-gray-600">
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions Bar */}
        {selectedDocuments.size > 0 && (
          <Card className="bg-emerald-800/20 border-emerald-600/30 backdrop-blur-sm mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-emerald-400 font-medium">
                    {selectedDocuments.size} document{selectedDocuments.size > 1 ? 's' : ''} selected
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedDocuments(new Set())}
                    className="text-gray-400 hover:text-white"
                  >
                    Clear Selection
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkView}
                    disabled={selectedDocuments.size !== 1}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkDownload}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download ({selectedDocuments.size})
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkDelete}
                    className="border-red-600 text-red-400 hover:bg-red-600/20"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete ({selectedDocuments.size})
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Document List */}
        <div className="space-y-4">
          {filteredDocuments.length === 0 ? (
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Documents Found</h3>
                <p className="text-gray-400">Try adjusting your filters or upload a new document to get started.</p>
              </CardContent>
            </Card>
          ) : (
            filteredDocuments.map((doc) => {
              const categoryInfo = getCategoryInfo(doc.category);
              const IconComponent = categoryInfo.icon;
              
              return (
                <Card key={doc.id} className={`bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-200 ${selectedDocuments.has(doc.id) ? 'ring-1 ring-emerald-500 bg-emerald-900/10' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Checkbox
                          checked={selectedDocuments.has(doc.id)}
                          onCheckedChange={() => toggleDocumentSelection(doc.id)}
                          className="border-gray-500"
                        />
                        <div className="flex-shrink-0">
                          <IconComponent className="w-8 h-8 text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-white truncate">{doc.fileName}</h3>
                            <Badge className={categoryInfo.color}>
                              {categoryInfo.name}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300">
                            <div className="flex items-center space-x-1">
                              <BookOpen className="w-4 h-4 text-gray-400" />
                              <span>{doc.trainingSubject}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4 text-gray-400" />
                              <span>{doc.instructorName}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span>{format(doc.trainingDate, 'MMM dd, yyyy')}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span>{doc.studentCount} students</span>
                            </div>
                          </div>
                          {doc.description && (
                            <p className="mt-2 text-sm text-gray-400">{doc.description}</p>
                          )}
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>Size: {formatFileSize(doc.fileSize)}</span>
                            <span>Uploaded: {format(doc.uploadDate, 'MMM dd, yyyy HH:mm')}</span>
                            {doc.expirationDate && (
                              <span className="text-yellow-400">
                                Expires: {format(doc.expirationDate, 'MMM dd, yyyy')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* View Document Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl bg-gray-800 border-gray-700" aria-describedby="document-preview-description">
          <DialogHeader>
            <DialogTitle className="text-white">Document Details</DialogTitle>
          </DialogHeader>
          {viewingDocument && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{viewingDocument.fileName}</h3>
                    <p className="text-gray-300">{viewingDocument.fileType} • {formatFileSize(viewingDocument.fileSize)}</p>
                  </div>
                </div>
                <Badge className={getCategoryInfo(viewingDocument.category).color}>
                  {getCategoryInfo(viewingDocument.category).name}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Training Subject</Label>
                    <p className="text-white font-medium">{viewingDocument.trainingSubject}</p>
                  </div>
                  <div>
                    <Label className="text-gray-300">Instructor</Label>
                    <p className="text-white font-medium">{viewingDocument.instructorName}</p>
                  </div>
                  <div>
                    <Label className="text-gray-300">Training Date</Label>
                    <p className="text-white font-medium">{format(viewingDocument.trainingDate, 'MMMM dd, yyyy')}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Location</Label>
                    <p className="text-white font-medium">{viewingDocument.location}</p>
                  </div>
                  <div>
                    <Label className="text-gray-300">Student Count</Label>
                    <p className="text-white font-medium">{viewingDocument.studentCount} students</p>
                  </div>
                  <div>
                    <Label className="text-gray-300">Upload Date</Label>
                    <p className="text-white font-medium">{format(viewingDocument.uploadDate, 'MMMM dd, yyyy HH:mm')}</p>
                  </div>
                </div>
              </div>

              {viewingDocument.description && (
                <div>
                  <Label className="text-gray-300">Description</Label>
                  <p className="text-white font-medium bg-gray-700/50 p-3 rounded-lg">{viewingDocument.description}</p>
                </div>
              )}

              {viewingDocument.expirationDate && (
                <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-400 font-medium">Expires: {format(viewingDocument.expirationDate, 'MMMM dd, yyyy')}</span>
                  </div>
                </div>
              )}

              <div className="border-t border-gray-700 pt-4">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Document Preview</h4>
                  <div className="bg-gray-600 rounded-lg p-4 max-h-64 overflow-y-auto">
                    <pre className="text-sm text-gray-200 whitespace-pre-wrap font-mono leading-relaxed">
                      {generatePreviewContent(viewingDocument)}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsViewDialogOpen(false)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Close
                </Button>
                {viewingDocument.category === 'sign_in_sheet' && (
                  <Button
                    onClick={() => handleRegenerateDocument(viewingDocument)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print Original
                  </Button>
                )}
                <Button
                  onClick={() => handleDownload(viewingDocument)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
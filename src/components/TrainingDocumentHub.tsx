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
import jsPDF from 'jspdf';

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
  // New fields for uploaded file content
  fileContent?: string;
  fileBlob?: string;
  originalFile?: {
    name: string;
    type: string;
    size: number;
  };
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
  },
  {
    id: 4,
    fileName: 'Safety_Management_System_Analysis_2025-01-21.txt',
    fileType: 'txt',
    category: 'training_file',
    trainingSubject: 'Safety Management System Analysis',
    trainingDate: new Date('2025-01-21'),
    instructorName: 'Gerardo Hernandez',
    studentCount: 47,
    location: 'Safety Management Workspace',
    fileSize: 45120,
    uploadDate: new Date(),
    description: 'Comprehensive safety workspace analysis with SDS and manual organization',
    fileContent: `Training File: Safety Management System Analysis
Date: 2025-01-21
Created: ${new Date().toLocaleString()}
Updated by: Gerardo Hernandez

SAFETY WORKSPACE SUMMARY:
- Workspace: Safety Management System
- Total Files: 47 organized documents
- File Categories: SDS sheets, safety manuals, emergency procedures
- Last Updated: January 21st, 2025
- System Type: Dark themed, branded workspace

FILE ORGANIZATION STRUCTURE:
1. Abatement SDS (27 files) - 5.36 MB
   - Updated: October 28th, 2024
   - Contains chemical safety data sheets for abatement procedures

2. Demo SDS (16 files) - 2.98 MB  
   - Updated: October 28th, 2024
   - Training and demonstration safety data sheets

3. EH&S Manuals (4 files) - 80.78 MB
   - Updated: January 21st, 2025
   - Environmental Health & Safety procedure manuals

WORKSPACE FEATURES:
- Navigation: Home, Workspaces, Activity, Search
- File Management: Filter, View, Select All, Upload, Create, Download
- Sharing & Permissions: Controlled access with user management
- DOM Properties: workspace workspace-files dark branded (className)

TECHNICAL ANALYSIS:
- Base URI: https://ws.onehub.com/workspaces/1425029/files
- Client Dimensions: 1350x1147 pixels
- jQuery Version: 18303268933776429601 (Active)
- File System: Organized folder structure with file count displays

This demonstrates how safety documentation can be efficiently organized using Create File approach.`
  },
  {
    id: 5,
    fileName: 'SDS_Collection_Management_2024-10-28.txt',
    fileType: 'txt',
    category: 'training_file',
    trainingSubject: 'SDS Collection Management',
    trainingDate: new Date('2024-10-28'),
    instructorName: 'Gerardo Hernandez',
    studentCount: 43,
    location: 'Chemical Safety Documentation',
    fileSize: 8340,
    uploadDate: new Date(),
    description: 'Safety Data Sheet collection and chemical documentation management',
    fileContent: `Training File: SDS Collection Management
Date: 2024-10-28
Created: ${new Date().toLocaleString()}
Updated by: Gerardo Hernandez

SDS DOCUMENTATION SUMMARY:
- Total SDS Files: 43 (Abatement: 27, Demo: 16)
- Combined Size: 8.34 MB of safety documentation
- Last Updated: October 28th, 2024
- Organization: Categorized by usage type

ABATEMENT SDS COLLECTION (27 files):
- File Size: 5.36 MB
- Purpose: Chemical safety data for abatement procedures
- Usage: Active remediation and cleanup operations
- Maintenance: Regularly updated for compliance

DEMO SDS COLLECTION (16 files):
- File Size: 2.98 MB  
- Purpose: Training and demonstration materials
- Usage: Safety training sessions and new employee orientation
- Access: Educational reference materials

CHEMICAL SAFETY MANAGEMENT:
- Organized by chemical type and usage category
- Quick access through folder structure
- Version control for regulatory compliance
- Easy search and retrieval system

COMPLIANCE FEATURES:
- Regulatory requirement tracking
- Expiration date monitoring
- Update notification system
- Access permission management

This shows how chemical safety documentation fits perfectly with Create File organization.`
  },
  {
    id: 6,
    fileName: 'EHS_Manual_Collection_2025-01-21.txt',
    fileType: 'txt',
    category: 'training_file',
    trainingSubject: 'EH&S Manual Collection',
    trainingDate: new Date('2025-01-21'),
    instructorName: 'Gerardo Hernandez',
    studentCount: 4,
    location: 'Environmental Health & Safety',
    fileSize: 80780,
    uploadDate: new Date(),
    description: 'Environmental Health & Safety manual collection and procedure documentation',
    fileContent: `Training File: EH&S Manual Collection
Date: 2025-01-21
Created: ${new Date().toLocaleString()}
Updated by: Gerardo Hernandez

EH&S MANUAL SUMMARY:
- Collection: 4 comprehensive safety manuals
- Total Size: 80.78 MB of detailed procedures
- Last Updated: January 21st, 2025
- Content: Environmental Health & Safety protocols

MANUAL ORGANIZATION:
1. Emergency Response Procedures
2. Environmental Compliance Guidelines  
3. Health & Safety Training Protocols
4. Workplace Safety Standards

DOCUMENT CHARACTERISTICS:
- Comprehensive procedure documentation
- Large file sizes indicating detailed content
- Recent updates showing active maintenance
- Critical safety information repository

WORKSPACE INTEGRATION:
- Organized within Safety Management System
- Shared permissions for authorized personnel
- Version control for regulatory compliance
- Easy access through folder navigation

COMPLIANCE FEATURES:
- Environmental regulations adherence
- Health safety standard documentation
- Emergency procedure protocols
- Regular update and review cycles

USAGE TRACKING:
- Training reference materials
- Compliance audit documentation
- Emergency response guidelines
- Safety protocol enforcement

This demonstrates how comprehensive safety manuals can be organized using the Create File system for maximum accessibility and compliance management.`
  }
];

export default function TrainingDocumentHub() {
  const [documents, setDocuments] = useState<TrainingDocument[]>(() => {
    // Load existing documents from localStorage on component mount
    const savedDocuments = localStorage.getItem('trainingDocuments');
    console.log('TrainingDocumentHub: Loading documents...', savedDocuments ? 'Found saved documents' : 'Using mock documents');
    const docs = savedDocuments ? JSON.parse(savedDocuments) : mockDocuments;
    console.log('TrainingDocumentHub: Loaded documents count:', docs.length);
    return docs;
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<{ from: string; to: string }>({ from: '', to: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<TrainingDocument | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<Set<number>>(new Set());
  const [uploadData, setUploadData] = useState({
    trainingDate: '',
    description: ''
  });
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [previewFiles, setPreviewFiles] = useState<Array<{
    file: File;
    content: string;
    blob: string;
  }>>([]);
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

  // Filter documents based on search term and date only
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchTerm === '' || 
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.instructorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.trainingSubject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Date filtering
    let matchesDate = true;
    if (dateFilter.from || dateFilter.to) {
      const docDate = new Date(doc.trainingDate);
      if (dateFilter.from) {
        const fromDate = new Date(dateFilter.from);
        matchesDate = matchesDate && docDate >= fromDate;
      }
      if (dateFilter.to) {
        const toDate = new Date(dateFilter.to);
        matchesDate = matchesDate && docDate <= toDate;
      }
    }
    
    return matchesSearch && matchesDate;
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

  // Handle multiple file selection
  const handleFileSelection = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setSelectedFiles(files);
    
    // Process each file for preview
    const filePromises = Array.from(files).map(async (file) => {
      let fileContent = '';
      let fileBlob: string = '';

      // Read file content for preview
      if (file.type === 'application/pdf') {
        // For PDF files, we'll show basic info since PDF parsing requires additional setup
        fileContent = `PDF Document: ${file.name}\nSize: ${formatFileSize(file.size)}\nType: ${file.type}`;
      } else if (file.type.includes('text') || file.name.endsWith('.txt')) {
        const text = await file.text();
        fileContent = text.slice(0, 500) + (text.length > 500 ? '...' : '');
      } else {
        fileContent = `File: ${file.name}\nSize: ${formatFileSize(file.size)}\nType: ${file.type}\nUploaded: ${new Date().toLocaleString()}`;
      }

      // Create blob URL for download
      fileBlob = URL.createObjectURL(file);

      return { file, content: fileContent, blob: fileBlob };
    });

    const processedFiles = await Promise.all(filePromises);
    setPreviewFiles(processedFiles);
  };

  // Handle creating training file with optional attachments
  const handleFinalUpload = async () => {
    // Validate required fields
    if (!uploadData.trainingDate || !uploadData.description) {
      toast({
        title: "Missing Information", 
        description: "Please fill in training date and description.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Create main training file document
      const mainDocument = {
        id: Date.now(),
        fileName: `${uploadData.description}_${uploadData.trainingDate}.txt`,
        fileSize: 1024, // Estimated size for text content
        fileType: 'txt',
        uploadDate: new Date().toISOString(),
        category: 'training_file',
        trainingSubject: uploadData.description,
        trainingDate: uploadData.trainingDate,
        instructorName: 'Training Instructor',
        studentCount: 0,
        location: '',
        description: uploadData.description,
        content: `Training File: ${uploadData.description}\nDate: ${uploadData.trainingDate}\nCreated: ${new Date().toLocaleString()}\n\nThis training file can contain multiple attachments and related documents.`,
        fileBlob: null,
        attachments: previewFiles.length
      };

      // Process any attached files
      let allDocuments = [mainDocument];
      
      if (selectedFiles && selectedFiles.length > 0) {
        const attachmentPromises = Array.from(selectedFiles).map(async (file, index) => {
          const previewFile = previewFiles[index];
          
          return {
            id: Date.now() + index + 1,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            uploadDate: new Date().toISOString(),
            category: 'attachment',
            trainingSubject: uploadData.description,
            trainingDate: uploadData.trainingDate,
            instructorName: 'Training Instructor',
            studentCount: 0,
            location: '',
            description: `Attachment for: ${uploadData.description}`,
            content: previewFile.content,
            fileBlob: previewFile.blob,
            parentFile: mainDocument.id
          };
        });

        const attachments = await Promise.all(attachmentPromises);
        allDocuments = [...allDocuments, ...attachments];
      }
      
      // Update documents list
      const updatedDocuments = [...allDocuments, ...documents];
      setDocuments(updatedDocuments);
      
      // Save to localStorage
      localStorage.setItem('trainingDocuments', JSON.stringify(updatedDocuments));

      // Reset form and state
      setUploadData({
        trainingDate: '',
        description: ''
      });
      setSelectedFiles(null);
      setPreviewFiles([]);
      setIsUploadDialogOpen(false);

      toast({
        title: "Training File Created",
        description: `${uploadData.description} created with ${previewFiles.length} attachment${previewFiles.length !== 1 ? 's' : ''}.`,
      });

    } catch (error) {
      console.error('Creation error:', error);
      toast({
        title: "Creation Failed",
        description: "There was an error creating the training file.",
        variant: "destructive",
      });
    }
  };

  // Handle document view
  const handleView = (doc: TrainingDocument) => {
    setViewingDocument(doc);
    setIsViewDialogOpen(true);
  };

  // Handle document regeneration/print
  const handleRegenerateDocument = (doc: TrainingDocument) => {
    if (doc.category === 'sign_in_sheet') {
      // Generate PDF version of the sign-in sheet
      generatePDFSignInSheet(doc);

      const hasOriginalData = doc.generatedEmployees && doc.generatedEmployees.length > 0;
      toast({
        title: "PDF Generated",
        description: hasOriginalData 
          ? `${doc.fileName} has been regenerated as PDF with original employee data.`
          : `${doc.fileName} has been regenerated as PDF with training data.`,
      });
    } else {
      toast({
        title: "Cannot Regenerate",
        description: "Only sign-in sheets can be regenerated.",
        variant: "destructive"
      });
    }
  };

  // Generate PDF sign-in sheet
  const generatePDFSignInSheet = (doc: TrainingDocument) => {
    const pdf = new jsPDF();
    
    // Set up document
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TRAINING SIGN-IN SHEET', 105, 25, { align: 'center' });
    
    // Training details
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    
    const timeRange = doc.startTime && doc.endTime ? ` (${doc.startTime} - ${doc.endTime})` : '';
    const credentials = doc.instructorCredentials ? ` - ${doc.instructorCredentials}` : '';
    const company = doc.instructorCompany ? ` (${doc.instructorCompany})` : '';
    const standard = doc.oshaStandard || doc.customReference || 'N/A';
    
    let yPos = 45;
    pdf.text(`Training Subject: ${doc.trainingSubject}${timeRange}`, 20, yPos);
    yPos += 8;
    pdf.text(`Date: ${format(doc.trainingDate, 'MMMM dd, yyyy')}`, 20, yPos);
    yPos += 8;
    pdf.text(`Instructor: ${doc.instructorName}${credentials}${company}`, 20, yPos);
    yPos += 8;
    pdf.text(`Location: ${doc.location}`, 20, yPos);
    yPos += 8;
    pdf.text(`Total Students: ${doc.studentCount}`, 20, yPos);
    yPos += 8;
    pdf.text(`OSHA/Regulatory Standard: ${standard}`, 20, yPos);
    yPos += 12;

    if (doc.description) {
      pdf.text(`Description: ${doc.description}`, 20, yPos);
      yPos += 12;
    }
    
    // Student attendance section
    pdf.setFont('helvetica', 'bold');
    pdf.text('STUDENT ATTENDANCE:', 20, yPos);
    yPos += 10;
    
    // Header for attendance
    pdf.setFont('helvetica', 'normal');
    pdf.text('Name', 20, yPos);
    pdf.text('Signature', 120, yPos);
    pdf.line(20, yPos + 2, 190, yPos + 2); // Header underline
    yPos += 10;
    
    // Generate attendee list
    let attendeeNames: string[] = [];
    if (doc.generatedEmployees && doc.generatedEmployees.length > 0) {
      attendeeNames = doc.generatedEmployees.map(emp => emp.name);
    } else {
      // Fallback realistic names
      const fallbackNames = [
        'John Smith', 'Maria Garcia', 'David Johnson', 'Sarah Wilson', 
        'Michael Brown', 'Jennifer Davis', 'Robert Miller', 'Lisa Anderson',
        'James Taylor', 'Jessica Martinez', 'Christopher Lee', 'Amanda White',
        'Daniel Garcia', 'Ashley Thompson', 'Matthew Jackson', 'Emily Rodriguez'
      ];
      attendeeNames = fallbackNames.slice(0, doc.studentCount || 8);
    }
    
    // Add attendees with signature lines
    attendeeNames.forEach((name, index) => {
      if (yPos > 250) { // Start new page if needed
        pdf.addPage();
        yPos = 30;
      }
      
      pdf.text(`${(index + 1).toString().padStart(2, '0')}. ${name}`, 20, yPos);
      pdf.line(120, yPos, 180, yPos); // Signature line
      yPos += 12;
    });
    
    // Instructor signature section
    yPos += 10;
    if (yPos > 250) {
      pdf.addPage();
      yPos = 30;
    }
    
    pdf.text(`Instructor Signature: ________________    Date: ${format(doc.trainingDate, 'MM/dd/yyyy')}`, 20, yPos);
    yPos += 15;
    
    // Footer
    pdf.setFontSize(10);
    pdf.text('This document serves as an official attendance record for the training session.', 20, yPos);
    pdf.text('Generated from SafetySync.AI Training Document Hub', 20, yPos + 8);
    
    // Download the PDF
    const fileName = doc.fileName.replace('.pdf', '_REGENERATED.pdf');
    pdf.save(fileName);
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
    // If document has actual file content, show it first
    if (doc.fileContent && doc.fileContent !== '') {
      if (doc.fileContent === 'PDF_CONTENT_AVAILABLE') {
        return `PDF DOCUMENT PREVIEW

File: ${doc.fileName}
Type: ${doc.fileType}
Size: ${formatFileSize(doc.fileSize)}
Uploaded: ${format(doc.uploadDate, 'MMMM dd, yyyy HH:mm')}

Training Details:
Subject: ${doc.trainingSubject}
Date: ${format(doc.trainingDate, 'MMMM dd, yyyy')}
Instructor: ${doc.instructorName}
Location: ${doc.location || 'N/A'}
Student Count: ${doc.studentCount || 'N/A'}

Description: ${doc.description || 'No description provided'}

This is your uploaded PDF file. Click "Print Original" to regenerate as a formatted PDF, or "Download" to access the original file.`;
      } else if (doc.fileContent.startsWith('FILE_UPLOADED:')) {
        return `UPLOADED FILE PREVIEW

${doc.fileContent}

File Details:
Type: ${doc.fileType}
Size: ${formatFileSize(doc.fileSize)}
Uploaded: ${format(doc.uploadDate, 'MMMM dd, yyyy HH:mm')}

Training Details:
Subject: ${doc.trainingSubject}
Date: ${format(doc.trainingDate, 'MMMM dd, yyyy')}
Instructor: ${doc.instructorName}
Location: ${doc.location || 'N/A'}
Student Count: ${doc.studentCount || 'N/A'}

Description: ${doc.description || 'No description provided'}`;
      } else {
        // Show actual text content
        return `FILE CONTENT PREVIEW

File: ${doc.fileName}
Type: ${doc.fileType}
Size: ${formatFileSize(doc.fileSize)}
Uploaded: ${format(doc.uploadDate, 'MMMM dd, yyyy HH:mm')}

--- ACTUAL FILE CONTENT ---
${doc.fileContent}

--- TRAINING METADATA ---
Subject: ${doc.trainingSubject}
Date: ${format(doc.trainingDate, 'MMMM dd, yyyy')}
Instructor: ${doc.instructorName}
Location: ${doc.location || 'N/A'}
Student Count: ${doc.studentCount || 'N/A'}
Description: ${doc.description || 'No description provided'}`;
      }
    }

    // Fallback to generated content for documents created by sign-in generator
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

      // If we have the original uploaded file, download that
      if (doc.fileBlob) {
        const link = document.createElement('a');
        link.href = doc.fileBlob;
        link.download = doc.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Download Complete",
          description: `Original file ${doc.fileName} has been downloaded.`,
        });
        return;
      }

      // Create mock document content based on category for generated documents
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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 p-6">
      {/* Floating tech icons background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-8 h-8 bg-blue-500/10 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-6 h-6 bg-violet-500/10 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-40 left-20 w-10 h-10 bg-purple-500/10 rounded-full animate-pulse delay-2000" />
        <div className="absolute bottom-20 right-10 w-4 h-4 bg-yellow-500/10 rounded-full animate-pulse delay-3000" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Training Document Hub</h1>
              <p className="text-white text-lg">Centralized training documentation and record management</p>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create File
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-black/20 backdrop-blur-sm border-blue-700" aria-describedby="create-file-description">
                  <DialogHeader>
                    <DialogTitle className="text-white">Create Training File</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {/* Simplified form - only training date and description */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="trainingDate" className="text-white">Training Date *</Label>
                        <Input
                          id="trainingDate"
                          type="date"
                          value={uploadData.trainingDate}
                          onChange={(e) => setUploadData(prev => ({ ...prev, trainingDate: e.target.value }))}
                          className="bg-blue-600 border-blue-500 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description" className="text-white">Folder Description *</Label>
                        <Input
                          id="description"
                          value={uploadData.description}
                          onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="e.g., Forklift Safety Training, Fire Drill Session"
                          className="bg-blue-600 border-blue-500 text-white"
                        />
                      </div>
                    </div>
                    
                    {/* Multiple file upload */}
                    <div>
                      <Label className="text-white">Add Files to This Training Record</Label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={(e) => handleFileSelection(e.target.files)}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.xlsx,.xls"
                      />
                      <Button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-blue-600  text-white w-full"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Add Files
                      </Button>
                    </div>
                    
                    {/* File previews */}
                    {previewFiles.length > 0 && (
                      <div className="space-y-4">
                        <Label className="text-white">File Previews ({previewFiles.length} files selected)</Label>
                        <div className="max-h-64 overflow-y-auto space-y-2">
                          {previewFiles.map((fileData, index) => (
                            <Card key={index} className="bg-black/20 border-blue-700 backdrop-blur-sm">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <FileText className="w-4 h-4 text-blue-400" />
                                      <span className="text-white font-medium">{fileData.file.name}</span>
                                      <span className="text-white text-sm">({formatFileSize(fileData.file.size)})</span>
                                    </div>
                                    <div className="text-white text-sm bg-blue-700 p-2 rounded max-h-20 overflow-y-auto font-mono">
                                      {fileData.content}
                                    </div>
                                  </div>
                                  <div className="flex gap-2 ml-4">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => window.open(fileData.blob, '_blank')}
                                      className="border-blue-500 text-white "
                                    >
                                      <Download className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => window.print()}
                                      className="border-blue-500 text-white "
                                    >
                                      <Printer className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Action buttons */}
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsUploadDialogOpen(false);
                          setSelectedFiles(null);
                          setPreviewFiles([]);
                          setUploadData({ trainingDate: '', description: '' });
                        }}
                        className="border-blue-500 text-white "
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleFinalUpload}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Training File
                        {previewFiles.length > 0 && ` with ${previewFiles.length} Attachment${previewFiles.length > 1 ? 's' : ''}`}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>



        {/* Search Only */}
        <Card className="bg-black/20 border-blue-700 backdrop-blur-sm mb-6">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-white" />
                <Input
                  placeholder="Search training files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 bg-blue-600 border-blue-500 text-white"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-white" />
                <Input
                  type="date"
                  placeholder="From date"
                  value={dateFilter.from}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, from: e.target.value }))}
                  className="w-40 bg-blue-600 border-blue-500 text-white"
                />
                <span className="text-white">to</span>
                <Input
                  type="date"
                  placeholder="To date"
                  value={dateFilter.to}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, to: e.target.value }))}
                  className="w-40 bg-blue-600 border-blue-500 text-white"
                />
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
                  <div className="text-violet-400 font-medium">
                    {selectedDocuments.size} document{selectedDocuments.size > 1 ? 's' : ''} selected
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedDocuments(new Set())}
                    className="text-blue-100 "
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
                    className="border-blue-500 text-white  disabled:opacity-50"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkDownload}
                    className="border-blue-500 text-white "
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
            <Card className="bg-black/20 border-blue-700 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Documents Found</h3>
                <p className="text-white">Try adjusting your filters or upload a new document to get started.</p>
              </CardContent>
            </Card>
          ) : (
            filteredDocuments.map((doc) => {
              const categoryInfo = getCategoryInfo(doc.category);
              const IconComponent = categoryInfo.icon;
              
              return (
                <Card key={doc.id} className={`bg-black/20 border-blue-700 backdrop-blur-sm hover:bg-black/30  ${selectedDocuments.has(doc.id) ? 'ring-1 ring-emerald-500 bg-emerald-900/10' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Checkbox
                          checked={selectedDocuments.has(doc.id)}
                          onCheckedChange={() => toggleDocumentSelection(doc.id)}
                          className="border-blue-400"
                        />
                        <div className="flex-shrink-0">
                          <IconComponent className="w-8 h-8 text-violet-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-white truncate">{doc.fileName}</h3>
                            <Badge className={categoryInfo.color}>
                              {categoryInfo.name}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-white">
                            <div className="flex items-center space-x-1">
                              <BookOpen className="w-4 h-4 text-white" />
                              <span>{doc.trainingSubject}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4 text-white" />
                              <span>{doc.instructorName}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4 text-white" />
                              <span>{format(doc.trainingDate, 'MMM dd, yyyy')}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4 text-white" />
                              <span>{doc.studentCount} students</span>
                            </div>
                          </div>
                          {doc.description && (
                            <p className="mt-2 text-sm text-white">{doc.description}</p>
                          )}
                          <div className="flex items-center space-x-4 mt-2 text-xs text-blue-400">
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
        <DialogContent className="max-w-3xl bg-black/20 backdrop-blur-sm border-blue-700" aria-describedby="document-preview-description">
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
                    <p className="text-white">{viewingDocument.fileType} • {formatFileSize(viewingDocument.fileSize)}</p>
                  </div>
                </div>
                <Badge className={getCategoryInfo(viewingDocument.category).color}>
                  {getCategoryInfo(viewingDocument.category).name}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Training Subject</Label>
                    <p className="text-white font-medium">{viewingDocument.trainingSubject}</p>
                  </div>
                  <div>
                    <Label className="text-white">Instructor</Label>
                    <p className="text-white font-medium">{viewingDocument.instructorName}</p>
                  </div>
                  <div>
                    <Label className="text-white">Training Date</Label>
                    <p className="text-white font-medium">{format(viewingDocument.trainingDate, 'MMMM dd, yyyy')}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Location</Label>
                    <p className="text-white font-medium">{viewingDocument.location}</p>
                  </div>
                  <div>
                    <Label className="text-white">Student Count</Label>
                    <p className="text-white font-medium">{viewingDocument.studentCount} students</p>
                  </div>
                  <div>
                    <Label className="text-white">Upload Date</Label>
                    <p className="text-white font-medium">{format(viewingDocument.uploadDate, 'MMMM dd, yyyy HH:mm')}</p>
                  </div>
                </div>
              </div>

              {viewingDocument.description && (
                <div>
                  <Label className="text-white">Description</Label>
                  <p className="text-white font-medium bg-blue-600/50 p-3 rounded-lg">{viewingDocument.description}</p>
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

              <div className="border-t border-blue-600 pt-4">
                <div className="bg-blue-600/50 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Document Preview</h4>
                  <div className="bg-blue-500 rounded-lg p-4 max-h-64 overflow-y-auto">
                    <pre className="text-sm text-blue-200 whitespace-pre-wrap font-mono leading-relaxed">
                      {generatePreviewContent(viewingDocument)}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsViewDialogOpen(false)}
                  className="border-blue-500 text-white "
                >
                  Close
                </Button>
                {viewingDocument.category === 'sign_in_sheet' && (
                  <Button
                    onClick={() => handleRegenerateDocument(viewingDocument)}
                    className="bg-blue-600  text-white"
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
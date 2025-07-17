import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
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
  UserPlus,
  Eye,
  Trash2,
  Building,
  Search,
  Settings,
  RefreshCw,
  AlertCircle,
  FileCheck,
  Mail,
  BarChart3,
  Filter,
  Archive,
  Send,
  Copy,
  Share,
  Printer,
  FileSpreadsheet,
  Bell,
  BellRing,
  ExternalLink,
  Star,
  History,
  Calendar as CalendarIcon,
  GraduationCap,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import jsPDF from 'jspdf';
import { StudentAutocomplete } from "./student-autocomplete";
import { ExternalStudentManager } from "./external-student-manager";

// Sample instructors for dropdown selection
const SAMPLE_INSTRUCTORS = [
  { id: 'john-smith', name: 'John Smith', credentials: 'OSHA Authorized, CSP' },
  { id: 'sarah-johnson', name: 'Sarah Johnson', credentials: 'CIH, CHST' },
  { id: 'mike-rodriguez', name: 'Mike Rodriguez', credentials: 'OSHA 500, CSHO' },
  { id: 'lisa-chen', name: 'Lisa Chen', credentials: 'CSP, CIH, SHEP' },
  { id: 'david-williams', name: 'David Williams', credentials: 'OSHA Authorized, CHST' },
  { id: 'jennifer-brown', name: 'Jennifer Brown', credentials: 'CIH, OHST' }
];

interface Employee {
  id: string;
  name: string;
  employeeId: string;
  company: string;
  signature?: string;
  type?: 'internal' | 'external';
  email?: string;
  phone?: string;
  position?: string;
  department?: string;
}

interface InstructorDocument {
  id: string;
  instructorId: string;
  fileName: string;
  fileType: string;
  uploadDate: string;
  documentType: 'certificate' | 'resume' | 'credential' | 'other';
  fileSize: number;
  selected?: boolean;
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
  customReference: string;
  employees: Employee[];
  createdAt: string;
  status: 'draft' | 'generated' | 'completed' | 'uploaded';
  signedDocuments?: SignedDocument[];
  signatureWorkflow?: SignatureWorkflow;
}

interface SignedDocument {
  id: string;
  fileName: string;
  fileType: string;
  uploadDate: string;
  fileSize: number;
  signatureCount: number;
  uploadedBy: string;
  verified: boolean;
}

interface SignatureWorkflow {
  id: string;
  sheetId: string;
  status: 'pending' | 'in_progress' | 'completed';
  generatedDate: string;
  completedDate?: string;
  totalSignatures: number;
  receivedSignatures: number;
  notifications: WorkflowNotification[];
}

interface WorkflowNotification {
  id: string;
  type: 'reminder' | 'completion' | 'upload';
  message: string;
  timestamp: string;
  acknowledged: boolean;
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
    customReference: '',
    employees: []
  });
  const [newEmployee, setNewEmployee] = useState({ name: '', employeeId: '', company: '' });
  const [savedSheets, setSavedSheets] = useState<SignInSheet[]>([]);
  const [activeTab, setActiveTab] = useState<'create' | 'saved'>('create');
  const [selectedStudents, setSelectedStudents] = useState<any[]>([]);
  const [isCustomTraining, setIsCustomTraining] = useState(false);
  const [customClassName, setCustomClassName] = useState('');
  const [customStandard, setCustomStandard] = useState('');
  const [instructorType, setInstructorType] = useState<'existing' | 'visiting'>('existing');
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [instructorDocuments, setInstructorDocuments] = useState<InstructorDocument[]>([]);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [signatureWorkflowMode, setSignatureWorkflowMode] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<SignedDocument[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<SignInSheet | null>(null);
  const { toast } = useToast();

  // Advanced features state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoReminders, setAutoReminders] = useState(true);
  const [selectedSheetsForBulk, setSelectedSheetsForBulk] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterInstructor, setFilterInstructor] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [templateSettings, setTemplateSettings] = useState({
    includeCompanyLogo: true,
    includeInstructorPhoto: false,
    includeQRCode: true,
    customHeaderText: '',
    customFooterText: ''
  });
  const [bulkOperationMode, setBulkOperationMode] = useState(false);
  const [showReportingDialog, setShowReportingDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [reportType, setReportType] = useState<'summary' | 'detailed' | 'analytics'>('summary');
  const [reportDateRange, setReportDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: '1', type: 'reminder', message: 'Training session reminder for Fall Protection Training', timestamp: new Date().toISOString(), read: false },
    { id: '2', type: 'completion', message: 'Signed documents uploaded for HAZCOM Training', timestamp: new Date().toISOString(), read: false },
    { id: '3', type: 'upload', message: 'New instructor documents uploaded', timestamp: new Date().toISOString(), read: true }
  ]);

  // Advanced UI Features State
  const [showQuickActionMenu, setShowQuickActionMenu] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [showHelpBubbles, setShowHelpBubbles] = useState(false);
  const [helpBubbleTarget, setHelpBubbleTarget] = useState<string | null>(null);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<string | null>(null);
  const [gamificationScore, setGamificationScore] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);

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

  const handleStudentSelect = (student: any) => {
    // Convert selected student to Employee format
    const employee: Employee = {
      id: `${student.type}-${student.id}`,
      name: `${student.firstName} ${student.lastName}`,
      employeeId: student.type === 'internal' ? student.employeeId : student.email,
      company: student.type === 'internal' ? 'Internal Employee' : student.company,
      type: student.type,
      email: student.email,
      phone: student.phone,
      position: student.position,
      department: student.department
    };
    
    setSelectedStudents(prev => [...prev, student]);
    setFormData(prev => ({
      ...prev,
      employees: [...(prev.employees || []), employee]
    }));
    
    toast({
      title: "Student Added",
      description: `${employee.name} has been added to the training session.`,
    });
  };

  const removeStudent = (studentId: string, studentType: 'internal' | 'external') => {
    const employeeId = `${studentType}-${studentId}`;
    
    setSelectedStudents(prev => 
      prev.filter(student => `${student.type}-${student.id}` !== employeeId)
    );
    
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

  // Get OSHA/ANSI recommended duration based on training type
  const getRecommendedDuration = (trainingType: string): string => {
    const durations: { [key: string]: string } = {
      'fall-protection': '8 hours (OSHA 29 CFR 1926.503)',
      'hazwoper': '40 hours initial, 8 hours annual (OSHA 29 CFR 1910.120)',
      'confined-space': '8 hours (OSHA 29 CFR 1910.146)',
      'lockout-tagout': '4 hours (OSHA 29 CFR 1910.147)',
      'respiratory-protection': '4 hours (OSHA 29 CFR 1910.134)',
      'hearing-conservation': '2 hours (OSHA 29 CFR 1910.95)',
      'bloodborne-pathogens': '1 hour (OSHA 29 CFR 1910.1030)',
      'hazard-communication': '4 hours (OSHA 29 CFR 1910.1200)',
      'personal-protective-equipment': '4 hours (OSHA 29 CFR 1910.132)',
      'electrical-safety': '8 hours (OSHA 29 CFR 1910.331)',
      'machine-guarding': '4 hours (OSHA 29 CFR 1910.212)',
      'crane-rigging': '40 hours (OSHA 29 CFR 1926.1427)',
      'scaffolding': '8 hours (OSHA 29 CFR 1926.451)',
      'ladder-safety': '2 hours (OSHA 29 CFR 1926.1053)',
      'first-aid-cpr': '8 hours (ANSI/ACLS standards)',
      'forklift-operator': '4 hours (OSHA 29 CFR 1910.178)',
      'trenching-excavation': '8 hours (OSHA 29 CFR 1926.651)',
      'silica-awareness': '4 hours (OSHA 29 CFR 1926.1153)',
      'asbestos-awareness': '16 hours (OSHA 29 CFR 1926.1101)',
      'lead-safety': '8 hours (OSHA 29 CFR 1926.62)'
    };
    
    if (formData.trainingType === 'custom') {
      return 'Custom duration - refer to applicable standards';
    }
    
    return durations[trainingType] || 'Duration varies - consult OSHA standards';
  };

  // Handle document upload
  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const currentInstructorId = selectedInstructor || 'visiting';
    
    Array.from(files).forEach(file => {
      const newDocument: InstructorDocument = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        instructorId: currentInstructorId,
        fileName: file.name,
        fileType: file.type,
        uploadDate: new Date().toISOString(),
        documentType: file.name.toLowerCase().includes('resume') ? 'resume' : 
                      file.name.toLowerCase().includes('cert') ? 'certificate' : 
                      file.name.toLowerCase().includes('credential') ? 'credential' : 'other',
        fileSize: file.size,
        selected: false
      };

      setInstructorDocuments(prev => [...prev, newDocument]);
    });

    toast({
      title: "Documents Uploaded",
      description: `${files.length} document(s) uploaded successfully`,
      duration: 3000
    });

    // Reset the input
    event.target.value = '';
  };

  // Toggle document selection
  const toggleDocumentSelection = (documentId: string) => {
    setSelectedDocuments(prev => 
      prev.includes(documentId) 
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  // Download selected documents with format selection
  const downloadSelectedDocuments = (format: 'pdf' | 'word' | 'excel' = 'pdf') => {
    if (selectedDocuments.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select documents to download",
        variant: "destructive"
      });
      return;
    }

    const documentsToDownload = instructorDocuments.filter(doc => 
      selectedDocuments.includes(doc.id)
    );

    if (format === 'pdf') {
      downloadAsPDF(documentsToDownload, 'instructor-documents');
    } else if (format === 'word') {
      downloadAsWord(documentsToDownload, 'instructor-documents');
    } else if (format === 'excel') {
      downloadAsExcel(documentsToDownload, 'instructor-documents');
    }

    toast({
      title: "Download Started",
      description: `Downloading ${selectedDocuments.length} document(s) as ${format.toUpperCase()}`,
      duration: 3000
    });
  };

  // Download single document
  const downloadSingleDocument = (doc: InstructorDocument, format: 'pdf' | 'word' | 'excel' = 'pdf') => {
    if (format === 'pdf') {
      downloadAsPDF([doc], doc.fileName.replace(/\.[^/.]+$/, ''));
    } else if (format === 'word') {
      downloadAsWord([doc], doc.fileName.replace(/\.[^/.]+$/, ''));
    } else if (format === 'excel') {
      downloadAsExcel([doc], doc.fileName.replace(/\.[^/.]+$/, ''));
    }

    toast({
      title: "Download Started",
      description: `Downloading ${doc.fileName} as ${format.toUpperCase()}`,
      duration: 3000
    });
  };

  // Delete single document
  const deleteDocument = (documentId: string) => {
    setInstructorDocuments(prev => prev.filter(doc => doc.id !== documentId));
    setSelectedDocuments(prev => prev.filter(id => id !== documentId));
    
    toast({
      title: "Document Deleted",
      description: "Document has been removed successfully",
      duration: 3000
    });
  };

  // Delete selected documents
  const deleteSelectedDocuments = () => {
    if (selectedDocuments.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select documents to delete",
        variant: "destructive"
      });
      return;
    }

    setInstructorDocuments(prev => 
      prev.filter(doc => !selectedDocuments.includes(doc.id))
    );
    setSelectedDocuments([]);

    toast({
      title: "Documents Deleted",
      description: `${selectedDocuments.length} document(s) removed successfully`,
      duration: 3000
    });
  };

  // Get current instructor documents
  const getCurrentInstructorDocuments = () => {
    const currentInstructorId = selectedInstructor || 'visiting';
    return instructorDocuments.filter(doc => doc.instructorId === currentInstructorId);
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Download as PDF
  const downloadAsPDF = (documents: InstructorDocument[], filename: string) => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = 20;

    // Title
    doc.setFontSize(16);
    doc.text('Instructor Documents', 20, yPosition);
    yPosition += 20;

    // Document list
    doc.setFontSize(12);
    documents.forEach((docItem, index) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }

      doc.text(`${index + 1}. ${docItem.fileName}`, 20, yPosition);
      yPosition += 10;
      doc.text(`   Type: ${docItem.documentType}`, 20, yPosition);
      yPosition += 10;
      doc.text(`   Size: ${formatFileSize(docItem.fileSize)}`, 20, yPosition);
      yPosition += 10;
      doc.text(`   Uploaded: ${new Date(docItem.uploadDate).toLocaleDateString()}`, 20, yPosition);
      yPosition += 15;
    });

    doc.save(`${filename}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Download as Word
  const downloadAsWord = async (documents: InstructorDocument[], filename: string) => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Instructor Documents",
                bold: true,
                size: 32
              })
            ]
          }),
          new Paragraph({ text: "" }), // Empty paragraph for spacing
          ...documents.flatMap((docItem, index) => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${index + 1}. ${docItem.fileName}`,
                  bold: true,
                  size: 24
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Type: ${docItem.documentType}`,
                  size: 20
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Size: ${formatFileSize(docItem.fileSize)}`,
                  size: 20
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Uploaded: ${new Date(docItem.uploadDate).toLocaleDateString()}`,
                  size: 20
                })
              ]
            }),
            new Paragraph({ text: "" }) // Empty paragraph for spacing
          ])
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.docx`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download as Excel
  const downloadAsExcel = (documents: InstructorDocument[], filename: string) => {
    const worksheetData = [
      ['Document Name', 'Type', 'File Size', 'Upload Date'],
      ...documents.map(doc => [
        doc.fileName,
        doc.documentType,
        formatFileSize(doc.fileSize),
        new Date(doc.uploadDate).toLocaleDateString()
      ])
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Instructor Documents');
    XLSX.writeFile(workbook, `${filename}-${new Date().toISOString().split('T')[0]}.xlsx`);
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
      customReference: formData.customReference || '',
      employees: formData.employees || [],
      createdAt: new Date().toISOString(),
      status: 'generated'
    };

    setSavedSheets(prev => [...prev, sheet]);
    
    // Generate and download the printable form
    generatePrintableForm(sheet);
    
    // Initialize signature workflow
    initializeSignatureWorkflow(sheet);
    
    toast({
      title: "Sign-In Sheet Generated",
      description: `Generated for ${sheet.employees.length} employees. Ready to print and use in class.`,
      duration: 4000
    });
  };

  // Initialize signature workflow
  const initializeSignatureWorkflow = (sheet: SignInSheet) => {
    const workflow: SignatureWorkflow = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      sheetId: sheet.id,
      status: 'pending',
      generatedDate: new Date().toISOString(),
      totalSignatures: sheet.employees.length,
      receivedSignatures: 0,
      notifications: [
        {
          id: Date.now().toString(),
          type: 'completion',
          message: 'Sign-in sheet generated and ready for signatures',
          timestamp: new Date().toISOString(),
          acknowledged: false
        }
      ]
    };

    // Update sheet with workflow
    setSavedSheets(prev => 
      prev.map(s => 
        s.id === sheet.id 
          ? { ...s, signatureWorkflow: workflow }
          : s
      )
    );
  };

  // Handle signed document upload
  const handleSignedDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>, sheetId: string) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const sheet = savedSheets.find(s => s.id === sheetId);
    if (!sheet) return;

    Array.from(files).forEach(file => {
      const signedDoc: SignedDocument = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        fileName: file.name,
        fileType: file.type,
        uploadDate: new Date().toISOString(),
        fileSize: file.size,
        signatureCount: sheet.employees.length, // Assume all signed for now
        uploadedBy: 'Current User',
        verified: false
      };

      // Update sheet with signed document
      setSavedSheets(prev => 
        prev.map(s => 
          s.id === sheetId 
            ? { 
                ...s, 
                signedDocuments: [...(s.signedDocuments || []), signedDoc],
                status: 'uploaded',
                signatureWorkflow: s.signatureWorkflow ? {
                  ...s.signatureWorkflow,
                  status: 'completed',
                  completedDate: new Date().toISOString(),
                  receivedSignatures: sheet.employees.length,
                  notifications: [
                    ...(s.signatureWorkflow.notifications || []),
                    {
                      id: Date.now().toString(),
                      type: 'upload',
                      message: `Signed document uploaded: ${file.name}`,
                      timestamp: new Date().toISOString(),
                      acknowledged: false
                    }
                  ]
                } : undefined
              }
            : s
        )
      );
    });

    toast({
      title: "Signed Document Uploaded",
      description: `${files.length} signed document(s) uploaded successfully`,
      duration: 3000
    });

    // Reset input
    event.target.value = '';
  };

  // Verify signed document
  const verifySignedDocument = (sheetId: string, documentId: string) => {
    setSavedSheets(prev => 
      prev.map(sheet => 
        sheet.id === sheetId 
          ? {
              ...sheet,
              signedDocuments: sheet.signedDocuments?.map(doc => 
                doc.id === documentId ? { ...doc, verified: true } : doc
              )
            }
          : sheet
      )
    );

    toast({
      title: "Document Verified",
      description: "Signed document has been verified successfully",
      duration: 3000
    });
  };

  // Delete signed document
  const deleteSignedDocument = (sheetId: string, documentId: string) => {
    setSavedSheets(prev => 
      prev.map(sheet => 
        sheet.id === sheetId 
          ? {
              ...sheet,
              signedDocuments: sheet.signedDocuments?.filter(doc => doc.id !== documentId)
            }
          : sheet
      )
    );

    toast({
      title: "Document Deleted",
      description: "Signed document has been removed",
      duration: 3000
    });
  };

  // Download signed document
  const downloadSignedDocument = (doc: SignedDocument) => {
    toast({
      title: "Download Started",
      description: `Downloading ${doc.fileName}`,
      duration: 3000
    });
    // In a real implementation, this would download the actual file
  };

  // Get workflow status color
  const getWorkflowStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600';
      case 'in_progress': return 'text-blue-600';
      case 'completed': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  // Get workflow status icon
  const getWorkflowStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in_progress': return <RefreshCw className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Generate sample sign-in form
  const generateSampleSignInForm = () => {
    const sampleData = {
      classTitle: "Fall Protection Training",
      trainingType: "OSHA Fall Protection (29 CFR 1926.501)",
      regulatoryReference: "29 CFR 1926.501",
      date: new Date().toISOString().split('T')[0],
      startTime: "08:00",
      endTime: "16:00",
      location: "Safety Training Center - Conference Room A",
      instructorName: "Sarah Johnson",
      instructorCredentials: "CIH, CSP, OSHA Authorized",
      instructorCompany: "SafetySync.AI",
      contactHours: "8",
      employees: [
        { id: '1', name: 'Michael Thompson', employeeId: 'EMP001', company: 'Construction Corp' },
        { id: '2', name: 'Jennifer Davis', employeeId: 'EMP002', company: 'Construction Corp' },
        { id: '3', name: 'Robert Wilson', employeeId: 'EMP003', company: 'Construction Corp' },
        { id: '4', name: 'Amanda Garcia', employeeId: 'EMP004', company: 'Steel Works Inc' },
        { id: '5', name: 'David Martinez', employeeId: 'EMP005', company: 'Steel Works Inc' },
        { id: '6', name: 'Lisa Anderson', employeeId: 'EMP006', company: 'Roofing Solutions' },
        { id: '7', name: 'James Taylor', employeeId: 'EMP007', company: 'Roofing Solutions' },
        { id: '8', name: 'Maria Rodriguez', employeeId: 'EMP008', company: 'Building Services' },
        { id: '9', name: 'Christopher Lee', employeeId: 'EMP009', company: 'Building Services' },
        { id: '10', name: 'Ashley White', employeeId: 'EMP010', company: 'Safety First LLC' }
      ]
    };

    setFormData(sampleData);
    setActiveTab('create');
    
    toast({
      title: "Sample Form Generated",
      description: "Fall Protection training session created with 10 sample attendees",
      duration: 4000
    });
  };

  // Advanced features helper functions
  const sendEmailNotification = (type: 'reminder' | 'completion' | 'upload', recipients: string[], message: string) => {
    if (!emailNotifications) return;
    
    // In a real implementation, this would integrate with email service
    toast({
      title: "Email Sent",
      description: `${type} notification sent to ${recipients.length} recipient(s)`,
      duration: 3000
    });
  };

  const generateBulkReport = (sheets: SignInSheet[], type: 'summary' | 'detailed' | 'analytics') => {
    const reportData = {
      totalSheets: sheets.length,
      totalEmployees: sheets.reduce((sum, sheet) => sum + sheet.employees.length, 0),
      completedSheets: sheets.filter(s => s.status === 'completed').length,
      pendingSheets: sheets.filter(s => s.status === 'generated').length,
      generatedDate: new Date().toISOString(),
      dateRange: reportDateRange,
      type: type
    };

    // Generate report based on type
    if (type === 'summary') {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('Training Summary Report', 20, 30);
      doc.setFontSize(12);
      doc.text(`Total Training Sessions: ${reportData.totalSheets}`, 20, 50);
      doc.text(`Total Participants: ${reportData.totalEmployees}`, 20, 60);
      doc.text(`Completed Sessions: ${reportData.completedSheets}`, 20, 70);
      doc.text(`Pending Sessions: ${reportData.pendingSheets}`, 20, 80);
      doc.text(`Generated: ${new Date(reportData.generatedDate).toLocaleDateString()}`, 20, 90);
      doc.save('training-summary-report.pdf');
    } else if (type === 'detailed') {
      // Generate detailed Excel report
      const workbook = XLSX.utils.book_new();
      const worksheetData = sheets.map(sheet => ({
        'Class Title': sheet.classTitle,
        'Instructor': sheet.instructorName,
        'Date': sheet.date,
        'Location': sheet.location,
        'Training Type': sheet.trainingType,
        'Participants': sheet.employees.length,
        'Status': sheet.status
      }));
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Training Sessions');
      XLSX.writeFile(workbook, 'detailed-training-report.xlsx');
    } else if (type === 'analytics') {
      // Generate analytics report with charts
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('Training Analytics Report', 20, 30);
      doc.setFontSize(12);
      
      // Training type breakdown
      const trainingTypeCount = sheets.reduce((acc, sheet) => {
        acc[sheet.trainingType] = (acc[sheet.trainingType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      let yPos = 50;
      doc.text('Training Type Distribution:', 20, yPos);
      yPos += 10;
      Object.entries(trainingTypeCount).forEach(([type, count]) => {
        doc.text(`${type}: ${count} sessions`, 30, yPos);
        yPos += 10;
      });
      
      doc.save('training-analytics-report.pdf');
    }

    toast({
      title: "Report Generated",
      description: `${type} report has been generated and downloaded`,
      duration: 3000
    });
  };

  const bulkArchiveSheets = (sheetIds: string[]) => {
    setSavedSheets(prev => 
      prev.map(sheet => 
        sheetIds.includes(sheet.id) 
          ? { ...sheet, status: 'completed' as const }
          : sheet
      )
    );
    
    toast({
      title: "Sheets Archived",
      description: `${sheetIds.length} sheet(s) have been archived`,
      duration: 3000
    });
  };

  const bulkDeleteSheets = (sheetIds: string[]) => {
    setSavedSheets(prev => prev.filter(sheet => !sheetIds.includes(sheet.id)));
    
    toast({
      title: "Sheets Deleted",
      description: `${sheetIds.length} sheet(s) have been deleted`,
      duration: 3000
    });
  };

  const exportToCalendar = (sheet: SignInSheet) => {
    const startDate = new Date(`${sheet.date} ${sheet.startTime}`);
    const endDate = new Date(`${sheet.date} ${sheet.endTime}`);
    
    const calendarEvent = {
      title: sheet.classTitle,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      description: `Instructor: ${sheet.instructorName}\nLocation: ${sheet.location}\nParticipants: ${sheet.employees.length}`,
      location: sheet.location
    };
    
    // Generate .ics file
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SafetySync.AI//Training Calendar//EN
BEGIN:VEVENT
UID:${sheet.id}@safetysync.ai
DTSTART:${startDate.toISOString().replace(/[:-]/g, '').replace(/\.\d{3}/, '')}
DTEND:${endDate.toISOString().replace(/[:-]/g, '').replace(/\.\d{3}/, '')}
SUMMARY:${sheet.classTitle}
DESCRIPTION:${calendarEvent.description}
LOCATION:${sheet.location}
END:VEVENT
END:VCALENDAR`;
    
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sheet.classTitle.replace(/\s+/g, '-')}-training.ics`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Calendar Event Created",
      description: "Training session has been exported to calendar",
      duration: 3000
    });
  };

  const filterSheets = (sheets: SignInSheet[]) => {
    return sheets.filter(sheet => {
      const matchesSearch = searchTerm === '' || 
        sheet.classTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sheet.instructorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sheet.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || sheet.status === filterStatus;
      
      const matchesInstructor = filterInstructor === 'all' || 
        sheet.instructorName.toLowerCase().includes(filterInstructor.toLowerCase());
      
      return matchesSearch && matchesStatus && matchesInstructor;
    });
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast({
      title: "Notifications Cleared",
      description: "All notifications have been cleared",
      duration: 3000
    });
  };

  // Advanced UI Features Helper Functions
  const simulateUploadProgress = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[fileId];
          return newProgress;
        });
        
        // Award achievement for file upload
        if (!achievements.includes('File Uploader')) {
          setAchievements(prev => [...prev, 'File Uploader']);
          setGamificationScore(prev => prev + 10);
          toast({
            title: "Achievement Unlocked!",
            description: "File Uploader - You've successfully uploaded your first document",
            duration: 4000
          });
        }
      } else {
        setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
      }
    }, 200);
  };

  const showHelpBubble = (target: string, message: string) => {
    setHelpBubbleTarget(target);
    setShowHelpBubbles(true);
    setTimeout(() => {
      setShowHelpBubbles(false);
      setHelpBubbleTarget(null);
    }, 3000);
  };

  const startOnboarding = () => {
    setShowOnboarding(true);
    setOnboardingStep(0);
  };

  const nextOnboardingStep = () => {
    if (onboardingStep < 4) {
      setOnboardingStep(prev => prev + 1);
    } else {
      setShowOnboarding(false);
      setOnboardingStep(0);
      setGamificationScore(prev => prev + 50);
      setAchievements(prev => [...prev, 'Onboarding Complete']);
      toast({
        title: "Onboarding Complete!",
        description: "You're now ready to create professional sign-in sheets",
        duration: 4000
      });
    }
  };

  const previewDocumentInTooltip = (documentName: string) => {
    setPreviewDocument(documentName);
    setShowDocumentPreview(true);
  };

  const getOnboardingStepContent = () => {
    switch (onboardingStep) {
      case 0:
        return {
          title: "Welcome to SafetySync.AI",
          description: "Let's create your first professional sign-in sheet",
          target: "training-info"
        };
      case 1:
        return {
          title: "Select Training Type",
          description: "Choose from OSHA-approved training courses",
          target: "training-type"
        };
      case 2:
        return {
          title: "Add Instructor Details",
          description: "Select or add instructor information",
          target: "instructor-section"
        };
      case 3:
        return {
          title: "Add Attendees",
          description: "Use our smart search to find employees and students",
          target: "attendee-section"
        };
      case 4:
        return {
          title: "Generate Documents",
          description: "Create professional PDF and Word documents",
          target: "generate-section"
        };
      default:
        return null;
    }
  };

  const quickActions = [
    {
      icon: <Plus className="w-4 h-4" />,
      label: "New Sheet",
      action: () => {
        setActiveTab('create');
        setShowQuickActionMenu(false);
      }
    },
    {
      icon: <Search className="w-4 h-4" />,
      label: "Search Students",
      action: () => {
        showHelpBubble('student-search', 'Use our smart search to find employees and external students');
        setShowQuickActionMenu(false);
      }
    },
    {
      icon: <BarChart3 className="w-4 h-4" />,
      label: "Generate Report",
      action: () => {
        setShowReportingDialog(true);
        setShowQuickActionMenu(false);
      }
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      label: "Export Calendar",
      action: () => {
        if (savedSheets.length > 0) {
          exportToCalendar(savedSheets[0]);
        }
        setShowQuickActionMenu(false);
      }
    },
    {
      icon: <Settings className="w-4 h-4" />,
      label: "Settings",
      action: () => {
        setShowAdvancedOptions(true);
        setShowQuickActionMenu(false);
      }
    }
  ];



  // Enhanced form generation with PDF/Word export and signature workflow
  const generateProfessionalForm = (sheet: SignInSheet, format: 'pdf' | 'word' = 'pdf') => {
    const selectedTraining = TRAINING_TYPES.find(t => t.value === sheet.trainingType);
    
    if (format === 'pdf') {
      generatePDFForm(sheet, selectedTraining);
    } else if (format === 'word') {
      generateWordForm(sheet, selectedTraining);
    }
  };

  // Generate professional PDF form
  const generatePDFForm = (sheet: SignInSheet, selectedTraining: any) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    let yPosition = margin;

    // Header with SafetySync.ai branding
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('OSHA TRAINING ATTENDANCE RECORD', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    doc.setFontSize(16);
    doc.text(sheet.classTitle, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Professional line separator
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;

    // Company and location info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Instructor Company: ${sheet.instructorCompany}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 6;
    doc.text(`Training Location: ${sheet.location}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Training details in two columns
    const leftColumn = margin;
    const rightColumn = pageWidth / 2 + 10;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Training Information:', leftColumn, yPosition);
    doc.text('Session Details:', rightColumn, yPosition);
    yPosition += 8;

    doc.setFont('helvetica', 'normal');
    doc.text(`Instructor: ${sheet.instructorName}`, leftColumn, yPosition);
    doc.text(`End Time: ${sheet.endTime}`, rightColumn, yPosition);
    yPosition += 6;

    doc.text(`Credentials: ${sheet.instructorCredentials}`, leftColumn, yPosition);
    doc.text(`OSHA Standard: ${sheet.oshaStandard}`, rightColumn, yPosition);
    yPosition += 6;

    doc.text(`Training Date: ${sheet.date}`, leftColumn, yPosition);
    doc.text(`Record Retention: ${selectedTraining?.retention || '3 years'}`, rightColumn, yPosition);
    yPosition += 6;

    doc.text(`Start Time: ${sheet.startTime}`, leftColumn, yPosition);
    doc.text(`Total Participants: ${sheet.employees.length}`, rightColumn, yPosition);
    yPosition += 15;

    // Attendance table header
    const tableStartY = yPosition;
    const colWidths = [15, 50, 30, 30, 30, 35];
    const colPositions = [margin];
    for (let i = 0; i < colWidths.length - 1; i++) {
      colPositions.push(colPositions[i] + colWidths[i]);
    }

    // Table header
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.text('#', colPositions[0] + 2, yPosition + 5);
    doc.text('Employee Name', colPositions[1] + 2, yPosition + 5);
    doc.text('Employee ID', colPositions[2] + 2, yPosition + 5);
    doc.text('Company', colPositions[3] + 2, yPosition + 5);
    doc.text('Time In', colPositions[4] + 2, yPosition + 5);
    doc.text('Signature', colPositions[5] + 2, yPosition + 5);
    
    yPosition += 8;

    // Table borders
    doc.setLineWidth(0.3);
    // Header row border
    doc.rect(margin, tableStartY, pageWidth - 2 * margin, 8);
    
    // Vertical lines
    colPositions.forEach((pos, index) => {
      if (index < colPositions.length - 1) {
        doc.line(pos + colWidths[index], tableStartY, pos + colWidths[index], yPosition + (sheet.employees.length * 12));
      }
    });

    // Employee rows
    doc.setFont('helvetica', 'normal');
    sheet.employees.forEach((employee, index) => {
      const rowY = yPosition + (index * 12);
      
      // Alternating row colors
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(margin, rowY, pageWidth - 2 * margin, 12, 'F');
      }
      
      doc.text(`${index + 1}`, colPositions[0] + 2, rowY + 8);
      doc.text(employee.name, colPositions[1] + 2, rowY + 8);
      doc.text(employee.employeeId, colPositions[2] + 2, rowY + 8);
      doc.text(employee.company, colPositions[3] + 2, rowY + 8);
      
      // Time in field (empty for manual entry)
      doc.text('_____________', colPositions[4] + 2, rowY + 8);
      
      // Signature line
      doc.text('_____________________', colPositions[5] + 2, rowY + 8);
      
      // Row border
      doc.rect(margin, rowY, pageWidth - 2 * margin, 12);
    });

    // Footer with compliance information
    const footerY = yPosition + (sheet.employees.length * 12) + 20;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('OSHA Compliance Requirements:', margin, footerY);
    
    doc.setFont('helvetica', 'normal');
    const complianceText = [
      '• This training record must be maintained for the duration specified by OSHA standards',
      '• All attendees must sign to acknowledge receipt of training',
      '• Training content must meet current OSHA requirements',
      '• Records must be available for OSHA inspection upon request',
      '• Generated by SafetySync.ai - Professional OSHA Compliance Management'
    ];
    
    complianceText.forEach((text, index) => {
      doc.text(text, margin, footerY + 6 + (index * 4));
    });

    // Save the PDF
    const fileName = `${sheet.classTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${sheet.date}_SignIn.pdf`;
    doc.save(fileName);
  };

  // Generate professional Word document
  const generateWordForm = async (sheet: SignInSheet, selectedTraining: any) => {
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720
            }
          }
        },
        children: [
          // Header
          new Paragraph({
            text: "OSHA TRAINING ATTENDANCE RECORD",
            heading: "Title",
            alignment: "center",
            spacing: { after: 200 }
          }),
          
          new Paragraph({
            text: sheet.classTitle,
            heading: "Heading1",
            alignment: "center",
            spacing: { after: 400 }
          }),
          
          // Company info
          new Paragraph({
            text: `Instructor Company: ${sheet.instructorCompany}`,
            alignment: "center",
            spacing: { after: 100 }
          }),
          
          new Paragraph({
            text: `Training Location: ${sheet.location}`,
            alignment: "center",
            spacing: { after: 400 }
          }),
          
          // Training details table
          new Table({
            width: { size: 100, type: "pct" },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: "Training Information", heading: "Heading2" })],
                    width: { size: 50, type: "pct" }
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: "Session Details", heading: "Heading2" })],
                    width: { size: 50, type: "pct" }
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({ text: `Instructor: ${sheet.instructorName}` }),
                      new Paragraph({ text: `Credentials: ${sheet.instructorCredentials}` }),
                      new Paragraph({ text: `Training Date: ${sheet.date}` }),
                      new Paragraph({ text: `Start Time: ${sheet.startTime}` })
                    ]
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({ text: `End Time: ${sheet.endTime}` }),
                      new Paragraph({ text: `OSHA Standard: ${sheet.oshaStandard}` }),
                      new Paragraph({ text: `Record Retention: ${selectedTraining?.retention || '3 years'}` }),
                      new Paragraph({ text: `Total Participants: ${sheet.employees.length}` })
                    ]
                  })
                ]
              })
            ]
          }),
          
          // Spacing
          new Paragraph({ text: "", spacing: { after: 400 } }),
          
          // Attendance table
          new Table({
            width: { size: 100, type: "pct" },
            rows: [
              // Header row
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "#", alignment: "center" })], width: { size: 8, type: "pct" } }),
                  new TableCell({ children: [new Paragraph({ text: "Employee Name", alignment: "center" })], width: { size: 25, type: "pct" } }),
                  new TableCell({ children: [new Paragraph({ text: "Employee ID", alignment: "center" })], width: { size: 15, type: "pct" } }),
                  new TableCell({ children: [new Paragraph({ text: "Company", alignment: "center" })], width: { size: 20, type: "pct" } }),
                  new TableCell({ children: [new Paragraph({ text: "Time In", alignment: "center" })], width: { size: 12, type: "pct" } }),
                  new TableCell({ children: [new Paragraph({ text: "Signature", alignment: "center" })], width: { size: 20, type: "pct" } })
                ]
              }),
              // Employee rows
              ...sheet.employees.map((employee, index) => 
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: `${index + 1}`, alignment: "center" })] }),
                    new TableCell({ children: [new Paragraph({ text: employee.name })] }),
                    new TableCell({ children: [new Paragraph({ text: employee.employeeId })] }),
                    new TableCell({ children: [new Paragraph({ text: employee.company })] }),
                    new TableCell({ children: [new Paragraph({ text: "____________" })] }),
                    new TableCell({ children: [new Paragraph({ text: "________________________" })] })
                  ]
                })
              )
            ]
          }),
          
          // Footer
          new Paragraph({ text: "", spacing: { after: 400 } }),
          
          new Paragraph({
            text: "OSHA Compliance Requirements:",
            heading: "Heading3",
            spacing: { after: 200 }
          }),
          
          new Paragraph({
            text: "• This training record must be maintained for the duration specified by OSHA standards",
            spacing: { after: 100 }
          }),
          
          new Paragraph({
            text: "• All attendees must sign to acknowledge receipt of training",
            spacing: { after: 100 }
          }),
          
          new Paragraph({
            text: "• Training content must meet current OSHA requirements",
            spacing: { after: 100 }
          }),
          
          new Paragraph({
            text: "• Records must be available for OSHA inspection upon request",
            spacing: { after: 100 }
          }),
          
          new Paragraph({
            text: "• Generated by SafetySync.ai - Professional OSHA Compliance Management",
            spacing: { after: 100 }
          })
        ]
      }]
    });

    // Generate and save the Word document
    const buffer = await Packer.toBuffer(doc);
    const fileName = `${sheet.classTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${sheet.date}_SignIn.docx`;
    
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Maintain backward compatibility with existing print functionality
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
    <div className="max-w-6xl mx-auto p-6 space-y-6 bg-transparent">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 text-white">
            <FileText className="w-8 h-8 text-blue-600" />
            Instructor Sign-In Sheet Generator
          </h1>
          <p className="text-gray-400 mt-2">
            Create OSHA-compliant attendance records for safety training classes
          </p>
        </div>
        <div className="flex gap-2">
          {/* Gamification Score Display */}
          <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">{gamificationScore} pts</span>
            <Badge variant="secondary" className="text-xs">
              {achievements.length} achievements
            </Badge>
          </div>
          
          {/* Advanced Tools */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowNotificationCenter(true)}
            className="relative"
          >
            <Bell className="w-4 h-4" />
            {notifications.filter(n => !n.read).length > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {notifications.filter(n => !n.read).length}
              </Badge>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowReportingDialog(true)}
          >
            <BarChart3 className="w-4 h-4" />
            Reports
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={startOnboarding}
            className="text-green-600 hover:text-green-700"
          >
            <GraduationCap className="w-4 h-4" />
            Tutorial
          </Button>
          
          <Button
            variant={bulkOperationMode ? "default" : "outline"}
            size="sm"
            onClick={() => setBulkOperationMode(!bulkOperationMode)}
          >
            <CheckCircle className="w-4 h-4" />
            Bulk Mode
          </Button>
          
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
          <Button
            variant="secondary"
            onClick={generateSampleSignInForm}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0"
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate Sample
          </Button>
        </div>
      </div>

      {activeTab === 'create' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="w-5 h-5" />
                  Training Information
                </CardTitle>
                <CardDescription className="text-gray-400">
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
                          value={customClassName || ''}
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
                          value={customStandard || ''}
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
                          value={formData.classTitle || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, classTitle: e.target.value }))}
                          placeholder="Enter class title"
                          disabled={!isCustomTraining}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="oshaStandard">OSHA/ANSI Standard</Label>
                        <Input
                          id="oshaStandard"
                          value={formData.oshaStandard || ''}
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

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Users className="w-5 h-5" />
                  Instructor Information
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Details about the certified instructor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Instructor Type *</Label>
                  <div className="flex flex-col gap-2 mt-2 w-full">
                    <Select value={selectedInstructor} onValueChange={handleInstructorSelection}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose from client instructors" />
                      </SelectTrigger>
                      <SelectContent>
                        {SAMPLE_INSTRUCTORS.map(instructor => (
                          <SelectItem key={instructor.id} value={instructor.id}>
                            {instructor.name} - {instructor.credentials}
                          </SelectItem>
                        ))}
                        <SelectItem value="clear">
                          <div className="flex items-center text-gray-500">
                            <X className="w-4 h-4 mr-2" />
                            Clear Selection
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant={instructorType === 'visiting' ? 'default' : 'outline'}
                      onClick={() => handleInstructorTypeChange('visiting')}
                      className="w-full h-10 flex items-center justify-center"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Visiting Instructor
                    </Button>
                  </div>
                </div>

                {instructorType === 'existing' && selectedInstructor && selectedInstructor !== 'clear' && (
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <div className="text-sm font-medium text-gray-700">Selected Instructor:</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {SAMPLE_INSTRUCTORS.find(i => i.id === selectedInstructor)?.name} - {SAMPLE_INSTRUCTORS.find(i => i.id === selectedInstructor)?.credentials}
                    </div>
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
                        value={formData.instructorName || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, instructorName: e.target.value }))}
                        placeholder="Full name of visiting instructor"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="instructorCredentials">Instructor Credentials</Label>
                      <Input
                        id="instructorCredentials"
                        value={formData.instructorCredentials || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, instructorCredentials: e.target.value }))}
                        placeholder="e.g., OSHA Authorized, CSP, CIH"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="instructorCompany">Instructor Company</Label>
                      <Input
                        id="instructorCompany"
                        value={formData.instructorCompany || ''}
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

                {/* Document Upload and Management Section */}
                {(instructorType === 'existing' && selectedInstructor) || instructorType === 'visiting' ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Instructor Documents</div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('document-upload')?.click()}
                          className="text-xs"
                        >
                          <Upload className="w-3 h-3 mr-1" />
                          Upload
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowDocumentViewer(!showDocumentViewer)}
                          className="text-xs"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View ({getCurrentInstructorDocuments().length})
                        </Button>
                      </div>
                    </div>

                    {/* Hidden file input */}
                    <input
                      id="document-upload"
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleDocumentUpload}
                      className="hidden"
                    />

                    {/* Document viewer */}
                    {showDocumentViewer && (
                      <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">
                            Documents ({getCurrentInstructorDocuments().length})
                          </div>
                          {selectedDocuments.length > 0 && (
                            <div className="flex gap-1 flex-wrap">
                              <Select defaultValue="pdf" onValueChange={(value) => downloadSelectedDocuments(value as 'pdf' | 'word' | 'excel')}>
                                <SelectTrigger className="w-auto text-xs">
                                  <Download className="w-3 h-3 mr-1" />
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pdf">Download as PDF ({selectedDocuments.length})</SelectItem>
                                  <SelectItem value="word">Download as Word ({selectedDocuments.length})</SelectItem>
                                  <SelectItem value="excel">Download as Excel ({selectedDocuments.length})</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={deleteSelectedDocuments}
                                className="text-xs text-red-600 hover:text-red-700 whitespace-nowrap"
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Delete ({selectedDocuments.length})
                              </Button>
                            </div>
                          )}
                        </div>

                        {getCurrentInstructorDocuments().length === 0 ? (
                          <div className="text-sm text-gray-500 text-center py-4">
                            No documents uploaded yet. Click "Upload" to add certificates, resumes, or credentials.
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {getCurrentInstructorDocuments().map(doc => (
                              <div key={doc.id} className="flex items-center space-x-3 p-2 bg-gray-700/50 rounded border border-gray-600">
                                <input
                                  type="checkbox"
                                  checked={selectedDocuments.includes(doc.id)}
                                  onChange={() => toggleDocumentSelection(doc.id)}
                                  className="w-4 h-4 text-blue-600 rounded"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium truncate">{doc.fileName}</div>
                                  <div className="text-xs text-gray-500">
                                    {doc.documentType} • {formatFileSize(doc.fileSize)} • {new Date(doc.uploadDate).toLocaleDateString()}
                                  </div>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {doc.documentType}
                                </Badge>
                                <div className="flex gap-1">
                                  <Select defaultValue="pdf" onValueChange={(value) => downloadSingleDocument(doc, value as 'pdf' | 'word' | 'excel')}>
                                    <SelectTrigger className="w-auto p-1 h-8">
                                      <Download className="w-3 h-3" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pdf">Download as PDF</SelectItem>
                                      <SelectItem value="word">Download as Word</SelectItem>
                                      <SelectItem value="excel">Download as Excel</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteDocument(doc.id)}
                                    className="p-1 h-8 w-8 text-red-600 hover:text-red-700"
                                    title="Delete document"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Calendar className="w-5 h-5" />
                  Session Details
                </CardTitle>
                <CardDescription className="text-gray-400">
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
                      value={formData.date || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location || ''}
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
                      value={formData.startTime || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    />
                  </div>
                </div>

                {/* OSHA/ANSI Recommended Duration Display */}
                {formData.trainingType && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-800">OSHA/ANSI Recommended Duration</span>
                    </div>
                    <div className="text-sm text-blue-700">
                      <strong>{getRecommendedDuration(formData.trainingType)}</strong>
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      This is the minimum duration recommended by OSHA/ANSI standards for this training type.
                    </div>
                  </div>
                )}

                {/* Custom Reference Field */}
                <div>
                  <Label htmlFor="customReference">Custom Reference (Optional)</Label>
                  <Input
                    id="customReference"
                    value={formData.customReference || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, customReference: e.target.value }))}
                    placeholder="Enter your own reference (e.g., Company SOP, Internal Training ID, etc.)"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Add your own reference number, SOP citation, or internal training identifier
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
                  Training Attendees ({formData.employees?.length || 0})
                </CardTitle>
                <CardDescription>
                  Add employees and external students who will attend this training session
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="search" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="search" className="flex items-center gap-2">
                      <Search className="w-4 h-4" />
                      Quick Search
                    </TabsTrigger>
                    <TabsTrigger value="manual" className="flex items-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      Manual Entry
                    </TabsTrigger>
                    <TabsTrigger value="manage" className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Manage Students
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="search" className="space-y-4">
                    <div className="space-y-3">
                      <Label>Search Internal Employees & External Students</Label>
                      <StudentAutocomplete
                        onStudentSelect={handleStudentSelect}
                        placeholder="Type name to search employees and students..."
                        className="w-full"
                      />
                      <div className="text-sm text-gray-500">
                        Search across internal employees and external students. Results will show matches from both sources.
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="manual" className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <Label htmlFor="employeeName">Employee Name</Label>
                        <Input
                          id="employeeName"
                          value={newEmployee.name || ''}
                          onChange={(e) => setNewEmployee(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Full name"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="employeeId">Employee ID</Label>
                        <Input
                          id="employeeId"
                          value={newEmployee.employeeId || ''}
                          onChange={(e) => setNewEmployee(prev => ({ ...prev, employeeId: e.target.value }))}
                          placeholder="Employee ID or badge number"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="employeeCompany">Company (optional)</Label>
                        <Input
                          id="employeeCompany"
                          value={newEmployee.company || ''}
                          onChange={(e) => setNewEmployee(prev => ({ ...prev, company: e.target.value }))}
                          placeholder="Company name (if different from instructor)"
                        />
                      </div>
                      
                      <Button onClick={addEmployee} className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Employee
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="manage" className="space-y-4">
                    <ExternalStudentManager />
                  </TabsContent>
                </Tabs>
                
                <Separator />
                
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {formData.employees?.map((employee, index) => (
                    <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-gray-500">
                          ID: {employee.employeeId} • {employee.company}
                          {employee.type && (
                            <Badge variant={employee.type === 'internal' ? 'default' : 'secondary'} className="ml-2">
                              {employee.type === 'internal' ? 'Employee' : 'External Student'}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => employee.type ? removeStudent(employee.id.split('-')[1], employee.type) : removeEmployee(employee.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {(!formData.employees || formData.employees.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      No attendees added yet. Use the search tab to find employees and students, or manually add them.
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
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Saved Sign-In Sheets</CardTitle>
            <CardDescription className="text-gray-400">
              Manage your drafted and generated training attendance records
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Enhanced Search and Filter Controls */}
            <div className="mb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="searchSheets">Search Sheets</Label>
                  <Input
                    id="searchSheets"
                    placeholder="Search by title, instructor, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="filterStatus">Filter by Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="generated">Generated</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="filterInstructor">Filter by Instructor</Label>
                  <Select value={filterInstructor} onValueChange={setFilterInstructor}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Instructors</SelectItem>
                      {Array.from(new Set(savedSheets.map(s => s.instructorName))).map(instructor => (
                        <SelectItem key={instructor} value={instructor}>{instructor}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Quick Actions</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowEmailDialog(true)}
                    >
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportToCalendar(savedSheets[0])}
                    >
                      <Calendar className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Bulk Operations */}
              {bulkOperationMode && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-blue-800">Bulk Operations</h4>
                    <span className="text-sm text-blue-600">
                      {selectedSheetsForBulk.length} selected
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedSheetsForBulk(filterSheets(savedSheets).map(s => s.id))}
                    >
                      Select All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedSheetsForBulk([])}
                    >
                      Clear Selection
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => bulkArchiveSheets(selectedSheetsForBulk)}
                      disabled={selectedSheetsForBulk.length === 0}
                    >
                      Archive Selected
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => bulkDeleteSheets(selectedSheetsForBulk)}
                      disabled={selectedSheetsForBulk.length === 0}
                    >
                      Delete Selected
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              {filterSheets(savedSheets).map(sheet => (
                <div key={sheet.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    {/* Bulk Selection Checkbox */}
                    {bulkOperationMode && (
                      <div className="mr-3">
                        <Checkbox
                          checked={selectedSheetsForBulk.includes(sheet.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedSheetsForBulk(prev => [...prev, sheet.id]);
                            } else {
                              setSelectedSheetsForBulk(prev => prev.filter(id => id !== sheet.id));
                            }
                          }}
                        />
                      </div>
                    )}
                    
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
                        {sheet.signatureWorkflow && (
                          <div className={`flex items-center gap-1 text-xs ${getWorkflowStatusColor(sheet.signatureWorkflow.status)}`}>
                            {getWorkflowStatusIcon(sheet.signatureWorkflow.status)}
                            <span className="capitalize">{sheet.signatureWorkflow.status.replace('_', ' ')}</span>
                          </div>
                        )}
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
                      <Button variant="outline" size="sm" onClick={() => exportToCalendar(sheet)}>
                        <Calendar className="w-4 h-4 mr-1" />
                        Calendar
                      </Button>
                    </div>
                  </div>
                  
                  {/* Signature Workflow Management */}
                  {sheet.signatureWorkflow && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-sm">Signature Workflow</h4>
                        <div className="text-xs text-gray-500">
                          {sheet.signatureWorkflow.receivedSignatures} / {sheet.signatureWorkflow.totalSignatures} signatures
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Upload Section */}
                        <div className="space-y-2">
                          <Label htmlFor={`upload-${sheet.id}`} className="text-sm font-medium">
                            Upload Signed Document
                          </Label>
                          <div className="flex items-center gap-2 relative">
                            <Input
                              id={`upload-${sheet.id}`}
                              type="file"
                              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                              onChange={(e) => {
                                handleSignedDocumentUpload(e, sheet.id);
                                if (e.target.files?.[0]) {
                                  simulateUploadProgress(`upload-${sheet.id}`);
                                }
                              }}
                              className="text-sm"
                            />
                            
                            {/* Animated Progress Indicator */}
                            {uploadProgress[`upload-${sheet.id}`] && (
                              <div className="absolute inset-0 bg-blue-50/90 rounded-md flex items-center justify-center backdrop-blur-sm">
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                  <span className="text-sm font-medium text-blue-600">
                                    {Math.round(uploadProgress[`upload-${sheet.id}`])}%
                                  </span>
                                  <div className="w-20 bg-gray-200 rounded-full h-1">
                                    <div 
                                      className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                                      style={{ width: `${uploadProgress[`upload-${sheet.id}`]}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => document.getElementById(`upload-${sheet.id}`)?.click()}
                              disabled={uploadProgress[`upload-${sheet.id}`] > 0}
                            >
                              <Upload className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Completion Progress</Label>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${(sheet.signatureWorkflow.receivedSignatures / sheet.signatureWorkflow.totalSignatures) * 100}%` 
                              }}
                            />
                          </div>
                          <div className="text-xs text-gray-500">
                            {Math.round((sheet.signatureWorkflow.receivedSignatures / sheet.signatureWorkflow.totalSignatures) * 100)}% complete
                          </div>
                        </div>
                      </div>
                      
                      {/* Signed Documents List */}
                      {sheet.signedDocuments && sheet.signedDocuments.length > 0 && (
                        <div className="mt-4">
                          <Label className="text-sm font-medium mb-2 block">Signed Documents</Label>
                          <div className="space-y-2">
                            {sheet.signedDocuments.map(doc => (
                              <div key={doc.id} className="flex items-center justify-between p-2 bg-white rounded border">
                                <div className="flex items-center gap-3">
                                  <FileCheck className="w-4 h-4 text-green-600" />
                                  <div>
                                    <div className="text-sm font-medium">{doc.fileName}</div>
                                    <div className="text-xs text-gray-500">
                                      {new Date(doc.uploadDate).toLocaleDateString()} • {Math.round(doc.fileSize / 1024)}KB
                                    </div>
                                  </div>
                                  {doc.verified && (
                                    <Badge variant="default" className="text-xs">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Verified
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex gap-1">
                                  <Button size="sm" variant="ghost" onClick={() => downloadSignedDocument(doc)}>
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  {!doc.verified && (
                                    <Button size="sm" variant="ghost" onClick={() => verifySignedDocument(sheet.id, doc.id)}>
                                      <CheckCircle className="w-4 h-4" />
                                    </Button>
                                  )}
                                  <Button size="sm" variant="ghost" onClick={() => deleteSignedDocument(sheet.id, doc.id)}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Notifications */}
                      {sheet.signatureWorkflow.notifications && sheet.signatureWorkflow.notifications.length > 0 && (
                        <div className="mt-4">
                          <Label className="text-sm font-medium mb-2 block">Recent Activity</Label>
                          <div className="space-y-1 max-h-20 overflow-y-auto">
                            {sheet.signatureWorkflow.notifications.slice(-3).map(notification => (
                              <div key={notification.id} className="text-xs p-2 bg-blue-50 rounded">
                                <div className="flex items-center gap-2">
                                  {notification.type === 'upload' && <Upload className="w-3 h-3" />}
                                  {notification.type === 'completion' && <CheckCircle className="w-3 h-3" />}
                                  {notification.type === 'reminder' && <Clock className="w-3 h-3" />}
                                  <span>{notification.message}</span>
                                </div>
                                <div className="text-gray-500 mt-1">
                                  {new Date(notification.timestamp).toLocaleString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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

      {/* Advanced Features Dialogs */}
      
      {/* Notification Center Dialog */}
      <Dialog open={showNotificationCenter} onOpenChange={setShowNotificationCenter}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Center
            </DialogTitle>
            <DialogDescription>
              View and manage your training session notifications
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto space-y-3">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border ${
                  notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {notification.type === 'reminder' && <Clock className="w-4 h-4 text-orange-500" />}
                    {notification.type === 'completion' && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {notification.type === 'upload' && <Upload className="w-4 h-4 text-blue-500" />}
                    <div>
                      <p className="text-sm font-medium">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      Mark Read
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <p className="text-center text-gray-500 py-8">No notifications</p>
            )}
          </div>
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={clearAllNotifications}>
              Clear All
            </Button>
            <Button onClick={() => setShowNotificationCenter(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Advanced Reporting Dialog */}
      <Dialog open={showReportingDialog} onOpenChange={setShowReportingDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Advanced Reports
            </DialogTitle>
            <DialogDescription>
              Generate comprehensive reports for training sessions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className={`cursor-pointer transition-all ${reportType === 'summary' ? 'ring-2 ring-blue-500' : ''}`}>
                <CardContent className="p-4 text-center" onClick={() => setReportType('summary')}>
                  <FileText className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-medium">Summary Report</h3>
                  <p className="text-sm text-gray-600">Basic overview and statistics</p>
                </CardContent>
              </Card>
              
              <Card className={`cursor-pointer transition-all ${reportType === 'detailed' ? 'ring-2 ring-blue-500' : ''}`}>
                <CardContent className="p-4 text-center" onClick={() => setReportType('detailed')}>
                  <FileSpreadsheet className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <h3 className="font-medium">Detailed Report</h3>
                  <p className="text-sm text-gray-600">Excel format with all data</p>
                </CardContent>
              </Card>
              
              <Card className={`cursor-pointer transition-all ${reportType === 'analytics' ? 'ring-2 ring-blue-500' : ''}`}>
                <CardContent className="p-4 text-center" onClick={() => setReportType('analytics')}>
                  <BarChart3 className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <h3 className="font-medium">Analytics Report</h3>
                  <p className="text-sm text-gray-600">Charts and insights</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={reportDateRange.startDate}
                  onChange={(e) => setReportDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={reportDateRange.endDate}
                  onChange={(e) => setReportDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowReportingDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                const filteredSheets = filterSheets(savedSheets);
                generateBulkReport(filteredSheets, reportType);
                setShowReportingDialog(false);
              }}
            >
              Generate Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Notification Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Send Email Notification
            </DialogTitle>
            <DialogDescription>
              Send notifications to training participants
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Notification Type</Label>
              <Select defaultValue="reminder">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reminder">Training Reminder</SelectItem>
                  <SelectItem value="completion">Training Completion</SelectItem>
                  <SelectItem value="upload">Document Upload Required</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emailSubject">Subject</Label>
              <Input
                id="emailSubject"
                placeholder="Enter email subject"
                defaultValue="Training Session Reminder"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emailMessage">Message</Label>
              <Textarea
                id="emailMessage"
                placeholder="Enter your message..."
                rows={4}
                defaultValue="This is a friendly reminder about your upcoming safety training session."
              />
            </div>
          </div>
          
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowEmailDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                sendEmailNotification('reminder', ['example@company.com'], 'Training reminder sent');
                setShowEmailDialog(false);
              }}
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Action Floating Menu */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* Quick Action Menu Items */}
          {showQuickActionMenu && (
            <div className="absolute bottom-16 right-0 bg-gray-800 border-gray-700 rounded-lg shadow-lg border p-2 min-w-[160px] animate-in slide-in-from-bottom duration-300">
              <div className="space-y-1">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 hover:bg-gray-100 transition-colors"
                    onClick={action.action}
                  >
                    {action.icon}
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Main Quick Action Button */}
          <Button
            className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={() => setShowQuickActionMenu(!showQuickActionMenu)}
          >
            <Plus className={`w-6 h-6 text-white transition-transform duration-300 ${showQuickActionMenu ? 'rotate-45' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Gamified Onboarding Overlay */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gray-800 border-gray-700 text-white rounded-xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">
                  {getOnboardingStepContent()?.title}
                </h3>
                <p className="text-gray-600">
                  {getOnboardingStepContent()?.description}
                </p>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((onboardingStep + 1) / 5) * 100}%` }}
                />
              </div>
              
              <div className="flex justify-between items-center pt-4">
                <span className="text-sm text-gray-500">
                  Step {onboardingStep + 1} of 5
                </span>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowOnboarding(false)}
                  >
                    Skip
                  </Button>
                  <Button
                    size="sm"
                    onClick={nextOnboardingStep}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    {onboardingStep === 4 ? 'Complete' : 'Next'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contextual Help Bubbles */}
      {showHelpBubbles && helpBubbleTarget && (
        <div className="fixed inset-0 pointer-events-none z-40">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              <span className="text-sm">Use our smart search to find employees and external students</span>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Document Preview Tooltip */}
      {showDocumentPreview && previewDocument && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border-gray-700 text-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Document Preview</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDocumentPreview(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">{previewDocument}</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>📄 Professional OSHA-compliant training sign-in sheet</p>
                  <p>✅ Includes instructor credentials and course details</p>
                  <p>👥 Attendee roster with signature fields</p>
                  <p>🔒 Secure document generation with SafetySync.AI branding</p>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <h5 className="font-medium text-blue-800 mb-2">Available Formats:</h5>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-blue-600">PDF</Badge>
                  <Badge variant="outline" className="text-blue-600">Word Document</Badge>
                  <Badge variant="outline" className="text-blue-600">Excel Spreadsheet</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
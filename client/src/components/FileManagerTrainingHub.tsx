import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  FolderIcon, 
  Home, 
  Settings, 
  Grid,
  Search,
  Plus,
  Download,
  Eye,
  Trash2,
  Calendar,
  User,
  MapPin,
  FileText
} from 'lucide-react';

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
  description: string;
  fileContent?: string;
  expirationDate?: Date;
}

// Sample documents with Safety Management System structure
const mockDocuments: TrainingDocument[] = [
  {
    id: 1,
    fileName: 'Safety_Management_System_Analysis',
    fileType: 'folder',
    category: 'training_file',
    trainingSubject: 'Safety Management System Analysis',
    trainingDate: new Date('2025-01-21'),
    instructorName: 'Gerardo Hernandez',
    studentCount: 47,
    location: 'Safety Management Workspace',
    fileSize: 45120000, // 45.12 MB
    uploadDate: new Date('2025-01-21'),
    description: 'Comprehensive safety workspace analysis with SDS and manual organization',
    fileContent: `Training File: Safety Management System Analysis
Date: 2025-01-21
Updated by: Gerardo Hernandez

SAFETY WORKSPACE SUMMARY:
- Workspace: Safety Management System
- Total Files: 47 organized documents
- File Categories: SDS sheets, safety manuals, emergency procedures
- Last Updated: January 21st, 2025`
  },
  {
    id: 2,
    fileName: 'Abatement_SDS',
    fileType: 'folder',
    category: 'sds_collection',
    trainingSubject: 'Abatement SDS Collection',
    trainingDate: new Date('2024-10-28'),
    instructorName: 'Gerardo Hernandez',
    studentCount: 27,
    location: 'Chemical Safety Documentation',
    fileSize: 5360000, // 5.36 MB
    uploadDate: new Date('2024-10-28'),
    description: 'Chemical safety data sheets for abatement procedures'
  },
  {
    id: 3,
    fileName: 'Demo_SDS',
    fileType: 'folder',
    category: 'sds_collection',
    trainingSubject: 'Demo SDS Collection',
    trainingDate: new Date('2024-10-28'),
    instructorName: 'Gerardo Hernandez',
    studentCount: 16,
    location: 'Training Materials',
    fileSize: 2980000, // 2.98 MB
    uploadDate: new Date('2024-10-28'),
    description: 'Training and demonstration safety data sheets'
  },
  {
    id: 4,
    fileName: 'EHS_Manuals',
    fileType: 'folder',
    category: 'safety_manuals',
    trainingSubject: 'EH&S Manual Collection',
    trainingDate: new Date('2025-01-21'),
    instructorName: 'Gerardo Hernandez',
    studentCount: 4,
    location: 'Environmental Health & Safety',
    fileSize: 80780000, // 80.78 MB
    uploadDate: new Date('2025-01-21'),
    description: 'Environmental Health & Safety procedure manuals'
  },
  {
    id: 5,
    fileName: 'Emergency_Action_Plans',
    fileType: 'folder',
    category: 'emergency_procedures',
    trainingSubject: 'Emergency Action Plans',
    trainingDate: new Date('2024-05-03'),
    instructorName: 'Zak Robles',
    studentCount: 3,
    location: 'Emergency Preparedness',
    fileSize: 52720000, // 52.72 MB
    uploadDate: new Date('2024-05-03'),
    description: 'Emergency response and action plan documentation'
  },
  {
    id: 6,
    fileName: 'Incident_Forms',
    fileType: 'folder',
    category: 'compliance_forms',
    trainingSubject: 'Incident Forms Collection',
    trainingDate: new Date('2025-05-16'),
    instructorName: 'Gerardo Hernandez',
    studentCount: 8,
    location: 'Compliance Documentation',
    fileSize: 1400000, // 1.40 MB
    uploadDate: new Date('2025-05-16'),
    description: 'Incident reporting and documentation forms'
  },
  {
    id: 7,
    fileName: 'JOBSITE_FORMS',
    fileType: 'folder',
    category: 'jobsite_documentation',
    trainingSubject: 'Jobsite Forms Collection',
    trainingDate: new Date('2025-06-10'),
    instructorName: 'Zak Robles',
    studentCount: 15,
    location: 'Field Operations',
    fileSize: 4010000, // 4.01 GB
    uploadDate: new Date('2025-06-10'),
    description: 'Jobsite safety and compliance forms'
  },
  {
    id: 8,
    fileName: 'Texas_WhiteHouse',
    fileType: 'folder',
    category: 'project_documentation',
    trainingSubject: 'Texas WhiteHouse Project',
    trainingDate: new Date('2024-02-19'),
    instructorName: 'Gerardo Hernandez',
    studentCount: 32,
    location: 'Project Site Documentation',
    fileSize: 5350000, // 5.35 GB
    uploadDate: new Date('2024-02-19'),
    description: 'Texas WhiteHouse project safety documentation'
  },
  {
    id: 9,
    fileName: 'Tool_Box_Talks',
    fileType: 'folder',
    category: 'training_materials',
    trainingSubject: 'Tool Box Talks',
    trainingDate: new Date('2027-09-15'),
    instructorName: 'Gerardo Hernandez',
    studentCount: 47,
    location: 'Training Sessions',
    fileSize: 10000000, // 10.00 MB
    uploadDate: new Date('2027-09-15'),
    description: 'Safety toolbox talks and training presentations'
  }
];

export default function FileManagerTrainingHub() {
  const [documents, setDocuments] = useState<TrainingDocument[]>(() => {
    const savedDocuments = localStorage.getItem('trainingDocuments');
    return savedDocuments ? JSON.parse(savedDocuments) : mockDocuments;
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [isCreateFileDialogOpen, setIsCreateFileDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<TrainingDocument | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<Set<number>>(new Set());
  const [uploadData, setUploadData] = useState({
    trainingDate: '',
    description: ''
  });
  const { toast } = useToast();

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date for display
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get documents for current folder level
  const getCurrentLevelDocuments = () => {
    let currentDocs = documents;
    
    // If we're in a subfolder, create sample subdocuments
    if (currentPath.length > 0) {
      const parentFolder = currentPath[currentPath.length - 1];
      
      // Generate subdocuments based on parent folder
      const subDocs: TrainingDocument[] = [];
      const baseId = Date.now();
      
      if (parentFolder === 'Safety_Management_System_Analysis') {
        subDocs.push(
          {
            id: baseId + 1,
            fileName: 'DOM_Analysis_Reports',
            fileType: 'folder',
            category: 'analysis_subfolder',
            trainingSubject: 'DOM Analysis Reports',
            trainingDate: new Date('2025-01-21'),
            instructorName: 'System Analysis',
            studentCount: 8,
            location: 'Web Analysis',
            fileSize: 15400,
            uploadDate: new Date('2025-01-21'),
            description: 'Complete DOM inspection analysis reports'
          },
          {
            id: baseId + 2,
            fileName: 'Workspace_Performance_Data',
            fileType: 'folder',
            category: 'performance_subfolder',
            trainingSubject: 'Workspace Performance Data',
            trainingDate: new Date('2025-01-21'),
            instructorName: 'Data Collection',
            studentCount: 12,
            location: 'System Data',
            fileSize: 8200,
            uploadDate: new Date('2025-01-21'),
            description: 'Performance metrics and usage analytics'
          },
          {
            id: baseId + 3,
            fileName: 'Security_Assessments',
            fileType: 'folder',
            category: 'security_subfolder',
            trainingSubject: 'Security Assessments',
            trainingDate: new Date('2025-01-21'),
            instructorName: 'Security Team',
            studentCount: 6,
            location: 'Security Analysis',
            fileSize: 25600,
            uploadDate: new Date('2025-01-21'),
            description: 'Security vulnerability assessments and reports'
          }
        );
      } else if (parentFolder === 'Abatement_SDS') {
        const subfolders = [
          { name: 'Asbestos_Abatement_Chemicals', count: 8, desc: 'Asbestos removal chemical safety sheets' },
          { name: 'Lead_Paint_Removal_Chemicals', count: 6, desc: 'Lead paint abatement chemical documentation' },
          { name: 'Mold_Remediation_Products', count: 7, desc: 'Mold removal and treatment chemicals' },
          { name: 'General_Cleaning_Solvents', count: 6, desc: 'General purpose cleaning and decontamination' }
        ];
        
        subfolders.forEach((folder, index) => {
          subDocs.push({
            id: baseId + index + 1,
            fileName: folder.name,
            fileType: 'folder',
            category: 'sds_subfolder',
            trainingSubject: folder.name.replace(/_/g, ' '),
            trainingDate: new Date('2024-10-28'),
            instructorName: 'Chemical Safety',
            studentCount: folder.count,
            location: 'Chemical Database',
            fileSize: Math.floor(Math.random() * 5000000) + 1000000,
            uploadDate: new Date('2024-10-28'),
            description: folder.desc
          });
        });
      } else if (parentFolder === 'Demo_SDS') {
        const demoCategories = [
          { name: 'Basic_Chemical_Safety_Training', count: 5, desc: 'Basic chemical handling training materials' },
          { name: 'Advanced_Hazmat_Procedures', count: 4, desc: 'Advanced hazardous materials training' },
          { name: 'Emergency_Response_Training', count: 4, desc: 'Chemical emergency response procedures' },
          { name: 'PPE_Selection_Guidelines', count: 3, desc: 'Personal protective equipment selection guides' }
        ];
        
        demoCategories.forEach((category, index) => {
          subDocs.push({
            id: baseId + index + 1,
            fileName: category.name,
            fileType: 'folder',
            category: 'demo_subfolder',
            trainingSubject: category.name.replace(/_/g, ' '),
            trainingDate: new Date('2024-10-28'),
            instructorName: 'Training Materials',
            studentCount: category.count,
            location: 'Training Database',
            fileSize: Math.floor(Math.random() * 3000000) + 500000,
            uploadDate: new Date('2024-10-28'),
            description: category.desc
          });
        });
      } else if (parentFolder === 'EHS_Manuals') {
        const manualCategories = [
          { name: 'Emergency_Response_Procedures', count: 8, desc: 'Emergency response and evacuation procedures' },
          { name: 'Environmental_Compliance_Guidelines', count: 12, desc: 'Environmental regulations and compliance' },
          { name: 'Health_Safety_Training_Protocols', count: 15, desc: 'Health and safety training documentation' },
          { name: 'Workplace_Safety_Standards', count: 10, desc: 'OSHA workplace safety standards and requirements' }
        ];
        
        manualCategories.forEach((manual, i) => {
          subDocs.push({
            id: baseId + i + 1,
            fileName: manual.name,
            fileType: 'folder',
            category: 'ehs_subfolder',
            trainingSubject: manual.name.replace(/_/g, ' '),
            trainingDate: new Date('2025-01-21'),
            instructorName: 'EH&S Department',
            studentCount: manual.count,
            location: 'Safety Documentation',
            fileSize: Math.floor(Math.random() * 50000000) + 10000000,
            uploadDate: new Date('2025-01-21'),
            description: manual.desc
          });
        });
      } else if (parentFolder === 'Tool_Box_Talks') {
        const toolBoxCategories = [
          { name: 'Fall_Protection_Talks', count: 12, desc: 'Fall protection safety toolbox talks' },
          { name: 'Electrical_Safety_Discussions', count: 8, desc: 'Electrical safety awareness sessions' },
          { name: 'Heavy_Equipment_Safety', count: 10, desc: 'Heavy machinery and equipment safety' },
          { name: 'Personal_Protective_Equipment', count: 9, desc: 'PPE selection and usage guidance' },
          { name: 'Hazard_Communication', count: 8, desc: 'Chemical hazard communication training' },
          { name: 'Confined_Space_Safety', count: 6, desc: 'Confined space entry and safety procedures' },
          { name: 'Hot_Work_Permits', count: 7, desc: 'Hot work safety and permit procedures' },
          { name: 'Scaffolding_Safety', count: 5, desc: 'Scaffolding inspection and safety protocols' }
        ];
        
        toolBoxCategories.forEach((category, i) => {
          subDocs.push({
            id: baseId + i + 1,
            fileName: category.name,
            fileType: 'folder',
            category: 'toolbox_subfolder',
            trainingSubject: category.name.replace(/_/g, ' '),
            trainingDate: new Date('2027-09-15'),
            instructorName: 'Safety Training',
            studentCount: category.count,
            location: 'Training Sessions',
            fileSize: Math.floor(Math.random() * 5000000) + 2000000,
            uploadDate: new Date('2027-09-15'),
            description: category.desc
          });
        });
      
      // Add deeper level subfolders for specific categories
      } else if (parentFolder === 'Fall_Protection_Talks') {
        const fallProtectionTopics = [
          { name: 'Harness_Inspection_Protocols', count: 4, desc: 'Daily harness inspection procedures' },
          { name: 'Anchor_Point_Selection', count: 3, desc: 'Proper anchor point identification and testing' },
          { name: 'Rescue_Procedures', count: 3, desc: 'Fall rescue and emergency response' },
          { name: 'Ladder_Safety_Guidelines', count: 2, desc: 'Ladder setup and safety procedures' }
        ];
        
        fallProtectionTopics.forEach((topic, i) => {
          subDocs.push({
            id: baseId + i + 1,
            fileName: topic.name,
            fileType: 'folder',
            category: 'fall_protection_detail',
            trainingSubject: topic.name.replace(/_/g, ' '),
            trainingDate: new Date('2027-09-15'),
            instructorName: 'Fall Protection Specialist',
            studentCount: topic.count,
            location: 'Fall Protection Training',
            fileSize: Math.floor(Math.random() * 2000000) + 500000,
            uploadDate: new Date('2027-09-15'),
            description: topic.desc
          });
        });
      
      } else if (parentFolder === 'Asbestos_Abatement_Chemicals') {
        const asbestosChemicals = [
          { name: 'Encapsulants_and_Sealers', count: 3, desc: 'Asbestos encapsulation products' },
          { name: 'Surfactants_and_Wetting_Agents', count: 2, desc: 'Fiber suppression chemicals' },
          { name: 'Decontamination_Solutions', count: 3, desc: 'Personnel and equipment decontamination' }
        ];
        
        asbestosChemicals.forEach((chemical, i) => {
          subDocs.push({
            id: baseId + i + 1,
            fileName: chemical.name,
            fileType: 'folder',
            category: 'asbestos_chemical_detail',
            trainingSubject: chemical.name.replace(/_/g, ' '),
            trainingDate: new Date('2024-10-28'),
            instructorName: 'Asbestos Specialist',
            studentCount: chemical.count,
            location: 'Chemical Safety',
            fileSize: Math.floor(Math.random() * 1500000) + 300000,
            uploadDate: new Date('2024-10-28'),
            description: chemical.desc
          });
        });
      
      } else if (parentFolder === 'Emergency_Response_Procedures') {
        const emergencyTypes = [
          { name: 'Fire_Emergency_Protocols', count: 4, desc: 'Fire response and evacuation procedures' },
          { name: 'Chemical_Spill_Response', count: 3, desc: 'Hazardous material spill containment' },
          { name: 'Medical_Emergency_Response', count: 2, desc: 'Workplace injury and medical emergency protocols' },
          { name: 'Natural_Disaster_Procedures', count: 3, desc: 'Weather and natural disaster response plans' }
        ];
        
        emergencyTypes.forEach((emergency, i) => {
          subDocs.push({
            id: baseId + i + 1,
            fileName: emergency.name,
            fileType: 'folder',
            category: 'emergency_detail',
            trainingSubject: emergency.name.replace(/_/g, ' '),
            trainingDate: new Date('2025-01-21'),
            instructorName: 'Emergency Response Team',
            studentCount: emergency.count,
            location: 'Emergency Planning',
            fileSize: Math.floor(Math.random() * 3000000) + 800000,
            uploadDate: new Date('2025-01-21'),
            description: emergency.desc
          });
        });
      }
      
      currentDocs = subDocs;
    }
    
    // Apply search filter
    return currentDocs.filter(doc => {
      return searchTerm === '' || 
        doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.instructorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.trainingSubject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  // Handle document selection
  const toggleDocumentSelection = (docId: number) => {
    const newSelected = new Set(selectedDocuments);
    if (newSelected.has(docId)) {
      newSelected.delete(docId);
    } else {
      newSelected.add(docId);
    }
    setSelectedDocuments(newSelected);
  };

  // Handle folder navigation
  const handleFolderClick = (doc: TrainingDocument, event: React.MouseEvent) => {
    event.stopPropagation();
    if (doc.fileType === 'folder') {
      setCurrentPath([...currentPath, doc.fileName]);
    }
  };

  // Handle breadcrumb navigation
  const navigateToPath = (pathIndex: number) => {
    setCurrentPath(currentPath.slice(0, pathIndex + 1));
  };

  // Navigate back to parent
  const navigateBack = () => {
    setCurrentPath(currentPath.slice(0, -1));
  };

  // Handle view document
  const handleViewDocument = (doc: TrainingDocument) => {
    if (doc.fileType === 'folder') {
      handleFolderClick(doc, {} as React.MouseEvent);
    } else {
      setViewingDocument(doc);
      setIsViewDialogOpen(true);
    }
  };

  // Handle create file
  const handleCreateFile = () => {
    if (!uploadData.trainingDate || !uploadData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in training date and description.",
        variant: "destructive",
      });
      return;
    }

    const newDocument: TrainingDocument = {
      id: Date.now(),
      fileName: uploadData.description.replace(/\s+/g, '_'),
      fileType: 'folder',
      category: 'training_file',
      trainingSubject: uploadData.description,
      trainingDate: new Date(uploadData.trainingDate),
      instructorName: 'Current User',
      studentCount: 1,
      location: 'Training Documentation',
      fileSize: 1024000,
      uploadDate: new Date(),
      description: uploadData.description,
      fileContent: `Training File: ${uploadData.description}
Date: ${uploadData.trainingDate}
Created: ${new Date().toLocaleString()}

This training file was created using the Create File system.`
    };

    const updatedDocuments = [newDocument, ...documents];
    setDocuments(updatedDocuments);
    localStorage.setItem('trainingDocuments', JSON.stringify(updatedDocuments));

    toast({
      title: "File Created",
      description: `Training file "${uploadData.description}" has been created.`,
    });

    setUploadData({ trainingDate: '', description: '' });
    setIsCreateFileDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {/* File Manager Header */}
      <div className="bg-white border-b border-blue-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2 text-blue-500 text-sm">
            <button 
              onClick={() => setCurrentPath([])}
              className="flex items-center space-x-1 hover:text-blue-600 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
            {currentPath.map((folder, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span>/</span>
                <button
                  onClick={() => navigateToPath(index)}
                  className="hover:text-blue-600 cursor-pointer"
                >
                  {folder.replace(/_/g, ' ')}
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" className="text-xs">
              <Settings className="w-3 h-3 mr-1" />
              View
            </Button>
            <Button size="sm" variant="outline" className="text-xs">
              <Grid className="w-3 h-3 mr-1" />
              Filter
            </Button>
          </div>
        </div>
        
        {/* Action Bar */}
        <div className="flex items-center justify-between p-4 border-b border-blue-200">
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setIsCreateFileDialogOpen(true)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-full"
            >
              + New
            </Button>
            <div className="flex items-center space-x-2 text-sm text-blue-500">
              <Button size="sm" variant="ghost" className="text-xs">
                Type
              </Button>
              <Button size="sm" variant="ghost" className="text-xs">
                People
              </Button>
              <Button size="sm" variant="ghost" className="text-xs">
                Modified
              </Button>
              <Button size="sm" variant="ghost" className="text-xs">
                Location
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-blue-100 rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-blue-300 mr-2" />
              <input
                type="text"
                placeholder="Search in Drive"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-sm outline-none w-64"
              />
            </div>
            <Button size="sm" variant="ghost" className="p-2">
              <Grid className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" className="p-2">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* File List */}
      <div className="bg-white">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-blue-200 bg-blue-50 text-sm font-medium text-blue-500">
          <div className="col-span-1">
            <input type="checkbox" className="rounded" />
          </div>
          <div className="col-span-5">Name</div>
          <div className="col-span-3">Last modified</div>
          <div className="col-span-2">Owner</div>
          <div className="col-span-1">Location</div>
        </div>
        
        {/* Back button when in subfolder */}
        {currentPath.length > 0 && (
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-blue-100 hover:bg-blue-50 cursor-pointer items-center"
               onClick={navigateBack}>
            <div className="col-span-1">
              <input type="checkbox" className="rounded opacity-50" disabled />
            </div>
            <div className="col-span-5 flex items-center">
              <FolderIcon className="w-5 h-5 text-blue-300 mr-3" />
              <span className="text-sm text-blue-500">.. (Back to parent folder)</span>
            </div>
            <div className="col-span-3 text-sm text-blue-400">-</div>
            <div className="col-span-2 text-sm text-blue-400">-</div>
            <div className="col-span-1 text-sm text-blue-400">-</div>
          </div>
        )}
        
        {/* Current level documents */}
        {getCurrentLevelDocuments().map((doc) => (
          <div
            key={doc.id}
            className="grid grid-cols-12 gap-4 p-4 border-b border-blue-100 hover:bg-blue-50 cursor-pointer items-center"
            onClick={() => handleViewDocument(doc)}
          >
            <div className="col-span-1">
              <input
                type="checkbox"
                checked={selectedDocuments.has(doc.id)}
                onChange={(e) => {
                  e.stopPropagation();
                  toggleDocumentSelection(doc.id);
                }}
                className="rounded"
              />
            </div>
            
            <div className="col-span-5 flex items-center">
              <FolderIcon className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
              <span className="text-sm text-blue-800 truncate">
                {doc.fileName.replace(/_/g, ' ')}
              </span>
            </div>
            
            <div className="col-span-3 text-sm text-blue-500">
              Created • {formatDate(doc.trainingDate)}
            </div>
            
            <div className="col-span-2 flex items-center">
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium mr-2">
                {doc.instructorName.charAt(0)}
              </div>
              <span className="text-sm text-blue-500 truncate">me</span>
            </div>
            
            <div className="col-span-1">
              <div className="flex items-center text-sm text-blue-500">
                <FolderIcon className="w-4 h-4 mr-1" />
                <span className="text-xs">{doc.location.split(' ')[0]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create File Dialog */}
      <Dialog open={isCreateFileDialogOpen} onOpenChange={setIsCreateFileDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Training File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-600 mb-1">
                Training Date
              </label>
              <input
                type="date"
                value={uploadData.trainingDate}
                onChange={(e) => setUploadData(prev => ({ ...prev, trainingDate: e.target.value }))}
                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-600 mb-1">
                File Description
              </label>
              <input
                type="text"
                placeholder="e.g., Safety Meeting Minutes, Training Materials"
                value={uploadData.description}
                onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsCreateFileDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateFile}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create File
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Document Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewingDocument?.fileName.replace(/_/g, ' ')}</DialogTitle>
          </DialogHeader>
          {viewingDocument && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Training Date:</strong> {formatDate(viewingDocument.trainingDate)}
                </div>
                <div>
                  <strong>Location:</strong> {viewingDocument.location}
                </div>
                <div>
                  <strong>File Count:</strong> {viewingDocument.studentCount}
                </div>
                <div>
                  <strong>Total Size:</strong> {formatFileSize(viewingDocument.fileSize)}
                </div>
              </div>
              <div>
                <strong>Description:</strong>
                <p className="mt-1 text-blue-600">{viewingDocument.description}</p>
              </div>
              {viewingDocument.fileContent && (
                <div>
                  <strong>Content Preview:</strong>
                  <pre className="mt-1 p-3 bg-blue-50 rounded-md text-xs overflow-auto max-h-64 font-mono">
                    {viewingDocument.fileContent}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
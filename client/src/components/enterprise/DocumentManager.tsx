import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Upload, 
  Download, 
  Search, 
  Calendar, 
  User, 
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Archive,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  FileCheck,
  Building,
  Users
} from 'lucide-react';

interface Document {
  id: string;
  title: string;
  type: 'policy' | 'procedure' | 'training' | 'certificate' | 'inspection' | 'incident' | 'audit' | 'other';
  category: string;
  description: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  expiryDate?: string;
  status: 'active' | 'expired' | 'pending_review' | 'archived';
  uploadedBy: string;
  department: string;
  tags: string[];
  version: string;
  isRequired: boolean;
  accessLevel: 'public' | 'restricted' | 'confidential';
}

const DocumentManager: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { toast } = useToast();

  // Mock data for demonstration
  const mockDocuments: Document[] = [
    {
      id: 'doc001',
      title: 'Fall Protection Safety Policy',
      type: 'policy',
      category: 'Safety Policies',
      description: 'Comprehensive fall protection requirements for all work at height activities',
      fileName: 'fall_protection_policy_v3.pdf',
      fileSize: '2.4 MB',
      uploadDate: '2024-12-15',
      expiryDate: '2025-12-15',
      status: 'active',
      uploadedBy: 'Safety Director',
      department: 'Safety',
      tags: ['fall protection', 'height work', 'PPE', 'OSHA'],
      version: '3.0',
      isRequired: true,
      accessLevel: 'public'
    },
    {
      id: 'doc002',
      title: 'Forklift Operation Training Manual',
      type: 'training',
      category: 'Training Materials',
      description: 'Complete training guide for powered industrial truck operations',
      fileName: 'forklift_training_manual.pdf',
      fileSize: '5.1 MB',
      uploadDate: '2024-11-20',
      expiryDate: '2025-11-20',
      status: 'active',
      uploadedBy: 'Training Manager',
      department: 'Operations',
      tags: ['forklift', 'PIT', 'training', 'certification'],
      version: '2.1',
      isRequired: true,
      accessLevel: 'public'
    },
    {
      id: 'doc003',
      title: 'Quarterly Safety Inspection Report',
      type: 'inspection',
      category: 'Inspection Reports',
      description: 'Q4 2024 comprehensive safety inspection findings and recommendations',
      fileName: 'q4_2024_inspection_report.pdf',
      fileSize: '1.8 MB',
      uploadDate: '2024-12-30',
      status: 'active',
      uploadedBy: 'Safety Inspector',
      department: 'Safety',
      tags: ['inspection', 'quarterly', 'compliance', 'findings'],
      version: '1.0',
      isRequired: false,
      accessLevel: 'restricted'
    },
    {
      id: 'doc004',
      title: 'Emergency Response Procedure',
      type: 'procedure',
      category: 'Emergency Procedures',
      description: 'Step-by-step emergency response protocols for all facility incidents',
      fileName: 'emergency_response_procedure.pdf',
      fileSize: '3.2 MB',
      uploadDate: '2024-10-01',
      expiryDate: '2025-10-01',
      status: 'pending_review',
      uploadedBy: 'Emergency Coordinator',
      department: 'Safety',
      tags: ['emergency', 'response', 'incident', 'evacuation'],
      version: '4.2',
      isRequired: true,
      accessLevel: 'public'
    },
    {
      id: 'doc005',
      title: 'John Smith - OSHA 30 Certificate',
      type: 'certificate',
      category: 'Employee Certificates',
      description: 'OSHA 30-Hour Construction Safety Certificate',
      fileName: 'john_smith_osha30.pdf',
      fileSize: '0.8 MB',
      uploadDate: '2024-09-15',
      expiryDate: '2027-09-15',
      status: 'active',
      uploadedBy: 'John Smith',
      department: 'Construction',
      tags: ['OSHA 30', 'certificate', 'construction', 'training'],
      version: '1.0',
      isRequired: false,
      accessLevel: 'restricted'
    },
    {
      id: 'doc006',
      title: 'Incident Report - Equipment Malfunction',
      type: 'incident',
      category: 'Incident Reports',
      description: 'Near-miss incident involving hydraulic lift malfunction',
      fileName: 'incident_report_20241201.pdf',
      fileSize: '1.2 MB',
      uploadDate: '2024-12-01',
      status: 'active',
      uploadedBy: 'Site Supervisor',
      department: 'Maintenance',
      tags: ['incident', 'near-miss', 'equipment', 'investigation'],
      version: '1.0',
      isRequired: false,
      accessLevel: 'confidential'
    }
  ];

  useEffect(() => {
    setDocuments(mockDocuments);
  }, []);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;
    const matchesDepartment = selectedDepartment === 'all' || doc.department === selectedDepartment;
    
    return matchesSearch && matchesType && matchesStatus && matchesDepartment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-blue-100 text-blue-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'policy': return <Shield className="w-4 h-4" />;
      case 'procedure': return <FileText className="w-4 h-4" />;
      case 'training': return <Users className="w-4 h-4" />;
      case 'certificate': return <FileCheck className="w-4 h-4" />;
      case 'inspection': return <Search className="w-4 h-4" />;
      case 'incident': return <AlertTriangle className="w-4 h-4" />;
      case 'audit': return <CheckCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'public': return 'bg-blue-100 text-blue-800';
      case 'restricted': return 'bg-orange-100 text-orange-800';
      case 'confidential': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const handleUpload = () => {
    toast({
      title: "Upload Complete",
      description: "Document has been successfully uploaded and indexed.",
    });
    setIsUploadDialogOpen(false);
  };

  const handleDownload = (doc: Document) => {
    toast({
      title: "Download Started",
      description: `Downloading ${doc.fileName}...`,
    });
  };

  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setIsViewDialogOpen(true);
  };

  const getExpiryWarning = (expiryDate?: string) => {
    if (!expiryDate) return null;
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
      return <Badge variant="destructive" className="text-xs">Expired</Badge>;
    } else if (daysUntilExpiry <= 30) {
      return <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">Expires in {daysUntilExpiry} days</Badge>;
    }
    return null;
  };

  const documentStats = {
    total: documents.length,
    active: documents.filter(d => d.status === 'active').length,
    expired: documents.filter(d => d.status === 'expired').length,
    pendingReview: documents.filter(d => d.status === 'pending_review').length,
    expiringThisMonth: documents.filter(d => {
      if (!d.expiryDate) return false;
      const expiry = new Date(d.expiryDate);
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
      return expiry <= nextMonth && expiry > today;
    }).length
  };

  return (
    <div className="space-y-6">
      {/* Header and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-300">Total Documents</p>
                <p className="text-2xl font-bold text-white">{documentStats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-300">Active</p>
                <p className="text-2xl font-bold text-green-400">{documentStats.active}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-300">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-400">{documentStats.pendingReview}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-300">Expired</p>
                <p className="text-2xl font-bold text-red-400">{documentStats.expired}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-300">Expiring Soon</p>
                <p className="text-2xl font-bold text-orange-400">{documentStats.expiringThisMonth}</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-blue-300" />
                <Input
                  placeholder="Search documents by title, description, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder-blue-300"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="policy">Policy</SelectItem>
                  <SelectItem value="procedure">Procedure</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                  <SelectItem value="incident">Incident</SelectItem>
                  <SelectItem value="audit">Audit</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="pending_review">Pending Review</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-36 bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Safety">Safety</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Construction">Construction</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                </SelectContent>
              </Select>
              
              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] bg-blue-800 border-blue-600">
                  <DialogHeader>
                    <DialogTitle className="text-white">Upload Document</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title" className="text-white">Title</Label>
                        <Input id="title" placeholder="Document title" className="bg-blue-700 border-blue-600 text-white" />
                      </div>
                      <div>
                        <Label htmlFor="type" className="text-white">Type</Label>
                        <Select>
                          <SelectTrigger className="bg-blue-700 border-blue-600 text-white">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="policy">Policy</SelectItem>
                            <SelectItem value="procedure">Procedure</SelectItem>
                            <SelectItem value="training">Training</SelectItem>
                            <SelectItem value="certificate">Certificate</SelectItem>
                            <SelectItem value="inspection">Inspection</SelectItem>
                            <SelectItem value="incident">Incident</SelectItem>
                            <SelectItem value="audit">Audit</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="description" className="text-white">Description</Label>
                      <Textarea id="description" placeholder="Document description" className="bg-blue-700 border-blue-600 text-white" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="department" className="text-white">Department</Label>
                        <Select>
                          <SelectTrigger className="bg-blue-700 border-blue-600 text-white">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Safety">Safety</SelectItem>
                            <SelectItem value="Operations">Operations</SelectItem>
                            <SelectItem value="Construction">Construction</SelectItem>
                            <SelectItem value="Maintenance">Maintenance</SelectItem>
                            <SelectItem value="HR">HR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="access" className="text-white">Access Level</Label>
                        <Select>
                          <SelectTrigger className="bg-blue-700 border-blue-600 text-white">
                            <SelectValue placeholder="Select access level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="restricted">Restricted</SelectItem>
                            <SelectItem value="confidential">Confidential</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="file" className="text-white">File</Label>
                      <div className="border-2 border-dashed border-blue-600 rounded-lg p-6 text-center">
                        <Upload className="w-12 h-12 mx-auto text-blue-300 mb-4" />
                        <p className="text-blue-300">Click to upload or drag and drop</p>
                        <p className="text-sm text-blue-400">PDF, DOC, DOCX, XLS, XLSX (max 25MB)</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleUpload} className="bg-blue-600 hover:bg-blue-700">
                        Upload Document
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document List */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-6">
          <div className="space-y-4">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getTypeIcon(doc.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-medium truncate">{doc.title}</h3>
                        {doc.isRequired && (
                          <Badge variant="secondary" className="text-xs bg-red-100 text-red-800">Required</Badge>
                        )}
                        {getExpiryWarning(doc.expiryDate)}
                      </div>
                      
                      <p className="text-blue-300 text-sm mb-2">{doc.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge className={getStatusColor(doc.status)}>
                          {doc.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={getAccessLevelColor(doc.accessLevel)}>
                          {doc.accessLevel}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {doc.type}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-2">
                        {doc.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-blue-300">
                        <span className="flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          {doc.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {doc.uploadedBy}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(doc.uploadDate).toLocaleDateString()}
                        </span>
                        <span>{doc.fileSize}</span>
                        <span>v{doc.version}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleViewDocument(doc)}
                      className="text-blue-300 hover:text-white"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownload(doc)}
                      className="text-blue-300 hover:text-white"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-blue-300 hover:text-white"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-blue-300 mb-4" />
              <p className="text-blue-300 text-lg">No documents found</p>
              <p className="text-blue-400 text-sm">Try adjusting your search criteria or upload a new document</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[800px] bg-blue-800 border-blue-600">
          <DialogHeader>
            <DialogTitle className="text-white">Document Details</DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Title</Label>
                  <p className="text-blue-300">{selectedDocument.title}</p>
                </div>
                <div>
                  <Label className="text-white">Type</Label>
                  <p className="text-blue-300">{selectedDocument.type}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-white">Description</Label>
                <p className="text-blue-300">{selectedDocument.description}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-white">Department</Label>
                  <p className="text-blue-300">{selectedDocument.department}</p>
                </div>
                <div>
                  <Label className="text-white">Uploaded By</Label>
                  <p className="text-blue-300">{selectedDocument.uploadedBy}</p>
                </div>
                <div>
                  <Label className="text-white">Upload Date</Label>
                  <p className="text-blue-300">{new Date(selectedDocument.uploadDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Version</Label>
                  <p className="text-blue-300">v{selectedDocument.version}</p>
                </div>
                <div>
                  <Label className="text-white">File Size</Label>
                  <p className="text-blue-300">{selectedDocument.fileSize}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-white">Tags</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedDocument.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => handleDownload(selectedDocument)} className="bg-blue-600 hover:bg-blue-700">
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
};

export default DocumentManager;
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Award, 
  CreditCard, 
  Plus, 
  Search,
  Filter,
  Download,
  Edit,
  Eye,
  FileText,
  User,
  Calendar,
  CheckCircle,
  AlertCircle,
  Database,
  Brain,
  TrendingUp,
  Shield,
  Building,
  Printer
} from 'lucide-react';
import { SafetySyncIcon } from "@/components/ui/safetysync-icon";

interface Certificate {
  id: number;
  employeeName: string;
  employeeId: string;
  training: string;
  issueDate: string;
  expirationDate: string;
  instructor: string;
  instructorCredentials: string;
  company: string;
  status: 'active' | 'expired' | 'pending';
  type: 'certificate' | 'wallet-card';
  compliance: string[];
  equipment?: string[];
  hours: number;
  certificateNumber: string;
}

interface CertificateTemplate {
  id: number;
  name: string;
  category: string;
  type: 'certificate' | 'wallet-card';
  compliance: string[];
  defaultHours: number;
  description: string;
  status: 'active' | 'draft';
}

const mockCertificates: Certificate[] = [
  {
    id: 1,
    employeeName: "John Smith",
    employeeId: "EMP001",
    training: "Fall Protection Certification",
    issueDate: "2025-01-10",
    expirationDate: "2026-01-10",
    instructor: "Sarah Johnson",
    instructorCredentials: "CSHO, SHEP",
    company: "SafetySync.AI",
    status: 'active',
    type: 'certificate',
    compliance: ["OSHA 1926.501", "EM 385-1-1"],
    hours: 8,
    certificateNumber: "FSC-2025-001"
  },
  {
    id: 2,
    employeeName: "Mike Rodriguez",
    employeeId: "EMP002",
    training: "Forklift Operation",
    issueDate: "2025-01-05",
    expirationDate: "2028-01-05",
    instructor: "David Brown",
    instructorCredentials: "NCCCO, OSHA 501",
    company: "SafetySync.AI",
    status: 'active',
    type: 'wallet-card',
    compliance: ["OSHA 1910.178"],
    equipment: ["JLG 40 AJ", "Genie Z62/40", "CAT 315 FL"],
    hours: 6,
    certificateNumber: "FLT-2025-002"
  },
  {
    id: 3,
    employeeName: "Lisa Chen",
    employeeId: "EMP003",
    training: "HAZWOPER 40-Hour",
    issueDate: "2024-12-15",
    expirationDate: "2025-12-15",
    instructor: "Michael Davis",
    instructorCredentials: "CSHO, CHSP",
    company: "SafetySync.AI",
    status: 'active',
    type: 'certificate',
    compliance: ["OSHA 1910.120", "EPA 40 CFR 311"],
    hours: 40,
    certificateNumber: "HAZ-2024-003"
  }
];

const mockTemplates: CertificateTemplate[] = [
  {
    id: 1,
    name: "Fall Protection Certificate",
    category: "Safety Training",
    type: 'certificate',
    compliance: ["OSHA 1926.501", "EM 385-1-1"],
    defaultHours: 8,
    description: "Standard fall protection certification template",
    status: 'active'
  },
  {
    id: 2,
    name: "Forklift Wallet Card",
    category: "Equipment Operation",
    type: 'wallet-card',
    compliance: ["OSHA 1910.178"],
    defaultHours: 6,
    description: "Digital wallet card for forklift operators",
    status: 'active'
  },
  {
    id: 3,
    name: "HAZWOPER Certificate",
    category: "Environmental",
    type: 'certificate',
    compliance: ["OSHA 1910.120", "EPA 40 CFR 311"],
    defaultHours: 40,
    description: "Hazardous waste operations certification",
    status: 'active'
  }
];

export default function CertificateGeneration() {
  const [activeTab, setActiveTab] = useState("certificates");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showGenerationForm, setShowGenerationForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<CertificateTemplate | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'expired': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'draft': return 'bg-blue-400/20 text-blue-300 border-blue-400/30';
      default: return 'bg-blue-400/20 text-blue-300 border-blue-400/30';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'certificate': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'wallet-card': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-blue-400/20 text-blue-300 border-blue-400/30';
    }
  };

  const filteredCertificates = mockCertificates.filter(cert => {
    const matchesSearch = cert.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.training.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || cert.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || template.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const activeCertificates = mockCertificates.filter(cert => cert.status === 'active').length;
  const expiredCertificates = mockCertificates.filter(cert => cert.status === 'expired').length;
  const pendingCertificates = mockCertificates.filter(cert => cert.status === 'pending').length;
  const totalGenerated = mockCertificates.length;

  return (
    <div className="space-y-6 relative">
      {/* Tech grid background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 opacity-10 rounded-lg"></div>
      
      {/* Floating tech icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 animate-float">
          <Award className="w-8 h-8 text-blue-400/30" />
        </div>
        <div className="absolute top-32 right-20 animate-float-delay-1">
          <Brain className="w-10 h-10 text-purple-400/30" />
        </div>
        <div className="absolute bottom-20 left-20 animate-float-delay-2">
          <TrendingUp className="w-6 h-6 text-green-400/30" />
        </div>
        <div className="absolute bottom-32 right-32 animate-float-delay-3">
          <Shield className="w-7 h-7 text-emerald-400/30" />
        </div>
      </div>

      <div className="flex items-center justify-between relative z-10">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <SafetySyncIcon size={32} className="rounded-lg" />
            Certificate Generation
          </h2>
          <p className="text-blue-300">Generate professional certificates and digital wallet cards</p>
          <p className="text-blue-300 text-sm mt-1">
            🎓 OSHA-compliant certificates with automated generation • First 15 FREE monthly
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
            onClick={() => setShowGenerationForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Generate New
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
        <Card className="bg-black/20 backdrop-blur-sm border-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm">Total Generated</p>
                <p className="text-2xl font-bold text-white">{totalGenerated}</p>
                <p className="text-blue-400 text-sm">🤖 AI-Generated</p>
              </div>
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm">Active Certificates</p>
                <p className="text-2xl font-bold text-white">{activeCertificates}</p>
                <p className="text-green-400 text-sm">Valid & Current</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm">Expiring Soon</p>
                <p className="text-2xl font-bold text-white">{expiredCertificates}</p>
                <p className="text-yellow-400 text-sm">Next 30 days</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm">Monthly Usage</p>
                <p className="text-2xl font-bold text-white">12/15</p>
                <p className="text-emerald-400 text-sm">3 remaining free</p>
              </div>
              <CreditCard className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4 relative z-10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-300" />
          <Input
            placeholder="Search certificates, employees, or training..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-blue-700/50 border-blue-600 text-white placeholder-blue-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-300" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-blue-700/50 border-blue-600 text-white rounded-md px-3 py-2"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="pending">Pending</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="relative z-10">
        <TabsList className="grid w-full grid-cols-3 bg-black/20 backdrop-blur-sm border-blue-700">
          <TabsTrigger 
            value="certificates" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200"
          >
            <Award className="h-4 w-4" />
            Certificates
          </TabsTrigger>
          <TabsTrigger 
            value="templates" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200"
          >
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger 
            value="generation" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            Generate New
          </TabsTrigger>
        </TabsList>

        <TabsContent value="certificates" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCertificates.map((certificate) => (
              <Card key={certificate.id} className="bg-black/20 backdrop-blur-sm border-blue-700">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white">{certificate.training}</CardTitle>
                      <CardDescription className="text-blue-300">
                        {certificate.employeeName} • {certificate.certificateNumber}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(certificate.status)}>
                        {certificate.status}
                      </Badge>
                      <Badge className={getTypeColor(certificate.type)}>
                        {certificate.type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300 text-sm">Issued: {certificate.issueDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-400" />
                      <span className="text-gray-300 text-sm">Expires: {certificate.expirationDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-300 text-sm">{certificate.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-emerald-400" />
                      <span className="text-gray-300 text-sm">{certificate.company}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-blue-300 text-sm font-medium">Compliance Standards:</p>
                    <div className="flex flex-wrap gap-1">
                      {certificate.compliance.map((comp, index) => (
                        <Badge key={index} variant="outline" className="text-xs text-blue-300 border-blue-500/30">
                          {comp}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {certificate.equipment && (
                    <div className="space-y-2">
                      <p className="text-blue-300 text-sm font-medium">Authorized Equipment:</p>
                      <div className="flex flex-wrap gap-1">
                        {certificate.equipment.map((eq, index) => (
                          <Badge key={index} variant="outline" className="text-xs text-emerald-300 border-emerald-500/30">
                            {eq}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                      <Download className="w-3 h-3 mr-1" />
                      Download PDF
                    </Button>
                    <Button size="sm" variant="outline" className="border-blue-500 text-gray-300">
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="bg-black/20 backdrop-blur-sm border-blue-700">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white">{template.name}</CardTitle>
                      <CardDescription className="text-blue-300">
                        {template.category} • {template.defaultHours} hours
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(template.status)}>
                        {template.status}
                      </Badge>
                      <Badge className={getTypeColor(template.type)}>
                        {template.type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 text-sm">{template.description}</p>
                  
                  <div className="space-y-2">
                    <p className="text-blue-300 text-sm font-medium">Compliance Standards:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.compliance.map((comp, index) => (
                        <Badge key={index} variant="outline" className="text-xs text-emerald-300 border-emerald-500/30">
                          {comp}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button 
                      size="sm" 
                      className="bg-emerald-500 hover:bg-emerald-600 text-white"
                      onClick={() => {
                        setSelectedTemplate(template);
                        setShowGenerationForm(true);
                      }}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Use Template
                    </Button>
                    <Button size="sm" variant="outline" className="border-blue-500 text-gray-300">
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="generation" className="space-y-6">
          <Card className="bg-black/20 backdrop-blur-sm border-blue-700">
            <CardHeader>
              <CardTitle className="text-white">Generate New Certificate</CardTitle>
              <CardDescription className="text-blue-300">
                Create professional certificates and digital wallet cards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Employee Name</Label>
                    <Input 
                      className="bg-blue-700/50 border-blue-600 text-white"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Training Program</Label>
                    <Select>
                      <SelectTrigger className="bg-blue-700/50 border-blue-600 text-white">
                        <SelectValue placeholder="Select training program" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fall-protection">Fall Protection</SelectItem>
                        <SelectItem value="forklift">Forklift Operation</SelectItem>
                        <SelectItem value="hazwoper">HAZWOPER</SelectItem>
                        <SelectItem value="first-aid">First Aid/CPR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white">Certificate Type</Label>
                    <Select>
                      <SelectTrigger className="bg-blue-700/50 border-blue-600 text-white">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="certificate">Certificate (PDF)</SelectItem>
                        <SelectItem value="wallet-card">Digital Wallet Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Instructor</Label>
                    <Input 
                      className="bg-blue-700/50 border-blue-600 text-white"
                      placeholder="Sarah Johnson"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Training Hours</Label>
                    <Input 
                      type="number"
                      className="bg-blue-700/50 border-blue-600 text-white"
                      placeholder="8"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Issue Date</Label>
                    <Input 
                      type="date"
                      className="bg-blue-700/50 border-blue-600 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-white">Equipment Authorization (for wallet cards)</Label>
                  <Textarea 
                    className="bg-blue-700/50 border-blue-600 text-white"
                    placeholder="JLG 40 AJ, Genie Z62/40, CAT 315 FL"
                  />
                </div>
                <div>
                  <Label className="text-white">Additional Notes</Label>
                  <Textarea 
                    className="bg-blue-700/50 border-blue-600 text-white"
                    placeholder="Any special requirements or notes..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  <Award className="w-4 h-4 mr-2" />
                  Generate Certificate
                </Button>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview First
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
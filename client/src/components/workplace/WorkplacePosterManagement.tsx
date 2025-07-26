import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Download, 
  Eye, 
  Edit, 
  Plus, 
  Search,
  Filter,
  Calendar,
  MapPin,
  Building,
  CheckCircle,
  AlertTriangle,
  Clock,
  Database,
  Brain,
  TrendingUp,
  Shield,
  Settings,
  Upload
} from 'lucide-react';
import { SafetySyncIcon } from "@/components/ui/safetysync-icon";

interface WorkplacePoster {
  id: number;
  title: string;
  regulation: string;
  description: string;
  category: 'federal' | 'state' | 'local';
  industry: string[];
  required: boolean;
  language: string;
  lastUpdated: string;
  expirationDate?: string;
  downloadUrl: string;
  locations: string[];
  status: 'current' | 'expired' | 'updated';
  size: string;
  format: string;
}

interface PosterCompliance {
  id: number;
  location: string;
  requiredPosters: number;
  currentPosters: number;
  complianceScore: number;
  lastAudit: string;
  status: 'compliant' | 'non-compliant' | 'pending';
  missingPosters: string[];
}

const mockPosters: WorkplacePoster[] = [
  {
    id: 1,
    title: "OSHA Safety and Health Protection on the Job",
    regulation: "29 CFR 1903.2",
    description: "Federal workplace safety poster required in all workplaces",
    category: 'federal',
    industry: ['Construction', 'Manufacturing', 'General Industry'],
    required: true,
    language: 'English',
    lastUpdated: "2024-12-01",
    downloadUrl: "/posters/osha-safety-protection.pdf",
    locations: ['Main Office', 'Job Site A', 'Job Site B'],
    status: 'current',
    size: '8.5" x 11"',
    format: 'PDF'
  },
  {
    id: 2,
    title: "Equal Employment Opportunity",
    regulation: "29 CFR 1601.30",
    description: "EEOC poster detailing employment discrimination protections",
    category: 'federal',
    industry: ['All Industries'],
    required: true,
    language: 'English',
    lastUpdated: "2024-11-15",
    downloadUrl: "/posters/eeo-poster.pdf",
    locations: ['Main Office', 'HR Department'],
    status: 'current',
    size: '11" x 17"',
    format: 'PDF'
  },
  {
    id: 3,
    title: "Fair Labor Standards Act",
    regulation: "29 CFR 516.4",
    description: "Department of Labor wage and hour poster",
    category: 'federal',
    industry: ['All Industries'],
    required: true,
    language: 'English',
    lastUpdated: "2024-10-20",
    downloadUrl: "/posters/flsa-poster.pdf",
    locations: ['Main Office', 'Break Room'],
    status: 'current',
    size: '8.5" x 11"',
    format: 'PDF'
  },
  {
    id: 4,
    title: "State Workers' Compensation",
    regulation: "State Labor Code",
    description: "State-specific workers' compensation notice",
    category: 'state',
    industry: ['All Industries'],
    required: true,
    language: 'English',
    lastUpdated: "2024-09-30",
    expirationDate: "2025-09-30",
    downloadUrl: "/posters/state-workers-comp.pdf",
    locations: ['Main Office'],
    status: 'current',
    size: '8.5" x 11"',
    format: 'PDF'
  },
  {
    id: 5,
    title: "Family and Medical Leave Act",
    regulation: "29 CFR 825.300",
    description: "FMLA employee rights poster",
    category: 'federal',
    industry: ['All Industries'],
    required: true,
    language: 'English',
    lastUpdated: "2024-08-15",
    downloadUrl: "/posters/fmla-poster.pdf",
    locations: ['Main Office', 'HR Department'],
    status: 'updated',
    size: '8.5" x 11"',
    format: 'PDF'
  }
];

const mockCompliance: PosterCompliance[] = [
  {
    id: 1,
    location: 'Main Office',
    requiredPosters: 8,
    currentPosters: 7,
    complianceScore: 87.5,
    lastAudit: "2025-01-10",
    status: 'non-compliant',
    missingPosters: ['Unemployment Insurance Notice']
  },
  {
    id: 2,
    location: 'Job Site A',
    requiredPosters: 5,
    currentPosters: 5,
    complianceScore: 100,
    lastAudit: "2025-01-08",
    status: 'compliant',
    missingPosters: []
  },
  {
    id: 3,
    location: 'Job Site B',
    requiredPosters: 5,
    currentPosters: 4,
    complianceScore: 80,
    lastAudit: "2025-01-05",
    status: 'non-compliant',
    missingPosters: ['Emergency Contact Information']
  }
];

export default function WorkplacePosterManagement() {
  const [activeTab, setActiveTab] = useState("posters");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'expired': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'updated': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'compliant': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'non-compliant': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'federal': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'state': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'local': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredPosters = mockPosters.filter(poster => {
    const matchesSearch = poster.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         poster.regulation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || poster.category === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || poster.locations.includes(selectedLocation);
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const totalPosters = mockPosters.length;
  const requiredPosters = mockPosters.filter(p => p.required).length;
  const expiredPosters = mockPosters.filter(p => p.status === 'expired').length;
  const averageCompliance = mockCompliance.reduce((sum, comp) => sum + comp.complianceScore, 0) / mockCompliance.length;

  return (
    <div className="space-y-6 relative">
      {/* Tech grid background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 opacity-10 rounded-lg"></div>
      
      {/* Floating tech icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 animate-float">
          <FileText className="w-8 h-8 text-blue-400/30" />
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
            Workplace Poster Management
          </h2>
          <p className="text-gray-400">Track and manage mandatory workplace safety and compliance posters</p>
          <p className="text-blue-300 text-sm mt-1">
            📋 OSHA & DOL compliant posters • {averageCompliance.toFixed(1)}% location compliance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Poster
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            <Upload className="w-4 h-4 mr-2" />
            Upload Custom
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
        <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Posters</p>
                <p className="text-2xl font-bold text-white">{totalPosters}</p>
                <p className="text-blue-400 text-sm">🤖 AI-Tracked</p>
              </div>
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Required Posters</p>
                <p className="text-2xl font-bold text-white">{requiredPosters}</p>
                <p className="text-green-400 text-sm">Mandatory</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Expired/Updated</p>
                <p className="text-2xl font-bold text-white">{expiredPosters}</p>
                <p className="text-yellow-400 text-sm">Needs Attention</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Compliance</p>
                <p className="text-2xl font-bold text-white">{averageCompliance.toFixed(1)}%</p>
                <p className="text-purple-400 text-sm">All Locations</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4 relative z-10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search posters by title or regulation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="federal">Federal</SelectItem>
              <SelectItem value="state">State</SelectItem>
              <SelectItem value="local">Local</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="Main Office">Main Office</SelectItem>
              <SelectItem value="Job Site A">Job Site A</SelectItem>
              <SelectItem value="Job Site B">Job Site B</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="relative z-10">
        <TabsList className="grid w-full grid-cols-3 bg-black/20 backdrop-blur-sm border-gray-800">
          <TabsTrigger 
            value="posters" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200"
          >
            <FileText className="h-4 w-4" />
            Posters
          </TabsTrigger>
          <TabsTrigger 
            value="compliance" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200"
          >
            <CheckCircle className="h-4 w-4" />
            Compliance
          </TabsTrigger>
          <TabsTrigger 
            value="locations" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-200"
          >
            <MapPin className="h-4 w-4" />
            Locations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posters" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPosters.map((poster) => (
              <Card key={poster.id} className="bg-black/20 backdrop-blur-sm border-gray-800">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white">{poster.title}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {poster.regulation} • {poster.size}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(poster.status)}>
                        {poster.status}
                      </Badge>
                      <Badge className={getCategoryColor(poster.category)}>
                        {poster.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 text-sm">{poster.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300 text-sm">Updated: {poster.lastUpdated}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-300 text-sm">{poster.locations.length} locations</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm font-medium">Industries:</p>
                    <div className="flex flex-wrap gap-1">
                      {poster.industry.map((ind, index) => (
                        <Badge key={index} variant="outline" className="text-xs text-emerald-300 border-emerald-500/30">
                          {ind}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm font-medium">Posted At:</p>
                    <div className="flex flex-wrap gap-1">
                      {poster.locations.map((loc, index) => (
                        <Badge key={index} variant="outline" className="text-xs text-blue-300 border-blue-500/30">
                          {loc}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockCompliance.map((comp) => (
              <Card key={comp.id} className="bg-black/20 backdrop-blur-sm border-gray-800">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white">{comp.location}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {comp.currentPosters} of {comp.requiredPosters} posters displayed
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(comp.status)}>
                      {comp.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Compliance Score</span>
                      <span className="text-white font-bold">{comp.complianceScore}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${comp.complianceScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300 text-sm">Last Audit: {comp.lastAudit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300 text-sm">{comp.currentPosters} Current</span>
                    </div>
                  </div>

                  {comp.missingPosters.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-gray-400 text-sm font-medium">Missing Posters:</p>
                      <div className="flex flex-wrap gap-1">
                        {comp.missingPosters.map((missing, index) => (
                          <Badge key={index} className="bg-red-500/20 text-red-400 border-red-500/30">
                            {missing}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                      <Eye className="w-3 h-3 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                      <Settings className="w-3 h-3 mr-1" />
                      Audit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="locations" className="space-y-6">
          <Card className="bg-black/20 backdrop-blur-sm border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Location Management</CardTitle>
              <CardDescription className="text-gray-400">
                Manage poster requirements and compliance by location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCompliance.map((comp) => (
                  <div key={comp.id} className="border border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-white font-medium">{comp.location}</h4>
                        <p className="text-gray-400 text-sm">
                          {comp.currentPosters} of {comp.requiredPosters} posters displayed
                        </p>
                      </div>
                      <Badge className={getStatusColor(comp.status)}>
                        {comp.complianceScore}% compliant
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">{comp.requiredPosters}</p>
                        <p className="text-gray-400 text-sm">Required</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-400">{comp.currentPosters}</p>
                        <p className="text-gray-400 text-sm">Current</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-400">{comp.missingPosters.length}</p>
                        <p className="text-gray-400 text-sm">Missing</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
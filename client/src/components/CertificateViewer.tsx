import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, CreditCard, Eye, Search, Filter, Calendar, User, Shield, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Certificate {
  id: number;
  employeeName: string;
  employeeId?: string;
  certificationType: string;
  issueDate: string;
  expirationDate: string;
  instructorName: string;
  instructorCredentials: string;
  trainingStandards: string[];
  certificateNumber: string;
  certificateContent?: string;
  walletCardContent?: string;
  status: 'active' | 'expired' | 'revoked';
  createdAt: string;
}

export default function CertificateViewer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const { data: certificates, isLoading, error } = useQuery<{certificates: Certificate[]}>({
    queryKey: ['/api/ai/certificates'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const certificateList = certificates?.certificates || [];

  // Filter certificates based on search and filters
  const filteredCertificates = certificateList.filter(cert => {
    const matchesSearch = !searchTerm || 
      cert.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.certificationType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || cert.status === statusFilter;
    
    const matchesType = typeFilter === 'all' || cert.certificationType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const certificateTypes = [...new Set(certificateList.map(cert => cert.certificationType))];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'revoked': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isExpiringSoon = (expirationDate: string) => {
    const expDate = new Date(expirationDate);
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return expDate < thirtyDaysFromNow && expDate > new Date();
  };

  const handleDownloadCertificate = (certificate: Certificate) => {
    if (certificate.certificateContent) {
      window.open(certificate.certificateContent, '_blank');
    } else {
      toast({
        title: "Download Unavailable",
        description: "Certificate file not found. Please regenerate the certificate.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadWalletCard = (certificate: Certificate) => {
    if (certificate.walletCardContent) {
      window.open(certificate.walletCardContent, '_blank');
    } else {
      toast({
        title: "Download Unavailable", 
        description: "Wallet card not found. Please generate wallet card.",
        variant: "destructive"
      });
    }
  };

  const handleViewCertificate = (certificate: Certificate) => {
    if (certificate.certificateContent) {
      window.open(certificate.certificateContent, '_blank');
    } else {
      toast({
        title: "Certificate Not Available",
        description: "Certificate file not found.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-emerald-500" />
          <h2 className="text-2xl font-bold">Certificate Management</h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          <span className="ml-2">Loading certificates...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-emerald-500" />
          <h2 className="text-2xl font-bold">Certificate Management</h2>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-red-600">Error loading certificates. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-emerald-500" />
          <h2 className="text-2xl font-bold">Certificate Management</h2>
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            {certificateList.length} Total Certificates
          </Badge>
        </div>
        
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline"
          size="sm"
        >
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-xl font-bold">{certificateList.filter(c => c.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Expiring Soon</p>
                <p className="text-xl font-bold">{certificateList.filter(c => isExpiringSoon(c.expirationDate)).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Expired</p>
                <p className="text-xl font-bold">{certificateList.filter(c => c.status === 'expired' || new Date(c.expirationDate) < new Date()).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Employees</p>
                <p className="text-xl font-bold">{new Set(certificateList.map(c => c.employeeName)).size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by employee name, certificate type, or certificate number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="revoked">Revoked</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Certificate Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {certificateTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Certificates List */}
      {filteredCertificates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Certificates Found</h3>
            <p className="text-gray-600">
              {certificateList.length === 0 
                ? "No certificates have been generated yet. Use the AI Document Processor to generate certificates from training sign-in sheets."
                : "No certificates match your current filters. Try adjusting your search criteria."
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCertificates.map((certificate) => (
            <Card key={certificate.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{certificate.employeeName}</CardTitle>
                    <p className="text-sm text-gray-600">{certificate.certificationType}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getStatusColor(certificate.status)}>
                      {certificate.status}
                    </Badge>
                    {isExpiringSoon(certificate.expirationDate) && (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Expiring Soon
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Certificate Number</p>
                    <p className="font-mono text-xs">{certificate.certificateNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Employee ID</p>
                    <p className="font-medium">{certificate.employeeId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Issue Date</p>
                    <p className="font-medium">{new Date(certificate.issueDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Expiration Date</p>
                    <p className="font-medium">{new Date(certificate.expirationDate).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-gray-600 text-sm">Instructor</p>
                  <p className="font-medium">{certificate.instructorName}</p>
                  <p className="text-xs text-gray-500">{certificate.instructorCredentials}</p>
                </div>
                
                {certificate.trainingStandards.length > 0 && (
                  <div>
                    <p className="text-gray-600 text-sm">OSHA Standards</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {certificate.trainingStandards.map((standard, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {standard}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleViewCertificate(certificate)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleDownloadCertificate(certificate)}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Certificate
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleDownloadWalletCard(certificate)}
                  >
                    <CreditCard className="h-3 w-3 mr-1" />
                    Wallet Card
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
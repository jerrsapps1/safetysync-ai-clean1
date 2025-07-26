import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  User, ShieldCheck, QrCode, Plus, Upload, Download, Edit3, Trash2, Copy, 
  Eye, Calendar, Building, MapPin, Phone, Mail, Badge as BadgeIcon,
  Clock, AlertTriangle, CheckCircle, ExternalLink, FileText, CreditCard
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface Employee {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
  department?: string;
  division?: string;
  location?: string;
  hireDate?: string;
  status: string;
  profileImage?: string;
}

interface EmployeeCertificate {
  id: number;
  certificateName: string;
  certificationType: string;
  issueDate: string;
  expirationDate?: string;
  issuingOrganization?: string;
  instructorName?: string;
  instructorCredentials?: string;
  trainingStandards?: string[];
  certificateNumber?: string;
  certificateFilePath?: string;
  walletCardFilePath?: string;
  uploadedFromExternal: boolean;
  notes?: string;
  status: 'active' | 'expired' | 'revoked';
  createdAt: string;
  updatedAt: string;
}

interface EmployeeProfileProps {
  employeeId: number;
  onClose?: () => void;
}

export default function EmployeeProfile({ employeeId, onClose }: EmployeeProfileProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddCertificateOpen, setIsAddCertificateOpen] = useState(false);
  const [isQrCodeOpen, setIsQrCodeOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<EmployeeCertificate | null>(null);
  const queryClient = useQueryClient();

  // Fetch employee data
  const { data: employee, isLoading: loadingEmployee } = useQuery<Employee>({
    queryKey: ['/api/employees', employeeId],
  });

  // Fetch employee certificates
  const { data: certificates, isLoading: loadingCertificates } = useQuery<EmployeeCertificate[]>({
    queryKey: ['/api/employees', employeeId, 'certificates'],
  });

  // Fetch employee QR code
  const { data: qrCode } = useQuery({
    queryKey: ['/api/employees', employeeId, 'qr-code'],
  });

  const certificateList = certificates || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'expired': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'revoked': return 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200';
      default: return 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200';
    }
  };

  const isExpiringSoon = (expirationDate?: string) => {
    if (!expirationDate) return false;
    const expDate = new Date(expirationDate);
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return expDate < thirtyDaysFromNow && expDate > new Date();
  };

  const isExpired = (expirationDate?: string) => {
    if (!expirationDate) return false;
    return new Date(expirationDate) < new Date();
  };

  const handleDownloadCertificate = (cert: EmployeeCertificate) => {
    if (cert.certificateFilePath) {
      window.open(cert.certificateFilePath, '_blank');
    } else {
      toast({
        title: "Download Unavailable",
        description: "Certificate file not found.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadWalletCard = (cert: EmployeeCertificate) => {
    if (cert.walletCardFilePath) {
      window.open(cert.walletCardFilePath, '_blank');
    } else {
      toast({
        title: "Download Unavailable",
        description: "Wallet card not found.",
        variant: "destructive"
      });
    }
  };

  const handleGenerateQrCode = async () => {
    try {
      const response = await apiRequest(`/api/employees/${employeeId}/generate-qr-code`, {
        method: 'POST'
      });

      if (response.success) {
        toast({
          title: "QR Code Generated",
          description: "Employee QR code created successfully."
        });
        queryClient.invalidateQueries({ queryKey: ['/api/employees', employeeId, 'qr-code'] });
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate QR code.",
        variant: "destructive"
      });
    }
  };

  if (loadingEmployee) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        <span className="ml-2">Loading employee profile...</span>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Employee not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{employee.firstName} {employee.lastName}</h1>
            <p className="text-blue-500 dark:text-blue-300">{employee.position} • {employee.department}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Dialog open={isQrCodeOpen} onOpenChange={setIsQrCodeOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <QrCode className="h-4 w-4 mr-2" />
                QR Code
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Employee QR Code</DialogTitle>
              </DialogHeader>
              <div className="text-center py-6">
                {qrCode ? (
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg inline-block">
                      <img 
                        src={qrCode.qrCodeImagePath} 
                        alt="Employee QR Code" 
                        className="w-48 h-48"
                      />
                    </div>
                    <p className="text-sm text-blue-500">
                      Safety personnel can scan this code to view all certificates
                    </p>
                    <Button onClick={() => window.open(qrCode.qrCodeImagePath, '_blank')}>
                      <Download className="h-4 w-4 mr-2" />
                      Download QR Code
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <QrCode className="h-24 w-24 text-blue-300 mx-auto" />
                    <p className="text-blue-500">No QR code generated yet</p>
                    <Button onClick={handleGenerateQrCode}>
                      Generate QR Code
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-blue-500">Active Certificates</p>
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
                <p className="text-sm text-blue-500">Expiring Soon</p>
                <p className="text-xl font-bold">{certificateList.filter(c => isExpiringSoon(c.expirationDate)).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm text-blue-500">Expired</p>
                <p className="text-xl font-bold">{certificateList.filter(c => isExpired(c.expirationDate)).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ExternalLink className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-blue-500">External Certs</p>
                <p className="text-xl font-bold">{certificateList.filter(c => c.uploadedFromExternal).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="certificates">
            Certificates ({certificateList.length})
          </TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Employee Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Employee Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-blue-500">Employee ID</p>
                    <p className="font-medium">{employee.employeeId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-500">Status</p>
                    <Badge className={getStatusColor(employee.status)}>
                      {employee.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-blue-500">Department</p>
                    <p className="font-medium">{employee.department || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-500">Position</p>
                    <p className="font-medium">{employee.position || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-500">Location</p>
                    <p className="font-medium">{employee.location || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-500">Hire Date</p>
                    <p className="font-medium">
                      {employee.hireDate 
                        ? new Date(employee.hireDate).toLocaleDateString() 
                        : 'N/A'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-blue-300" />
                      <span className="text-sm">{employee.email}</span>
                    </div>
                    {employee.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-blue-300" />
                        <span className="text-sm">{employee.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Certificates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShieldCheck className="h-5 w-5" />
                  <span>Recent Certificates</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {certificateList.length === 0 ? (
                  <p className="text-blue-500 text-center py-6">No certificates on file</p>
                ) : (
                  <div className="space-y-3">
                    {certificateList.slice(0, 5).map((cert) => (
                      <div key={cert.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{cert.certificateName}</p>
                          <p className="text-xs text-blue-400">
                            Expires: {cert.expirationDate 
                              ? new Date(cert.expirationDate).toLocaleDateString() 
                              : 'No expiration'
                            }
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(cert.status)}>
                            {cert.status}
                          </Badge>
                          {isExpiringSoon(cert.expirationDate) && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              Expiring Soon
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    {certificateList.length > 5 && (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setActiveTab('certificates')}
                      >
                        View All {certificateList.length} Certificates
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Certificates Tab */}
        <TabsContent value="certificates" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Employee Certificates</h3>
            <Button onClick={() => setIsAddCertificateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Certificate
            </Button>
          </div>

          {loadingCertificates ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
              <span className="ml-2">Loading certificates...</span>
            </div>
          ) : certificateList.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <ShieldCheck className="h-12 w-12 text-blue-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-blue-800 mb-2">No Certificates</h3>
                <p className="text-blue-500 mb-4">
                  This employee doesn't have any certificates on file yet.
                </p>
                <Button onClick={() => setIsAddCertificateOpen(true)}>
                  Add First Certificate
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {certificateList.map((cert) => (
                <Card key={cert.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{cert.certificateName}</CardTitle>
                        <p className="text-sm text-blue-500">{cert.certificationType}</p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className={getStatusColor(cert.status)}>
                          {cert.status}
                        </Badge>
                        {isExpiringSoon(cert.expirationDate) && (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            Expiring Soon
                          </Badge>
                        )}
                        {cert.uploadedFromExternal && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            External
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-blue-500">Issue Date</p>
                        <p className="font-medium">{new Date(cert.issueDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-blue-500">Expiration</p>
                        <p className="font-medium">
                          {cert.expirationDate 
                            ? new Date(cert.expirationDate).toLocaleDateString() 
                            : 'No expiration'
                          }
                        </p>
                      </div>
                      {cert.certificateNumber && (
                        <div className="col-span-2">
                          <p className="text-blue-500">Certificate Number</p>
                          <p className="font-mono text-xs">{cert.certificateNumber}</p>
                        </div>
                      )}
                    </div>
                    
                    {cert.instructorName && (
                      <div>
                        <p className="text-blue-500 text-sm">Instructor</p>
                        <p className="font-medium text-sm">{cert.instructorName}</p>
                        {cert.instructorCredentials && (
                          <p className="text-xs text-blue-400">{cert.instructorCredentials}</p>
                        )}
                      </div>
                    )}
                    
                    {cert.issuingOrganization && (
                      <div>
                        <p className="text-blue-500 text-sm">Issuing Organization</p>
                        <p className="font-medium text-sm">{cert.issuingOrganization}</p>
                      </div>
                    )}
                    
                    {cert.trainingStandards && cert.trainingStandards.length > 0 && (
                      <div>
                        <p className="text-blue-500 text-sm">Training Standards</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {cert.trainingStandards.map((standard, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {standard}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {cert.notes && (
                      <div>
                        <p className="text-blue-500 text-sm">Notes</p>
                        <p className="text-sm">{cert.notes}</p>
                      </div>
                    )}
                    
                    <div className="flex space-x-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setSelectedCertificate(cert)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleDownloadCertificate(cert)}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Certificate
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleDownloadWalletCard(cert)}
                      >
                        <CreditCard className="h-3 w-3 mr-1" />
                        Card
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-500">Compliance analysis will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Certificate Dialog */}
      <Dialog open={isAddCertificateOpen} onOpenChange={setIsAddCertificateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Certificate</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-blue-500">
              Certificate upload functionality will be implemented here.
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddCertificateOpen(false)}>
                Cancel
              </Button>
              <Button>Add Certificate</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Certificate Detail Dialog */}
      <Dialog open={!!selectedCertificate} onOpenChange={() => setSelectedCertificate(null)}>
        <DialogContent className="max-w-3xl">
          {selectedCertificate && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedCertificate.certificateName}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-blue-500">
                  Detailed certificate view will be implemented here.
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
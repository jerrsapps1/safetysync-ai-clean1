import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheck, Calendar, Building, MapPin, User, BadgeIcon, 
  Clock, CheckCircle, AlertTriangle, Scan, Download, FileText
} from 'lucide-react';
import { useParams } from 'wouter';

interface PublicEmployee {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  position?: string;
  department?: string;
  location?: string;
}

interface PublicCertificate {
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
  status: 'active' | 'expired' | 'revoked';
}

interface PublicCertificateData {
  success: boolean;
  employee: PublicEmployee;
  certificates: PublicCertificate[];
  accessedAt: string;
  totalAccesses: number;
}

export default function PublicEmployeeCertificates() {
  const { qrCodeData } = useParams<{ qrCodeData: string }>();

  const { data, isLoading, error } = useQuery<PublicCertificateData>({
    queryKey: ['/api/public/employee-certs', qrCodeData],
    enabled: !!qrCodeData,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'revoked': return 'bg-blue-100 text-blue-700';
      default: return 'bg-blue-100 text-blue-700';
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-blue-500">Loading employee certificates...</p>
        </div>
      </div>
    );
  }

  if (error || !data || !data.success) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <Scan className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-blue-800 mb-2">Invalid QR Code</h2>
            <p className="text-blue-500 mb-6">
              This QR code is invalid or has expired. Please contact the employee for an updated code.
            </p>
            <Button onClick={() => window.location.href = '/'}>
              Return to SafetySync.AI
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { employee, certificates } = data;
  const activeCerts = certificates.filter(c => c.status === 'active');
  const expiringSoon = certificates.filter(c => isExpiringSoon(c.expirationDate));
  const expired = certificates.filter(c => isExpired(c.expirationDate));

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <ShieldCheck className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-blue-800">
                {employee.firstName} {employee.lastName}
              </h1>
              <div className="flex items-center space-x-4 text-blue-500 mt-1">
                {employee.position && (
                  <div className="flex items-center space-x-1">
                    <BadgeIcon className="h-4 w-4" />
                    <span>{employee.position}</span>
                  </div>
                )}
                {employee.department && (
                  <div className="flex items-center space-x-1">
                    <Building className="h-4 w-4" />
                    <span>{employee.department}</span>
                  </div>
                )}
                {employee.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{employee.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-blue-400">
            <p>Employee ID: {employee.employeeId}</p>
            <p>Verified at: {new Date(data.accessedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-blue-500">Active Certificates</p>
                  <p className="text-2xl font-bold text-blue-800">{activeCerts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-sm text-blue-500">Expiring Soon</p>
                  <p className="text-2xl font-bold text-blue-800">{expiringSoon.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-sm text-blue-500">Expired</p>
                  <p className="text-2xl font-bold text-blue-800">{expired.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-blue-500">Total Certificates</p>
                  <p className="text-2xl font-bold text-blue-800">{certificates.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Certificates List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-blue-800">Training Certificates</h2>
            <div className="text-sm text-blue-400">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>

          {certificates.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <ShieldCheck className="h-16 w-16 text-blue-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-blue-800 mb-2">No Certificates</h3>
                <p className="text-blue-500">
                  This employee doesn't have any training certificates on file.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {certificates.map((cert) => (
                <Card key={cert.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl text-blue-800 mb-1">
                          {cert.certificateName}
                        </CardTitle>
                        <p className="text-blue-500">{cert.certificationType}</p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className={getStatusColor(cert.status)}>
                          {cert.status.toUpperCase()}
                        </Badge>
                        {isExpiringSoon(cert.expirationDate) && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            EXPIRING SOON
                          </Badge>
                        )}
                        {isExpired(cert.expirationDate) && (
                          <Badge className="bg-red-100 text-red-800">
                            EXPIRED
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-medium text-blue-800 mb-3">Certificate Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-blue-300" />
                            <span className="text-blue-500">Issue Date:</span>
                            <span className="font-medium">
                              {new Date(cert.issueDate).toLocaleDateString()}
                            </span>
                          </div>
                          {cert.expirationDate && (
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-blue-300" />
                              <span className="text-blue-500">Expires:</span>
                              <span className="font-medium">
                                {new Date(cert.expirationDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          {cert.certificateNumber && (
                            <div className="flex items-center space-x-2">
                              <BadgeIcon className="h-4 w-4 text-blue-300" />
                              <span className="text-blue-500">Cert #:</span>
                              <span className="font-mono text-xs font-medium">
                                {cert.certificateNumber}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {cert.instructorName && (
                        <div>
                          <h4 className="font-medium text-blue-800 mb-3">Instructor Information</h4>
                          <div className="space-y-1 text-sm">
                            <p className="font-medium">{cert.instructorName}</p>
                            {cert.instructorCredentials && (
                              <p className="text-blue-500">{cert.instructorCredentials}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {(cert.issuingOrganization || (cert.trainingStandards && cert.trainingStandards.length > 0)) && (
                        <div>
                          <h4 className="font-medium text-blue-800 mb-3">Additional Information</h4>
                          <div className="space-y-2 text-sm">
                            {cert.issuingOrganization && (
                              <div>
                                <span className="text-blue-500">Issuing Organization:</span>
                                <p className="font-medium">{cert.issuingOrganization}</p>
                              </div>
                            )}
                            {cert.trainingStandards && cert.trainingStandards.length > 0 && (
                              <div>
                                <span className="text-blue-500">Standards:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {cert.trainingStandards.map((standard, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {standard}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t">
          <div className="text-sm text-blue-400 space-y-1">
            <p>Certificate verification powered by SafetySync.AI</p>
            <p>This information was accessed {data.totalAccesses} times</p>
            <p className="text-xs">
              For questions about these certificates, contact the employee's HR department.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Upload, 
  FileText, 
  Brain, 
  CheckCircle, 
  AlertCircle, 
  Download,
  CreditCard,
  Users,
  Calendar,
  MapPin,
  Clock,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface ProcessedSignIn {
  trainingTitle: string;
  instructorName: string;
  instructorCredentials: string;
  trainingDate: string;
  location: string;
  duration: string;
  trainingStandards: string[];
  employees: Array<{
    name: string;
    employeeId?: string;
    signature: boolean;
    completionStatus: 'completed' | 'partial' | 'absent';
  }>;
  certificationEligible: boolean;
  evaluationRequired: boolean;
}

export default function AIDocumentProcessor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedData, setProcessedData] = useState<ProcessedSignIn | null>(null);
  const [documentId, setDocumentId] = useState<number | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [editedData, setEditedData] = useState<ProcessedSignIn | null>(null);
  const [instructorNotes, setInstructorNotes] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: processedDocuments } = useQuery({
    queryKey: ['/api/ai/processed-documents'],
    enabled: true
  });

  const { data: certificates } = useQuery({
    queryKey: ['/api/ai/certificates'],
    enabled: true
  });

  const processMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('signInDocument', file);
      
      const response = await fetch('/api/ai/process-signin', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to process document');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setProcessedData(data.extractedData);
      setEditedData(data.extractedData);
      setDocumentId(data.processedDocument.id);
      queryClient.invalidateQueries({ queryKey: ['/api/ai/processed-documents'] });
      toast({
        title: "Document Processed",
        description: "AI has extracted the training information. Please verify before generating certificates.",
      });
    },
    onError: (error) => {
      toast({
        title: "Processing Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const verifyMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/ai/verify-and-generate`, {
        method: 'POST',
        body: JSON.stringify({
          documentId,
          verifiedData: editedData,
          instructorNotes
        })
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai/certificates'] });
      toast({
        title: "Certificates Generated",
        description: `Successfully generated ${data.certificatesGenerated} certificates`,
      });
      // Reset form
      setSelectedFile(null);
      setProcessedData(null);
      setEditedData(null);
      setDocumentId(null);
      setInstructorNotes('');
    },
    onError: (error) => {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const processDocument = () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a sign-in document to process",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    processMutation.mutate(selectedFile);
  };

  const verifyAndGenerate = () => {
    if (!editedData || !documentId) {
      toast({
        title: "No Data to Verify",
        description: "Please process a document first",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    verifyMutation.mutate();
  };

  const updateEmployeeStatus = (index: number, field: string, value: any) => {
    if (!editedData) return;
    
    const updatedData = { ...editedData };
    updatedData.employees[index] = { ...updatedData.employees[index], [field]: value };
    setEditedData(updatedData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Brain className="h-6 w-6 text-blue-500" />
        <h2 className="text-2xl font-bold">AI Document Processor</h2>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Revolutionary AI Technology
        </Badge>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload Training Sign-In Document</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
              className="hidden"
            />
            
            {selectedFile ? (
              <div className="space-y-2">
                <FileText className="h-12 w-12 text-green-500 mx-auto" />
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                <p className="text-gray-600">
                  Upload instructor sign-in sheets, training rosters, or attendance documents
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF, Images, Word documents
                </p>
              </div>
            )}
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="mt-4"
            >
              {selectedFile ? 'Change File' : 'Select File'}
            </Button>
          </div>

          <Button
            onClick={processDocument}
            disabled={!selectedFile || processMutation.isPending}
            className="w-full"
          >
            {processMutation.isPending ? (
              <>
                <Brain className="h-4 w-4 mr-2 animate-spin" />
                AI Processing Document...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Process with AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* AI Processing Results */}
      {processedData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>AI Extracted Information</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Please Verify
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Training Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Training Title</Label>
                <Input
                  value={editedData?.trainingTitle || ''}
                  onChange={(e) => setEditedData(prev => prev ? { ...prev, trainingTitle: e.target.value } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label>Instructor Name</Label>
                <Input
                  value={editedData?.instructorName || ''}
                  onChange={(e) => setEditedData(prev => prev ? { ...prev, instructorName: e.target.value } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label>Instructor Credentials</Label>
                <Input
                  value={editedData?.instructorCredentials || ''}
                  onChange={(e) => setEditedData(prev => prev ? { ...prev, instructorCredentials: e.target.value } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label>Training Date</Label>
                <Input
                  type="date"
                  value={editedData?.trainingDate || ''}
                  onChange={(e) => setEditedData(prev => prev ? { ...prev, trainingDate: e.target.value } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={editedData?.location || ''}
                  onChange={(e) => setEditedData(prev => prev ? { ...prev, location: e.target.value } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input
                  value={editedData?.duration || ''}
                  onChange={(e) => setEditedData(prev => prev ? { ...prev, duration: e.target.value } : null)}
                />
              </div>
            </div>

            {/* Training Standards */}
            <div className="space-y-2">
              <Label>Training Standards</Label>
              <div className="flex flex-wrap gap-2">
                {editedData?.trainingStandards.map((standard, index) => (
                  <Badge key={index} variant="secondary">
                    <Shield className="h-3 w-3 mr-1" />
                    {standard}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Employee List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg">Employee Attendance ({editedData?.employees.length})</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={editedData?.certificationEligible}
                      onCheckedChange={(checked) => 
                        setEditedData(prev => prev ? { ...prev, certificationEligible: checked as boolean } : null)
                      }
                    />
                    <span className="text-sm">Certification Eligible</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={editedData?.evaluationRequired}
                      onCheckedChange={(checked) => 
                        setEditedData(prev => prev ? { ...prev, evaluationRequired: checked as boolean } : null)
                      }
                    />
                    <span className="text-sm">Evaluation Required</span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 grid grid-cols-5 gap-4 font-medium text-sm">
                  <span>Employee Name</span>
                  <span>Employee ID</span>
                  <span>Signature</span>
                  <span>Status</span>
                  <span>Certificate</span>
                </div>
                
                {editedData?.employees.map((employee, index) => (
                  <div key={index} className="px-4 py-3 grid grid-cols-5 gap-4 border-t items-center">
                    <Input
                      value={employee.name}
                      onChange={(e) => updateEmployeeStatus(index, 'name', e.target.value)}
                      className="h-8"
                    />
                    <Input
                      value={employee.employeeId || ''}
                      onChange={(e) => updateEmployeeStatus(index, 'employeeId', e.target.value)}
                      placeholder="Optional"
                      className="h-8"
                    />
                    <Checkbox
                      checked={employee.signature}
                      onCheckedChange={(checked) => updateEmployeeStatus(index, 'signature', checked)}
                    />
                    <select
                      value={employee.completionStatus}
                      onChange={(e) => updateEmployeeStatus(index, 'completionStatus', e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="completed">Completed</option>
                      <option value="partial">Partial</option>
                      <option value="absent">Absent</option>
                    </select>
                    <div className="text-center">
                      {employee.signature && employee.completionStatus === 'completed' && editedData.certificationEligible ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CreditCard className="h-3 w-3 mr-1" />
                          Will Generate
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-gray-500">
                          No Certificate
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor Notes */}
            <div className="space-y-2">
              <Label>Instructor Notes (Optional)</Label>
              <Textarea
                value={instructorNotes}
                onChange={(e) => setInstructorNotes(e.target.value)}
                placeholder="Add any notes about the training session or corrections to the AI extraction..."
                className="min-h-[80px]"
              />
            </div>

            {/* Verify and Generate Button */}
            <Button
              onClick={verifyAndGenerate}
              disabled={verifyMutation.isPending}
              className="w-full"
              size="lg"
            >
              {verifyMutation.isPending ? (
                <>
                  <Brain className="h-4 w-4 mr-2 animate-spin" />
                  Generating Certificates...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verify & Generate Certificates
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent Processed Documents */}
      {processedDocuments?.documents && processedDocuments.documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Processed Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {processedDocuments.documents.slice(0, 5).map((doc: any) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{doc.originalFileName}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(doc.processingDate).toLocaleDateString()}
                      </span>
                      <Badge 
                        variant={doc.verificationStatus === 'verified' ? 'default' : 'secondary'}
                      >
                        {doc.verificationStatus}
                      </Badge>
                      <span>{doc.certificatesGenerated} certificates generated</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Certificates */}
      {certificates?.certificates && certificates.certificates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.certificates.slice(0, 6).map((cert: any) => (
                <div key={cert.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{cert.employeeName}</h4>
                    <Badge variant="outline">{cert.status}</Badge>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="flex items-center">
                      <Shield className="h-3 w-3 mr-1" />
                      {cert.certificationType}
                    </p>
                    <p className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Issued: {new Date(cert.issueDate).toLocaleDateString()}
                    </p>
                    <p className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Expires: {new Date(cert.expirationDate).toLocaleDateString()}
                    </p>
                    <p className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {cert.instructorName}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <CreditCard className="h-3 w-3 mr-1" />
                      Wallet Card
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
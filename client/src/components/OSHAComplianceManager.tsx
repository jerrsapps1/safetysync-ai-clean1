import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Calendar, Users, FileText, Shield, Clock, Download, Eye } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// OSHA Standards and Training Requirements
// Construction Industry OSHA Standards (Asbestos, Lead, Mold, Demolition focus)
const OSHA_STANDARDS = [
  {
    standard: "29 CFR 1926.1101",
    title: "Asbestos Worker Training",
    frequency: "Initial (32 hrs) + Annual (8 hrs)",
    duration: "32 hours initial, 8 hours refresher",
    competencyRequired: true,
    recordRetention: "EPA requires 3 years",
    trainerQuals: "EPA-accredited trainer",
    appliesTo: "Asbestos abatement crews"
  },
  {
    standard: "29 CFR 1926.62",
    title: "Lead in Construction",
    frequency: "Initial + retraining if exposure changes",
    duration: "Variable based on exposure level",
    competencyRequired: true,
    recordRetention: "40 years",
    trainerQuals: "Competent person",
    appliesTo: "Lead abatement + demo crews"
  },
  {
    standard: "EPA 40 CFR 745",
    title: "Lead Renovator (RRP Rule)",
    frequency: "Initial (8 hrs) + Refresher (every 5 yrs)",
    duration: "8 hours initial, 4 hours refresher",
    competencyRequired: true,
    recordRetention: "3 years",
    trainerQuals: "EPA-certified training provider",
    appliesTo: "Lead renovators"
  },
  {
    standard: "29 CFR 1926 Subpart T",
    title: "Demolition Safety",
    frequency: "Initial + new site/process",
    duration: "8 hours + site-specific",
    competencyRequired: true,
    recordRetention: "3 years",
    trainerQuals: "Competent person",
    appliesTo: "Demo workers"
  },
  {
    standard: "29 CFR 1910.134",
    title: "Respiratory Protection",
    frequency: "Initial + annual + fit testing",
    duration: "4 hours + medical eval",
    competencyRequired: true,
    recordRetention: "Medical records 30 years",
    trainerQuals: "Medical provider + qualified trainer",
    appliesTo: "All who wear respirators (critical for asbestos/lead/mold)"
  },
  {
    standard: "29 CFR 1926.1153",
    title: "Silica Awareness",
    frequency: "Initial + task change",
    duration: "4 hours",
    competencyRequired: true,
    recordRetention: "30 years",
    trainerQuals: "Competent person",
    appliesTo: "Demo & abatement workers"
  },
  {
    standard: "29 CFR 1926.500",
    title: "Fall Protection",
    frequency: "Initial + new hazard",
    duration: "8 hours",
    competencyRequired: true,
    recordRetention: "3 years",
    trainerQuals: "Fall protection competent person",
    appliesTo: "Demo and elevated work"
  },
  {
    standard: "29 CFR 1910.1200",
    title: "Hazard Communication (GHS)",
    frequency: "Initial + chemical updates",
    duration: "4 hours",
    competencyRequired: true,
    recordRetention: "30 years",
    trainerQuals: "Safety manager or trainer",
    appliesTo: "All workers handling chemicals"
  },
  {
    standard: "29 CFR 1926.95",
    title: "Personal Protective Equipment",
    frequency: "Initial + equipment change",
    duration: "4 hours + demonstration",
    competencyRequired: true,
    recordRetention: "3 years",
    trainerQuals: "Safety officer",
    appliesTo: "All workers"
  },
  {
    standard: "AIHA Guidelines",
    title: "Mold Awareness & Remediation",
    frequency: "Initial + task change",
    duration: "8 hours",
    competencyRequired: true,
    recordRetention: "3 years",
    trainerQuals: "Qualified Industrial Hygienist",
    appliesTo: "Mold remediation crews"
  }
];

interface TrainingMatrix {
  id: string;
  jobTitle: string;
  department: string;
  requiredTraining: string[];
  frequency: { [standard: string]: string };
  responsibleParty: string;
  hazardExposure: string[];
}

interface TrainingRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  trainerName: string;
  trainerQualifications: string;
  trainingTopic: string;
  oshaStandard: string;
  trainingDate: string;
  trainingMethod: string;
  assessmentResults: string;
  employeeSignature: boolean;
  proofOfUnderstanding: string;
  nextRetrainingDue: string;
  status: "current" | "expired" | "upcoming";
}

interface ComplianceGap {
  id: string;
  type: "missing_training" | "expired_certificate" | "missing_documentation" | "inadequate_trainer";
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  affectedEmployees: string[];
  oshaStandard: string;
  dueDate: string;
  correctionSteps: string[];
}

export default function OSHAComplianceManager() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("matrix");
  const [trainingMatrix, setTrainingMatrix] = useState<TrainingMatrix[]>([]);
  const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>([]);
  const [complianceGaps, setComplianceGaps] = useState<ComplianceGap[]>([]);
  const [selectedStandard, setSelectedStandard] = useState<string>("");

  // Initialize sample data
  useEffect(() => {
    const sampleMatrix: TrainingMatrix[] = [
      {
        id: "1",
        jobTitle: "Asbestos Abatement Worker",
        department: "Abatement Division",
        requiredTraining: ["29 CFR 1926.1101", "29 CFR 1910.134", "29 CFR 1910.1200", "29 CFR 1926.95"],
        frequency: {
          "29 CFR 1926.1101": "Initial (32 hrs) + Annual (8 hrs)",
          "29 CFR 1910.134": "annual + fit testing",
          "29 CFR 1910.1200": "initial + updates",
          "29 CFR 1926.95": "initial + equipment change"
        },
        responsibleParty: "EPA-Accredited Supervisor",
        hazardExposure: ["Asbestos fibers", "Respiratory hazards", "Chemical exposure", "Fall hazards"]
      },
      {
        id: "2", 
        jobTitle: "Lead Abatement Specialist",
        department: "Abatement Division",
        requiredTraining: ["29 CFR 1926.62", "EPA 40 CFR 745", "29 CFR 1910.134", "29 CFR 1926.95"],
        frequency: {
          "29 CFR 1926.62": "initial + exposure changes",
          "EPA 40 CFR 745": "Initial (8 hrs) + Refresher (every 5 yrs)",
          "29 CFR 1910.134": "annual + fit testing",
          "29 CFR 1926.95": "initial + equipment change"
        },
        responsibleParty: "Competent Person - Lead",
        hazardExposure: ["Lead exposure", "Respiratory hazards", "Chemical exposure", "Fall hazards"]
      },
      {
        id: "3",
        jobTitle: "Mold Remediation Technician", 
        department: "Abatement Division",
        requiredTraining: ["AIHA Guidelines", "29 CFR 1910.134", "29 CFR 1910.1200", "29 CFR 1926.95"],
        frequency: {
          "AIHA Guidelines": "initial + task change",
          "29 CFR 1910.134": "annual + fit testing", 
          "29 CFR 1910.1200": "initial + updates",
          "29 CFR 1926.95": "initial + equipment change"
        },
        responsibleParty: "Qualified Industrial Hygienist",
        hazardExposure: ["Mold spores", "Respiratory hazards", "Chemical exposure", "Moisture hazards"]
      },
      {
        id: "4",
        jobTitle: "Demolition Worker",
        department: "Demolition Division", 
        requiredTraining: ["29 CFR 1926 Subpart T", "29 CFR 1926.500", "29 CFR 1926.1153", "29 CFR 1910.1200"],
        frequency: {
          "29 CFR 1926 Subpart T": "initial + new site/process",
          "29 CFR 1926.500": "initial + new hazard",
          "29 CFR 1926.1153": "initial + task change",
          "29 CFR 1910.1200": "initial + updates"
        },
        responsibleParty: "Demolition Competent Person",
        hazardExposure: ["Structural collapse", "Fall hazards", "Silica exposure", "Chemical exposure", "Heavy equipment"]
      }
    ];

    const sampleRecords: TrainingRecord[] = [
      {
        id: "1",
        employeeName: "Michael Thompson",
        employeeId: "ASB001",
        trainerName: "Sarah Johnson",
        trainerQualifications: "EPA-Accredited Asbestos Instructor, CIH",
        trainingTopic: "Asbestos Worker Training",
        oshaStandard: "29 CFR 1926.1101",
        trainingDate: "2024-11-15",
        trainingMethod: "EPA-Approved Course + Hands-on",
        assessmentResults: "Pass - 94% + Practical Demo",
        employeeSignature: true,
        proofOfUnderstanding: "Written exam + Air monitoring exercise + PPE donning/doffing",
        nextRetrainingDue: "2025-11-15",
        status: "current"
      },
      {
        id: "2",
        employeeName: "Jennifer Davis",
        employeeId: "LEAD002",
        trainerName: "Mark Rodriguez",
        trainerQualifications: "EPA RRP Certified Instructor",
        trainingTopic: "Lead Renovator Training",
        oshaStandard: "EPA 40 CFR 745",
        trainingDate: "2020-03-10",
        trainingMethod: "EPA-Approved Course + Hands-on",
        assessmentResults: "Pass - 89%",
        employeeSignature: true,
        proofOfUnderstanding: "Written test + Work practice standards demonstration",
        nextRetrainingDue: "2025-03-10",
        status: "expired"
      },
      {
        id: "3",
        employeeName: "Carlos Martinez",
        employeeId: "DEMO003",
        trainerName: "Lisa Chen",
        trainerQualifications: "Demolition Competent Person, CSP",
        trainingTopic: "Demolition Safety",
        oshaStandard: "29 CFR 1926 Subpart T",
        trainingDate: "2024-09-20",
        trainingMethod: "Classroom + Site-Specific Training",
        assessmentResults: "Pass - 91%",
        employeeSignature: true,
        proofOfUnderstanding: "Hazard assessment + Sequence planning exercise",
        nextRetrainingDue: "New project assignment",
        status: "current"
      },
      {
        id: "4",
        employeeName: "Amanda Wilson",
        employeeId: "MOLD004", 
        trainerName: "Dr. Robert Kim",
        trainerQualifications: "Certified Industrial Hygienist, AIHA Member",
        trainingTopic: "Mold Remediation Training",
        oshaStandard: "AIHA Guidelines",
        trainingDate: "2024-10-05",
        trainingMethod: "Classroom + Field Assessment",
        assessmentResults: "Pass - 96%",
        employeeSignature: true,
        proofOfUnderstanding: "Moisture assessment + Containment setup demonstration",
        nextRetrainingDue: "Task assignment change",
        status: "current"
      }
    ];

    const sampleGaps: ComplianceGap[] = [
      {
        id: "1",
        type: "expired_certificate",
        severity: "critical",
        description: "EPA Lead RRP certification expired - Work must stop immediately",
        affectedEmployees: ["Jennifer Davis", "Robert Johnson", "Kevin Brown"],
        oshaStandard: "EPA 40 CFR 745",
        dueDate: "IMMEDIATE - Work stoppage required",
        correctionSteps: [
          "STOP all lead-disturbing work immediately",
          "Contact EPA-approved training provider",
          "Schedule 4-hour refresher course within 30 days",
          "Document work stoppage in project records",
          "Update EPA certification database"
        ]
      },
      {
        id: "2",
        type: "missing_training",
        severity: "high", 
        description: "New demolition workers missing required Subpart T training",
        affectedEmployees: ["James Miller", "Susan Taylor"],
        oshaStandard: "29 CFR 1926 Subpart T",
        dueDate: "2025-01-28",
        correctionSteps: [
          "Remove workers from demolition assignments",
          "Schedule 8-hour demolition safety training",
          "Conduct site-specific hazard briefing",
          "Document competency demonstration",
          "Update training matrix"
        ]
      },
      {
        id: "3",
        type: "inadequate_trainer",
        severity: "high",
        description: "Mold training conducted by unqualified instructor",
        affectedEmployees: ["All mold division workers trained in Q4 2024"],
        oshaStandard: "AIHA Guidelines",
        dueDate: "2025-02-15",
        correctionSteps: [
          "Verify all Q4 2024 mold training records",
          "Contact certified Industrial Hygienist for retraining",
          "Schedule makeup training sessions", 
          "Document trainer qualifications",
          "Update approved trainer list"
        ]
      },
      {
        id: "4",
        type: "missing_documentation", 
        severity: "medium",
        description: "Fit testing records incomplete for 5 respirator users",
        affectedEmployees: ["Maria Santos", "Tony Lee", "David Park", "Anna Chen", "Mike Rodriguez"],
        oshaStandard: "29 CFR 1910.134",
        dueDate: "2025-02-01",
        correctionSteps: [
          "Schedule quantitative fit testing",
          "Verify medical clearance status",
          "Update respirator assignment records",
          "Document make/model/size assignments",
          "File in individual employee records"
        ]
      }
    ];

    setTrainingMatrix(sampleMatrix);
    setTrainingRecords(sampleRecords);
    setComplianceGaps(sampleGaps);
  }, []);

  const generateAuditReport = () => {
    toast({
      title: "Audit Report Generated",
      description: "Comprehensive OSHA compliance audit report has been prepared for inspector review",
      duration: 3000
    });
  };

  const exportComplianceData = (format: 'pdf' | 'excel') => {
    toast({
      title: `Export to ${format.toUpperCase()}`,
      description: `All compliance documentation exported to ${format.toUpperCase()} format`,
      duration: 3000
    });
  };

  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">OSHA Compliance Manager</h1>
          <p className="text-gray-400 mt-2">
            Inspection-ready compliance documentation and training management
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={generateAuditReport} className="bg-blue-600 hover:bg-blue-700">
            <FileText className="w-4 h-4 mr-2" />
            Generate Audit Report
          </Button>
          <Button onClick={() => exportComplianceData('pdf')} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button onClick={() => exportComplianceData('excel')} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="matrix">Training Matrix</TabsTrigger>
          <TabsTrigger value="records">Training Records</TabsTrigger>
          <TabsTrigger value="gaps">Compliance Gaps</TabsTrigger>
          <TabsTrigger value="retraining">Retraining</TabsTrigger>
          <TabsTrigger value="competency">Competency</TabsTrigger>
          <TabsTrigger value="audit">Audit Ready</TabsTrigger>
        </TabsList>

        <TabsContent value="matrix" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Shield className="w-5 h-5" />
                Training Matrix by Job Title
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainingMatrix.map((matrix) => (
                  <div key={matrix.id} className="border border-gray-600 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{matrix.jobTitle}</h3>
                        <p className="text-gray-400">Department: {matrix.department}</p>
                        <p className="text-gray-400">Responsible Party: {matrix.responsibleParty}</p>
                      </div>
                      <Badge variant="outline">{matrix.requiredTraining.length} Standards</Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-white mb-2">Required Training Standards:</h4>
                        <div className="space-y-2">
                          {matrix.requiredTraining.map((standard) => {
                            const standardInfo = OSHA_STANDARDS.find(s => s.standard === standard);
                            return (
                              <div key={standard} className="text-sm">
                                <div className="text-blue-400">{standard}</div>
                                <div className="text-gray-300">{standardInfo?.title}</div>
                                <div className="text-gray-500">
                                  Frequency: {matrix.frequency[standard]} | Duration: {standardInfo?.duration}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-white mb-2">Hazard Exposure:</h4>
                        <div className="flex flex-wrap gap-2">
                          {matrix.hazardExposure.map((hazard) => (
                            <Badge key={hazard} variant="secondary">{hazard}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <FileText className="w-5 h-5" />
                Complete Training Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainingRecords.map((record) => (
                  <div key={record.id} className="border border-gray-600 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{record.employeeName}</h3>
                        <p className="text-gray-400">Employee ID: {record.employeeId}</p>
                      </div>
                      <Badge 
                        variant={record.status === 'current' ? 'default' : 
                                record.status === 'expired' ? 'destructive' : 'secondary'}
                      >
                        {record.status}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium text-white mb-2">Training Details:</h4>
                        <div className="space-y-1 text-gray-300">
                          <div><strong>Topic:</strong> {record.trainingTopic}</div>
                          <div><strong>OSHA Standard:</strong> {record.oshaStandard}</div>
                          <div><strong>Date:</strong> {record.trainingDate}</div>
                          <div><strong>Method:</strong> {record.trainingMethod}</div>
                          <div><strong>Next Due:</strong> {record.nextRetrainingDue}</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-white mb-2">Trainer Information:</h4>
                        <div className="space-y-1 text-gray-300">
                          <div><strong>Trainer:</strong> {record.trainerName}</div>
                          <div><strong>Qualifications:</strong> {record.trainerQualifications}</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-white mb-2">Assessment & Proof:</h4>
                        <div className="space-y-1 text-gray-300">
                          <div><strong>Results:</strong> {record.assessmentResults}</div>
                          <div><strong>Signature:</strong> 
                            {record.employeeSignature ? 
                              <CheckCircle2 className="w-4 h-4 inline ml-1 text-green-500" /> : 
                              <AlertCircle className="w-4 h-4 inline ml-1 text-red-500" />
                            }
                          </div>
                          <div><strong>Proof:</strong> {record.proofOfUnderstanding}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gaps" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Compliance Gaps & Action Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceGaps.map((gap) => (
                  <div key={gap.id} className="border border-gray-600 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{gap.description}</h3>
                        <p className="text-gray-400">OSHA Standard: {gap.oshaStandard}</p>
                        <p className="text-gray-400">Due Date: {gap.dueDate}</p>
                      </div>
                      <Badge 
                        variant={gap.severity === 'critical' ? 'destructive' : 
                                gap.severity === 'high' ? 'destructive' :
                                gap.severity === 'medium' ? 'secondary' : 'default'}
                      >
                        {gap.severity}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-white mb-2">Affected Employees:</h4>
                        <div className="flex flex-wrap gap-2">
                          {gap.affectedEmployees.map((employee) => (
                            <Badge key={employee} variant="outline">{employee}</Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-white mb-2">Correction Steps:</h4>
                        <div className="space-y-1">
                          {gap.correctionSteps.map((step, index) => (
                            <div key={index} className="text-sm text-gray-300">
                              {index + 1}. {step}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Mark Resolved
                      </Button>
                      <Button size="sm" variant="outline">
                        Schedule Action
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retraining" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Clock className="w-5 h-5" />
                Retraining Requirements & Triggers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border border-gray-600 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Automatic Retraining Triggers</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-white mb-2">Time-Based Triggers:</h4>
                      <ul className="space-y-1 text-gray-300 text-sm">
                        <li>• Annual requirements (Respiratory Protection)</li>
                        <li>• Triennial requirements (Forklift Operation)</li>
                        <li>• Certificate expiration dates</li>
                        <li>• New hire onboarding</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-2">Event-Based Triggers:</h4>
                      <ul className="space-y-1 text-gray-300 text-sm">
                        <li>• Equipment or process changes</li>
                        <li>• Accident/near-miss investigations</li>
                        <li>• New chemical introductions</li>
                        <li>• Failed competency assessments</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-600 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Upcoming Retraining Schedule</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-yellow-900/30 rounded">
                      <div>
                        <div className="font-medium text-white">Respiratory Protection - Maria Garcia</div>
                        <div className="text-sm text-gray-400">Due: January 20, 2025 (Expired)</div>
                      </div>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        Schedule Immediately
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-blue-900/30 rounded">
                      <div>
                        <div className="font-medium text-white">Fall Protection - Construction Team</div>
                        <div className="text-sm text-gray-400">Due: March 15, 2025</div>
                      </div>
                      <Button size="sm" variant="outline">
                        Schedule Training
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competency" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Users className="w-5 h-5" />
                Employee Competency Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border border-gray-600 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Competency Assessment Methods</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-white mb-2">Written Tests:</h4>
                      <ul className="space-y-1 text-gray-300 text-sm">
                        <li>• Minimum 80% passing score</li>
                        <li>• Standard-specific questions</li>
                        <li>• Hazard identification</li>
                        <li>• Procedure knowledge</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-2">Practical Demonstrations:</h4>
                      <ul className="space-y-1 text-gray-300 text-sm">
                        <li>• Equipment operation</li>
                        <li>• Safety procedure execution</li>
                        <li>• Emergency response</li>
                        <li>• PPE usage</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-2">Observation Checklists:</h4>
                      <ul className="space-y-1 text-gray-300 text-sm">
                        <li>• Job performance evaluation</li>
                        <li>• Safety compliance</li>
                        <li>• Knowledge application</li>
                        <li>• Supervisor verification</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-600 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Employee Interview Preparation</h3>
                  <p className="text-gray-300 mb-3">
                    Inspector may interview employees to verify understanding. Ensure employees can answer:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-white mb-2">Training Knowledge:</h4>
                      <ul className="space-y-1 text-gray-300 text-sm">
                        <li>• What training they've received</li>
                        <li>• When training was completed</li>
                        <li>• Who provided the training</li>
                        <li>• Key safety procedures</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-2">Hazard Awareness:</h4>
                      <ul className="space-y-1 text-gray-300 text-sm">
                        <li>• Workplace hazards they face</li>
                        <li>• Control measures in place</li>
                        <li>• Emergency procedures</li>
                        <li>• Reporting requirements</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Audit Readiness Checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Documentation Checklist</h3>
                    {[
                      "Written Training Program",
                      "Training Matrix by Job Title",
                      "Complete Training Records",
                      "Trainer Qualifications",
                      "Assessment Results",
                      "Employee Signatures",
                      "Retraining Documentation",
                      "Competency Verification"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Compliance Status</h3>
                    {[
                      "All required standards identified",
                      "Training needs assessment complete",
                      "Qualified trainers verified",
                      "Current certificates on file",
                      "No expired training",
                      "Bilingual training provided",
                      "Customized to worksite",
                      "Internal audit completed"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-gray-600 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Inspector Access System</h3>
                  <p className="text-gray-300 mb-4">
                    All records organized and instantly accessible for inspector review:
                  </p>
                  <div className="flex gap-4 flex-wrap">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Eye className="w-4 h-4 mr-2" />
                      View All Records
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Generate Inspector Package
                    </Button>
                    <Button variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Print Documentation
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
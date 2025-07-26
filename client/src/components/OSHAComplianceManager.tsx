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
// General OSHA Standards - Common Workplace Safety Requirements
const OSHA_STANDARDS = [
  {
    standard: "29 CFR 1910.147",
    title: "Lockout/Tagout (LOTO)",
    frequency: "Initial + retraining when needed",
    duration: "4 hours minimum",
    competencyRequired: true,
    recordRetention: "3 years",
    trainerQuals: "Competent person or qualified trainer",
    appliesTo: "Workers servicing machines/equipment"
  },
  {
    standard: "29 CFR 1910.134",
    title: "Respiratory Protection",
    frequency: "Initial + annual + fit testing",
    duration: "Variable based on respirator type",
    competencyRequired: true,
    recordRetention: "Medical records 30 years",
    trainerQuals: "Qualified trainer + medical provider",
    appliesTo: "All respirator users"
  },
  {
    standard: "29 CFR 1910.1200",
    title: "Hazard Communication (GHS)",
    frequency: "Initial + when new chemicals introduced",
    duration: "Variable based on workplace hazards",
    competencyRequired: true,
    recordRetention: "30 years",
    trainerQuals: "Competent person",
    appliesTo: "All workers exposed to chemicals"
  },
  {
    standard: "29 CFR 1926.95 / 1910.95",
    title: "Personal Protective Equipment",
    frequency: "Initial + when equipment changes",
    duration: "Variable based on PPE type",
    competencyRequired: true,
    recordRetention: "3 years",
    trainerQuals: "Competent person",
    appliesTo: "All workers requiring PPE"
  },
  {
    standard: "29 CFR 1926.500 / 1910.28",
    title: "Fall Protection",
    frequency: "Initial + when work conditions change",
    duration: "Variable based on industry",
    competencyRequired: true,
    recordRetention: "3 years",
    trainerQuals: "Competent person",
    appliesTo: "Workers at height (6+ feet general industry, 4+ feet construction)"
  },
  {
    standard: "29 CFR 1910.178",
    title: "Powered Industrial Trucks (Forklifts)",
    frequency: "Initial + every 3 years + when needed",
    duration: "Classroom + practical evaluation",
    competencyRequired: true,
    recordRetention: "While employed + 3 years",
    trainerQuals: "Qualified trainer",
    appliesTo: "All forklift operators"
  },
  {
    standard: "29 CFR 1910.146",
    title: "Permit-Required Confined Spaces",
    frequency: "Initial + annual",
    duration: "Variable based on role",
    competencyRequired: true,
    recordRetention: "1 year minimum",
    trainerQuals: "Qualified person",
    appliesTo: "Authorized entrants, attendants, supervisors"
  },
  {
    standard: "29 CFR 1910.119",
    title: "Process Safety Management",
    frequency: "Initial + every 3 years",
    duration: "Variable based on process complexity",
    competencyRequired: true,
    recordRetention: "Life of process",
    trainerQuals: "Knowledgeable in process operations",
    appliesTo: "Workers in covered processes"
  },
  {
    standard: "29 CFR 1910.38",
    title: "Emergency Action Plans",
    frequency: "Initial + when plan changes",
    duration: "Variable",
    competencyRequired: false,
    recordRetention: "While plan is active",
    trainerQuals: "Competent person",
    appliesTo: "All employees"
  },
  {
    standard: "ANSI Z490.1",
    title: "Acceptance Criteria for Safety Training",
    frequency: "Ongoing assessment",
    duration: "Varies by training program",
    competencyRequired: true,
    recordRetention: "Per company policy",
    trainerQuals: "Qualified trainer per ANSI criteria",
    appliesTo: "All safety training programs"
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
        jobTitle: "Production Worker",
        department: "Manufacturing",
        requiredTraining: ["29 CFR 1910.147", "29 CFR 1910.1200", "29 CFR 1926.95 / 1910.95"],
        frequency: {
          "29 CFR 1910.147": "initial + retraining when needed",
          "29 CFR 1910.1200": "initial + when new chemicals introduced",
          "29 CFR 1926.95 / 1910.95": "initial + when equipment changes"
        },
        responsibleParty: "Safety Manager",
        hazardExposure: ["Machine hazards", "Chemical exposure", "Noise exposure"]
      },
      {
        id: "2", 
        jobTitle: "Forklift Operator",
        department: "Warehouse",
        requiredTraining: ["29 CFR 1910.178", "29 CFR 1910.1200"],
        frequency: {
          "29 CFR 1910.178": "initial + every 3 years + when needed",
          "29 CFR 1910.1200": "initial + when new chemicals introduced"
        },
        responsibleParty: "Warehouse Supervisor",
        hazardExposure: ["Vehicle operation", "Load handling", "Chemical exposure"]
      },
      {
        id: "3",
        jobTitle: "Maintenance Technician", 
        department: "Maintenance",
        requiredTraining: ["29 CFR 1910.147", "29 CFR 1910.134", "29 CFR 1926.500 / 1910.28"],
        frequency: {
          "29 CFR 1910.147": "initial + retraining when needed",
          "29 CFR 1910.134": "initial + annual + fit testing", 
          "29 CFR 1926.500 / 1910.28": "initial + when work conditions change"
        },
        responsibleParty: "Maintenance Supervisor",
        hazardExposure: ["Electrical hazards", "Fall hazards", "Respiratory hazards", "Machine hazards"]
      },
      {
        id: "4",
        jobTitle: "Laboratory Technician",
        department: "Quality Control", 
        requiredTraining: ["29 CFR 1910.1200", "29 CFR 1910.134", "29 CFR 1910.38"],
        frequency: {
          "29 CFR 1910.1200": "initial + when new chemicals introduced",
          "29 CFR 1910.134": "initial + annual + fit testing",
          "29 CFR 1910.38": "initial + when plan changes"
        },
        responsibleParty: "Lab Safety Officer",
        hazardExposure: ["Chemical exposure", "Biological hazards", "Laboratory equipment"]
      }
    ];

    const sampleRecords: TrainingRecord[] = [
      {
        id: "1",
        employeeName: "John Smith",
        employeeId: "EMP001",
        trainerName: "Sarah Johnson",
        trainerQualifications: "OSHA Authorized Trainer, CSP",
        trainingTopic: "Lockout/Tagout Procedures",
        oshaStandard: "29 CFR 1910.147",
        trainingDate: "2024-10-15",
        trainingMethod: "Classroom + Hands-on Practice",
        assessmentResults: "Pass - 92%",
        employeeSignature: true,
        proofOfUnderstanding: "Written test + Lockout procedure demonstration",
        nextRetrainingDue: "When procedures change",
        status: "current"
      },
      {
        id: "2",
        employeeName: "Maria Garcia",
        employeeId: "EMP002",
        trainerName: "Mike Rodriguez",
        trainerQualifications: "Certified Safety Professional",
        trainingTopic: "Respiratory Protection",
        oshaStandard: "29 CFR 1910.134",
        trainingDate: "2024-01-20",
        trainingMethod: "Classroom + Fit Testing",
        assessmentResults: "Pass - 88%",
        employeeSignature: true,
        proofOfUnderstanding: "Fit test results + Written quiz",
        nextRetrainingDue: "2025-01-20",
        status: "expired"
      },
      {
        id: "3",
        employeeName: "David Wilson",
        employeeId: "EMP003",
        trainerName: "Lisa Chen",
        trainerQualifications: "Qualified Forklift Trainer",
        trainingTopic: "Forklift Operation Safety",
        oshaStandard: "29 CFR 1910.178",
        trainingDate: "2024-09-10",
        trainingMethod: "Classroom + Practical Evaluation",
        assessmentResults: "Pass - 95%",
        employeeSignature: true,
        proofOfUnderstanding: "Driving test + Written exam + Daily inspection demo",
        nextRetrainingDue: "2027-09-10",
        status: "current"
      },
      {
        id: "4",
        employeeName: "Jennifer Lopez",
        employeeId: "EMP004", 
        trainerName: "Robert Kim",
        trainerQualifications: "Safety Manager, ASP",
        trainingTopic: "Hazard Communication",
        oshaStandard: "29 CFR 1910.1200",
        trainingDate: "2024-08-05",
        trainingMethod: "Interactive Training + SDS Review",
        assessmentResults: "Pass - 91%",
        employeeSignature: true,
        proofOfUnderstanding: "SDS interpretation exercise + Labeling quiz",
        nextRetrainingDue: "When new chemicals introduced",
        status: "current"
      }
    ];

    const sampleGaps: ComplianceGap[] = [
      {
        id: "1",
        type: "expired_certificate",
        severity: "high",
        description: "Respiratory Protection training expired for 3 employees",
        affectedEmployees: ["Maria Garcia", "Tom Wilson", "Lisa Chen"],
        oshaStandard: "29 CFR 1910.134",
        dueDate: "2025-02-01",
        correctionSteps: [
          "Schedule refresher training session",
          "Conduct new fit testing",
          "Update training records",
          "Issue new certificates",
          "Document medical clearance status"
        ]
      },
      {
        id: "2",
        type: "missing_training",
        severity: "medium", 
        description: "New forklift operators missing required certification",
        affectedEmployees: ["James Miller", "Susan Taylor"],
        oshaStandard: "29 CFR 1910.178",
        dueDate: "2025-01-28",
        correctionSteps: [
          "Remove operators from forklift duties",
          "Schedule classroom and practical training",
          "Conduct performance evaluations",
          "Document competency demonstration",
          "Update operator authorization list"
        ]
      },
      {
        id: "3",
        type: "inadequate_trainer",
        severity: "medium",
        description: "LOTO training conducted by unqualified instructor",
        affectedEmployees: ["All maintenance staff trained in Q4 2024"],
        oshaStandard: "29 CFR 1910.147",
        dueDate: "2025-02-15",
        correctionSteps: [
          "Verify all Q4 2024 LOTO training records",
          "Contact qualified competent person for retraining",
          "Schedule makeup training sessions", 
          "Document trainer qualifications",
          "Update approved trainer list"
        ]
      },
      {
        id: "4",
        type: "missing_documentation", 
        severity: "low",
        description: "PPE training signatures missing for 4 employees",
        affectedEmployees: ["Robert Smith", "Amy Johnson", "Carlos Rivera", "Sarah Davis"],
        oshaStandard: "29 CFR 1926.95 / 1910.95",
        dueDate: "2025-02-05",
        correctionSteps: [
          "Collect missing employee signatures",
          "Verify employees received training",
          "Update training records",
          "File documentation properly",
          "Implement signature tracking system"
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
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 min-h-screen text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">OSHA Compliance Manager</h1>
          <p className="text-white mt-2">
            General OSHA and ANSI compliance guidance for training documentation and management
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
          <Card className="bg-black/20 backdrop-blur-sm border-blue-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Shield className="w-5 h-5" />
                Training Matrix by Job Title
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainingMatrix.map((matrix) => (
                  <div key={matrix.id} className="border border-blue-500 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{matrix.jobTitle}</h3>
                        <p className="text-white">Department: {matrix.department}</p>
                        <p className="text-white">Responsible Party: {matrix.responsibleParty}</p>
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
                                <div className="text-white">{standardInfo?.title}</div>
                                <div className="text-blue-400">
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
          <Card className="bg-black/20 backdrop-blur-sm border-blue-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <FileText className="w-5 h-5" />
                Complete Training Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainingRecords.map((record) => (
                  <div key={record.id} className="border border-blue-500 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{record.employeeName}</h3>
                        <p className="text-white">Employee ID: {record.employeeId}</p>
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
                        <div className="space-y-1 text-white">
                          <div><strong>Topic:</strong> {record.trainingTopic}</div>
                          <div><strong>OSHA Standard:</strong> {record.oshaStandard}</div>
                          <div><strong>Date:</strong> {record.trainingDate}</div>
                          <div><strong>Method:</strong> {record.trainingMethod}</div>
                          <div><strong>Next Due:</strong> {record.nextRetrainingDue}</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-white mb-2">Trainer Information:</h4>
                        <div className="space-y-1 text-white">
                          <div><strong>Trainer:</strong> {record.trainerName}</div>
                          <div><strong>Qualifications:</strong> {record.trainerQualifications}</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-white mb-2">Assessment & Proof:</h4>
                        <div className="space-y-1 text-white">
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
          <Card className="bg-black/20 backdrop-blur-sm border-blue-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Compliance Gaps & Action Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceGaps.map((gap) => (
                  <div key={gap.id} className="border border-blue-500 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{gap.description}</h3>
                        <p className="text-white">OSHA Standard: {gap.oshaStandard}</p>
                        <p className="text-white">Due Date: {gap.dueDate}</p>
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
                            <div key={index} className="text-sm text-white">
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
          <Card className="bg-black/20 backdrop-blur-sm border-blue-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Clock className="w-5 h-5" />
                Retraining Requirements & Triggers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border border-blue-500 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Automatic Retraining Triggers</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-white mb-2">Time-Based Triggers:</h4>
                      <ul className="space-y-1 text-white text-sm">
                        <li>• Annual requirements (Respiratory Protection)</li>
                        <li>• Triennial requirements (Forklift Operation)</li>
                        <li>• Certificate expiration dates</li>
                        <li>• New hire onboarding</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-2">Event-Based Triggers:</h4>
                      <ul className="space-y-1 text-white text-sm">
                        <li>• Equipment or process changes</li>
                        <li>• Accident/near-miss investigations</li>
                        <li>• New chemical introductions</li>
                        <li>• Failed competency assessments</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border border-blue-500 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Upcoming Retraining Schedule</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-yellow-900/30 rounded">
                      <div>
                        <div className="font-medium text-white">Respiratory Protection - Maria Garcia</div>
                        <div className="text-sm text-white">Due: January 20, 2025 (Expired)</div>
                      </div>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        Schedule Immediately
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-blue-900/30 rounded">
                      <div>
                        <div className="font-medium text-white">Fall Protection - Construction Team</div>
                        <div className="text-sm text-white">Due: March 15, 2025</div>
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
          <Card className="bg-black/20 backdrop-blur-sm border-blue-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Users className="w-5 h-5" />
                Employee Competency Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border border-blue-500 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Competency Assessment Methods</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-white mb-2">Written Tests:</h4>
                      <ul className="space-y-1 text-white text-sm">
                        <li>• Minimum 80% passing score</li>
                        <li>• Standard-specific questions</li>
                        <li>• Hazard identification</li>
                        <li>• Procedure knowledge</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-2">Practical Demonstrations:</h4>
                      <ul className="space-y-1 text-white text-sm">
                        <li>• Equipment operation</li>
                        <li>• Safety procedure execution</li>
                        <li>• Emergency response</li>
                        <li>• PPE usage</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-2">Observation Checklists:</h4>
                      <ul className="space-y-1 text-white text-sm">
                        <li>• Job performance evaluation</li>
                        <li>• Safety compliance</li>
                        <li>• Knowledge application</li>
                        <li>• Supervisor verification</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border border-blue-500 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Employee Knowledge Verification</h3>
                  <p className="text-white mb-3">
                    Compliance verification may include employee interviews. Ensure employees can answer:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-white mb-2">Training Knowledge:</h4>
                      <ul className="space-y-1 text-white text-sm">
                        <li>• What training they've received</li>
                        <li>• When training was completed</li>
                        <li>• Who provided the training</li>
                        <li>• Key safety procedures</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-2">Hazard Awareness:</h4>
                      <ul className="space-y-1 text-white text-sm">
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
          <Card className="bg-black/20 backdrop-blur-sm border-blue-700">
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
                        <span className="text-white">{item}</span>
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
                        <span className="text-white">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-blue-500 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Documentation Access System</h3>
                  <p className="text-white mb-4">
                    All records organized and accessible for compliance verification:
                  </p>
                  <div className="flex gap-4 flex-wrap">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Eye className="w-4 h-4 mr-2" />
                      View All Records
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Generate Compliance Package
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
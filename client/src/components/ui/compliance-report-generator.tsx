import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Download, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  TrendingUp,
  BarChart3,
  PieChart,
  Loader2,
  Eye,
  Share2,
  Printer
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface ComplianceReportData {
  reportType: string;
  generatedAt: string;
  periodStart: string;
  periodEnd: string;
  complianceStats: {
    totalEmployees: number;
    compliantEmployees: number;
    pendingTraining: number;
    expiredCertifications: number;
    complianceScore: number;
  };
  employees: Array<{
    id: number;
    name: string;
    position: string;
    department: string;
    hireDate: string;
  }>;
  trainings: Array<{
    name: string;
    required: boolean;
    frequency: string;
  }>;
  complianceData: Array<{
    employeeId: number;
    employeeName: string;
    position: string;
    department: string;
    trainings: Array<{
      trainingName: string;
      status: 'completed' | 'pending' | 'expired';
      completedDate: string | null;
      expiryDate: string;
      certificateNumber: string | null;
      required: boolean;
    }>;
  }>;
  summary: {
    overallComplianceRate: string;
    criticalFindings: number;
    actionItems: string[];
    recommendations: string[];
  };
}

interface ComplianceReportGeneratorProps {
  onReportGenerated?: (report: any) => void;
}

export function ComplianceReportGenerator({ onReportGenerated }: ComplianceReportGeneratorProps) {
  const [reportType, setReportType] = useState<string>("");
  const [periodStart, setPeriodStart] = useState<Date>();
  const [periodEnd, setPeriodEnd] = useState<Date>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<ComplianceReportData | null>(null);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch existing reports
  const { data: existingReports = [] } = useQuery({
    queryKey: ['/api/compliance/reports', 1], // Using userId 1 for demo
    queryFn: async () => {
      const response = await fetch('/api/compliance/reports/1');
      return response.json();
    }
  });

  // Generate report mutation
  const generateReportMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('/api/compliance/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    },
    onSuccess: (data) => {
      setGeneratedReport(data.data);
      setShowReportDialog(true);
      toast({
        title: "Report Generated Successfully",
        description: "Your compliance report is ready to view.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/compliance/reports', 1] });
      onReportGenerated?.(data);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleGenerateReport = async () => {
    if (!reportType) {
      toast({
        title: "Error",
        description: "Please select a report type.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      await generateReportMutation.mutateAsync({
        reportType,
        periodStart: periodStart?.toISOString(),
        periodEnd: periodEnd?.toISOString(),
        userId: 1 // Demo user ID
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = (format: 'pdf' | 'csv' | 'excel') => {
    if (!generatedReport) return;
    
    // Create downloadable content
    const content = JSON.stringify(generatedReport, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance-report-${generatedReport.reportType}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: `Report downloaded as ${format.toUpperCase()} file.`,
    });
  };

  const reportTypes = [
    { value: "full", label: "Full Compliance Report", description: "Comprehensive report with all compliance data" },
    { value: "summary", label: "Executive Summary", description: "High-level overview for management" },
    { value: "audit", label: "Audit Report", description: "Detailed report for regulatory audits" },
    { value: "training", label: "Training Report", description: "Focus on training compliance and gaps" },
    { value: "department", label: "Department Report", description: "Compliance by department analysis" },
    { value: "risk", label: "Risk Assessment", description: "Identify high-risk areas and employees" }
  ];

  return (
    <div className="space-y-6">
      {/* Report Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            One-Click Compliance Report Generator
          </CardTitle>
          <CardDescription>
            Generate comprehensive OSHA compliance reports instantly with all necessary data and analytics.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Report Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Report Type</label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex flex-col">
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-blue-400">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Period Start</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !periodStart && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {periodStart ? format(periodStart, "PPP") : "Select start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={periodStart}
                    onSelect={setPeriodStart}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Period End</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !periodEnd && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {periodEnd ? format(periodEnd, "PPP") : "Select end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={periodEnd}
                    onSelect={setPeriodEnd}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Generate Button */}
          <Button 
            onClick={handleGenerateReport}
            disabled={isGenerating || !reportType}
            size="lg"
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Reports
          </CardTitle>
          <CardDescription>
            View and download previously generated compliance reports.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {existingReports.length === 0 ? (
            <div className="text-center py-8 text-blue-400">
              <FileText className="w-12 h-12 mx-auto mb-4 text-white" />
              <p>No reports generated yet.</p>
              <p className="text-sm">Generate your first compliance report above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {existingReports.map((report: any) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-blue-500" />
                    <div>
                      <div className="font-medium">{report.reportName}</div>
                      <div className="text-sm text-blue-400">
                        Generated on {new Date(report.generatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {report.reportType}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Preview Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Compliance Report Preview
            </DialogTitle>
            <DialogDescription>
              {generatedReport && `${generatedReport.reportType.toUpperCase()} Report - Generated on ${new Date(generatedReport.generatedAt).toLocaleDateString()}`}
            </DialogDescription>
          </DialogHeader>
          
          {generatedReport && (
            <div className="space-y-6">
              {/* Report Actions */}
              <div className="flex flex-wrap gap-2 p-4 bg-blue-50 rounded-lg">
                <Button onClick={() => downloadReport('pdf')} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
                <Button onClick={() => downloadReport('csv')} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  CSV
                </Button>
                <Button onClick={() => downloadReport('excel')} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Excel
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="recommendations">Actions</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-500" />
                          <div className="text-2xl font-bold">{generatedReport.complianceStats.totalEmployees}</div>
                        </div>
                        <div className="text-sm text-blue-400">Total Employees</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <div className="text-2xl font-bold">{generatedReport.complianceStats.compliantEmployees}</div>
                        </div>
                        <div className="text-sm text-blue-400">Compliant</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-yellow-500" />
                          <div className="text-2xl font-bold">{generatedReport.complianceStats.pendingTraining}</div>
                        </div>
                        <div className="text-sm text-blue-400">Pending</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <div className="text-2xl font-bold">{generatedReport.complianceStats.expiredCertifications}</div>
                        </div>
                        <div className="text-sm text-blue-400">Expired</div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Overall Compliance Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Compliance Rate</span>
                          <span className="font-bold">{generatedReport.summary.overallComplianceRate}</span>
                        </div>
                        <Progress value={generatedReport.complianceStats.complianceScore} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Employee Compliance Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {generatedReport.complianceData.map((employee) => (
                          <div key={employee.employeeId} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">{employee.employeeName}</div>
                                <div className="text-sm text-blue-400">{employee.position} - {employee.department}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm">
                                  {employee.trainings.filter(t => t.status === 'completed').length} / {employee.trainings.length} Complete
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4" />
                          Training Completion Rate
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {generatedReport.trainings.map((training) => {
                            const completedCount = generatedReport.complianceData.flatMap(emp => emp.trainings).filter(t => t.trainingName === training.name && t.status === 'completed').length;
                            const totalCount = generatedReport.complianceData.length;
                            const percentage = Math.round((completedCount / totalCount) * 100);
                            
                            return (
                              <div key={training.name} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span>{training.name}</span>
                                  <span>{percentage}%</span>
                                </div>
                                <Progress value={percentage} className="h-2" />
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <PieChart className="w-4 h-4" />
                          Department Breakdown
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {Array.from(new Set(generatedReport.employees.map(e => e.department))).map(dept => {
                            const deptEmployees = generatedReport.employees.filter(e => e.department === dept);
                            const count = deptEmployees.length;
                            const percentage = Math.round((count / generatedReport.employees.length) * 100);
                            
                            return (
                              <div key={dept} className="flex justify-between items-center">
                                <span className="text-sm">{dept}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{count}</span>
                                  <span className="text-xs text-blue-400">({percentage}%)</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Action Items
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {generatedReport.summary.actionItems.map((item, index) => (
                          <div key={index} className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg">
                            <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {generatedReport.summary.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                            <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5" />
                            <span className="text-sm">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
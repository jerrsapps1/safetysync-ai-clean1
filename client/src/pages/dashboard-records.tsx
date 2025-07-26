import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Brain, FileText, Download, RefreshCw } from "lucide-react";

interface TrainingRecord {
  id: string;
  employee_name?: string;
  course?: string;
  completed_date?: string;
  certificate_id?: string;
  processingDate?: string;
  [key: string]: any;
}

// TypeScript React equivalent of your Python Flask dashboard.html template
export default function DashboardRecordsPage() {
  const [records, setRecords] = useState<TrainingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch training records (equivalent to your Python dashboard route)
  const fetchRecords = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔍 FRONTEND: Fetching dashboard data...');
      const response = await fetch('/api/dashboard');
      const data = await response.json();

      console.log('📊 FRONTEND: Dashboard response:', { 
        success: data.success, 
        recordCount: data.records?.length,
        sampleRecord: data.records?.[0] 
      });

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch records');
      }

      setRecords(data.records || []);
      console.log(`📊 DASHBOARD: Loaded ${data.records?.length || 0} training records`);

    } catch (err: any) {
      console.error('❌ DASHBOARD ERROR:', err);
      setError(err.message);
      toast({
        title: "Failed to Load Records",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load records on component mount
  useEffect(() => {
    fetchRecords();
  }, []);

  // Export records as CSV
  const exportRecords = () => {
    const csvContent = [
      ['ID', 'Employee Name', 'Course', 'Date', 'Cert #'].join(','),
      ...records.map(record => [
        record.id,
        record.employee_name || '—',
        record.course || '—',
        record.completed_date || '—',
        record.certificate_id || '—'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'training-records.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `Exported ${records.length} training records to CSV`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 p-4">
      <div className="max-w-7xl mx-auto pt-20">
        
        {/* Header - matches your Python template styling */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
            <Brain className="w-8 h-8 mr-3" />
            Extracted Training Records
          </h1>
          <p className="text-xl text-gray-300">
            AI-processed training documentation and certification data
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-white border-gray-400">
              {records.length} Records
            </Badge>
            {error && (
              <Badge variant="destructive">
                Error Loading Data
              </Badge>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={fetchRecords}
              disabled={isLoading}
              variant="outline"
              className="border-gray-400 text-gray-300 hover:bg-gray-700"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button
              onClick={exportRecords}
              disabled={records.length === 0}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Records Table - equivalent to your Python template table */}
        <Card className="bg-black/20 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Training Records Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-6 h-6 animate-spin text-emerald-400 mr-2" />
                <span className="text-white">Loading training records...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-400 mb-4">Failed to load records</div>
                <Button onClick={fetchRecords} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : records.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                No training records found. Upload some documents to get started.
              </div>
            ) : (
              
              // Table structure matching your Python template exactly
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-600">
                      <TableHead className="text-gray-300 font-bold">ID</TableHead>
                      <TableHead className="text-gray-300 font-bold">Employee Name</TableHead>
                      <TableHead className="text-gray-300 font-bold">Course</TableHead>
                      <TableHead className="text-gray-300 font-bold">Date</TableHead>
                      <TableHead className="text-gray-300 font-bold">Cert #</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((record) => (
                      <TableRow key={record.id} className="border-gray-700 hover:bg-gray-800/50">
                        <TableCell className="text-white font-mono text-sm">
                          {record.id}
                        </TableCell>
                        <TableCell className="text-white">
                          {record.employee_name || record.employeeName || 
                           (record.employees && record.employees[0]?.name) || '—'}
                        </TableCell>
                        <TableCell className="text-white">
                          {record.course || record.trainingTitle || '—'}
                        </TableCell>
                        <TableCell className="text-white">
                          {record.completed_date || record.trainingDate || 
                           (record.processingDate ? new Date(record.processingDate).toLocaleDateString() : '—')}
                        </TableCell>
                        <TableCell className="text-white">
                          {record.certificate_id || record.certificateNumber || 
                           (record.employees && record.employees[0]?.employeeId) || '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

          </CardContent>
        </Card>

        {/* Python Equivalent Note */}
        <Card className="mt-8 bg-gray-900/50 border-gray-700/50">
          <CardContent className="p-4">
            <div className="flex items-center text-yellow-400 mb-2">
              <Brain className="w-4 h-4 mr-2" />
              <span className="font-semibold">Python Flask Template Equivalent</span>
            </div>
            <p className="text-gray-300 text-sm">
              This TypeScript React component provides the same functionality as your Python Flask 
              <code className="bg-gray-800 px-1 rounded mx-1">dashboard.html</code> template
              with modern UI components, real-time data loading, and CSV export capabilities.
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Shield, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye,
  Clock,
  Globe,
  TrendingUp,
  Download,
  RefreshCw,
  Plus,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CloneDetectionResult {
  url: string;
  similarityScore: number;
  analysis: {
    contentSimilarity: number;
    structureSimilarity: number;
    designSimilarity: number;
    brandingSimilarity: number;
  };
  suspiciousElements: string[];
  recommendation: 'low_risk' | 'medium_risk' | 'high_risk' | 'potential_clone';
  aiAnalysis: string;
  timestamp: string;
}

interface DetectionScan {
  id: number;
  scanType: string;
  targetUrls: string[];
  results: CloneDetectionResult[];
  status: string;
  totalSites: number;
  clonesDetected: number;
  highRiskSites: number;
  createdAt: string;
  completedAt?: string;
}

interface AICloneDetectorProps {
  onScanComplete?: (results: CloneDetectionResult[]) => void;
}

export function AICloneDetector({ onScanComplete }: AICloneDetectorProps) {
  const [urls, setUrls] = useState<string[]>(['']);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentScan, setCurrentScan] = useState<string>('');
  const [results, setResults] = useState<CloneDetectionResult[]>([]);
  const [scanHistory, setScanHistory] = useState<DetectionScan[]>([]);
  const [selectedResult, setSelectedResult] = useState<CloneDetectionResult | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchScanHistory();
  }, []);

  const fetchScanHistory = async () => {
    try {
      const response = await fetch('/api/clone-detection/scans');
      if (response.ok) {
        const scans = await response.json();
        setScanHistory(scans);
      }
    } catch (error) {
      console.error('Error fetching scan history:', error);
    }
  };

  const addUrlField = () => {
    setUrls([...urls, '']);
  };

  const removeUrlField = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const startScan = async () => {
    const validUrls = urls.filter(url => url.trim() !== '');
    
    if (validUrls.length === 0) {
      toast({
        title: "No URLs provided",
        description: "Please enter at least one URL to scan.",
        variant: "destructive"
      });
      return;
    }

    setScanning(true);
    setProgress(0);
    setResults([]);
    setCurrentScan('');

    try {
      // Start the scan
      const response = await fetch('/api/clone-detection/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: validUrls, scanType: 'manual' })
      });

      if (!response.ok) {
        throw new Error('Failed to start scan');
      }

      const { scanId } = await response.json();
      
      // Poll for progress
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch(`/api/clone-detection/scan/${scanId}/status`);
          if (statusResponse.ok) {
            const status = await statusResponse.json();
            setProgress(status.progress);
            setCurrentScan(status.currentUrl || '');
            
            if (status.status === 'completed') {
              clearInterval(pollInterval);
              setScanning(false);
              setResults(status.results);
              fetchScanHistory();
              onScanComplete?.(status.results);
              
              toast({
                title: "Scan completed",
                description: `Analyzed ${validUrls.length} websites. ${status.clonesDetected} potential clones detected.`,
              });
            } else if (status.status === 'failed') {
              clearInterval(pollInterval);
              setScanning(false);
              throw new Error(status.error || 'Scan failed');
            }
          }
        } catch (error) {
          clearInterval(pollInterval);
          setScanning(false);
          throw error;
        }
      }, 2000);

    } catch (error) {
      setScanning(false);
      toast({
        title: "Scan failed",
        description: error instanceof Error ? error.message : "An error occurred during scanning.",
        variant: "destructive"
      });
    }
  };

  const getRiskColor = (recommendation: string) => {
    switch (recommendation) {
      case 'potential_clone': return 'bg-red-500';
      case 'high_risk': return 'bg-orange-500';
      case 'medium_risk': return 'bg-yellow-500';
      case 'low_risk': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskLabel = (recommendation: string) => {
    switch (recommendation) {
      case 'potential_clone': return 'Potential Clone';
      case 'high_risk': return 'High Risk';
      case 'medium_risk': return 'Medium Risk';
      case 'low_risk': return 'Low Risk';
      default: return 'Unknown';
    }
  };

  const exportResults = () => {
    const csvContent = [
      ['URL', 'Similarity Score', 'Risk Level', 'Suspicious Elements', 'Timestamp'],
      ...results.map(result => [
        result.url,
        `${(result.similarityScore * 100).toFixed(1)}%`,
        getRiskLabel(result.recommendation),
        result.suspiciousElements.join('; '),
        new Date(result.timestamp).toLocaleString()
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clone-detection-results-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" />
            AI Clone Detector
          </h2>
          <p className="text-gray-600 mt-2">
            Protect your website with AI-powered clone detection and monitoring
          </p>
        </div>
        {results.length > 0 && (
          <Button onClick={exportResults} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Results
          </Button>
        )}
      </div>

      <Tabs defaultValue="scan" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scan">New Scan</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="history">Scan History</TabsTrigger>
        </TabsList>

        <TabsContent value="scan" className="space-y-6">
          {/* URL Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Target Websites
              </CardTitle>
              <CardDescription>
                Enter the URLs you want to check for potential clones of your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {urls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => updateUrl(index, e.target.value)}
                    disabled={scanning}
                  />
                  {urls.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeUrlField(index)}
                      disabled={scanning}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={addUrlField}
                  disabled={scanning}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add URL
                </Button>
                <Button
                  onClick={startScan}
                  disabled={scanning || urls.every(url => url.trim() === '')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {scanning ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Start AI Scan
                    </>
                  )}
                </Button>
              </div>

              {scanning && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress: {progress}%</span>
                    {currentScan && <span>Scanning: {currentScan}</span>}
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {results.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Search className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No scan results yet. Start a new scan to detect potential clones.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {results.map((result, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Globe className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-sm">{result.url}</span>
                        </div>
                        <Badge className={`${getRiskColor(result.recommendation)} text-white`}>
                          {getRiskLabel(result.recommendation)}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {(result.similarityScore * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-500">Similarity</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold">{(result.analysis.contentSimilarity * 100).toFixed(0)}%</div>
                        <div className="text-xs text-gray-500">Content</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold">{(result.analysis.structureSimilarity * 100).toFixed(0)}%</div>
                        <div className="text-xs text-gray-500">Structure</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold">{(result.analysis.designSimilarity * 100).toFixed(0)}%</div>
                        <div className="text-xs text-gray-500">Design</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold">{(result.analysis.brandingSimilarity * 100).toFixed(0)}%</div>
                        <div className="text-xs text-gray-500">Branding</div>
                      </div>
                    </div>

                    {result.suspiciousElements.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                          <span className="text-sm font-medium">Suspicious Elements</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {result.suspiciousElements.map((element, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {element}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedResult(result)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View AI Analysis
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* AI Analysis Modal */}
          {selectedResult && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>AI Analysis for {selectedResult.url}</AlertTitle>
              <AlertDescription className="mt-2">
                <div className="whitespace-pre-wrap text-sm">
                  {selectedResult.aiAnalysis}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => setSelectedResult(null)}
                >
                  Close
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {scanHistory.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Clock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No scan history yet. Your completed scans will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {scanHistory.map((scan) => (
                <Card key={scan.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{scan.scanType}</Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(scan.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {scan.totalSites} sites scanned
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-red-600">
                          {scan.clonesDetected}
                        </div>
                        <div className="text-sm text-gray-500">Clones Detected</div>
                      </div>
                    </div>

                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span>{scan.highRiskSites} High Risk</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{scan.totalSites - scan.highRiskSites} Low Risk</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
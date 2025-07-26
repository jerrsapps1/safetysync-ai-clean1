import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";

// TypeScript equivalent of your Python Flask upload_form.html template
// TypeScript React equivalent of your Python Flask upload.html template
export default function UploadFormPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid File Type",
          description: "Please select a PDF file",
          variant: "destructive"
        });
        return;
      }
      setSelectedFile(file);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a PDF file to upload",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('pdf', selectedFile);

      // Call our TypeScript equivalent of your Python /upload route
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      setUploadResult(result);
      
      toast({
        title: "PDF Processed Successfully!",
        description: `Extracted data from ${selectedFile.name} with ${result.confidence}% confidence`,
      });

      console.log('📄 UPLOAD SUCCESS:', result);

    } catch (error: any) {
      console.error('❌ UPLOAD ERROR:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to process PDF file",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 p-4">
      <div className="max-w-4xl mx-auto pt-20">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            PDF Document Upload
          </h1>
          <p className="text-xl text-blue-300">
            Upload OSHA training documents for AI-powered data extraction
          </p>
        </div>

        {/* Upload Form - Equivalent to your Python Flask upload_form.html */}
        <Card className="bg-black/20 border-blue-600/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Upload Training Document
            </CardTitle>
            <CardDescription className="text-blue-300">
              Select a PDF file containing OSHA training records for processing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* File Selection */}
            <div className="space-y-2">
              <Label htmlFor="pdf-file" className="text-white">
                Select PDF File
              </Label>
              <Input
                id="pdf-file"
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="bg-blue-700 border-blue-500 text-white file:bg-emerald-600 file:text-white file:border-0"
              />
              {selectedFile && (
                <div className="flex items-center text-emerald-400 text-sm">
                  <FileText className="w-4 h-4 mr-2" />
                  {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </div>

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing PDF...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload and Process
                </>
              )}
            </Button>

            {/* Results Display */}
            {uploadResult && (
              <Card className="bg-blue-700/50 border-blue-500">
                <CardHeader>
                  <CardTitle className="text-emerald-400 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Processing Complete
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-300">Record ID:</span>
                      <p className="text-white font-mono">{uploadResult.id}</p>
                    </div>
                    <div>
                      <span className="text-blue-300">Confidence:</span>
                      <p className="text-emerald-400">{uploadResult.confidence}%</p>
                    </div>
                  </div>
                  
                  {uploadResult.data?.employees && (
                    <div>
                      <span className="text-blue-300">Extracted Employees:</span>
                      <div className="mt-2 space-y-1">
                        {uploadResult.data.employees.map((emp: any, idx: number) => (
                          <div key={idx} className="text-white text-sm bg-blue-600/50 p-2 rounded">
                            {emp.name} {emp.id && `(${emp.id})`}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {uploadResult.data?.trainingTitle && (
                    <div>
                      <span className="text-blue-300">Training:</span>
                      <p className="text-white">{uploadResult.data.trainingTitle}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={() => window.location.href = '/api/records'}
                variant="outline"
                className="border-blue-500 text-blue-300 hover:bg-blue-600"
              >
                View All Records
              </Button>
              <Button
                onClick={() => window.location.href = '/api/dashboard'}
                variant="outline"
                className="border-blue-500 text-blue-300 hover:bg-blue-600"
              >
                Dashboard
              </Button>
            </div>

          </CardContent>
        </Card>

        {/* Python Equivalent Note */}
        <Card className="mt-8 bg-blue-800/50 border-blue-600/50">
          <CardContent className="p-4">
            <div className="flex items-center text-yellow-400 mb-2">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span className="font-semibold">Python Flask Equivalent</span>
            </div>
            <p className="text-blue-300 text-sm">
              This TypeScript React page provides the same functionality as your Python Flask 
              <code className="bg-blue-700 px-1 rounded mx-1">render_template("upload_form.html")</code>
              with modern UI components and real-time processing feedback.
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
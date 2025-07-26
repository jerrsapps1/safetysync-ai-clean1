import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Globe, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function DownloadDocsPage() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (filename: string, type: 'html' | 'markdown') => {
    setDownloading(filename);
    
    try {
      const response = await fetch(`/platform-documentation/${filename}`);
      const content = await response.text();
      
      const blob = new Blob([content], { 
        type: type === 'html' ? 'text/html' : 'text/markdown' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(null);
    }
  };

  const openInNewTab = (filename: string) => {
    window.open(`/platform-documentation/${filename}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:text-white hover:bg-blue-600/50 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Platform
            </Button>
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              SafetySync.AI Platform Documentation
            </h1>
            <p className="text-blue-100 text-lg">
              Comprehensive documentation of all platform pages and features
            </p>
          </div>
        </div>

        {/* Documentation Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* HTML Documentation */}
          <Card className="bg-black/20 backdrop-blur-sm border-blue-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                HTML Documentation
              </CardTitle>
              <CardDescription className="text-blue-100">
                Interactive web-based documentation with professional styling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-blue-100 text-sm">
                • Professional web layout with navigation
                <br />
                • Print-optimized formatting
                <br />
                • Interactive table of contents
                <br />
                • Complete platform overview
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={() => openInNewTab('SafetySync_AI_Platform_Documentation.html')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  View Online
                </Button>
                
                <Button 
                  onClick={() => handleDownload('SafetySync_AI_Platform_Documentation.html', 'html')}
                  disabled={downloading === 'SafetySync_AI_Platform_Documentation.html'}
                  variant="outline"
                  className="flex-1 border-blue-400 text-blue-400 hover:bg-blue-600/20"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {downloading === 'SafetySync_AI_Platform_Documentation.html' ? 'Downloading...' : 'Download'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Markdown Documentation */}
          <Card className="bg-black/20 backdrop-blur-sm border-blue-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Markdown Documentation
              </CardTitle>
              <CardDescription className="text-blue-100">
                Clean, editable text format perfect for development teams
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-blue-100 text-sm">
                • Clean, readable text format
                <br />
                • Easy to edit and version control
                <br />
                • Compatible with all platforms
                <br />
                • Developer-friendly structure
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={() => openInNewTab('SafetySync_AI_Platform_Documentation.md')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Raw
                </Button>
                
                <Button 
                  onClick={() => handleDownload('SafetySync_AI_Platform_Documentation.md', 'markdown')}
                  disabled={downloading === 'SafetySync_AI_Platform_Documentation.md'}
                  variant="outline"
                  className="flex-1 border-blue-400 text-blue-400 hover:bg-blue-600/20"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {downloading === 'SafetySync_AI_Platform_Documentation.md' ? 'Downloading...' : 'Download'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documentation Content Preview */}
        <Card className="bg-black/20 backdrop-blur-sm border-blue-700 max-w-4xl mx-auto mt-8">
          <CardHeader>
            <CardTitle className="text-white">Documentation Includes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 text-blue-100">
              <div>
                <h4 className="font-semibold text-white mb-2">Platform Pages</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Landing page with hero section</li>
                  <li>• Authentication and login flows</li>
                  <li>• Main workspace with navigation</li>
                  <li>• User Guide documentation</li>
                  <li>• Workspace View (compliance dashboard)</li>
                  <li>• Employee management system</li>
                  <li>• Training document hub</li>
                  <li>• Company profile setup</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-2">Technical Details</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Complete feature descriptions</li>
                  <li>• Technical architecture overview</li>
                  <li>• Database schema information</li>
                  <li>• Security implementations</li>
                  <li>• Navigation structure</li>
                  <li>• Color theme specifications</li>
                  <li>• AI integration details</li>
                  <li>• Component relationships</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <div className="text-center mt-8">
          <div className="bg-black/20 backdrop-blur-sm border border-blue-700 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-white font-semibold mb-2">How to Use</h3>
            <p className="text-blue-100 text-sm">
              Click "View Online" to preview the documentation in your browser, or "Download" to save the files locally. 
              The HTML version is perfect for printing, while the Markdown version is ideal for editing and version control.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
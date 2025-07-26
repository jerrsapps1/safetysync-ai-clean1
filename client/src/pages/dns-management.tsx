import DNSManagement from "@/components/dns-management";
import { Navigation } from "@/components/ui/navigation";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function DNSManagementPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        onTrialClick={() => {}} 
        onDemoClick={() => {}} 
        onLoginClick={() => {}} 
      />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-800 hover:bg-gray-100/50">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-800 hover:bg-gray-100/50">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Admin
                </Button>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
                <span className="text-white text-xs font-bold">S</span>
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SafetySync.AI
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <DNSManagement />
      </div>
    </div>
  );
}
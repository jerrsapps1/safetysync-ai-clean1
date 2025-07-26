import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserGuide } from "@/components/ui/user-guide";
import { Home, Brain } from "lucide-react";

export default function UserGuidePage() {
  return (
    <div className="min-h-screen bg-blue-50">
      {/* Navigation Header */}
      <div className="bg-blue-900 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-800">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SafetySync.AI
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link to="/workspace">
                <Button variant="outline" size="sm">Workspace</Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="sm">Pricing</Button>
              </Link>
              <Link to="/industry-research">
                <Button variant="outline" size="sm">Industry Research</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Dashboard Button */}
        <div className="mb-6">
          <Link to="/workspace">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              ← Back to Workspace
            </Button>
          </Link>
        </div>
        
        <UserGuide userPlan="professional" />
      </div>
    </div>
  );
}
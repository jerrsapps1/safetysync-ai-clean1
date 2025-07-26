import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardData } from "@/hooks/useDashboardData";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmployeeManagement from "@/components/enterprise/EmployeeManagement";
import { InstructorSignInGenerator } from "@/components/ui/instructor-signin-generator";
import TrainingRecordsManager from "@/components/records/TrainingRecordsManager";
import TrainingDocumentHub from "@/components/TrainingDocumentHub";
import { SafetySyncIcon } from "@/components/ui/safetysync-icon";

import { 
  Users, 
  FileText, 
  Home,
  Menu,
  X,
  User,
  LogOut,
  ClipboardList,
  FolderOpen,
  UserCheck,
  BarChart3
} from "lucide-react";

export default function WorkspaceSimplified() {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { toast } = useToast();
  const { data: dashboardData, isLoading: isDashboardLoading } = useDashboardData();

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Tab switching
  const handleTabSwitch = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/';
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400">
      {/* Tech Grid Background */}
      <div className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      
      {/* Floating Tech Icons */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="animate-float-slow absolute top-20 left-20 text-blue-400/20">
          <FileText className="w-16 h-16" />
        </div>
        <div className="animate-float-medium absolute top-40 right-32 text-emerald-400/20">
          <Users className="w-20 h-20" />
        </div>
        <div className="animate-float-fast absolute bottom-32 left-1/4 text-purple-400/20">
          <ClipboardList className="w-14 h-14" />
        </div>
        <div className="animate-float-slow absolute bottom-20 right-20 text-cyan-400/20">
          <FolderOpen className="w-18 h-18" />
        </div>
      </div>

      <div className="flex min-h-screen relative z-10">
        {/* Sidebar */}
        <motion.div
          className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-black/20 backdrop-blur-sm border-r border-gray-800 flex flex-col`}
          initial={sidebarOpen ? "open" : "closed"}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              {sidebarOpen ? (
                <div className="flex items-center space-x-3">
                  <SafetySyncIcon size={40} className="rounded-lg" />
                  <div>
                    <h2 className="text-white font-semibold text-base">SafetySync.AI</h2>
                    <p className="text-gray-400 text-sm">Training Records</p>
                  </div>
                </div>
              ) : (
                <SafetySyncIcon size={32} className="rounded-lg" />
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-400 hover:text-white"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className={`${sidebarOpen ? 'block' : 'hidden'} md:block flex-1 p-4 space-y-2`}>
            {/* Dashboard */}
            <Button
              variant="ghost"
              className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 pl-3 ${
                activeTab === "dashboard" ? "text-white bg-gray-700/30" : ""
              }`}
              onClick={() => handleTabSwitch("dashboard")}
              title="Dashboard"
            >
              <Home className="w-5 h-5 mr-3 flex-shrink-0" />
              {sidebarOpen && <span className="truncate">Dashboard</span>}
            </Button>

            {/* Instructor Sign-In Generator */}
            <Button
              variant="ghost"
              className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 pl-3 ${
                activeTab === "instructor-signin" ? "text-white bg-gray-700/30" : ""
              }`}
              onClick={() => handleTabSwitch("instructor-signin")}
              title="Instructor Sign-In Generator"
            >
              <ClipboardList className="w-5 h-5 mr-3 flex-shrink-0" />
              {sidebarOpen && <span className="truncate">Sign-In Generator</span>}
            </Button>

            {/* Training Records */}
            <Button
              variant="ghost"
              className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 pl-3 ${
                activeTab === "training-records" ? "text-white bg-gray-700/30" : ""
              }`}
              onClick={() => handleTabSwitch("training-records")}
              title="Training Records Manager"
            >
              <FileText className="w-5 h-5 mr-3 flex-shrink-0" />
              {sidebarOpen && <span className="truncate">Training Records</span>}
            </Button>

            {/* Document Hub */}
            <Button
              variant="ghost"
              className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 pl-3 ${
                activeTab === "document-hub" ? "text-white bg-gray-700/30" : ""
              }`}
              onClick={() => handleTabSwitch("document-hub")}
              title="Training Document Hub"
            >
              <FolderOpen className="w-5 h-5 mr-3 flex-shrink-0" />
              {sidebarOpen && <span className="truncate">Document Hub</span>}
            </Button>

            {/* Employee Management */}
            <Button
              variant="ghost"
              className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 pl-3 ${
                activeTab === "employees" ? "text-white bg-gray-700/30" : ""
              }`}
              onClick={() => handleTabSwitch("employees")}
              title="Employee Management"
            >
              <Users className="w-5 h-5 mr-3 flex-shrink-0" />
              {sidebarOpen && <span className="truncate">Employee Management</span>}
            </Button>
          </nav>

          {/* User Menu */}
          <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block p-4 border-t border-gray-800`}>
            {sidebarOpen && (
              <div className="mb-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{user?.name || "User"}</p>
                    <p className="text-gray-400 text-xs">Training Manager</p>
                  </div>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              {sidebarOpen && "Sign Out"}
            </Button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Top Bar */}
          <div className="bg-black/20 backdrop-blur-sm border-b border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-white truncate">
                  {activeTab === "dashboard" && "Dashboard"}
                  {activeTab === "instructor-signin" && "Instructor Sign-In Generator"}
                  {activeTab === "training-records" && "Training Records Manager"}
                  {activeTab === "document-hub" && "Training Document Hub"}
                  {activeTab === "employees" && "Employee Management"}
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  {activeTab === "dashboard" && "Overview of training records and activities"}
                  {activeTab === "instructor-signin" && "Create sign-in sheets for training sessions"}
                  {activeTab === "training-records" && "Manage and organize training records"}
                  {activeTab === "document-hub" && "Organize training documents and files"}
                  {activeTab === "employees" && "Manage employee information and training status"}
                </p>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full">
              {/* Dashboard Tab */}
              {activeTab === "dashboard" && (
                <div className="p-6 space-y-6 h-full overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Employees */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {isDashboardLoading ? "..." : dashboardData?.stats?.totalEmployees || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Active employee records
                        </p>
                      </CardContent>
                    </Card>

                    {/* Training Records */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Training Records</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {isDashboardLoading ? "..." : dashboardData?.stats?.totalTrainingSessions || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Completed training sessions
                        </p>
                      </CardContent>
                    </Card>

                    {/* Documents */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Documents</CardTitle>
                        <FolderOpen className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {isDashboardLoading ? "..." : "150"}
                        </div>
                        <p className="text-xs text-muted-foregreen">
                          Training documents stored
                        </p>
                      </CardContent>
                    </Card>

                    {/* Compliance Rate */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {isDashboardLoading ? "..." : dashboardData?.stats?.complianceRate || 0}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Up-to-date training records
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Latest training records and document activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Fall Protection Training - Sign-in sheet created</p>
                            <p className="text-xs text-gray-500">2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">OSHA 30 Training - Records uploaded</p>
                            <p className="text-xs text-gray-500">4 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">New employee added to system</p>
                            <p className="text-xs text-gray-500">1 day ago</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Instructor Sign-In Generator Tab */}
              {activeTab === "instructor-signin" && (
                <div className="h-full">
                  <InstructorSignInGenerator />
                </div>
              )}

              {/* Training Records Tab */}
              {activeTab === "training-records" && (
                <div className="h-full">
                  <TrainingRecordsManager />
                </div>
              )}

              {/* Document Hub Tab */}
              {activeTab === "document-hub" && (
                <div className="h-full">
                  <TrainingDocumentHub />
                </div>
              )}

              {/* Employee Management Tab */}
              {activeTab === "employees" && (
                <div className="h-full">
                  <EmployeeManagement />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
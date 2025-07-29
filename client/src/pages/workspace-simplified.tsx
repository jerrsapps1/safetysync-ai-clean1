import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardData } from "@/hooks/useDashboardData";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { DashboardCardsLoading } from "@/components/ui/loading-states";
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
  const { user, isAuthenticated, isLoading, logout } = useAuth();
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

  console.log('🏢 WORKSPACE: Auth state', { isAuthenticated, isLoading });

  // Redirect if not authenticated (but wait for loading to complete)
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      console.log('🏢 WORKSPACE: User not authenticated, redirecting to home');
      window.location.href = '/';
    }
  }, [isAuthenticated, isLoading]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center">
        <LoadingSpinner size="xl" message="Loading workspace..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 h-screen overflow-hidden">
      {/* Tech Grid Background */}
      <div className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      
      {/* Floating Tech Icons */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="animate-float-slow absolute top-20 left-20 text-blue-400/20">
          <FileText className="w-16 h-16" />
        </div>
        <div className="animate-float-medium absolute top-40 right-32 text-violet-400/20">
          <Users className="w-20 h-20" />
        </div>
        <div className="animate-float-fast absolute bottom-32 left-1/4 text-purple-400/20">
          <ClipboardList className="w-14 h-14" />
        </div>
        <div className="animate-float-slow absolute bottom-20 right-20 text-cyan-400/20">
          <FolderOpen className="w-18 h-18" />
        </div>
      </div>

      <div className="flex h-full relative z-10">
        {/* Sidebar */}
        <motion.div
          className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-black/20 backdrop-blur-sm border-r border-blue-700 flex flex-col flex-shrink-0 h-full`}
          initial={sidebarOpen ? "open" : "closed"}
        >
          {/* Header */}
          <div className="p-4 border-b border-blue-700">
            <div className="flex items-center justify-between">
              {sidebarOpen ? (
                <div className="flex items-center space-x-3">
                  <SafetySyncIcon size={40} className="rounded-lg" />
                  <div>
                    <h2 className="text-white font-semibold text-base">SafetySync.AI</h2>
                    <p className="text-white text-sm">Training Records</p>
                  </div>
                </div>
              ) : (
                <SafetySyncIcon size={32} className="rounded-lg" />
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-blue-100 "
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
              className={`w-full justify-start text-blue-100  /50 pl-3 ${
                activeTab === "dashboard" ? "text-white bg-blue-600/30" : ""
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
              className={`w-full justify-start text-blue-100  /50 pl-3 ${
                activeTab === "instructor-signin" ? "text-white bg-blue-600/30" : ""
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
              className={`w-full justify-start text-blue-100  /50 pl-3 ${
                activeTab === "training-records" ? "text-white bg-blue-600/30" : ""
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
              className={`w-full justify-start text-blue-100  /50 pl-3 ${
                activeTab === "document-hub" ? "text-white bg-blue-600/30" : ""
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
              className={`w-full justify-start text-blue-100  /50 pl-3 ${
                activeTab === "employees" ? "text-white bg-blue-600/30" : ""
              }`}
              onClick={() => handleTabSwitch("employees")}
              title="Employee Management"
            >
              <Users className="w-5 h-5 mr-3 flex-shrink-0" />
              {sidebarOpen && <span className="truncate">Employee Management</span>}
            </Button>
          </nav>


        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Top Bar - Fixed Header */}
          <div className="bg-black/20 backdrop-blur-sm border-b border-blue-700 p-4 flex-shrink-0 sticky top-0 z-20">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-white truncate">
                  {activeTab === "dashboard" && "Dashboard"}
                  {activeTab === "instructor-signin" && "Instructor Sign-In Generator"}
                  {activeTab === "training-records" && "Training Records Manager"}
                  {activeTab === "document-hub" && "Training Document Hub"}
                  {activeTab === "employees" && "Employee Management"}
                </h1>
                <p className="text-white text-sm mt-1">
                  {activeTab === "dashboard" && "Overview of training records and activities"}
                  {activeTab === "instructor-signin" && "Create sign-in sheets for training sessions"}
                  {activeTab === "training-records" && "Manage and organize training records"}
                  {activeTab === "document-hub" && "Organize training documents and files"}
                  {activeTab === "employees" && "Manage employee information and training status"}
                </p>
              </div>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="pb-6">
              {/* Dashboard Tab */}
              {activeTab === "dashboard" && (
                <div className="p-6 space-y-6">
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
                          {isDashboardLoading ? "..." : dashboardData?.stats?.totalCertificates || 0}
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
                          {isDashboardLoading ? "..." : dashboardData?.stats?.complianceScore || 0}%
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
                          <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Fall Protection Training - Sign-in sheet created</p>
                            <p className="text-xs text-blue-400">2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">OSHA 30 Training - Records uploaded</p>
                            <p className="text-xs text-blue-400">4 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">New employee added to system</p>
                            <p className="text-xs text-blue-400">1 day ago</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Additional Scrolling Test Content */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Training Compliance Overview</CardTitle>
                      <CardDescription>Detailed compliance status by department</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {[
                          "Manufacturing Department", "Warehouse Operations", "Quality Control", 
                          "Safety Team", "Maintenance Crew", "Shipping Department", "Office Staff",
                          "Management Team", "Contract Workers", "Temporary Staff"
                        ].map((dept, index) => (
                          <div key={dept} className="border-b border-gray-200 pb-4 last:border-b-0">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="text-sm font-semibold">{dept}</h4>
                              <Badge variant={index % 3 === 0 ? "default" : index % 3 === 1 ? "secondary" : "outline"}>
                                {index % 3 === 0 ? "Compliant" : index % 3 === 1 ? "Action Required" : "Pending"}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-xs">
                              <div>
                                <p className="text-muted-foreground">Employees</p>
                                <p className="font-medium">{12 + index * 3}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Trained</p>
                                <p className="font-medium">{10 + index * 2}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Compliance</p>
                                <p className="font-medium">{85 + index}%</p>
                              </div>
                            </div>
                            <Progress value={85 + index} className="mt-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Upcoming Training Sessions</CardTitle>
                      <CardDescription>Scheduled training events for the next 30 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { title: "Fall Protection Refresher", date: "Jan 15, 2025", attendees: 25 },
                          { title: "OSHA 10 New Hire Training", date: "Jan 18, 2025", attendees: 15 },
                          { title: "Forklift Operator Certification", date: "Jan 22, 2025", attendees: 8 },
                          { title: "Hazmat Handling Training", date: "Jan 25, 2025", attendees: 12 },
                          { title: "Emergency Response Drill", date: "Jan 28, 2025", attendees: 50 },
                          { title: "Confined Space Entry", date: "Feb 1, 2025", attendees: 10 },
                          { title: "Respiratory Protection Fit Testing", date: "Feb 5, 2025", attendees: 30 }
                        ].map((session, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <p className="font-medium">{session.title}</p>
                              <p className="text-sm text-muted-foreground">{session.date}</p>
                            </div>
                            <Badge variant="outline">{session.attendees} attendees</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Instructor Sign-In Generator Tab */}
              {activeTab === "instructor-signin" && (
                <div className="p-6">
                  <InstructorSignInGenerator />
                </div>
              )}

              {/* Training Records Tab */}
              {activeTab === "training-records" && (
                <div className="p-6">
                  <TrainingRecordsManager />
                </div>
              )}

              {/* Document Hub Tab */}
              {activeTab === "document-hub" && (
                <div className="p-6">
                  <TrainingDocumentHub />
                </div>
              )}

              {/* Employee Management Tab */}
              {activeTab === "employees" && (
                <div className="p-6">
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
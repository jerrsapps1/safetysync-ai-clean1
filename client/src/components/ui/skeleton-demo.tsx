import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIPatternSkeleton } from "@/components/ui/ai-skeleton";
import { Brain, Sparkles, Zap, Cpu } from "lucide-react";

export const SkeletonDemo = () => {
  const [showSkeletons, setShowSkeletons] = useState(false);

  const simulateLoading = () => {
    setShowSkeletons(true);
    setTimeout(() => setShowSkeletons(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            AI-Powered Loading Skeletons
          </h1>
          <p className="text-slate-300 text-lg mb-6">
            Experience our intelligent loading patterns with AI-inspired animations
          </p>
          <Button
            onClick={simulateLoading}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Simulate Loading
          </Button>
        </div>
      </div>

      {/* Skeleton Examples */}
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="cards" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800/50 backdrop-blur-sm border border-white/10">
            <TabsTrigger value="cards" className="text-white">Cards</TabsTrigger>
            <TabsTrigger value="dashboard" className="text-white">Dashboard</TabsTrigger>
            <TabsTrigger value="table" className="text-white">Tables</TabsTrigger>
            <TabsTrigger value="stats" className="text-white">Stats</TabsTrigger>
            <TabsTrigger value="forms" className="text-white">Forms</TabsTrigger>
            <TabsTrigger value="charts" className="text-white">Charts</TabsTrigger>
          </TabsList>

          <TabsContent value="cards" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {showSkeletons ? (
                <>
                  <AIPatternSkeleton variant="card" />
                  <AIPatternSkeleton variant="card" />
                  <AIPatternSkeleton variant="card" />
                  <AIPatternSkeleton variant="card" />
                  <AIPatternSkeleton variant="card" />
                  <AIPatternSkeleton variant="card" />
                </>
              ) : (
                <>
                  <Card className="bg-slate-800/50 backdrop-blur-sm border-white/10 text-white">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Brain className="w-5 h-5 text-blue-400" />
                        <CardTitle>AI Compliance Monitor</CardTitle>
                      </div>
                      <CardDescription className="text-slate-300">
                        Real-time compliance analysis
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-300">
                        Our AI continuously monitors your compliance status and provides intelligent recommendations.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-800/50 backdrop-blur-sm border-white/10 text-white">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Zap className="w-5 h-5 text-purple-400" />
                        <CardTitle>Smart Analytics</CardTitle>
                      </div>
                      <CardDescription className="text-slate-300">
                        Advanced data insights
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-300">
                        Leverage machine learning to understand patterns in your safety data.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-800/50 backdrop-blur-sm border-white/10 text-white">
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Cpu className="w-5 h-5 text-green-400" />
                        <CardTitle>Automated Reports</CardTitle>
                      </div>
                      <CardDescription className="text-slate-300">
                        Intelligent report generation
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-300">
                        Generate comprehensive reports automatically with AI-powered insights.
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {showSkeletons ? (
                <>
                  <AIPatternSkeleton variant="dashboard" />
                  <AIPatternSkeleton variant="dashboard" />
                </>
              ) : (
                <>
                  <Card className="bg-slate-800/50 backdrop-blur-sm border-white/10 text-white p-6">
                    <h3 className="text-xl font-semibold mb-4">Dashboard Overview</h3>
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">98%</div>
                        <div className="text-sm text-slate-300">Compliance</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">247</div>
                        <div className="text-sm text-slate-300">Employees</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">12</div>
                        <div className="text-sm text-slate-300">Pending</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">5</div>
                        <div className="text-sm text-slate-300">Alerts</div>
                      </div>
                    </div>
                    <div className="h-32 bg-slate-700/50 rounded-lg flex items-center justify-center">
                      <span className="text-slate-400">Chart Area</span>
                    </div>
                  </Card>
                  <Card className="bg-slate-800/50 backdrop-blur-sm border-white/10 text-white p-6">
                    <h3 className="text-xl font-semibold mb-4">AI Insights</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-slate-300">Fall protection training due in 2 weeks</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-slate-300">Compliance rate improved by 15%</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span className="text-slate-300">Equipment inspection scheduled</span>
                      </div>
                    </div>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="table" className="space-y-6">
            {showSkeletons ? (
              <AIPatternSkeleton variant="table" />
            ) : (
              <Card className="bg-slate-800/50 backdrop-blur-sm border-white/10 text-white">
                <CardHeader>
                  <CardTitle>Employee Training Records</CardTitle>
                  <CardDescription className="text-slate-300">
                    Current training status for all employees
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left p-2">Employee</th>
                          <th className="text-left p-2">Training</th>
                          <th className="text-left p-2">Status</th>
                          <th className="text-left p-2">Due Date</th>
                          <th className="text-left p-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-700/50">
                          <td className="p-2">John Smith</td>
                          <td className="p-2">Fall Protection</td>
                          <td className="p-2"><span className="text-green-400">Completed</span></td>
                          <td className="p-2">2025-09-15</td>
                          <td className="p-2"><Button size="sm" variant="outline">View</Button></td>
                        </tr>
                        <tr className="border-b border-slate-700/50">
                          <td className="p-2">Jane Doe</td>
                          <td className="p-2">HAZWOPER</td>
                          <td className="p-2"><span className="text-yellow-400">Pending</span></td>
                          <td className="p-2">2025-08-30</td>
                          <td className="p-2"><Button size="sm" variant="outline">Assign</Button></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {showSkeletons ? (
                <>
                  <AIPatternSkeleton variant="stats" />
                  <AIPatternSkeleton variant="stats" />
                  <AIPatternSkeleton variant="stats" />
                  <AIPatternSkeleton variant="stats" />
                </>
              ) : (
                <>
                  <Card className="bg-slate-800/50 backdrop-blur-sm border-white/10 text-white text-center p-6">
                    <div className="text-3xl font-bold text-blue-400 mb-2">98.5%</div>
                    <div className="text-slate-300">Compliance Rate</div>
                    <div className="text-sm text-green-400 mt-2">↑ 2.1%</div>
                  </Card>
                  <Card className="bg-slate-800/50 backdrop-blur-sm border-white/10 text-white text-center p-6">
                    <div className="text-3xl font-bold text-green-400 mb-2">247</div>
                    <div className="text-slate-300">Active Employees</div>
                    <div className="text-sm text-blue-400 mt-2">↑ 12</div>
                  </Card>
                  <Card className="bg-slate-800/50 backdrop-blur-sm border-white/10 text-white text-center p-6">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">12</div>
                    <div className="text-slate-300">Pending Training</div>
                    <div className="text-sm text-red-400 mt-2">↓ 5</div>
                  </Card>
                  <Card className="bg-slate-800/50 backdrop-blur-sm border-white/10 text-white text-center p-6">
                    <div className="text-3xl font-bold text-purple-400 mb-2">5</div>
                    <div className="text-slate-300">Active Alerts</div>
                    <div className="text-sm text-yellow-400 mt-2">→ 0</div>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="forms" className="space-y-6">
            {showSkeletons ? (
              <AIPatternSkeleton variant="form" />
            ) : (
              <Card className="bg-slate-800/50 backdrop-blur-sm border-white/10 text-white max-w-2xl">
                <CardHeader>
                  <CardTitle>Employee Registration</CardTitle>
                  <CardDescription className="text-slate-300">
                    Add a new employee to the system
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Department</label>
                    <select className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white">
                      <option>Select department</option>
                      <option>Construction</option>
                      <option>Manufacturing</option>
                      <option>Administration</option>
                    </select>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                    Register Employee
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            {showSkeletons ? (
              <AIPatternSkeleton variant="chart" />
            ) : (
              <Card className="bg-slate-800/50 backdrop-blur-sm border-white/10 text-white">
                <CardHeader>
                  <CardTitle>Compliance Trends</CardTitle>
                  <CardDescription className="text-slate-300">
                    Monthly compliance rate over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-slate-700/50 rounded-lg flex items-center justify-center">
                    <span className="text-slate-400">Interactive Chart Placeholder</span>
                  </div>
                  <div className="flex justify-center space-x-6 mt-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      <span className="text-sm text-slate-300">Compliance Rate</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-slate-300">Training Completion</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                      <span className="text-sm text-slate-300">Certifications</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
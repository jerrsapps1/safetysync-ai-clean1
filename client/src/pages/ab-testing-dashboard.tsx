import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Users, 
  Target,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Eye,
  MousePointer,
  DollarSign
} from "lucide-react";
import { ACTIVE_AB_TESTS, abTestingService, type ABTest } from "@/lib/ab-testing";

export default function ABTestingDashboard() {
  const [tests, setTests] = useState<ABTest[]>(ACTIVE_AB_TESTS);
  const [selectedTest, setSelectedTest] = useState<string>(ACTIVE_AB_TESTS[0]?.id || '');

  const selectedTestData = tests.find(t => t.id === selectedTest);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const getSignificanceLevel = (significance: number) => {
    if (significance <= 0.05) return { level: 'High', color: 'text-green-600', icon: CheckCircle };
    if (significance <= 0.1) return { level: 'Medium', color: 'text-yellow-600', icon: AlertTriangle };
    return { level: 'Low', color: 'text-red-600', icon: AlertTriangle };
  };

  const calculateLift = (variantRate: number, controlRate: number) => {
    if (controlRate === 0) return 0;
    return ((variantRate - controlRate) / controlRate) * 100;
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-800">A/B Testing Dashboard</h1>
          <p className="text-blue-500 mt-2">Optimize conversion rates through data-driven testing</p>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-500">Active Tests</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {tests.filter(t => t.status === 'running').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-500">Total Visitors</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {tests.reduce((sum, test) => sum + test.metrics.totalVisitors, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-500">Avg Conversion Rate</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {(tests.reduce((sum, test) => sum + test.metrics.conversionRate, 0) / tests.length).toFixed(2)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-500">Significant Wins</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {tests.filter(t => t.metrics.significance <= 0.05).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Test List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                A/B Tests
                <Button size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  New Test
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tests.map((test) => {
                  const significance = getSignificanceLevel(test.metrics.significance);
                  const SignificanceIcon = significance.icon;
                  
                  return (
                    <div
                      key={test.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedTest === test.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-blue-200 hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedTest(test.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{test.name}</h4>
                        <Badge className={getStatusColor(test.status)}>
                          {test.status}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-blue-500 mb-3 line-clamp-2">
                        {test.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-blue-400">Visitors:</span>
                          <div className="font-medium">{test.metrics.totalVisitors.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-blue-400">Conv. Rate:</span>
                          <div className="font-medium">{test.metrics.conversionRate.toFixed(2)}%</div>
                        </div>
                        <div>
                          <span className="text-blue-400">Confidence:</span>
                          <div className="font-medium">{test.metrics.confidence.toFixed(1)}%</div>
                        </div>
                        <div className="flex items-center">
                          <SignificanceIcon className={`w-3 h-3 mr-1 ${significance.color}`} />
                          <span className={`text-xs ${significance.color}`}>{significance.level}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Test Details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{selectedTestData?.name}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                  <Button variant="outline" size="sm">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedTestData && (
                <Tabs defaultValue="results" className="w-full">
                  <TabsList>
                    <TabsTrigger value="results">Results</TabsTrigger>
                    <TabsTrigger value="variants">Variants</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="results" className="space-y-6">
                    {/* Overall Test Performance */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Eye className="w-4 h-4 text-blue-500 mr-2" />
                          <span className="text-sm font-medium text-blue-500">Total Visitors</span>
                        </div>
                        <p className="text-2xl font-bold">{selectedTestData.metrics.totalVisitors.toLocaleString()}</p>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <MousePointer className="w-4 h-4 text-blue-500 mr-2" />
                          <span className="text-sm font-medium text-blue-500">Conversions</span>
                        </div>
                        <p className="text-2xl font-bold">{selectedTestData.metrics.conversions}</p>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Target className="w-4 h-4 text-blue-500 mr-2" />
                          <span className="text-sm font-medium text-blue-500">Conversion Rate</span>
                        </div>
                        <p className="text-2xl font-bold">{selectedTestData.metrics.conversionRate.toFixed(2)}%</p>
                      </div>
                    </div>

                    {/* Variant Comparison */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Variant Performance</h4>
                      {selectedTestData.metrics.variantMetrics.map((variant, index) => {
                        const variantInfo = selectedTestData.variants.find(v => v.id === variant.variantId);
                        const isWinner = variant.conversionRate === Math.max(...selectedTestData.metrics.variantMetrics.map(v => v.conversionRate));
                        const controlMetrics = selectedTestData.metrics.variantMetrics.find(v => 
                          selectedTestData.variants.find(variant => variant.id === v.variantId)?.isControl
                        );
                        const lift = controlMetrics ? calculateLift(variant.conversionRate, controlMetrics.conversionRate) : 0;
                        
                        return (
                          <div key={variant.variantId} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h5 className="font-medium flex items-center gap-2">
                                  {variantInfo?.name}
                                  {variantInfo?.isControl && <Badge variant="outline">Control</Badge>}
                                  {isWinner && !variantInfo?.isControl && <Badge className="bg-green-100 text-green-800">Winner</Badge>}
                                </h5>
                                <p className="text-sm text-blue-500">{variantInfo?.description}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold">{variant.conversionRate.toFixed(2)}%</p>
                                {!variantInfo?.isControl && (
                                  <p className={`text-sm ${lift > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {lift > 0 ? '+' : ''}{lift.toFixed(1)}% lift
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-blue-400">Visitors</span>
                                <p className="font-medium">{variant.visitors.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-blue-400">Conversions</span>
                                <p className="font-medium">{variant.conversions}</p>
                              </div>
                              <div>
                                <span className="text-blue-400">Revenue</span>
                                <p className="font-medium">${variant.revenue.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-blue-400">Confidence</span>
                                <p className="font-medium">{variant.confidence.toFixed(1)}%</p>
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <div className="flex justify-between text-xs text-blue-500 mb-1">
                                <span>Conversion Progress</span>
                                <span>{variant.conversions} / {Math.round(variant.visitors * 0.1)} target</span>
                              </div>
                              <Progress value={(variant.conversions / Math.round(variant.visitors * 0.1)) * 100} className="h-2" />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Statistical Significance */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Statistical Analysis
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-blue-500">Confidence Level:</span>
                          <p className="font-bold text-lg">{selectedTestData.metrics.confidence.toFixed(1)}%</p>
                        </div>
                        <div>
                          <span className="text-blue-500">P-value:</span>
                          <p className="font-bold text-lg">{selectedTestData.metrics.significance.toFixed(3)}</p>
                        </div>
                      </div>
                      
                      {selectedTestData.metrics.significance <= 0.05 ? (
                        <div className="mt-3 p-3 bg-green-100 rounded border-l-4 border-green-500">
                          <p className="text-green-800 font-medium">✅ Results are statistically significant!</p>
                          <p className="text-green-700 text-sm">You can confidently implement the winning variant.</p>
                        </div>
                      ) : (
                        <div className="mt-3 p-3 bg-yellow-100 rounded border-l-4 border-yellow-500">
                          <p className="text-yellow-800 font-medium">⚠️ Results not yet significant</p>
                          <p className="text-yellow-700 text-sm">Continue testing to reach statistical significance.</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="variants" className="space-y-4">
                    {selectedTestData.variants.map((variant) => (
                      <div key={variant.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h5 className="font-medium flex items-center gap-2">
                              {variant.name}
                              {variant.isControl && <Badge variant="outline">Control</Badge>}
                            </h5>
                            <p className="text-sm text-blue-500">{variant.description}</p>
                          </div>
                          <Badge variant="outline">{variant.trafficWeight}% traffic</Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <h6 className="text-sm font-medium">Changes:</h6>
                          {variant.changes.map((change, index) => (
                            <div key={index} className="bg-blue-50 p-2 rounded text-sm">
                              <span className="font-medium">{change.element}</span> - {change.property}: 
                              <span className="ml-1 text-blue-600">{change.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="settings" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium mb-3">Test Configuration</h5>
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="text-blue-500">Test ID:</span>
                            <p className="font-medium">{selectedTestData.id}</p>
                          </div>
                          <div>
                            <span className="text-blue-500">Start Date:</span>
                            <p className="font-medium">{selectedTestData.startDate}</p>
                          </div>
                          <div>
                            <span className="text-blue-500">Traffic Allocation:</span>
                            <p className="font-medium">{selectedTestData.trafficAllocation}%</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-3">Actions</h5>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full">
                            Export Results
                          </Button>
                          <Button variant="outline" className="w-full">
                            Duplicate Test
                          </Button>
                          <Button variant="outline" className="w-full text-red-600">
                            Archive Test
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Optimization Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800 mb-2">High Impact Test</h4>
                <p className="text-green-700 text-sm mb-3">
                  Test different value propositions in your hero section. Focus on time savings vs. cost savings messaging.
                </p>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Create Test
                </Button>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">Medium Impact Test</h4>
                <p className="text-blue-700 text-sm mb-3">
                  Test social proof placement. Try moving testimonials above the fold vs. below pricing section.
                </p>
                <Button size="sm" variant="outline">
                  Consider Testing
                </Button>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-800 mb-2">Low Impact Test</h4>
                <p className="text-yellow-700 text-sm mb-3">
                  Test footer layout optimization. This typically has minimal impact on conversion rates.
                </p>
                <Button size="sm" variant="outline">
                  Low Priority
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
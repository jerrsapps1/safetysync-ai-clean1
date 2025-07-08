import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Users, 
  MousePointer, 
  Target, 
  Eye,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Download
} from "lucide-react";

interface ConversionMetric {
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

interface TrafficSource {
  source: string;
  visitors: number;
  conversions: number;
  rate: number;
}

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('7d');
  const [conversionMetrics, setConversionMetrics] = useState<ConversionMetric[]>([]);
  const [trafficSources, setTrafficSources] = useState<TrafficSource[]>([]);

  // Simulated analytics data (replace with real analytics API)
  useEffect(() => {
    const metrics: ConversionMetric[] = [
      { name: 'Total Visitors', value: 1247, change: 12.5, trend: 'up' },
      { name: 'Trial Signups', value: 87, change: 8.3, trend: 'up' },
      { name: 'Demo Requests', value: 34, change: -2.1, trend: 'down' },
      { name: 'Conversion Rate', value: 9.7, change: 1.4, trend: 'up' },
      { name: 'Product Tours', value: 156, change: 15.2, trend: 'up' },
      { name: 'Live Chat Opens', value: 43, change: 5.8, trend: 'up' },
    ];

    const sources: TrafficSource[] = [
      { source: 'Direct', visitors: 487, conversions: 52, rate: 10.7 },
      { source: 'Google Search', visitors: 324, conversions: 31, rate: 9.6 },
      { source: 'Social Media', visitors: 218, conversions: 18, rate: 8.3 },
      { source: 'Referral', visitors: 143, conversions: 12, rate: 8.4 },
      { source: 'Email', visitors: 75, conversions: 8, rate: 10.7 },
    ];

    setConversionMetrics(metrics);
    setTrafficSources(sources);
  }, [timeRange]);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-2">Customer acquisition and conversion tracking</p>
            </div>
            <div className="flex items-center gap-4">
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1d">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {conversionMetrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {metric.name.includes('Rate') ? `${metric.value}%` : formatNumber(metric.value)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {getTrendIcon(metric.trend)}
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className={`font-medium ${getTrendColor(metric.trend)}`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </span>
                  <span className="text-gray-500 ml-1">vs previous period</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="conversions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="conversions">Conversion Funnel</TabsTrigger>
            <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
            <TabsTrigger value="events">Event Tracking</TabsTrigger>
            <TabsTrigger value="goals">Goal Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="conversions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Conversion Funnel Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Eye className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Landing Page Views</span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">1,247</p>
                      <p className="text-sm text-gray-600">100%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MousePointer className="w-5 h-5 text-green-600" />
                      <span className="font-medium">CTA Button Clicks</span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">234</p>
                      <p className="text-sm text-gray-600">18.8%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-purple-600" />
                      <span className="font-medium">Form Submissions</span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600">121</p>
                      <p className="text-sm text-gray-600">9.7%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-orange-600" />
                      <span className="font-medium">Completed Signups</span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-600">87</p>
                      <p className="text-sm text-gray-600">7.0%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="traffic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Traffic Sources Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trafficSources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{source.source}</p>
                        <p className="text-sm text-gray-600">{formatNumber(source.visitors)} visitors</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{source.conversions} conversions</p>
                        <Badge variant={source.rate > 9 ? "default" : "secondary"}>
                          {source.rate}% rate
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Event Tracking Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Hero CTA Clicks</h4>
                    <p className="text-2xl font-bold text-blue-600">156</p>
                    <p className="text-sm text-gray-600">Trial: 89, Demo: 67</p>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Product Tour Starts</h4>
                    <p className="text-2xl font-bold text-green-600">43</p>
                    <p className="text-sm text-gray-600">27.6% completion rate</p>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Live Chat Opens</h4>
                    <p className="text-2xl font-bold text-purple-600">28</p>
                    <p className="text-sm text-gray-600">Average session: 4.2 min</p>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Pricing Page Views</h4>
                    <p className="text-2xl font-bold text-orange-600">187</p>
                    <p className="text-sm text-gray-600">15.0% of total traffic</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Goal Performance Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Monthly Trial Goal</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-blue-900">87 / 120</p>
                        <p className="text-sm text-blue-700">72.5% complete</p>
                      </div>
                      <div className="w-32 bg-blue-200 rounded-full h-3">
                        <div className="bg-blue-600 h-3 rounded-full" style={{ width: '72.5%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Demo Request Goal</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-green-900">34 / 40</p>
                        <p className="text-sm text-green-700">85.0% complete</p>
                      </div>
                      <div className="w-32 bg-green-200 rounded-full h-3">
                        <div className="bg-green-600 h-3 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">Conversion Rate Goal</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-purple-900">9.7% / 8.0%</p>
                        <p className="text-sm text-purple-700">Goal exceeded!</p>
                      </div>
                      <div className="w-32 bg-purple-200 rounded-full h-3">
                        <div className="bg-purple-600 h-3 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Shield, 
  Users, 
  Clock,
  Target,
  Brain,
  Zap,
  Activity,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { SafetySyncIcon } from '@/components/ui/safetysync-icon';

interface TrendData {
  month: string;
  compliance: number;
  training: number;
}

interface SafetyMetric {
  id: string;
  name: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
  target: number;
  color: string;
  icon: React.ReactNode;
}

const SafetyTrendsDashboard: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentTimeframe, setCurrentTimeframe] = useState('12months');
  const [selectedMetric, setSelectedMetric] = useState<string>('compliance');
  const [animationSpeed, setAnimationSpeed] = useState(1);

  // Real-time safety trend data
  const [trendData, setTrendData] = useState<TrendData[]>([
    { month: 'Jan', compliance: 92, training: 78 },
    { month: 'Feb', compliance: 94, training: 82 },
    { month: 'Mar', compliance: 96, training: 85 },
    { month: 'Apr', compliance: 89, training: 88 },
    { month: 'May', compliance: 97, training: 91 },
    { month: 'Jun', compliance: 95, training: 93 },
    { month: 'Jul', compliance: 98, training: 96 },
    { month: 'Aug', compliance: 93, training: 89 },
    { month: 'Sep', compliance: 99, training: 98 },
    { month: 'Oct', compliance: 96, training: 94 },
    { month: 'Nov', compliance: 99, training: 99 },
    { month: 'Dec', compliance: 100, training: 100 }
  ]);

  const safetyMetrics: SafetyMetric[] = [
    {
      id: 'compliance',
      name: 'Compliance Rate',
      value: 100,
      trend: 'up',
      change: 8,
      target: 100,
      color: '#22c55e',
      icon: <SafetySyncIcon size={20} />
    },
    {
      id: 'training',
      name: 'Training Completion',
      value: 100,
      trend: 'up',
      change: 22,
      target: 95,
      color: '#3b82f6',
      icon: <Users className="w-5 h-5" />
    }
  ];

  // Animation effect for real-time updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAnimating) {
      interval = setInterval(() => {
        setTrendData(prev => prev.map(item => ({
          ...item,
          compliance: Math.min(100, Math.max(85, item.compliance + (Math.random() - 0.3) * 3)),
          training: Math.min(100, Math.max(70, item.training + (Math.random() - 0.2) * 4))
        })));
      }, 2000 / animationSpeed);
    }

    return () => clearInterval(interval);
  }, [isAnimating, animationSpeed]);

  const resetData = () => {
    setTrendData([
      { month: 'Jan', compliance: 92, training: 78 },
      { month: 'Feb', compliance: 94, training: 82 },
      { month: 'Mar', compliance: 96, training: 85 },
      { month: 'Apr', compliance: 89, training: 88 },
      { month: 'May', compliance: 97, training: 91 },
      { month: 'Jun', compliance: 95, training: 93 },
      { month: 'Jul', compliance: 98, training: 96 },
      { month: 'Aug', compliance: 93, training: 89 },
      { month: 'Sep', compliance: 99, training: 98 },
      { month: 'Oct', compliance: 96, training: 94 },
      { month: 'Nov', compliance: 99, training: 99 },
      { month: 'Dec', compliance: 100, training: 100 }
    ]);
  };

  const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

  const departmentData = [
    { name: 'Construction', compliance: 96 },
    { name: 'Manufacturing', compliance: 98 },
    { name: 'Maintenance', compliance: 94 },
    { name: 'Quality Control', compliance: 100 },
    { name: 'Transportation', compliance: 97 }
  ];

  const riskData = [
    { name: 'Low Risk', value: 75, fill: '#22c55e' },
    { name: 'Medium Risk', value: 20, fill: '#f59e0b' },
    { name: 'High Risk', value: 5, fill: '#ef4444' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 p-6">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                <Brain className="inline w-8 h-8 mr-3 text-blue-400" />
                AI Safety Trends Dashboard
              </h1>
              <p className="text-blue-200">Real-time safety analytics with predictive intelligence</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant={isAnimating ? "destructive" : "default"}
                  size="sm"
                  onClick={() => setIsAnimating(!isAnimating)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isAnimating ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {isAnimating ? 'Pause' : 'Animate'}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetData}
                  className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-blue-200">Speed:</span>
                <select 
                  value={animationSpeed} 
                  onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                  className="bg-blue-700 text-white border border-blue-400 rounded px-2 py-1 text-sm"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1x</option>
                  <option value={2}>2x</option>
                  <option value={3}>3x</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {safetyMetrics.map((metric) => (
            <Card 
              key={metric.id} 
              className={`bg-blue-700/50 backdrop-blur-sm border-slate-700 cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedMetric === metric.id ? 'ring-2 ring-blue-400' : ''
              }`}
              onClick={() => setSelectedMetric(metric.id)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-300 flex items-center justify-between">
                  <span className="flex items-center">
                    <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: `${metric.color}20` }}>
                      <div style={{ color: metric.color }}>
                        {metric.icon}
                      </div>
                    </div>
                    {metric.name}
                  </span>
                  <Badge variant={metric.trend === 'up' ? 'default' : 'destructive'} className="text-xs">
                    {metric.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {Math.abs(metric.change)}%
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-2" style={{ color: metric.color }}>
                  {metric.value}
                  {metric.id === 'compliance' || metric.id === 'training' ? '%' : ''}
                </div>
                <Progress 
                  value={metric.value} 
                  className="h-2" 
                  style={{ backgroundColor: `${metric.color}20` }}
                />
                <p className="text-xs text-blue-300 mt-2">
                  Target: {metric.target}{metric.id === 'compliance' || metric.id === 'training' ? '%' : ''}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Trend Analysis Chart */}
          <Card className="bg-blue-700/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-400" />
                Safety Trends Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }} 
                    />

                    <Line 
                      type="monotone" 
                      dataKey="compliance" 
                      stroke="#22c55e" 
                      strokeWidth={3}
                      dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="training" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Risk Distribution */}
          <Card className="bg-blue-700/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-400" />
                Risk Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {riskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-6 mt-4">
                {riskData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-sm text-gray-300">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-blue-700/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-400" />
                Department Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="compliance" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="bg-blue-700/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="w-5 h-5 mr-2 text-blue-400" />
                AI Safety Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Compliance Improving</p>
                    <p className="text-sm text-blue-300">8% increase in overall compliance rates this quarter</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Training Gap Identified</p>
                    <p className="text-sm text-blue-300">Maintenance department needs additional fall protection training</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Brain className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Predictive Alert</p>
                    <p className="text-sm text-blue-300">AI predicts 23% risk reduction with proposed safety measures</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Critical Action Required</p>
                    <p className="text-sm text-blue-300">3 overdue safety inspections in Manufacturing</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SafetyTrendsDashboard;
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BreakdownData {
  date: string;
  Basic: number;
  Pro: number;
  Lifer: number;
  Enterprise: number;
}

interface PlanSummary {
  plan: string;
  total: number;
  percentage: number;
  color: string;
}

const PLAN_COLORS = {
  Basic: '#3b82f6',     // Blue
  Pro: '#10b981',       // Emerald
  Lifer: '#f59e0b',     // Amber
  Enterprise: '#8b5cf6' // Purple
};

export default function SignupPlanBreakdown() {
  const [breakdownData, setBreakdownData] = useState<BreakdownData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'7d' | '30d'>('30d');
  const { toast } = useToast();

  const fetchBreakdownData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/signup-breakdown');
      if (!response.ok) throw new Error('Failed to fetch breakdown data');
      
      const data = await response.json();
      setBreakdownData(data);
    } catch (error) {
      console.error('Error fetching breakdown data:', error);
      toast({
        title: "Error",
        description: "Failed to load signup breakdown data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBreakdownData();
  }, []);

  // Filter data based on timeframe
  const filteredData = breakdownData.slice(timeframe === '7d' ? -7 : -30);

  // Calculate plan summaries for pie chart
  const planSummaries: PlanSummary[] = ['Basic', 'Pro', 'Lifer', 'Enterprise'].map(plan => {
    const total = filteredData.reduce((sum, day) => sum + day[plan as keyof BreakdownData], 0);
    const grandTotal = filteredData.reduce((sum, day) => 
      sum + day.Basic + day.Pro + day.Lifer + day.Enterprise, 0
    );
    
    return {
      plan,
      total,
      percentage: grandTotal > 0 ? Math.round((total / grandTotal) * 100) : 0,
      color: PLAN_COLORS[plan as keyof typeof PLAN_COLORS]
    };
  }).filter(summary => summary.total > 0);

  // Calculate total metrics
  const totalSignups = planSummaries.reduce((sum, plan) => sum + plan.total, 0);
  const avgDailySignups = Math.round(totalSignups / filteredData.length);
  const mostPopularPlan = planSummaries.reduce((prev, current) => 
    current.total > prev.total ? current : prev, planSummaries[0]
  );

  const exportData = () => {
    const csvContent = [
      ['Date', 'Basic', 'Pro', 'Lifer', 'Enterprise', 'Total'],
      ...filteredData.map(day => [
        day.date,
        day.Basic.toString(),
        day.Pro.toString(),
        day.Lifer.toString(),
        day.Enterprise.toString(),
        (day.Basic + day.Pro + day.Lifer + day.Enterprise).toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `signup-breakdown-${timeframe}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `Signup breakdown data exported for ${timeframe}`,
    });
  };

  if (loading) {
    return (
      <Card className="bg-blue-800/30 backdrop-blur-sm border-blue-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5" />
            Signup Plan Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="h-6 w-6" />
            Signup Plan Breakdown
          </h2>
          <p className="text-blue-200">Detailed subscription tier analytics</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-blue-800/30 rounded-lg p-1">
            <Button
              variant={timeframe === '7d' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeframe('7d')}
              className={timeframe === '7d' ? 'bg-blue-600 text-white' : 'text-blue-200 hover:text-white hover:bg-blue-800/30'}
            >
              7 Days
            </Button>
            <Button
              variant={timeframe === '30d' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeframe('30d')}
              className={timeframe === '30d' ? 'bg-blue-600 text-white' : 'text-blue-200 hover:text-white hover:bg-blue-800/30'}
            >
              30 Days
            </Button>
          </div>
          
          <Button
            onClick={exportData}
            variant="outline"
            size="sm"
            className="border-blue-600 text-blue-200 hover:bg-blue-600 hover:text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-800/30 backdrop-blur-sm border-blue-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Total Signups</p>
                <p className="text-2xl font-bold text-white">{totalSignups}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-800/30 backdrop-blur-sm border-blue-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Daily Average</p>
                <p className="text-2xl font-bold text-white">{avgDailySignups}</p>
              </div>
              <Calendar className="h-8 w-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-800/30 backdrop-blur-sm border-blue-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Top Plan</p>
                <p className="text-2xl font-bold text-white">{mostPopularPlan?.plan}</p>
                <p className="text-sm text-blue-300">{mostPopularPlan?.percentage}%</p>
              </div>
              <Users className="h-8 w-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-800/30 backdrop-blur-sm border-blue-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Enterprise Share</p>
                <p className="text-2xl font-bold text-white">
                  {planSummaries.find(p => p.plan === 'Enterprise')?.percentage || 0}%
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stacked Bar Chart */}
        <Card className="bg-blue-800/30 backdrop-blur-sm border-blue-700/50">
          <CardHeader>
            <CardTitle className="text-white">Daily Signup Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="#93c5fd"
                  fontSize={12}
                  tickFormatter={(value) => value.split(' ')[1]} // Show only day part
                />
                <YAxis stroke="#93c5fd" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(30, 58, 138, 0.9)',
                    border: '1px solid rgba(59, 130, 246, 0.5)',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />
                <Legend />
                <Bar dataKey="Basic" stackId="a" fill={PLAN_COLORS.Basic} name="Basic" />
                <Bar dataKey="Pro" stackId="a" fill={PLAN_COLORS.Pro} name="Pro" />
                <Bar dataKey="Lifer" stackId="a" fill={PLAN_COLORS.Lifer} name="Lifer" />
                <Bar dataKey="Enterprise" stackId="a" fill={PLAN_COLORS.Enterprise} name="Enterprise" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="bg-blue-800/30 backdrop-blur-sm border-blue-700/50">
          <CardHeader>
            <CardTitle className="text-white">Plan Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={planSummaries}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ plan, percentage }) => `${plan} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="total"
                >
                  {planSummaries.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(30, 58, 138, 0.9)',
                    border: '1px solid rgba(59, 130, 246, 0.5)',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Plan Details Table */}
      <Card className="bg-blue-800/30 backdrop-blur-sm border-blue-700/50">
        <CardHeader>
          <CardTitle className="text-white">Plan Performance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-blue-700/50">
                  <th className="text-left text-blue-200 font-medium py-3 px-4">Plan</th>
                  <th className="text-right text-blue-200 font-medium py-3 px-4">Total Signups</th>
                  <th className="text-right text-blue-200 font-medium py-3 px-4">Percentage</th>
                  <th className="text-right text-blue-200 font-medium py-3 px-4">Daily Average</th>
                </tr>
              </thead>
              <tbody>
                {planSummaries.map((plan) => (
                  <tr key={plan.plan} className="border-b border-blue-700/30">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: plan.color }}
                        ></div>
                        <span className="text-white font-medium">{plan.plan}</span>
                      </div>
                    </td>
                    <td className="text-right text-white py-3 px-4">{plan.total}</td>
                    <td className="text-right text-blue-200 py-3 px-4">{plan.percentage}%</td>
                    <td className="text-right text-blue-200 py-3 px-4">
                      {Math.round(plan.total / filteredData.length)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
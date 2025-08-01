import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  UserPlus, 
  Calendar,
  RefreshCw,
  Download
} from 'lucide-react';

interface SignupData {
  date: string;
  signups: number;
  trials: number;
  demos: number;
  conversions: number;
}

interface SignupMetrics {
  totalSignups: number;
  todaySignups: number;
  weeklyGrowth: number;
  conversionRate: number;
  averageDaily: number;
}

const SignupGraph: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [isLoading, setIsLoading] = useState(false);
  const [signupData, setSignupData] = useState<SignupData[]>([]);
  const [metrics, setMetrics] = useState<SignupMetrics>({
    totalSignups: 0,
    todaySignups: 0,
    weeklyGrowth: 0,
    conversionRate: 0,
    averageDaily: 0
  });

  // Generate sample data for demonstration
  const generateSampleData = (days: number): SignupData[] => {
    const data: SignupData[] = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const baseSignups = Math.floor(Math.random() * 15) + 5;
      const trials = Math.floor(baseSignups * 0.7);
      const demos = baseSignups - trials;
      const conversions = Math.floor(baseSignups * 0.2);
      
      data.push({
        date: date.toISOString().split('T')[0],
        signups: baseSignups,
        trials,
        demos,
        conversions
      });
    }
    
    return data;
  };

  const calculateMetrics = (data: SignupData[]): SignupMetrics => {
    const totalSignups = data.reduce((sum, day) => sum + day.signups, 0);
    const todaySignups = data[data.length - 1]?.signups || 0;
    const lastWeekSignups = data.slice(-7).reduce((sum, day) => sum + day.signups, 0);
    const previousWeekSignups = data.slice(-14, -7).reduce((sum, day) => sum + day.signups, 0);
    const weeklyGrowth = previousWeekSignups > 0 
      ? ((lastWeekSignups - previousWeekSignups) / previousWeekSignups) * 100 
      : 0;
    
    const totalConversions = data.reduce((sum, day) => sum + day.conversions, 0);
    const conversionRate = totalSignups > 0 ? (totalConversions / totalSignups) * 100 : 0;
    const averageDaily = totalSignups / data.length;

    return {
      totalSignups,
      todaySignups,
      weeklyGrowth,
      conversionRate,
      averageDaily
    };
  };

  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
      const data = generateSampleData(days);
      setSignupData(data);
      setMetrics(calculateMetrics(data));
      setIsLoading(false);
    }, 500);
  }, [timeframe]);

  const maxSignups = Math.max(...signupData.map(d => d.signups));

  const exportData = () => {
    const csvContent = [
      'Date,Total Signups,Trials,Demos,Conversions',
      ...signupData.map(d => `${d.date},${d.signups},${d.trials},${d.demos},${d.conversions}`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signup-data-${timeframe}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Signup Analytics</h2>
          <p className="text-blue-200">Track trial signups and demo requests over time</p>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <div className="flex gap-1">
            {(['7d', '30d', '90d'] as const).map((period) => (
              <Button
                key={period}
                variant={timeframe === period ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe(period)}
                className={timeframe === period 
                  ? "bg-blue-600 text-white" 
                  : "border-blue-400 text-blue-200 /20"
                }
              >
                {period === '7d' ? '7 Days' : period === '30d' ? '30 Days' : '90 Days'}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            disabled={isLoading}
            className="border-blue-400 text-blue-200 /20"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={exportData}
            className="border-blue-400 text-blue-200 /20"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-black/20 border-blue-400/30 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-200 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total Signups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.totalSignups}</div>
            <p className="text-xs text-blue-300 mt-1">
              Last {timeframe === '7d' ? '7' : timeframe === '30d' ? '30' : '90'} days
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-blue-400/30 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-200 flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.todaySignups}</div>
            <p className="text-xs text-blue-300 mt-1">New signups today</p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-blue-400/30 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-200 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Weekly Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {metrics.weeklyGrowth > 0 ? '+' : ''}{metrics.weeklyGrowth.toFixed(1)}%
            </div>
            <p className="text-xs text-blue-300 mt-1">Week over week</p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-blue-400/30 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-200 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-blue-300 mt-1">Trial to paid</p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-blue-400/30 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-200 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Daily Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.averageDaily.toFixed(1)}</div>
            <p className="text-xs text-blue-300 mt-1">Signups per day</p>
          </CardContent>
        </Card>
      </div>

      {/* Signup Chart */}
      <Card className="bg-black/20 border-blue-400/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Signup Trend
          </CardTitle>
          <CardDescription className="text-blue-200">
            Daily breakdown of trials and demo requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-blue-200">Loading chart data...</div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Simple bar chart */}
              <div className="flex items-end gap-1 h-48 overflow-x-auto pb-4">
                {signupData.map((day, index) => (
                  <div key={day.date} className="flex flex-col items-center group min-w-[40px]">
                    {/* Bars */}
                    <div className="flex flex-col items-center space-y-1 mb-2">
                      {/* Total signups bar */}
                      <div 
                        className="w-8 bg-blue-500 rounded-t  group-hover:bg-blue-400"
                        style={{ 
                          height: `${(day.signups / maxSignups) * 120}px`,
                          minHeight: '4px'
                        }}
                        title={`${day.signups} total signups`}
                      />
                      
                      {/* Conversion indicator */}
                      {day.conversions > 0 && (
                        <div 
                          className="w-6 bg-emerald-500 rounded"
                          style={{ 
                            height: `${(day.conversions / maxSignups) * 40}px`,
                            minHeight: '2px'
                          }}
                          title={`${day.conversions} conversions`}
                        />
                      )}
                    </div>
                    
                    {/* Date label */}
                    <div className="text-xs text-blue-300 transform -rotate-45 origin-top-left mt-2">
                      {new Date(day.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Legend */}
              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-blue-200">Total Signups</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded"></div>
                  <span className="text-blue-200">Conversions</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-black/20 border-blue-400/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Recent Signups</CardTitle>
          <CardDescription className="text-blue-200">
            Latest trial and demo requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {signupData.slice(-7).reverse().map((day, index) => (
              <div key={day.date} className="flex items-center justify-between p-3 bg-blue-900/20 rounded-lg border border-blue-700/30">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-medium">
                    {new Date(day.date).toLocaleDateString('en-US', { 
                      weekday: 'short',
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-blue-600/30 text-blue-200">
                      {day.trials} trials
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-600/30 text-purple-200">
                      {day.demos} demos
                    </Badge>
                    {day.conversions > 0 && (
                      <Badge variant="secondary" className="bg-emerald-600/30 text-emerald-200">
                        {day.conversions} conversions
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">{day.signups}</div>
                    <div className="text-xs text-blue-300">total</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupGraph;
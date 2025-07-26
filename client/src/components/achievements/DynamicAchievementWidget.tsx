import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Award, 
  Trophy, 
  Star, 
  TrendingUp,
  Crown,
  Medal,
  Target,
  ChevronRight,
  Zap,
  Clock,
  Activity,
  Users,
  Settings,
  RefreshCw,
  Calendar
} from 'lucide-react';
import { Achievement, UserStats } from '@/types/achievements';
import { dynamicAchievementService } from '@/lib/dynamic-achievements';
import { useToast } from '@/hooks/use-toast';

interface DynamicAchievementWidgetProps {
  isSmall?: boolean;
}

const tierColors = {
  bronze: 'from-amber-600 to-amber-700',
  silver: 'from-blue-300 to-blue-400',
  gold: 'from-yellow-400 to-yellow-500',
  platinum: 'from-purple-400 to-purple-500'
};

const tierIcons = {
  bronze: <Medal className="w-4 h-4" />,
  silver: <Award className="w-4 h-4" />,
  gold: <Trophy className="w-4 h-4" />,
  platinum: <Crown className="w-4 h-4" />
};

export default function DynamicAchievementWidget({ isSmall = false }: DynamicAchievementWidgetProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 0,
    unlockedBadges: 0,
    completedTrainings: 0,
    complianceStreak: 0,
    safetyScore: 0,
    teamLeadership: 0,
    engagementLevel: 0
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadAchievements();
    
    // Listen for achievement unlocks
    const handleAchievementUnlocked = (event: CustomEvent) => {
      loadAchievements();
    };
    
    window.addEventListener('achievement-unlocked', handleAchievementUnlocked as EventListener);
    
    return () => {
      window.removeEventListener('achievement-unlocked', handleAchievementUnlocked as EventListener);
    };
  }, []);

  const loadAchievements = () => {
    const allAchievements = dynamicAchievementService.getAllAchievements();
    const stats = dynamicAchievementService.getUserStats();
    
    setAchievements(allAchievements);
    setUserStats(stats);
  };

  const refreshAchievements = async () => {
    setIsRefreshing(true);
    
    // Simulate some user activity to trigger achievement checks
    setTimeout(() => {
      loadAchievements();
      setIsRefreshing(false);
      toast({
        title: "Achievements refreshed",
        description: "Your progress has been updated",
      });
    }, 500);
  };

  const simulateActivity = () => {
    // Simulate various activities for demo purposes
    const activities = [
      { type: 'login' as const, data: { timestamp: new Date() } },
      { type: 'widget_customized' as const, data: { widgetId: 'achievements' } },
      { type: 'report_generated' as const, data: { reportType: 'compliance' } },
      { type: 'training_completed' as const, data: { trainingId: 'safety-101' } },
      { type: 'team_interaction' as const, data: { action: 'helped_colleague' } }
    ];

    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    dynamicAchievementService.trackMilestone(randomActivity.type, randomActivity.data);
    
    // Update stats to trigger more achievements
    dynamicAchievementService.updateUserStats({
      completedTrainings: userStats.completedTrainings + 1,
      complianceStreak: userStats.complianceStreak + 1,
      safetyScore: Math.min(100, userStats.safetyScore + 2),
      engagementLevel: Math.min(100, userStats.engagementLevel + 5)
    });
    
    loadAchievements();
  };

  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const nextAchievements = achievements
    .filter(a => !a.isUnlocked && a.progress > 0)
    .sort((a, b) => (b.progress / b.maxProgress) - (a.progress / a.maxProgress));
  const recentUnlocks = unlockedAchievements
    .filter(a => a.unlockedAt)
    .sort((a, b) => b.unlockedAt!.getTime() - a.unlockedAt!.getTime())
    .slice(0, 3);

  if (isSmall) {
    return (
      <div className="h-full p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Dynamic Achievements</h3>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshAchievements}
              disabled={isRefreshing}
              className="text-emerald-400 hover:text-emerald-300 p-1 h-auto"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Award className="w-4 h-4 text-yellow-500" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-blue-700/30 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-yellow-400">{userStats.totalPoints}</div>
            <div className="text-xs text-blue-300">Points</div>
          </div>
          <div className="bg-blue-700/30 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-emerald-400">{userStats.unlockedBadges}</div>
            <div className="text-xs text-blue-300">Badges</div>
          </div>
        </div>

        {nextAchievements.length > 0 && (
          <div className="bg-blue-700/30 rounded-lg p-2">
            <div className="flex items-center gap-2 mb-1">
              <div className={`p-1 rounded-full bg-gradient-to-r ${tierColors[nextAchievements[0].tier]} opacity-70`}>
                {nextAchievements[0].icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-white font-medium truncate">{nextAchievements[0].title}</div>
                <div className="text-xs text-blue-300">
                  {nextAchievements[0].progress}/{nextAchievements[0].maxProgress}
                </div>
              </div>
            </div>
            <Progress 
              value={(nextAchievements[0].progress / nextAchievements[0].maxProgress) * 100} 
              className="h-1"
            />
          </div>
        )}

        <Button
          onClick={simulateActivity}
          size="sm"
          className="w-full text-xs bg-emerald-600 hover:bg-emerald-700"
        >
          <Activity className="w-3 h-3 mr-1" />
          Simulate Activity
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Dynamic Achievements</h3>
        <div className="flex items-center gap-2">
          <Button
            onClick={simulateActivity}
            size="sm"
            className="text-xs bg-blue-600 hover:bg-blue-700"
          >
            <Activity className="w-3 h-3 mr-1" />
            Test Activity
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={refreshAchievements}
            disabled={isRefreshing}
            className="text-emerald-400 hover:text-emerald-300 p-1"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-blue-700/30 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <div className="text-lg font-bold text-yellow-400">{userStats.totalPoints}</div>
          </div>
          <div className="text-xs text-blue-300">Total Points</div>
        </div>
        <div className="bg-blue-700/30 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Award className="w-4 h-4 text-emerald-500" />
            <div className="text-lg font-bold text-emerald-400">{userStats.unlockedBadges}</div>
          </div>
          <div className="text-xs text-blue-300">Badges</div>
        </div>
        <div className="bg-blue-700/30 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Target className="w-4 h-4 text-blue-500" />
            <div className="text-lg font-bold text-blue-400">{userStats.complianceStreak}</div>
          </div>
          <div className="text-xs text-blue-300">Day Streak</div>
        </div>
      </div>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-blue-700/30">
          <TabsTrigger value="recent" className="text-xs">Recent</TabsTrigger>
          <TabsTrigger value="progress" className="text-xs">Progress</TabsTrigger>
          <TabsTrigger value="unlocked" className="text-xs">Unlocked</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-2">
          <h4 className="text-sm font-medium text-white">Recent Unlocks</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {recentUnlocks.length > 0 ? (
              recentUnlocks.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 p-2 bg-blue-700/30 rounded-lg">
                  <div className={`p-1.5 rounded-full bg-gradient-to-r ${tierColors[achievement.tier]}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-white truncate">{achievement.title}</div>
                      {tierIcons[achievement.tier]}
                    </div>
                    <div className="text-xs text-emerald-400">+{achievement.points} points</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-blue-300 text-sm py-4">
                No recent unlocks. Start using the platform to earn achievements!
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-2">
          <h4 className="text-sm font-medium text-white">Next Achievements</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {nextAchievements.length > 0 ? (
              nextAchievements.slice(0, 3).map((achievement) => (
                <div key={achievement.id} className="bg-blue-700/30 rounded-lg p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`p-1 rounded-full bg-gradient-to-r ${tierColors[achievement.tier]} opacity-70`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-white font-medium truncate">{achievement.title}</div>
                      <div className="text-xs text-blue-300">
                        {achievement.progress}/{achievement.maxProgress}
                      </div>
                    </div>
                  </div>
                  <Progress 
                    value={(achievement.progress / achievement.maxProgress) * 100} 
                    className="h-1"
                  />
                </div>
              ))
            ) : (
              <div className="text-center text-blue-300 text-sm py-4">
                All achievements completed! 🎉
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="unlocked" className="space-y-2">
          <h4 className="text-sm font-medium text-white">Unlocked ({unlockedAchievements.length})</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {unlockedAchievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center gap-3 p-2 bg-blue-700/30 rounded-lg">
                <div className={`p-1.5 rounded-full bg-gradient-to-r ${tierColors[achievement.tier]}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-white truncate">{achievement.title}</div>
                    {tierIcons[achievement.tier]}
                  </div>
                  <div className="text-xs text-emerald-400">+{achievement.points} points</div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
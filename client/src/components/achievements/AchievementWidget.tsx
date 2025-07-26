import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Award, 
  Trophy, 
  Star, 
  TrendingUp,
  Crown,
  Medal,
  Target,
  ChevronRight
} from 'lucide-react';

interface AchievementWidgetProps {
  isSmall?: boolean;
}

const achievements = [
  {
    id: 'training-streak',
    title: 'Learning Momentum',
    description: 'Complete 5 trainings in a row',
    progress: 5,
    maxProgress: 5,
    isUnlocked: true,
    tier: 'silver' as const,
    points: 250,
    icon: <TrendingUp className="w-5 h-5" />
  },
  {
    id: 'safety-awareness',
    title: 'Safety Awareness',
    description: 'Achieve 90% safety score',
    progress: 94,
    maxProgress: 90,
    isUnlocked: true,
    tier: 'silver' as const,
    points: 200,
    icon: <Target className="w-5 h-5" />
  },
  {
    id: 'compliance-champion',
    title: 'Compliance Champion',
    description: 'Maintain perfect compliance for 90 days',
    progress: 45,
    maxProgress: 90,
    isUnlocked: false,
    tier: 'gold' as const,
    points: 750,
    icon: <Trophy className="w-5 h-5" />
  }
];

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

export default function AchievementWidget({ isSmall = false }: AchievementWidgetProps) {
  const [selectedAchievement, setSelectedAchievement] = useState(0);
  
  const userStats = {
    totalPoints: 2450,
    unlockedBadges: 12,
    complianceStreak: 45,
    nextAchievement: achievements.find(a => !a.isUnlocked)
  };

  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const nextAchievement = achievements.find(a => !a.isUnlocked);

  if (isSmall) {
    return (
      <div className="h-full p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Achievements</h3>
          <Award className="w-4 h-4 text-yellow-500" />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-blue-700/30 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-yellow-400">{userStats.totalPoints}</div>
            <div className="text-xs text-white">Points</div>
          </div>
          <div className="bg-blue-700/30 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-violet-400">{userStats.unlockedBadges}</div>
            <div className="text-xs text-white">Badges</div>
          </div>
        </div>

        {nextAchievement && (
          <div className="bg-blue-700/30 rounded-lg p-2">
            <div className="flex items-center gap-2 mb-1">
              <div className={`p-1 rounded-full bg-gradient-to-r ${tierColors[nextAchievement.tier]} opacity-70`}>
                {nextAchievement.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-white font-medium truncate">{nextAchievement.title}</div>
                <div className="text-xs text-white">
                  {nextAchievement.progress}/{nextAchievement.maxProgress}
                </div>
              </div>
            </div>
            <Progress 
              value={(nextAchievement.progress / nextAchievement.maxProgress) * 100} 
              className="h-1"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Achievement Progress</h3>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-violet-400 hover:text-emerald-300 p-1"
          onClick={() => {/* Navigate to full achievements page */}}
        >
          View All <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-blue-700/30 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <div className="text-lg font-bold text-yellow-400">{userStats.totalPoints}</div>
          </div>
          <div className="text-xs text-white">Total Points</div>
        </div>
        <div className="bg-blue-700/30 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Award className="w-4 h-4 text-emerald-500" />
            <div className="text-lg font-bold text-violet-400">{userStats.unlockedBadges}</div>
          </div>
          <div className="text-xs text-white">Badges</div>
        </div>
        <div className="bg-blue-700/30 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Target className="w-4 h-4 text-blue-500" />
            <div className="text-lg font-bold text-blue-400">{userStats.complianceStreak}</div>
          </div>
          <div className="text-xs text-white">Day Streak</div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-white">Recent Achievements</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {unlockedAchievements.slice(0, 3).map((achievement) => (
            <div key={achievement.id} className="flex items-center gap-3 p-2 bg-blue-700/30 rounded-lg">
              <div className={`p-1.5 rounded-full bg-gradient-to-r ${tierColors[achievement.tier]}`}>
                {achievement.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-white truncate">{achievement.title}</div>
                  {tierIcons[achievement.tier]}
                </div>
                <div className="text-xs text-violet-400">+{achievement.points} points</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Achievement */}
      {nextAchievement && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white">Next Achievement</h4>
          <div className="bg-blue-700/30 rounded-lg p-3">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-1.5 rounded-full bg-gradient-to-r ${tierColors[nextAchievement.tier]} opacity-70`}>
                {nextAchievement.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white">{nextAchievement.title}</div>
                <div className="text-xs text-white">{nextAchievement.description}</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white">Progress</span>
                <span className="text-white">{nextAchievement.progress} / {nextAchievement.maxProgress}</span>
              </div>
              <Progress 
                value={(nextAchievement.progress / nextAchievement.maxProgress) * 100} 
                className="h-1.5"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
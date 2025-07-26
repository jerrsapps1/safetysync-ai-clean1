import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Award, 
  Trophy, 
  Star, 
  Target, 
  CheckCircle,
  Clock,
  Users,
  Shield,
  Brain,
  Zap,
  Crown,
  Medal,
  TrendingUp,
  Calendar,
  BookOpen,
  Activity,
  Lock,
  Sparkles
} from 'lucide-react';
import { SafetySyncIcon } from '@/components/ui/safetysync-icon';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'training' | 'compliance' | 'safety' | 'engagement' | 'leadership';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  points: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  requirements: string[];
}

interface UserStats {
  totalPoints: number;
  unlockedBadges: number;
  completedTrainings: number;
  complianceStreak: number;
  safetyScore: number;
  teamLeadership: number;
  engagementLevel: number;
}

const achievementCategories = [
  { id: 'training', name: 'Training Excellence', icon: <BookOpen className="w-5 h-5" />, color: 'bg-blue-500' },
  { id: 'compliance', name: 'Compliance Master', icon: <Shield className="w-5 h-5" />, color: 'bg-green-500' },
  { id: 'safety', name: 'Safety Champion', icon: <SafetySyncIcon size={20} />, color: 'bg-violet-500' },
  { id: 'engagement', name: 'Team Engagement', icon: <Users className="w-5 h-5" />, color: 'bg-purple-500' },
  { id: 'leadership', name: 'Leadership', icon: <Crown className="w-5 h-5" />, color: 'bg-amber-500' }
];

const tierColors = {
  bronze: 'bg-gradient-to-r from-amber-600 to-amber-700',
  silver: 'bg-gradient-to-r from-blue-300 to-blue-400',
  gold: 'bg-gradient-to-r from-yellow-400 to-yellow-500',
  platinum: 'bg-gradient-to-r from-purple-400 to-purple-500'
};

const tierIcons = {
  bronze: <Medal className="w-4 h-4" />,
  silver: <Award className="w-4 h-4" />,
  gold: <Trophy className="w-4 h-4" />,
  platinum: <Crown className="w-4 h-4" />
};

export default function AchievementBadges() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 2450,
    unlockedBadges: 12,
    completedTrainings: 8,
    complianceStreak: 45,
    safetyScore: 94,
    teamLeadership: 6,
    engagementLevel: 85
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    // Training Excellence
    {
      id: 'first-training',
      title: 'First Steps',
      description: 'Complete your first safety training',
      icon: <BookOpen className="w-6 h-6" />,
      category: 'training',
      tier: 'bronze',
      points: 100,
      isUnlocked: true,
      unlockedAt: new Date('2024-12-01'),
      progress: 1,
      maxProgress: 1,
      requirements: ['Complete any safety training course']
    },
    {
      id: 'training-streak',
      title: 'Learning Momentum',
      description: 'Complete 5 trainings in a row',
      icon: <TrendingUp className="w-6 h-6" />,
      category: 'training',
      tier: 'silver',
      points: 250,
      isUnlocked: true,
      unlockedAt: new Date('2024-12-10'),
      progress: 5,
      maxProgress: 5,
      requirements: ['Complete 5 consecutive training sessions']
    },
    {
      id: 'training-master',
      title: 'Training Master',
      description: 'Complete 10 different training courses',
      icon: <Brain className="w-6 h-6" />,
      category: 'training',
      tier: 'gold',
      points: 500,
      isUnlocked: false,
      progress: 8,
      maxProgress: 10,
      requirements: ['Complete 10 different training courses', 'Achieve 85% average score']
    },
    // Compliance Master
    {
      id: 'compliance-keeper',
      title: 'Compliance Keeper',
      description: 'Maintain 100% compliance for 30 days',
      icon: <Shield className="w-6 h-6" />,
      category: 'compliance',
      tier: 'bronze',
      points: 150,
      isUnlocked: true,
      unlockedAt: new Date('2024-11-15'),
      progress: 30,
      maxProgress: 30,
      requirements: ['Maintain 100% compliance for 30 consecutive days']
    },
    {
      id: 'compliance-champion',
      title: 'Compliance Champion',
      description: 'Maintain perfect compliance for 90 days',
      icon: <CheckCircle className="w-6 h-6" />,
      category: 'compliance',
      tier: 'gold',
      points: 750,
      isUnlocked: false,
      progress: 45,
      maxProgress: 90,
      requirements: ['Maintain 100% compliance for 90 consecutive days', 'No violations or incidents']
    },
    // Safety Champion
    {
      id: 'safety-awareness',
      title: 'Safety Awareness',
      description: 'Achieve 90% safety score',
      icon: <SafetySyncIcon size={24} />,
      category: 'safety',
      tier: 'silver',
      points: 200,
      isUnlocked: true,
      unlockedAt: new Date('2024-12-05'),
      progress: 94,
      maxProgress: 90,
      requirements: ['Achieve 90% or higher safety score']
    },
    {
      id: 'incident-free',
      title: 'Incident Free',
      description: '180 days without any safety incidents',
      icon: <Activity className="w-6 h-6" />,
      category: 'safety',
      tier: 'platinum',
      points: 1000,
      isUnlocked: false,
      progress: 127,
      maxProgress: 180,
      requirements: ['180 consecutive days without incidents', 'Maintain 95% safety score']
    },
    // Team Engagement
    {
      id: 'team-player',
      title: 'Team Player',
      description: 'Help 5 colleagues with safety questions',
      icon: <Users className="w-6 h-6" />,
      category: 'engagement',
      tier: 'bronze',
      points: 125,
      isUnlocked: true,
      unlockedAt: new Date('2024-11-20'),
      progress: 5,
      maxProgress: 5,
      requirements: ['Assist 5 colleagues with safety-related questions']
    },
    {
      id: 'mentor',
      title: 'Safety Mentor',
      description: 'Train 3 new employees',
      icon: <Star className="w-6 h-6" />,
      category: 'engagement',
      tier: 'gold',
      points: 400,
      isUnlocked: false,
      progress: 2,
      maxProgress: 3,
      requirements: ['Successfully train 3 new employees', 'Receive positive feedback']
    },
    // Leadership
    {
      id: 'team-leader',
      title: 'Team Leader',
      description: 'Lead a safety improvement initiative',
      icon: <Crown className="w-6 h-6" />,
      category: 'leadership',
      tier: 'silver',
      points: 300,
      isUnlocked: true,
      unlockedAt: new Date('2024-12-12'),
      progress: 1,
      maxProgress: 1,
      requirements: ['Lead a successful safety improvement initiative']
    },
    {
      id: 'culture-champion',
      title: 'Culture Champion',
      description: 'Improve team safety culture score by 20%',
      icon: <Sparkles className="w-6 h-6" />,
      category: 'leadership',
      tier: 'platinum',
      points: 800,
      isUnlocked: false,
      progress: 15,
      maxProgress: 20,
      requirements: ['Improve team safety culture by 20%', 'Maintain for 60 days']
    }
  ]);

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const lockedAchievements = achievements.filter(a => !a.isUnlocked);

  const getCategoryStats = (category: string) => {
    const categoryAchievements = achievements.filter(a => a.category === category);
    const unlocked = categoryAchievements.filter(a => a.isUnlocked).length;
    const total = categoryAchievements.length;
    return { unlocked, total, percentage: (unlocked / total) * 100 };
  };

  const getNextAchievement = () => {
    return lockedAchievements
      .filter(a => a.progress > 0)
      .sort((a, b) => (b.progress / b.maxProgress) - (a.progress / a.maxProgress))[0];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-black/20 backdrop-blur-sm border-blue-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">Total Points</p>
                <p className="text-2xl font-bold text-white">{userStats.totalPoints.toLocaleString()}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/20 backdrop-blur-sm border-blue-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">Badges Earned</p>
                <p className="text-2xl font-bold text-white">{userStats.unlockedBadges}</p>
              </div>
              <Award className="w-8 h-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/20 backdrop-blur-sm border-blue-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">Compliance Streak</p>
                <p className="text-2xl font-bold text-white">{userStats.complianceStreak} days</p>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/20 backdrop-blur-sm border-blue-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">Safety Score</p>
                <p className="text-2xl font-bold text-white">{userStats.safetyScore}%</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Achievement Progress */}
      {getNextAchievement() && (
        <Card className="bg-black/20 backdrop-blur-sm border-blue-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Next Achievement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${tierColors[getNextAchievement()!.tier]}`}>
                {getNextAchievement()!.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium">{getNextAchievement()!.title}</h3>
                <p className="text-white text-sm">{getNextAchievement()!.description}</p>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-white">Progress</span>
                    <span className="text-white">
                      {getNextAchievement()!.progress} / {getNextAchievement()!.maxProgress}
                    </span>
                  </div>
                  <Progress 
                    value={(getNextAchievement()!.progress / getNextAchievement()!.maxProgress) * 100} 
                    className="h-2"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Filters */}
      <Card className="bg-black/20 backdrop-blur-sm border-blue-700">
        <CardHeader>
          <CardTitle className="text-white">Achievement Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className={selectedCategory === 'all' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-700/50 text-white border-blue-500 hover:bg-blue-700'}
            >
              All Categories
            </Button>
            {achievementCategories.map(category => {
              const stats = getCategoryStats(category.id);
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-700/50 text-white border-blue-500 hover:bg-blue-700'}
                >
                  {category.icon}
                  <span className="ml-2">{category.name}</span>
                  <Badge className="ml-2 bg-blue-600 text-white">
                    {stats.unlocked}/{stats.total}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map(achievement => (
          <Card 
            key={achievement.id} 
            className={`bg-black/20 backdrop-blur-sm border-blue-700 cursor-pointer transition-all duration-200 hover:scale-105 ${
              achievement.isUnlocked ? 'border-violet-500/50' : 'border-blue-600'
            }`}
            onClick={() => setSelectedAchievement(achievement)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${
                  achievement.isUnlocked 
                    ? tierColors[achievement.tier]
                    : 'bg-blue-600'
                } ${!achievement.isUnlocked && 'opacity-50'}`}>
                  {achievement.isUnlocked ? achievement.icon : <Lock className="w-6 h-6" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-medium ${achievement.isUnlocked ? 'text-white' : 'text-white'}`}>
                      {achievement.title}
                    </h3>
                    {tierIcons[achievement.tier]}
                  </div>
                  <p className="text-white text-sm mb-2">{achievement.description}</p>
                  
                  {achievement.isUnlocked ? (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-violet-500/20 text-emerald-300 border-violet-500/30">
                        Unlocked
                      </Badge>
                      <span className="text-yellow-500 text-sm">+{achievement.points} pts</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white">Progress</span>
                        <span className="text-white">{achievement.progress} / {achievement.maxProgress}</span>
                      </div>
                      <Progress 
                        value={(achievement.progress / achievement.maxProgress) * 100} 
                        className="h-1.5"
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievement Details Dialog */}
      <Dialog open={!!selectedAchievement} onOpenChange={() => setSelectedAchievement(null)}>
        <DialogContent className="bg-blue-800 border-blue-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Achievement Details</DialogTitle>
          </DialogHeader>
          {selectedAchievement && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-full ${
                  selectedAchievement.isUnlocked 
                    ? tierColors[selectedAchievement.tier]
                    : 'bg-blue-600'
                }`}>
                  {selectedAchievement.isUnlocked ? selectedAchievement.icon : <Lock className="w-8 h-8" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedAchievement.title}</h3>
                  <p className="text-white">{selectedAchievement.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-white">Category</p>
                  <Badge className="bg-blue-600 text-white capitalize">
                    {selectedAchievement.category}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-white">Tier</p>
                  <Badge className={`${tierColors[selectedAchievement.tier]} text-white capitalize`}>
                    {selectedAchievement.tier}
                  </Badge>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-white mb-2">Points Reward</p>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-white font-medium">+{selectedAchievement.points} points</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-white mb-2">Requirements</p>
                <ul className="space-y-1">
                  {selectedAchievement.requirements.map((req, index) => (
                    <li key={index} className="text-sm text-white flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
              
              {selectedAchievement.isUnlocked && selectedAchievement.unlockedAt && (
                <div>
                  <p className="text-sm text-white mb-1">Unlocked On</p>
                  <p className="text-violet-400 font-medium">
                    {formatDate(selectedAchievement.unlockedAt)}
                  </p>
                </div>
              )}
              
              {!selectedAchievement.isUnlocked && (
                <div>
                  <p className="text-sm text-white mb-2">Progress</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white">
                        {selectedAchievement.progress} / {selectedAchievement.maxProgress}
                      </span>
                      <span className="text-white">
                        {Math.round((selectedAchievement.progress / selectedAchievement.maxProgress) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={(selectedAchievement.progress / selectedAchievement.maxProgress) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
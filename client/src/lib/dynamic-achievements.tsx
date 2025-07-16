import { Achievement, UserStats, MilestoneEvent } from '@/types/achievements';
import { 
  Star, 
  Trophy, 
  Activity, 
  Award, 
  Settings, 
  TrendingUp, 
  Users, 
  Shield, 
  Target, 
  Zap,
  Crown,
  Brain,
  BookOpen,
  Calendar,
  FileText,
  CheckCircle
} from 'lucide-react';

export class DynamicAchievementService {
  private achievements: Achievement[] = [];
  private userStats: UserStats = {
    totalPoints: 0,
    unlockedBadges: 0,
    completedTrainings: 0,
    complianceStreak: 0,
    safetyScore: 75,
    teamLeadership: 0,
    engagementLevel: 0
  };
  private milestones: MilestoneEvent[] = [];
  
  constructor() {
    this.initializeAchievements();
    this.loadPersistedData();
  }

  private initializeAchievements(): void {
    this.achievements = [
      // Login & Engagement Achievements
      {
        id: 'first-login',
        title: 'Welcome Aboard',
        description: 'Complete your first login to SafetySync.AI',
        icon: <Star className="w-4 h-4" />,
        tier: 'bronze',
        category: 'engagement',
        points: 50,
        maxProgress: 1,
        progress: 0,
        isUnlocked: false,
        requirements: ['Complete first login'],
        unlockedAt: null
      },
      {
        id: 'early-adopter',
        title: 'Early Adopter',
        description: 'Login for 3 consecutive days',
        icon: <Trophy className="w-4 h-4" />,
        tier: 'silver',
        category: 'engagement',
        points: 150,
        maxProgress: 3,
        progress: 0,
        isUnlocked: false,
        requirements: ['Login for 3 consecutive days'],
        unlockedAt: null
      },
      {
        id: 'power-user',
        title: 'Power User',
        description: 'Navigate to 5 different dashboard tabs',
        icon: <Activity className="w-4 h-4" />,
        tier: 'gold',
        category: 'exploration',
        points: 200,
        maxProgress: 5,
        progress: 0,
        isUnlocked: false,
        requirements: ['Visit 5 different dashboard sections'],
        unlockedAt: null
      },
      {
        id: 'dashboard-customizer',
        title: 'Dashboard Customizer',
        description: 'Customize 3 different dashboard widgets',
        icon: <Settings className="w-4 h-4" />,
        tier: 'silver',
        category: 'customization',
        points: 100,
        maxProgress: 3,
        progress: 0,
        isUnlocked: false,
        requirements: ['Customize 3 dashboard widgets'],
        unlockedAt: null
      },
      {
        id: 'layout-designer',
        title: 'Layout Designer',
        description: 'Rearrange dashboard layout 5 times',
        icon: <Target className="w-4 h-4" />,
        tier: 'gold',
        category: 'customization',
        points: 175,
        maxProgress: 5,
        progress: 0,
        isUnlocked: false,
        requirements: ['Rearrange dashboard layout 5 times'],
        unlockedAt: null
      },
      {
        id: 'compliance-champion',
        title: 'Compliance Champion',
        description: 'Maintain 95% compliance score for 30 days',
        icon: <Shield className="w-4 h-4" />,
        tier: 'platinum',
        category: 'compliance',
        points: 500,
        maxProgress: 30,
        progress: 0,
        isUnlocked: false,
        requirements: ['Maintain 95% compliance score for 30 days'],
        unlockedAt: null
      },
      {
        id: 'training-master',
        title: 'Training Master',
        description: 'Complete 10 safety training modules',
        icon: <BookOpen className="w-4 h-4" />,
        tier: 'gold',
        category: 'training',
        points: 300,
        maxProgress: 10,
        progress: 0,
        isUnlocked: false,
        requirements: ['Complete 10 safety training modules'],
        unlockedAt: null
      },
      {
        id: 'report-generator',
        title: 'Report Generator',
        description: 'Generate 5 compliance reports',
        icon: <FileText className="w-4 h-4" />,
        tier: 'silver',
        category: 'reporting',
        points: 150,
        maxProgress: 5,
        progress: 0,
        isUnlocked: false,
        requirements: ['Generate 5 compliance reports'],
        unlockedAt: null
      },
      {
        id: 'team-leader',
        title: 'Team Leader',
        description: 'Help 5 team members with safety tasks',
        icon: <Users className="w-4 h-4" />,
        tier: 'gold',
        category: 'collaboration',
        points: 250,
        maxProgress: 5,
        progress: 0,
        isUnlocked: false,
        requirements: ['Help 5 team members with safety tasks'],
        unlockedAt: null
      },
      {
        id: 'consistency-keeper',
        title: 'Consistency Keeper',
        description: 'Use platform for 7 consecutive days',
        icon: <Calendar className="w-4 h-4" />,
        tier: 'silver',
        category: 'engagement',
        points: 200,
        maxProgress: 7,
        progress: 0,
        isUnlocked: false,
        requirements: ['Use platform for 7 consecutive days'],
        unlockedAt: null
      },
      {
        id: 'ai-explorer',
        title: 'AI Explorer',
        description: 'Use AI features 10 times',
        icon: <Brain className="w-4 h-4" />,
        tier: 'gold',
        category: 'ai',
        points: 225,
        maxProgress: 10,
        progress: 0,
        isUnlocked: false,
        requirements: ['Use AI features 10 times'],
        unlockedAt: null
      },
      {
        id: 'perfectionist',
        title: 'Perfectionist',
        description: 'Achieve 100% compliance score',
        icon: <Crown className="w-4 h-4" />,
        tier: 'platinum',
        category: 'compliance',
        points: 750,
        maxProgress: 1,
        progress: 0,
        isUnlocked: false,
        requirements: ['Achieve 100% compliance score'],
        unlockedAt: null
      }
    ];
  }

  private loadPersistedData(): void {
    try {
      const savedAchievements = localStorage.getItem('dynamic-achievements');
      const savedStats = localStorage.getItem('achievement-stats');
      const savedMilestones = localStorage.getItem('achievement-milestones');

      if (savedAchievements) {
        const parsedAchievements = JSON.parse(savedAchievements);
        // Merge saved progress with default achievements
        this.achievements = this.achievements.map(achievement => {
          const saved = parsedAchievements.find((a: Achievement) => a.id === achievement.id);
          if (saved) {
            return {
              ...achievement,
              progress: saved.progress,
              isUnlocked: saved.isUnlocked,
              unlockedAt: saved.unlockedAt ? new Date(saved.unlockedAt) : null
            };
          }
          return achievement;
        });
      }

      if (savedStats) {
        this.userStats = { ...this.userStats, ...JSON.parse(savedStats) };
      }

      if (savedMilestones) {
        this.milestones = JSON.parse(savedMilestones).map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
      }
    } catch (error) {
      console.error('Failed to load persisted achievement data:', error);
    }
  }

  private saveData(): void {
    try {
      localStorage.setItem('dynamic-achievements', JSON.stringify(this.achievements));
      localStorage.setItem('achievement-stats', JSON.stringify(this.userStats));
      localStorage.setItem('achievement-milestones', JSON.stringify(this.milestones));
    } catch (error) {
      console.error('Failed to save achievement data:', error);
    }
  }

  private dispatchAchievementEvent(achievement: Achievement): void {
    const event = new CustomEvent('achievement-unlocked', {
      detail: achievement
    });
    window.dispatchEvent(event);
  }

  public trackMilestone(eventType: MilestoneEvent['eventType'], data: any, userId: string = 'current-user'): Achievement[] {
    const milestone: MilestoneEvent = {
      id: Date.now().toString(),
      eventType,
      data,
      userId,
      timestamp: new Date()
    };

    this.milestones.push(milestone);
    
    // Check for achievements
    const newAchievements = this.checkAchievements(eventType, data);
    
    // Save data
    this.saveData();
    
    return newAchievements;
  }

  private checkAchievements(eventType: MilestoneEvent['eventType'], data: any): Achievement[] {
    const newlyUnlocked: Achievement[] = [];

    this.achievements.forEach(achievement => {
      if (achievement.isUnlocked) return;

      let shouldProgress = false;
      let progressIncrement = 0;

      switch (achievement.id) {
        case 'first-login':
          if (eventType === 'login') {
            shouldProgress = true;
            progressIncrement = 1;
          }
          break;

        case 'early-adopter':
          if (eventType === 'login') {
            const loginDays = this.milestones.filter(m => m.eventType === 'login').length;
            achievement.progress = Math.min(loginDays, achievement.maxProgress);
          }
          break;

        case 'power-user':
          if (eventType === 'tab_navigation') {
            const uniqueTabs = new Set(
              this.milestones
                .filter(m => m.eventType === 'tab_navigation')
                .map(m => m.data.tabName)
            );
            achievement.progress = Math.min(uniqueTabs.size, achievement.maxProgress);
          }
          break;

        case 'dashboard-customizer':
          if (eventType === 'widget_customized') {
            const customizations = this.milestones.filter(m => m.eventType === 'widget_customized').length;
            achievement.progress = Math.min(customizations, achievement.maxProgress);
          }
          break;

        case 'layout-designer':
          if (eventType === 'widget_customized' && data.action === 'layout_change') {
            const layoutChanges = this.milestones.filter(m => 
              m.eventType === 'widget_customized' && m.data.action === 'layout_change'
            ).length;
            achievement.progress = Math.min(layoutChanges, achievement.maxProgress);
          }
          break;

        case 'compliance-champion':
          if (this.userStats.safetyScore >= 95) {
            shouldProgress = true;
            progressIncrement = 1;
          }
          break;

        case 'training-master':
          if (eventType === 'training_completed') {
            shouldProgress = true;
            progressIncrement = 1;
          }
          break;

        case 'report-generator':
          if (eventType === 'report_generated') {
            shouldProgress = true;
            progressIncrement = 1;
          }
          break;

        case 'team-leader':
          if (eventType === 'team_interaction') {
            shouldProgress = true;
            progressIncrement = 1;
          }
          break;

        case 'consistency-keeper':
          if (eventType === 'login') {
            const loginDays = this.milestones.filter(m => m.eventType === 'login').length;
            achievement.progress = Math.min(loginDays, achievement.maxProgress);
          }
          break;

        case 'ai-explorer':
          if (eventType === 'ai_interaction') {
            shouldProgress = true;
            progressIncrement = 1;
          }
          break;

        case 'perfectionist':
          if (this.userStats.safetyScore >= 100) {
            shouldProgress = true;
            progressIncrement = 1;
          }
          break;
      }

      if (shouldProgress) {
        achievement.progress = Math.min(achievement.progress + progressIncrement, achievement.maxProgress);
      }

      // Check if achievement is now unlocked
      if (achievement.progress >= achievement.maxProgress && !achievement.isUnlocked) {
        achievement.isUnlocked = true;
        achievement.unlockedAt = new Date();
        
        // Update user stats
        this.userStats.totalPoints += achievement.points;
        this.userStats.unlockedBadges += 1;
        
        newlyUnlocked.push(achievement);
        
        // Dispatch achievement event
        this.dispatchAchievementEvent(achievement);
      }
    });

    return newlyUnlocked;
  }

  public updateUserStats(newStats: Partial<UserStats>): void {
    this.userStats = { ...this.userStats, ...newStats };
    this.saveData();
  }

  public getAllAchievements(): Achievement[] {
    return this.achievements;
  }

  public getUserStats(): UserStats {
    return this.userStats;
  }

  public getAchievementsByCategory(category: string): Achievement[] {
    return this.achievements.filter(a => a.category === category);
  }

  public getUnlockedAchievements(): Achievement[] {
    return this.achievements.filter(a => a.isUnlocked);
  }

  public getNextAchievements(limit: number = 3): Achievement[] {
    return this.achievements
      .filter(a => !a.isUnlocked && a.progress > 0)
      .sort((a, b) => (b.progress / b.maxProgress) - (a.progress / a.maxProgress))
      .slice(0, limit);
  }

  public resetProgress(): void {
    this.achievements.forEach(achievement => {
      achievement.progress = 0;
      achievement.isUnlocked = false;
      achievement.unlockedAt = null;
    });
    
    this.userStats = {
      totalPoints: 0,
      unlockedBadges: 0,
      completedTrainings: 0,
      complianceStreak: 0,
      safetyScore: 75,
      teamLeadership: 0,
      engagementLevel: 0
    };
    
    this.milestones = [];
    this.saveData();
  }
}

export const dynamicAchievementService = new DynamicAchievementService();
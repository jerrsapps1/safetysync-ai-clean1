import { Achievement, UserStats, MilestoneEvent, DynamicBadge } from '@/types/achievements';
import { 
  BookOpen, 
  Shield, 
  Target, 
  Award, 
  Star, 
  TrendingUp, 
  Crown, 
  Users, 
  Calendar, 
  Settings,
  FileText,
  Trophy,
  Zap,
  Clock,
  Activity,
  Heart,
  Brain,
  Sparkles
} from 'lucide-react';

export class DynamicAchievementService {
  private static instance: DynamicAchievementService;
  private milestoneEvents: MilestoneEvent[] = [];
  private userStats: UserStats = {
    totalPoints: 0,
    unlockedBadges: 0,
    completedTrainings: 0,
    complianceStreak: 0,
    safetyScore: 0,
    teamLeadership: 0,
    engagementLevel: 0
  };
  private achievements: Achievement[] = [];
  private dynamicBadges: DynamicBadge[] = [];

  private constructor() {
    this.loadData();
    this.initializeDynamicBadges();
  }

  static getInstance(): DynamicAchievementService {
    if (!DynamicAchievementService.instance) {
      DynamicAchievementService.instance = new DynamicAchievementService();
    }
    return DynamicAchievementService.instance;
  }

  private loadData(): void {
    // Load from localStorage
    const savedEvents = localStorage.getItem('milestone-events');
    const savedStats = localStorage.getItem('user-stats');
    const savedAchievements = localStorage.getItem('achievements');

    if (savedEvents) {
      this.milestoneEvents = JSON.parse(savedEvents).map((event: any) => ({
        ...event,
        timestamp: new Date(event.timestamp)
      }));
    }

    if (savedStats) {
      this.userStats = JSON.parse(savedStats);
    }

    if (savedAchievements) {
      this.achievements = JSON.parse(savedAchievements).map((achievement: any) => ({
        ...achievement,
        unlockedAt: achievement.unlockedAt ? new Date(achievement.unlockedAt) : undefined
      }));
    }
  }

  private saveData(): void {
    localStorage.setItem('milestone-events', JSON.stringify(this.milestoneEvents));
    localStorage.setItem('user-stats', JSON.stringify(this.userStats));
    localStorage.setItem('achievements', JSON.stringify(this.achievements));
  }

  private initializeDynamicBadges(): void {
    this.dynamicBadges = [
      // Platform Engagement Badges
      {
        id: 'early-adopter',
        title: 'Early Adopter',
        description: 'One of the first to use SafetySync.AI',
        icon: <Star className="w-6 h-6" />,
        condition: (events) => events.filter(e => e.eventType === 'login').length >= 1,
        progressCalculator: (events) => ({
          current: events.filter(e => e.eventType === 'login').length,
          max: 1
        }),
        tier: 'bronze',
        points: 100,
        category: 'platform',
        isRealTime: true
      },
      {
        id: 'daily-user',
        title: 'Daily User',
        description: 'Login for 7 consecutive days',
        icon: <Calendar className="w-6 h-6" />,
        condition: (events) => {
          const loginEvents = events.filter(e => e.eventType === 'login')
            .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
          
          if (loginEvents.length < 7) return false;
          
          let consecutiveDays = 1;
          for (let i = 1; i < loginEvents.length; i++) {
            const prevDay = new Date(loginEvents[i-1].timestamp);
            const currDay = new Date(loginEvents[i].timestamp);
            
            prevDay.setHours(0, 0, 0, 0);
            currDay.setHours(0, 0, 0, 0);
            
            if (currDay.getTime() - prevDay.getTime() === 86400000) {
              consecutiveDays++;
            } else {
              consecutiveDays = 1;
            }
            
            if (consecutiveDays >= 7) return true;
          }
          return false;
        },
        progressCalculator: (events) => {
          const loginEvents = events.filter(e => e.eventType === 'login')
            .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
          
          let maxStreak = 0;
          let currentStreak = 1;
          
          for (let i = 1; i < loginEvents.length; i++) {
            const prevDay = new Date(loginEvents[i-1].timestamp);
            const currDay = new Date(loginEvents[i].timestamp);
            
            prevDay.setHours(0, 0, 0, 0);
            currDay.setHours(0, 0, 0, 0);
            
            if (currDay.getTime() - prevDay.getTime() === 86400000) {
              currentStreak++;
            } else {
              maxStreak = Math.max(maxStreak, currentStreak);
              currentStreak = 1;
            }
          }
          
          return {
            current: Math.max(maxStreak, currentStreak),
            max: 7
          };
        },
        tier: 'silver',
        points: 300,
        category: 'engagement',
        isRealTime: true
      },
      {
        id: 'customizer',
        title: 'Dashboard Customizer',
        description: 'Customize your dashboard layout',
        icon: <Settings className="w-6 h-6" />,
        condition: (events) => events.filter(e => e.eventType === 'widget_customized').length >= 1,
        progressCalculator: (events) => ({
          current: events.filter(e => e.eventType === 'widget_customized').length,
          max: 1
        }),
        tier: 'bronze',
        points: 150,
        category: 'platform',
        isRealTime: true
      },
      {
        id: 'power-user',
        title: 'Power User',
        description: 'Use 5 different platform features',
        icon: <Zap className="w-6 h-6" />,
        condition: (events) => {
          const uniqueFeatures = new Set(events.map(e => e.eventType));
          return uniqueFeatures.size >= 5;
        },
        progressCalculator: (events) => {
          const uniqueFeatures = new Set(events.map(e => e.eventType));
          return {
            current: uniqueFeatures.size,
            max: 5
          };
        },
        tier: 'gold',
        points: 500,
        category: 'platform',
        isRealTime: true
      },
      
      // Training & Compliance Badges
      {
        id: 'training-starter',
        title: 'Training Starter',
        description: 'Complete your first training session',
        icon: <BookOpen className="w-6 h-6" />,
        condition: (events) => events.filter(e => e.eventType === 'training_completed').length >= 1,
        progressCalculator: (events) => ({
          current: events.filter(e => e.eventType === 'training_completed').length,
          max: 1
        }),
        tier: 'bronze',
        points: 200,
        category: 'training',
        isRealTime: true
      },
      {
        id: 'training-enthusiast',
        title: 'Training Enthusiast',
        description: 'Complete 5 training sessions',
        icon: <Brain className="w-6 h-6" />,
        condition: (events) => events.filter(e => e.eventType === 'training_completed').length >= 5,
        progressCalculator: (events) => ({
          current: events.filter(e => e.eventType === 'training_completed').length,
          max: 5
        }),
        tier: 'silver',
        points: 400,
        category: 'training',
        isRealTime: true
      },
      {
        id: 'compliance-guardian',
        title: 'Compliance Guardian',
        description: 'Maintain 100% compliance for 30 days',
        icon: <Shield className="w-6 h-6" />,
        condition: (events, userStats) => userStats.complianceStreak >= 30,
        progressCalculator: (events, userStats) => ({
          current: userStats.complianceStreak,
          max: 30
        }),
        tier: 'gold',
        points: 600,
        category: 'compliance',
        isRealTime: true
      },
      {
        id: 'safety-champion',
        title: 'Safety Champion',
        description: 'Achieve 95% safety score',
        icon: <Award className="w-6 h-6" />,
        condition: (events, userStats) => userStats.safetyScore >= 95,
        progressCalculator: (events, userStats) => ({
          current: userStats.safetyScore,
          max: 95
        }),
        tier: 'platinum',
        points: 800,
        category: 'safety',
        isRealTime: true
      },
      
      // Certificate & Report Badges
      {
        id: 'certificate-generator',
        title: 'Certificate Generator',
        description: 'Generate your first certificate',
        icon: <Award className="w-6 h-6" />,
        condition: (events) => events.filter(e => e.eventType === 'certificate_generated').length >= 1,
        progressCalculator: (events) => ({
          current: events.filter(e => e.eventType === 'certificate_generated').length,
          max: 1
        }),
        tier: 'bronze',
        points: 150,
        category: 'platform',
        isRealTime: true
      },
      {
        id: 'report-master',
        title: 'Report Master',
        description: 'Generate 10 different reports',
        icon: <FileText className="w-6 h-6" />,
        condition: (events) => events.filter(e => e.eventType === 'report_generated').length >= 10,
        progressCalculator: (events) => ({
          current: events.filter(e => e.eventType === 'report_generated').length,
          max: 10
        }),
        tier: 'silver',
        points: 350,
        category: 'platform',
        isRealTime: true
      },
      
      // Leadership & Engagement Badges
      {
        id: 'team-collaborator',
        title: 'Team Collaborator',
        description: 'Interact with team members 5 times',
        icon: <Users className="w-6 h-6" />,
        condition: (events) => events.filter(e => e.eventType === 'team_interaction').length >= 5,
        progressCalculator: (events) => ({
          current: events.filter(e => e.eventType === 'team_interaction').length,
          max: 5
        }),
        tier: 'silver',
        points: 300,
        category: 'engagement',
        isRealTime: true
      },
      {
        id: 'leader',
        title: 'Safety Leader',
        description: 'Take 3 leadership actions',
        icon: <Crown className="w-6 h-6" />,
        condition: (events) => events.filter(e => e.eventType === 'leadership_action').length >= 3,
        progressCalculator: (events) => ({
          current: events.filter(e => e.eventType === 'leadership_action').length,
          max: 3
        }),
        tier: 'gold',
        points: 500,
        category: 'leadership',
        isRealTime: true
      },
      
      // Special Milestone Badges
      {
        id: 'milestone-100',
        title: '100 Point Milestone',
        description: 'Reach 100 total points',
        icon: <Trophy className="w-6 h-6" />,
        condition: (events, userStats) => userStats.totalPoints >= 100,
        progressCalculator: (events, userStats) => ({
          current: userStats.totalPoints,
          max: 100
        }),
        tier: 'bronze',
        points: 50,
        category: 'platform',
        isRealTime: true
      },
      {
        id: 'milestone-500',
        title: '500 Point Milestone',
        description: 'Reach 500 total points',
        icon: <Sparkles className="w-6 h-6" />,
        condition: (events, userStats) => userStats.totalPoints >= 500,
        progressCalculator: (events, userStats) => ({
          current: userStats.totalPoints,
          max: 500
        }),
        tier: 'silver',
        points: 100,
        category: 'platform',
        isRealTime: true
      },
      {
        id: 'milestone-1000',
        title: '1000 Point Milestone',
        description: 'Reach 1000 total points',
        icon: <Crown className="w-6 h-6" />,
        condition: (events, userStats) => userStats.totalPoints >= 1000,
        progressCalculator: (events, userStats) => ({
          current: userStats.totalPoints,
          max: 1000
        }),
        tier: 'gold',
        points: 200,
        category: 'platform',
        isRealTime: true
      }
    ];
  }

  // Track user actions and trigger achievement checks
  trackMilestone(eventType: MilestoneEvent['eventType'], data: any, userId: string = 'current-user'): Achievement[] {
    const event: MilestoneEvent = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      eventType,
      data,
      timestamp: new Date()
    };

    this.milestoneEvents.push(event);
    
    // Check for newly unlocked achievements
    const newlyUnlocked = this.checkDynamicAchievements();
    
    this.saveData();
    
    return newlyUnlocked;
  }

  private checkDynamicAchievements(): Achievement[] {
    const newlyUnlocked: Achievement[] = [];

    for (const badge of this.dynamicBadges) {
      const existingAchievement = this.achievements.find(a => a.id === badge.id);
      
      if (!existingAchievement) {
        // Create new achievement from dynamic badge
        const progress = badge.progressCalculator(this.milestoneEvents, this.userStats);
        const isUnlocked = badge.condition(this.milestoneEvents, this.userStats);
        
        const achievement: Achievement = {
          id: badge.id,
          title: badge.title,
          description: badge.description,
          icon: badge.icon,
          category: badge.category,
          tier: badge.tier,
          points: badge.points,
          isUnlocked,
          unlockedAt: isUnlocked ? new Date() : undefined,
          progress: progress.current,
          maxProgress: progress.max,
          requirements: [badge.description]
        };
        
        this.achievements.push(achievement);
        
        if (isUnlocked) {
          this.userStats.totalPoints += badge.points;
          this.userStats.unlockedBadges += 1;
          this.showAchievementNotification(achievement);
          newlyUnlocked.push(achievement);
        }
      } else if (!existingAchievement.isUnlocked) {
        // Update existing achievement progress
        const progress = badge.progressCalculator(this.milestoneEvents, this.userStats);
        existingAchievement.progress = progress.current;
        
        if (badge.condition(this.milestoneEvents, this.userStats)) {
          existingAchievement.isUnlocked = true;
          existingAchievement.unlockedAt = new Date();
          this.userStats.totalPoints += badge.points;
          this.userStats.unlockedBadges += 1;
          this.showAchievementNotification(existingAchievement);
          newlyUnlocked.push(existingAchievement);
        }
      }
    }

    return newlyUnlocked;
  }

  private showAchievementNotification(achievement: Achievement): void {
    // Create custom event for achievement notification
    const event = new CustomEvent('achievement-unlocked', {
      detail: achievement
    });
    window.dispatchEvent(event);
  }

  // Update user stats
  updateUserStats(newStats: Partial<UserStats>): void {
    this.userStats = { ...this.userStats, ...newStats };
    this.checkDynamicAchievements();
    this.saveData();
  }

  // Get all achievements including dynamic ones
  getAllAchievements(): Achievement[] {
    // Refresh progress for all achievements
    this.checkDynamicAchievements();
    return [...this.achievements];
  }

  // Get user stats
  getUserStats(): UserStats {
    return { ...this.userStats };
  }

  // Get recent events
  getRecentEvents(limit: number = 10): MilestoneEvent[] {
    return this.milestoneEvents
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Get achievements by category
  getAchievementsByCategory(category: string): Achievement[] {
    return this.getAllAchievements().filter(a => a.category === category);
  }

  // Get next achievements to unlock
  getNextAchievements(): Achievement[] {
    return this.getAllAchievements()
      .filter(a => !a.isUnlocked && a.progress > 0)
      .sort((a, b) => (b.progress / b.maxProgress) - (a.progress / a.maxProgress))
      .slice(0, 3);
  }

  // Get recent unlocks
  getRecentUnlocks(limit: number = 5): Achievement[] {
    return this.getAllAchievements()
      .filter(a => a.isUnlocked && a.unlockedAt)
      .sort((a, b) => b.unlockedAt!.getTime() - a.unlockedAt!.getTime())
      .slice(0, limit);
  }

  // Reset all data (for testing)
  resetData(): void {
    this.milestoneEvents = [];
    this.achievements = [];
    this.userStats = {
      totalPoints: 0,
      unlockedBadges: 0,
      completedTrainings: 0,
      complianceStreak: 0,
      safetyScore: 0,
      teamLeadership: 0,
      engagementLevel: 0
    };
    this.saveData();
  }
}

export const dynamicAchievementService = DynamicAchievementService.getInstance();
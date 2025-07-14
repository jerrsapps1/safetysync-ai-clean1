export interface Achievement {
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

export interface UserStats {
  totalPoints: number;
  unlockedBadges: number;
  completedTrainings: number;
  complianceStreak: number;
  safetyScore: number;
  teamLeadership: number;
  engagementLevel: number;
}

export interface AchievementCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description?: string;
}

export interface AchievementNotification {
  achievement: Achievement;
  timestamp: Date;
  isRead: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  badges: number;
  avatar?: string;
}

export interface AchievementProgress {
  achievementId: string;
  currentProgress: number;
  maxProgress: number;
  lastUpdated: Date;
}

export interface MilestoneEvent {
  id: string;
  userId: string;
  eventType: 'training_completed' | 'compliance_updated' | 'safety_score_updated' | 'team_interaction' | 'leadership_action' | 'login' | 'certificate_generated' | 'report_generated' | 'widget_customized';
  data: any;
  timestamp: Date;
}

export interface DynamicBadge {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  condition: (events: MilestoneEvent[], userStats: UserStats) => boolean;
  progressCalculator: (events: MilestoneEvent[], userStats: UserStats) => { current: number; max: number };
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  points: number;
  category: 'training' | 'compliance' | 'safety' | 'engagement' | 'leadership' | 'platform';
  isRealTime: boolean;
}
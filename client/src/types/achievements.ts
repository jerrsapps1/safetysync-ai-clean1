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
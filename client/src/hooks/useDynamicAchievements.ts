import { useState, useEffect, useCallback } from 'react';
import { Achievement, UserStats, MilestoneEvent } from '@/types/achievements';
import { dynamicAchievementService } from '@/lib/dynamic-achievements';

export function useDynamicAchievements() {
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
  const [isLoading, setIsLoading] = useState(true);

  // Load achievements and stats
  const loadData = useCallback(() => {
    try {
      const allAchievements = dynamicAchievementService.getAllAchievements();
      const stats = dynamicAchievementService.getUserStats();
      
      setAchievements(allAchievements);
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Track milestone events
  const trackMilestone = useCallback((
    eventType: MilestoneEvent['eventType'], 
    data: any, 
    userId: string = 'current-user'
  ) => {
    try {
      const newlyUnlocked = dynamicAchievementService.trackMilestone(eventType, data, userId);
      
      // Reload data to get updated stats
      loadData();
      
      return newlyUnlocked;
    } catch (error) {
      console.error('Error tracking milestone:', error);
      return [];
    }
  }, [loadData]);

  // Update user stats
  const updateUserStats = useCallback((newStats: Partial<UserStats>) => {
    try {
      dynamicAchievementService.updateUserStats(newStats);
      loadData();
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  }, [loadData]);

  // Get filtered achievements
  const getAchievementsByCategory = useCallback((category: string) => {
    return achievements.filter(a => a.category === category);
  }, [achievements]);

  const getUnlockedAchievements = useCallback(() => {
    return achievements.filter(a => a.isUnlocked);
  }, [achievements]);

  const getNextAchievements = useCallback((limit: number = 3) => {
    return achievements
      .filter(a => !a.isUnlocked && a.progress > 0)
      .sort((a, b) => (b.progress / b.maxProgress) - (a.progress / a.maxProgress))
      .slice(0, limit);
  }, [achievements]);

  const getRecentUnlocks = useCallback((limit: number = 5) => {
    return achievements
      .filter(a => a.isUnlocked && a.unlockedAt)
      .sort((a, b) => b.unlockedAt!.getTime() - a.unlockedAt!.getTime())
      .slice(0, limit);
  }, [achievements]);

  // Initialize data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Listen for achievement unlocks
  useEffect(() => {
    const handleAchievementUnlocked = () => {
      loadData();
    };

    window.addEventListener('achievement-unlocked', handleAchievementUnlocked);
    
    return () => {
      window.removeEventListener('achievement-unlocked', handleAchievementUnlocked);
    };
  }, [loadData]);

  return {
    achievements,
    userStats,
    isLoading,
    trackMilestone,
    updateUserStats,
    getAchievementsByCategory,
    getUnlockedAchievements,
    getNextAchievements,
    getRecentUnlocks,
    refresh: loadData
  };
}

// Convenience hooks for specific tracking
export function useAchievementTracking() {
  const { trackMilestone } = useDynamicAchievements();

  return {
    trackLogin: () => trackMilestone('login', { timestamp: new Date() }),
    trackTrainingCompleted: (trainingId: string, score?: number) => 
      trackMilestone('training_completed', { trainingId, score, timestamp: new Date() }),
    trackCertificateGenerated: (certificateType: string) => 
      trackMilestone('certificate_generated', { certificateType, timestamp: new Date() }),
    trackReportGenerated: (reportType: string) => 
      trackMilestone('report_generated', { reportType, timestamp: new Date() }),
    trackWidgetCustomized: (widgetId: string) => 
      trackMilestone('widget_customized', { widgetId, timestamp: new Date() }),
    trackTeamInteraction: (action: string, targetUser?: string) => 
      trackMilestone('team_interaction', { action, targetUser, timestamp: new Date() }),
    trackLeadershipAction: (action: string, details?: any) => 
      trackMilestone('leadership_action', { action, details, timestamp: new Date() }),
    trackComplianceUpdate: (complianceScore: number, streak: number) => 
      trackMilestone('compliance_updated', { complianceScore, streak, timestamp: new Date() }),
    trackSafetyScoreUpdate: (safetyScore: number, incidentFreeDays: number) => 
      trackMilestone('safety_score_updated', { safetyScore, incidentFreeDays, timestamp: new Date() })
  };
}
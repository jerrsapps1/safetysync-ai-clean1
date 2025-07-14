import { Achievement, UserStats } from '@/types/achievements';

export class AchievementService {
  private static instance: AchievementService;
  private achievements: Achievement[] = [];
  private userStats: UserStats = {
    totalPoints: 0,
    unlockedBadges: 0,
    completedTrainings: 0,
    complianceStreak: 0,
    safetyScore: 0,
    teamLeadership: 0,
    engagementLevel: 0
  };

  private constructor() {
    this.loadAchievements();
    this.loadUserStats();
  }

  static getInstance(): AchievementService {
    if (!AchievementService.instance) {
      AchievementService.instance = new AchievementService();
    }
    return AchievementService.instance;
  }

  private loadAchievements(): void {
    // Load achievements from localStorage or API
    const saved = localStorage.getItem('user-achievements');
    if (saved) {
      this.achievements = JSON.parse(saved);
    }
  }

  private loadUserStats(): void {
    // Load user stats from localStorage or API
    const saved = localStorage.getItem('user-stats');
    if (saved) {
      this.userStats = JSON.parse(saved);
    }
  }

  private saveAchievements(): void {
    localStorage.setItem('user-achievements', JSON.stringify(this.achievements));
  }

  private saveUserStats(): void {
    localStorage.setItem('user-stats', JSON.stringify(this.userStats));
  }

  checkAchievements(action: string, data: any): Achievement[] {
    const newlyUnlocked: Achievement[] = [];

    switch (action) {
      case 'training_completed':
        newlyUnlocked.push(...this.checkTrainingAchievements(data));
        break;
      case 'compliance_updated':
        newlyUnlocked.push(...this.checkComplianceAchievements(data));
        break;
      case 'safety_score_updated':
        newlyUnlocked.push(...this.checkSafetyAchievements(data));
        break;
      case 'team_interaction':
        newlyUnlocked.push(...this.checkEngagementAchievements(data));
        break;
      case 'leadership_action':
        newlyUnlocked.push(...this.checkLeadershipAchievements(data));
        break;
    }

    if (newlyUnlocked.length > 0) {
      this.saveAchievements();
      this.saveUserStats();
    }

    return newlyUnlocked;
  }

  private checkTrainingAchievements(data: any): Achievement[] {
    const newlyUnlocked: Achievement[] = [];
    const trainingCount = data.completedTrainings || 0;

    // First training achievement
    const firstTraining = this.achievements.find(a => a.id === 'first-training');
    if (firstTraining && !firstTraining.isUnlocked && trainingCount >= 1) {
      this.unlockAchievement(firstTraining);
      newlyUnlocked.push(firstTraining);
    }

    // Training streak achievement
    const trainingStreak = this.achievements.find(a => a.id === 'training-streak');
    if (trainingStreak && !trainingStreak.isUnlocked && trainingCount >= 5) {
      this.unlockAchievement(trainingStreak);
      newlyUnlocked.push(trainingStreak);
    }

    // Training master achievement
    const trainingMaster = this.achievements.find(a => a.id === 'training-master');
    if (trainingMaster && !trainingMaster.isUnlocked && trainingCount >= 10) {
      trainingMaster.progress = Math.min(trainingCount, 10);
      if (trainingCount >= 10 && data.averageScore >= 85) {
        this.unlockAchievement(trainingMaster);
        newlyUnlocked.push(trainingMaster);
      }
    }

    return newlyUnlocked;
  }

  private checkComplianceAchievements(data: any): Achievement[] {
    const newlyUnlocked: Achievement[] = [];
    const complianceStreak = data.complianceStreak || 0;

    // Compliance keeper achievement
    const complianceKeeper = this.achievements.find(a => a.id === 'compliance-keeper');
    if (complianceKeeper && !complianceKeeper.isUnlocked && complianceStreak >= 30) {
      this.unlockAchievement(complianceKeeper);
      newlyUnlocked.push(complianceKeeper);
    }

    // Compliance champion achievement
    const complianceChampion = this.achievements.find(a => a.id === 'compliance-champion');
    if (complianceChampion && !complianceChampion.isUnlocked) {
      complianceChampion.progress = Math.min(complianceStreak, 90);
      if (complianceStreak >= 90 && data.violations === 0) {
        this.unlockAchievement(complianceChampion);
        newlyUnlocked.push(complianceChampion);
      }
    }

    return newlyUnlocked;
  }

  private checkSafetyAchievements(data: any): Achievement[] {
    const newlyUnlocked: Achievement[] = [];
    const safetyScore = data.safetyScore || 0;
    const incidentFreeDays = data.incidentFreeDays || 0;

    // Safety awareness achievement
    const safetyAwareness = this.achievements.find(a => a.id === 'safety-awareness');
    if (safetyAwareness && !safetyAwareness.isUnlocked && safetyScore >= 90) {
      this.unlockAchievement(safetyAwareness);
      newlyUnlocked.push(safetyAwareness);
    }

    // Incident free achievement
    const incidentFree = this.achievements.find(a => a.id === 'incident-free');
    if (incidentFree && !incidentFree.isUnlocked) {
      incidentFree.progress = Math.min(incidentFreeDays, 180);
      if (incidentFreeDays >= 180 && safetyScore >= 95) {
        this.unlockAchievement(incidentFree);
        newlyUnlocked.push(incidentFree);
      }
    }

    return newlyUnlocked;
  }

  private checkEngagementAchievements(data: any): Achievement[] {
    const newlyUnlocked: Achievement[] = [];
    const helpedColleagues = data.helpedColleagues || 0;
    const trainedEmployees = data.trainedEmployees || 0;

    // Team player achievement
    const teamPlayer = this.achievements.find(a => a.id === 'team-player');
    if (teamPlayer && !teamPlayer.isUnlocked && helpedColleagues >= 5) {
      this.unlockAchievement(teamPlayer);
      newlyUnlocked.push(teamPlayer);
    }

    // Mentor achievement
    const mentor = this.achievements.find(a => a.id === 'mentor');
    if (mentor && !mentor.isUnlocked) {
      mentor.progress = Math.min(trainedEmployees, 3);
      if (trainedEmployees >= 3 && data.positiveFeedback) {
        this.unlockAchievement(mentor);
        newlyUnlocked.push(mentor);
      }
    }

    return newlyUnlocked;
  }

  private checkLeadershipAchievements(data: any): Achievement[] {
    const newlyUnlocked: Achievement[] = [];
    const initiativesLed = data.initiativesLed || 0;
    const cultureImprovement = data.cultureImprovement || 0;

    // Team leader achievement
    const teamLeader = this.achievements.find(a => a.id === 'team-leader');
    if (teamLeader && !teamLeader.isUnlocked && initiativesLed >= 1) {
      this.unlockAchievement(teamLeader);
      newlyUnlocked.push(teamLeader);
    }

    // Culture champion achievement
    const cultureChampion = this.achievements.find(a => a.id === 'culture-champion');
    if (cultureChampion && !cultureChampion.isUnlocked) {
      cultureChampion.progress = Math.min(cultureImprovement, 20);
      if (cultureImprovement >= 20 && data.maintainedFor >= 60) {
        this.unlockAchievement(cultureChampion);
        newlyUnlocked.push(cultureChampion);
      }
    }

    return newlyUnlocked;
  }

  private unlockAchievement(achievement: Achievement): void {
    achievement.isUnlocked = true;
    achievement.unlockedAt = new Date();
    achievement.progress = achievement.maxProgress;
    
    // Add points to user stats
    this.userStats.totalPoints += achievement.points;
    this.userStats.unlockedBadges += 1;
    
    // Show achievement notification
    this.showAchievementNotification(achievement);
  }

  private showAchievementNotification(achievement: Achievement): void {
    // Create and show a toast notification
    const event = new CustomEvent('achievement-unlocked', {
      detail: achievement
    });
    window.dispatchEvent(event);
  }

  updateUserStats(stats: Partial<UserStats>): void {
    this.userStats = { ...this.userStats, ...stats };
    this.saveUserStats();
  }

  getUserStats(): UserStats {
    return { ...this.userStats };
  }

  getAchievements(): Achievement[] {
    return [...this.achievements];
  }

  getAchievementsByCategory(category: string): Achievement[] {
    return this.achievements.filter(a => a.category === category);
  }

  getUnlockedAchievements(): Achievement[] {
    return this.achievements.filter(a => a.isUnlocked);
  }

  getNextAchievements(): Achievement[] {
    return this.achievements
      .filter(a => !a.isUnlocked && a.progress > 0)
      .sort((a, b) => (b.progress / b.maxProgress) - (a.progress / a.maxProgress))
      .slice(0, 3);
  }

  getLeaderboardData(): any {
    // This would typically fetch from an API
    return {
      currentUser: {
        rank: 3,
        points: this.userStats.totalPoints,
        badges: this.userStats.unlockedBadges
      },
      topUsers: [
        { rank: 1, name: 'Sarah Johnson', points: 3450, badges: 18 },
        { rank: 2, name: 'Mike Chen', points: 2890, badges: 15 },
        { rank: 3, name: 'You', points: this.userStats.totalPoints, badges: this.userStats.unlockedBadges },
        { rank: 4, name: 'Lisa Rodriguez', points: 2200, badges: 11 },
        { rank: 5, name: 'James Wilson', points: 1980, badges: 10 }
      ]
    };
  }
}

export const achievementService = AchievementService.getInstance();
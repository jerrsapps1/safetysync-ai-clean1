import React, { useState, useEffect } from 'react';
import { Achievement } from '@/types/achievements';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Sparkles, Trophy, Award, Medal, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DynamicAchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

const tierColors = {
  bronze: 'bg-gradient-to-r from-amber-600 to-amber-700',
  silver: 'bg-gradient-to-r from-blue-300 to-blue-400',
  gold: 'bg-gradient-to-r from-yellow-400 to-yellow-500',
  platinum: 'bg-gradient-to-r from-purple-400 to-purple-500'
};

const tierIcons = {
  bronze: <Medal className="w-5 h-5" />,
  silver: <Award className="w-5 h-5" />,
  gold: <Trophy className="w-5 h-5" />,
  platinum: <Crown className="w-5 h-5" />
};

export function DynamicAchievementNotification({ achievement, onClose }: DynamicAchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
      isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <Card className="w-80 bg-black/90 backdrop-blur-md border-2 border-emerald-500/50 shadow-2xl">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-emerald-400">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Achievement Unlocked!</span>
              </div>
              <div className="animate-pulse">
                <Sparkles className="w-3 h-3 text-yellow-500" />
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="p-1 h-auto text-blue-300 hover:text-white hover:bg-blue-700/50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-full ${tierColors[achievement.tier]} relative`}>
              {achievement.icon}
              <div className="absolute -top-1 -right-1">
                {tierIcons[achievement.tier]}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold truncate">{achievement.title}</h3>
              <p className="text-gray-300 text-sm">{achievement.description}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className={`${tierColors[achievement.tier]} text-white border-0`}>
                {achievement.tier.charAt(0).toUpperCase() + achievement.tier.slice(1)}
              </Badge>
              <span className="text-yellow-400 font-medium">+{achievement.points} pts</span>
            </div>
            <div className="text-xs text-blue-300">
              {achievement.unlockedAt ? new Date(achievement.unlockedAt).toLocaleTimeString() : 'Just now'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function AchievementNotificationManager() {
  const [notifications, setNotifications] = useState<Achievement[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const handleAchievementUnlocked = (event: CustomEvent) => {
      const achievement = event.detail as Achievement;
      
      // Add to notifications
      setNotifications(prev => [...prev, achievement]);
      
      // Also show toast notification
      toast({
        title: "🎉 Achievement Unlocked!",
        description: `${achievement.title} - +${achievement.points} points`,
        duration: 3000,
      });
    };

    window.addEventListener('achievement-unlocked', handleAchievementUnlocked as EventListener);
    
    return () => {
      window.removeEventListener('achievement-unlocked', handleAchievementUnlocked as EventListener);
    };
  }, [toast]);

  const removeNotification = (achievementId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== achievementId));
  };

  return (
    <>
      {notifications.map((achievement, index) => (
        <div
          key={achievement.id}
          style={{ top: `${1 + index * 5}rem` }}
          className="fixed right-4 z-50"
        >
          <DynamicAchievementNotification
            achievement={achievement}
            onClose={() => removeNotification(achievement.id)}
          />
        </div>
      ))}
    </>
  );
}
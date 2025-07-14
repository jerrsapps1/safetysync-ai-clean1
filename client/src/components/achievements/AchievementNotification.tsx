import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Achievement } from '@/types/achievements';
import { X, Star, Trophy, Award, Crown, Medal } from 'lucide-react';

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

const tierIcons = {
  bronze: <Medal className="w-6 h-6" />,
  silver: <Award className="w-6 h-6" />,
  gold: <Trophy className="w-6 h-6" />,
  platinum: <Crown className="w-6 h-6" />
};

const tierColors = {
  bronze: 'from-amber-600 to-amber-700',
  silver: 'from-gray-400 to-gray-500',
  gold: 'from-yellow-400 to-yellow-500',
  platinum: 'from-purple-400 to-purple-500'
};

export default function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <Card className="bg-gradient-to-r from-emerald-900 to-emerald-800 border-emerald-600 shadow-2xl max-w-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-emerald-300">Achievement Unlocked!</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-emerald-300 hover:text-white hover:bg-emerald-800/50 p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full bg-gradient-to-r ${tierColors[achievement.tier]}`}>
              {achievement.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-white">{achievement.title}</h4>
                {tierIcons[achievement.tier]}
              </div>
              <p className="text-sm text-emerald-200 mb-2">{achievement.description}</p>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-yellow-400">+{achievement.points} points</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function AchievementNotificationContainer() {
  const [notifications, setNotifications] = useState<Achievement[]>([]);

  useEffect(() => {
    const handleAchievementUnlocked = (event: CustomEvent<Achievement>) => {
      setNotifications(prev => [...prev, event.detail]);
    };

    window.addEventListener('achievement-unlocked', handleAchievementUnlocked as EventListener);
    return () => window.removeEventListener('achievement-unlocked', handleAchievementUnlocked as EventListener);
  }, []);

  const removeNotification = (achievementId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== achievementId));
  };

  return (
    <>
      {notifications.map((achievement, index) => (
        <div key={achievement.id} style={{ top: `${1 + index * 6}rem` }} className="fixed right-4 z-50">
          <AchievementNotification
            achievement={achievement}
            onClose={() => removeNotification(achievement.id)}
          />
        </div>
      ))}
    </>
  );
}
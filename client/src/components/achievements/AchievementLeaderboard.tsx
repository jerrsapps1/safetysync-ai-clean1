import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Medal, 
  Award, 
  Crown, 
  Star, 
  TrendingUp,
  Users,
  Calendar,
  Target
} from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  badges: number;
  avatar?: string;
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  period?: 'week' | 'month' | 'all';
}

export default function AchievementLeaderboard({ period = 'month' }: LeaderboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(period);
  
  // Mock leaderboard data (would come from API)
  const leaderboardData: LeaderboardEntry[] = [
    { rank: 1, name: 'Sarah Johnson', points: 3450, badges: 18, avatar: '/avatars/sarah.jpg' },
    { rank: 2, name: 'Mike Chen', points: 2890, badges: 15, avatar: '/avatars/mike.jpg' },
    { rank: 3, name: 'You', points: 2450, badges: 12, isCurrentUser: true },
    { rank: 4, name: 'Lisa Rodriguez', points: 2200, badges: 11, avatar: '/avatars/lisa.jpg' },
    { rank: 5, name: 'James Wilson', points: 1980, badges: 10, avatar: '/avatars/james.jpg' },
    { rank: 6, name: 'Emily Davis', points: 1750, badges: 9, avatar: '/avatars/emily.jpg' },
    { rank: 7, name: 'David Kim', points: 1650, badges: 8, avatar: '/avatars/david.jpg' },
    { rank: 8, name: 'Maria Garcia', points: 1520, badges: 7, avatar: '/avatars/maria.jpg' },
    { rank: 9, name: 'Robert Brown', points: 1350, badges: 6, avatar: '/avatars/robert.jpg' },
    { rank: 10, name: 'Anna Thompson', points: 1200, badges: 5, avatar: '/avatars/anna.jpg' }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-white" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-white font-medium">{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
      case 2:
        return 'bg-gradient-to-r from-blue-300 to-blue-400';
      case 3:
        return 'bg-gradient-to-r from-amber-600 to-amber-700';
      default:
        return 'bg-blue-600';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const currentUser = leaderboardData.find(entry => entry.isCurrentUser);

  return (
    <div className="space-y-6">
      {/* Period Selection */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Safety Champions</h2>
        <div className="flex gap-2">
          {['week', 'month', 'all'].map(p => (
            <Button
              key={p}
              variant={selectedPeriod === p ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(p as typeof selectedPeriod)}
              className={selectedPeriod === p ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-700/50 text-white border-blue-500 hover:bg-blue-700'}
            >
              {p === 'all' ? 'All Time' : `This ${p.charAt(0).toUpperCase() + p.slice(1)}`}
            </Button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      <Card className="bg-black/20 backdrop-blur-sm border-blue-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {leaderboardData.slice(0, 3).map((entry) => (
              <div key={entry.rank} className="text-center">
                <div className={`p-4 rounded-lg mb-3 ${getRankColor(entry.rank)}`}>
                  <Avatar className="w-16 h-16 mx-auto mb-2">
                    <AvatarImage src={entry.avatar} alt={entry.name} />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {getInitials(entry.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex justify-center mb-1">
                    {getRankIcon(entry.rank)}
                  </div>
                </div>
                <h3 className={`font-medium ${entry.isCurrentUser ? 'text-violet-400' : 'text-white'}`}>
                  {entry.name}
                </h3>
                <div className="flex items-center justify-center gap-1 text-sm text-white mt-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{entry.points.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-center gap-1 text-sm text-white">
                  <Award className="w-4 h-4 text-emerald-500" />
                  <span>{entry.badges} badges</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Full Leaderboard */}
      <Card className="bg-black/20 backdrop-blur-sm border-blue-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Full Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {leaderboardData.map((entry, index) => (
              <div
                key={entry.rank}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  entry.isCurrentUser
                    ? 'bg-emerald-900/30 border border-emerald-700'
                    : 'bg-blue-700/30 hover:bg-blue-600/30'
                }`}
              >
                <div className="flex items-center justify-center w-8 h-8">
                  {getRankIcon(entry.rank)}
                </div>
                
                <Avatar className="w-10 h-10">
                  <AvatarImage src={entry.avatar} alt={entry.name} />
                  <AvatarFallback className="bg-blue-600 text-white">
                    {getInitials(entry.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${entry.isCurrentUser ? 'text-violet-400' : 'text-white'}`}>
                      {entry.name}
                    </span>
                    {entry.isCurrentUser && (
                      <Badge className="bg-violet-500/20 text-emerald-300 border-violet-500/30">
                        You
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-white">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span>{entry.points.toLocaleString()} points</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-3 h-3 text-emerald-500" />
                      <span>{entry.badges} badges</span>
                    </div>
                  </div>
                </div>
                
                {entry.rank <= 3 && (
                  <div className="flex items-center gap-1">
                    {getRankIcon(entry.rank)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Your Stats */}
      {currentUser && (
        <Card className="bg-black/20 backdrop-blur-sm border-emerald-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-500" />
              Your Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-violet-400">#{currentUser.rank}</div>
                <div className="text-sm text-white">Current Rank</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{currentUser.points.toLocaleString()}</div>
                <div className="text-sm text-white">Total Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{currentUser.badges}</div>
                <div className="text-sm text-white">Badges Earned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {currentUser.rank <= 3 ? 'Top 3' : 'Top 10'}
                </div>
                <div className="text-sm text-white">Percentile</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
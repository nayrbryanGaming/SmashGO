'use client'

import { Trophy, Target, Zap, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface PlayerStatsProps {
  stats: {
    elo_rating: number
    total_matches: number
    total_wins: number
    win_streak: number
    longest_win_streak: number
  }
}

export function PlayerStats({ stats }: PlayerStatsProps) {
  const winRate = stats.total_matches > 0 
    ? Math.round((stats.total_wins / stats.total_matches) * 100) 
    : 0

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6 flex flex-col items-center">
          <Zap className="h-5 w-5 text-yellow-500 mb-2" />
          <span className="text-2xl font-bold">{stats.elo_rating}</span>
          <span className="text-xs text-muted-foreground uppercase">ELO Rating</span>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6 flex flex-col items-center">
          <Trophy className="h-5 w-5 text-primary mb-2" />
          <span className="text-2xl font-bold">{winRate}%</span>
          <span className="text-xs text-muted-foreground uppercase">Win Rate</span>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6 flex flex-col items-center">
          <Target className="h-5 w-5 text-green-500 mb-2" />
          <span className="text-2xl font-bold">{stats.total_matches}</span>
          <span className="text-xs text-muted-foreground uppercase">Matches</span>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6 flex flex-col items-center">
          <TrendingUp className="h-5 w-5 text-indigo-500 mb-2" />
          <span className="text-2xl font-bold">{stats.win_streak}</span>
          <span className="text-xs text-muted-foreground uppercase">Streak</span>
        </CardContent>
      </Card>
    </div>
  )
}

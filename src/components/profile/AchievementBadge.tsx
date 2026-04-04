'use client'

import { LucideIcon, Award, Star, Flame, Zap, ShieldCheck } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface AchievementBadgeProps {
  type: 'first_blood' | 'on_fire' | 'century' | 'loyalis' | 'sharp_shooter'
  unlockedAt?: string
}

const ACHIEVEMENTS: Record<string, { label: string; icon: LucideIcon; color: string; description: string }> = {
  first_blood: {
    label: 'First Blood',
    icon: Award,
    color: 'text-blue-500 bg-blue-500/10',
    description: 'Menyelesaikan pertandingan pertama'
  },
  on_fire: {
    label: 'On Fire',
    icon: Flame,
    color: 'text-orange-500 bg-orange-500/10',
    description: 'Menang 3 kali berturut-turut'
  },
  century: {
    label: 'Century',
    icon: Star,
    color: 'text-yellow-500 bg-yellow-500/10',
    description: 'Bermain 100 pertandingan'
  },
  loyalis: {
    label: 'Loyalis',
    icon: ShieldCheck,
    color: 'text-green-500 bg-green-500/10',
    description: 'Melakukan 50 booking lapangan'
  },
  sharp_shooter: {
    label: 'Sharp Shooter',
    icon: Zap,
    color: 'text-purple-500 bg-purple-500/10',
    description: 'Win rate di atas 70%'
  }
}

export function AchievementBadge({ type, unlockedAt }: AchievementBadgeProps) {
  const achievement = ACHIEVEMENTS[type]
  if (!achievement) return null

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all hover:scale-105 ${unlockedAt ? achievement.color + ' border-current/20' : 'opacity-30 bg-muted grayscale'}`}>
            <achievement.icon className="h-8 w-8 mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{achievement.label}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-bold">{achievement.label}</p>
            <p className="text-xs text-muted-foreground">{achievement.description}</p>
            {unlockedAt && (
              <p className="text-[10px] text-primary italic">Dibuka pada: {new Date(unlockedAt).toLocaleDateString('id-ID')}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

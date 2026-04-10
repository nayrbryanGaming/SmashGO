// src/components/matchmaking/ELOBadge.tsx
'use client'
import { Badge } from '@/components/ui/badge'
import { eloToSkillLevel } from '@/lib/elo'
import { Trophy, Zap, Shield, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ELOBadgeProps {
  elo: number
  showIcon?: boolean
  showLabel?: boolean
  className?: string
}

export function ELOBadge({ elo, showIcon = true, showLabel = true, className }: ELOBadgeProps) {
  const skill = eloToSkillLevel(elo)
  
  const getIcon = () => {
    if (elo >= 1600) return <Sparkles className="h-3 w-3" />
    if (elo >= 1200) return <Trophy className="h-3 w-3" />
    if (elo >= 1000) return <Zap className="h-3 w-3" />
    return <Shield className="h-3 w-3" />
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Badge 
        variant="secondary" 
        className={cn(
          "font-black italic uppercase tracking-widest text-[10px] py-1 px-3 rounded-xl border-none shadow-lg",
          skill.colorClass.replace('text-', 'bg-').split(' ')[0] + "/10",
          skill.colorClass
        )}
      >
        {showIcon && <span className="mr-1.5 inline-block">{getIcon()}</span>}
        {showLabel && skill.label}
      </Badge>
      <span className="text-xs font-black italic text-slate-400">
        ELO {elo}
      </span>
    </div>
  )
}

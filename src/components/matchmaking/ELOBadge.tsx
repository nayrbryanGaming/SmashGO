'use client'

import { Badge } from '@/components/ui/badge'
import { eloToSkillLevel } from '@/lib/elo'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface ELOBadgeProps {
  elo: number
  showLabel?: boolean
}

export function ELOBadge({ elo, showLabel = true }: ELOBadgeProps) {
  const skill = eloToSkillLevel(elo)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 cursor-help">
            <Badge className={`${skill.colorClass.replace('text-', 'bg-')} text-white border-none px-2 py-0.5 font-bold shadow-sm`}>
              {elo}
            </Badge>
            {showLabel && (
              <span className={`text-xs font-semibold ${skill.colorClass}`}>
                {skill.label}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-[200px] text-center p-3">
          <p className="font-bold mb-1">{skill.label}</p>
          <p className="text-xs text-muted-foreground">{skill.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

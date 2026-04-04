import { ReactNode } from 'react'
import { FolderOpen } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  icon?: ReactNode
  action?: ReactNode
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 border-2 border-dashed rounded-2xl bg-muted/20">
      <div className="text-muted-foreground opacity-20">
        {icon || <FolderOpen className="h-16 w-16" />}
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          {description}
        </p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  )
}

import { Loader2 } from 'lucide-react'

export function LoadingSpinner({ label = 'Memuat...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <Loader2 className="h-8 w-8 text-primary animate-spin" />
      <p className="text-sm text-muted-foreground animate-pulse">{label}</p>
    </div>
  )
}

export default LoadingSpinner

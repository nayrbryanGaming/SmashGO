// src/components/matchmaking/MatchFoundModal.tsx
'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Trophy, Zap, CheckCircle2, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

interface MatchFoundModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  opponentName: string
  opponentElo: number
  matchId: string
}

export function MatchFoundModal({ isOpen, onClose, onConfirm, opponentName, opponentElo, matchId }: MatchFoundModalProps) {
  const router = useRouter()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-none p-0 overflow-hidden bg-slate-950 rounded-[2.5rem] shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500" />
        
        <div className="p-8 space-y-8">
          <div className="flex flex-col items-center text-center space-y-4">
             <motion.div 
               initial={{ scale: 0, rotate: -20 }}
               animate={{ scale: 1, rotate: 0 }}
               className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-500/20"
             >
                <Trophy className="h-12 w-12 text-white animate-bounce" />
             </motion.div>
             <div className="space-y-2">
               <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase leading-none">Lawan Ditemukan!</h2>
               <p className="text-slate-400 font-medium text-sm">Sistem Matchmaking ELO telah menemukan lawan yang seimbang untukmu.</p>
             </div>
          </div>

          <div className="bg-slate-900/50 rounded-[2rem] p-6 border border-slate-800 flex items-center justify-between group hover:bg-slate-900 transition-colors">
             <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center font-black text-white text-xl">
                   {opponentName.substring(0, 2).toUpperCase()}
                </div>
                <div className="text-left">
                   <p className="text-lg font-black text-white leading-tight">{opponentName}</p>
                   <Badge className="bg-white/10 text-indigo-400 border-none font-black text-[10px] uppercase tracking-widest mt-1">ELO RATING: {opponentElo}</Badge>
                </div>
             </div>
             <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 text-amber-500 fill-amber-500" />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
               variant="outline" 
               onClick={onClose}
               className="h-14 rounded-2xl border-slate-800 bg-transparent text-slate-400 hover:text-white hover:bg-slate-900 font-bold uppercase italic tracking-widest"
            >
               <XCircle className="mr-2 h-5 w-5" /> Tolak
            </Button>
            <Button 
               onClick={() => {
                 onConfirm()
                 router.push(`/match/${matchId}`)
               }}
               className="h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase italic tracking-widest shadow-xl shadow-indigo-500/20"
            >
               <CheckCircle2 className="mr-2 h-5 w-5" /> Terima Match
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

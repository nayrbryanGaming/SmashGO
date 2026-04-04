'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ELOBadge } from './ELOBadge'
import { Trophy, Swords, Timer } from 'lucide-react'
import { useEffect, useState } from 'react'

interface MatchFoundModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  opponent: {
    full_name: string
    avatar_url?: string
    elo_rating: number
  }
}

export function MatchFoundModal({ isOpen, onClose, onConfirm, opponent }: MatchFoundModalProps) {
  const [timeLeft, setTimeLeft] = useState(30)

  useEffect(() => {
    if (!isOpen) return
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onClose()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden border-none p-0 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
        <div className="p-6 space-y-6">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
                <div className="relative bg-white/10 p-4 rounded-full border border-white/20">
                  <Swords className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
            <DialogTitle className="text-2xl font-extrabold text-center text-white">Lawan Ditemukan!</DialogTitle>
            <DialogDescription className="text-center text-indigo-100 font-medium">
              Siap untuk bertanding dan menaikkan ELO kamu?
            </DialogDescription>
          </DialogHeader>

          <div className="bg-white/10 rounded-2xl p-6 border border-white/10 backdrop-blur-md">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-20 w-20 border-4 border-white/20 shadow-2xl">
                <AvatarImage src={opponent.avatar_url} />
                <AvatarFallback className="bg-indigo-700 text-white text-xl">
                  {opponent.full_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-xl font-bold">{opponent.full_name}</h3>
                <div className="flex justify-center mt-1">
                  <ELOBadge elo={opponent.elo_rating} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-indigo-100">
            <Timer className="h-4 w-4 animate-pulse" />
            <span className="text-sm font-semibold">Konfirmasi dalam {timeLeft} detik</span>
          </div>
        </div>

        <div className="bg-white p-6 grid grid-cols-2 gap-3">
          <Button variant="ghost" onClick={onClose} className="border-indigo-100 text-indigo-600 hover:bg-indigo-50 font-bold">
            Tolak
          </Button>
          <Button onClick={onConfirm} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-none shadow-lg shadow-indigo-200 font-bold">
            TERIMA MATCH
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

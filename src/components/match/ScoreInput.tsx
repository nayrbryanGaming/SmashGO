'use client'
// src/components/match/ScoreInput.tsx
import { Button } from '@/components/ui/button'
import { Check, Minus, Plus } from 'lucide-react'

interface ScoreInputProps {
  currentSet: number
  scoreA: number
  scoreB: number
  playerAName: string
  playerBName: string
  onScoreChange: (scoreA: number, scoreB: number) => void
  onCompleteSet: () => void
  isSubmitting?: boolean
}

export function ScoreInput({ 
  currentSet, scoreA, scoreB, playerAName, playerBName, onScoreChange, onCompleteSet, isSubmitting 
}: ScoreInputProps) {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-xl space-y-6 border border-slate-100">
      <div className="text-center pb-4 border-b border-slate-100">
        <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">Input Skor - Set {currentSet}</h3>
        <p className="text-xs text-slate-500 font-medium">Wasit / Pemain dapat memperbarui skor</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Player A Input */}
        <div className="flex flex-col items-center gap-4">
          <p className="font-bold text-slate-700 text-center text-sm truncate w-full px-2">{playerAName}</p>
          <div className="flex items-center gap-4 bg-indigo-50 p-2 rounded-2xl">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onScoreChange(Math.max(0, scoreA - 1), scoreB)}
              className="h-12 w-12 rounded-xl text-indigo-600 border-indigo-200 hover:bg-indigo-100 disabled:opacity-50"
              disabled={scoreA === 0 || isSubmitting}
            >
              <Minus className="h-6 w-6" />
            </Button>
            <div className="w-16 text-center text-4xl font-black text-indigo-700">{scoreA}</div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onScoreChange(scoreA + 1, scoreB)}
              className="h-12 w-12 rounded-xl text-indigo-600 border-indigo-200 hover:bg-indigo-100"
              disabled={isSubmitting}
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Player B Input */}
        <div className="flex flex-col items-center gap-4">
          <p className="font-bold text-slate-700 text-center text-sm truncate w-full px-2">{playerBName}</p>
          <div className="flex items-center gap-4 bg-emerald-50 p-2 rounded-2xl">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onScoreChange(scoreA, Math.max(0, scoreB - 1))}
              className="h-12 w-12 rounded-xl text-emerald-600 border-emerald-200 hover:bg-emerald-100 disabled:opacity-50"
              disabled={scoreB === 0 || isSubmitting}
            >
              <Minus className="h-6 w-6" />
            </Button>
             <div className="w-16 text-center text-4xl font-black text-emerald-700">{scoreB}</div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onScoreChange(scoreA, scoreB + 1)}
              className="h-12 w-12 rounded-xl text-emerald-600 border-emerald-200 hover:bg-emerald-100"
              disabled={isSubmitting}
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-4 flex gap-4">
        <Button 
          className="w-full h-14 rounded-2xl text-lg font-black bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-900/20"
          onClick={onCompleteSet}
          disabled={isSubmitting || (scoreA < 21 && scoreB < 21)} // Simplification: assume set finishes at 21 for enabling button
        >
          {isSubmitting ? 'MENYIMPAN...' : 'SELESAIKAN SET INI'} <Check className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

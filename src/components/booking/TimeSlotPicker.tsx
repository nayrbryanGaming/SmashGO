'use client'
// src/components/booking/TimeSlotPicker.tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Clock, Minus, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface TimeSlotPickerProps {
  startTime: string
  onStartTimeChange: (time: string) => void
  durationHours: number
  onDurationChange: (hours: number) => void
  pricePerHour: number
}

export function TimeSlotPicker({
  startTime,
  onStartTimeChange,
  durationHours,
  onDurationChange,
  pricePerHour,
}: TimeSlotPickerProps) {
  function calcEndTime(start: string, duration: number) {
    if (!start) return ''
    const [h, m] = start.split(':').map(Number)
    const totalMin = h * 60 + m + duration * 60
    const endH = Math.floor(totalMin / 60) % 24
    const endM = totalMin % 60
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`
  }

  const endTime = calcEndTime(startTime, durationHours)
  const totalPrice = durationHours * pricePerHour

  return (
    <div className="space-y-5">
      {/* Start time */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Clock className="h-3 w-3" /> Jam Mulai
        </label>
        <div className="grid grid-cols-4 gap-2">
          {['06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'].map((t) => (
            <button
              key={t}
              onClick={() => onStartTimeChange(t)}
              className={`
                py-2.5 rounded-xl text-xs font-black border transition-all
                ${startTime === t
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-900/40'
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-indigo-500/50 hover:text-white'}
              `}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Durasi</label>
        <div className="flex items-center gap-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onDurationChange(Math.max(1, durationHours - 0.5))}
            className="h-10 w-10 rounded-xl border-slate-600 bg-slate-700 hover:bg-slate-600 text-white"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="flex-1 text-center">
            <p className="text-2xl font-black text-white">{durationHours} <span className="text-sm text-slate-400">jam</span></p>
            {startTime && <p className="text-xs text-indigo-400 font-bold">{startTime} → {endTime}</p>}
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onDurationChange(Math.min(4, durationHours + 0.5))}
            className="h-10 w-10 rounded-xl border-slate-600 bg-slate-700 hover:bg-slate-600 text-white"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Price summary */}
      {startTime && (
        <div className="bg-indigo-900/40 border border-indigo-500/30 rounded-2xl p-4 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Total Bayar</p>
            <p className="text-2xl font-black text-white">Rp {totalPrice.toLocaleString('id-ID')}</p>
          </div>
          <Badge className="bg-indigo-600 text-white border-none font-black px-3">
            {durationHours} × Rp {pricePerHour.toLocaleString('id-ID')}
          </Badge>
        </div>
      )}
    </div>
  )
}

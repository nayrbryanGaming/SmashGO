'use client'
// src/components/booking/CourtGrid.tsx
import { useCourtAvailability } from '@/hooks/useBookings'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'

interface CourtGridProps {
  courtId: string
  date: string
  openTime?: string  // "06:00"
  closeTime?: string // "23:00"
  onSlotSelect?: (start: string, end: string) => void
  selectedStart?: string
}

function generateSlots(openTime = '06:00', closeTime = '23:00') {
  const slots: string[] = []
  const [openH] = openTime.split(':').map(Number)
  const [closeH] = closeTime.split(':').map(Number)
  for (let h = openH; h < closeH; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`)
  }
  return slots
}

export function CourtGrid({ courtId, date, openTime, closeTime, onSlotSelect, selectedStart }: CourtGridProps) {
  const { data: bookedSlots, isLoading } = useCourtAvailability(courtId, date)

  const slots = generateSlots(openTime, closeTime)

  function isBooked(startSlot: string) {
    if (!bookedSlots) return false
    return bookedSlots.some((b: any) => {
      const bookStart = b.start_time.slice(0, 5)
      const bookEnd = b.end_time.slice(0, 5)
      return startSlot >= bookStart && startSlot < bookEnd
    })
  }

  function getPriceCategory(hour: string) {
    const h = parseInt(hour.split(':')[0])
    if (h < 12) return { label: 'Pagi', color: 'bg-sky-500/20 text-sky-300 border-sky-500/30' }
    if (h < 18) return { label: 'Siang', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' }
    return { label: 'Malam', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span className="font-medium text-sm">Memuat jadwal...</span>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest pb-2">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-500/30 border border-emerald-500/50 inline-block" /> Tersedia</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-rose-500/20 border border-rose-500/30 inline-block" /> Terpesan</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-indigo-600 border border-indigo-400 inline-block" /> Dipilih</span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {slots.map((slot) => {
          const booked = isBooked(slot)
          const selected = selectedStart === slot
          const { color } = getPriceCategory(slot)

          const endHour = parseInt(slot.split(':')[0]) + 1
          const endSlot = `${String(endHour).padStart(2, '0')}:00`

          return (
            <button
              key={slot}
              disabled={booked}
              onClick={() => !booked && onSlotSelect?.(slot, endSlot)}
              className={`
                relative p-3 rounded-xl border text-center transition-all duration-200
                ${booked
                  ? 'bg-rose-500/10 border-rose-500/20 cursor-not-allowed opacity-50'
                  : selected
                  ? 'bg-indigo-600 border-indigo-400 shadow-lg shadow-indigo-900/50 scale-105'
                  : `${color} hover:scale-105 hover:border-opacity-70 cursor-pointer`
                }
              `}
            >
              <p className={`text-sm font-black ${selected ? 'text-white' : ''}`}>{slot}</p>
              {booked && <p className="text-[8px] font-bold opacity-70 mt-0.5">PENUH</p>}
              {!booked && !selected && <p className="text-[8px] font-bold opacity-60 mt-0.5">1 Jam</p>}
              {selected && <p className="text-[8px] font-bold text-indigo-200 mt-0.5">DIPILIH ✓</p>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

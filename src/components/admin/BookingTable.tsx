// src/components/admin/BookingTable.tsx
'use client'
import { useState } from 'react'
import { 
  useAllBookings, 
  useUpdateBookingStatus 
} from '@/hooks/useBookings'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MoreHorizontal, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  Clock, 
  User, 
  MapPin,
  Filter
} from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

const STATUS_OPTIONS = [
  { value: 'pending_payment', label: 'Pending', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  { value: 'confirmed', label: 'Dikonfirmasi', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
  { value: 'checked_in', label: 'Check-in', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  { value: 'completed', label: 'Selesai', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  { value: 'cancelled', label: 'Batal', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
]

export function BookingTable() {
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const { data: bookings, isLoading } = useAllBookings({ status: statusFilter })
  const { mutate: updateStatus } = useUpdateBookingStatus()

  const handleUpdateStatus = (bookingId: string, status: string) => {
    updateStatus({ bookingId, status })
  }

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-slate-900/50 rounded-2xl border border-slate-800">
         <span className="text-xs font-black italic uppercase tracking-widest text-slate-500 animate-pulse">Memuat Data Booking...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <div className="flex gap-2">
               {STATUS_OPTIONS.map(opt => (
                 <Badge
                    key={opt.value}
                    variant="outline"
                    className={`cursor-pointer transition-all ${statusFilter.includes(opt.value) ? opt.color : 'bg-transparent text-slate-500 border-slate-800 hover:border-slate-700'}`}
                    onClick={() => {
                      setStatusFilter(prev => 
                        prev.includes(opt.value) 
                          ? prev.filter(v => v !== opt.value) 
                          : [...prev, opt.value]
                      )
                    }}
                 >
                    {opt.label}
                 </Badge>
               ))}
            </div>
         </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-slate-900">
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 py-4 italic">Pelanggan</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 py-4 italic">Jadwal</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 py-4 italic">Lapangan</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 py-4 italic">Status</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 py-4 italic text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!bookings || bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-xs font-bold text-slate-600 uppercase tracking-widest italic">
                  Tidak ada booking ditemukan
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => {
                const statusInfo = STATUS_OPTIONS.find(o => o.value === booking.status)
                return (
                  <TableRow key={booking.id} className="border-slate-800 hover:bg-slate-800/30 transition-colors group">
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{booking.users?.full_name}</span>
                        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-tighter">{booking.users?.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-300">
                           <Calendar className="h-3 w-3 text-indigo-500" />
                           {format(new Date(booking.booking_date), 'dd MMM yyyy', { locale: id })}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-300">
                           <Clock className="h-3 w-3 text-indigo-500" />
                           {booking.start_time.slice(0, 5)} - {booking.end_time.slice(0, 5)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white italic">{booking.courts?.name}</span>
                          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-tighter">{booking.courts?.venues?.name}</span>
                       </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${statusInfo?.color} border font-bold text-[10px] uppercase tracking-widest px-2 py-0.5`}>
                        {statusInfo?.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-800 rounded-lg">
                            <MoreHorizontal className="h-4 w-4 text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px] bg-slate-900 border-slate-800">
                          <DropdownMenuItem 
                            className="text-xs font-bold text-green-500 gap-2 cursor-pointer focus:bg-green-500/10 focus:text-green-500"
                            onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                          >
                            <CheckCircle2 className="h-4 w-4" /> Konfirmasi
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-xs font-bold text-blue-500 gap-2 cursor-pointer focus:bg-blue-500/10 focus:text-blue-500"
                            onClick={() => handleUpdateStatus(booking.id, 'checked_in')}
                          >
                            <MapPin className="h-4 w-4" /> Check-in
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-xs font-bold text-slate-400 gap-2 cursor-pointer focus:bg-slate-800/50"
                            onClick={() => handleUpdateStatus(booking.id, 'completed')}
                          >
                            <CheckCircle2 className="h-4 w-4" /> Tandai Selesai
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-xs font-bold text-red-500 gap-2 cursor-pointer focus:bg-red-500/10 focus:text-red-500"
                            onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                          >
                            <XCircle className="h-4 w-4" /> Batalkan
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

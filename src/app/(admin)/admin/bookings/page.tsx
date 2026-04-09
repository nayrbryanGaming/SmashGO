// src/app/(admin)/admin/bookings/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Calendar, MapPin, MoreHorizontal, CheckCircle2, Clock } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const supabase = createClient()

  useEffect(() => {
    async function fetchBookings() {
      const { data } = await supabase
        .from('bookings')
        .select('*, users(full_name, email), courts(name, venues(name))')
        .order('created_at', { ascending: false })
      
      if (data) setBookings(data)
      setIsLoading(false)
    }
    fetchBookings()
  }, [supabase])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return <Badge className="bg-emerald-500/10 text-emerald-400 border-none">Dikonfirmasi</Badge>
      case 'pending_payment': return <Badge className="bg-amber-500/10 text-amber-400 border-none text-[8px] animate-pulse">Menunggu Bayar</Badge>
      case 'checked_in': return <Badge className="bg-indigo-500/20 text-indigo-400 border-none">Sudah Masuk</Badge>
      case 'completed': return <Badge variant="outline" className="text-slate-500 border-slate-700">Selesai</Badge>
      case 'cancelled': return <Badge variant="destructive" className="bg-rose-900/20 text-rose-400 border-none">Dibatalkan</Badge>
      case 'expired': return <Badge variant="secondary" className="bg-slate-800 text-slate-500 border-none">Kadaluwarsa</Badge>
      default: return <Badge>{status}</Badge>
    }
  }

  const filteredBookings = bookings.filter(b => 
    b.users?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.courts?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Manajemen Booking</h1>
            <p className="text-sm text-slate-400">Kelola riwayat dan status pesanan lapangan.</p>
         </div>
         
         <div className="flex w-full md:w-auto gap-3">
            <div className="relative flex-1 md:w-64">
               <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
               <Input 
                 placeholder="Cari user atau lapangan..." 
                 className="pl-10 bg-slate-800 border-slate-700 text-white focus:ring-indigo-500"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            <Button variant="outline" className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 gap-2">
               <Filter className="h-4 w-4" /> Filter
            </Button>
         </div>
      </div>

      <Card className="bg-slate-900 border-slate-800 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-800/50">
              <TableRow>
                <TableHead className="text-slate-400 text-[10px] font-bold uppercase tracking-widest px-6">User / Pemesan</TableHead>
                <TableHead className="text-slate-400 text-[10px] font-bold uppercase tracking-widest px-6">Lapangan & Jadwal</TableHead>
                <TableHead className="text-slate-400 text-[10px] font-bold uppercase tracking-widest px-6">Total Bayar</TableHead>
                <TableHead className="text-slate-400 text-[10px] font-bold uppercase tracking-widest px-6">Status</TableHead>
                <TableHead className="text-slate-400 text-[10px] font-bold uppercase tracking-widest text-right px-6">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse bg-slate-900/50">
                     <TableCell colSpan={5} className="h-16 bg-slate-800/20" />
                  </TableRow>
                ))
              ) : filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                <TableRow key={booking.id} className="hover:bg-slate-800/30 border-slate-800/50 transition-colors group">
                  <TableCell className="px-6 py-4">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-indigo-400">
                           {booking.users?.full_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                           <p className="text-sm font-bold text-white leading-none mb-1">{booking.users?.full_name}</p>
                           <p className="text-[10px] text-slate-500">{booking.users?.email}</p>
                        </div>
                     </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                     <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                           <MapPin className="h-3 w-3 text-indigo-400" /> {booking.courts?.name}
                        </p>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1.5">
                           <Calendar className="h-3 w-3" /> {booking.booking_date} • {booking.start_time.slice(0, 5)} - {booking.end_time.slice(0, 5)}
                        </p>
                     </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                     <p className="text-sm font-black text-white">{formatCurrency(booking.total_price)}</p>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                     {getStatusBadge(booking.status)}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4">
                     <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-white">
                        <MoreHorizontal className="h-4 w-4" />
                     </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                   <TableCell colSpan={5} className="h-64 text-center text-slate-500 font-medium italic">
                      Tidak ada data booking yang sesuai pencarian.
                   </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}

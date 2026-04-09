// src/app/(admin)/admin/dashboard/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, DollarSign, Users, LayoutDashboard, QrCode, ArrowUpRight, ArrowDownRight, Package } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { useRouter } from 'next/navigation'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    revenueToday: 0,
    bookingsToday: 0,
    activeUsers: 0,
    inventoryAlerts: 0
  })
  const [recentBookings, setRecentBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function fetchAdminData() {
      setLoading(true)
      const today = new Date().toISOString().split('T')[0]

      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        router.push('/login')
        return
      }

      // Fetch profile and check role
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()
      
      if (!profile || (profile.role !== 'admin' && profile.role !== 'superadmin')) {
        router.push('/')
        return
      }

      // Fetch Revenue Today
      const { data: payments } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'success')
        .gte('paid_at', today)
      const totalRev = payments?.reduce((acc, curr) => acc + curr.amount, 0) || 0

      // Fetch Bookings Today
      const { count: bookingCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('booking_date', today)
        .neq('status', 'cancelled')

      // Fetch Recent Bookings
      const { data: recent } = await supabase
        .from('bookings')
        .select('*, users(full_name), courts(name)')
        .order('created_at', { ascending: false })
        .limit(5)

      // Fetch Active Users (last 24h)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const { count: activeUsersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('last_seen_at', oneDayAgo)

      // Fetch Inventory Alerts
      const { count: lowStockCount } = await supabase
        .from('inventory')
        .select('*', { count: 'exact', head: true })
        .lte('stock_quantity', 5) // Simple threshold for demo refinement

      setStats({
        revenueToday: totalRev,
        bookingsToday: bookingCount || 0,
        activeUsers: activeUsersCount || 0,
        inventoryAlerts: lowStockCount || 0
      })
      setRecentBookings(recent || [])
      setLoading(false)
    }
    fetchAdminData()
  }, [supabase])

  if (loading) {
    return <div className="flex items-center justify-center p-20 animate-pulse text-indigo-600 font-black">MEMUAT DATA DASHBOARD ADMIN...</div>
  }

  return (
    <div className="p-8 space-y-10 bg-slate-50/50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">ADMIN CONTROL PANEL</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Status Operasional Venue Hari Ini</p>
        </div>
        <div className="flex gap-3">
           <Link href="/admin/checkin">
              <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 h-12 px-6 rounded-2xl font-black transition-all hover:scale-105">
                <QrCode className="mr-2 h-5 w-5" /> SCAN QR CHECK-IN
              </Button>
           </Link>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden group">
            <CardContent className="p-6">
               <div className="flex justify-between items-start">
                  <div className="p-3 bg-emerald-50 rounded-2xl"><DollarSign className="h-6 w-6 text-emerald-600" /></div>
                  <Badge className="bg-emerald-100 text-emerald-700 text-[10px] border-none font-black flex items-center gap-1">
                     +12% <ArrowUpRight className="h-3 w-4" />
                  </Badge>
               </div>
               <div className="mt-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pendapatan Hari Ini</p>
                  <p className="text-3xl font-black text-slate-900">Rp {stats.revenueToday.toLocaleString('id-ID')}</p>
               </div>
            </CardContent>
         </Card>

         <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
            <CardContent className="p-6">
               <div className="flex justify-between items-start">
                  <div className="p-3 bg-indigo-50 rounded-2xl"><Calendar className="h-6 w-6 text-indigo-600" /></div>
               </div>
               <div className="mt-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Booking Terjadwal</p>
                  <p className="text-3xl font-black text-slate-900">{stats.bookingsToday}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Lapangan Terpakai 85%</p>
               </div>
            </CardContent>
         </Card>

         <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
            <CardContent className="p-6">
               <div className="flex justify-between items-start">
                  <div className="p-3 bg-blue-50 rounded-2xl"><Users className="h-6 w-6 text-blue-600" /></div>
               </div>
               <div className="mt-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">User Aktif (24 Jam)</p>
                  <p className="text-3xl font-black text-slate-900">{stats.activeUsers}</p>
               </div>
            </CardContent>
         </Card>

         <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden relative">
            <CardContent className="p-6">
               <div className="flex justify-between items-start">
                  <div className="p-3 bg-rose-50 rounded-2xl"><Package className="h-6 w-6 text-rose-600" /></div>
                  {stats.inventoryAlerts > 0 && <Badge className="bg-rose-500 text-white animate-pulse">ALERT</Badge>}
               </div>
               <div className="mt-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stok Menipis</p>
                  <p className="text-3xl font-black text-rose-600">{stats.inventoryAlerts} Item</p>
               </div>
            </CardContent>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Recent Bookings Table */}
         <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
               <h2 className="text-2xl font-black tracking-tighter text-slate-900">RESERVASI TERBARU</h2>
               <Link href="/admin/bookings" className="text-xs font-black text-indigo-600 hover:underline tracking-widest">SEMUA BOOKING &gt;</Link>
            </div>
            <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden">
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                           <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                           <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Court</th>
                           <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Waktu</th>
                           <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {recentBookings.map((b) => (
                           <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4">
                                 <p className="font-bold text-slate-900 text-sm">{(b.users as any)?.full_name}</p>
                                 <p className="text-[10px] font-medium text-slate-400 italic">{(b.users as any)?.email}</p>
                              </td>
                              <td className="px-6 py-4">
                                 <p className="font-bold text-slate-900 text-sm">{(b.courts as any)?.name}</p>
                              </td>
                              <td className="px-6 py-4">
                                 <p className="font-bold text-slate-900 text-sm">{format(new Date(b.booking_date), 'd MMM')}</p>
                                 <p className="text-[10px] font-black text-indigo-600 uppercase bg-indigo-50 inline-block px-1 rounded">{b.start_time.slice(0, 5)}</p>
                              </td>
                              <td className="px-6 py-4">
                                 <Badge className={`${b.status === 'confirmed' ? 'bg-emerald-500' : b.status === 'pending_payment' ? 'bg-amber-500' : 'bg-slate-400'} text-white border-none font-black text-[10px]`}>
                                    {b.status.toUpperCase().replace('_', ' ')}
                                 </Badge>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </Card>
         </div>

         {/* Sidebar Actions */}
         <div className="space-y-6">
            <Card className="bg-indigo-900 text-white rounded-3xl border-none shadow-2xl relative overflow-hidden group p-1">
               <CardContent className="p-6 space-y-6 relative z-10">
                  <div className="flex items-center gap-3">
                     <div className="p-3 bg-white/10 rounded-2xl"><LayoutDashboard className="h-6 w-6" /></div>
                     <h3 className="text-xl font-black tracking-tighter">SHORTCUT ADMIN</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                     <Link href="/admin/courts" className="w-full">
                        <Button variant="outline" className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white justify-start h-12 rounded-xl font-bold">KONTROL LAPANGAN</Button>
                     </Link>
                     <Link href="/admin/inventory" className="w-full">
                        <Button variant="outline" className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white justify-start h-12 rounded-xl font-bold">MANAJEMEN STOK</Button>
                     </Link>
                     <Link href="/admin/reports" className="w-full">
                        <Button variant="outline" className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white justify-start h-12 rounded-xl font-bold">LAPORAN FINANCE</Button>
                     </Link>
                  </div>
               </CardContent>
            </Card>

            <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-xl flex flex-col items-center text-center space-y-4">
               <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-3xl">💡</div>
               <div className="space-y-1">
                  <p className="font-black text-slate-900 tracking-tighter">TIPS ADMIN</p>
                  <p className="text-xs text-slate-500 font-medium">Jangan lupa untuk men-check ketersediaan lapangan fisik secara berkala untuk mencocokkan status di aplikasi.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}

function Badge({ children, className }: any) {
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${className}`}>
      {children}
    </span>
  )
}

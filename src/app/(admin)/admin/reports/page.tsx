'use client'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RevenueChart } from '@/components/admin/RevenueChart'
import { BookingTable } from '@/components/admin/BookingTable'
import { DollarSign, Calendar, TrendingUp, Users, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns'

export default function AdminReportsPage() {
  const supabase = createClient()

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const now = new Date()
      const firstDay = startOfMonth(now).toISOString()
      
      // Total Revenue this month
      const { data: revenueData } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'success')
        .gte('paid_at', firstDay)
      
      const totalRevenue = revenueData?.reduce((acc, curr) => acc + curr.amount, 0) || 0

      // Total Bookings this month
      const { count: totalBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', firstDay)

      // Active Users
      const { count: activeUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      return { totalRevenue, totalBookings, activeUsers }
    }
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laporan & Analitik</h1>
          <p className="text-muted-foreground">Ikhtisar performa bisnis SmashGo Anda.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pendapatan Bulan Ini</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {stats?.totalRevenue.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground">+12% dari bulan lalu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Booking</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalBookings || '0'}</div>
            <p className="text-xs text-muted-foreground">+5% dari bulan lalu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">User Aktif</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeUsers || '0'}</div>
            <p className="text-xs text-muted-foreground">Karyawan terdaftar</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Tren Pendapatan</CardTitle>
            <CardDescription>Visualisasi pendapatan harian 30 hari terakhir.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
             <RevenueChart />
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>Booking terbaru yang masuk ke sistem.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
               {/* Simplified recent list */}
               {[1,2,3,4].map(i => (
                 <div key={i} className="flex items-center gap-3 border-b pb-3 last:border-0 last:pb-0">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">U{i}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Booking Lapangan A</p>
                      <p className="text-xs text-muted-foreground">Baru saja</p>
                    </div>
                    <div className="text-sm font-bold">Rp 75k</div>
                 </div>
               ))}
             </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Booking Keseluruhan</CardTitle>
        </CardHeader>
        <CardContent>
          <BookingTable />
        </CardContent>
      </Card>
    </div>
  )
}

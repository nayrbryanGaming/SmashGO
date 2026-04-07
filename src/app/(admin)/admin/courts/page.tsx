'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, MapPin, DollarSign, Clock } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function AdminCourtsPage() {
  const supabase = createClient()
  const [courts, setCourts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCourts() {
      const { data } = await supabase
        .from('courts')
        .select('*, venues(name)')
        .order('court_number', { ascending: true })
      
      if (data) setCourts(data)
      setLoading(false)
    }

    fetchCourts()
  }, [])

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'maintenance' : 'active'
    const { error } = await supabase
      .from('courts')
      .update({ status: newStatus })
      .eq('id', id)

    if (!error) {
      setCourts(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c))
      toast({ title: 'Status diperbarui', description: `Lapangan sekarang ${newStatus}.` })
    }
  }

  return (
    <div className="container py-10 space-y-8">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-black">Kelola Lapangan</h1>
          <p className="text-muted-foreground font-medium">Tambah, edit, atau ganti status operasional lapangan.</p>
        </div>
        <Button className="gap-2 font-bold shadow-lg shadow-primary/20">
          <Plus className="h-5 w-5" /> Tambah Lapangan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="col-span-full text-center py-20 animate-pulse text-muted-foreground">Memuat data lapangan...</p>
        ) : (
          courts.map((court) => (
            <Card key={court.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all">
              <div className="aspect-video bg-muted relative">
                {court.photo_url ? (
                  <img src={court.photo_url} alt={court.name} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-50">
                    <MapPin className="h-10 w-10 text-indigo-200" />
                  </div>
                )}
                <Badge className={`absolute top-4 right-4 border-none shadow-lg px-3 py-1 font-black tracking-widest text-[10px] uppercase ${
                  court.status === 'active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {court.status}
                </Badge>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-primary tracking-widest leading-none mb-1">{court.venues.name}</p>
                  <CardTitle className="text-xl font-black leading-tight">{court.name}</CardTitle>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground font-medium">
                    <Clock className="h-4 w-4" /> 06:00 - 23:00
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground font-medium">
                    <DollarSign className="h-4 w-4" /> Rp {court.price_morning.toLocaleString()}/jam
                  </div>
                </div>

                <div className="pt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 font-bold gap-2" onClick={() => toggleStatus(court.id, court.status)}>
                    {court.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

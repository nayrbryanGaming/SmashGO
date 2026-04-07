'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Plus, UserPlus, Shield, UserX, Mail, Phone, MoreVertical } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function AdminStaffPage() {
  const supabase = createClient()
  const [staff, setStaff] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStaff() {
      const { data } = await supabase
        .from('users')
        .select('*')
        .in('role', ['admin', 'superadmin'])
        .order('role', { ascending: false })
      
      if (data) setStaff(data)
      setLoading(false)
    }

    fetchStaff()
  }, [])

  return (
    <div className="container py-10 space-y-8">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-black">Manajemen Staff</h1>
          <p className="text-muted-foreground font-medium">Kelola hak akses admin dan moderator lapangan.</p>
        </div>
        <Button className="gap-2 font-bold shadow-lg shadow-primary/20">
          <UserPlus className="h-5 w-5" /> Undang Staff
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="col-span-full text-center py-20 animate-pulse text-muted-foreground">Memuat data staff...</p>
        ) : (
          staff.map((member) => (
            <Card key={member.id} className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex justify-between items-start">
                  <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                    <AvatarImage src={member.avatar_url} />
                    <AvatarFallback className="bg-primary text-white font-bold">{member.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Badge className={`${member.role === 'superadmin' ? 'bg-purple-600' : 'bg-blue-600'} text-white border-none uppercase font-black text-[10px] tracking-widest`}>
                    {member.role}
                  </Badge>
                </div>
                <div className="pt-2">
                  <CardTitle className="text-xl font-bold">{member.full_name}</CardTitle>
                  <CardDescription className="font-medium text-xs uppercase tracking-tight">{member.division || 'Staff Lapangan'}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" /> {member.email}
                  </div>
                  {member.phone && (
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" /> {member.phone}
                    </div>
                  )}
                </div>

                <div className="pt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 font-bold gap-2">
                    <Shield className="h-4 w-4" /> Kelola Akses
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-600">
                    <UserX className="h-4 w-4" />
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

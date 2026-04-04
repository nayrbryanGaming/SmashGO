'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PlayerStats } from '@/components/profile/PlayerStats'
import { AchievementBadge } from '@/components/profile/AchievementBadge'
import { ELOBadge } from '@/components/matchmaking/ELOBadge'
import { Settings, Edit, LogOut, ChevronRight, Share2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'

export default function ProfilePage() {
  const supabase = createClient()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (data) setProfile(data)
      setLoading(false)
    }

    fetchProfile()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    toast({ title: 'Logged out', description: 'Kamu telah keluar dari SmashGo.' })
  }

  if (loading || !profile) return <div className="py-20 text-center animate-pulse">Memuat profil...</div>

  return (
    <div className="container max-w-2xl py-10 space-y-8">
      {/* Header Profile */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <Avatar className="h-28 w-28 border-4 border-white shadow-2xl">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback className="bg-primary text-white text-3xl font-black">
              {profile.full_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 -right-2">
            <ELOBadge elo={profile.elo_rating} showLabel={false} />
          </div>
        </div>
        
        <div>
          <h1 className="text-3xl font-black text-foreground">{profile.full_name}</h1>
          <p className="text-muted-foreground font-medium">{profile.division || 'Atlet SmashGo'}</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-full gap-2 px-4 font-bold" onClick={() => router.push('/profile/edit')}>
            <Edit className="h-4 w-4" /> Edit Profil
          </Button>
          <Button variant="outline" size="icon" className="rounded-full" onClick={() => {
            navigator.share({ title: 'Profil SmashGo', url: window.location.href })
          }}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="space-y-4">
        <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2 px-1">
          Statistik Karier
        </h2>
        <PlayerStats stats={profile} />
      </div>

      {/* Achievements */}
      <div className="space-y-4">
        <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2 px-1">
          Pencapaian
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          <AchievementBadge type="first_blood" unlockedAt={profile.created_at} />
          <AchievementBadge type="on_fire" unlockedAt={profile.total_wins >= 3 ? profile.updated_at : undefined} />
          <AchievementBadge type="century" unlockedAt={profile.total_matches >= 100 ? profile.updated_at : undefined} />
          <AchievementBadge type="loyalis" unlockedAt={profile.loyalty_points >= 500 ? profile.updated_at : undefined} />
          <AchievementBadge type="sharp_shooter" unlockedAt={profile.total_wins/profile.total_matches >= 0.7 ? profile.updated_at : undefined} />
        </div>
      </div>

      {/* Menu Options */}
      <div className="space-y-3 pt-4">
        <Button variant="ghost" className="w-full justify-between h-14 rounded-2xl px-5 hover:bg-muted font-bold text-base" onClick={() => router.push('/rewards')}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg"><Star className="h-5 w-5 text-yellow-600" /></div>
            Voucher & Reward
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Button>
        
        <Button variant="ghost" className="w-full justify-between h-14 rounded-2xl px-5 hover:bg-muted font-bold text-base">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg"><Settings className="h-5 w-5 text-blue-600" /></div>
            Pengaturan Akun
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Button>

        <Button variant="ghost" className="w-full justify-between h-14 rounded-2xl px-5 hover:bg-red-50 text-red-600 hover:text-red-700 font-bold text-base" onClick={handleLogout}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg"><LogOut className="h-5 w-5 text-red-600" /></div>
            Keluar (Logout)
          </div>
        </Button>
      </div>

      <div className="text-center pt-10">
        <p className="text-xs text-muted-foreground uppercase font-black tracking-widest opacity-30">SmashGo v1.0.0-PROD</p>
      </div>
    </div>
  )
}

'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trophy, Calendar, Users, Activity, ChevronRight, TrendingUp, Award, Zap, Bot } from 'lucide-react'
import Link from 'next/link'
import { eloToSkillLevel, getLoyaltyTier } from '@/lib/elo'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { motion, AnimatePresence } from 'framer-motion'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [activeBookings, setActiveBookings] = useState<any[]>([])
  const [recentMatches, setRecentMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        // Fetch profile
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single()
        setUser(profile)

        // Fetch active bookings
        const { data: bookings } = await supabase
          .from('bookings')
          .select('*, courts(name, venues(name))')
          .eq('user_id', authUser.id)
          .in('status', ['confirmed', 'checked_in'])
          .order('booking_date', { ascending: true })
          .limit(3)
        setActiveBookings(bookings || [])

        // Fetch recent matches
        const { data: matches } = await supabase
          .from('matches')
          .select(`
            *,
            player_a:users!matches_player_a_id_fkey(full_name),
            player_b:users!matches_player_b_id_fkey(full_name)
          `)
          .or(`player_a_id.eq.${authUser.id},player_b_id.eq.${authUser.id}`)
          .eq('status', 'completed')
          .order('completed_at', { ascending: false })
          .limit(5)
        setRecentMatches(matches || [])
      }
      setLoading(false)
    }
    fetchData()
  }, [supabase])

  const skill = user ? eloToSkillLevel(user.elo_rating) : eloToSkillLevel(1000)
  const loyalty = user ? getLoyaltyTier(user.loyalty_points) : getLoyaltyTier(0)
  const winRate = user?.total_matches > 0 ? Math.round((user.total_wins / user.total_matches) * 100) : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-8 pb-20 md:pb-8 max-w-7xl mx-auto min-h-screen bg-slate-50/50">
      {/* Header / Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="relative w-16 h-16 hidden md:block"
            >
              <div className="absolute inset-0 bg-indigo-500 rounded-full animate-pulse opacity-20" />
              <div className="relative z-10 w-full h-full bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Zap className="text-white h-8 w-8 animate-bounce" />
              </div>
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"
              />
            </motion.div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                Halo, {user?.full_name?.split(' ')[0] || 'Juara'}! <span className="animate-bounce inline-block">🏸</span>
              </h1>
              <p className="text-slate-500 text-lg mt-1 font-medium italic">SmashGo bot siap membantumu menang!</p>
            </div>
          </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Link href="/booking" className="flex-1 md:flex-none">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 h-12 px-6 rounded-2xl transition-all hover:scale-[1.02]">
              <Calendar className="mr-2 h-5 w-5" /> Booking Lapangan
            </Button>
          </Link>
          <Link href="/matchmaking" className="flex-1 md:flex-none">
            <Button variant="outline" className="w-full border-slate-200 bg-white shadow-sm h-12 px-6 rounded-2xl transition-all hover:bg-slate-50 hover:scale-[1.02]">
              <Users className="mr-2 h-5 w-5 text-indigo-600" /> Cari Lawan
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-700 delay-150">
        <Card className="bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 text-white border-none shadow-2xl relative overflow-hidden group">
          <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-indigo-100/80 uppercase tracking-wider">ELO RATING</p>
              <div className="p-2 bg-white/20 rounded-xl"><Trophy className="h-5 w-5 text-amber-300" /></div>
            </div>
            <div className="text-4xl font-black">{user?.elo_rating || 1000}</div>
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="secondary" className={`bg-white/20 hover:bg-white/30 border-none text-white text-[10px] font-bold py-1 px-3 rounded-full ${skill.colorClass}`}>
                {skill.label}
              </Badge>
              <p className="text-[10px] font-medium text-indigo-100/70">Level: <span className="text-white uppercase">{skill.level}</span></p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-white group hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">STATISTIK MAIN</p>
              <div className="p-2 bg-emerald-50 rounded-xl"><TrendingUp className="h-5 w-5 text-emerald-500" /></div>
            </div>
            <div className="text-4xl font-black text-slate-900">{user?.total_matches || 0}</div>
            <div className="flex items-center gap-2 mt-4">
               <Zap className="h-3 w-3 text-orange-500 fill-orange-500" />
               <p className="text-xs text-slate-500 font-medium">
                 Win Rate: <span className="text-emerald-600 font-bold">{winRate}%</span>
               </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-white group hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">LOYALTY POINT</p>
              <div className="p-2 bg-amber-50 rounded-xl"><Award className="h-5 w-5 text-amber-500" /></div>
            </div>
            <div className="text-4xl font-black text-slate-900">{user?.loyalty_points || 0}</div>
            <div className="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
               <div className="bg-amber-500 h-full rounded-full transition-all duration-1000" style={{ width: `${loyalty.progress}%` }} />
            </div>
            <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">TIER: <span className="text-amber-600">{loyalty.label}</span></p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-2xl bg-gradient-to-br from-orange-500 to-rose-600 text-white relative overflow-hidden group">
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-orange-100/80 uppercase tracking-wider">WIN STREAK</p>
              <div className="text-2xl animate-pulse">🔥</div>
            </div>
            <div className="text-4xl font-black">{user?.win_streak || 0}</div>
            <p className="text-xs font-bold text-orange-100/70 mt-4 uppercase">Rekor Terbaik: {user?.longest_win_streak || 0}</p>
          </CardContent>
          <div className="absolute bottom-[-10%] left-[-10%] opacity-20 transform rotate-12 transition-transform group-hover:scale-125 duration-700">
             <Trophy className="h-24 w-24" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Bookings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                Pesananku <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 font-bold">{activeBookings.length}</Badge>
              </h2>
              <Link href="/booking" className="text-sm text-indigo-600 font-bold hover:underline flex items-center gap-1 transition-all hover:gap-2">
                Lihat Semua <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-4">
              {activeBookings.length > 0 ? activeBookings.map((b) => (
                <Card key={b.id} className="border border-slate-100 shadow-sm hover:shadow-md transition-all bg-white rounded-2xl group overflow-hidden">
                  <CardContent className="p-5 flex items-center gap-5">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 transition-colors duration-300">
                      <Calendar className="text-indigo-600 h-7 w-7 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 text-lg leading-tight">{b.courts?.venues?.name}</p>
                      <p className="text-sm text-slate-500 font-medium">{b.courts?.name} • {format(new Date(b.booking_date), 'EEEE, d MMM yyyy', { locale: id })}</p>
                      <p className="text-xs text-indigo-600 font-bold bg-indigo-50 inline-block px-2 py-0.5 rounded-md mt-1">
                        {b.start_time.slice(0, 5)} - {b.end_time.slice(0, 5)}
                      </p>
                    </div>
                    <div className="text-right flex flex-col gap-2">
                      <Badge className={`${b.status === 'confirmed' ? 'bg-emerald-500' : 'bg-amber-500'} text-white border-none font-bold px-3`}>
                        {b.status === 'confirmed' ? 'DIBAYAR' : 'MAINKU'}
                      </Badge>
                      <Link href={`/payment/success?id=${b.id}`} className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-tighter transition-colors">
                        TIKET QR &gt;
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <div className="p-16 border-2 border-dashed border-slate-200 rounded-3xl text-center space-y-4 bg-white/50 backdrop-blur-sm">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                    <Calendar className="h-8 w-8 text-slate-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900">Belum ada jadwal main</p>
                    <p className="text-sm text-slate-500">Mulai booking lapangan untuk meningkatkan rating kamu!</p>
                  </div>
                  <Link href="/booking">
                    <Button variant="outline" className="mt-2 font-bold rounded-xl px-6 border-slate-300">Cek Jadwal Lapangan</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Match History */}
          <div className="space-y-4 pt-4">
             <h2 className="text-2xl font-black text-slate-900 tracking-tight">Riwayat Pertandingan</h2>
             <Card className="border border-slate-100 shadow-xl bg-white rounded-3xl overflow-hidden">
                <div className="divide-y divide-slate-50">
                  {recentMatches.length > 0 ? recentMatches.map((m) => (
                    <div key={m.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-lg ${user?.id === m.winner_id ? 'bg-emerald-500 shadow-emerald-100' : 'bg-rose-500 shadow-rose-100'}`}>
                           {user?.id === m.winner_id ? 'W' : 'L'}
                        </div>
                        <div className="grid gap-0.5">
                          <p className="text-sm font-bold text-slate-900">
                             {m.player_a?.full_name} <span className="text-slate-400 mx-1">vs</span> {m.player_b?.full_name}
                          </p>
                          <p className="text-xs text-slate-400 font-medium">{format(new Date(m.completed_at), 'd MMMM yyyy', { locale: id })}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-black ${user?.id === m.winner_id ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {user?.id === m.winner_id ? 'MENANG' : 'KALAH'}
                        </p>
                        <Badge variant="outline" className="text-[10px] font-bold border-slate-200 text-slate-500">
                          {user?.id === m.player_a_id ? (
                            `ELO ${m.player_a_elo_after - m.player_a_elo_before >= 0 ? '+' : ''}${m.player_a_elo_after - m.player_a_elo_before}`
                          ) : (
                            `ELO ${m.player_b_elo_after - m.player_b_elo_before >= 0 ? '+' : ''}${m.player_b_elo_after - m.player_b_elo_before}`
                          )}
                        </Badge>
                      </div>
                    </div>
                  )) : (
                    <div className="p-12 text-center text-sm font-medium text-slate-400">
                      Kamu belum pernah bertanding secara resmi.
                    </div>
                  )}
                </div>
             </Card>
          </div>
        </div>

        {/* Right Column: Leaderboard & Info */}
        <div className="space-y-8">
          <Card className="border-none shadow-2xl bg-indigo-900 text-white rounded-3xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-6 opacity-10 transform scale-150 group-hover:rotate-12 group-hover:scale-[2] transition-all duration-700">
               <Trophy className="h-32 w-32" />
            </div>
            <CardHeader className="relative z-10 pb-2">
               <CardTitle className="text-xl font-black flex items-center gap-2">
                 <Trophy className="h-6 w-6 text-amber-400 fill-amber-400" /> Leaderboard
               </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 px-6 pb-8 space-y-6">
               <p className="text-sm text-indigo-200/80 font-medium">Buktikan kemampuanmu dan jadilah juara perusahaan!</p>
               <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                  <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1">POSISI KAMU</p>
                  <p className="text-3xl font-black tracking-tighter">#42 <span className="text-sm font-bold text-indigo-300">Nasional</span></p>
               </div>
               <Link href="/leaderboard" className="block w-full">
                  <Button variant="secondary" className="w-full bg-white text-indigo-900 hover:bg-slate-100 h-12 rounded-2xl font-black text-sm transition-all shadow-xl shadow-black/20">
                    LIHAT RANKING LENGKAP
                  </Button>
               </Link>
            </CardContent>
          </Card>

          <Card className="border border-slate-100 shadow-xl bg-white rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-50 p-6">
              <CardTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Award className="h-5 w-5 text-indigo-600" /> Pencapaian
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex gap-4 flex-wrap">
                 <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl shadow-sm cursor-help transition-all hover:scale-110" title="First Blood">🥇</div>
                 <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-2xl shadow-sm cursor-help transition-all hover:scale-110" title="Win Streak High">🔥</div>
                 <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl shadow-sm cursor-help opacity-30">🥈</div>
                 <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl shadow-sm cursor-help opacity-30">🥉</div>
              </div>
              <Link href="/profile" className="mt-6 block text-center">
                <Button variant="link" className="px-0 h-auto text-indigo-600 font-bold text-xs uppercase tracking-widest hover:no-underline hover:text-indigo-700">
                  Lihat Semua Koleksi &gt;
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Tip / News */}
          <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-xl space-y-3 relative overflow-hidden">
             <div className="absolute right-[-10%] bottom-[-10%] opacity-10">
                <Zap className="h-32 w-32" />
             </div>
             <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">SMASH TIP</p>
             <p className="text-sm font-bold leading-snug">Sering bermain dengan lawan yang memiliki ELO lebih tinggi untuk mendapatkan poin kemenangan lebih besar!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

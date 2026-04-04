'use client'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Trophy, Medal, Award, TrendingUp, Users, Zap, Target } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion, AnimatePresence } from 'framer-motion'
import { eloToSkillLevel, getLoyaltyTier } from '@/lib/elo'

export default function LeaderboardPage() {
  const supabase = createClient()

  const { data: eloRankings, isLoading: isLoadingElo } = useQuery({
    queryKey: ['leaderboard-elo'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, avatar_url, elo_rating, skill_level, division')
        .order('elo_rating', { ascending: false })
        .limit(50)
      if (error) throw error
      return data
    }
  })

  const { data: loyaltyRankings, isLoading: isLoadingLoyalty } = useQuery({
    queryKey: ['leaderboard-loyalty'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, avatar_url, loyalty_points, loyalty_tier, division')
        .order('loyalty_points', { ascending: false })
        .limit(50)
      if (error) throw error
      return data
    }
  })

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <div className="p-2 bg-yellow-400 rounded-lg shadow-lg shadow-yellow-100"><Trophy className="h-5 w-5 text-white" /></div>
      case 1: return <div className="p-2 bg-slate-400 rounded-lg shadow-lg shadow-slate-100"><Medal className="h-5 w-5 text-white" /></div>
      case 2: return <div className="p-2 bg-amber-600 rounded-lg shadow-lg shadow-amber-100"><Award className="h-5 w-5 text-white" /></div>
      default: return <span className="text-sm font-black text-slate-400 w-9 text-center">#{index + 1}</span>
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  }

  const item = {
    hidden: { x: -20, opacity: 0 },
    show: { x: 0, opacity: 1 }
  }

  return (
    <div className="p-4 md:p-8 space-y-8 pb-32 max-w-5xl mx-auto min-h-screen bg-slate-50/30">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-indigo-500 decoration-4 underline-offset-4">Papan Peringkat</h1>
        </div>
        <p className="text-slate-500 font-medium ml-2">Daftar pemain elit dan loyal di SmashGo.</p>
      </motion.div>

      <Tabs defaultValue="elo" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-14 p-1 bg-slate-100 rounded-2xl mb-8">
          <TabsTrigger value="elo" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
            <Zap className="h-4 w-4 mr-2 text-indigo-600" /> ELO RATING
          </TabsTrigger>
          <TabsTrigger value="loyalty" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
            <Award className="h-4 w-4 mr-2 text-amber-500" /> POIN LOYALITAS
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="elo" className="mt-0 outline-none">
            {isLoadingElo ? (
               <div className="space-y-4">
                  {[1, 2, 3, 4, 5, 10].map(i => <div key={i} className="h-20 w-full bg-slate-100 animate-pulse rounded-2xl" />)}
               </div>
            ) : (
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-3"
              >
                {eloRankings?.map((user, index) => (
                  <motion.div 
                    key={user.id} 
                    variants={item}
                    className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all group"
                  >
                    <div className="w-10 flex justify-center shrink-0">
                      {getRankIcon(index)}
                    </div>
                    <Avatar className="h-12 w-12 border-2 border-slate-100 group-hover:border-indigo-500 transition-colors">
                      <AvatarImage src={user.avatar_url || ''} className="object-cover" />
                      <AvatarFallback className="bg-indigo-50 text-indigo-600 font-bold">{user.full_name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{user.full_name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="text-[10px] h-4 bg-slate-50 border-slate-200 text-slate-500 font-bold uppercase tracking-tighter">
                          {user.division}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-2xl font-black text-slate-900 leading-none">{user.elo_rating}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{user.skill_level}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="loyalty" className="mt-0 outline-none">
            {isLoadingLoyalty ? (
               <div className="space-y-4">
                  {[1, 2, 3, 4, 5, 10].map(i => <div key={i} className="h-20 w-full bg-slate-100 animate-pulse rounded-2xl" />)}
               </div>
            ) : (
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-3"
              >
                {loyaltyRankings?.map((user, index) => (
                  <motion.div 
                    key={user.id} 
                    variants={item}
                    className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all group"
                  >
                    <div className="w-10 flex justify-center shrink-0">
                      {getRankIcon(index)}
                    </div>
                    <Avatar className="h-12 w-12 border-2 border-slate-100 group-hover:border-amber-500 transition-colors">
                      <AvatarImage src={user.avatar_url || ''} className="object-cover" />
                      <AvatarFallback className="bg-amber-50 text-amber-600 font-bold">{user.full_name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-slate-900 group-hover:text-amber-600 transition-colors uppercase tracking-tight">{user.full_name}</p>
                      <Badge variant="outline" className="text-[10px] h-4 mt-0.5 bg-slate-50 border-slate-200 text-slate-500 font-bold uppercase tracking-tighter">
                        {user.division}
                      </Badge>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center justify-end gap-1.5">
                        <Award className="h-5 w-5 text-amber-500" />
                        <p className="text-2xl font-black text-slate-900 leading-none">{user.loyalty_points}</p>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{user.loyalty_tier}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Gift, Star, Clock, ArrowRight, Loader2, Sparkles, Zap, Trophy } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { getLoyaltyTier } from '@/lib/elo'

export default function RewardsPage() {
  const [user, setUser] = useState<any>(null)
  const [rewards, setRewards] = useState<any[]>([])
  const [loading, setLoading] = useState<string | null>(null)
  const [fetching, setFetching] = useState(true)
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchData() {
      setFetching(true)
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const { data: profile } = await supabase.from('users').select('*').eq('id', authUser.id).single()
        setUser(profile)

        const { data: rewardsData } = await supabase.from('rewards').select('*').eq('is_active', true)
        setRewards(rewardsData || [])
      }
      setFetching(false)
    }
    fetchData()
  }, [supabase])

  const handleRedeem = async (rewardId: string, cost: number, rewardName: string) => {
    if (!user || user.loyalty_points < cost) {
      toast({ 
        title: 'Poin Tidak Cukup', 
        description: `Kamu butuh ${cost - (user?.loyalty_points || 0)} poin lagi untuk menukar ${rewardName}.`, 
        variant: 'destructive' 
      })
      return
    }

    setLoading(rewardId)
    try {
      const res = await fetch('/api/rewards/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reward_id: rewardId })
      })

      const result = await res.json()

      if (res.ok) {
        setUser((prev: any) => ({ ...prev, loyalty_points: prev.loyalty_points - cost }))
        toast({ 
          title: 'Penukaran Berhasil! 🎉', 
          description: `Voucher ${rewardName} telah ditambahkan ke akunmu. Kode: ${result.voucher_code || 'PROMO-SMASH'}`,
        })
      } else {
        throw new Error(result.error || 'Gagal menukar hadiah')
      }
    } catch (err: any) {
      toast({ title: 'Gagal Menukar', description: err.message, variant: 'destructive' })
    } finally {
      setLoading(null)
    }
  }

  const loyalty = user ? getLoyaltyTier(user.loyalty_points) : getLoyaltyTier(0)

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-10 pb-32 max-w-5xl mx-auto">
      {/* Points Hero Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden group border border-white/5"
      >
        <div className="absolute top-[-20%] right-[-10%] opacity-20 transform rotate-12 transition-transform group-hover:scale-125 duration-1000">
          <Gift size={300} strokeWidth={1} className="text-indigo-500" />
        </div>
        <div className="relative z-10 space-y-6">
          <div>
            <p className="text-indigo-400 font-black uppercase tracking-[0.2em] text-xs mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> SALDO POIN SMASHGO
            </p>
            <div className="flex items-baseline gap-3">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter tabular-nums text-white">
                {user?.loyalty_points || 0}
              </h1>
              <span className="text-xl md:text-2xl font-bold text-slate-400">PTS</span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-6 pt-4 border-t border-white/10">
             <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/20 rounded-2xl">
                   <Trophy className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">TIER SAAT INI</p>
                   <p className="text-lg font-black uppercase text-amber-500">{loyalty.label}</p>
                </div>
             </div>
             <div className="flex-1 space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                   <span>Progress Tier</span>
                   <span>{loyalty.progress}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${loyalty.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" 
                  />
                </div>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Rewards Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 italic uppercase">
            Katalog Hadiah
          </h2>
          <Badge variant="outline" className="border-slate-200 text-slate-500 font-bold px-3 py-1 bg-white">
            {rewards.length} ITEM TERSEDIA
          </Badge>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {rewards.length > 0 ? rewards.map((reward) => (
            <Card key={reward.id} className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300 bg-white rounded-3xl group flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-indigo-50 transition-colors duration-300">
                    {reward.reward_type === 'discount' && <Zap className="h-6 w-6 text-indigo-600" />}
                    {reward.reward_type === 'merchandise' && <Gift className="h-6 w-6 text-indigo-600" />}
                    {reward.reward_type === 'free_booking' && <Star className="h-6 w-6 text-indigo-600" />}
                    {!['discount', 'merchandise', 'free_booking'].includes(reward.reward_type) && <Sparkles className="h-6 w-6 text-indigo-600" />}
                  </div>
                  <Badge className="bg-amber-100 text-amber-700 border-none font-black px-3 py-1 rounded-lg">
                    {reward.points_cost} PTS
                  </Badge>
                </div>
                <CardTitle className="text-xl font-black text-slate-900 mt-4 uppercase tracking-tight">{reward.name}</CardTitle>
                <CardDescription className="text-slate-500 font-medium leading-relaxed">{reward.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1" />
              <CardFooter className="pt-0 p-6">
                <Button 
                  className={`w-full h-12 rounded-2xl font-black text-xs uppercase tracking-[0.1em] transition-all group overflow-hidden ${user?.loyalty_points >= reward.points_cost ? 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`} 
                  disabled={loading !== null || user?.loyalty_points < reward.points_cost}
                  onClick={() => handleRedeem(reward.id, reward.points_cost, reward.name)}
                >
                  {loading === reward.id ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <div className="flex items-center gap-2">
                       {user?.loyalty_points >= reward.points_cost ? 'Tukarkan Poin' : 'Poin Tidak Cukup'}
                       <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )) : (
            <div className="col-span-full p-20 text-center bg-white border border-dashed border-slate-200 rounded-[2.5rem]">
               <Gift className="h-12 w-12 text-slate-200 mx-auto mb-4" />
               <p className="font-bold text-slate-900">Belum ada pilihan hadiah.</p>
               <p className="text-slate-500 text-sm">Cek kembali nanti untuk update katalog hadiah kami.</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* History Note */}
      <div className="flex items-center gap-3 p-6 bg-slate-50 rounded-2xl border border-slate-100">
         <Clock className="h-5 w-5 text-slate-400" />
         <p className="text-xs text-slate-500 font-medium italic">
            Poin didapat dari kemenangan pertandingan (+5), kekalahan (+2), dan booking lapangan (+10).
         </p>
      </div>
    </div>
  )
}

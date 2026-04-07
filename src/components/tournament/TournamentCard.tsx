// src/components/tournament/TournamentCard.tsx
'use client'
import { 
  Trophy, 
  Users, 
  Calendar, 
  MapPin, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import Link from 'next/link'

interface TournamentCardProps {
  tournament: {
    id: string
    name: string
    description: string
    match_type: string
    format: string
    max_participants: number
    current_participants: number
    registration_deadline: string
    start_date: string
    venue_id: string
    status: string
    prize_description: string
    entry_fee: number
    venues: {
      name: string
      city: string
    }
  }
}

export function TournamentCard({ tournament }: TournamentCardProps) {
  const isRegistrationOpen = new Date(tournament.registration_deadline) > new Date() && tournament.status === 'open'
  const isFull = tournament.current_participants >= tournament.max_participants

  return (
    <Card className="bg-slate-900 border-slate-800 hover:border-indigo-500/50 transition-all group overflow-hidden shadow-2xl">
      <div className="h-2 bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-600" />
      
      <CardHeader className="space-y-2">
        <div className="flex justify-between items-start">
           <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 font-black italic uppercase tracking-widest text-[9px]">
             {tournament.match_type.replace('_', ' ')}
           </Badge>
           <Badge className={`font-black uppercase tracking-widest text-[9px] ${
             tournament.status === 'open' ? 'bg-green-500' : 
             tournament.status === 'ongoing' ? 'bg-blue-500' : 'bg-slate-700'
           }`}>
             {tournament.status === 'open' ? 'Pendaftaran Dibuka' : 
              tournament.status === 'ongoing' ? 'Sedang Berlangsung' : 'Selesai'}
           </Badge>
        </div>
        <CardTitle className="text-xl font-black italic uppercase tracking-tighter text-white group-hover:text-indigo-400 transition-colors">
          {tournament.name}
        </CardTitle>
        <CardDescription className="text-slate-400 text-xs font-medium line-clamp-2 leading-relaxed">
          {tournament.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            <Calendar className="h-3 w-3 text-indigo-500" />
            {format(new Date(tournament.start_date), 'dd MMM yyyy', { locale: id })}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            <MapPin className="h-3 w-3 text-indigo-500" />
            {tournament.venues?.name}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            <Users className="h-3 w-3 text-indigo-500" />
            {tournament.current_participants}/{tournament.max_participants} Pemain
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            <Trophy className="h-3 w-3 text-indigo-500" />
            {tournament.prize_description || 'Trophy + Medali'}
          </div>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/50 flex items-center justify-between">
           <span className="text-[10px] font-black italic uppercase tracking-widest text-slate-500">Biaya Pendaftaran</span>
           <span className="text-sm font-black italic uppercase tracking-tighter text-white">
             {tournament.entry_fee === 0 ? 'GRATIS' : `Rp ${tournament.entry_fee.toLocaleString()}`}
           </span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button 
          asChild 
          className={`w-full group/btn font-black italic uppercase tracking-widest shadow-lg transition-all ${
            isRegistrationOpen && !isFull 
              ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/20' 
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Link href={isRegistrationOpen && !isFull ? `/tournament/${tournament.id}/register` : '#'}>
            {isFull ? 'SUDAH PENUH' : !isRegistrationOpen ? 'PENDAFTARAN TUTUP' : 'DAFTAR SEKARANG'} 
            {isRegistrationOpen && !isFull && <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

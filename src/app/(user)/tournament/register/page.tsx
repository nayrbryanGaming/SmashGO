'use client'
import { useSearchParams } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { Trophy, Users, Info } from 'lucide-react'

export default function TournamentRegisterPage() {
  const searchParams = useSearchParams()
  const tournamentId = searchParams.get('id')
  const supabase = createClient()
  const { toast } = useToast()
  const router = useRouter()

  const { data: tournament, isLoading } = useQuery({
    queryKey: ['tournament', tournamentId],
    queryFn: async () => {
      if (!tournamentId) return null
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', tournamentId)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!tournamentId
  })

  const registerMutation = useMutation({
    mutationFn: async (formData: { partner_email?: string }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      let partnerId = null
      if (formData.partner_email) {
        const { data: partner, error: partnerError } = await supabase
          .from('users')
          .select('id')
          .eq('email', formData.partner_email)
          .single()
        if (partnerError) throw new Error('Partner tidak ditemukan. Pastikan email benar.')
        partnerId = partner.id
      }

      const { error } = await supabase
        .from('tournament_participants')
        .insert({
          tournament_id: tournamentId,
          user_id: user.id,
          partner_id: partnerId,
          status: 'registered'
        })
      if (error) throw error
    },
    onSuccess: () => {
      toast({ title: 'Berhasil!', description: 'Pendaftaran turnamen berhasil dikirim.' })
      router.push(`/tournament/${tournamentId}`)
    },
    onError: (error: any) => {
      toast({ variant: 'destructive', title: 'Gagal Daftar', description: error.message })
    }
  })

  if (!tournamentId) return <div className="p-8 text-center">ID Turnamen tidak ditemukan.</div>
  if (isLoading) return <div className="p-8 animate-pulse bg-muted h-64 rounded-xl m-4" />

  return (
    <div className="p-4 space-y-6 pb-20">
      <div className="flex flex-col gap-1 text-center py-4">
        <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
        <h1 className="text-2xl font-bold tracking-tight uppercase italic text-primary">Pendaftaran Turnamen</h1>
        <p className="text-muted-foreground">{tournament?.name}</p>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">Informasi Peserta</CardTitle>
          <CardDescription>Lengkapi data di bawah ini untuk mendaftar.</CardDescription>
        </CardHeader>
        <form onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          registerMutation.mutate({ partner_email: formData.get('partner_email') as string })
        }}>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg flex items-start gap-3 border">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-semibold">Ketentuan Turnamen:</p>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>Tipe: {tournament?.match_type.replace('_', ' ').toUpperCase()}</li>
                  <li>Biaya: {tournament?.entry_fee > 0 ? `Rp ${tournament.entry_fee.toLocaleString()}` : 'GRATIS'}</li>
                  <li>Sisa Slot: {tournament?.max_participants - tournament?.current_participants}</li>
                </ul>
              </div>
            </div>

            {tournament?.match_type !== 'singles' && (
              <div className="space-y-2">
                <Label htmlFor="partner_email">Email Partner</Label>
                <Input 
                  id="partner_email" 
                  name="partner_email" 
                  placeholder="partner@perusahaan.com" 
                  required 
                />
                <p className="text-[10px] text-muted-foreground italic">Partner harus sudah terdaftar di SmashGo.</p>
              </div>
            )}
            
            <div className="flex items-center gap-2 p-2 bg-yellow-500/5 text-yellow-600 rounded text-xs border border-yellow-500/20">
              <Info className="h-4 w-4 shrink-0" />
              <span>Dengan mendaftar, Anda setuju untuk mengikuti peraturan turnamen.</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full text-lg h-12 shadow-lg shadow-primary/20" 
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? 'Memproses...' : 'Daftar Sekarang'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

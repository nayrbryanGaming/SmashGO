// src/app/(auth)/verify/page.tsx
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

export default function VerifyPage() {
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const { toast } = useToast()

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsLoading(true)

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'signup',
    })

    if (error) {
      toast({
        title: 'Verifikasi Gagal',
        description: error.message,
        variant: 'destructive',
      })
      setIsLoading(false)
    } else {
      toast({
        title: 'Verifikasi Berhasil',
        description: 'Selamat bermain di SmashGo!',
      })
      router.push('/dashboard')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-indigo-500 via-primary to-purple-600">
      <Card className="w-full max-w-md shadow-2xl backdrop-blur-sm bg-background/95 border-none">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Verifikasi Email</CardTitle>
          <CardDescription>
            Masukkan 6 digit kode OTP yang dikirim ke {email}.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleVerify}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="otp">Kode OTP</Label>
              <Input
                id="otp"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="bg-muted/50 border-muted-foreground/10 focus:bg-background text-center text-2xl tracking-[1em] font-bold h-14"
                maxLength={6}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full h-11 font-bold shadow-lg shadow-primary/20" disabled={isLoading}>
              {isLoading ? 'Sedang Verifikasi...' : 'Verifikasi Akun'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Tidak menerima kode?{' '}
              <button 
                type="button" 
                className="text-primary hover:underline font-medium"
                onClick={() => toast({ title: 'OTP Dikirim Ulang', description: 'Silakan cek email kamu kembali.' })}
              >
                Kirim ulang
              </button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

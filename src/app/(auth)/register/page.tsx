// src/app/(auth)/register/page.tsx
'use client'
import { useState, useEffect } from 'react'

export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { UserPlus, User, Mail, Lock, Building, CreditCard, ArrowRight, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    employeeId: '',
    division: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <Loader2 className="animate-spin h-10 w-10 text-indigo-600" />
    </div>
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          employee_id: formData.employeeId,
          division: formData.division,
        }
      }
    })

    if (error) {
      toast({ title: 'Registrasi Gagal', description: error.message, variant: 'destructive' })
      setIsLoading(false)
    } else {
      toast({ title: 'Berhasil Daftar', description: 'Cek email kamu untuk verifikasi.', variant: 'default' })
      router.push('/verify')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden py-12">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
         <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px] animate-pulse" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <Card className="w-full max-w-xl bg-slate-900 border-slate-800 shadow-2xl relative z-10 animate-in slide-in-from-bottom-4 duration-700">
        <CardHeader className="space-y-4 pt-8 text-center">
          <div className="w-16 h-16 bg-slate-950 rounded-3xl mx-auto flex items-center justify-center shadow-2xl border border-slate-800 rotate-12 transform hover:rotate-0 transition-transform duration-500">
            <UserPlus className="text-indigo-400 h-8 w-8" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-black text-white italic tracking-tighter uppercase uppercase">DAFTAR SMASHGO</CardTitle>
            <CardDescription className="text-slate-400 font-medium max-w-[280px] mx-auto">Bergabung dengan komunitas bulutangkis perusahaan.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
             <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1" htmlFor="fullName">Nama Lengkap</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                    <Input 
                      id="fullName" 
                      placeholder="John Kehed" 
                      className="bg-slate-950 border-slate-800 text-white pl-10 h-10 focus:ring-indigo-600 focus:border-indigo-600" 
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1" htmlFor="email">Email Kerja</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="name@company.com" 
                      className="bg-slate-950 border-slate-800 text-white pl-10 h-10 focus:ring-indigo-600 focus:border-indigo-600" 
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1" htmlFor="password">Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                    <Input 
                      id="password" 
                      type="password" 
                      className="bg-slate-950 border-slate-800 text-white pl-10 h-10 focus:ring-indigo-600 focus:border-indigo-600" 
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
             </div>

             <div className="space-y-4 border-t md:border-t-0 md:border-l border-slate-800/50 pt-4 md:pt-0 md:pl-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1" htmlFor="employeeId">ID Karyawan</Label>
                  <div className="relative group">
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                    <Input 
                      id="employeeId" 
                      placeholder="SMG-2024-XXX" 
                      className="bg-slate-950 border-slate-800 text-white pl-10 h-10 focus:ring-indigo-600 focus:border-indigo-600" 
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1" htmlFor="division">Divisi / Departemen</Label>
                  <div className="relative group">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                    <Input 
                      id="division" 
                      placeholder="Human Resource" 
                      className="bg-slate-950 border-slate-800 text-white pl-10 h-10 focus:ring-indigo-600 focus:border-indigo-600" 
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 h-14 font-black italic uppercase tracking-widest shadow-xl shadow-indigo-900/40 group mt-auto"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                      <>Daftar Akun <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </Button>
                </div>
             </div>
          </form>
        </CardContent>
        <CardFooter className="pb-8 pt-4 flex flex-col gap-4 border-t border-slate-800">
           <p className="text-center text-[11px] text-slate-500 font-medium pt-4">
              Sudah punya akun? <Link href="/login" className="text-indigo-400 font-bold hover:underline">Masuk di sini</Link>
           </p>
           <div className="px-6 py-3 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 text-center">
              <p className="text-[9px] text-indigo-400/60 font-medium uppercase tracking-widest">Dengan mendaftar, kamu setuju dengan aturan main SmashGo.</p>
           </div>
        </CardFooter>
      </Card>
    </div>
  )
}

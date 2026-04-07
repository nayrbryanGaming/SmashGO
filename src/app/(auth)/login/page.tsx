// src/app/(auth)/login/page.tsx
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { LogIn, Github, Mail, Lock, Loader2, ArrowRight } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast({ title: 'Login Gagal', description: error.message, variant: 'destructive' })
      setIsLoading(false)
    } else {
      toast({ title: 'Berhasil Masuk', description: 'Selamat datang kembali!', variant: 'default' })
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px] animate-pulse" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <Card className="w-full max-w-md bg-slate-900 border-slate-800 shadow-2xl relative z-10 animate-in zoom-in-95 duration-500">
        <CardHeader className="space-y-3 pt-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-900/40 rotate-3 transform hover:rotate-0 transition-transform">
            <LogIn className="text-white h-7 w-7" />
          </div>
          <div className="text-center space-y-1">
            <CardTitle className="text-3xl font-black text-white italic tracking-tighter uppercase uppercase">SMASHGO LOGIN</CardTitle>
            <CardDescription className="text-slate-400 font-medium">Masuk untuk mulai bermain dan mengelola lapangan.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1" htmlFor="email">Email Perusahaan</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@company.com" 
                  className="bg-slate-950 border-slate-800 text-white pl-10 h-10 focus:ring-indigo-600" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                 <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest" htmlFor="password">Password</Label>
                 <Link href="/forgot" className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300">LUPA?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <Input 
                  id="password" 
                  type="password" 
                  className="bg-slate-950 border-slate-800 text-white pl-10 h-10 focus:ring-indigo-600" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 font-black italic uppercase tracking-widest shadow-xl shadow-indigo-900/20 group"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                 <>MULAI BERMAIN <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" /></>
              )}
            </Button>
          </form>

          <div className="relative h-px bg-slate-800 my-4">
             <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">ATAU</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <Button variant="outline" className="border-slate-800 bg-slate-950 text-white hover:bg-slate-800 gap-2 text-xs font-bold font-bold h-10 h-10">
                <Github className="h-4 w-4" /> GITHUB
             </Button>
             <Button variant="outline" className="border-slate-800 bg-slate-950 text-white hover:bg-slate-800 gap-2 text-xs font-bold font-bold h-10 h-10">
                <Mail className="h-4 w-4" /> GOOGLE
             </Button>
          </div>
        </CardContent>
        <CardFooter className="pb-8 pt-2 flex flex-col gap-4">
           <p className="text-center text-xs text-slate-500 font-medium">
              Belum punya akun? <Link href="/register" className="text-indigo-400 font-bold hover:underline">Daftar Sekarang</Link>
           </p>
           <div className="px-6 py-3 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 text-center">
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-tighter">Login khusus untuk Internal Perusahaan</p>
           </div>
        </CardFooter>
      </Card>
    </div>
  )
}

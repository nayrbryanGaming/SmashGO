'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AvatarUpload } from '@/components/profile/AvatarUpload'
import { toast } from '@/components/ui/use-toast'
import { Loader2, ArrowLeft } from 'lucide-react'

const profileSchema = z.object({
  full_name: z.string().min(3, 'Nama minimal 3 karakter'),
  phone: z.string().optional(),
  division: z.string().min(1, 'Divisi wajib diisi'),
  skill_level: z.enum(['pemula', 'menengah', 'mahir', 'master']),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function EditProfilePage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<any>(null)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
      phone: '',
      division: '',
      skill_level: 'pemula',
    },
  })

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (data) {
        setProfile(data)
        form.reset({
          full_name: data.full_name,
          phone: data.phone || '',
          division: data.division || '',
          skill_level: data.skill_level || 'pemula',
        })
      }
      setLoading(false)
    }

    fetchProfile()
  }, [])

  async function onSubmit(data: ProfileFormValues) {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('users')
        .update(data)
        .eq('id', profile.id)

      if (error) throw error

      toast({ title: 'Berhasil', description: 'Profil kamu telah diperbarui.' })
      router.push('/profile')
    } catch (err: any) {
      toast({ title: 'Gagal update', description: err.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  if (loading || !profile) return <div className="py-20 text-center animate-pulse">Memuat...</div>

  return (
    <div className="container max-w-xl py-10 space-y-8">
      <Button variant="ghost" onClick={() => router.back()} className="gap-2 -ml-2 text-muted-foreground font-bold">
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Button>

      <div className="space-y-2">
        <h1 className="text-3xl font-black">Edit Profil</h1>
        <p className="text-muted-foreground">Perbarui informasi diri dan tingkat keahlianmu.</p>
      </div>

      <div className="bg-muted/30 p-8 rounded-3xl border-2 border-dashed border-muted flex justify-center">
        <AvatarUpload 
          userId={profile.id} 
          currentUrl={profile.avatar_url} 
          onUploadComplete={(url) => setProfile({ ...profile, avatar_url: url })}
        />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap</FormLabel>
                <FormControl><Input {...field} className="h-12 rounded-xl" /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor Telepon</FormLabel>
                <FormControl><Input {...field} className="h-12 rounded-xl" /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="division"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Divisi / Departemen</FormLabel>
                <FormControl><Input {...field} className="h-12 rounded-xl" placeholder="Contoh: IT, Marketing, HR" /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="skill_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tingkat Keahlian</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Pilih level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pemula">Pemula (Beginner)</SelectItem>
                    <SelectItem value="menengah">Menengah (Intermediate)</SelectItem>
                    <SelectItem value="mahir">Mahir (Advanced)</SelectItem>
                    <SelectItem value="master">Master (Pro)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Gunakan level yang jujur untuk matchmaking yang lebih adil.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={saving} className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20">
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Simpan Perubahan'}
          </Button>
        </form>
      </Form>
    </div>
  )
}

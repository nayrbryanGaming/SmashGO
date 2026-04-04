'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Camera, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'

interface AvatarUploadProps {
  userId: string
  currentUrl?: string
  onUploadComplete?: (newUrl: string) => void
}

export function AvatarUpload({ userId, currentUrl, onUploadComplete }: AvatarUploadProps) {
  const supabase = createClient()
  const { toast } = useToast()
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(currentUrl)

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Pilih gambar untuk diunggah.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${userId}/avatar.${fileExt}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update User Profile
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', userId)

      if (updateError) throw updateError

      setPreviewUrl(publicUrl)
      if (onUploadComplete) onUploadComplete(publicUrl)
      
      toast({
        title: 'Berhasil!',
        description: 'Foto profil telah diperbarui.',
      })
    } catch (error: any) {
      toast({
        title: 'Gagal mengunggah',
        description: error.message || 'Terjadi kesalahan saat mengunggah foto.',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="h-24 w-24 rounded-full overflow-hidden border-4 border-background shadow-xl"
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center">
              <Camera className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </motion.div>
        
        <label 
          htmlFor="avatar-upload" 
          className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
        >
          {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Camera className="h-6 w-6" />}
        </label>
        
        <input
          type="file"
          id="avatar-upload"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
      </div>
      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
        {uploading ? 'Mengunggah...' : 'Ketuk untuk ganti foto'}
      </p>
    </div>
  )
}

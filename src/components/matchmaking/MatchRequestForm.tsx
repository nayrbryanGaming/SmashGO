'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { CalendarIcon, Loader2, Search } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'

const matchmakingSchema = z.object({
  match_type: z.enum(['singles', 'doubles', 'mixed_doubles']),
  preferred_date: z.date().optional(),
  preferred_time_start: z.string().optional(),
  preferred_time_end: z.string().optional(),
  venue_id: z.string().optional(),
})

type MatchmakingFormValues = z.infer<typeof matchmakingSchema>

interface MatchRequestFormProps {
  venues: any[]
  onSubmit: (values: MatchmakingFormValues) => Promise<void>
}

export function MatchRequestForm({ venues, onSubmit }: MatchRequestFormProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<MatchmakingFormValues>({
    resolver: zodResolver(matchmakingSchema),
    defaultValues: {
      match_type: 'singles',
    },
  })

  async function handleSubmit(data: MatchmakingFormValues) {
    setLoading(true)
    try {
      await onSubmit(data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="match_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis Pertandingan</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Pilih jenis pertandingan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="singles">Singles (1 vs 1)</SelectItem>
                  <SelectItem value="doubles">Doubles (2 vs 2)</SelectItem>
                  <SelectItem value="mixed_doubles">Mixed Doubles</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preferred_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Tanggal Bermain (Opsional)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "h-12 pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: id })
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0)) || date > new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Bisa dikosongkan jika fleksibel.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="venue_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lokasi Lapangan (Opsional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Semua Lokasi" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="null">Semua Lokasi</SelectItem>
                  {venues.map((venue) => (
                    <SelectItem key={venue.id} value={venue.id}>
                      {venue.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading} className="w-full h-12 text-lg gap-2 shadow-lg hover:scale-[1.02] transition-transform">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
          Cari Lawan Sekarang
        </Button>
      </form>
    </Form>
  )
}

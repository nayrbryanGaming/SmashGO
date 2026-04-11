import { z } from 'zod'

export const bookingSchema = z.object({
  court_id: z.string().uuid(),
  booking_date: z.date({
    message: "Pilih tanggal booking.",
  }),
  start_time: z.string({
    message: "Pilih jam mulai.",
  }),
  end_time: z.string({
    message: "Pilih jam selesai.",
  }),
  duration_hours: z.number().min(1).max(5),
})

export const matchmakingSchema = z.object({
  match_type: z.enum(['singles', 'doubles', 'mixed_doubles']),
  preferred_date: z.date().optional(),
  preferred_time_start: z.string().optional(),
  venue_id: z.string().uuid().optional(),
})

export const userProfileSchema = z.object({
  full_name: z.string().min(3, "Nama minimal 3 karakter."),
  phone: z.string().optional(),
  division: z.string().min(2, "Divisi minimal 2 karakter."),
  skill_level: z.enum(['pemula', 'menengah', 'mahir', 'master']),
})

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid."),
  password: z.string().min(6, "Password minimal 6 karakter."),
})

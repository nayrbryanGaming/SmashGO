import { z } from "zod";

export const BookingSchema = z.object({
  court_id: z.string().uuid("ID Lapangan tidak valid"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid (YYYY-MM-DD)"),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, "Format jam mulai tidak valid (HH:mm)"),
  end_time: z.string().regex(/^\d{2}:\d{2}$/, "Format jam selesai tidak valid (HH:mm)"),
});

export const MatchmakingSchema = z.object({
  skill_level: z.number().int().min(1).max(3, "Skill level harus antara 1-3"),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, "Format jam mulai tidak valid"),
  end_time: z.string().regex(/^\d{2}:\d{2}$/, "Format jam selesai tidak valid"),
});

export type BookingInput = z.infer<typeof BookingSchema>;
export type MatchmakingInput = z.infer<typeof MatchmakingSchema>;

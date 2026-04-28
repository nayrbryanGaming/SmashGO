import { z } from "zod";

export const BookingSchema = z.object({
  court_id: z.string().uuid("Invalid Court ID"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
  end_time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
});

export const MatchmakingSchema = z.object({
  skill_level: z.number().min(1).max(3),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
  end_time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
});

export type BookingInput = z.infer<typeof BookingSchema>;
export type MatchmakingInput = z.infer<typeof MatchmakingSchema>;

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  skill_level?: number;
  created_at: string;
}

export interface Court {
  id: string;
  name: string;
  open_time: string;
  close_time: string;
  price_per_hour: number;
  status: 'active' | 'maintenance' | 'inactive';
  admin_phone?: string;
}

export type BookingStatus = 'pending' | 'waiting_admin' | 'confirmed' | 'completed' | 'cancelled' | 'expired';

export interface Booking {
  id: string;
  user_id: string;
  court_id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  created_at: string;
  courts?: Court;
  users?: User;
}

export type MatchmakingStatus = 'searching' | 'matched' | 'confirmed' | 'expired' | 'cancelled';

export interface MatchmakingEntry {
  id: string;
  user_id: string;
  skill_level: number;
  start_time: string;
  end_time: string;
  status: MatchmakingStatus;
  matched_user_id?: string;
  created_at: string;
  users?: User;
  matched_user?: User;
}

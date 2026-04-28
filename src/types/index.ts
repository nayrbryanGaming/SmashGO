export interface User {
  id: string;
  name: string;
  phone: string;
  role: 'user' | 'admin';
  skill_level: number;
  elo_rating: number;
  matches_played: number;
  win_rate: number;
  created_at: string;
}

export interface Court {
  id: string;
  name: string;
  open_time: string;
  close_time: string;
  price_per_hour: number;
  status: 'active' | 'maintenance' | 'inactive';
  admin_phone: string;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  court_id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'waiting_admin' | 'confirmed' | 'completed' | 'cancelled' | 'expired' | 'checked_in';
  qr_code?: string;
  checked_in_at?: string;
  created_at: string;
  courts?: Partial<Court>;
  users?: Partial<User>;
}

export interface MatchmakingEntry {
  id: string;
  user_id: string;
  skill_level: number;
  start_time: string;
  end_time: string;
  status: 'searching' | 'matched' | 'confirmed' | 'expired' | 'cancelled';
  matched_user_id?: string;
  created_at: string;
  matched_user?: Partial<User>;
}

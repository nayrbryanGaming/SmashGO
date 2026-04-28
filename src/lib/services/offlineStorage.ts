import { User, Booking, MatchmakingEntry } from "@/types";

const USER_KEY = "smashgo_user_cache";
const BOOKING_KEY = "smashgo_booking_cache";
const MATCHMAKING_KEY = "smashgo_matchmaking_cache";

export class OfflineStorage {
  static saveUser(user: User) {
    if (typeof window === "undefined") return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  static getUser(): User | null {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  static saveBookings(bookings: Booking[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(BOOKING_KEY, JSON.stringify(bookings));
  }

  static getBookings(): Booking[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(BOOKING_KEY);
    return data ? JSON.parse(data) : [];
  }

  static addBooking(booking: Booking) {
    const bookings = this.getBookings();
    bookings.push(booking);
    this.saveBookings(bookings);
  }

  static saveMatchmaking(entries: MatchmakingEntry[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(MATCHMAKING_KEY, JSON.stringify(entries));
  }

  static getMatchmaking(): MatchmakingEntry[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(MATCHMAKING_KEY);
    return data ? JSON.parse(data) : [];
  }

  static addMatchmaking(entry: MatchmakingEntry) {
    const entries = this.getMatchmaking();
    entries.push(entry);
    this.saveMatchmaking(entries);
  }

  static clear() {
    if (typeof window === "undefined") return;
    localStorage.clear();
  }
}


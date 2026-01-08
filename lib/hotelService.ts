
import { supabase } from './supabase';
import { Room, Booking, Guest, RoomStatus } from '../types';

/**
 * Service to manage all Hotel Data Operations
 * This handles the transition between local state (for MVP) and Supabase (for Production)
 */
export const hotelService = {
  // --- ROOMS ---
  async getRooms(): Promise<Room[]> {
    const { data, error } = await supabase.from('rooms').select('*, room_types(*)');
    if (error) throw error;
    return data;
  },

  async updateRoomStatus(roomId: string, status: RoomStatus): Promise<void> {
    const { error } = await supabase.from('rooms').update({ status }).eq('id', roomId);
    if (error) throw error;
  },

  async createRoom(room: Partial<Room>): Promise<Room> {
    const { data, error } = await supabase.from('rooms').insert(room).select().single();
    if (error) throw error;
    return data;
  },

  // --- BOOKINGS ---
  async getBookings(): Promise<Booking[]> {
    const { data, error } = await supabase.from('bookings').select('*, guests(*), rooms(*)').order('check_in', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createBooking(booking: Partial<Booking>): Promise<Booking> {
    const { data, error } = await supabase.from('bookings').insert(booking).select().single();
    if (error) throw error;
    
    // Auto-update room status to occupied if check-in is today
    const today = new Date().toISOString().split('T')[0];
    // Fix: Use 'checkIn' instead of 'check_in' to match Booking type definition
    if (booking.checkIn === today) {
      // Fix: Use 'roomId' instead of 'room_id' to match Booking type definition
      await this.updateRoomStatus(booking.roomId!, RoomStatus.OCCUPIED);
    }
    
    return data;
  },

  async updateBookingStatus(bookingId: string, status: string): Promise<void> {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', bookingId);
    if (error) throw error;
  }
};


export enum RoomStatus {
  VACANT = 'vacant',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance'
}

export enum MaintenanceStatus {
  CLEAN = 'clean',
  DIRTY = 'dirty',
  CLEANING = 'cleaning'
}

export interface RoomType {
  id: string;
  name: string;
  basePrice: number;
  capacity: number;
}

export interface Room {
  id: string;
  roomNumber: string;
  typeId: string;
  status: RoomStatus;
  maintenanceStatus: MaintenanceStatus;
}

export interface Guest {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}

export interface Booking {
  id: string;
  guestId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  depositPaid: number;
  status: 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  paymentStatus: 'pending' | 'partial' | 'paid';
}

export type ViewType = 'dashboard' | 'rooms' | 'calendar' | 'bookings' | 'setup';

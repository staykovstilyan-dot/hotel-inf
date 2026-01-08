
import { RoomStatus, MaintenanceStatus, RoomType, Room, Guest, Booking } from './types';

export const SQL_SCHEMA = `
-- 1. Room Types
CREATE TABLE room_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  base_price DECIMAL NOT NULL,
  capacity INT NOT NULL
);

-- 2. Rooms
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_number TEXT NOT NULL UNIQUE,
  type_id UUID REFERENCES room_types(id),
  status TEXT DEFAULT 'vacant', -- vacant, occupied, maintenance
  maintenance_status TEXT DEFAULT 'clean' -- clean, dirty, cleaning
);

-- 3. Guests
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID REFERENCES guests(id),
  room_id UUID REFERENCES rooms(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  total_price DECIMAL NOT NULL,
  deposit_paid DECIMAL DEFAULT 0,
  status TEXT DEFAULT 'confirmed', -- confirmed, cancelled, checked_in, checked_out
  payment_status TEXT DEFAULT 'pending' -- pending, partial, paid
);
`;

const today = new Date();
const formatDate = (date: Date) => date.toISOString().split('T')[0];

const dateMinus = (days: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - days);
  return formatDate(d);
};

const datePlus = (days: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  return formatDate(d);
};

export const MOCK_ROOM_TYPES: RoomType[] = [
  { id: 't1', name: 'Single Standard', basePrice: 80, capacity: 1 },
  { id: 't2', name: 'Double Deluxe', basePrice: 120, capacity: 2 },
  { id: 't3', name: 'Family Suite', basePrice: 200, capacity: 4 },
];

export const MOCK_ROOMS: Room[] = [
  { id: '101', roomNumber: '101', typeId: 't1', status: RoomStatus.VACANT, maintenanceStatus: MaintenanceStatus.CLEAN },
  { id: '102', roomNumber: '102', typeId: 't1', status: RoomStatus.OCCUPIED, maintenanceStatus: MaintenanceStatus.DIRTY },
  { id: '201', roomNumber: '201', typeId: 't2', status: RoomStatus.VACANT, maintenanceStatus: MaintenanceStatus.CLEAN },
  { id: '202', roomNumber: '202', typeId: 't2', status: RoomStatus.VACANT, maintenanceStatus: MaintenanceStatus.CLEANING },
  { id: '301', roomNumber: '301', typeId: 't3', status: RoomStatus.OCCUPIED, maintenanceStatus: MaintenanceStatus.DIRTY },
  { id: '302', roomNumber: '302', typeId: 't3', status: RoomStatus.MAINTENANCE, maintenanceStatus: MaintenanceStatus.CLEAN },
];

export const MOCK_GUESTS: Guest[] = [
  { id: 'g1', fullName: 'John Doe', email: 'john@example.com', phone: '+123456789' },
  { id: 'g2', fullName: 'Jane Smith', email: 'jane@example.com', phone: '+987654321' },
  { id: 'g3', fullName: 'Alice Johnson', email: 'alice@example.com', phone: '+555123456' },
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    guestId: 'g1',
    roomId: '102',
    checkIn: dateMinus(2),
    checkOut: datePlus(3),
    totalPrice: 400,
    depositPaid: 100,
    status: 'checked_in',
    paymentStatus: 'partial',
  },
  {
    id: 'b2',
    guestId: 'g2',
    roomId: '301',
    checkIn: formatDate(today),
    checkOut: datePlus(7),
    totalPrice: 1400,
    depositPaid: 500,
    status: 'confirmed',
    paymentStatus: 'pending',
  },
  {
    id: 'b3',
    guestId: 'g3',
    roomId: '201',
    checkIn: datePlus(1),
    checkOut: datePlus(4),
    totalPrice: 360,
    depositPaid: 360,
    status: 'confirmed',
    paymentStatus: 'paid',
  },
];

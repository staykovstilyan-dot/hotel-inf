
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Calendar, 
  MoreHorizontal,
  X,
  UserPlus,
  BookOpen,
  DollarSign,
  TrendingUp,
  Clock
} from 'lucide-react';
import { Room, Booking, Guest } from '../types';
import { MOCK_ROOM_TYPES } from '../constants';

interface BookingsPageProps {
  rooms: Room[];
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  guests: Guest[];
  setGuests: React.Dispatch<React.SetStateAction<Guest[]>>;
}

const BookingsPage: React.FC<BookingsPageProps> = ({ rooms, bookings, setBookings, guests, setGuests }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBooking, setNewBooking] = useState({
    guestId: '',
    roomId: '',
    checkIn: '',
    checkOut: '',
    totalPrice: 0
  });

  const getGuestInfo = (guestId: string) => guests.find(g => g.id === guestId);
  const getRoomInfo = (roomId: string) => rooms.find(r => r.id === roomId);

  // Auto-calculate total price
  useEffect(() => {
    if (newBooking.roomId && newBooking.checkIn && newBooking.checkOut) {
      const room = getRoomInfo(newBooking.roomId);
      const type = MOCK_ROOM_TYPES.find(t => t.id === room?.typeId);
      const start = new Date(newBooking.checkIn);
      const end = new Date(newBooking.checkOut);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
      if (days > 0 && type) {
        setNewBooking(prev => ({ ...prev, totalPrice: days * type.basePrice }));
      }
    }
  }, [newBooking.roomId, newBooking.checkIn, newBooking.checkOut]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (new Date(newBooking.checkIn) >= new Date(newBooking.checkOut)) {
      alert('Check-out must be after check-in date');
      return;
    }

    const booking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      guestId: newBooking.guestId,
      roomId: newBooking.roomId,
      checkIn: newBooking.checkIn,
      checkOut: newBooking.checkOut,
      totalPrice: newBooking.totalPrice,
      depositPaid: Math.round(newBooking.totalPrice * 0.2), // Default 20%
      status: 'confirmed',
      paymentStatus: 'pending'
    };

    setBookings(prev => [booking, ...prev]);
    setIsModalOpen(false);
    setNewBooking({ guestId: '', roomId: '', checkIn: '', checkOut: '', totalPrice: 0 });
  };

  const updateBookingStatus = (id: string, status: any) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const filteredBookings = bookings.filter(b => {
    const guest = getGuestInfo(b.guestId);
    const room = getRoomInfo(b.roomId);
    const search = searchTerm.toLowerCase();
    return (
      guest?.fullName.toLowerCase().includes(search) || 
      room?.roomNumber.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Reservations</h2>
          <p className="text-slate-500 font-medium">Capture stays and manage guest folios</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center px-6 py-3 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-100 font-bold text-sm"
          >
            <Plus className="w-5 h-5 mr-2 text-indigo-400" />
            Book Stay
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/30">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, email or room..." 
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm font-medium transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center px-4 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">
              <Filter className="w-4 h-4 mr-2" /> Filters
            </button>
            <button className="flex items-center px-4 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">
              <Download className="w-4 h-4 mr-2" /> Report
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-5">Guest Information</th>
                <th className="px-6 py-5">Unit</th>
                <th className="px-6 py-5">Stay Dates</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Balance</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredBookings.map((booking) => {
                const guest = getGuestInfo(booking.guestId);
                const room = getRoomInfo(booking.roomId);
                return (
                  <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs mr-4">
                          {guest?.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900">{guest?.fullName}</p>
                          <p className="text-xs text-slate-500 font-medium">{guest?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className="inline-flex items-center px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-[11px] border border-indigo-100">
                         UNIT {room?.roomNumber}
                       </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700">{booking.checkIn}</span>
                        <span className="text-[10px] font-bold text-slate-400">to {booking.checkOut}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5">
                        <span className={`inline-flex w-fit items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                          booking.status === 'checked_in' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          booking.status === 'confirmed' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                          'bg-slate-50 text-slate-700 border-slate-200'
                        }`}>
                          {booking.status}
                        </span>
                        <div className="flex items-center gap-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${booking.paymentStatus === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{booking.paymentStatus}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <p className="text-sm font-black text-slate-900">${booking.totalPrice.toLocaleString()}</p>
                       <p className="text-[10px] text-slate-400 font-bold">Dep: ${booking.depositPaid}</p>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <div className="flex items-center justify-end gap-2">
                         {booking.status === 'confirmed' && (
                           <button 
                             onClick={() => updateBookingStatus(booking.id, 'checked_in')}
                             className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"
                             title="Check In"
                           >
                             <TrendingUp className="w-4 h-4" />
                           </button>
                         )}
                         {booking.status === 'checked_in' && (
                           <button 
                             onClick={() => updateBookingStatus(booking.id, 'checked_out')}
                             className="p-2 bg-slate-900 text-white rounded-xl hover:bg-black transition-colors"
                             title="Check Out"
                           >
                             <Clock className="w-4 h-4" />
                           </button>
                         )}
                         <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-colors">
                           <MoreHorizontal className="w-4 h-4" />
                         </button>
                       </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredBookings.length === 0 && (
            <div className="py-24 flex flex-col items-center justify-center text-slate-300">
              <BookOpen className="w-20 h-20 mb-4 opacity-20" />
              <p className="text-xl font-bold">No Records Found</p>
              <p className="text-sm">Try adjusting your filters or search term</p>
            </div>
          )}
        </div>
      </div>

      {/* New Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20">
            <div className="flex items-center justify-between p-8 border-b border-slate-50 bg-slate-50/50">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Book New Stay</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium italic">All bookings require a 20% security deposit</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 rounded-2xl hover:bg-white text-slate-400 transition-all shadow-sm border border-transparent hover:border-slate-100">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Guest Account</label>
                  <div className="flex gap-2">
                    <select 
                      required
                      className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-bold"
                      value={newBooking.guestId}
                      onChange={e => setNewBooking({...newBooking, guestId: e.target.value})}
                    >
                      <option value="">Search Guest Records...</option>
                      {guests.map(g => <option key={g.id} value={g.id}>{g.fullName}</option>)}
                    </select>
                    <button type="button" className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 transition-all shadow-sm">
                      <UserPlus className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Assign Unit</label>
                  <select 
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-bold"
                    value={newBooking.roomId}
                    onChange={e => setNewBooking({...newBooking, roomId: e.target.value})}
                  >
                    <option value="">Select Unit...</option>
                    {rooms.filter(r => r.status === 'vacant').map(r => <option key={r.id} value={r.id}>Room {r.roomNumber}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Estimated Total</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      readOnly
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-100 bg-slate-100 text-slate-500 font-black text-sm"
                      value={newBooking.totalPrice.toLocaleString()}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Arrival Date</label>
                  <input 
                    type="date" 
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-bold"
                    value={newBooking.checkIn}
                    onChange={e => setNewBooking({...newBooking, checkIn: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Departure Date</label>
                  <input 
                    type="date" 
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-bold"
                    value={newBooking.checkOut}
                    onChange={e => setNewBooking({...newBooking, checkOut: e.target.value})}
                  />
                </div>
              </div>
              <div className="pt-6 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-[20px] transition-all"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-[20px] shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all transform active:scale-95"
                >
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;

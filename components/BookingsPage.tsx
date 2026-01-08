
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Calendar, 
  MoreHorizontal,
  X,
  UserPlus,
  BookOpen
} from 'lucide-react';
import { Room, Booking, Guest } from '../types';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
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
      depositPaid: 0,
      status: 'confirmed',
      paymentStatus: 'pending'
    };

    setBookings(prev => [booking, ...prev]);
    setIsModalOpen(false);
    // Reset form
    setNewBooking({ guestId: '', roomId: '', checkIn: '', checkOut: '', totalPrice: 0 });
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Reservations</h2>
          <p className="text-slate-500">Master list of guest stays and historical bookings</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center justify-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-bold text-sm shadow-sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 font-bold text-sm"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Reservation
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/50">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter by guest or room unit..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center px-3 py-2 text-xs font-bold bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm">
              <Filter className="w-3.5 h-3.5 mr-2" />
              Status Filter
            </button>
            <button className="flex items-center px-3 py-2 text-xs font-bold bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm">
              <Calendar className="w-3.5 h-3.5 mr-2" />
              Date Range
            </button>
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] bg-slate-50/30">
                <th className="px-6 py-4">Primary Guest</th>
                <th className="px-6 py-4">Unit</th>
                <th className="px-6 py-4">Dates</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Finance</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredBookings.map((booking) => {
                const guest = getGuestInfo(booking.guestId);
                const room = getRoomInfo(booking.roomId);
                return (
                  <tr key={booking.id} className="hover:bg-indigo-50/30 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`w-9 h-9 rounded-full ${booking.status === 'checked_in' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'} flex items-center justify-center font-bold text-xs mr-3 transition-colors`}>
                          {guest?.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900 leading-tight">{guest?.fullName}</p>
                          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{guest?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-bold border border-slate-200">
                         UNIT {room?.roomNumber}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700">{booking.checkIn}</span>
                        <span className="text-[10px] font-bold text-slate-400 opacity-80">➔ {booking.checkOut}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                        booking.status === 'checked_in' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        booking.status === 'confirmed' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                        'bg-slate-50 text-slate-700 border-slate-200'
                      }`}>
                        {booking.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          booking.paymentStatus === 'paid' ? 'bg-emerald-500' :
                          booking.paymentStatus === 'partial' ? 'bg-amber-500 shadow-amber-200 shadow' :
                          'bg-rose-500 shadow-rose-200 shadow'
                        }`}></div>
                        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">{booking.paymentStatus}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex flex-col">
                        <p className="text-sm font-bold text-slate-900">${booking.totalPrice.toLocaleString()}</p>
                        <p className="text-[10px] text-slate-400 font-bold italic">Dep: ${booking.depositPaid}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button className="p-2 rounded-lg hover:bg-white text-slate-400 hover:text-indigo-600 transition-all border border-transparent hover:border-slate-200 shadow-sm">
                         <MoreHorizontal className="w-5 h-5" />
                       </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredBookings.length === 0 && (
            <div className="py-20 flex flex-col items-center opacity-40">
              {/* Added missing BookOpen import to fix compilation error */}
              <BookOpen className="w-16 h-16 mb-4" />
              <p className="text-xl font-bold">No Records Found</p>
            </div>
          )}
        </div>
      </div>

      {/* New Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="text-xl font-bold text-slate-800">New Reservation</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">Capture guest details and unit assignment</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-white text-slate-400 transition-all shadow-sm border border-transparent hover:border-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Guest Account</label>
                  <div className="flex gap-2">
                    <select 
                      required
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium bg-slate-50"
                      value={newBooking.guestId}
                      onChange={e => setNewBooking({...newBooking, guestId: e.target.value})}
                    >
                      <option value="">Search Guest Database</option>
                      {guests.map(g => <option key={g.id} value={g.id}>{g.fullName} ({g.email})</option>)}
                    </select>
                    <button type="button" className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 transition-colors shadow-sm">
                      <UserPlus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Assign Unit</label>
                  <select 
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium bg-slate-50"
                    value={newBooking.roomId}
                    onChange={e => setNewBooking({...newBooking, roomId: e.target.value})}
                  >
                    <option value="">Select Unit</option>
                    {rooms.map(r => <option key={r.id} value={r.id}>Unit {r.roomNumber}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Estimated Total</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input 
                      type="number" 
                      required
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium bg-slate-50"
                      value={newBooking.totalPrice}
                      onChange={e => setNewBooking({...newBooking, totalPrice: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Check In</label>
                  <input 
                    type="date" 
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium bg-slate-50"
                    value={newBooking.checkIn}
                    onChange={e => setNewBooking({...newBooking, checkIn: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Check Out</label>
                  <input 
                    type="date" 
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium bg-slate-50"
                    value={newBooking.checkOut}
                    onChange={e => setNewBooking({...newBooking, checkOut: e.target.value})}
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all shadow-sm"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all transform active:scale-95"
                >
                  Create Booking
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


import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  BedDouble,
  Target
} from 'lucide-react';
import { Room, Booking, Guest } from '../types';

interface CalendarPageProps {
  rooms: Room[];
  bookings: Booking[];
  guests: Guest[];
}

const CalendarPage: React.FC<CalendarPageProps> = ({ rooms, bookings, guests }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Generate 14 days from current date
  const days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date(currentDate);
    d.setDate(currentDate.getDate() + i);
    return d;
  });

  const getGuestName = (guestId: string) => {
    return guests.find(g => g.id === guestId)?.fullName || 'Guest Not Found';
  };

  const isBookingInDay = (booking: Booking, day: Date) => {
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const date = new Date(day);
    date.setHours(0,0,0,0);
    checkIn.setHours(0,0,0,0);
    checkOut.setHours(0,0,0,0);
    // Booking spans from checkIn up to checkOut
    return date >= checkIn && date < checkOut;
  };

  const navigateDays = (count: number) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + count);
    setCurrentDate(d);
  };

  const resetToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Booking Pipeline</h2>
          <p className="text-slate-500">Two-week occupancy forecast and scheduling</p>
        </div>
        <div className="flex items-center gap-2">
           <button 
            onClick={resetToToday}
            className="flex items-center px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-bold text-xs shadow-sm mr-2"
          >
            <Target className="w-3.5 h-3.5 mr-2 text-indigo-500" />
            Today
          </button>
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            <button onClick={() => navigateDays(-7)} className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-400 hover:text-indigo-600"><ChevronLeft className="w-5 h-5" /></button>
            <div className="px-4 py-1.5 flex items-center font-bold text-xs text-slate-700">
              <CalendarIcon className="w-3.5 h-3.5 mr-2 text-indigo-600" />
              {currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — 
              {days[13].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <button onClick={() => navigateDays(7)} className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-400 hover:text-indigo-600"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto overflow-y-auto flex-1 scrollbar-thin">
          <table className="w-full border-collapse table-fixed">
            <thead className="sticky top-0 z-30">
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="sticky left-0 z-40 bg-slate-50 p-4 border-r border-slate-200 text-left w-48 shadow-sm">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                    <BedDouble className="w-3 h-3 mr-1" /> Room Units
                  </div>
                </th>
                {days.map((day, i) => {
                  const isToday = new Date().toDateString() === day.toDateString();
                  const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                  
                  return (
                    <th key={i} className={`p-4 min-w-[140px] border-r border-slate-200 ${isToday ? 'bg-indigo-50' : isWeekend ? 'bg-slate-50/50' : ''}`}>
                      <div className={`text-sm font-bold ${isToday ? 'text-indigo-600' : 'text-slate-800'}`}>
                        {day.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                      </div>
                      <div className={`text-[9px] font-bold uppercase tracking-wider ${isToday ? 'text-indigo-400' : 'text-slate-400'}`}>
                        {day.toLocaleDateString('en-US', { weekday: 'long' })}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id} className="border-b border-slate-100 hover:bg-slate-50/30 transition-colors">
                  <td className="sticky left-0 z-20 bg-white p-4 border-r border-slate-200 font-bold text-slate-700 shadow-sm">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-lg ${room.status === 'occupied' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'} flex items-center justify-center text-xs font-bold mr-3`}>
                        {room.roomNumber}
                      </div>
                      <span className="text-sm">Room {room.roomNumber}</span>
                    </div>
                  </td>
                  {days.map((day, dayIdx) => {
                    const activeBooking = bookings.find(b => b.roomId === room.id && isBookingInDay(b, day));
                    const isCheckInDay = activeBooking && new Date(activeBooking.checkIn).toDateString() === day.toDateString();
                    
                    return (
                      <td key={dayIdx} className={`p-1 border-r border-slate-100 relative h-20 ${day.getDay() === 0 || day.getDay() === 6 ? 'bg-slate-50/20' : ''}`}>
                        {activeBooking && (
                          <div className={`absolute inset-y-2 left-0 right-0 z-10 cursor-pointer group/booking ${
                            isCheckInDay ? 'ml-2 rounded-l-xl' : ''
                          } ${
                            activeBooking.status === 'checked_in' ? 'bg-indigo-600 shadow-indigo-100' : 'bg-purple-500 shadow-purple-100'
                          } shadow-md transition-all hover:brightness-110 hover:scale-[1.02] flex items-center px-3`}>
                            {isCheckInDay && (
                              <div className="text-white truncate">
                                <p className="text-[10px] font-bold leading-none mb-1 opacity-80 uppercase tracking-tighter">Guest Stay</p>
                                <p className="text-xs font-bold leading-tight truncate">{getGuestName(activeBooking.guestId)}</p>
                              </div>
                            )}
                            {!isCheckInDay && <div className="w-full h-1 bg-white/20 rounded-full"></div>}
                            
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover/booking:block bg-slate-900 text-white p-2 rounded-lg text-[10px] z-50 whitespace-nowrap shadow-xl">
                              <p className="font-bold">{getGuestName(activeBooking.guestId)}</p>
                              <p>{activeBooking.checkIn} → {activeBooking.checkOut}</p>
                              <p className="text-indigo-400 font-bold uppercase tracking-widest mt-1">{activeBooking.status}</p>
                            </div>
                          </div>
                        )}
                        {!activeBooking && (
                           <div className="w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                             <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                               <PlusIcon className="w-4 h-4" />
                             </div>
                           </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-6 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] w-full lg:w-auto">Legend</p>
        <div className="flex items-center gap-6">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-indigo-600 mr-2 shadow-sm"></div>
            <span className="text-xs font-bold text-slate-600">Checked In</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-500 mr-2 shadow-sm"></div>
            <span className="text-xs font-bold text-slate-600">Confirmed Booking</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full border-2 border-indigo-200 bg-white mr-2"></div>
            <span className="text-xs font-bold text-slate-600">Available</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export default CalendarPage;

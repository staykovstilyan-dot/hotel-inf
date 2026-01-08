
import React, { useMemo } from 'react';
import { 
  Users, 
  BedSingle, 
  TrendingUp, 
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Room, Booking, Guest, RoomStatus, MaintenanceStatus } from '../types';

interface DashboardProps {
  rooms: Room[];
  bookings: Booking[];
  guests: Guest[];
}

const data = [
  { name: 'Mon', revenue: 2400 },
  { name: 'Tue', revenue: 1398 },
  { name: 'Wed', revenue: 9800 },
  { name: 'Thu', revenue: 3908 },
  { name: 'Fri', revenue: 4800 },
  { name: 'Sat', revenue: 3800 },
  { name: 'Sun', revenue: 4300 },
];

const Dashboard: React.FC<DashboardProps> = ({ rooms, bookings, guests }) => {
  const stats = useMemo(() => {
    const occupied = rooms.filter(r => r.status === RoomStatus.OCCUPIED).length;
    const revenue = bookings.reduce((acc, b) => acc + b.totalPrice, 0);
    return {
      occRate: Math.round((occupied / rooms.length) * 100),
      revenue,
      activeBookings: bookings.filter(b => b.status !== 'cancelled').length,
      guestCount: guests.length
    };
  }, [rooms, bookings, guests]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Executive Dashboard</h2>
          <p className="text-slate-500 font-medium">Real-time property performance analytics</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all">Download PDF</button>
           <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Global Settings</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Occupancy Rate', value: `${stats.occRate}%`, icon: BedSingle, color: 'indigo', trend: '+4.5%' },
          { label: 'Total Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'emerald', trend: '+12.3%' },
          { label: 'Active Folios', value: stats.activeBookings, icon: Activity, color: 'purple', trend: '+8.1%' },
          { label: 'Registered Guests', value: stats.guestCount, icon: Users, color: 'amber', trend: '+2.4%' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-7 rounded-[32px] border border-slate-200/60 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${s.color}-500/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700`}></div>
            <div className="flex items-center justify-between mb-6">
              <div className={`p-3 rounded-2xl bg-${s.color}-100 text-${s.color}-600`}>
                <s.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">{s.trend}</span>
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
            <h3 className="text-3xl font-black text-slate-900 mt-2">{s.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Financial Trends</h3>
            <select className="bg-slate-50 border border-slate-100 text-xs font-bold px-4 py-2 rounded-xl outline-none">
              <option>This Fiscal Week</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '16px', color: '#fff' }}
                  itemStyle={{ color: '#818cf8', fontWeight: 800 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-200/60 shadow-sm">
           <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Daily Check-ins</h3>
           <div className="space-y-5">
             {bookings.slice(0, 4).map((b, i) => (
               <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-indigo-200 hover:bg-white transition-all cursor-pointer">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs group-hover:bg-indigo-600 transition-colors">
                     {b.status === 'checked_in' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                   </div>
                   <div>
                     <p className="text-sm font-bold text-slate-900">Room {rooms.find(r => r.id === b.roomId)?.roomNumber}</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase">{b.checkIn}</p>
                   </div>
                 </div>
                 <div className="text-right">
                    <p className="text-xs font-black text-slate-900">${b.totalPrice}</p>
                    <span className="text-[9px] font-bold text-emerald-500 uppercase">{b.paymentStatus}</span>
                 </div>
               </div>
             ))}
           </div>
           <button className="w-full mt-8 py-4 bg-slate-100 text-slate-500 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">View All Arrivals</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

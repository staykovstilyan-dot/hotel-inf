
import React, { useMemo } from 'react';
import { 
  Users, 
  BedSingle, 
  ArrowUpRight, 
  ArrowDownRight, 
  CalendarCheck, 
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Room, Booking, Guest, RoomStatus, MaintenanceStatus } from '../types';

interface DashboardProps {
  rooms: Room[];
  bookings: Booking[];
  guests: Guest[];
}

const chartData = [
  { name: 'Mon', bookings: 4, revenue: 1200 },
  { name: 'Tue', bookings: 6, revenue: 1800 },
  { name: 'Wed', bookings: 5, revenue: 1500 },
  { name: 'Thu', bookings: 8, revenue: 2400 },
  { name: 'Fri', bookings: 12, revenue: 3600 },
  { name: 'Sat', bookings: 15, revenue: 4500 },
  { name: 'Sun', bookings: 10, revenue: 3000 },
];

const StatCard = ({ title, value, change, trend, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className={`flex items-center px-2 py-1 rounded-full text-xs font-semibold ${trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
        {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
        {change}
      </div>
    </div>
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <h3 className="text-2xl font-bold mt-1 text-slate-800">{value}</h3>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ rooms, bookings, guests }) => {
  const stats = useMemo(() => {
    const occupiedCount = rooms.filter(r => r.status === RoomStatus.OCCUPIED).length;
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'checked_in').length;
    const totalRevenue = bookings.reduce((acc, b) => acc + b.totalPrice, 0);
    
    return {
      occupied: occupiedCount,
      totalRooms: rooms.length,
      activeBookings: confirmedBookings,
      guestCount: guests.length,
      revenue: totalRevenue
    };
  }, [rooms, bookings, guests]);

  const urgentTasks = useMemo(() => {
    const tasks = [];
    const today = new Date().toISOString().split('T')[0];

    // Check-ins for today
    bookings.filter(b => b.checkIn === today && b.status === 'confirmed').forEach(b => {
      const guest = guests.find(g => g.id === b.guestId);
      const room = rooms.find(r => r.id === b.roomId);
      tasks.push({
        id: `ci-${b.id}`,
        action: 'Check-in',
        guest: guest?.fullName || 'Unknown',
        room: room?.roomNumber || '?',
        status: room?.maintenanceStatus === MaintenanceStatus.CLEAN ? 'Ready' : 'Cleaning Needed',
        priority: 'high'
      });
    });

    // Check-outs for today
    bookings.filter(b => b.checkOut === today && b.status === 'checked_in').forEach(b => {
      const guest = guests.find(g => g.id === b.guestId);
      const room = rooms.find(r => r.id === b.roomId);
      tasks.push({
        id: `co-${b.id}`,
        action: 'Check-out',
        guest: guest?.fullName || 'Unknown',
        room: room?.roomNumber || '?',
        status: 'Due Today',
        priority: 'medium'
      });
    });

    // Maintenance tasks
    rooms.filter(r => r.maintenanceStatus === MaintenanceStatus.DIRTY).forEach(r => {
      tasks.push({
        id: `m-${r.id}`,
        action: 'Housekeeping',
        guest: 'N/A',
        room: r.roomNumber,
        status: 'Room Dirty',
        priority: 'low'
      });
    });

    return tasks.slice(0, 5); // Max 5 tasks
  }, [rooms, bookings, guests]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Operational Overview</h2>
          <p className="text-slate-500">Live property metrics and revenue insights</p>
        </div>
        <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm self-start">
          <button className="px-3 py-1.5 text-xs font-bold rounded-md bg-indigo-600 text-white shadow-sm">Real-time</button>
          <button className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-md transition-colors">History</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Occupancy" 
          value={`${stats.occupied} / ${stats.totalRooms}`} 
          change={`${Math.round((stats.occupied/stats.totalRooms)*100)}%`} 
          trend="up" 
          icon={BedSingle} 
          color="bg-indigo-600 shadow-indigo-100 shadow-lg" 
        />
        <StatCard 
          title="Confirmed Bookings" 
          value={stats.activeBookings} 
          change="+8%" 
          trend="up" 
          icon={CalendarCheck} 
          color="bg-purple-600 shadow-purple-100 shadow-lg" 
        />
        <StatCard 
          title="Total Guests" 
          value={stats.guestCount} 
          change="+3" 
          trend="up" 
          icon={Users} 
          color="bg-blue-600 shadow-blue-100 shadow-lg" 
        />
        <StatCard 
          title="Projected Revenue" 
          value={`$${stats.revenue.toLocaleString()}`} 
          change="+12%" 
          trend="up" 
          icon={DollarSign} 
          color="bg-emerald-600 shadow-emerald-100 shadow-lg" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Revenue Analytics</h3>
            <select className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-2 py-1 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Booking Velocity</h3>
            <div className="flex items-center text-xs text-slate-500 font-medium">
              <div className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></div>
              Bookings / Day
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip />
                <Bar dataKey="bookings" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Front Desk Checklist</h3>
          <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
            {urgentTasks.length} Pending Items
          </span>
        </div>
        <div className="p-0">
          {urgentTasks.length > 0 ? urgentTasks.map((task, idx) => (
            <div key={task.id} className={`flex items-center justify-between px-6 py-4 ${idx !== urgentTasks.length - 1 ? 'border-b border-slate-50' : ''} hover:bg-slate-50 transition-colors cursor-pointer group`}>
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-xl mr-4 flex items-center justify-center transition-all ${
                  task.priority === 'high' ? 'bg-rose-100 text-rose-600' : 
                  task.priority === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'
                }`}>
                  {task.action === 'Check-in' ? <CalendarCheck className="w-5 h-5" /> : 
                   task.action === 'Check-out' ? <Clock className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-800">{task.action}: Room {task.room}</p>
                  <p className="text-xs text-slate-500">Guest: {task.guest}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xs font-bold uppercase tracking-widest ${
                  task.status.includes('Ready') ? 'text-emerald-600' : 'text-slate-400'
                }`}>{task.status}</p>
                <div className="mt-1 flex justify-end">
                   {task.status.includes('Ready') ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <div className="w-4 h-4 rounded-full border border-slate-200"></div>}
                </div>
              </div>
            </div>
          )) : (
            <div className="px-6 py-12 text-center text-slate-400">
               <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-20" />
               <p className="font-medium">All caught up! No urgent tasks.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

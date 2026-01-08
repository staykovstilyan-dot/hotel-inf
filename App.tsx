
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Bed, 
  CalendarDays, 
  BookOpen, 
  Settings, 
  Menu, 
  X, 
  Bell, 
  Search,
  ChevronRight,
  LogOut,
  User,
  Zap
} from 'lucide-react';
import { ViewType, Room, Booking, Guest, RoomStatus } from './types';
import { MOCK_ROOMS, MOCK_BOOKINGS, MOCK_GUESTS } from './constants';
import Dashboard from './components/Dashboard';
import RoomsPage from './components/RoomsPage';
import CalendarPage from './components/CalendarPage';
import BookingsPage from './components/BookingsPage';
import SetupPage from './components/SetupPage';
import Auth from './components/Auth';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // App State - Syncing with Database/LocalStorage
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('hms_rooms');
    return saved ? JSON.parse(saved) : MOCK_ROOMS;
  });
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('hms_bookings');
    return saved ? JSON.parse(saved) : MOCK_BOOKINGS;
  });
  const [guests, setGuests] = useState<Guest[]>(() => {
    const saved = localStorage.getItem('hms_guests');
    return saved ? JSON.parse(saved) : MOCK_GUESTS;
  });

  // Global Auto-Save Effect
  useEffect(() => {
    localStorage.setItem('hms_rooms', JSON.stringify(rooms));
    localStorage.setItem('hms_bookings', JSON.stringify(bookings));
    localStorage.setItem('hms_guests', JSON.stringify(guests));
  }, [rooms, bookings, guests]);

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  const NavItem = ({ id, icon: Icon, label }: { id: ViewType, icon: any, label: string }) => (
    <button
      onClick={() => setActiveView(id)}
      className={`flex items-center w-full px-4 py-3.5 mb-2 transition-all duration-300 rounded-2xl group ${
        activeView === id 
          ? 'bg-indigo-600 text-white shadow-[0_10px_20px_-5px_rgba(79,70,229,0.4)]' 
          : 'text-slate-400 hover:bg-slate-100 hover:text-indigo-600'
      }`}
    >
      <div className={`p-1.5 rounded-lg mr-3 transition-colors ${activeView === id ? 'bg-white/20' : 'bg-slate-50 group-hover:bg-indigo-100'}`}>
        <Icon className={`w-5 h-5 ${activeView === id ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`} />
      </div>
      <span className={`font-bold text-sm tracking-tight transition-opacity duration-300 ${!isSidebarOpen && 'lg:opacity-0 lg:w-0'}`}>{label}</span>
      {activeView === id && isSidebarOpen && <ChevronRight className="w-4 h-4 ml-auto animate-pulse" />}
    </button>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar - Elevated Design */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-72' : 'w-24'
        } fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-500 bg-white border-r border-slate-200/60 lg:static`}
      >
        <div className="flex items-center h-24 px-8 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
               <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            {isSidebarOpen && (
              <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase">
                Lumina<span className="text-indigo-600">HMS</span>
              </h1>
            )}
          </div>
        </div>

        <nav className="flex-1 px-4 overflow-y-auto scrollbar-hide">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Control Center" />
          <NavItem id="rooms" icon={Bed} label="Unit Inventory" />
          <NavItem id="calendar" icon={CalendarDays} label="Live Timeline" />
          <NavItem id="bookings" icon={BookOpen} label="Reservations" />
          
          <div className="mt-8 px-6 mb-4">
             <div className={`h-px bg-slate-100 w-full mb-6 ${!isSidebarOpen && 'opacity-0'}`}></div>
             <p className={`text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] transition-opacity ${!isSidebarOpen && 'opacity-0'}`}>
               Management
             </p>
          </div>
          <NavItem id="setup" icon={Settings} label="System Config" />
        </nav>

        {/* User Profile Section */}
        <div className="p-6 border-t border-slate-100">
           <div className={`flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 ${!isSidebarOpen && 'justify-center p-2'}`}>
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-100 flex-shrink-0">
                {user.name.charAt(0)}
              </div>
              {isSidebarOpen && (
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase truncate">{user.role}</p>
                </div>
              )}
           </div>
           <button 
             onClick={() => setUser(null)}
             className={`flex items-center w-full mt-4 px-4 py-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-bold text-xs ${!isSidebarOpen && 'justify-center'}`}
           >
             <LogOut className="w-4 h-4 mr-3" />
             {isSidebarOpen && <span>Termninate Session</span>}
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Global Loading Bar */}
        {isLoading && <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-600 animate-pulse z-50"></div>}

        <header className="flex items-center justify-between h-24 px-10 bg-white/70 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-40">
          <div className="flex items-center gap-6 w-full max-w-xl">
             <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Universal search: rooms, guests, transactions..." 
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500/30 rounded-2xl outline-none text-sm transition-all font-medium"
                />
              </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-3 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 transition-all shadow-sm">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-900">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">System Operational</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 bg-slate-50/50">
          <div className="max-w-7xl mx-auto space-y-10">
            {activeView === 'dashboard' && <Dashboard rooms={rooms} bookings={bookings} guests={guests} />}
            {activeView === 'rooms' && <RoomsPage rooms={rooms} setRooms={setRooms} />}
            {activeView === 'calendar' && <CalendarPage rooms={rooms} bookings={bookings} guests={guests} />}
            {activeView === 'bookings' && <BookingsPage rooms={rooms} bookings={bookings} setBookings={setBookings} guests={guests} setGuests={setGuests} />}
            {activeView === 'setup' && <SetupPage />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

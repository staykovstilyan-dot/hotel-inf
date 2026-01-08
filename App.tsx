
import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Bed, 
  CalendarDays, 
  BookOpen, 
  Database, 
  Menu, 
  X, 
  Bell, 
  Search,
  ChevronRight,
  LogOut,
  User
} from 'lucide-react';
import { ViewType, Room, Booking, Guest, RoomStatus } from './types';
import { MOCK_ROOMS, MOCK_BOOKINGS, MOCK_GUESTS } from './constants';
import Dashboard from './components/Dashboard';
import RoomsPage from './components/RoomsPage';
import CalendarPage from './components/CalendarPage';
import BookingsPage from './components/BookingsPage';
import SetupPage from './components/SetupPage';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Centralized State
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [guests, setGuests] = useState<Guest[]>(MOCK_GUESTS);

  const NavItem = ({ id, icon: Icon, label }: { id: ViewType, icon: any, label: string }) => (
    <button
      onClick={() => setActiveView(id)}
      className={`flex items-center w-full px-4 py-3 mb-1 transition-all rounded-lg group ${
        activeView === id 
          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
          : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
      }`}
    >
      <Icon className={`w-5 h-5 mr-3 transition-colors ${activeView === id ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`} />
      <span className={`font-medium transition-opacity duration-300 ${!isSidebarOpen && 'lg:opacity-0 lg:w-0'}`}>{label}</span>
      {activeView === id && isSidebarOpen && <ChevronRight className="w-4 h-4 ml-auto" />}
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 bg-white border-r border-slate-200 shadow-xl lg:static`}
      >
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-100">
          <div className={`flex items-center transition-all duration-300 ${!isSidebarOpen && 'opacity-0 scale-50'}`}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-2 shadow-inner">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 truncate">
              Lumina HMS
            </h1>
          </div>
          {!isSidebarOpen && (
             <div className="absolute inset-x-0 top-6 flex justify-center">
               <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">L</span>
              </div>
             </div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 rounded-md hover:bg-slate-100 text-slate-400"
          >
            {isSidebarOpen ? <X className="w-6 h-6 lg:hidden" /> : <Menu className="w-6 h-6 lg:hidden" />}
            <Menu className="w-6 h-6 hidden lg:block" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="rooms" icon={Bed} label="Rooms" />
          <NavItem id="calendar" icon={CalendarDays} label="Calendar" />
          <NavItem id="bookings" icon={BookOpen} label="Reservations" />
          
          <div className="pt-4 mt-4 border-t border-slate-100">
            <p className={`px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider transition-opacity ${!isSidebarOpen && 'opacity-0'}`}>
              Advanced
            </p>
            <NavItem id="setup" icon={Database} label="System" />
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className={`flex items-center px-2 py-3 mb-2 rounded-lg bg-white border border-slate-200 shadow-sm ${!isSidebarOpen && 'justify-center'}`}>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden flex-shrink-0">
               <User className="w-6 h-6 text-indigo-600" />
            </div>
            {isSidebarOpen && (
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-semibold truncate">Receptionist #1</p>
                <p className="text-xs text-slate-500">Admin access</p>
              </div>
            )}
          </div>
          <button className={`flex items-center w-full px-4 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ${!isSidebarOpen && 'justify-center'}`}>
            <LogOut className="w-5 h-5 mr-3" />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-20 px-8 bg-white border-b border-slate-100">
          <div className="flex items-center bg-slate-100 rounded-full px-4 py-2 w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Quick search..." 
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-slate-900">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p className="text-xs text-slate-500">System Online</p>
            </div>
          </div>
        </header>

        {/* Dynamic View Rendering */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {activeView === 'dashboard' && (
              <Dashboard rooms={rooms} bookings={bookings} guests={guests} />
            )}
            {activeView === 'rooms' && (
              <RoomsPage rooms={rooms} setRooms={setRooms} />
            )}
            {activeView === 'calendar' && (
              <CalendarPage rooms={rooms} bookings={bookings} guests={guests} />
            )}
            {activeView === 'bookings' && (
              <BookingsPage 
                rooms={rooms} 
                bookings={bookings} 
                setBookings={setBookings} 
                guests={guests} 
                setGuests={setGuests} 
              />
            )}
            {activeView === 'setup' && <SetupPage />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

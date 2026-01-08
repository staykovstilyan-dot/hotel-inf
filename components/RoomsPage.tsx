
import React, { useState } from 'react';
import { 
  Plus, 
  MoreVertical, 
  Sparkles, 
  CheckCircle2,
  Clock,
  Search,
  ChevronDown,
  BedDouble
} from 'lucide-react';
import { MOCK_ROOM_TYPES } from '../constants';
import { RoomStatus, MaintenanceStatus, Room } from '../types';

interface RoomsPageProps {
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
}

const RoomsPage: React.FC<RoomsPageProps> = ({ rooms, setRooms }) => {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredRooms = rooms.filter(room => {
    const matchesFilter = filter === 'all' || room.status === filter;
    const matchesSearch = room.roomNumber.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const updateRoomStatus = (roomId: string, newStatus: RoomStatus) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: newStatus } : r));
    setActiveMenuId(null);
  };

  const updateMaintenance = (roomId: string, newMaint: MaintenanceStatus) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, maintenanceStatus: newMaint } : r));
    setActiveMenuId(null);
  };

  const getStatusColor = (status: RoomStatus) => {
    switch (status) {
      case RoomStatus.VACANT: return 'border-emerald-500 bg-emerald-50 text-emerald-700';
      case RoomStatus.OCCUPIED: return 'border-indigo-500 bg-indigo-50 text-indigo-700';
      case RoomStatus.MAINTENANCE: return 'border-slate-400 bg-slate-100 text-slate-600';
      default: return 'border-slate-200';
    }
  };

  const getMaintenanceIcon = (status: MaintenanceStatus) => {
    switch (status) {
      case MaintenanceStatus.CLEAN: return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case MaintenanceStatus.DIRTY: return <Sparkles className="w-4 h-4 text-rose-400" />;
      case MaintenanceStatus.CLEANING: return <Clock className="w-4 h-4 text-amber-500 animate-pulse" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Rooms Inventory</h2>
          <p className="text-slate-500">Manage operational status and housekeeping for {rooms.length} units</p>
        </div>
        <button className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 font-bold text-sm">
          <Plus className="w-5 h-5 mr-2" />
          Add Unit
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by unit number..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
          {['all', RoomStatus.VACANT, RoomStatus.OCCUPIED, RoomStatus.MAINTENANCE].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition-all ${
                filter === f ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
        {filteredRooms.map((room) => {
          const type = MOCK_ROOM_TYPES.find(t => t.id === room.typeId);
          const isMenuOpen = activeMenuId === room.id;
          
          return (
            <div 
              key={room.id}
              className={`relative bg-white border-2 rounded-2xl overflow-visible transition-all hover:shadow-xl ${getStatusColor(room.status)}`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-3xl font-bold mb-1">{room.roomNumber}</h3>
                    <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest flex items-center">
                       <BedDouble className="w-3 h-3 mr-1" />
                       {type?.name}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 relative">
                    <button 
                      onClick={() => setActiveMenuId(isMenuOpen ? null : room.id)}
                      className="p-1.5 rounded-lg bg-white/50 border border-white/80 hover:bg-white transition-colors shadow-sm"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    
                    {isMenuOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setActiveMenuId(null)}
                        ></div>
                        <div className="absolute right-0 top-full mt-2 z-20 min-w-[160px] bg-white rounded-xl shadow-2xl border border-slate-200 p-2 animate-in fade-in zoom-in-95">
                          <p className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 mb-1">Update Status</p>
                          <button onClick={() => updateRoomStatus(room.id, RoomStatus.VACANT)} className="w-full text-left px-3 py-2 text-xs hover:bg-emerald-50 text-emerald-700 rounded-lg font-bold">Set Vacant</button>
                          <button onClick={() => updateRoomStatus(room.id, RoomStatus.OCCUPIED)} className="w-full text-left px-3 py-2 text-xs hover:bg-indigo-50 text-indigo-700 rounded-lg font-bold">Set Occupied</button>
                          <button onClick={() => updateRoomStatus(room.id, RoomStatus.MAINTENANCE)} className="w-full text-left px-3 py-2 text-xs hover:bg-slate-100 text-slate-700 rounded-lg font-bold">Set Maintenance</button>
                          <div className="h-px bg-slate-100 my-1"></div>
                          <p className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 mb-1">Housekeeping</p>
                          <button onClick={() => updateMaintenance(room.id, MaintenanceStatus.CLEAN)} className="w-full text-left px-3 py-2 text-xs hover:bg-emerald-50 text-emerald-600 rounded-lg font-bold">Mark Clean</button>
                          <button onClick={() => updateMaintenance(room.id, MaintenanceStatus.DIRTY)} className="w-full text-left px-3 py-2 text-xs hover:bg-rose-50 text-rose-600 rounded-lg font-bold">Mark Dirty</button>
                        </div>
                      </>
                    )}

                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/60 text-[10px] font-bold uppercase tracking-tight shadow-sm border border-white/80">
                      {getMaintenanceIcon(room.maintenanceStatus)}
                      {room.maintenanceStatus}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mt-8">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="opacity-50">Base Nightly Rate</span>
                    <span className="text-slate-800">${type?.basePrice}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="opacity-50">Standard Occupancy</span>
                    <span className="text-slate-800">{type?.capacity} Adults</span>
                  </div>
                </div>
              </div>

              <div className="px-6 py-3 bg-white/40 border-t border-white/50 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">{room.status}</span>
                <button className="text-[10px] font-bold text-indigo-700 flex items-center gap-1 hover:underline transition-all">
                  Details <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredRooms.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="bg-slate-100 p-6 rounded-full mb-4">
            <Search className="w-12 h-12 opacity-20" />
          </div>
          <p className="text-lg font-bold text-slate-500">No rooms match your search</p>
          <p className="text-sm">Try adjusting your filters or search term</p>
        </div>
      )}
    </div>
  );
};

export default RoomsPage;

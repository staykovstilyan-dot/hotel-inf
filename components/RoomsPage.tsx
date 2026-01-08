
import React, { useState } from 'react';
import { 
  Plus, 
  MoreVertical, 
  Sparkles, 
  CheckCircle2,
  Clock,
  Search,
  ChevronDown,
  BedDouble,
  Edit2,
  Trash2,
  X
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    typeId: MOCK_ROOM_TYPES[0].id,
    status: RoomStatus.VACANT,
    maintenanceStatus: MaintenanceStatus.CLEAN
  });

  const filteredRooms = rooms.filter(room => {
    const matchesFilter = filter === 'all' || room.status === filter;
    const matchesSearch = room.roomNumber.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const room: Room = {
      id: Math.random().toString(36).substr(2, 9),
      ...newRoom
    };
    setRooms(prev => [...prev, room]);
    setIsModalOpen(false);
    setNewRoom({
      roomNumber: '',
      typeId: MOCK_ROOM_TYPES[0].id,
      status: RoomStatus.VACANT,
      maintenanceStatus: MaintenanceStatus.CLEAN
    });
  };

  const updateRoomStatus = (roomId: string, newStatus: RoomStatus) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: newStatus } : r));
    setActiveMenuId(null);
  };

  const deleteRoom = (roomId: string) => {
    if (confirm('Are you sure you want to delete this room unit?')) {
      setRooms(prev => prev.filter(r => r.id !== roomId));
      setActiveMenuId(null);
    }
  };

  const getStatusColor = (status: RoomStatus) => {
    switch (status) {
      case RoomStatus.VACANT: return 'border-emerald-500/30 bg-white text-emerald-700 hover:border-emerald-500';
      case RoomStatus.OCCUPIED: return 'border-indigo-500/30 bg-white text-indigo-700 hover:border-indigo-500';
      case RoomStatus.MAINTENANCE: return 'border-slate-400/30 bg-slate-50 text-slate-600';
      default: return 'border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Units & Inventory</h2>
          <p className="text-slate-500 font-medium">Manage and track your {rooms.length} property units</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 font-bold text-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Unit
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Quick search room #" 
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {['all', RoomStatus.VACANT, RoomStatus.OCCUPIED, RoomStatus.MAINTENANCE].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all border ${
                filter === f ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-50 border-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRooms.map((room) => {
          const type = MOCK_ROOM_TYPES.find(t => t.id === room.typeId);
          const isMenuOpen = activeMenuId === room.id;
          
          return (
            <div 
              key={room.id}
              className={`group relative border-2 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${getStatusColor(room.status)}`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-xl text-slate-800 border border-slate-100 group-hover:bg-white group-hover:scale-110 transition-transform">
                    {room.roomNumber}
                  </div>
                  <div className="relative">
                    <button 
                      onClick={() => setActiveMenuId(isMenuOpen ? null : room.id)}
                      className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {isMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-30 animate-in fade-in zoom-in-95">
                         <button onClick={() => updateRoomStatus(room.id, RoomStatus.VACANT)} className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-emerald-50 text-emerald-600 flex items-center gap-2">
                           <CheckCircle2 className="w-4 h-4" /> Set Vacant
                         </button>
                         <button onClick={() => updateRoomStatus(room.id, RoomStatus.OCCUPIED)} className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-indigo-50 text-indigo-600 flex items-center gap-2">
                           <Clock className="w-4 h-4" /> Set Occupied
                         </button>
                         <div className="h-px bg-slate-50 my-1 mx-2"></div>
                         <button onClick={() => deleteRoom(room.id)} className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-rose-50 text-rose-600 flex items-center gap-2">
                           <Trash2 className="w-4 h-4" /> Delete Unit
                         </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{type?.name}</h4>
                  <div className="flex items-center mt-1 space-x-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>{type?.capacity} Guest Limit</span>
                    <span>•</span>
                    <span>${type?.basePrice}/Night</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{room.status}</span>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-50 text-[10px] font-bold border border-slate-100">
                    <div className={`w-1.5 h-1.5 rounded-full ${room.maintenanceStatus === 'clean' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                    {room.maintenanceStatus}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Room Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Add Property Unit</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleAddRoom} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Room Number</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. 405"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold"
                    value={newRoom.roomNumber}
                    onChange={e => setNewRoom({...newRoom, roomNumber: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Unit Type</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-bold"
                    value={newRoom.typeId}
                    onChange={e => setNewRoom({...newRoom, typeId: e.target.value})}
                  >
                    {MOCK_ROOM_TYPES.map(t => <option key={t.id} value={t.id}>{t.name} (${t.basePrice})</option>)}
                  </select>
                </div>
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-100 rounded-2xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
                  >
                    Create Unit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsPage;


import React, { useState } from 'react';
import { Lock, Mail, Loader2, Hotel, ShieldCheck } from 'lucide-react';

interface AuthProps {
  onLogin: (user: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('admin@lumina.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simulate real network delay
    setTimeout(() => {
      if (email === 'admin@lumina.com' && password === 'admin123') {
        onLogin({ email, role: 'administrator', name: 'Lumina Manager' });
      } else {
        setError('The credentials you provided do not match our records.');
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] bg-indigo-600 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] bg-purple-600 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-[40px] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20">
          <div className="p-10 pb-0 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-200 mb-8 transform -rotate-6">
              <Hotel className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Lumina HMS</h1>
            <p className="text-slate-500 text-sm mt-3 font-medium px-4">Secure Gateway for Property Management</p>
          </div>

          <form onSubmit={handleLogin} className="p-10 space-y-6">
            {error && (
              <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-[11px] font-bold border border-rose-100 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></div>
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Console Identity</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-[6px] focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all text-sm font-bold"
                  placeholder="admin@lumina.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Access Key</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-[6px] focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all text-sm font-bold"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-200 hover:bg-black transition-all active:scale-[0.97] flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  Authenticate
                </>
              )}
            </button>
          </form>

          <div className="px-10 pb-10 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
              Default Credentials:<br/>
              <span className="text-indigo-500">admin@lumina.com</span> / <span className="text-indigo-500">admin123</span>
            </p>
          </div>
        </div>
        
        <p className="text-center mt-8 text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">
          Lumina Systems • V1.0 Stable Build
        </p>
      </div>
    </div>
  );
};

export default Auth;

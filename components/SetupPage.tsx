
import React from 'react';
import { Terminal, Database, Shield, Lock, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { SQL_SCHEMA } from '../constants';

const SetupPage: React.FC = () => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">System Architecture</h2>
          <p className="text-slate-500">Database schemas and backend configuration for Lumina HMS</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-widest">
            <CheckCircle className="w-3 h-3 mr-1" />
            V1.0.0 Stable
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-800 border-b border-slate-700">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">PostgreSQL Schema (Supabase)</span>
              </div>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/40 text-[10px] font-bold uppercase tracking-wider transition-all"
              >
                {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Code'}
              </button>
            </div>
            <div className="p-6 overflow-x-auto">
              <pre className="text-indigo-300 font-mono text-sm leading-relaxed">
                {SQL_SCHEMA}
              </pre>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-blue-100 rounded-lg">
                 <Database className="w-5 h-5 text-blue-600" />
               </div>
               <h3 className="font-bold text-slate-800">Supabase Integration Guide</h3>
             </div>
             <div className="space-y-4">
               {[
                 { step: 1, title: 'Create Project', desc: 'Initiate a new Supabase project and obtain your API URL and Service Key.' },
                 { step: 2, title: 'Run SQL Script', desc: 'Paste the schema above into the Supabase SQL Editor to create tables and relations.' },
                 { step: 3, title: 'Configure Auth', desc: 'Enable Email Auth and set up your initial admin users via the Supabase Dashboard.' },
                 { step: 4, title: 'Connect Frontend', desc: 'Update your environment variables with the project credentials.' },
               ].map(item => (
                 <div key={item.step} className="flex gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm">
                     {item.step}
                   </div>
                   <div>
                     <p className="font-bold text-slate-800 text-sm">{item.title}</p>
                     <p className="text-xs text-slate-500">{item.desc}</p>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200 relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Production Deployment</h3>
              <p className="text-indigo-100 text-sm mb-6 leading-relaxed">Ready to go live? Connect your repository to Vercel for instant deployment and CI/CD pipeline integration.</p>
              <button className="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-50 transition-all">
                Learn More
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
            <Shield className="absolute -bottom-8 -right-8 w-40 h-40 text-indigo-500/30 rotate-12 group-hover:rotate-6 transition-transform duration-500" />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Security Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-700">Role-Based Access</span>
                </div>
                <div className="w-8 h-4 bg-emerald-500 rounded-full relative">
                  <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-700">Daily Backups</span>
                </div>
                <div className="w-8 h-4 bg-emerald-500 rounded-full relative">
                  <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupPage;

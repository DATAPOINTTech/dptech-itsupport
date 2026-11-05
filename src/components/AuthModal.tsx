'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  X, 
  Lock, 
  Key, 
  ShieldCheck, 
  User, 
  Wrench, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export function AuthModal({ 
  isOpen, 
  onClose, 
  targetRole = 'TECHNICIAN' 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  targetRole?: 'ADMIN' | 'TECHNICIAN' | 'STUDENT';
}) {
  const { loginAs } = useApp();

  const [role, setRole] = useState<'ADMIN' | 'TECHNICIAN' | 'STUDENT'>(targetRole);
  const [username, setUsername] = useState(
    targetRole === 'ADMIN' ? 'admin' : targetRole === 'TECHNICIAN' ? 'marcus' : 'sophia'
  );
  const [password, setPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState('');

  // Sync role if targetRole changes
  React.useEffect(() => {
    setRole(targetRole);
    if (targetRole === 'ADMIN') {
      setUsername('admin');
    } else if (targetRole === 'TECHNICIAN') {
      setUsername('marcus');
    } else {
      setUsername('sophia');
    }
  }, [targetRole]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter both your institutional username and password.');
      return;
    }

    const success = loginAs(role, username, password);
    if (success) {
      onClose();
    } else {
      setErrorMsg('Invalid credentials. Please verify your username and password.');
    }
  };

  const handleQuickDemoFill = (selectedRole: 'ADMIN' | 'TECHNICIAN', user: string) => {
    setRole(selectedRole);
    setUsername(user);
    setPassword('dptech2026');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
        
        {/* Header */}
        <div className={`p-5 border-b border-slate-800 flex items-center justify-between ${
          role === 'ADMIN' 
            ? 'bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900' 
            : 'bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shadow ${
              role === 'ADMIN' 
                ? 'bg-indigo-600/30 border border-indigo-500/50 text-indigo-400' 
                : 'bg-emerald-600/30 border border-emerald-500/50 text-emerald-400'
            }`}>
              {role === 'ADMIN' ? <ShieldCheck className="h-5 w-5" /> : <Wrench className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {role === 'ADMIN' ? 'Administrator Security Sign-In' : 'Technician Workspace Sign-In'}
              </h3>
              <p className="text-xs text-slate-400">
                Institutional Single Sign-On &bull; Role-Gated Portal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleLogin} className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Role Selector Tabs */}
          <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setRole('TECHNICIAN');
                setUsername('marcus');
              }}
              className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                role === 'TECHNICIAN' 
                  ? 'bg-emerald-600 text-white shadow' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wrench className="h-3.5 w-3.5" /> Technician
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('ADMIN');
                setUsername('admin');
              }}
              className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                role === 'ADMIN' 
                  ? 'bg-indigo-600 text-white shadow' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" /> IT Admin
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Username or Institutional Email
            </label>
            <div className="relative">
              <User className="h-4 w-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                placeholder="e.g. admin or mvance@it.campus.edu"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Quick Demo Credentials Assistant */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] space-y-1.5">
            <p className="font-semibold text-slate-300 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-400" />
              Quick Demo Auto-Fill:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleQuickDemoFill('ADMIN', 'admin')}
                className="bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-700/40 text-indigo-300 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition"
              >
                Log in as IT Admin (David)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('TECHNICIAN', 'marcus')}
                className="bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/40 text-emerald-300 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition"
              >
                Tier-1 Tech (Marcus)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('TECHNICIAN', 'elena')}
                className="bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/40 text-emerald-300 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition"
              >
                Tier-2 Sec Tech (Elena)
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className={`w-full text-white text-xs font-bold py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition ${
                role === 'ADMIN'
                  ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
              }`}
            >
              Sign In to {role === 'ADMIN' ? 'Admin Management Portal' : 'Technician Workspace'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

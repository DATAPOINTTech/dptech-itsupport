'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  X, 
  ShieldCheck, 
  UserCheck, 
  Building2, 
  Mail, 
  Phone, 
  User, 
  CheckCircle2, 
  AlertCircle,
  GraduationCap
} from 'lucide-react';

export function SelfRegistrationModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  const { submitSelfRegistration, departments } = useApp();

  const [fullName, setFullName] = useState('');
  const [campusId, setCampusId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'FACULTY' | 'STAFF'>('STUDENT');
  const [departmentName, setDepartmentName] = useState(departments[0]?.name || 'Computer Science');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Verification check for institutional email
    if (!email.includes('@') || (!email.endsWith('.edu') && !email.includes('campus'))) {
      setErrorMsg('Please enter an official institutional email ending in @campus.edu');
      return;
    }

    submitSelfRegistration({
      fullName,
      campusId,
      email,
      phoneNumber: phone || '+1 (415) 555-0100',
      role,
      departmentName,
    });

    setIsSubmitted(true);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setFullName('');
    setCampusId('');
    setEmail('');
    setPhone('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950/90 via-slate-900 to-slate-900 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Campus IT Account Registration
              </h3>
              <p className="text-xs text-slate-400">
                Administrative verification gate required before ticket creation
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSubmitted ? (
          /* Confirmation Screen */
          <div className="p-6 text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-900/20">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Application Received &bull; Pending Verification</h4>
              <p className="text-xs text-slate-300 mt-2 max-w-sm mx-auto leading-relaxed">
                Thank you, <strong>{fullName}</strong>. Your registration for Campus ID <code>{campusId}</code> has been dispatched to the <strong>Admin Verification Desk</strong>.
              </p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 mt-4 text-left space-y-1">
                <p>&bull; <strong>Approval Gate:</strong> Accounts remain in pending status with read-only access to the public facilities catalog.</p>
                <p>&bull; <strong>Activation:</strong> Once cleared, you will receive an activation email at <code>{email}</code> to set your credentials.</p>
              </div>
            </div>
            <button
              onClick={handleResetAndClose}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-lg transition"
            >
              Return to Facilities Portal
            </button>
          </div>
        ) : (
          /* Registration Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {errorMsg && (
              <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Zainab Abbas"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Official Campus ID</label>
                <input
                  type="text"
                  placeholder="e.g. STU-2026-4412"
                  value={campusId}
                  onChange={e => setCampusId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Institutional Email (@campus.edu)
              </label>
              <input
                type="email"
                placeholder="e.g. zabbas@student.campus.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Role Type</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="STUDENT">Student</option>
                  <option value="FACULTY">Professor / Faculty</option>
                  <option value="STAFF">Administrative Staff</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
                <select
                  value={departmentName}
                  onChange={e => setDepartmentName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Computer Science & AI">Computer Science &amp; AI</option>
                  <option value="Electrical & Computer Engineering">Electrical Engineering</option>
                  <option value="Mechanical & Robotics">Mechanical &amp; Robotics</option>
                  <option value="Biomedical Sciences">Biomedical Sciences</option>
                  <option value="Central Administration">Central Administration</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">WhatsApp / Contact Phone Number</label>
              <input
                type="text"
                placeholder="+1 (415) 555-8821"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
                FERPA-compliant verification
              </span>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition"
              >
                Submit for Verification
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}

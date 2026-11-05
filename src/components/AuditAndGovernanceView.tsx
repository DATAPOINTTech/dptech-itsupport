'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  ShieldAlert, 
  Database, 
  Lock, 
  Terminal, 
  FileLock2, 
  Server, 
  RefreshCw 
} from 'lucide-react';

export function AuditAndGovernanceView() {
  const { auditLogs } = useApp();

  return (
    <div className="space-y-6">
      {/* Compliance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow">
          <div className="flex items-center space-x-2 text-indigo-400 mb-2">
            <Lock className="h-5 w-5" />
            <h4 className="text-sm font-semibold text-white">FERPA & Student Privacy</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Strict isolation of educational academic records from IT diagnostic logs. Role-Based Access Control (RBAC) and Row-Level Security (RLS) enforce scope isolation.
          </p>
          <div className="mt-3 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 p-1.5 rounded flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span> Policy Active: 100% Student PII Redaction
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow">
          <div className="flex items-center space-x-2 text-emerald-400 mb-2">
            <FileLock2 className="h-5 w-5" />
            <h4 className="text-sm font-semibold text-white">WORM Audio Storage</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            WhatsApp voice sessions captured with explicit two-party consent are archived in AWS S3 Object Lock (Write-Once-Read-Many) with a 90-day lifecycle auto-purge.
          </p>
          <div className="mt-3 text-[11px] font-mono text-indigo-400 bg-indigo-950/40 border border-indigo-900/60 p-1.5 rounded flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span> Retention: 90 Days Enforced (KMS Encrypted)
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow">
          <div className="flex items-center space-x-2 text-amber-400 mb-2">
            <ShieldAlert className="h-5 w-5" />
            <h4 className="text-sm font-semibold text-white">Step-Up 2FA Challenge</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            High-risk operations (MFA hardware token swaps, domain access elevation) require out-of-band verification via campus authenticator before technician sign-off.
          </p>
          <div className="mt-3 text-[11px] font-mono text-amber-400 bg-amber-950/40 border border-amber-900/60 p-1.5 rounded flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span> Challenge Enforcement: Strict 2FA
          </div>
        </div>

      </div>

      {/* Immutable Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Cryptographic Audit Trail (PostgreSQL WORM Log)</h3>
          </div>
          <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-0.5 rounded font-mono">
            {auditLogs.length} events logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/40 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Actor</th>
                <th className="p-3">Action Type</th>
                <th className="p-3">Ticket Reference</th>
                <th className="p-3">Event Details & Security Verification</th>
                <th className="p-3">Origin IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-850/40 text-slate-300">
                  <td className="p-3 text-slate-400">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-white">{log.actorName}</span>
                    <span className="text-[10px] text-slate-400 ml-1.5">({log.actorRole})</span>
                  </td>
                  <td className="p-3">
                    <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-indigo-300 font-semibold">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 text-slate-200">{log.ticketRef || 'GLOBAL'}</td>
                  <td className="p-3 text-slate-300 font-sans max-w-md">{log.details}</td>
                  <td className="p-3 text-slate-500">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

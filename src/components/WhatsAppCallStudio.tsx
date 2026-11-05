'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Phone, 
  PhoneOff, 
  UserPlus, 
  Mic, 
  MicOff, 
  Radio, 
  FileText, 
  ShieldCheck, 
  Users, 
  Volume2,
  ExternalLink,
  MessageSquareShare
} from 'lucide-react';

export function WhatsAppCallStudio({ onOpenTicket }: { onOpenTicket: (ticketId: string) => void }) {
  const { activeCall, startWhatsAppCall, addParticipantToCall, endWhatsAppCall, tickets } = useApp();
  
  // Local state for initiating a new call or adding a specialist
  const [callerName, setCallerName] = useState('Sophia Martinez (EE Lab)');
  const [callerPhone, setCallerPhone] = useState('+1 (415) 555-2381');
  
  const [isAddingParticipant, setIsAddingParticipant] = useState(false);
  const [specialistName, setSpecialistName] = useState('Dr. Robert Chen (Lab Dir)');
  const [specialistPhone, setSpecialistPhone] = useState('+1 (415) 555-8822');
  const [specialistRole, setSpecialistRole] = useState<'SPECIALIST' | 'VENDOR_ENGINEER' | 'LAB_MANAGER'>('LAB_MANAGER');
  const [isMuted, setIsMuted] = useState(false);

  const handleStartCall = (e: React.FormEvent) => {
    e.preventDefault();
    startWhatsAppCall(callerPhone, callerName);
  };

  const handleBridgeParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!specialistName) return;
    addParticipantToCall(specialistName, specialistPhone, specialistRole);
    setIsAddingParticipant(false);
  };

  const currentCallTicket = tickets.find(t => t.id === activeCall?.ticketId);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
            <Radio className={`h-5 w-5 ${activeCall ? 'animate-pulse text-emerald-400' : 'text-slate-400'}`} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              WhatsApp Business Cloud Voice / Video Gateway
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                LiveKit SFU + Meta API
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive Voice Response, Multi-Party Bridging & Speech-to-Text Transcription
            </p>
          </div>
        </div>

        {activeCall && (
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs text-emerald-400 font-mono font-medium">SESSION LIVE</span>
          </div>
        )}
      </div>

      <div className="p-5">
        {!activeCall ? (
          /* IDLE CALL SIMULATOR */
          <div className="max-w-xl mx-auto py-4">
            <div className="text-center mb-6">
              <div className="h-12 w-12 rounded-full bg-emerald-950 border border-emerald-600/40 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <Phone className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-medium text-slate-200">Simulate WhatsApp Inbound Support Call</h4>
              <p className="text-xs text-slate-400 mt-1">
                Demonstrates user phone-to-campus ID validation, two-party consent check, and auto ticket generation.
              </p>
            </div>

            <form onSubmit={handleStartCall} className="space-y-4 bg-slate-950/60 p-4 rounded-lg border border-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Caller Name</label>
                  <input
                    type="text"
                    value={callerName}
                    onChange={e => setCallerName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Caller WhatsApp Number</label>
                  <input
                    type="text"
                    value={callerPhone}
                    onChange={e => setCallerPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" /> Auto Two-Party Recording Consent Enforced
                </span>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-4 py-2 rounded-md shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition"
                >
                  <Phone className="h-3.5 w-3.5" /> Launch Inbound WhatsApp Call
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ACTIVE CALL STUDIO */
          <div className="space-y-5">
            {/* Call Status & Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Left: Active Participants */}
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-emerald-400" />
                    Connected Parties ({activeCall.participants.length})
                  </span>
                  <button
                    onClick={() => setIsAddingParticipant(true)}
                    className="text-[11px] bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded flex items-center gap-1 transition"
                  >
                    <UserPlus className="h-3 w-3" /> Bridge Specialist
                  </button>
                </div>

                <div className="space-y-2">
                  {activeCall.participants.map((p) => (
                    <div key={p.id} className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-2 rounded">
                      <div className="flex items-center space-x-2">
                        <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-300">
                          {p.name[0]}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-200">{p.name}</p>
                          <p className="text-[10px] text-slate-400">{p.phoneNumber} • {p.role}</p>
                        </div>
                      </div>
                      <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                    </div>
                  ))}
                </div>

                {/* Bridge Form Modal / Popover */}
                {isAddingParticipant && (
                  <form onSubmit={handleBridgeParticipant} className="mt-3 p-2.5 bg-slate-900 rounded border border-indigo-500/30 space-y-2">
                    <p className="text-[11px] font-semibold text-indigo-300">Invite Specialist into Conference</p>
                    <input
                      type="text"
                      placeholder="Name (e.g. Cisco Vendor Lead)"
                      value={specialistName}
                      onChange={e => setSpecialistName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Phone (+1...)"
                      value={specialistPhone}
                      onChange={e => setSpecialistPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                      required
                    />
                    <select
                      value={specialistRole}
                      onChange={e => setSpecialistRole(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                    >
                      <option value="SPECIALIST">Tier-2 Specialist</option>
                      <option value="LAB_MANAGER">Lab Manager</option>
                      <option value="VENDOR_ENGINEER">External Vendor Engineer</option>
                    </select>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsAddingParticipant(false)}
                        className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-2.5 py-1 rounded"
                      >
                        Bridge Now
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Middle: Live STT Transcript Stream */}
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 md:col-span-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Volume2 className="h-3.5 w-3.5 text-indigo-400" />
                      Live Whisper STT Transcript & Audio Stream
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                      Audio S3 Target: encrypted-worm/recordings
                    </span>
                  </div>

                  <div className="bg-slate-900 border border-slate-800/80 rounded p-3 h-32 overflow-y-auto font-mono text-xs text-slate-300 space-y-1">
                    {activeCall.transcriptText?.split('\n').map((line, idx) => (
                      <p key={idx} className={line.startsWith('[Bridged]') ? 'text-indigo-400 font-semibold' : 'text-slate-300'}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Call Controller Toolbar */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`p-2 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition ${
                        isMuted 
                          ? 'bg-rose-950/60 border-rose-500/40 text-rose-300' 
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {isMuted ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                      {isMuted ? 'Muted' : 'Mute Mic'}
                    </button>

                    {currentCallTicket && (
                      <button
                        onClick={() => onOpenTicket(currentCallTicket.id)}
                        className="bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-900/60 p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> Open Ticket ({currentCallTicket.referenceId})
                      </button>
                    )}
                  </div>

                  <button
                    onClick={endWhatsAppCall}
                    className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-rose-600/20 transition"
                  >
                    <PhoneOff className="h-3.5 w-3.5" /> End Call & Append Transcript
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

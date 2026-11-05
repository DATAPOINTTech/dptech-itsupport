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
  MessageSquareShare,
  Bot,
  Sparkles,
  Send,
  MessageCircle,
  Headphones,
  CheckCheck,
  Check,
  ArrowRight
} from 'lucide-react';

export function WhatsAppCallStudio({ onOpenTicket }: { onOpenTicket: (ticketId: string) => void }) {
  const { 
    activeCall, 
    startWhatsAppCall, 
    addParticipantToCall, 
    endWhatsAppCall, 
    tickets,
    aishaConfig,
    whatsAppMessages,
    sendWhatsAppMessage,
    simulateAishaCallResponse
  } = useApp();

  // Mode: Voice Call or Chat Simulator
  const [studioMode, setStudioMode] = useState<'VOICE' | 'CHAT'>('VOICE');
  
  // Call initiation state
  const [callerName, setCallerName] = useState('Sophia Martinez (EE Lab)');
  const [callerPhone, setCallerPhone] = useState('+1 (415) 555-2381');
  
  // Specialist bridge state
  const [isAddingParticipant, setIsAddingParticipant] = useState(false);
  const [specialistName, setSpecialistName] = useState('Dr. Robert Chen (Lab Dir)');
  const [specialistPhone, setSpecialistPhone] = useState('+1 (415) 555-8822');
  const [specialistRole, setSpecialistRole] = useState<'SPECIALIST' | 'VENDOR_ENGINEER' | 'LAB_MANAGER'>('LAB_MANAGER');
  const [isMuted, setIsMuted] = useState(false);
  const [isAishaSpeaking, setIsAishaSpeaking] = useState(false);

  // Chat simulator input
  const [chatInput, setChatInput] = useState('');
  const [customSpeechInput, setCustomSpeechInput] = useState('');

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

  const handleSimulateUserSpeech = async (speechText: string) => {
    if (!speechText.trim() || !activeCall) return;
    setIsAishaSpeaking(true);
    await simulateAishaCallResponse(speechText);
    setTimeout(() => {
      setIsAishaSpeaking(false);
    }, 1500);
    setCustomSpeechInput('');
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setChatInput('');
    await sendWhatsAppMessage(msg, callerName);
  };

  const currentCallTicket = tickets.find(t => t.id === activeCall?.ticketId);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      
      {/* Studio Header */}
      <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-indigo-950/80 p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md">
            <Radio className={`h-5 w-5 ${activeCall ? 'animate-pulse text-emerald-400' : 'text-slate-400'}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                WhatsApp Business Cloud Gateway &mdash; Agent {aishaConfig.name}
              </h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-mono font-medium">
                Meta Cloud API v21.0
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive Voice Response, AI Speech Diagnostics, and Real-Time WhatsApp Messaging
            </p>
          </div>
        </div>

        {/* View Switcher: Voice vs WhatsApp Chat */}
        <div className="flex items-center space-x-2">
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1 text-xs">
            <button
              onClick={() => setStudioMode('VOICE')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                studioMode === 'VOICE'
                  ? 'bg-emerald-600 text-white shadow font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Headphones className="h-3.5 w-3.5" /> Voice Call Gateway
              {activeCall && (
                <span className="h-2 w-2 rounded-full bg-emerald-300 animate-ping"></span>
              )}
            </button>
            <button
              onClick={() => setStudioMode('CHAT')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                studioMode === 'CHAT'
                  ? 'bg-emerald-600 text-white shadow font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageCircle className="h-3.5 w-3.5" /> WhatsApp Chat Simulator
              <span className="text-[10px] bg-slate-800 text-emerald-400 px-1.5 py-0.2 rounded-full font-mono">
                {whatsAppMessages.length}
              </span>
            </button>
          </div>
        </div>

      </div>

      <div className="p-6">

        {/* ============================================================== */}
        {/* MODE 1: VOICE CALL GATEWAY */}
        {/* ============================================================== */}
        {studioMode === 'VOICE' && (
          <div>
            {!activeCall ? (
              /* IDLE STATE: LAUNCH CALL */
              <div className="max-w-2xl mx-auto py-4">
                <div className="text-center mb-6">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-950 border border-emerald-600/40 text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-900/20">
                    <Phone className="h-7 w-7" />
                  </div>
                  <h4 className="text-base font-semibold text-white">
                    Simulate Inbound WhatsApp Call to Agent {aishaConfig.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-lg mx-auto">
                    Aisha auto-answers the incoming WhatsApp voice call, authenticates campus identity, generates a ticket, and answers technical inquiries via live voice synthesis.
                  </p>
                </div>

                <form onSubmit={handleStartCall} className="space-y-4 bg-slate-950/70 p-5 rounded-2xl border border-slate-800 shadow-xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Caller Name &amp; Dept</label>
                      <input
                        type="text"
                        value={callerName}
                        onChange={e => setCallerName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Caller WhatsApp Number</label>
                      <input
                        type="text"
                        value={callerPhone}
                        onChange={e => setCallerPhone(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Assigned AI Agent: {aishaConfig.name}</p>
                        <p className="text-[11px] text-slate-400">{aishaConfig.title} ({aishaConfig.voice})</p>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 px-2 py-0.5 rounded-full">
                      Ready
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      Two-Party Call Recording Consent Enforced (FERPA / GDPR)
                    </span>
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition"
                    >
                      <Phone className="h-4 w-4" /> Start Inbound Call Simulation
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* ACTIVE CALL STUDIO */
              <div className="space-y-6">
                
                {/* Aisha Live Speaking Avatar & Call Status Card */}
                <div className="bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-lg ${isAishaSpeaking ? 'ring-4 ring-emerald-500/50 animate-pulse' : ''}`}>
                        <div className="h-full w-full bg-slate-950 rounded-2xl flex items-center justify-center">
                          <Bot className="h-7 w-7 text-indigo-400" />
                        </div>
                      </div>
                      <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
                        <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping"></span>
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-white">{aishaConfig.name}</h4>
                        <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                          AI Voice Agent Active
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Connected with <span className="font-semibold text-emerald-400">{activeCall.callerName}</span> ({activeCall.callerNumber})
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                        Session: {activeCall.providerCallId} • Status: {isAishaSpeaking ? '🎙️ Aisha is speaking...' : 'Listening to caller...'}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Ticket Pill */}
                  <div className="flex items-center gap-3">
                    {currentCallTicket && (
                      <button
                        onClick={() => onOpenTicket(currentCallTicket.id)}
                        className="bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-900/80 px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition shadow"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> View Ticket ({currentCallTicket.referenceId})
                      </button>
                    )}
                    <button
                      onClick={endWhatsAppCall}
                      className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-rose-600/20 transition"
                    >
                      <PhoneOff className="h-4 w-4" /> End Call
                    </button>
                  </div>
                </div>

                {/* Call Main Body: Participants & Live Transcript */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Column: Participants & Bridge Specialist */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                          <Users className="h-4 w-4 text-emerald-400" />
                          Conference Parties ({activeCall.participants.length})
                        </span>
                        <button
                          onClick={() => setIsAddingParticipant(true)}
                          className="text-[11px] bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
                        >
                          <UserPlus className="h-3 w-3" /> Bridge Specialist
                        </button>
                      </div>

                      <div className="space-y-2">
                        {activeCall.participants.map((p) => (
                          <div key={p.id} className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl">
                            <div className="flex items-center space-x-2.5">
                              <div className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                                p.isAiAgent 
                                  ? 'bg-indigo-600 text-white' 
                                  : p.role === 'CALLER' 
                                  ? 'bg-emerald-600 text-white' 
                                  : 'bg-slate-800 text-slate-300'
                              }`}>
                                {p.isAiAgent ? <Bot className="h-4 w-4" /> : p.name[0]}
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-slate-200">{p.name}</p>
                                <p className="text-[10px] text-slate-400">{p.phoneNumber} • {p.role}</p>
                              </div>
                            </div>
                            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                          </div>
                        ))}
                      </div>

                      {/* Add Specialist Modal / Popover */}
                      {isAddingParticipant && (
                        <form onSubmit={handleBridgeParticipant} className="mt-3 p-3 bg-slate-900 rounded-xl border border-indigo-500/30 space-y-2.5">
                          <p className="text-xs font-semibold text-indigo-300">Bridge On-Duty Specialist</p>
                          <input
                            type="text"
                            placeholder="Name (e.g. Cisco Field Tech)"
                            value={specialistName}
                            onChange={e => setSpecialistName(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-white"
                            required
                          />
                          <input
                            type="text"
                            placeholder="Phone (+1...)"
                            value={specialistPhone}
                            onChange={e => setSpecialistPhone(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-white font-mono"
                            required
                          />
                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setIsAddingParticipant(false)}
                              className="text-xs text-slate-400 px-2.5 py-1"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-3 py-1 rounded"
                            >
                              Bridge Call
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Live STT Transcript & Interactive Dialogue Simulator */}
                  <div className="lg:col-span-8 space-y-4">
                    
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                          <Volume2 className="h-4 w-4 text-indigo-400" />
                          Live Whisper STT Audio Stream &amp; Conversation
                        </span>
                        <span className="text-[10px] bg-slate-900 text-slate-400 border border-slate-800 px-2 py-0.5 rounded">
                          LiveKit Audio SFU Bridge
                        </span>
                      </div>

                      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 h-48 overflow-y-auto font-mono text-xs text-slate-300 space-y-2 leading-relaxed">
                        {activeCall.transcriptText?.split('\n').map((line, idx) => {
                          const isAishaLine = line.includes(`[${aishaConfig.name}`) || line.includes('[Aisha');
                          const isCallerLine = line.startsWith('[Caller') || line.startsWith('[00:01]');
                          return (
                            <p 
                              key={idx} 
                              className={`p-1.5 rounded ${
                                isAishaLine 
                                  ? 'bg-indigo-950/50 text-indigo-300 border-l-2 border-indigo-500 pl-2' 
                                  : isCallerLine 
                                  ? 'text-emerald-300' 
                                  : 'text-slate-300'
                              }`}
                            >
                              {line}
                            </p>
                          );
                        })}
                      </div>

                      {/* Interactive User Speech Simulation with Aisha */}
                      <div className="pt-2 space-y-2">
                        <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                          Simulate Caller Speech to Test Aisha&apos;s Voice AI:
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleSimulateUserSpeech("My Wi-Fi keeps dropping in the Science building.")}
                            className="text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 px-2.5 py-1.5 rounded-lg transition text-left"
                          >
                            &ldquo;My Wi-Fi keeps dropping in Science building&rdquo;
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSimulateUserSpeech("I am locked out of my student portal and need an MFA reset.")}
                            className="text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 px-2.5 py-1.5 rounded-lg transition text-left"
                          >
                            &ldquo;Locked out of student portal / MFA reset&rdquo;
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSimulateUserSpeech("Can I please speak with a human technician right now?")}
                            className="text-xs bg-slate-900 hover:bg-slate-800 text-rose-300 border border-rose-500/30 px-2.5 py-1.5 rounded-lg transition text-left"
                          >
                            &ldquo;Can I speak to a human technician?&rdquo;
                          </button>
                        </div>

                        {/* Custom Speech Input */}
                        <div className="flex gap-2 pt-1">
                          <input
                            type="text"
                            placeholder="Type any custom sentence the caller says..."
                            value={customSpeechInput}
                            onChange={e => setCustomSpeechInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') handleSimulateUserSpeech(customSpeechInput); }}
                            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleSimulateUserSpeech(customSpeechInput)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1"
                          >
                            Speak to Aisha
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>

              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* MODE 2: WHATSAPP CHAT SIMULATOR */}
        {/* ============================================================== */}
        {studioMode === 'CHAT' && (
          <div className="max-w-2xl mx-auto">
            
            {/* WhatsApp App Mock Shell */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[560px]">
              
              {/* WhatsApp Chat Header */}
              <div className="bg-[#075e54] text-white p-3.5 flex items-center justify-between shadow-md">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-white p-0.5 flex items-center justify-center">
                      <img src="/datapoint-logo.png" alt="DATAPOINT" className="h-full w-full object-contain" />
                    </div>
                    <span className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-400 border-2 border-[#075e54] rounded-full"></span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold leading-tight">DATAPOINT Technologies Support</h4>
                    <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                      <Bot className="h-3 w-3" /> Agent {aishaConfig.name} Online
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-emerald-100">
                  <span className="text-[10px] bg-emerald-800/80 px-2 py-0.5 rounded-full font-mono">
                    Cloud API
                  </span>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0b141a]">
                
                {/* Security encryption pill */}
                <div className="text-center my-1">
                  <span className="inline-block bg-[#182229] text-[#8696a0] text-[10px] px-3 py-1 rounded-lg border border-[#222e35]">
                    🔒 Messages are end-to-end encrypted &amp; verified by DATAPOINT Technologies
                  </span>
                </div>

                {whatsAppMessages.map((msg) => {
                  const isUser = msg.sender === 'USER';
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div 
                        className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm relative ${
                          isUser 
                            ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none' 
                            : 'bg-[#202c33] text-[#e9edef] rounded-tl-none border border-[#2a3942]'
                        }`}
                      >
                        {!isUser && (
                          <p className="text-[10px] font-bold text-emerald-400 mb-1 flex items-center gap-1">
                            <Bot className="h-3 w-3" /> {msg.senderName}
                          </p>
                        )}
                        <p className="whitespace-pre-line">{msg.content}</p>

                        <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-[#8696a0]">
                          <span>{msg.timestamp}</span>
                          {isUser && (
                            <CheckCheck className="h-3 w-3 text-[#53bdeb]" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

              </div>

              {/* Quick Prompt Bar */}
              <div className="bg-[#111b21] border-t border-[#222e35] px-3 py-2 flex items-center gap-2 overflow-x-auto text-[11px]">
                <span className="text-slate-400 text-[10px] shrink-0">Quick prompts:</span>
                <button
                  type="button"
                  onClick={() => sendWhatsAppMessage("How do I set up Eduroam Wi-Fi on my phone?", callerName)}
                  className="bg-[#202c33] hover:bg-[#2a3942] text-slate-300 px-2.5 py-1 rounded-full whitespace-nowrap transition"
                >
                  Eduroam Wi-Fi setup
                </button>
                <button
                  type="button"
                  onClick={() => sendWhatsAppMessage("Canvas is not letting me submit my quiz.", callerName)}
                  className="bg-[#202c33] hover:bg-[#2a3942] text-slate-300 px-2.5 py-1 rounded-full whitespace-nowrap transition"
                >
                  Canvas Quiz issue
                </button>
                <button
                  type="button"
                  onClick={() => sendWhatsAppMessage("I need to speak to a human technician.", callerName)}
                  className="bg-[#202c33] hover:bg-[#2a3942] text-rose-300 px-2.5 py-1 rounded-full whitespace-nowrap transition"
                >
                  Escalate to human
                </button>
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendChatMessage} className="bg-[#202c33] p-3 flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type a message as student/caller..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  className="flex-1 bg-[#2a3942] text-[#d1d7db] text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:outline-none focus:border-emerald-500 placeholder-[#8696a0]"
                />
                <button
                  type="submit"
                  className="bg-[#00a884] hover:bg-[#02906f] text-white p-2.5 rounded-xl transition shadow"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

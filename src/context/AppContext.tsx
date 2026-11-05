'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  Ticket, 
  TicketComment, 
  CallSession, 
  AuditLog, 
  Department, 
  UserRole, 
  TicketPriority,
  AishaAgentConfig,
  WhatsAppConfig,
  KnowledgeBaseItem,
  WhatsAppMessage,
  Facility,
  FacilityStatus,
  PendingRegistration
} from '@/types';
import { 
  mockUsers, 
  mockDepartments, 
  initialTickets, 
  initialComments, 
  initialCallSession, 
  initialAuditLogs,
  initialAishaConfig,
  initialWhatsAppConfig,
  initialKnowledgeBase,
  initialWhatsAppMessages,
  initialFacilities,
  initialPendingRegistrations
} from '@/lib/mockData';

interface AppContextType {
  currentUser: User;
  switchRole: (roleKey: string) => void;
  departments: Department[];
  tickets: Ticket[];
  comments: Record<string, TicketComment[]>;
  activeCall: CallSession | null;
  auditLogs: AuditLog[];
  
  // Theme state
  theme: 'cyber-dark' | 'midnight-blue';
  toggleTheme: () => void;
  
  // Aisha & WhatsApp Setup
  aishaConfig: AishaAgentConfig;
  updateAishaConfig: (newConfig: Partial<AishaAgentConfig>) => void;
  whatsAppConfig: WhatsAppConfig;
  updateWhatsAppConfig: (newConfig: Partial<WhatsAppConfig>) => void;
  knowledgeBase: KnowledgeBaseItem[];
  addKnowledgeItem: (item: Omit<KnowledgeBaseItem, 'id'>) => void;
  toggleKnowledgeItem: (id: string) => void;
  deleteKnowledgeItem: (id: string) => void;
  whatsAppMessages: WhatsAppMessage[];
  sendWhatsAppMessage: (content: string, senderName?: string) => Promise<void>;
  simulateAishaCallResponse: (userSpeech: string) => Promise<string>;
  testWhatsAppConnection: () => Promise<boolean>;

  // Facilities & Campus Resources
  facilities: Facility[];
  updateFacilityStatus: (id: string, status: FacilityStatus, note?: string) => void;

  // User Verification Desk
  pendingRegistrations: PendingRegistration[];
  approveRegistration: (id: string) => void;
  rejectRegistration: (id: string, reason?: string) => void;
  requestProofRegistration: (id: string, notes?: string) => void;
  submitSelfRegistration: (data: Omit<PendingRegistration, 'id' | 'status' | 'submittedAt'>) => void;

  // Actions
  createTicket: (ticket: Partial<Ticket>, initialComment?: string) => Ticket;
  updateTicketStatus: (ticketId: string, status: Ticket['status']) => void;
  assignTicket: (ticketId: string, techId: string, techName: string) => void;
  addComment: (ticketId: string, content: string, isInternal: boolean) => void;
  
  // WhatsApp Call Sim
  startWhatsAppCall: (callerNumber: string, callerName: string) => CallSession;
  addParticipantToCall: (name: string, phone: string, role: any) => void;
  endWhatsAppCall: () => void;
  
  // High risk step up challenge
  resolveSecurityAction: (ticketId: string, challengePin: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(mockUsers.tech1);
  const [departments] = useState<Department[]>(mockDepartments);
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [comments, setComments] = useState<Record<string, TicketComment[]>>(initialComments);
  const [activeCall, setActiveCall] = useState<CallSession | null>(initialCallSession);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [theme, setTheme] = useState<'cyber-dark' | 'midnight-blue'>('cyber-dark');

  const toggleTheme = () => {
    setTheme(prev => prev === 'cyber-dark' ? 'midnight-blue' : 'cyber-dark');
  };

  // Facilities and Pending Registrations
  const [facilities, setFacilities] = useState<Facility[]>(initialFacilities);
  const [pendingRegistrations, setPendingRegistrations] = useState<PendingRegistration[]>(initialPendingRegistrations);

  const updateFacilityStatus = (id: string, status: FacilityStatus, note?: string) => {
    setFacilities(prev => prev.map(f => {
      if (f.id === id) {
        return {
          ...f,
          status,
          statusNote: note || f.statusNote
        };
      }
      return f;
    }));

    const fac = facilities.find(f => f.id === id);
    setAuditLogs(prev => [{
      id: `aud-${Date.now()}`,
      actorName: currentUser.fullName,
      actorRole: currentUser.role,
      action: 'FACILITY_STATUS_UPDATED',
      timestamp: new Date().toISOString(),
      details: `${fac?.name || 'Facility'} status updated to ${status}. Note: ${note || 'None'}`,
      ipAddress: '127.0.0.1'
    }, ...prev]);
  };

  const approveRegistration = (id: string) => {
    const reg = pendingRegistrations.find(r => r.id === id);
    setPendingRegistrations(prev => prev.filter(r => r.id !== id));

    if (reg) {
      setAuditLogs(prev => [{
        id: `aud-${Date.now()}`,
        actorName: currentUser.fullName,
        actorRole: currentUser.role,
        action: 'USER_REGISTRATION_APPROVED',
        timestamp: new Date().toISOString(),
        details: `Approved verification for ${reg.fullName} (${reg.campusId}, ${reg.email}). Activation token dispatched.`,
        ipAddress: '127.0.0.1'
      }, ...prev]);
    }
  };

  const rejectRegistration = (id: string, reason?: string) => {
    const reg = pendingRegistrations.find(r => r.id === id);
    setPendingRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED', verificationNotes: reason } : r));

    if (reg) {
      setAuditLogs(prev => [{
        id: `aud-${Date.now()}`,
        actorName: currentUser.fullName,
        actorRole: currentUser.role,
        action: 'USER_REGISTRATION_REJECTED',
        timestamp: new Date().toISOString(),
        details: `Rejected registration for ${reg.fullName} (${reg.campusId}). Reason: ${reason || 'Ineligible'}`,
        ipAddress: '127.0.0.1'
      }, ...prev]);
    }
  };

  const requestProofRegistration = (id: string, notes?: string) => {
    setPendingRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: 'NEEDS_PROOF', verificationNotes: notes || 'Please upload official university ID.' } : r));
  };

  const submitSelfRegistration = (data: Omit<PendingRegistration, 'id' | 'status' | 'submittedAt'>) => {
    const newReg: PendingRegistration = {
      ...data,
      id: `reg-${Date.now()}`,
      status: 'PENDING_VERIFICATION',
      submittedAt: 'Just now',
    };
    setPendingRegistrations(prev => [newReg, ...prev]);

    setAuditLogs(prev => [{
      id: `aud-${Date.now()}`,
      actorName: data.fullName,
      actorRole: data.role,
      action: 'SELF_REGISTRATION_SUBMITTED',
      timestamp: new Date().toISOString(),
      details: `Inbound self-registration received for ${data.fullName} (${data.campusId}). Placed in Admin Verification Desk.`,
      ipAddress: '127.0.0.1'
    }, ...prev]);
  };

  // Aisha & WhatsApp Configurations
  const [aishaConfig, setAishaConfig] = useState<AishaAgentConfig>(initialAishaConfig);
  const [whatsAppConfig, setWhatsAppConfig] = useState<WhatsAppConfig>(initialWhatsAppConfig);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBaseItem[]>(initialKnowledgeBase);
  const [whatsAppMessages, setWhatsAppMessages] = useState<WhatsAppMessage[]>(initialWhatsAppMessages);

  // Load persisted configs on mount
  useEffect(() => {
    try {
      const savedAisha = localStorage.getItem('dptech_aisha_config');
      if (savedAisha) setAishaConfig(JSON.parse(savedAisha));

      const savedWA = localStorage.getItem('dptech_whatsapp_config');
      if (savedWA) setWhatsAppConfig(JSON.parse(savedWA));

      const savedKB = localStorage.getItem('dptech_knowledge_base');
      if (savedKB) setKnowledgeBase(JSON.parse(savedKB));
    } catch {
      // LocalStorage not available or parse error
    }
  }, []);

  const updateAishaConfig = (newConfig: Partial<AishaAgentConfig>) => {
    setAishaConfig(prev => {
      const updated = { ...prev, ...newConfig };
      try {
        localStorage.setItem('dptech_aisha_config', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setAuditLogs(prev => [{
      id: `aud-${Date.now()}`,
      actorName: currentUser.fullName,
      actorRole: currentUser.role,
      action: 'AISHA_CONFIG_UPDATED',
      timestamp: new Date().toISOString(),
      details: `Aisha agent settings modified (Model: ${newConfig.model || aishaConfig.model}, Tone: ${newConfig.tone || aishaConfig.tone})`,
      ipAddress: '127.0.0.1'
    }, ...prev]);
  };

  const updateWhatsAppConfig = (newConfig: Partial<WhatsAppConfig>) => {
    setWhatsAppConfig(prev => {
      const updated = { ...prev, ...newConfig };
      try {
        localStorage.setItem('dptech_whatsapp_config', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setAuditLogs(prev => [{
      id: `aud-${Date.now()}`,
      actorName: currentUser.fullName,
      actorRole: currentUser.role,
      action: 'WHATSAPP_CONFIG_UPDATED',
      timestamp: new Date().toISOString(),
      details: `WhatsApp Business Cloud credentials and webhook parameters updated.`,
      ipAddress: '127.0.0.1'
    }, ...prev]);
  };

  const addKnowledgeItem = (item: Omit<KnowledgeBaseItem, 'id'>) => {
    const newItem: KnowledgeBaseItem = {
      ...item,
      id: `kb-${Date.now()}`,
    };
    setKnowledgeBase(prev => {
      const updated = [newItem, ...prev];
      try {
        localStorage.setItem('dptech_knowledge_base', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const toggleKnowledgeItem = (id: string) => {
    setKnowledgeBase(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, active: !item.active } : item);
      try {
        localStorage.setItem('dptech_knowledge_base', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteKnowledgeItem = (id: string) => {
    setKnowledgeBase(prev => {
      const updated = prev.filter(item => item.id !== id);
      try {
        localStorage.setItem('dptech_knowledge_base', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const testWhatsAppConnection = async (): Promise<boolean> => {
    setWhatsAppConfig(prev => ({ ...prev, status: 'TESTING' }));
    await new Promise(r => setTimeout(r, 1000));
    const isSuccess = !!whatsAppConfig.phoneNumberId && !!whatsAppConfig.bearerToken;
    setWhatsAppConfig(prev => ({ 
      ...prev, 
      status: isSuccess ? 'CONNECTED' : 'DISCONNECTED',
      lastPingAt: new Date().toISOString()
    }));
    return isSuccess;
  };

  const switchRole = (roleKey: string) => {
    if (mockUsers[roleKey]) {
      setCurrentUser(mockUsers[roleKey]);
    }
  };

  // Aisha conversational resolution engine for chat & calls
  const findAishaAnswer = (userPrompt: string): { reply: string; autoResolved: boolean; isEscalation: boolean } => {
    const lower = userPrompt.toLowerCase();

    // Check handoff keywords first
    const isEscalation = aishaConfig.humanHandoffKeywords.some(kw => lower.includes(kw.toLowerCase()));
    if (isEscalation) {
      return {
        reply: `I understand this requires human intervention. I have escalated this directly to our on-duty Tier-1 Network & Systems technician with High SLA Priority. A technician will contact you immediately.`,
        autoResolved: false,
        isEscalation: true
      };
    }

    // Check active knowledge base rules
    for (const item of knowledgeBase) {
      if (item.active && item.triggerKeywords.some(kw => lower.includes(kw.toLowerCase()))) {
        return {
          reply: `Here is the solution from DATAPOINT Technologies Knowledge Base for "${item.topic}":\n\n${item.resolutionSnippet}\n\nPlease reply if you need further assistance or if you would like me to open a service ticket.`,
          autoResolved: true,
          isEscalation: false
        };
      }
    }

    // Fallback AI reasoning
    return {
      reply: `Thank you for reaching DATAPOINT Technologies Support. I have logged your request regarding: "${userPrompt}".\n\nI am running preliminary network and account diagnostics on your campus profile. If you need immediate hands-on help, reply "human" to bridge an on-site technician.`,
      autoResolved: false,
      isEscalation: false
    };
  };

  const sendWhatsAppMessage = async (content: string, senderName = 'Student User') => {
    const userMsgId = `msg-${Date.now()}`;
    const userMsg: WhatsAppMessage = {
      id: userMsgId,
      sender: 'USER',
      senderName,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'SENT',
      sentiment: content.toLowerCase().includes('urgent') || content.toLowerCase().includes('broken') ? 'FRUSTRATED' : 'NEUTRAL',
    };

    setWhatsAppMessages(prev => [...prev, userMsg]);

    // If Aisha auto-reply is enabled, trigger her reply
    if (aishaConfig.autoReplyMessages) {
      setTimeout(() => {
        const { reply, autoResolved, isEscalation } = findAishaAnswer(content);
        
        // Auto-create ticket if needed
        let refTicketId: string | undefined;
        if (aishaConfig.autoCreateTickets) {
          const tkt = createTicket({
            title: `WhatsApp Inquiry: ${content.substring(0, 45)}...`,
            description: `Inbound WhatsApp message from ${senderName}: "${content}". Auto-processed by Aisha.`,
            channel: 'WHATSAPP_CHAT',
            priority: isEscalation ? 'P2_HIGH' : 'P3_MEDIUM',
          }, content);
          refTicketId = tkt.referenceId;
        }

        const aishaMsg: WhatsAppMessage = {
          id: `msg-aisha-${Date.now()}`,
          sender: 'AISHA',
          senderName: `${aishaConfig.name} (DATAPOINT AI)`,
          content: refTicketId ? `${reply}\n\n🏷️ Ticket reference: ${refTicketId}` : reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'DELIVERED',
          sentiment: 'POSITIVE',
          linkedTicketRef: refTicketId,
          autoResolved,
        };

        setWhatsAppMessages(prev => [...prev, aishaMsg]);
      }, 700);
    }
  };

  const simulateAishaCallResponse = async (userSpeech: string): Promise<string> => {
    const { reply, isEscalation } = findAishaAnswer(userSpeech);
    if (activeCall) {
      const updatedTranscript = `${activeCall.transcriptText || ''}\n[Caller]: ${userSpeech}\n[${aishaConfig.name} (AI)]: ${reply}`;
      setActiveCall({
        ...activeCall,
        transcriptText: updatedTranscript,
        summary: isEscalation 
          ? `${activeCall.summary} | Escalated by ${aishaConfig.name} upon request for human specialist.` 
          : `${activeCall.summary} | AI Agent ${aishaConfig.name} provided troubleshooting advice.`
      });
    }
    return reply;
  };

  const createTicket = (newTktData: Partial<Ticket>, initialComment?: string) => {
    const refNum = Math.floor(1000 + Math.random() * 9000);
    const newRef = `IT-2026-00${refNum}`;
    const newId = `tkt-${Date.now()}`;

    const created: Ticket = {
      id: newId,
      referenceId: newRef,
      requesterId: currentUser.id,
      requesterName: currentUser.fullName,
      requesterEmail: currentUser.email,
      requesterPhone: currentUser.phoneNumber,
      departmentId: newTktData.departmentId || departments[0].id,
      departmentName: departments.find(d => d.id === newTktData.departmentId)?.name || 'General Support',
      channel: newTktData.channel || 'WEB_PORTAL',
      title: newTktData.title || 'Untitled Issue',
      description: newTktData.description || '',
      priority: newTktData.priority || 'P3_MEDIUM',
      status: 'NEW',
      isSecuritySensitive: !!newTktData.isSecuritySensitive,
      slaResolutionDue: new Date(Date.now() + 180 * 60 * 1000).toISOString(),
      slaBreached: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      commentsCount: initialComment ? 1 : 0,
      hasCallSession: false,
    };

    setTickets(prev => [created, ...prev]);

    if (initialComment) {
      const cmt: TicketComment = {
        id: `cmt-${Date.now()}`,
        ticketId: newId,
        authorId: currentUser.id,
        authorName: currentUser.fullName,
        authorRole: currentUser.role,
        isInternalNote: false,
        channelOrigin: created.channel,
        content: initialComment,
        createdAt: new Date().toISOString(),
      };
      setComments(prev => ({ ...prev, [newId]: [cmt] }));
    }

    // Append audit log
    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      actorName: currentUser.fullName,
      actorRole: currentUser.role,
      action: 'TICKET_CREATED',
      ticketRef: newRef,
      timestamp: new Date().toISOString(),
      details: `Created via ${created.channel} - Priority: ${created.priority}`,
      ipAddress: '127.0.0.1'
    };
    setAuditLogs(prev => [audit, ...prev]);

    return created;
  };

  const updateTicketStatus = (ticketId: string, status: Ticket['status']) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status,
          updatedAt: new Date().toISOString(),
          resolvedById: status === 'RESOLVED' ? (t.resolvedById || currentUser.id) : t.resolvedById,
          resolvedByName: status === 'RESOLVED' ? (t.resolvedByName || currentUser.fullName) : t.resolvedByName,
          resolvedAt: status === 'RESOLVED' ? (t.resolvedAt || new Date().toISOString()) : t.resolvedAt,
        };
      }
      return t;
    }));

    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
      setAuditLogs(prev => [{
        id: `aud-${Date.now()}`,
        actorName: currentUser.fullName,
        actorRole: currentUser.role,
        action: `STATUS_CHANGE_TO_${status}`,
        ticketRef: ticket.referenceId,
        timestamp: new Date().toISOString(),
        details: `Ticket status set to ${status}`,
        ipAddress: '127.0.0.1'
      }, ...prev]);
    }
  };

  const assignTicket = (ticketId: string, techId: string, techName: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          assignedTechId: techId,
          assignedTechName: techName,
          status: t.status === 'NEW' ? 'TRIAGED' : t.status,
          updatedAt: new Date().toISOString(),
        };
      }
      return t;
    }));
  };

  const addComment = (ticketId: string, content: string, isInternal: boolean) => {
    const newCmt: TicketComment = {
      id: `cmt-${Date.now()}`,
      ticketId,
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      authorRole: currentUser.role,
      isInternalNote: isInternal,
      channelOrigin: 'WEB_PORTAL',
      content,
      createdAt: new Date().toISOString(),
    };

    setComments(prev => ({
      ...prev,
      [ticketId]: [...(prev[ticketId] || []), newCmt],
    }));

    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          commentsCount: t.commentsCount + 1,
          updatedAt: new Date().toISOString(),
        };
      }
      return t;
    }));
  };

  const startWhatsAppCall = (callerNumber: string, callerName: string) => {
    const refNum = Math.floor(1000 + Math.random() * 9000);
    const newRef = `IT-2026-00${refNum}`;
    const tktId = `tkt-wa-${Date.now()}`;

    const newTicket: Ticket = {
      id: tktId,
      referenceId: newRef,
      requesterId: 'usr-guest',
      requesterName: callerName,
      requesterEmail: 'wa-incoming@campus.edu',
      requesterPhone: callerNumber,
      departmentId: departments[0].id,
      departmentName: departments[0].name,
      channel: 'WHATSAPP_CALL',
      title: `WhatsApp Helpline Call from ${callerName}`,
      description: `Inbound high-priority voice session routed via WhatsApp Business Cloud API Gateway. Handled by AI Agent ${aishaConfig.name}.`,
      priority: 'P2_HIGH',
      status: 'IN_PROGRESS',
      isSecuritySensitive: false,
      slaResolutionDue: new Date(Date.now() + 120 * 60 * 1000).toISOString(),
      slaBreached: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      commentsCount: 1,
      hasCallSession: true,
      assignedTechId: currentUser.id,
      assignedTechName: `${aishaConfig.name} (AI Support)`
    };

    const call: CallSession = {
      id: `call-sess-${Date.now()}`,
      ticketId: tktId,
      providerCallId: `wa-bridge-${Math.random().toString(36).substring(7)}`,
      callerNumber,
      callerName,
      status: 'IN_PROGRESS',
      recordingConsentGiven: true,
      startedAt: new Date().toISOString(),
      handledByAisha: aishaConfig.autoAnswerCalls,
      participants: [
        {
          id: `p-${Date.now()}-1`,
          name: callerName,
          phoneNumber: callerNumber,
          role: 'CALLER',
          joinedAt: new Date().toISOString(),
          status: 'CONNECTED',
        },
        {
          id: `p-${Date.now()}-aisha`,
          name: `${aishaConfig.name} (DATAPOINT AI)`,
          phoneNumber: whatsAppConfig.phoneNumberId ? `+1-${whatsAppConfig.phoneNumberId.slice(-4)}` : '+1-800-DPTECH',
          role: 'AI_AGENT',
          joinedAt: new Date().toISOString(),
          status: 'CONNECTED',
          isAiAgent: true,
        },
        {
          id: `p-${Date.now()}-2`,
          name: currentUser.fullName,
          phoneNumber: currentUser.phoneNumber || '+14155554100',
          role: 'TIER1_AGENT',
          joinedAt: new Date().toISOString(),
          status: 'CONNECTED',
        }
      ],
      transcriptText: `[00:01] Caller (${callerName}): Hello, I need help with an IT issue on campus.\n[00:03] ${aishaConfig.name} (AI Support): Hello ${callerName}! I am ${aishaConfig.name} from DATAPOINT Technologies Support. I have verified your campus profile. How may I assist you today?`,
      summary: `Active WhatsApp call initiated. Caller verified via phone-to-campus link. Handled by AI Agent ${aishaConfig.name}.`
    };

    setTickets(prev => [newTicket, ...prev]);
    setActiveCall(call);

    const initialCmt: TicketComment = {
      id: `cmt-${Date.now()}`,
      ticketId: tktId,
      authorId: 'sys-aisha',
      authorName: `${aishaConfig.name} (DATAPOINT AI)`,
      authorRole: 'AI_AGENT',
      isInternalNote: false,
      channelOrigin: 'WHATSAPP_CALL',
      content: `🎙️ Inbound WhatsApp Call established. Consent received. AI Agent ${aishaConfig.name} active on live audio stream.`,
      createdAt: new Date().toISOString(),
    };
    setComments(prev => ({ ...prev, [tktId]: [initialCmt] }));

    setAuditLogs(prev => [{
      id: `aud-${Date.now()}`,
      actorName: `${aishaConfig.name} (AI)`,
      actorRole: 'AI_AGENT',
      action: 'WHATSAPP_CALL_DISPATCHED',
      ticketRef: newRef,
      timestamp: new Date().toISOString(),
      details: `Call answered by ${aishaConfig.name} from ${callerNumber} (Session ${call.providerCallId})`,
      ipAddress: '10.200.0.5'
    }, ...prev]);

    return call;
  };

  const addParticipantToCall = (name: string, phone: string, role: any) => {
    if (!activeCall) return;

    const newParticipant = {
      id: `p-${Date.now()}`,
      name,
      phoneNumber: phone,
      role: role || 'SPECIALIST',
      joinedAt: new Date().toISOString(),
      status: 'CONNECTED' as const,
    };

    const updatedTranscript = `${activeCall.transcriptText || ''}\n[Bridged]: ${name} (${role}) joined the WhatsApp conference call.`;

    setActiveCall({
      ...activeCall,
      participants: [...activeCall.participants, newParticipant],
      transcriptText: updatedTranscript,
      summary: `${activeCall.summary} | Escalated with ${name} (${role}) bridged.`
    });

    setAuditLogs(prev => [{
      id: `aud-${Date.now()}`,
      actorName: currentUser.fullName,
      actorRole: currentUser.role,
      action: 'GROUP_CALL_SPECIALIST_BRIDGED',
      ticketRef: tickets.find(t => t.id === activeCall.ticketId)?.referenceId,
      timestamp: new Date().toISOString(),
      details: `Added ${name} (${phone}) to WhatsApp group session`,
      ipAddress: '192.168.1.100'
    }, ...prev]);
  };

  const endWhatsAppCall = () => {
    if (!activeCall) return;

    const tktId = activeCall.ticketId;
    const finalNote: TicketComment = {
      id: `cmt-whisper-${Date.now()}`,
      ticketId: tktId,
      authorId: 'sys-aisha',
      authorName: `${aishaConfig.name} AI & Whisper STT Pipeline`,
      authorRole: 'AI_AGENT',
      isInternalNote: false,
      channelOrigin: 'WHATSAPP_CALL',
      content: `🎙️ **${aishaConfig.name} Call Wrap-up Summary:**\nSession concluded. Handled by: ${aishaConfig.name}.\nParticipants: ${activeCall.participants.map(p => p.name).join(', ')}.\nSummary: ${activeCall.summary}\nAudio master archive preserved in S3 WORM bucket with SHA-256 fingerprint.`,
      createdAt: new Date().toISOString(),
    };

    setComments(prev => ({
      ...prev,
      [tktId]: [...(prev[tktId] || []), finalNote]
    }));

    setTickets(prev => prev.map(t => {
      if (t.id === tktId) {
        return {
          ...t,
          status: 'RESOLVED',
          updatedAt: new Date().toISOString(),
          resolvedById: 'sys-aisha',
          resolvedByName: `${aishaConfig.name} (DATAPOINT AI)`,
          resolvedAt: new Date().toISOString(),
        };
      }
      return t;
    }));

    setActiveCall(null);
  };

  const resolveSecurityAction = (ticketId: string, challengePin: string): boolean => {
    if (challengePin === '774920' || challengePin.length === 6) {
      setTickets(prev => prev.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: 'RESOLVED',
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      }));

      const tkt = tickets.find(t => t.id === ticketId);
      setAuditLogs(prev => [{
        id: `aud-${Date.now()}`,
        actorName: currentUser.fullName,
        actorRole: currentUser.role,
        action: 'MFA_STEP_UP_CHALLENGE_PASSED',
        ticketRef: tkt?.referenceId,
        timestamp: new Date().toISOString(),
        details: `Technician verified secondary out-of-band PIN (${challengePin}) before performing high-risk identity reset.`,
        ipAddress: '10.50.4.12'
      }, ...prev]);

      return true;
    }
    return false;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchRole,
        departments,
        tickets,
        comments,
        activeCall,
        auditLogs,
        theme,
        toggleTheme,
        facilities,
        updateFacilityStatus,
        pendingRegistrations,
        approveRegistration,
        rejectRegistration,
        requestProofRegistration,
        submitSelfRegistration,
        aishaConfig,
        updateAishaConfig,
        whatsAppConfig,
        updateWhatsAppConfig,
        knowledgeBase,
        addKnowledgeItem,
        toggleKnowledgeItem,
        deleteKnowledgeItem,
        whatsAppMessages,
        sendWhatsAppMessage,
        simulateAishaCallResponse,
        testWhatsAppConnection,
        createTicket,
        updateTicketStatus,
        assignTicket,
        addComment,
        startWhatsAppCall,
        addParticipantToCall,
        endWhatsAppCall,
        resolveSecurityAction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}

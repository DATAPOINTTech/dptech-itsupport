'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Ticket, TicketComment, CallSession, AuditLog, Department, UserRole, TicketPriority } from '@/types';
import { mockUsers, mockDepartments, initialTickets, initialComments, initialCallSession, initialAuditLogs } from '@/lib/mockData';

interface AppContextType {
  currentUser: User;
  switchRole: (roleKey: string) => void;
  departments: Department[];
  tickets: Ticket[];
  comments: Record<string, TicketComment[]>;
  activeCall: CallSession | null;
  auditLogs: AuditLog[];
  
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

  const switchRole = (roleKey: string) => {
    if (mockUsers[roleKey]) {
      setCurrentUser(mockUsers[roleKey]);
    }
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
      description: `Inbound high-priority voice session routed via WhatsApp Business Cloud API Gateway.`,
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
      assignedTechName: currentUser.fullName
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
          id: `p-${Date.now()}-2`,
          name: currentUser.fullName,
          phoneNumber: currentUser.phoneNumber || '+14155554100',
          role: 'TIER1_AGENT',
          joinedAt: new Date().toISOString(),
          status: 'CONNECTED',
        }
      ],
      transcriptText: `[00:01] Caller (${callerName}): Support, I need assistance with our lab connection.\n[00:08] Agent (${currentUser.fullName}): Hello! I am here, checking your campus identity and routing diagnostics.`,
      summary: `Active WhatsApp call initiated. Caller verified via phone-to-campus link.`
    };

    setTickets(prev => [newTicket, ...prev]);
    setActiveCall(call);

    const initialCmt: TicketComment = {
      id: `cmt-${Date.now()}`,
      ticketId: tktId,
      authorId: currentUser.id,
      authorName: 'WhatsApp Ingress Gateway',
      authorRole: 'TECHNICIAN_T1',
      isInternalNote: false,
      channelOrigin: 'WHATSAPP_CALL',
      content: `Inbound WhatsApp Call established. Consent received for FERPA/GDPR logging.`,
      createdAt: new Date().toISOString(),
    };
    setComments(prev => ({ ...prev, [tktId]: [initialCmt] }));

    setAuditLogs(prev => [{
      id: `aud-${Date.now()}`,
      actorName: 'WhatsApp Gateway',
      actorRole: 'SYSTEM',
      action: 'WHATSAPP_CALL_DISPATCHED',
      ticketRef: newRef,
      timestamp: new Date().toISOString(),
      details: `Bridge established to tech ${currentUser.fullName} from ${callerNumber}`,
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

    const completedCall: CallSession = {
      ...activeCall,
      status: 'COMPLETED',
      endedAt: new Date().toISOString(),
    };

    // Auto-generate post-call Whisper transcript note
    const tktId = activeCall.ticketId;
    const finalNote: TicketComment = {
      id: `cmt-whisper-${Date.now()}`,
      ticketId: tktId,
      authorId: 'sys-whisper',
      authorName: 'Whisper STT & LLM Pipeline',
      authorRole: 'TECHNICIAN_T1',
      isInternalNote: false,
      channelOrigin: 'WHATSAPP_CALL',
      content: `🎙️ **Whisper Call Summary:**\nSession concluded. Participants: ${activeCall.participants.map(p => p.name).join(', ')}.\nSummary: ${activeCall.summary}\nAudio master archive preserved in S3 WORM bucket.`,
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
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    }));

    setActiveCall(null);
  };

  const resolveSecurityAction = (ticketId: string, challengePin: string): boolean => {
    // Challenge PIN validation (mock 6-digit MFA challenge)
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

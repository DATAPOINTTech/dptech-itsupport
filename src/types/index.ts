export type UserRole = 
  | 'STUDENT'
  | 'FACULTY'
  | 'STAFF'
  | 'TECHNICIAN_T1'
  | 'TECHNICIAN_T2'
  | 'TECHNICIAN_T3'
  | 'ADMIN';

export type TicketChannel = 
  | 'WEB_PORTAL'
  | 'EMAIL'
  | 'WHATSAPP_CHAT'
  | 'WHATSAPP_CALL'
  | 'WALK_IN';

export type TicketPriority = 
  | 'P1_CRITICAL'
  | 'P2_HIGH'
  | 'P3_MEDIUM'
  | 'P4_LOW';

export type TicketStatus = 
  | 'NEW'
  | 'TRIAGED'
  | 'IN_PROGRESS'
  | 'WAITING_ON_USER'
  | 'PENDING_APPROVAL'
  | 'RESOLVED'
  | 'CLOSED';

export type DepartmentCode = 'NET_WIFI' | 'LAB_HW' | 'LMS' | 'SECURITY_MFA' | 'SOFTWARE_LIC';

export interface Department {
  id: string;
  code: DepartmentCode;
  name: string;
  escalationEmail: string;
  defaultSlaMinutes: number;
}

export interface User {
  id: string;
  campusId: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
  departmentId?: string;
  isPhoneVerified: boolean;
  avatarUrl?: string;
}

export interface TicketComment {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  isInternalNote: boolean;
  channelOrigin: TicketChannel;
  content: string;
  createdAt: string;
  attachmentUrls?: string[];
}

export interface CallParticipant {
  id: string;
  userId?: string;
  name: string;
  phoneNumber: string;
  role: 'CALLER' | 'TIER1_AGENT' | 'SPECIALIST' | 'VENDOR_ENGINEER' | 'LAB_MANAGER';
  joinedAt: string;
  status: 'CONNECTED' | 'MUTED' | 'DISCONNECTED';
}

export interface CallSession {
  id: string;
  ticketId: string;
  providerCallId: string;
  callerNumber: string;
  callerName: string;
  status: 'INITIATED' | 'RINGING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  recordingConsentGiven: boolean;
  startedAt: string;
  endedAt?: string;
  durationSeconds?: number;
  transcriptText?: string;
  summary?: string;
  participants: CallParticipant[];
}

export interface AuditLog {
  id: string;
  actorName: string;
  actorRole: string;
  action: string;
  ticketRef?: string;
  timestamp: string;
  details: string;
  ipAddress: string;
}

export interface Ticket {
  id: string;
  referenceId: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone?: string;
  assignedTechId?: string;
  assignedTechName?: string;
  departmentId: string;
  departmentName: string;
  channel: TicketChannel;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  isSecuritySensitive: boolean;
  slaResolutionDue: string;
  slaBreached: boolean;
  createdAt: string;
  updatedAt: string;
  commentsCount: number;
  hasCallSession?: boolean;
}

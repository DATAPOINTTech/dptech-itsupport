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

export type VerificationStatus = 
  | 'PENDING_VERIFICATION' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'NEEDS_PROOF';

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
  verificationStatus?: VerificationStatus;
  verificationNotes?: string;
}

export type FacilityType = 
  | 'COMPUTER_LAB' 
  | 'WIFI_ZONE' 
  | 'PRINT_KIOSK' 
  | 'AUDITORIUM_AV' 
  | 'SOFTWARE_REPO';

export type FacilityStatus = 
  | 'OPERATIONAL' 
  | 'DEGRADED' 
  | 'SCHEDULED_MAINTENANCE' 
  | 'OFFLINE';

export interface Facility {
  id: string;
  code: string;
  name: string;
  type: FacilityType;
  building: string;
  roomNumber: string;
  capacitySeats?: number;
  specs: {
    workstations?: string;
    gpus?: string;
    network?: string;
    os?: string;
    printerType?: string;
    features?: string[];
  };
  status: FacilityStatus;
  operatingHours: string;
  statusNote?: string;
}

export interface PendingRegistration {
  id: string;
  fullName: string;
  campusId: string;
  email: string;
  departmentName: string;
  role: 'STUDENT' | 'FACULTY' | 'STAFF';
  phoneNumber: string;
  status: VerificationStatus;
  submittedAt: string;
  proofDocumentUrl?: string;
  verificationNotes?: string;
}

export interface TicketComment {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole | 'AI_AGENT';
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
  role: 'CALLER' | 'TIER1_AGENT' | 'SPECIALIST' | 'VENDOR_ENGINEER' | 'LAB_MANAGER' | 'AI_AGENT';
  joinedAt: string;
  status: 'CONNECTED' | 'MUTED' | 'DISCONNECTED';
  isAiAgent?: boolean;
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
  handledByAisha?: boolean;
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
  resolvedById?: string;
  resolvedByName?: string;
  resolvedAt?: string;
  commentsCount: number;
  hasCallSession?: boolean;
}

// -------------------------------------------------------------
// Aisha AI & WhatsApp Setup Configuration Types
// -------------------------------------------------------------

export interface AishaAgentConfig {
  name: string;
  title: string;
  voice: 'en-US-Neural2-F' | 'ur-PK-Standard-A' | 'en-GB-Wavenet-A' | 'en-AU-Neural2-C';
  language: 'English' | 'Urdu' | 'Multilingual';
  tone: 'EMPATHETIC' | 'PROFESSIONAL' | 'TECHNICAL';
  model: 'gemini-1.5-pro' | 'gpt-4o' | 'dptech-fine-tuned-llama3' | 'claude-3-5-sonnet';
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  autoAnswerCalls: boolean;
  autoReplyMessages: boolean;
  autoCreateTickets: boolean;
  humanHandoffKeywords: string[];
  confidenceThreshold: number;
}

export interface WhatsAppConfig {
  phoneNumberId: string;
  wabaId: string;
  appId: string;
  bearerToken: string;
  verifyToken: string;
  webhookUrl: string;
  businessDisplayName: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'TESTING';
  lastPingAt?: string;
}

export interface KnowledgeBaseItem {
  id: string;
  topic: string;
  category: 'NETWORK' | 'ACCOUNT' | 'HARDWARE' | 'LMS';
  triggerKeywords: string[];
  resolutionSnippet: string;
  active: boolean;
}

export interface WhatsAppMessage {
  id: string;
  sender: 'USER' | 'AISHA' | 'TECH';
  senderName: string;
  senderPhone?: string;
  content: string;
  timestamp: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
  sentiment?: 'POSITIVE' | 'NEUTRAL' | 'FRUSTRATED';
  linkedTicketRef?: string;
  autoResolved?: boolean;
}

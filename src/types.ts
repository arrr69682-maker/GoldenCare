export type MatchStatus = 'IDLE' | 'REQUESTED' | 'CONNECTING' | 'CONNECTED' | 'COMPLETED';

export interface HelpRequest {
  id: string;
  elderlyName: string;
  elderlyAge: number;
  elderlyPhoto: string;
  symptom: string;
  category: 'health' | 'rights' | 'bedridden' | 'emergency';
  categoryLabel: string;
  time: string;
  recommendedAgency?: string;
  phone?: string;
  note?: string;
  status: 'PENDING' | 'ACCEPTED' | 'COMPLETED';
}

export interface ChatMessage {
  id: string;
  sender: 'elderly' | 'volunteer' | 'system';
  text: string;
  time: string;
}

export interface AppState {
  matchStatus: MatchStatus;
  currentRequest: HelpRequest | null;
  chatMessages: ChatMessage[];
  isVideoActive: boolean;
  activeTabElderly: string; // 'home' | 'history' | 'call' | 'notif' | 'settings'
  activeTabVolunteer: string; // 'home' | 'jobs' | 'notif' | 'profile'
  elderlyName: string;
  elderlyAge: number;
  elderlyPhoto: string;
  isVolunteerReady: boolean;
  historyRequests: HelpRequest[];
}

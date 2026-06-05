export type MoodTrend = 'stablizing' | 'improving' | 'declining' | 'critical' | 'calm';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  avatar: string;
  joinDate: string;
  moodTrend: MoodTrend;
  riskScore: number; // 0 to 100
  crisisStatus: 'normal' | 'watching' | 'escalated' | 'resolved';
  lastSeen: string;
  sessionCount: number;
  clinicalNotes: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'ai' | 'psychologist' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  isFlagged?: boolean;
}

export interface EscalatedChat {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar: string;
  riskLevel: 'high' | 'severe' | 'medium';
  escalatedAt: string;
  triggerPhrases: string[];
  aiSentimentSummary: string;
  currentStatus: 'pending' | 'active' | 'resolved';
  messages: Message[];
}

export interface AiSensitivitySettings {
  selfHarmThreshold: number; // 0-100
  anxietyThreshold: number; // 0-100
  depressionThreshold: number; // 0-100
  griefThreshold: number; // 0-100
  escalationTimeoutMinutes: number;
  fallbackPsychologistId: string;
  systemPromptPreset: string;
}

export interface AiPerformanceLog {
  id: string;
  timestamp: string;
  patientName: string;
  primaryTrigger: string;
  outcome: 'successful_intervention' | 'false_positive' | 'preventative_resolved';
  accuracyRating: 'accurate' | 'oversensitive' | 'undersensitive';
  notes: string;
}

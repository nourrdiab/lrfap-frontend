export interface ChatbotMessage {
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface ChatbotAskResponse {
  answer: string;
  sources?: Array<{ title: string; url?: string }>;
}

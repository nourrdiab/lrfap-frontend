import { apiPost } from './client';
import type { ChatbotAskResponse } from '../types';

export interface ChatbotAskPayload {
  message: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export const chatbotApi = {
  ask: (body: ChatbotAskPayload) => apiPost<ChatbotAskResponse>('/chatbot/ask', body),
};

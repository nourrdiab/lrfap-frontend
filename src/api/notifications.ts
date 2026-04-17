import { apiGet, apiPost } from './client';
import type { ID, Notification } from '../types';

export const notificationsApi = {
  list: () => apiGet<Notification[]>('/notifications'),
  markRead: (id: ID) => apiPost<Notification>(`/notifications/${id}/read`),
  markAllRead: () => apiPost<{ success: boolean }>('/notifications/read-all'),
};

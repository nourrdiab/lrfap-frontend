import type { ID, ISODateString } from './common';

export type NotificationType =
  | 'application_submitted'
  | 'application_reviewed'
  | 'document_status_changed'
  | 'cycle_status_changed'
  | 'match_published'
  | 'offer_received'
  | 'offer_expiring'
  | 'ranking_reminder'
  | 'generic';

export interface Notification {
  _id: ID;
  userId: ID;
  type: NotificationType;
  title: string;
  body?: string;
  link?: string;
  read: boolean;
  createdAt: ISODateString;
}

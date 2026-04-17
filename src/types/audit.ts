import type { ID, ISODateString } from './common';

export interface AuditLog {
  _id: ID;
  actorId?: ID;
  actorEmail?: string;
  actorRole?: 'applicant' | 'university' | 'lgc' | 'system';
  action: string;
  resourceType?: string;
  resourceId?: ID;
  metadata?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  createdAt: ISODateString;
}

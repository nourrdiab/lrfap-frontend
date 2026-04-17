import { apiGet } from './client';
import type { AuditLog, ID } from '../types';

export interface AuditFilters {
  actorId?: ID;
  resourceType?: string;
  resourceId?: ID;
  from?: string;
  to?: string;
  limit?: number;
  page?: number;
}

export const auditApi = {
  list: (filters?: AuditFilters) =>
    apiGet<AuditLog[]>('/audit', { params: filters }),
};

import { apiDelete, apiGet, apiPost, apiPut } from './client';
import type { ID, Program, Track } from '../types';

export interface ProgramListFilters {
  cycleId?: ID;
  universityId?: ID;
  specialtyId?: ID;
  track?: Track;
  q?: string;
}

export const programsApi = {
  list: (filters?: ProgramListFilters) =>
    apiGet<Program[]>('/programs', { params: filters }),
  get: (id: ID) => apiGet<Program>(`/programs/${id}`),
  create: (body: Omit<Program, '_id'>) => apiPost<Program>('/programs', body),
  update: (id: ID, body: Partial<Program>) =>
    apiPut<Program>(`/programs/${id}`, body),
  remove: (id: ID) => apiDelete<{ success: boolean }>(`/programs/${id}`),
};

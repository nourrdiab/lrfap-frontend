import { apiDelete, apiGet, apiPost, apiPut } from './client';
import type { Application, ID, ProgramSelection } from '../types';

export interface CreateApplicationPayload {
  cycleId: ID;
  track: 'residency' | 'fellowship';
}

export interface UpdateSelectionsPayload {
  selections: Array<Pick<ProgramSelection, 'programId' | 'rank'>>;
}

export const applicationsApi = {
  list: () => apiGet<Application[]>('/applications'),
  get: (id: ID) => apiGet<Application>(`/applications/${id}`),
  create: (body: CreateApplicationPayload) =>
    apiPost<Application>('/applications', body),
  update: (id: ID, body: Partial<Application>) =>
    apiPut<Application>(`/applications/${id}`, body),
  remove: (id: ID) => apiDelete<{ success: boolean }>(`/applications/${id}`),

  updateSelections: (id: ID, body: UpdateSelectionsPayload) =>
    apiPut<Application>(`/applications/${id}/selections`, body),

  submit: (id: ID) => apiPost<Application>(`/applications/${id}/submit`),
  withdraw: (id: ID) => apiPost<Application>(`/applications/${id}/withdraw`),

  acceptOffer: (id: ID) => apiPost<Application>(`/applications/${id}/offer/accept`),
  declineOffer: (id: ID) => apiPost<Application>(`/applications/${id}/offer/decline`),
};

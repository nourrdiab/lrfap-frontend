import { apiDelete, apiGet, apiPost, apiPut } from './client';
import type { Application, ID } from '../types';

export interface CreateApplicationPayload {
  cycleId: ID;
  track: 'residency' | 'fellowship';
}

export interface SelectionPayload {
  program: ID;
  rank: number;
  institutionSpecificFields?: Record<string, string>;
}

export interface UpdateSelectionsPayload {
  selections: SelectionPayload[];
}

export interface SubmitApplicationPayload {
  declarationAccepted: true;
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

  submit: (id: ID, body: SubmitApplicationPayload) =>
    apiPost<Application>(`/applications/${id}/submit`, body),
  withdraw: (id: ID) => apiPost<Application>(`/applications/${id}/withdraw`),

  acceptOffer: (id: ID) => apiPost<Application>(`/applications/${id}/offer/accept`),
  declineOffer: (id: ID) => apiPost<Application>(`/applications/${id}/offer/decline`),
};

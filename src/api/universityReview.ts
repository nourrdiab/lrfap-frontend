import { apiGet, apiPost, apiPut } from './client';
import type {
  Application,
  ID,
  Program,
  ProgramRanking,
  RankingEntry,
} from '../types';

export interface SaveRankingPayload {
  entries: RankingEntry[];
}

// Backend's GET /university-review/programs/:id/applications returns
// populated Application documents (applicant, cycle, selections.program
// all populated), NOT the thin ProgramApplicationSummary shape from the
// original scaffold. Type the response accordingly.
export const universityReviewApi = {
  // Programs owned by the authenticated university. Backend scopes this
  // by req.user.university, so no query params are needed. Response has
  // specialty and cycle populated; university is NOT populated (backend
  // gap) — display code must not rely on programs[i].university.name.
  listMyPrograms: () => apiGet<Program[]>('/university-review/programs'),

  listProgramApplications: (programId: ID) =>
    apiGet<Application[]>(`/university-review/programs/${programId}/applications`),

  getApplication: (applicationId: ID) =>
    apiGet<Application>(`/university-review/applications/${applicationId}`),

  getRanking: (programId: ID) =>
    apiGet<ProgramRanking>(`/university-review/programs/${programId}/ranking`),

  saveRanking: (programId: ID, body: SaveRankingPayload) =>
    apiPut<ProgramRanking>(`/university-review/programs/${programId}/ranking`, body),

  submitRanking: (programId: ID) =>
    apiPost<ProgramRanking>(`/university-review/programs/${programId}/ranking/submit`),
};

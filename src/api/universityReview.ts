import { apiGet, apiPost, apiPut } from './client';
import type {
  Application,
  ID,
  ProgramApplicationSummary,
  ProgramRanking,
  RankingEntry,
} from '../types';

export interface SaveRankingPayload {
  entries: RankingEntry[];
}

export const universityReviewApi = {
  listProgramApplications: (programId: ID) =>
    apiGet<ProgramApplicationSummary[]>(`/university-review/programs/${programId}/applications`),

  getApplication: (applicationId: ID) =>
    apiGet<Application>(`/university-review/applications/${applicationId}`),

  getRanking: (programId: ID) =>
    apiGet<ProgramRanking>(`/university-review/programs/${programId}/ranking`),

  saveRanking: (programId: ID, body: SaveRankingPayload) =>
    apiPut<ProgramRanking>(`/university-review/programs/${programId}/ranking`, body),

  submitRanking: (programId: ID) =>
    apiPost<ProgramRanking>(`/university-review/programs/${programId}/ranking/submit`),
};

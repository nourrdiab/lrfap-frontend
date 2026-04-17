import { apiGet, apiPost } from './client';
import type { ID, MatchRun } from '../types';

export const matchApi = {
  dryRun: (cycleId: ID) => apiPost<MatchRun>(`/match/dry-run`, { cycleId }),
  execute: (cycleId: ID) => apiPost<MatchRun>(`/match/execute`, { cycleId }),
  publish: (runId: ID) => apiPost<MatchRun>(`/match/${runId}/publish`),
  listRuns: (cycleId?: ID) =>
    apiGet<MatchRun[]>(`/match/runs`, { params: cycleId ? { cycleId } : undefined }),
  getRun: (runId: ID) => apiGet<MatchRun>(`/match/runs/${runId}`),
};

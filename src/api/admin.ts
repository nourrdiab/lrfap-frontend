import { apiPost } from './client';
import type { ID } from '../types';

/**
 * TODO: Remove this module before production deployment.
 * Dev/demo reset utility only.
 */

export interface ResetCycleResponse {
  applicationsReset: number;
  matchRunsDeleted: number;
  programsReset: number;
  cycleStatusReset: boolean;
  message: string;
}

export const adminApi = {
  resetCycle: (cycleId: ID) =>
    apiPost<ResetCycleResponse>(`/admin/reset-cycle/${cycleId}`),
};

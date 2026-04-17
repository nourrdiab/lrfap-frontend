import { apiGet } from './client';
import type { ApplicantDashboard, LGCDashboard } from '../types';

export const dashboardApi = {
  applicant: () => apiGet<ApplicantDashboard>('/dashboard/applicant'),
  lgc: () => apiGet<LGCDashboard>('/dashboard/lgc'),
};

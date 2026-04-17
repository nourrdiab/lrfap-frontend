import type { ID, ISODateString } from './common';

export type MatchRunType = 'dry_run' | 'official';
export type MatchRunStatus = 'pending' | 'running' | 'complete' | 'failed' | 'published';

export interface MatchRunResultEntry {
  applicationId: ID;
  applicantName?: string;
  matchedProgramId?: ID;
  matchedProgramName?: string;
  status: 'matched' | 'unmatched';
}

export interface MatchRun {
  _id: ID;
  cycleId: ID;
  type: MatchRunType;
  status: MatchRunStatus;
  totalApplicants: number;
  matchedCount: number;
  unmatchedCount: number;
  fillRate?: number;
  results?: MatchRunResultEntry[];
  executedBy?: ID;
  executedAt?: ISODateString;
  publishedAt?: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

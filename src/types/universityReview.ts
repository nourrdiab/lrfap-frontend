import type { ID, ISODateString } from './common';

export interface ProgramApplicationSummary {
  applicationId: ID;
  applicantId: ID;
  applicantName: string;
  applicantRank?: number;
  gpa?: number;
  usmleStep1?: number;
  usmleStep2?: number;
  documentsComplete?: boolean;
  reviewStatus?: 'unreviewed' | 'in_progress' | 'complete';
}

export interface RankingEntry {
  applicationId: ID;
  rank: number;
  score?: number;
  notes?: string;
}

export interface ProgramRanking {
  _id: ID;
  programId: ID;
  cycleId: ID;
  entries: RankingEntry[];
  submittedAt?: ISODateString;
  createdAt?: ISODateString;
  updatedAt?: ISODateString;
}

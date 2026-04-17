import type { ID, ISODateString } from './common';
import type { Program } from './catalog';

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'matched'
  | 'unmatched'
  | 'withdrawn';

export type OfferStatus = 'none' | 'pending' | 'accepted' | 'declined' | 'expired';

export interface ProgramSelection {
  programId: ID | Program;
  rank: number;
}

export interface Application {
  _id: ID;
  applicantId: ID;
  cycleId: ID;
  track: 'residency' | 'fellowship';
  status: ApplicationStatus;
  selections: ProgramSelection[];
  submittedAt?: ISODateString;
  withdrawnAt?: ISODateString;
  matchedProgramId?: ID | Program;
  offerStatus: OfferStatus;
  offerExpiresAt?: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

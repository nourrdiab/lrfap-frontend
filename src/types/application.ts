import type { ID, ISODateString } from './common';
import type { Cycle, Program, Track } from './catalog';

/**
 * Mirrors backend `models/Application.js`. Field names are the Mongoose
 * refs (`applicant`, `cycle`, `matchedProgram`), not the legacy scaffold
 * names (`applicantId`, `cycleId`, etc.). Populated paths on read use
 * `ID | Populated`.
 */

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'matched'
  | 'unmatched'
  | 'withdrawn';

export type OfferStatus = 'none' | 'pending' | 'accepted' | 'declined' | 'expired';

export interface ProgramSelection {
  program: ID | Program;
  rank: number;
  institutionSpecificFields?: Record<string, string>;
}

export interface Application {
  _id: ID;
  applicant: ID;
  cycle: ID | Cycle;
  track: Track;
  status: ApplicationStatus;
  selections: ProgramSelection[];
  declarationAccepted?: boolean;
  submittedAt?: ISODateString;
  submissionReference?: string;
  lockedAt?: ISODateString;
  matchedProgram?: ID | Program | null;
  offerStatus: OfferStatus;
  offerExpiresAt?: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

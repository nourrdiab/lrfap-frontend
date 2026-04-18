import type { ID, ISODateString } from './common';
import type { Cycle, Program, Track } from './catalog';
import type { ApplicationStatus, OfferStatus } from './application';

/**
 * Mirrors the actual `GET /api/dashboard/applicant` response
 * (controllers/dashboardController.js → getApplicantDashboard). The
 * outer shape hand-constructs objects with `id` fields, but populated
 * subdocuments (cycle, matchedProgram) serialize with Mongoose's
 * default `_id`.
 */

export interface DashboardUser {
  id: ID;
  firstName?: string;
  lastName?: string;
  email: string;
}

export interface DashboardActiveCycle {
  id: ID;
  name: string;
  year: number;
  status: string;
  submissionDeadline?: ISODateString;
  rankingDeadline?: ISODateString;
  resultPublicationDate?: ISODateString;
}

export interface DashboardChecklist {
  profileCompleted: boolean;
  hasDraft: boolean;
  hasSubmitted: boolean;
  hasMatch: boolean;
  hasPendingOffer: boolean;
}

export interface DashboardApplication {
  id: ID;
  cycle: ID | Cycle;
  track: Track;
  status: ApplicationStatus;
  submissionReference?: string;
  submittedAt?: ISODateString;
  matchedProgram?: ID | Program | null;
  offerStatus: OfferStatus;
  offerExpiresAt?: ISODateString;
}

export interface ApplicantDashboard {
  user: DashboardUser;
  profileCompletion: number;
  checklist: DashboardChecklist;
  applications: DashboardApplication[];
  activeCycle: DashboardActiveCycle | null;
}

export interface LGCDashboard {
  totalApplicants: number;
  totalPrograms: number;
  totalUniversities: number;
  activeCycles: number;
  applicationsBySpecialty: Array<{ specialty: string; count: number }>;
  applicationsByStatus: Array<{ status: ApplicationStatus; count: number }>;
  fillRate?: number;
  recentActivity: Array<{
    _id: ID;
    title: string;
    description?: string;
    createdAt: ISODateString;
  }>;
}

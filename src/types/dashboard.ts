import type { ID, ISODateString } from './common';
import type { Cycle, CycleStatus, Program, Track } from './catalog';
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

/**
 * Mirrors `GET /api/dashboard/lgc` (controllers/dashboardController.js →
 * getLGCDashboard). Counts are nested; activeCycle is singular; capacity
 * is flat; applicationsBySpecialty is a pre-aggregated array; and
 * recentActivity comes from the AuditLog stream (last 10) with the
 * actor already flattened to a name string.
 *
 * The scaffold shape that existed before this rewrite
 * (`{totalApplicants, totalPrograms, activeCycles, applicationsByStatus, fillRate, …}`)
 * did NOT match reality. This is the real one.
 */

export interface LGCApplicationCounts {
  total: number;
  submitted: number;
  matched: number;
  unmatched: number;
}

export interface LGCCounts {
  applicants: number;
  universities: number;
  specialties: number;
  programs: number;
  applications: LGCApplicationCounts;
  rankingsSubmitted: number;
}

export interface LGCCapacity {
  totalCapacity: number;
  filledSeats: number;
  availableSeats: number;
  /** Percent 0–100, pre-computed by backend. */
  fillRate: number;
}

export interface LGCActiveCycle {
  id: ID;
  name: string;
  year: number;
  status: CycleStatus;
  submissionDeadline: ISODateString;
  rankingDeadline: ISODateString;
  resultPublicationDate: ISODateString;
}

export interface LGCApplicationsBySpecialty {
  specialty: string;
  code: string;
  count: number;
}

export interface LGCActivityEntry {
  id: ID;
  action: string;
  /** Pre-flattened "FirstName LastName" string (or "Unknown"). */
  actor: string;
  actorRole: string;
  targetType?: string;
  outcome?: 'success' | 'failure';
  createdAt: ISODateString;
}

export interface LGCDashboard {
  counts: LGCCounts;
  capacity: LGCCapacity;
  activeCycle: LGCActiveCycle | null;
  applicationsBySpecialty: LGCApplicationsBySpecialty[];
  recentActivity: LGCActivityEntry[];
}

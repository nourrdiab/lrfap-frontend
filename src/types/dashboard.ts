import type { ID, ISODateString } from './common';
import type { ApplicationStatus, OfferStatus } from './application';

export interface ApplicantDashboard {
  profileCompletion: number;
  documentsUploaded: number;
  documentsTotal: number;
  activeCycle?: {
    _id: ID;
    name: string;
    status: string;
    applicationCloseDate?: ISODateString;
  } | null;
  application?: {
    _id: ID;
    status: ApplicationStatus;
    offerStatus: OfferStatus;
    offerExpiresAt?: ISODateString;
    matchedProgramName?: string;
  } | null;
  unreadNotifications: number;
  checklist?: Array<{ key: string; label: string; done: boolean }>;
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

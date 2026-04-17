import type { ID, ISODateString } from './common';

export type Track = 'residency' | 'fellowship';

export type CycleStatus =
  | 'draft'
  | 'open'
  | 'review'
  | 'ranking'
  | 'matching'
  | 'published'
  | 'closed';

export interface University {
  _id: ID;
  name: string;
  shortName?: string;
  country?: string;
  city?: string;
  website?: string;
  logoUrl?: string;
  createdAt?: ISODateString;
  updatedAt?: ISODateString;
}

export interface Specialty {
  _id: ID;
  code: string;
  name: string;
  track: Track;
  description?: string;
  createdAt?: ISODateString;
  updatedAt?: ISODateString;
}

export interface Program {
  _id: ID;
  universityId: ID | University;
  specialtyId: ID | Specialty;
  track: Track;
  durationYears?: number;
  numberOfSlots: number;
  description?: string;
  requirements?: string;
  createdAt?: ISODateString;
  updatedAt?: ISODateString;
}

export interface Cycle {
  _id: ID;
  name: string;
  academicYear: string;
  track: Track;
  status: CycleStatus;
  applicationOpenDate?: ISODateString;
  applicationCloseDate?: ISODateString;
  reviewDeadline?: ISODateString;
  rankingDeadline?: ISODateString;
  matchDate?: ISODateString;
  publishDate?: ISODateString;
  createdAt?: ISODateString;
  updatedAt?: ISODateString;
}

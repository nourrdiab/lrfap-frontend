import type { ID, ISODateString } from './common';

export type DocumentType =
  | 'transcript'
  | 'cv'
  | 'recommendation_letter'
  | 'id_document'
  | 'medical_license'
  | 'usmle_score'
  | 'other';

export type DocumentStatus = 'pending' | 'verified' | 'rejected' | 'replacement_required';

export interface ApplicationDocument {
  _id: ID;
  userId: ID;
  type: DocumentType;
  fileName: string;
  fileSize?: number;
  mimeType?: string;
  status: DocumentStatus;
  reviewNotes?: string;
  reviewedBy?: ID;
  reviewedAt?: ISODateString;
  uploadedAt: ISODateString;
  storageKey?: string;
}

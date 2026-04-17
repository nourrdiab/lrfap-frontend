import type { ID, ISODateString } from './common';

export type LanguageCode = 'english' | 'french' | 'arabic';
export type LanguageLevel = 'none' | 'basic' | 'intermediate' | 'fluent' | 'native';

export interface LanguageProficiency {
  language: LanguageCode;
  level: LanguageLevel;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface ResearchExperience {
  title: string;
  description?: string;
  year?: number;
}

export interface ApplicantProfile {
  _id: ID;
  userId: ID;
  firstName: string;
  lastName: string;
  dateOfBirth?: ISODateString;
  nationality?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  phone?: string;
  address?: string;
  medicalSchool?: string;
  gpa?: number; // 0-4
  graduationYear?: number;
  usmleStep1?: number; // 0-300
  usmleStep2?: number; // 0-300
  languages?: LanguageProficiency[];
  researchExperience?: ResearchExperience[];
  emergencyContact?: EmergencyContact;
  profileCompletion?: number; // 0-100
  createdAt?: ISODateString;
  updatedAt?: ISODateString;
}

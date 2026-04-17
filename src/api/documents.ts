import { apiClient, apiDelete, apiGet, apiPatch } from './client';
import type {
  ApplicationDocument,
  DocumentStatus,
  DocumentType,
  ID,
} from '../types';

export interface UploadDocumentPayload {
  file: File;
  type: DocumentType;
  onUploadProgress?: (percent: number) => void;
}

export interface ReviewDocumentPayload {
  status: DocumentStatus;
  reviewNotes?: string;
}

export const documentsApi = {
  list: () => apiGet<ApplicationDocument[]>('/documents'),

  upload: async ({ file, type, onUploadProgress }: UploadDocumentPayload) => {
    const form = new FormData();
    form.append('file', file);
    form.append('type', type);
    const res = await apiClient.post<ApplicationDocument>('/documents/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (evt) => {
        if (onUploadProgress && evt.total) {
          onUploadProgress(Math.round((evt.loaded / evt.total) * 100));
        }
      },
    });
    return res.data;
  },

  getDownloadUrl: (id: ID) =>
    apiGet<{ url: string; expiresAt?: string }>(`/documents/${id}/download`),

  remove: (id: ID) => apiDelete<{ success: boolean }>(`/documents/${id}`),

  review: (id: ID, body: ReviewDocumentPayload) =>
    apiPatch<ApplicationDocument>(`/documents/${id}/review`, body),
};

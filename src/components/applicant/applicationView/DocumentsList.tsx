import { FileText } from 'lucide-react';
import type {
  ApplicationDocument,
  DocumentStatus,
  DocumentType,
} from '../../../types';
import { DOCUMENT_TYPES } from '../wizard/steps/documentsSchema';

/**
 * Read-only list of the 9 required document slots with status pills.
 * Consumed by the Application Detail page and by the wizard's Review &
 * Submit step. The wizard's Documents step itself has a heavier upload /
 * replace / delete UI — that stays in place until there's a reason to
 * consolidate; a `readOnly` prop is accepted to leave the door open.
 */

interface DocumentsListProps {
  documents: ApplicationDocument[];
  readOnly?: boolean;
}

function docPill(
  hasDocument: boolean,
  status: DocumentStatus | undefined,
): { cls: string; label: string } {
  if (!hasDocument) {
    return { cls: 'bg-red-50 text-red-700 border-red-200', label: 'Pending' };
  }
  switch (status) {
    case 'verified':
      return { cls: 'bg-sky-50 text-sky-700 border-sky-200', label: 'Verified' };
    case 'replacement_required':
      return {
        cls: 'bg-orange-50 text-orange-700 border-orange-200',
        label: 'Replacement Required',
      };
    case 'rejected':
      return { cls: 'bg-red-100 text-red-800 border-red-300', label: 'Rejected' };
    case 'pending':
    default:
      return { cls: 'bg-green-50 text-green-700 border-green-200', label: 'Uploaded' };
  }
}

export function DocumentsList({ documents }: DocumentsListProps) {
  // Collapse to one doc per type, preferring the most recently created.
  const byType: Partial<Record<DocumentType, ApplicationDocument>> = {};
  for (const doc of documents) {
    const existing = byType[doc.type];
    if (
      !existing ||
      new Date(doc.createdAt).getTime() > new Date(existing.createdAt).getTime()
    ) {
      byType[doc.type] = doc;
    }
  }

  return (
    <ul role="list" className="flex flex-col gap-[12px]">
      {DOCUMENT_TYPES.map((def) => {
        const doc = byType[def.type] ?? null;
        const pill = docPill(!!doc, doc?.status);
        return (
          <li
            key={def.type}
            className="flex items-center gap-[14px] border-[0.91px] border-lrfap-ghost bg-white p-[16px] shadow-[0_4px_24px_-12px_rgba(38,43,102,0.08)]"
          >
            <span
              aria-hidden="true"
              className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-lrfap-ghost text-lrfap-navy"
            >
              <FileText className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-sans text-[13px] font-semibold uppercase tracking-wide text-lrfap-navy">
                {def.label}
              </p>
              {doc ? (
                <p className="truncate font-sans text-[12px] text-slate-500">
                  {doc.originalName}
                </p>
              ) : null}
            </div>
            <span
              className={`shrink-0 border px-[10px] py-[2px] font-sans text-[11px] font-medium uppercase tracking-wide ${pill.cls}`}
            >
              {pill.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Mail,
  User as UserIcon,
} from 'lucide-react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { universityReviewApi } from '../../api/universityReview';
import { documentsApi } from '../../api/documents';
import { SelectedProgramsList } from '../../components/applicant/applicationView/SelectedProgramsList';
import { DocumentsList } from '../../components/applicant/applicationView/DocumentsList';
import type {
  Application,
  ApplicationDocument,
  ApplicationStatus,
  Cycle,
  ID,
  Program,
  Specialty,
  University,
  User,
} from '../../types';

/**
 * University-side read-only view of a submitted application. Reachable
 * from the per-program applicants table via
 *   /university/applications/:applicationId?program=:programId
 *
 * The `program` query param anchors the reviewer: the matching row in
 * the Selected Programs list gets a sky-blue left border + "Your program"
 * pill, and the Back link returns to the source program. Without the
 * query param the page still works — no highlight, and Back falls back
 * to the Dashboard.
 *
 * Auth: universityReviewApi.getApplication is gated server-side to
 * universities whose program appears in this application's selections.
 * 403 / 404 redirect to the Dashboard (best fallback — we can't always
 * know which program they came from if the URL was hand-typed).
 *
 * Reuses SelectedProgramsList and DocumentsList from the applicant
 * applicationView bundle — both are already role-agnostic read-only
 * components.
 */

type FetchStatus = 'idle' | 'loading' | 'loaded' | 'error' | 'not-found';

function isValidObjectId(id: string | undefined): id is string {
  return !!id && /^[0-9a-fA-F]{24}$/.test(id);
}

function populated<T extends { _id: ID }>(
  ref: ID | T | null | undefined,
): T | null {
  if (!ref || typeof ref === 'string') return null;
  return ref;
}

function formatSubmittedAt(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface StatusPresentation {
  label: string;
  badgeCls: string;
}
function presentStatus(status: ApplicationStatus): StatusPresentation {
  switch (status) {
    case 'submitted':
      return { label: 'Submitted', badgeCls: 'bg-sky-50 text-sky-700 border-sky-200' };
    case 'under_review':
      return {
        label: 'Under Review',
        badgeCls: 'bg-amber-50 text-amber-800 border-amber-200',
      };
    case 'matched':
      return {
        label: 'Matched',
        badgeCls: 'bg-green-50 text-green-700 border-green-200',
      };
    case 'unmatched':
      return {
        label: 'Unmatched',
        badgeCls: 'bg-slate-50 text-slate-700 border-slate-200',
      };
    case 'withdrawn':
      return {
        label: 'Withdrawn',
        badgeCls: 'bg-slate-50 text-slate-500 border-slate-200',
      };
    case 'draft':
    default:
      return { label: status, badgeCls: 'bg-slate-50 text-slate-700 border-slate-200' };
  }
}

function applicantName(applicant: ID | User): string {
  if (typeof applicant === 'string') return 'Applicant';
  const parts = [applicant.firstName, applicant.lastName].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : (applicant.email ?? 'Applicant');
}

function applicantEmail(applicant: ID | User): string | null {
  if (typeof applicant === 'string') return null;
  return applicant.email ?? null;
}

export default function UniversityApplicationDetailPage() {
  useDocumentTitle('Applicant review');
  const { applicationId } = useParams<{ applicationId: string }>();
  const [searchParams] = useSearchParams();
  const sourceProgramId = searchParams.get('program');

  const [application, setApplication] = useState<Application | null>(null);
  const [appStatus, setAppStatus] = useState<FetchStatus>('idle');
  const [documents, setDocuments] = useState<ApplicationDocument[]>([]);
  const [docsStatus, setDocsStatus] = useState<FetchStatus>('idle');

  const validId = isValidObjectId(applicationId);

  useEffect(() => {
    if (!validId || !applicationId) return;
    let cancelled = false;
    setAppStatus('loading');
    universityReviewApi
      .getApplication(applicationId)
      .then((res) => {
        if (cancelled) return;
        setApplication(res);
        setAppStatus('loaded');
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 404 || status === 403) {
          setAppStatus('not-found');
          return;
        }
        setAppStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [applicationId, validId]);

  useEffect(() => {
    if (!validId || !applicationId) return;
    let cancelled = false;
    setDocsStatus('loading');
    documentsApi
      .listForApplication(applicationId)
      .then((res) => {
        if (cancelled) return;
        setDocuments(res);
        setDocsStatus('loaded');
      })
      .catch(() => {
        if (!cancelled) setDocsStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [applicationId, validId]);

  // Find the source program's display name for the Back link. Populated
  // on getApplication via selections.program; we filter to the selection
  // that matches ?program= so we can render its specialty name.
  const sourceProgram = useMemo<Program | null>(() => {
    if (!sourceProgramId || !application) return null;
    for (const s of application.selections) {
      const prog = populated<Program>(s.program);
      if (prog && prog._id === sourceProgramId) return prog;
    }
    return null;
  }, [application, sourceProgramId]);

  const statusPresentation = useMemo(
    () => (application ? presentStatus(application.status) : null),
    [application],
  );

  const matchedProgram = populated<Program>(application?.matchedProgram ?? null);
  const matchedUni = matchedProgram ? populated<University>(matchedProgram.university) : null;
  const matchedSpec = matchedProgram ? populated<Specialty>(matchedProgram.specialty) : null;
  const cycle = application ? populated<Cycle>(application.cycle) : null;

  if (!validId) {
    return <Navigate to="/university" replace />;
  }

  if (appStatus === 'not-found') {
    return <Navigate to="/university" replace />;
  }

  if (appStatus === 'loading' || appStatus === 'idle') {
    return (
      <PageShell>
        <div className="h-[24px] w-[180px] animate-pulse bg-slate-100" />
        <div className="h-[80px] animate-pulse border-[0.91px] border-lrfap-ghost bg-slate-50" />
        <div className="h-[200px] animate-pulse border-[0.91px] border-lrfap-ghost bg-slate-50" />
        <div className="h-[420px] animate-pulse border-[0.91px] border-lrfap-ghost bg-slate-50" />
      </PageShell>
    );
  }

  if (appStatus === 'error' || !application || !statusPresentation) {
    return (
      <PageShell>
        <BackLink sourceProgramId={sourceProgramId} sourceProgram={sourceProgram} />
        <div
          role="alert"
          className="flex items-start gap-[10px] border-[0.91px] border-red-200 bg-red-50 px-[16px] py-[12px] font-sans text-[13px] text-red-800"
        >
          <AlertCircle aria-hidden="true" className="mt-[2px] h-4 w-4 shrink-0" />
          <span>
            Couldn&apos;t load this application. Refresh the page to try again.
          </span>
        </div>
      </PageShell>
    );
  }

  const name = applicantName(application.applicant);
  const email = applicantEmail(application.applicant);

  return (
    <PageShell>
      <BackLink sourceProgramId={sourceProgramId} sourceProgram={sourceProgram} />

      <header className="flex flex-col gap-[10px] md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-[14px]">
          <span
            aria-hidden="true"
            className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-lrfap-ghost text-lrfap-navy"
          >
            <UserIcon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h1 className="font-display text-[28px] font-extrabold leading-[1.1] text-lrfap-navy md:text-[32px]">
              {name}
            </h1>
            {email ? (
              <p className="mt-[2px] flex items-center gap-[6px] font-sans text-[13px] text-slate-500">
                <Mail aria-hidden="true" className="h-3.5 w-3.5" />
                {email}
              </p>
            ) : null}
          </div>
        </div>
        <span
          role="status"
          aria-label={`Status: ${statusPresentation.label}`}
          className={`inline-flex shrink-0 items-center border px-[12px] py-[4px] font-sans text-[11px] font-medium uppercase tracking-wide ${statusPresentation.badgeCls}`}
        >
          {statusPresentation.label}
        </span>
      </header>

      {/* Reference + submitted-at summary */}
      <section
        aria-labelledby="applicant-reference-heading"
        className="flex flex-col gap-[12px] border-[0.91px] border-lrfap-ghost bg-white p-[24px] shadow-[0_4px_24px_-12px_rgba(38,43,102,0.1)]"
      >
        <p
          id="applicant-reference-heading"
          className="font-sans text-[12px] font-medium uppercase tracking-wide text-slate-500"
        >
          Application Reference
        </p>
        <code className="font-mono text-[22px] font-semibold text-lrfap-navy">
          {application.submissionReference ?? '—'}
        </code>
        <p className="font-sans text-[13px] text-slate-500">
          Submitted on{' '}
          <span className="text-slate-700">
            {formatSubmittedAt(application.submittedAt)}
          </span>
          {cycle ? (
            <>
              {' · '}
              <span className="text-slate-700">
                {cycle.name} {cycle.year}
              </span>
            </>
          ) : null}
        </p>
      </section>

      {/* Match result summary — read-only mini card, no accept/decline
          (those belong to the applicant). */}
      {application.status === 'matched' && matchedProgram ? (
        <section
          aria-labelledby="match-result-heading"
          className="border-[0.91px] border-emerald-200 bg-emerald-50/50 p-[24px] shadow-[0_4px_24px_-12px_rgba(38,43,102,0.1)]"
        >
          <div className="flex items-start gap-[12px]">
            <CheckCircle
              aria-hidden="true"
              className="mt-[2px] h-5 w-5 shrink-0 text-emerald-600"
            />
            <div className="min-w-0 flex-1">
              <h2
                id="match-result-heading"
                className="font-display text-[14px] font-bold uppercase tracking-wide text-emerald-900"
              >
                Matched
              </h2>
              <p className="mt-[4px] font-sans text-[13px] text-emerald-900">
                {matchedSpec?.name ?? 'Program'}
                {matchedUni?.name ? ` · ${matchedUni.name}` : null}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {/* Two-column grid: documents + selections with highlight */}
      <div className="grid grid-cols-1 gap-[24px] lg:grid-cols-[1fr_1fr]">
        <section aria-labelledby="detail-documents-heading" className="flex flex-col gap-[12px]">
          <h2
            id="detail-documents-heading"
            className="font-display text-[16px] font-bold uppercase tracking-wide text-lrfap-navy"
          >
            Documents
          </h2>
          {docsStatus === 'loading' ? (
            <div className="h-[320px] animate-pulse border-[0.91px] border-lrfap-ghost bg-slate-50" />
          ) : docsStatus === 'error' ? (
            <div
              role="alert"
              className="flex items-start gap-[10px] border-[0.91px] border-red-200 bg-red-50 px-[16px] py-[12px] font-sans text-[13px] text-red-800"
            >
              <AlertCircle aria-hidden="true" className="mt-[2px] h-4 w-4 shrink-0" />
              <span>Couldn&apos;t load documents. Refresh to try again.</span>
            </div>
          ) : (
            <DocumentsList documents={documents} readOnly />
          )}
        </section>

        <section
          aria-labelledby="detail-ranked-heading"
          className="flex flex-col gap-[12px]"
        >
          <h2
            id="detail-ranked-heading"
            className="font-display text-[16px] font-bold uppercase tracking-wide text-lrfap-navy"
          >
            Selected Programs &amp; Rankings
          </h2>
          <SelectedProgramsList
            selections={application.selections}
            readOnly
            highlightProgramId={sourceProgramId ?? undefined}
            emptyMessage="No programs were ranked on this application."
          />
        </section>
      </div>
    </PageShell>
  );
}

interface BackLinkProps {
  sourceProgramId: string | null;
  sourceProgram: Program | null;
}

function BackLink({ sourceProgramId, sourceProgram }: BackLinkProps) {
  if (!sourceProgramId) {
    return (
      <Link
        to="/university"
        className="inline-flex w-fit items-center gap-[8px] font-sans text-[13px] font-medium text-lrfap-navy underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lrfap-sky"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to Dashboard
      </Link>
    );
  }

  const specialty = sourceProgram ? populated<Specialty>(sourceProgram.specialty) : null;
  const label = specialty?.name ? `Back to ${specialty.name}` : 'Back to program';

  return (
    <Link
      to={`/university/programs/${sourceProgramId}`}
      className="inline-flex w-fit items-center gap-[8px] font-sans text-[13px] font-medium text-lrfap-navy underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lrfap-sky"
    >
      <ArrowLeft aria-hidden="true" className="h-4 w-4" />
      {label}
    </Link>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-6 py-[40px] md:px-[58px]">
      <div className="flex flex-col gap-[24px]">{children}</div>
    </div>
  );
}

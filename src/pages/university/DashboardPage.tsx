import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowUpRight,
  BellOff,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  Users,
} from 'lucide-react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useAuth } from '../../hooks/useAuth';
import { universityReviewApi } from '../../api/universityReview';
import { cyclesApi } from '../../api/cycles';
import { dashboardApi } from '../../api/dashboard';
import { notificationsApi } from '../../api/notifications';
import type {
  ApplicationStatus,
  Cycle,
  CycleStatus,
  ID,
  Notification,
  Program,
  Specialty,
  UniversityProgramStatusCounts,
} from '../../types';

/**
 * University reviewer landing page.
 *
 * First wave (parallel):
 *   1. GET /university-review/programs   — programs owned by this university
 *   2. GET /cycles                       — used to pick the active cycle
 *   3. GET /notifications                — last 3 for Recent Activity
 *
 * Second wave (after active cycle is known):
 *   4. GET /dashboard/university/program-counts?cycle=…
 *      Single aggregation that returns per-program status counts AND
 *      the total unique applicants across them — scoped to the active
 *      cycle. Replaces the old N+1 fetch that pulled one applications
 *      list per program.
 *
 * Status categories shown are the real backend enum values only
 * (submitted / under_review / matched / unmatched / withdrawn). Drafts
 * are never shown — backend aggregation already excludes them.
 *
 * There is no university name in the welcome strip: backend auth responses
 * omit the populated university on the user object and getMyPrograms
 * doesn't populate it either — flagged as a backend gap. The reviewer role
 * label stands in until that ships.
 */

type FetchStatus = 'idle' | 'loading' | 'loaded' | 'error';

interface ProgramWithCounts {
  program: Program;
  counts: UniversityProgramStatusCounts;
}

const STATUS_VISIBLE: ApplicationStatus[] = [
  'submitted',
  'under_review',
  'matched',
  'unmatched',
  'withdrawn',
];

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  under_review: 'Under review',
  matched: 'Matched',
  unmatched: 'Unmatched',
  withdrawn: 'Withdrawn',
};

const STATUS_TONE: Record<ApplicationStatus, string> = {
  draft: 'border-slate-200 bg-slate-50 text-slate-600',
  submitted: 'border-lrfap-sky/40 bg-lrfap-sky/10 text-lrfap-navy',
  under_review: 'border-amber-200 bg-amber-50 text-amber-800',
  matched: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  unmatched: 'border-rose-200 bg-rose-50 text-rose-800',
  withdrawn: 'border-slate-200 bg-slate-50 text-slate-500',
};

// Mirror the backend's LGC dashboard picker — "non-draft, non-closed"
// is the definition of an active cycle across the app.
const ACTIVE_CYCLE_STATUSES: CycleStatus[] = [
  'open',
  'review',
  'ranking',
  'matching',
  'published',
];

function emptyCounts(): UniversityProgramStatusCounts {
  return {
    submitted: 0,
    under_review: 0,
    matched: 0,
    unmatched: 0,
    withdrawn: 0,
    total: 0,
  };
}

function idOf(ref: ID | { _id: ID } | null | undefined): ID | null {
  if (!ref) return null;
  return typeof ref === 'string' ? ref : ref._id;
}

export default function UniversityDashboardPage() {
  useDocumentTitle('University dashboard');
  const { user } = useAuth();

  const [entries, setEntries] = useState<ProgramWithCounts[]>([]);
  const [totalUniqueApplicants, setTotalUniqueApplicants] = useState(0);
  const [programsStatus, setProgramsStatus] = useState<FetchStatus>('idle');

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsStatus, setNotificationsStatus] = useState<FetchStatus>('idle');

  useEffect(() => {
    let cancelled = false;
    setProgramsStatus('loading');

    (async () => {
      try {
        // First wave: parallel fetches that don't depend on each other.
        const [programsList, cyclesList] = await Promise.all([
          universityReviewApi.listMyPrograms(),
          cyclesApi.list(),
        ]);
        if (cancelled) return;

        const activeCycle = pickActiveCycle(cyclesList);

        // Scope the "My Programs" section to the active cycle — matches
        // the new aggregation's scope and avoids cross-cycle duplicates
        // in the counts (a program can only exist in one cycle anyway,
        // but the old page happily rolled everything up cycle-agnostic).
        const cycleScopedPrograms = activeCycle
          ? programsList.filter((p) => idOf(p.cycle) === activeCycle._id)
          : [];

        if (!activeCycle || cycleScopedPrograms.length === 0) {
          setEntries(cycleScopedPrograms.map((p) => ({ program: p, counts: emptyCounts() })));
          setTotalUniqueApplicants(0);
          setProgramsStatus('loaded');
          return;
        }

        // Second wave: single aggregation replacing the old per-program
        // applications fetch loop.
        const summary = await dashboardApi.universityProgramCounts(
          activeCycle._id,
        );
        if (cancelled) return;

        const countsByProgram = new Map<ID, UniversityProgramStatusCounts>();
        for (const entry of summary.programs) {
          countsByProgram.set(entry.programId, entry.counts);
        }
        setEntries(
          cycleScopedPrograms.map((program) => ({
            program,
            counts: countsByProgram.get(program._id) ?? emptyCounts(),
          })),
        );
        setTotalUniqueApplicants(summary.totalUniqueApplicants);
        setProgramsStatus('loaded');
      } catch {
        if (!cancelled) setProgramsStatus('error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setNotificationsStatus('loading');
    notificationsApi
      .list()
      .then((res) => {
        if (cancelled) return;
        setNotifications(res);
        setNotificationsStatus('loaded');
      })
      .catch(() => {
        if (!cancelled) setNotificationsStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const summary = useMemo(() => {
    let pendingReview = 0;
    for (const { counts } of entries) {
      pendingReview += counts.submitted + counts.under_review;
    }
    return {
      totalPrograms: entries.length,
      totalApplicants: totalUniqueApplicants,
      pendingReview,
    };
  }, [entries, totalUniqueApplicants]);

  const recentNotifications = useMemo(() => {
    if (!Array.isArray(notifications)) return [];
    return notifications
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 3);
  }, [notifications]);

  const firstName = user?.firstName?.trim() || '';

  if (programsStatus === 'loading' || programsStatus === 'idle') {
    return (
      <PageShell>
        <div className="h-[48px] w-[320px] max-w-full animate-pulse bg-slate-100" />
        <div className="grid grid-cols-1 gap-[16px] md:grid-cols-3">
          <div className="h-[110px] animate-pulse border-[0.91px] border-lrfap-ghost bg-slate-50" />
          <div className="h-[110px] animate-pulse border-[0.91px] border-lrfap-ghost bg-slate-50" />
          <div className="h-[110px] animate-pulse border-[0.91px] border-lrfap-ghost bg-slate-50" />
        </div>
        <div className="h-[220px] animate-pulse border-[0.91px] border-lrfap-ghost bg-slate-50" />
        <div className="h-[180px] animate-pulse border-[0.91px] border-lrfap-ghost bg-slate-50" />
      </PageShell>
    );
  }

  if (programsStatus === 'error') {
    return (
      <PageShell>
        <div
          role="alert"
          className="flex items-start gap-[10px] border-[0.91px] border-red-200 bg-red-50 px-[16px] py-[12px] font-sans text-[13px] text-red-800"
        >
          <AlertCircle aria-hidden="true" className="mt-[2px] h-4 w-4 shrink-0" />
          <span>
            Couldn&apos;t load your programs. Refresh the page to try again.
          </span>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <header>
        <h1 className="font-display text-[36px] font-extrabold leading-[1.1] text-lrfap-navy md:text-[40px]">
          {firstName ? `Welcome back, ${firstName}` : 'Welcome back'}
        </h1>
        <p className="mt-[8px] font-sans text-[14px] uppercase tracking-wide text-slate-500">
          Review Committee
        </p>
      </header>

      <SummaryRow
        totalPrograms={summary.totalPrograms}
        totalApplicants={summary.totalApplicants}
        pendingReview={summary.pendingReview}
      />

      <ProgramList entries={entries} />

      <RecentActivity
        notifications={notificationsStatus === 'error' ? [] : recentNotifications}
      />

      <QuickLinks />
    </PageShell>
  );
}

/**
 * Pick the "active" cycle the way the backend LGC dashboard does — the
 * most-recent cycle whose status is open/review/ranking/matching/published.
 * Draft and closed cycles are excluded. Falls back to the most recent
 * cycle overall when none match (so the page still has something to
 * scope against during setup).
 */
function pickActiveCycle(cycles: Cycle[]): Cycle | null {
  if (cycles.length === 0) return null;
  const sorted = [...cycles].sort((a, b) => b.year - a.year);
  return (
    sorted.find((c) => ACTIVE_CYCLE_STATUSES.includes(c.status)) ??
    sorted[0] ??
    null
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-[40px] md:px-8">
      <div className="flex flex-col gap-[32px]">{children}</div>
    </div>
  );
}

interface SummaryRowProps {
  totalPrograms: number;
  totalApplicants: number;
  pendingReview: number;
}

function SummaryRow({ totalPrograms, totalApplicants, pendingReview }: SummaryRowProps) {
  return (
    <section aria-labelledby="dashboard-summary-heading">
      <h2 id="dashboard-summary-heading" className="sr-only">
        Summary
      </h2>
      <div className="grid grid-cols-1 gap-[16px] md:grid-cols-3">
        <SummaryCard
          icon={<GraduationCap aria-hidden="true" className="h-5 w-5" />}
          label="Programs"
          value={totalPrograms}
          hint={totalPrograms === 1 ? '1 program in active cycle' : `${totalPrograms} programs in active cycle`}
        />
        <SummaryCard
          icon={<Users aria-hidden="true" className="h-5 w-5" />}
          label="Applicants"
          value={totalApplicants}
          hint="Unique across your active-cycle programs"
        />
        <SummaryCard
          icon={<ClipboardList aria-hidden="true" className="h-5 w-5" />}
          label="Pending review"
          value={pendingReview}
          hint="Submitted + under review"
        />
      </div>
    </section>
  );
}

interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  hint: string;
}

function SummaryCard({ icon, label, value, hint }: SummaryCardProps) {
  return (
    <div className="flex items-start gap-[14px] border-[0.91px] border-lrfap-ghost bg-white p-[20px] shadow-[0_4px_12px_rgba(38,43,102,0.08)]">
      <span
        aria-hidden="true"
        className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-lrfap-ghost text-lrfap-navy"
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-sans text-[12px] font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <p className="mt-[2px] font-display text-[28px] font-extrabold leading-none text-lrfap-navy">
          {value}
        </p>
        <p className="mt-[6px] font-sans text-[12px] text-slate-500">{hint}</p>
      </div>
    </div>
  );
}

interface ProgramListProps {
  entries: ProgramWithCounts[];
}

function ProgramList({ entries }: ProgramListProps) {
  return (
    <section aria-labelledby="dashboard-programs-heading">
      <div className="flex items-center justify-between gap-[12px]">
        <h2
          id="dashboard-programs-heading"
          className="font-display text-[16px] font-bold uppercase tracking-wide text-lrfap-navy"
        >
          My Programs
        </h2>
        <Link
          to="/university/programs"
          className="font-sans text-[12px] font-semibold uppercase tracking-wide text-lrfap-sky underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lrfap-sky"
        >
          View all
        </Link>
      </div>

      {entries.length === 0 ? (
        <div className="mt-[16px] flex flex-col items-center justify-center gap-[8px] border border-dashed border-lrfap-ghost bg-white/60 px-[16px] py-[36px] text-center">
          <GraduationCap
            aria-hidden="true"
            className="h-8 w-8 text-slate-300"
            strokeWidth={1.5}
          />
          <p className="font-sans text-[13px] text-slate-500">
            No programs in the active cycle yet.
          </p>
        </div>
      ) : (
        <ul role="list" className="mt-[16px] flex flex-col gap-[12px]">
          {entries.map(({ program, counts }) => (
            <li key={program._id}>
              <ProgramCard program={program} counts={counts} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

interface ProgramCardProps {
  program: Program;
  counts: UniversityProgramStatusCounts;
}

function ProgramCard({ program, counts }: ProgramCardProps) {
  const specialtyName =
    typeof program.specialty === 'object' && program.specialty
      ? (program.specialty as Specialty).name
      : 'Program';

  return (
    <Link
      to={`/university/programs/${program._id}`}
      className="group flex flex-col gap-[14px] border-[0.91px] border-lrfap-ghost bg-white px-[20px] py-[18px] shadow-[0_4px_12px_rgba(38,43,102,0.08)] transition-colors hover:border-lrfap-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lrfap-sky md:flex-row md:items-center"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate font-sans text-[16px] font-semibold text-lrfap-navy">
          {specialtyName}
        </p>
        <p className="mt-[2px] font-sans text-[12px] uppercase tracking-wide text-slate-500">
          {program.track} · {counts.total}{' '}
          {counts.total === 1 ? 'applicant' : 'applicants'}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-[6px]">
        {STATUS_VISIBLE.map((status) => {
          const n = counts[status as keyof UniversityProgramStatusCounts] ?? 0;
          if (n === 0) return null;
          return (
            <span
              key={status}
              className={`inline-flex items-center gap-[6px] border-[0.91px] px-[10px] py-[3px] font-sans text-[11px] font-medium ${STATUS_TONE[status]}`}
            >
              {STATUS_LABEL[status]}
              <span className="font-semibold">{n}</span>
            </span>
          );
        })}
        {counts.total === 0 ? (
          <span className="font-sans text-[11px] text-slate-400">
            No applicants yet
          </span>
        ) : null}
      </div>

      <ArrowUpRight
        aria-hidden="true"
        className="hidden h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:-translate-y-[1px] group-hover:translate-x-[1px] group-hover:text-lrfap-navy md:block"
      />
    </Link>
  );
}

interface RecentActivityProps {
  notifications: Notification[];
}

function relativeTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const diffMs = Date.now() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return 'just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return 'yesterday';
  if (diffDay < 7) return `${diffDay}d ago`;
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function RecentActivity({ notifications }: RecentActivityProps) {
  return (
    <section
      aria-labelledby="dashboard-activity-heading"
      className="border-[0.91px] border-lrfap-ghost bg-white p-[24px] shadow-[0_4px_12px_rgba(38,43,102,0.08)]"
    >
      <h2
        id="dashboard-activity-heading"
        className="font-display text-[16px] font-bold uppercase tracking-wide text-lrfap-navy"
      >
        Recent Activity
      </h2>

      {notifications.length === 0 ? (
        <div className="mt-[16px] flex flex-col items-center justify-center gap-[8px] border border-dashed border-lrfap-ghost bg-white/60 px-[16px] py-[36px] text-center">
          <BellOff
            aria-hidden="true"
            className="h-8 w-8 text-slate-300"
            strokeWidth={1.5}
          />
          <p className="font-sans text-[13px] text-slate-500">
            No recent activity
          </p>
        </div>
      ) : (
        <ul role="list" className="mt-[16px] flex flex-col">
          {notifications.map((n, idx) => (
            <li
              key={n._id}
              className={idx > 0 ? 'border-t border-lrfap-ghost/70' : ''}
            >
              <div className="flex items-start gap-[12px] px-[4px] py-[12px]">
                <span
                  aria-hidden="true"
                  className={`mt-[8px] h-[8px] w-[8px] shrink-0 rounded-full ${
                    n.isRead ? 'bg-transparent' : 'bg-lrfap-sky'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-sans text-[13px] font-semibold text-lrfap-navy">
                    {n.title}
                  </p>
                  {n.message ? (
                    <p className="mt-[2px] truncate font-sans text-[12px] text-slate-500">
                      {n.message}
                    </p>
                  ) : null}
                </div>
                <span className="shrink-0 font-sans text-[11px] text-slate-500">
                  {relativeTime(n.createdAt)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function QuickLinks() {
  return (
    <section aria-labelledby="dashboard-quick-links-heading">
      <h2
        id="dashboard-quick-links-heading"
        className="font-display text-[16px] font-bold uppercase tracking-wide text-lrfap-navy"
      >
        Quick Links
      </h2>
      <div className="mt-[12px] grid grid-cols-1 gap-[16px] md:grid-cols-2">
        <QuickLinkTile
          to="/university/programs"
          icon={<ClipboardList aria-hidden="true" className="h-5 w-5" />}
          title="All Programs"
          body="Review applicants and manage rankings"
        />
        <QuickLinkTile
          to="/programs"
          icon={<GraduationCap aria-hidden="true" className="h-5 w-5" />}
          title="Browse Catalog"
          body="Explore programs across all institutions"
        />
      </div>
    </section>
  );
}

interface QuickLinkTileProps {
  to: string;
  icon: React.ReactNode;
  title: string;
  body: string;
}

function QuickLinkTile({ to, icon, title, body }: QuickLinkTileProps) {
  return (
    <Link
      to={to}
      className="group flex items-start gap-[14px] border-[0.91px] border-lrfap-ghost bg-white p-[20px] shadow-[0_4px_12px_rgba(38,43,102,0.08)] transition-colors hover:border-lrfap-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lrfap-sky"
    >
      <span
        aria-hidden="true"
        className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-lrfap-ghost text-lrfap-navy transition-colors group-hover:bg-lrfap-navy group-hover:text-white"
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-sans text-[14px] font-semibold uppercase tracking-wide text-lrfap-navy">
          {title}
        </p>
        <p className="mt-[2px] font-sans text-[12px] text-slate-600">{body}</p>
      </div>
      <ChevronRight
        aria-hidden="true"
        className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-[1px] group-hover:text-lrfap-navy"
      />
    </Link>
  );
}

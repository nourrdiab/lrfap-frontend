import { Check, X } from 'lucide-react';

/**
 * Two-item readiness checklist for a track. Backend enforces the real
 * invariants on each action; this is advisory so buttons can disable
 * with a hint instead of failing on click.
 *
 * Item 1 — every program in (track, cycle) has a submitted ProgramRanking.
 * Item 2 — cycle is not yet published or closed.
 *
 * "At least one submitted application" is intentionally omitted: no
 * per-track/cycle applicant-count endpoint exists yet, and the backend
 * returns a clear 400 if you try to run against an empty set. We
 * surface that error in the action-confirm dialog instead.
 */

export interface ReadinessState {
  allProgramsRanked: boolean;
  totalPrograms: number;
  submittedRankings: number;
  cycleActionable: boolean;
  cycleStatus: string;
}

interface MatchingReadinessProps {
  state: ReadinessState;
}

export function MatchingReadiness({ state }: MatchingReadinessProps) {
  return (
    <ul role="list" className="flex flex-col gap-[6px]">
      <ChecklistItem
        passed={state.allProgramsRanked}
        label={
          state.totalPrograms === 0
            ? 'Programs for this track'
            : 'All programs have submitted rankings'
        }
        detail={
          state.totalPrograms === 0
            ? 'No programs in this track for the selected cycle.'
            : `${state.submittedRankings} of ${state.totalPrograms} ranked`
        }
      />
      <ChecklistItem
        passed={state.cycleActionable}
        label="Cycle is still actionable"
        detail={
          state.cycleActionable
            ? `Status: ${state.cycleStatus}`
            : `Cycle is ${state.cycleStatus} — matching can no longer run.`
        }
      />
    </ul>
  );
}

function ChecklistItem({
  passed,
  label,
  detail,
}: {
  passed: boolean;
  label: string;
  detail?: string;
}) {
  return (
    <li className="flex items-start gap-[8px] font-sans text-[12px]">
      <span
        aria-hidden="true"
        className={`mt-[2px] inline-flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-full ${
          passed ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
        }`}
      >
        {passed ? (
          <Check className="h-3 w-3" strokeWidth={3} />
        ) : (
          <X className="h-3 w-3" strokeWidth={3} />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className={passed ? 'text-lrfap-navy' : 'text-slate-600'}>{label}</p>
        {detail ? (
          <p className="mt-[1px] text-[11px] italic text-slate-500">{detail}</p>
        ) : null}
      </div>
    </li>
  );
}

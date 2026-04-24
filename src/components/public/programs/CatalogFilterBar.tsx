import { Search, X } from 'lucide-react';
import type { Cycle, ID, Specialty, Track, University } from '../../../types';

/**
 * Filter bar for the public program catalog. Presentational — parent
 * owns state (URL-synced via useSearchParams).
 *
 * Styling mirrors the LGC Catalog filter bar for platform consistency:
 * same input heights, same uppercase small-caps labels, same track
 * segmented control. The visual difference is the public variant sits
 * on a plain white page (no tab shell), so the filter bar wraps in its
 * own bordered block to define the region.
 */

export type TrackFilter = 'all' | Track;
export type CycleFilter = 'all' | ID;
export type UniversityFilter = 'all' | ID;
export type SpecialtyFilter = 'all' | ID;

export interface CatalogFilterValues {
  search: string;
  cycle: CycleFilter;
  track: TrackFilter;
  university: UniversityFilter;
  specialty: SpecialtyFilter;
}

interface CatalogFilterBarProps {
  values: CatalogFilterValues;
  onChange: (values: CatalogFilterValues) => void;
  cycles: Cycle[];
  universities: University[];
  specialties: Specialty[];
  isBusy?: boolean;
  hasAnyActive: boolean;
  onClear: () => void;
}

const SELECT_CLS =
  'h-[40px] w-full appearance-none border-[0.91px] border-lrfap-ghost bg-white px-[12px] font-sans text-[13px] text-slate-900 transition-colors hover:border-slate-300 focus:border-lrfap-sky focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-50';

export function CatalogFilterBar({
  values,
  onChange,
  cycles,
  universities,
  specialties,
  isBusy,
  hasAnyActive,
  onClear,
}: CatalogFilterBarProps) {
  function patch<K extends keyof CatalogFilterValues>(
    key: K,
    value: CatalogFilterValues[K],
  ) {
    onChange({ ...values, [key]: value });
  }

  return (
    <div className="flex flex-col gap-[14px] border-[0.91px] border-lrfap-ghost bg-white p-[18px]">
      <div className="flex flex-col gap-[10px] sm:flex-row sm:items-center sm:justify-between">
        <label htmlFor="catalog-search" className="relative flex-1 sm:max-w-[440px]">
          <span className="sr-only">Search programs</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-[12px] top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          />
          <input
            id="catalog-search"
            type="search"
            value={values.search}
            onChange={(e) => patch('search', e.target.value)}
            placeholder="Search specialty, university, description…"
            disabled={isBusy}
            className="h-[40px] w-full border-[0.91px] border-lrfap-ghost bg-white pl-[36px] pr-[14px] font-sans text-[14px] text-slate-900 transition-colors placeholder:text-slate-400 hover:border-slate-300 focus:border-lrfap-sky focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-50"
          />
        </label>
        {hasAnyActive ? (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex h-[40px] shrink-0 items-center justify-center gap-[6px] border-[0.91px] border-lrfap-ghost bg-white px-[14px] font-sans text-[12px] font-medium uppercase tracking-wide text-slate-600 transition-colors hover:border-slate-300 hover:text-lrfap-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lrfap-navy"
          >
            <X aria-hidden="true" className="h-3.5 w-3.5" />
            Clear filters
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-[4px]">
          <label
            htmlFor="catalog-filter-cycle"
            className="font-sans text-[11px] font-semibold uppercase tracking-wide text-slate-500"
          >
            Cycle
          </label>
          <select
            id="catalog-filter-cycle"
            value={values.cycle}
            onChange={(e) => patch('cycle', e.target.value as CycleFilter)}
            disabled={isBusy}
            className={SELECT_CLS}
          >
            <option value="all">All cycles</option>
            {cycles.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} · {c.year}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-[4px]">
          <span
            id="catalog-filter-track-label"
            className="font-sans text-[11px] font-semibold uppercase tracking-wide text-slate-500"
          >
            Track
          </span>
          <div
            role="radiogroup"
            aria-labelledby="catalog-filter-track-label"
            className="inline-flex h-[40px] w-full items-stretch overflow-hidden border-[0.91px] border-lrfap-ghost"
          >
            {(['all', 'residency', 'fellowship'] as TrackFilter[]).map((t) => {
              const selected = values.track === t;
              return (
                <button
                  key={t}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => patch('track', t)}
                  disabled={isBusy}
                  className={`flex-1 font-sans text-[12px] font-medium uppercase tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-lrfap-sky disabled:cursor-not-allowed disabled:opacity-60 ${
                    selected
                      ? 'bg-lrfap-navy text-white'
                      : 'bg-white text-lrfap-navy hover:bg-lrfap-ghost/50'
                  }`}
                >
                  {t === 'all' ? 'All' : t}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-[4px]">
          <label
            htmlFor="catalog-filter-university"
            className="font-sans text-[11px] font-semibold uppercase tracking-wide text-slate-500"
          >
            University
          </label>
          <select
            id="catalog-filter-university"
            value={values.university}
            onChange={(e) => patch('university', e.target.value as UniversityFilter)}
            disabled={isBusy}
            className={SELECT_CLS}
          >
            <option value="all">All universities</option>
            {universities.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-[4px]">
          <label
            htmlFor="catalog-filter-specialty"
            className="font-sans text-[11px] font-semibold uppercase tracking-wide text-slate-500"
          >
            Specialty
          </label>
          <select
            id="catalog-filter-specialty"
            value={values.specialty}
            onChange={(e) => patch('specialty', e.target.value as SpecialtyFilter)}
            disabled={isBusy}
            className={SELECT_CLS}
          >
            <option value="all">All specialties</option>
            {specialties.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

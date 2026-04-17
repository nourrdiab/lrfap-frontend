import type { StepSlug } from '../../../components/applicant/wizard/types';

/**
 * Temporary placeholder rendered in each step route until the real step
 * component is built. Kept minimal so the wizard shell can be reviewed
 * visually without step noise.
 */
interface StepPlaceholderProps {
  step: StepSlug;
  label: string;
}

export function StepPlaceholder({ step, label }: StepPlaceholderProps) {
  return (
    <section
      aria-label={`${label} step content`}
      className="flex min-h-[320px] flex-col items-center justify-center border border-dashed border-lrfap-ghost bg-white/60 px-6 py-[48px] text-center"
    >
      <p className="font-sans text-[12px] font-medium uppercase tracking-wide text-slate-400">
        Step content slot
      </p>
      <p className="mt-[8px] font-display text-[22px] font-bold uppercase tracking-wide text-lrfap-navy">
        {label}
      </p>
      <p className="mt-[8px] font-sans text-[13px] text-slate-500">
        Placeholder — the real <code className="font-mono">{step}</code> step
        will render here.
      </p>
    </section>
  );
}

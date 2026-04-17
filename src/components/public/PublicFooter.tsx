import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * Unified public-area footer.
 *
 * Figma-locked geometry:
 *   - Container: max-width 1366 px, 58 px horizontal padding
 *   - Main row height: 323.72 px (from Figma frame)
 *   - Logo: 51.93 px tall
 *   - Link text: 18.11 / 22 regular white, vertical gap 21.45 px
 *   - GET STARTED pill: 198.36 × 40.67, 0.91 px white stroke, square corners
 *   - Inter-column gap: 120 px (tuned down from Figma's 203 px so everything
 *     still fits at 1024 px viewport width)
 *
 * Copyright strip sits below the main row, same navy background, centered,
 * 14 px white at 70 % opacity.
 */

const LINK_CLS =
  'font-sans text-[18.11px] leading-[22px] font-normal text-white transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white';

interface FooterLink {
  label: string;
  href: string;
}

const COLUMN_1: FooterLink[] = [
  { label: 'ABOUT US', href: '/about' },
  { label: 'PRIVACY POLICY', href: '/about' },
  { label: 'GOVERNANCE', href: '/about' },
];

const COLUMN_2: FooterLink[] = [
  { label: 'TERMS & CONDITIONS', href: '/about' },
  { label: 'SUPPORT', href: '/about' },
  { label: 'FAQs', href: '/about' },
];

function LinkColumn({ items }: { items: FooterLink[] }) {
  return (
    <ul className="flex list-none flex-col gap-[21.45px]">
      {items.map((item) => (
        <li key={item.label}>
          <Link to={item.href} className={LINK_CLS}>
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function PublicFooter() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative w-full bg-lrfap-navy"
      aria-labelledby="public-footer-heading"
    >
      <h2 id="public-footer-heading" className="sr-only">
        Site footer
      </h2>

      <div
        className="mx-auto flex w-full max-w-[1366px] flex-col items-start gap-[40px] px-6 py-[48px] md:h-[323.72px] md:flex-row md:items-center md:justify-between md:gap-0 md:px-[58px] md:py-0"
      >
        <Link
          to="/"
          className="shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          aria-label="LRFAP — home"
        >
          <img
            src="/logos/logo-white.png"
            alt="LRFAP"
            draggable={false}
            className="h-[51.93px] w-auto select-none"
          />
        </Link>

        <nav
          aria-label="Footer"
          className="flex flex-col items-start gap-[32px] md:flex-row md:gap-[120px]"
        >
          <LinkColumn items={COLUMN_1} />
          <LinkColumn items={COLUMN_2} />
        </nav>

        <Link
          to="/register"
          className="flex shrink-0 items-center justify-center border-[0.91px] border-white font-sans text-[16.49px] font-normal text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          style={{ width: '198.36px', height: '40.67px' }}
        >
          GET STARTED NOW
        </Link>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto w-full max-w-[1366px] px-6 py-[18px] text-center font-sans text-[14px] font-normal text-white/70 md:px-[58px]">
          © {new Date().getFullYear()} LRFAP. All rights reserved.
        </p>
      </div>
    </motion.footer>
  );
}

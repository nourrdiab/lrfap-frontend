import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * Landing footer — flex layout (items-center, justify-between).
 *
 *   [ logo ]   [ col1   col2 ]                          [ GET STARTED NOW ]
 *
 * Exact Figma dimensions preserved on all four groups:
 *   - Logo height 51.93 px
 *   - Link text 18.11 / 22 regular white, vertical gap 21.45 px between items
 *   - Button 198.36 × 40.67, 0.91 px white border, square corners
 *   - Container max-width 1366 px, horizontal padding 58 px
 *   - Footer total height 323.72 px
 *
 * Inter-column gap is tuned to 120 px (Figma's original 203 px doesn't fit
 * at 1024 viewport). With a 120 px gap the link group is 480 px wide, total
 * content ≈ 852 px, container padding 116 px, so everything fits cleanly
 * from 1024 px upward with the button flush against the right padding edge.
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

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative w-full bg-lrfap-navy"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Site footer
      </h2>
      <div
        className="mx-auto flex w-full max-w-[1366px] items-center justify-between px-[58px]"
        style={{ height: '323.72px' }}
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

        <nav aria-label="Footer" className="flex items-start gap-[120px]">
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
    </motion.footer>
  );
}

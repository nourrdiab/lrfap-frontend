import { Link, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { PublicFooter } from '../components/public/PublicFooter';

/**
 * Layout for /login, /register, /forgot-password, /reset-password.
 *
 *   Chrome:
 *     - White navbar with navy logo (logo-navy.png) and navy link text,
 *       separated from the content by a 0.91 px ghost bottom border.
 *     - CREATE ACCOUNT is an outline pill (navy border, transparent fill,
 *       navy text) so it communicates the alternative path without
 *       competing with the page's primary submit.
 *
 *   Body (md and up, 56 / 44 split):
 *     - Left column: form column handles its own vertical padding (60 px
 *       top and bottom) and carries the subtle white → cool-gray gradient.
 *     - Right column: full-bleed photograph — touches the navbar at the
 *       top and the footer at the bottom with no gap. No overlay, no
 *       gradient; the raw photo stands on its own. Slides in from the
 *       right 0.2 s after the card appears.
 *
 *   Below md the image column is hidden and the form takes full width.
 *   The photo is decorative, not content.
 *
 *   PublicFooter spans both columns at the bottom for cross-site
 *   consistency.
 */

const AUX_LINK_CLS =
  'font-sans text-[16.49px] font-normal text-lrfap-navy transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lrfap-navy';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <header className="w-full border-b-[0.91px] border-lrfap-ghost bg-white">
        <div className="mx-auto flex w-full max-w-[1366px] items-center px-6 pt-[31px] pb-[22px] md:px-[58px]">
          <Link
            to="/"
            className="block shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lrfap-navy"
            aria-label="LRFAP — home"
          >
            <img
              src="/logos/logo-navy.png"
              alt="LRFAP — Lebanese Residency and Fellowship Application Program"
              className="h-[40px] w-auto md:h-[48.5px]"
              draggable={false}
            />
          </Link>

          <nav aria-label="Auth chrome" className="ml-auto flex items-center gap-[24px] md:gap-[40px]">
            <Link to="/programs" className={AUX_LINK_CLS}>
              PROGRAMS
            </Link>
            <Link to="/about" className={AUX_LINK_CLS}>
              ABOUT
            </Link>
            <Link to="/" className={`${AUX_LINK_CLS} inline-flex items-center gap-[8px]`}>
              <ArrowLeft aria-hidden="true" className="h-[18px] w-[18px]" />
              <span>Back to home</span>
            </Link>
            <Link
              to="/register"
              className="inline-flex shrink-0 items-center justify-center border-[0.91px] border-lrfap-navy font-sans text-[16.49px] font-normal text-lrfap-navy transition-colors hover:bg-lrfap-navy/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lrfap-navy"
              style={{ width: '198.36px', height: '40.67px' }}
            >
              CREATE ACCOUNT
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col md:flex-row">
        <section className="flex flex-1 items-center justify-center bg-gradient-to-b from-white via-[#f7f9fc] to-[#ebeef5] px-6 py-[60px] md:w-[56%] md:flex-none lg:px-[48px]">
          <Outlet />
        </section>

        <motion.aside
          aria-hidden="true"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          className="relative hidden md:block md:w-[44%] md:flex-none"
        >
          <img
            src="/images/auth-background.jpg"
            alt=""
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </motion.aside>
      </main>

      <PublicFooter />
    </div>
  );
}

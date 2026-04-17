import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Shared navbar for every auth page (/login, /register, /forgot-password,
 * /reset-password). Both AuthLayout (split) and CenteredAuthLayout use this
 * so the chrome is identical regardless of body layout.
 *
 * White background with navy type + logo-navy.png, 0.91 px ghost bottom
 * border. The CTA on the right swaps based on the current path: on
 * /register we offer SIGN IN as the way back; on every other auth page we
 * offer CREATE ACCOUNT. Keeps the CTA useful for someone who lands on the
 * wrong page.
 */

const AUX_LINK_CLS =
  'font-sans text-[16.49px] font-normal text-lrfap-navy transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lrfap-navy';

export function AuthNavbar() {
  const { pathname } = useLocation();
  const isRegister = pathname === '/register';

  return (
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

        <nav
          aria-label="Auth chrome"
          className="ml-auto flex items-center gap-[24px] md:gap-[40px]"
        >
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
          {isRegister ? (
            <Link
              to="/login"
              className="inline-flex h-[40.67px] shrink-0 items-center justify-center border-[0.91px] border-lrfap-navy px-[22px] font-sans text-[16.49px] font-normal text-lrfap-navy transition-colors hover:bg-lrfap-navy/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lrfap-navy"
            >
              SIGN IN
            </Link>
          ) : (
            <Link
              to="/register"
              className="inline-flex shrink-0 items-center justify-center border-[0.91px] border-lrfap-navy font-sans text-[16.49px] font-normal text-lrfap-navy transition-colors hover:bg-lrfap-navy/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lrfap-navy"
              style={{ width: '198.36px', height: '40.67px' }}
            >
              CREATE ACCOUNT
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

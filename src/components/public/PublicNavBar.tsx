import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

/**
 * Unified public-area navigation bar.
 *
 * Figma-locked geometry (do not alter without re-measuring):
 *   - Container: max-width 1366 px, 58 px horizontal padding
 *   - Logo: 48.5 px tall
 *   - Nav text: Montserrat 400 / 16.49 px / white
 *   - GET STARTED pill: 198.36 × 40.67 px, 0.91 px white stroke, square corners
 *   - SIGN IN pill: auto width with 22 px horizontal padding, h 40.67 px,
 *     0.91 px stroke, square corners — pairs with GET STARTED via shared
 *     height/border/corners (not width, which creates awkward whitespace
 *     when labels have different lengths).
 *
 * Variants:
 *   - transparent: floats over the landing hero photograph
 *   - solid:       navy background for inner public routes (Programs, About)
 */

type Variant = 'transparent' | 'solid';

interface NavLinkDef {
  to: string;
  label: string;
  end?: boolean;
}

const NAV_LINKS: NavLinkDef[] = [
  { to: '/', label: 'HOME', end: true },
  { to: '/programs', label: 'PROGRAMS' },
  { to: '/about', label: 'ABOUT' },
];

const LINK_BASE =
  'relative font-sans text-[16.49px] font-normal text-white transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white';

const GET_STARTED_CLS =
  'inline-flex shrink-0 items-center justify-center border-[0.91px] border-white font-sans text-[16.49px] font-normal text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white';

const SIGN_IN_CLS =
  'inline-flex h-[40.67px] shrink-0 items-center justify-center border-[0.91px] border-white px-[22px] font-sans text-[16.49px] font-normal text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white';

interface PublicNavBarProps {
  variant?: Variant;
}

export function PublicNavBar({ variant = 'solid' }: PublicNavBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const underlineId = useId();

  // Close drawer on route change.
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const bgClass =
    variant === 'transparent' ? 'bg-transparent' : 'bg-lrfap-navy';

  return (
    <nav
      aria-label="Primary"
      className={`relative z-30 w-full text-white ${bgClass}`}
    >
      <div className="mx-auto flex w-full max-w-[1366px] items-center px-6 pt-[31px] pb-[22px] md:px-[58px]">
        <Link
          to="/"
          className="block shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          aria-label="LRFAP — home"
        >
          <img
            src="/logos/logo-white.png"
            alt="LRFAP — Lebanese Residency and Fellowship Application Program"
            className="h-[40px] w-auto md:h-[48.5px]"
            draggable={false}
          />
        </Link>

        {/* Desktop links */}
        <ul
          className="ml-auto hidden items-center gap-[48px] md:flex"
          role="list"
        >
          {NAV_LINKS.map((item) => (
            <li key={item.to} className="relative">
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `${LINK_BASE} ${isActive ? 'opacity-100' : 'opacity-90'}`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="block py-[6px]">{item.label}</span>
                    {isActive ? (
                      <motion.span
                        layoutId={underlineId}
                        aria-hidden="true"
                        className="absolute inset-x-0 -bottom-[2px] h-[2px] bg-white"
                        transition={{
                          type: 'spring',
                          stiffness: 420,
                          damping: 38,
                        }}
                      />
                    ) : null}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop right-side buttons */}
        <div className="hidden items-center gap-[18px] md:flex md:pl-[48px]">
          <Link to="/login" className={SIGN_IN_CLS}>
            SIGN IN
          </Link>
          <Link
            to="/register"
            className={GET_STARTED_CLS}
            style={{ width: '198.36px', height: '40.67px' }}
          >
            GET STARTED NOW
          </Link>
        </div>

        {/* Mobile: GET STARTED stays visible outside drawer, then hamburger */}
        <div className="ml-auto flex items-center gap-[14px] md:hidden">
          <Link
            to="/register"
            className={`${GET_STARTED_CLS} h-[36px] px-[14px] text-[13px]`}
          >
            GET STARTED
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="public-mobile-drawer"
            className="inline-flex h-[40px] w-[40px] items-center justify-center border-[0.91px] border-white text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <Menu aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      </div>

      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </nav>
  );
}

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // Escape closes; focus trap inside drawer.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !drawerRef.current) return;
      const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    // Lock body scroll while drawer is open.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="drawer"
          id="public-mobile-drawer"
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed inset-x-0 top-0 z-40 bg-lrfap-navy text-white shadow-xl md:hidden"
        >
          <div className="flex items-center justify-between px-6 pt-[31px] pb-[22px]">
            <img
              src="/logos/logo-white.png"
              alt="LRFAP"
              className="h-[40px] w-auto"
              draggable={false}
            />
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="inline-flex h-[40px] w-[40px] items-center justify-center border-[0.91px] border-white text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
          <ul
            role="list"
            className="flex flex-col gap-[28px] px-6 pt-[24px] pb-[40px]"
          >
            {NAV_LINKS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `font-sans text-[22px] font-normal text-white transition-opacity ${
                      isActive ? 'opacity-100 underline underline-offset-[6px]' : 'opacity-90'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li className="mt-[8px]">
              <Link
                to="/login"
                onClick={onClose}
                className={SIGN_IN_CLS}
              >
                SIGN IN
              </Link>
            </li>
          </ul>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

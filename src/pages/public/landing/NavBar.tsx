import { Link } from 'react-router-dom';

/**
 * Landing-page navigation bar. Transparent — designed to sit on top of the
 * hero photograph. Layout mirrors the Figma frame after removing the EN|AR
 * toggle and search icon (backend has no i18n or global search).
 *
 *   Logo (left)            SUPPORT   FAQs   [ GET STARTED NOW ]  (right, gap 90px)
 *
 * Figma values used:
 *   - Container: 1366px wide, 58px horizontal padding
 *   - Nav text: Montserrat 400 / 16.49px / white
 *   - Pill CTA: 198.36 × 40.67 px, 0.91px white stroke, square corners
 *   - Logo group: 48.5px tall
 */
export function NavBar() {
  return (
    <nav
      aria-label="Primary"
      className="relative z-20 w-full text-white"
    >
      <div className="mx-auto flex w-full max-w-[1366px] items-center px-[58px] pt-[31px] pb-[22px]">
        <Link
          to="/"
          className="block shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          aria-label="LRFAP — home"
        >
          <img
            src="/logos/logo-white.png"
            alt="LRFAP — Lebanese Residency and Fellowship Application Program"
            className="h-[48.5px] w-auto"
            draggable={false}
          />
        </Link>

        <ul className="ml-auto flex items-center gap-[90px]">
          <li>
            <Link
              to="/about"
              className="font-sans text-[16.49px] font-normal text-white transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              SUPPORT
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="font-sans text-[16.49px] font-normal text-white transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              FAQs
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              className="inline-flex h-[40.67px] items-center justify-center border-[0.91px] border-white px-[17px] font-sans text-[16.49px] font-normal text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              GET STARTED NOW
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

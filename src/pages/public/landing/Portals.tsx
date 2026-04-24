import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * Applicant portal card — single full-width card pointing visitors to the
 * applicant login. University and LGC portals exist at /university and /lgc
 * but are intentionally not advertised on the public landing page since the
 * audience here is applicants.
 */

const OVERLAY_GRADIENT =
  'linear-gradient(180deg, #231F20 0%, rgba(24, 27, 41, 0.3) 51%, #231F20 100%)';

const CTA_WIDTH = 276.29;
const CTA_HEIGHT = 40.67;

interface CardLayout {
  photo: string;
  photoObjectPosition?: string;
  title: string;
  subtitle: string;
  body: string;
  cta: string;
  ctaHref: string;
  paddingTop: number;
  paddingBottom: number;
  paddingX: number;
  titleOffsetLeft: number;
  dividerMarginLeft: number;
  dividerMarginRight: number;
  bodyOffsetLeft: number;
  bodyWidth: number;
  ctaOffsetLeft: number;
  gapBodyToCTA: number;
  aspectRatio: string;
}

const APPLICANT: CardLayout = {
  photo: '/images/homepage-2.jpg',
  photoObjectPosition: 'center 10%',
  title: 'APPLICANT PORTAL',
  subtitle: 'For residency & fellowship applications',
  body: 'Build your profile, upload required documents, browse programs, rank preferences, submit applications and view and confirm offers.',
  cta: 'ACCESS APPLICANT PORTAL',
  ctaHref: '/login',
  paddingTop: 22.48,
  paddingBottom: 47.95,
  paddingX: 24.93,
  titleOffsetLeft: 3.27,
  dividerMarginLeft: 25.77,
  dividerMarginRight: 20.89,
  bodyOffsetLeft: 10.15,
  bodyWidth: 322,
  ctaOffsetLeft: 9.38,
  gapBodyToCTA: 30.61,
  aspectRatio: '1325.80 / 697.41',
};

function PortalCard(layout: CardLayout) {
  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: layout.aspectRatio }}
    >
      <img
        src={layout.photo}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover select-none"
        style={{ objectPosition: layout.photoObjectPosition ?? 'center' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70 mix-blend-multiply"
        style={{ background: OVERLAY_GRADIENT }}
      />

      <div
        className="relative flex h-full flex-col text-white"
        style={{
          paddingTop: `${layout.paddingTop}px`,
          paddingBottom: `${layout.paddingBottom}px`,
          paddingLeft: `${layout.paddingX}px`,
          paddingRight: `${layout.paddingX}px`,
        }}
      >
        <div
          className="flex items-center"
          style={{
            height: '55.49px',
            marginLeft: `${layout.titleOffsetLeft}px`,
          }}
        >
          <p className="shrink-0 font-sans text-[18.11px] leading-[22px] font-bold whitespace-nowrap">
            {layout.title}
          </p>
          <span
            aria-hidden="true"
            className="block shrink-0 bg-white"
            style={{
              width: '0.91px',
              height: '55.49px',
              marginLeft: `${layout.dividerMarginLeft}px`,
              marginRight: `${layout.dividerMarginRight}px`,
            }}
          />
          <p className="min-w-0 font-sans text-[18.11px] leading-[22px] font-normal">
            {layout.subtitle}
          </p>
        </div>

        <div
          aria-hidden="true"
          className="h-[0.91px] w-full bg-white"
          style={{ marginLeft: `-${layout.titleOffsetLeft}px` }}
        />

        <div className="min-h-0 flex-1" />

        <p
          className="font-sans text-[18.11px] leading-[21.73px] font-normal"
          style={{
            marginLeft: `${layout.bodyOffsetLeft}px`,
            width: `${layout.bodyWidth}px`,
            maxWidth: '100%',
          }}
        >
          {layout.body}
        </p>

        <Link
          to={layout.ctaHref}
          className="flex items-center justify-center bg-lrfap-sky font-sans text-[16.49px] font-normal text-white transition-colors hover:bg-[#3a86bd] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          style={{
            width: `${CTA_WIDTH}px`,
            maxWidth: '100%',
            height: `${CTA_HEIGHT}px`,
            marginTop: `${layout.gapBodyToCTA}px`,
            marginLeft: `${layout.ctaOffsetLeft}px`,
          }}
        >
          {layout.cta}
        </Link>
      </div>
    </motion.article>
  );
}

export function Portals() {
  return (
    <section aria-label="Applicant portal" className="relative w-full bg-white">
      <div
        className="mx-auto w-full max-w-[1366px] pb-[30px]"
        style={{ paddingLeft: '21.58px', paddingRight: '18.62px' }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
          className="mx-auto flex w-full max-w-[1325.80px] flex-col"
        >
          <PortalCard {...APPLICANT} />
        </motion.div>
      </div>
    </section>
  );
}

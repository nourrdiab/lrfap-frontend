import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * Portal cards — responsive grid.
 *
 *   viewport ≥ 1366 : exact Figma pixel dimensions (grid capped at 1325.80 wide)
 *   viewport 1024–1365 : grid scales proportionally — columns and rows use
 *                        fr units and the grid carries the overall aspect
 *                        ratio 1325.80/697.41, so every card keeps its
 *                        Figma proportions at any width in this range
 *   viewport < 1024 : flex-column, each card full-width with its own
 *                     intrinsic aspect-ratio preserved
 *
 * Cards never overflow the container. Content inside a card never overflows
 * the card either (internal layout is pure flex-col, no absolute positioning).
 *
 * Pixel-perfect Figma values kept on every element:
 *   - Card aspect ratios: 651.53/698.60, 666.57/345.57, 665.57/345.05
 *   - Column fr ratio: 651.53/666.57 (preserved at every width)
 *   - Row fr ratio: 345.57/345.05
 *   - Column gap 7.70 px, row gap 6.79 px (kept in px at every width)
 *   - Dividers 0.91 px, text 18.11 / leading 22 or 21.73, CTA 276.29 × 40.67
 *
 * homepage-3.jpg is portrait (2000×3000). object-cover in a landscape card
 * scales to fit WIDTH and crops VERTICALLY — horizontal object-position has
 * no effect. `center 10%` pulls the crop window up so the doctor's face
 * sits in the upper-middle of the card.
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
  aspectRatio: string; // e.g. "651.53 / 698.60"
  gridClass?: string; // row-span / col-start applied only at lg+
}

const APPLICANT: CardLayout = {
  photo: '/images/homepage-2.jpg',
  title: 'APPLICANT PORTAL',
  subtitle: 'For residency & fellowship applications.',
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
  aspectRatio: '651.53 / 698.60',
  gridClass: 'lg:row-span-2',
};

const UNIVERSITY: CardLayout = {
  photo: '/images/homepage-3.jpg',
  photoObjectPosition: 'center 35%',
  title: 'UNIVERSITY PORTAL',
  subtitle: 'For university staff & program offices',
  body: 'Review applicant submissions, request interviews and extra data, add reviewer notes, rank applications and submit program rankings.',
  cta: 'ACCESS UNIVERSITY PORTAL',
  ctaHref: '/login',
  paddingTop: 22.48,
  paddingBottom: 29.72,
  paddingX: 32.37,
  titleOffsetLeft: 3.27,
  dividerMarginLeft: 20.77,
  dividerMarginRight: 20.89,
  bodyOffsetLeft: 0,
  bodyWidth: 268,
  ctaOffsetLeft: 0,
  gapBodyToCTA: 21.53,
  aspectRatio: '666.57 / 345.57',
};

const LGC: CardLayout = {
  photo: '/images/homepage-4.jpg',
  title: 'LGC COMMITTEE',
  subtitle: 'For the LRFAP Governance Committee',
  body: 'Monitor university submissions, validate readiness, lock preferences, run matching, publish results and review audit logs.',
  cta: 'ACCESS COMMITTEE PORTAL',
  ctaHref: '/login',
  paddingTop: 28.34,
  paddingBottom: 34.43,
  paddingX: 32.18,
  titleOffsetLeft: 3.27,
  dividerMarginLeft: 43.94,
  dividerMarginRight: 35.72,
  bodyOffsetLeft: 0,
  bodyWidth: 276,
  ctaOffsetLeft: 0,
  gapBodyToCTA: 26.18,
  aspectRatio: '665.57 / 345.05',
};

function PortalCard(layout: CardLayout) {
  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className={`relative w-full overflow-hidden ${layout.gridClass ?? ''}`}
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
    <section aria-label="Choose your portal" className="relative w-full bg-white">
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
          className="mx-auto flex w-full flex-col gap-[12px] lg:grid lg:max-w-[1325.80px] lg:gap-x-[7.70px] lg:gap-y-[6.79px]"
          style={{
            gridTemplateColumns: '651.53fr 666.57fr',
            gridTemplateRows: '345.57fr 345.05fr',
            aspectRatio: '1325.8 / 697.41',
          }}
        >
          <PortalCard {...APPLICANT} />
          <PortalCard {...UNIVERSITY} />
          <PortalCard {...LGC} />
        </motion.div>
      </div>
    </section>
  );
}

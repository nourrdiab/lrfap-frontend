import { MotionConfig } from 'framer-motion';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Hero } from './landing/Hero';
import { Intro } from './landing/Intro';
import { Portals } from './landing/Portals';
import { Steps } from './landing/Steps';
import { Footer } from './landing/Footer';

export default function LandingPage() {
  useDocumentTitle('Home');

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen overflow-x-hidden bg-white font-sans text-slate-900">
        <Hero />
        <Intro />
        <Portals />
        <Steps />
        <Footer />
      </div>
    </MotionConfig>
  );
}

import Features from '../components/landing/Features.jsx';
import Hero from '../components/landing/Hero.jsx';
import HowItWorks from '../components/landing/HowItWorks.jsx';
import QuickActions from '../components/landing/QuickActions.jsx';
import SiteHeader from '../components/landing/SiteHeader.jsx';

/** Public home page: what SafeCampus is, and quick ways in. */
export default function Landing() {
  return (
    <div className="min-h-dvh bg-white">
      <SiteHeader />
      <main>
        <Hero>
          <QuickActions />
        </Hero>
        <HowItWorks />
        <Features />
      </main>
    </div>
  );
}

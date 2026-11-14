import Hero from '../components/landing/Hero.jsx';
import SiteHeader from '../components/landing/SiteHeader.jsx';

/** Public home page: what SafeCampus is, and quick ways in. */
export default function Landing() {
  return (
    <div className="min-h-dvh bg-white">
      <SiteHeader />
      <main>
        <Hero />
      </main>
    </div>
  );
}

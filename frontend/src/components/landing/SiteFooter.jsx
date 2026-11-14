import { Link } from 'react-router';
import Logo from '../Logo.jsx';

const LINKS = [
  { to: '/report', label: 'Report' },
  { to: '/map', label: 'Safety map' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/sos', label: 'SOS' },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <Logo />
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            A community-based reporting and monitoring tool for women’s safety on campus.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-slate-600">
          {LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="hover:text-slate-900">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <p className="border-t border-slate-100 px-4 py-5 text-center text-xs text-slate-500">
        In danger right now? Call <a href="tel:112" className="font-semibold text-slate-700">112</a> or the women
        helpline <a href="tel:181" className="font-semibold text-slate-700">181</a>.
      </p>
    </footer>
  );
}

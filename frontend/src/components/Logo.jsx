import { Link } from 'react-router';
import Icon from './Icon.jsx';

/**
 * SafeCampus mark + wordmark, linking home. Text colour follows the parent.
 * @param {{ className?: string }} props
 */
export default function Logo({ className = '' }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 rounded-lg text-inherit no-underline ${className}`} aria-label="SafeCampus home">
      <span className="grid size-8 place-items-center rounded-[10px] bg-brand-600 text-white shadow-sm shadow-brand-900/30">
        <Icon name="shield-check" size={18} strokeWidth={2.4} />
      </span>
      <span className="font-display text-[17px] font-extrabold tracking-tight">SafeCampus</span>
    </Link>
  );
}

import { ICON_PATHS } from '../data/iconPaths.js';

/**
 * Line icon from the in-house set in data/iconPaths.js. Sized by font size
 * (1em) unless `size` or a size class is given; colour follows the text.
 *
 * @param {{ name: keyof ICON_PATHS, size?: number|string, strokeWidth?: number, className?: string, style?: object, label?: string }} props
 *   `label` makes the icon meaningful to screen readers; without it the icon is decorative.
 */
export default function Icon({ name, size = '1em', strokeWidth = 2, className, style, label }) {
  const shapes = ICON_PATHS[name];
  if (!shapes) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : 'true'}
      focusable="false"
    >
      {shapes.map((shape, i) => {
        if (typeof shape === 'string') return <path key={i} d={shape} />;
        if (shape.circle) {
          const [cx, cy, r] = shape.circle;
          return <circle key={i} cx={cx} cy={cy} r={r} />;
        }
        const [x, y, width, height, rx] = shape.rect;
        return <rect key={i} x={x} y={y} width={width} height={height} rx={rx} />;
      })}
    </svg>
  );
}

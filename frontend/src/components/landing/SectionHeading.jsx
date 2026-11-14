/** Centred eyebrow + title + intro used by each landing section. */
export default function SectionHeading({ eyebrow, title, children }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-bold tracking-wide text-brand-300 uppercase">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">{title}</h2>
      {children && <p className="mt-4 text-base leading-relaxed text-pretty text-slate-300">{children}</p>}
    </div>
  );
}

export default function SectionIntro({
  id,
  eyebrow,
  title,
  lede,
}: Readonly<{
  id: string;
  eyebrow: string;
  title: string;
  lede?: string;
}>) {
  return (
    <div className="mb-8 max-w-2xl md:mb-10">
      <p className="t-id mb-3 text-teal">{eyebrow.toUpperCase()}</p>
      <h2 id={id} className="t-h2 text-ink">
        {title}
      </h2>
      {lede && <p className="mt-3 text-[15px] text-soft">{lede}</p>}
    </div>
  );
}

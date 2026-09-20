/**
 * AFTER: calm dental — soft sage + Georgia (NOT Maximus mocha/NHG).
 */
export default function NorthlineAfter() {
  return (
    <div
      className="min-h-screen bg-[#f4f7f5] text-[#1c2b24]"
      style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
    >
      <header className="border-b border-[#1c2b24]/10 bg-[#f4f7f5]/95">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <div>
            <p className="m-0 text-[17px] font-normal tracking-tight">Northline</p>
            <p
              className="m-0 text-[11px] uppercase tracking-[0.18em] text-[#1c2b24]/45"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              Dental studio
            </p>
          </div>
          <a
            href="#visit"
            className="rounded-full bg-[#2f6f5e] px-4 py-2.5 text-[13px] text-white no-underline"
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            Book a visit
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-5 py-20 text-center">
        <p
          className="m-0 text-[11px] font-medium uppercase tracking-[0.2em] text-[#2f6f5e]"
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
          Quiet care
        </p>
        <h1 className="mt-4 m-0 text-[clamp(2.4rem,6vw,3.8rem)] font-normal leading-[1.1]">
          A softer way to sit in the chair.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-[17px] leading-relaxed text-[#1c2b24]/60">
          One booking path. Honest timelines. Rooms that stay calm.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3" style={{ fontFamily: 'system-ui, sans-serif' }}>
          <a href="#visit" className="rounded-full bg-[#1c2b24] px-6 py-3 text-[14px] text-white no-underline">
            Schedule
          </a>
          <a
            href="tel:+1555019900"
            className="rounded-full border border-[#1c2b24]/15 bg-white px-6 py-3 text-[14px] no-underline"
          >
            (555) 019-9000
          </a>
        </div>
      </section>

      <section className="px-5">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[28px]">
          <img
            src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1200&q=70"
            alt=""
            className="aspect-[21/9] w-full object-cover"
          />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ['Preventive', 'Cleanings that respect your time.'],
            ['Restorative', 'Explained in plain words.'],
            ['Cosmetic', 'Only when you ask for it.'],
          ].map(([t, b]) => (
            <div key={t} className="rounded-2xl border border-[#1c2b24]/10 bg-white p-6">
              <h3 className="m-0 text-[20px] font-normal">{t}</h3>
              <p className="mt-2 m-0 text-[15px] leading-relaxed text-[#1c2b24]/55">{b}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="visit" className="border-t border-[#1c2b24]/10 bg-white px-5 py-14 text-center">
        <h2 className="m-0 text-[28px] font-normal">New patient visit</h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] text-[#1c2b24]/55">
          Pick a time. We confirm by text.
        </p>
        <a
          href="#_"
          className="mt-6 inline-block rounded-full bg-[#2f6f5e] px-7 py-3.5 text-[14px] text-white no-underline"
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
          Open calendar
        </a>
      </section>

      <footer className="px-5 py-8 text-center text-[12px] text-[#1c2b24]/35">
        Northline Dental · Mock for Maximus Reach showcase
      </footer>
    </div>
  )
}

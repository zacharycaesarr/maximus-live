/**
 * BEFORE: crowded dental template — busy colors, carousel energy, weak trust.
 */
export default function NorthlineBefore() {
  return (
    <div className="min-h-screen bg-white font-[Verdana,Geneva,sans-serif] text-[#333]">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#00a3e0] px-3 py-2 text-[12px] text-white">
        <span>New patients welcome!!! Insurance accepted · Ask about Invisalign</span>
        <span className="font-bold">CALL 555-0199 NOW</span>
      </div>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ddd] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded bg-[#00a3e0] text-center text-[11px] font-bold leading-10 text-white">
            ND
          </div>
          <div>
            <p className="m-0 text-[16px] font-bold text-[#00a3e0]">Northline Family Dental</p>
            <p className="m-0 text-[10px] text-[#888]">Smiles are our business :)</p>
          </div>
        </div>
        <nav className="flex flex-wrap gap-3 text-[12px]">
          {['Home', 'Meet the Team', 'Services', 'Cosmetic', 'Kids', 'Forms', 'Blog', 'Contact'].map((l) => (
            <a key={l} href="#_" className="font-bold text-[#00a3e0] no-underline hover:underline">
              {l}
            </a>
          ))}
        </nav>
      </header>

      <div className="relative bg-[#e6f7fc] px-4 py-10 text-center">
        <p className="m-0 text-[12px] font-bold uppercase tracking-wide text-[#00a3e0]">
          *** Patient of the month: Karen ***
        </p>
        <h1 className="mt-2 m-0 text-[26px] font-bold text-[#005f87] md:text-[34px]">
          Your Smile Is Our Priority!!!!!!!!!!
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-[13px] leading-relaxed">
          We offer cleanings, fillings, whitening, crowns, implants, braces consults, emergency
          visits, and more. Scroll for 12 different buttons. Mobile layout not guaranteed.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {['Book Online', 'Meet Dr. Smith', 'Watch Video', 'Patient Forms', 'Coupons'].map((b) => (
            <a
              key={b}
              href="#_"
              className="rounded bg-[#ff6b35] px-3 py-2 text-[12px] font-bold text-white no-underline shadow"
            >
              {b}
            </a>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {['Cleanings', 'Whitening', 'Implants', 'Kids Care', 'Emergency', 'Invisalign', 'Veneers', 'TMJ'].map(
            (s) => (
              <a
                key={s}
                href="#_"
                className="rounded border-2 border-[#00a3e0] bg-[#f0fbff] p-4 text-center text-[13px] font-bold text-[#005f87] no-underline"
              >
                {s} »
              </a>
            ),
          )}
        </div>

        <section className="mt-6 grid gap-4 border border-[#ddd] bg-[#fafafa] p-4 md:grid-cols-2">
          <div>
            <h2 className="m-0 text-[18px] font-bold text-[#005f87]">About Our Practice</h2>
            <p className="mt-2 text-[13px] leading-relaxed">
              Dr. Smith has been practicing dentistry for over 20 years. We use the latest
              technology. Our office has a fish tank in the lobby. Please arrive 15 minutes early
              and bring your insurance card and a list of medications. We are closed on major
              holidays. Like us on Facebook!
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=700&q=60"
            alt=""
            className="h-48 w-full rounded border border-[#ccc] object-cover"
          />
        </section>

        <section className="mt-4 border border-[#ddd] p-4">
          <h2 className="m-0 text-[18px] font-bold text-[#005f87]">Testimonials</h2>
          <p className="mt-2 text-[13px] italic text-[#555]">
            &ldquo;Great dentist!!!!&rdquo; — Anonymous
          </p>
          <p className="mt-1 text-[13px] italic text-[#555]">
            &ldquo;The staff is nice and the office is clean.&rdquo; — Patient
          </p>
        </section>
      </main>

      <footer className="bg-[#005f87] px-4 py-5 text-center text-[11px] text-white/80">
        © Northline Family Dental · Powered by GenericDentistTheme v3 ·{' '}
        <a href="#_" className="text-white underline">
          HIPAA
        </a>
      </footer>
    </div>
  )
}

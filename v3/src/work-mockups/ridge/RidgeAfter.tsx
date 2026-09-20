/**
 * AFTER: premium plumber — cool industrial slate (NOT Maximus mocha/NHG).
 */
export default function RidgeAfter() {
  return (
    <div
      className="min-h-screen bg-[#0f1419] text-[#e8eef4]"
      style={{ fontFamily: 'ui-sans-serif, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
    >
      <header className="border-b border-white/10 bg-[#0f1419]/95">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <p className="m-0 text-[15px] font-bold tracking-wide text-[#7dd3fc]">RIDGE</p>
          <nav className="hidden gap-5 text-[13px] text-white/55 md:flex">
            <a href="#services" className="no-underline hover:text-white">
              Services
            </a>
            <a href="#book" className="no-underline hover:text-white">
              Book
            </a>
          </nav>
          <a
            href="#book"
            className="rounded-md bg-[#38bdf8] px-4 py-2 text-[13px] font-semibold text-[#0f1419] no-underline"
          >
            Book visit
          </a>
        </div>
      </header>

      <section className="mx-auto grid max-w-5xl gap-10 px-5 py-16 md:grid-cols-2 md:items-center">
        <div>
          <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#38bdf8]">
            Same-day · licensed
          </p>
          <h1 className="mt-3 m-0 text-[clamp(2.2rem,5vw,3.5rem)] font-extrabold leading-[1.05] tracking-tight text-white">
            Plumbing that answers the phone.
          </h1>
          <p className="mt-4 max-w-md text-[16px] leading-relaxed text-white/55">
            Clear windows. Straight pricing ranges. A crew that texts when they leave the shop.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#book"
              className="rounded-md bg-white px-5 py-3 text-[14px] font-semibold text-[#0f1419] no-underline"
            >
              Get a slot
            </a>
            <a
              href="tel:+15550138842"
              className="rounded-md border border-white/20 px-5 py-3 text-[14px] no-underline"
            >
              (555) 013-8842
            </a>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=900&q=70"
          alt=""
          className="aspect-[4/3] w-full rounded-lg object-cover"
        />
      </section>

      <section id="services" className="border-t border-white/10 bg-[#151b22] px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="m-0 text-2xl font-bold text-white">Services</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ['Drains', 'Camera + clear. Flat ranges before we start.'],
              ['Heaters', 'Tank and tankless install and flush.'],
              ['Fixtures', 'Kitchen and bath installs done clean.'],
            ].map(([t, b]) => (
              <div key={t} className="rounded-lg border border-white/10 bg-[#0f1419] p-5">
                <h3 className="m-0 text-[16px] font-bold text-[#7dd3fc]">{t}</h3>
                <p className="mt-2 m-0 text-[14px] text-white/50">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="book" className="px-5 py-16">
        <div className="mx-auto max-w-md rounded-lg border border-white/10 bg-[#151b22] p-6">
          <h2 className="m-0 text-xl font-bold text-white">Request a visit</h2>
          <form className="mt-5 space-y-3" onSubmit={(e) => e.preventDefault()}>
            <input
              className="w-full rounded-md border border-white/15 bg-[#0f1419] px-3 py-2.5 text-sm text-white"
              placeholder="Name"
            />
            <input
              className="w-full rounded-md border border-white/15 bg-[#0f1419] px-3 py-2.5 text-sm text-white"
              placeholder="Phone"
            />
            <button type="submit" className="w-full rounded-md bg-[#38bdf8] py-3 text-sm font-bold text-[#0f1419]">
              Send
            </button>
          </form>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-6 text-center text-[11px] text-white/35">
        Ridge Plumbing · Mock for Maximus Reach showcase
      </footer>
    </div>
  )
}

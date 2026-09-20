/**
 * BEFORE: believable dated local plumber site.
 * Cluttered nav, blue links, stock energy, weak hierarchy, Arial-ish stack.
 */
export default function RidgeBefore() {
  return (
    <div className="min-h-screen bg-[#e8e8e8] font-[Arial,Helvetica,sans-serif] text-[#222]">
      <div className="bg-[#003399] px-3 py-1.5 text-center text-[12px] text-white">
        Call now!!! 555-013-8842 · Same day service · Serving the metro since 1998
      </div>
      <header className="flex flex-wrap items-center justify-between gap-2 border-b-4 border-[#ff6600] bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#003399] text-[10px] font-bold text-white">
            RP
          </div>
          <div>
            <p className="m-0 text-[18px] font-bold text-[#003399]">Ridge Plumbing Co.</p>
            <p className="m-0 text-[11px] text-[#666]">Your #1 plumber!!!</p>
          </div>
        </div>
        <nav className="flex flex-wrap gap-x-3 gap-y-1 text-[13px]">
          {['Home', 'About Us', 'Services', 'Testimonials', 'Gallery', 'Contact', 'FAQ', 'Blog'].map((l) => (
            <a key={l} href="#_" className="text-[#0000ee] underline">
              {l}
            </a>
          ))}
        </nav>
      </header>

      <div className="bg-[#cce0ff] px-4 py-8 text-center">
        <h1 className="m-0 text-[28px] font-bold text-[#003399] md:text-[36px]">
          WELCOME TO OUR WEBSITE
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-[14px] leading-relaxed text-[#333]">
          We do plumbing. Toilets. Sinks. Water heaters. Drains. Click below or call. We have been
          in business a long time and our customers love us. See our long list of services on this
          page and also on other pages. Thank you for visiting.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <a
            href="#_"
            className="rounded border border-[#000] bg-[#ff6600] px-4 py-2 text-[14px] font-bold text-white"
          >
            CLICK HERE
          </a>
          <a href="#_" className="rounded border border-[#003399] bg-white px-4 py-2 text-[14px] text-[#003399]">
            Email us
          </a>
        </div>
      </div>

      <main className="mx-auto grid max-w-5xl gap-4 px-4 py-6 md:grid-cols-[1fr_220px]">
        <div className="space-y-4">
          <section className="border border-[#999] bg-white p-4">
            <h2 className="m-0 border-b border-[#ccc] pb-2 text-[18px] font-bold text-[#003399]">
              Our Services
            </h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-[13px] leading-relaxed">
              <li>Emergency plumbing (nights and weekends sometimes)</li>
              <li>Drain cleaning / snaking / hydro jetting (ask for prices)</li>
              <li>Water heater install and repair (tank and tankless)</li>
              <li>Fixture installs · remodeled bathrooms · commercial too</li>
              <li>And much much more!!! See About page for history of the company</li>
            </ul>
          </section>
          <section className="border border-[#999] bg-white p-4">
            <h2 className="m-0 text-[18px] font-bold text-[#003399]">Why Choose Us???</h2>
            <p className="mt-2 text-[13px] leading-relaxed">
              Licensed · Bonded · Insured · Family owned · We show up on time (usually) · Free
              estimates on most jobs · Financing available through third party · Check out our
              Yahoo! reviews. Scroll down for a form that may or may not work on your phone.
            </p>
            <img
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=60"
              alt=""
              className="mt-3 h-40 w-full border border-[#ccc] object-cover"
            />
            <p className="mt-1 text-center text-[11px] text-[#888]">Photo: stock plumber</p>
          </section>
        </div>
        <aside className="space-y-3">
          <div className="border border-[#999] bg-[#fff8e7] p-3 text-[12px]">
            <p className="m-0 font-bold text-[#003399]">Special!!!</p>
            <p className="mt-1 m-0">$50 off first drain cleaning. Mention website. Expires whenever.</p>
          </div>
          <div className="border border-[#999] bg-white p-3 text-[12px]">
            <p className="m-0 font-bold">Quick links</p>
            <p className="mt-2 m-0">
              <a href="#_" className="text-[#0000ee] underline">
                Coupon PDF
              </a>
            </p>
            <p className="m-0">
              <a href="#_" className="text-[#0000ee] underline">
                Sitemap
              </a>
            </p>
            <p className="m-0">
              <a href="#_" className="text-[#0000ee] underline">
                Webmaster login
              </a>
            </p>
          </div>
          <form className="border border-[#999] bg-white p-3 text-[12px]">
            <p className="m-0 mb-2 font-bold">Contact form</p>
            <input className="mb-2 w-full border border-[#999] px-2 py-1" placeholder="Name" />
            <input className="mb-2 w-full border border-[#999] px-2 py-1" placeholder="Phone" />
            <textarea className="mb-2 w-full border border-[#999] px-2 py-1" rows={3} placeholder="Message" />
            <button type="button" className="w-full bg-[#003399] py-1.5 text-white">
              Submit
            </button>
          </form>
        </aside>
      </main>

      <footer className="bg-[#333] px-4 py-4 text-center text-[11px] text-[#ccc]">
        Copyright 2012 Ridge Plumbing · Best viewed in Internet Explorer ·{' '}
        <a href="#_" className="text-[#9cf] underline">
          Privacy
        </a>
      </footer>
    </div>
  )
}

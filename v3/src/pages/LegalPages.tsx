import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import DirectNav from '@/components/nav/DirectNav'
import SmoothScroll from '@/components/SmoothScroll'
import SiteFooter from '@/components/sections/SiteFooter'
import { NavTunerProvider } from '@/context/NavTunerContext'
import { LenisTunerProvider } from '@/context/LenisTunerContext'
import { FooterTunerProvider } from '@/context/FooterTunerContext'
import { useCreateStore } from 'leva'
import { BrandInline } from '@/components/brand/BrandInline'
import { cn } from '@/lib/utils'

const titleGradient =
  'bg-gradient-to-br from-[#1a1612] via-[#2C2520] to-[#6b5a4a] bg-clip-text text-transparent'

function LegalShell({
  title,
  updated,
  children,
}: {
  title: string
  updated: string
  children: ReactNode
}) {
  const store = useCreateStore()
  useEffect(() => {
    document.title = `${title} · Maximus Reach`
  }, [title])

  return (
    <LenisTunerProvider store={store}>
      <NavTunerProvider store={store}>
        <FooterTunerProvider store={store}>
          <SmoothScroll>
            <div className="min-h-screen bg-[#f7f7f5]">
              <DirectNav />
              <main className="mx-auto max-w-2xl px-6 pb-20 pt-28 md:pt-36">
                <p className="mb-3">
                  <BrandInline className="text-[13px] text-espresso/50" />
                </p>
                <h1 className={cn('m-0 font-nhg text-[clamp(1.85rem,4vw,2.75rem)] font-semibold tracking-tight', titleGradient)}>
                  {title}
                </h1>
                <p className="mt-2 font-nhg text-[12px] uppercase tracking-[0.12em] text-espresso/35">
                  Last updated {updated}
                </p>
                <div className="mt-10 space-y-8 font-nhg text-[15px] leading-relaxed text-espresso/70 [&_h2]:m-0 [&_h2]:mb-2 [&_h2]:font-nhg [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-espresso [&_p]:m-0">
                  {children}
                </div>
                <p className="mt-12 font-nhg text-sm text-espresso/45">
                  Questions?{' '}
                  <a href="mailto:hello@maximusreach.com" className="text-espresso underline decoration-[#c4a574]/50">
                    hello@maximusreach.com
                  </a>
                  {' · '}
                  <Link to="/start" className="text-espresso underline decoration-[#c4a574]/50">
                    Start
                  </Link>
                </p>
              </main>
              <SiteFooter />
            </div>
          </SmoothScroll>
        </FooterTunerProvider>
      </NavTunerProvider>
    </LenisTunerProvider>
  )
}

export function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" updated="September 15, 2026">
      <section>
        <h2>Who we are</h2>
        <p>
          Maximus Reach (also referred to as Maximus Marketing) provides web development, advertising, and digital
          growth services from Staunton, Virginia. This policy explains what we collect when you use maximusreach.com,
          the client portal, or contact us.
        </p>
      </section>
      <section>
        <h2>What we collect</h2>
        <p>
          Contact details you send us (name, email, phone, business info). Booking details when you schedule a call
          through Cal.com. Account and project data if you use the Client Portal. Basic site analytics (pages viewed,
          device type) to keep the site working well. Payment-related info is handled by our processors (for example
          Stripe) when invoices are paid. We do not sell your personal information.
        </p>
      </section>
      <section>
        <h2>How we use it</h2>
        <p>
          To reply to inquiries, deliver services under a signed agreement, run and improve the website and portal,
          send project updates you expect, and meet legal or accounting needs. Client credentials and business data
          shared for project work are treated as confidential under our Client Services Agreement.
        </p>
      </section>
      <section>
        <h2>Sharing</h2>
        <p>
          We use trusted tools to operate (hosting, email, booking, payments, analytics). Those providers only get what
          they need to do their job. We may disclose information if required by law. We do not sell lists or rent your
          data for ads.
        </p>
      </section>
      <section>
        <h2>Retention and security</h2>
        <p>
          We keep project and account records as long as needed for the work, warranties, and legal requirements, then
          delete or anonymize when practical. We use reasonable technical and organizational safeguards. No method of
          transmission is 100% secure.
        </p>
      </section>
      <section>
        <h2>Your choices</h2>
        <p>
          Email hello@maximusreach.com to ask for a copy, correction, or deletion of personal data we hold, or to
          close a portal account. Some records may be retained when we are legally required to keep them.
        </p>
      </section>
      <section>
        <h2>Children</h2>
        <p>Our services are for businesses and adults. We do not knowingly collect data from children under 13.</p>
      </section>
      <section>
        <h2>Changes</h2>
        <p>
          We may update this page. The date at the top will change when we do. Continued use of the site after updates
          means you accept the revised policy.
        </p>
      </section>
    </LegalShell>
  )
}

export function TermsPage() {
  return (
    <LegalShell title="Terms of Service" updated="September 15, 2026">
      <section>
        <h2>Agreement</h2>
        <p>
          By using this website, booking a call, or engaging Maximus Reach for services, you agree to these terms. Paid
          project work is also governed by a signed Client Services Agreement / Statement of Work. If those conflict,
          the signed agreement controls for that project.
        </p>
      </section>
      <section>
        <h2>Services</h2>
        <p>
          We provide web development, ad management, creative, and related digital growth work as scoped in writing.
          Timelines, deliverables, and fees are defined in your quote or SOW. Results (traffic, leads, revenue) depend
          on many factors outside our sole control; we do not guarantee specific ROAS or lead counts unless expressly
          written.
        </p>
      </section>
      <section>
        <h2>Client responsibilities</h2>
        <p>
          You agree to provide timely access, assets, feedback, and truthful information needed to do the work. Delays
          on your side can shift timelines. You are responsible for the legality of your products, claims, and ad
          content we publish at your direction.
        </p>
      </section>
      <section>
        <h2>Fees and payment</h2>
        <p>
          Fees, deposits, and schedules are set in your quote or invoice. Late or missing payment may pause work. Unless
          stated otherwise in writing, deposits are non-refundable once work has started.
        </p>
      </section>
      <section>
        <h2>Intellectual property</h2>
        <p>
          Upon full payment, you own the final deliverables created specifically for you, as described in your
          agreement. We retain rights to our pre-existing tools, frameworks, and portfolio use of non-confidential
          work samples unless you opt out in writing. Third-party licenses (fonts, stock, platforms) remain with their
          owners.
        </p>
      </section>
      <section>
        <h2>Confidentiality</h2>
        <p>
          Both parties will keep non-public business information confidential, except when disclosure is required by
          law or needed to perform the services through vetted vendors under similar duties.
        </p>
      </section>
      <section>
        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent allowed by law, Maximus Reach is not liable for indirect, incidental, or consequential
          damages. Total liability for a claim related to a project is limited to the fees you paid us for that project
          in the three months before the claim, except where law forbids that limit.
        </p>
      </section>
      <section>
        <h2>Termination</h2>
        <p>
          Either party may end an ongoing engagement with written notice as stated in the Client Services Agreement
          (typically 30 days). You remain responsible for fees for work performed and non-cancelable costs already
          incurred.
        </p>
      </section>
      <section>
        <h2>Site use</h2>
        <p>
          Do not misuse the site or portal (scraping, attacking, unauthorized access). We may suspend access that
          harms the service or other clients.
        </p>
      </section>
      <section>
        <h2>Governing law</h2>
        <p>
          These terms are governed by the laws of the Commonwealth of Virginia, without regard to conflict-of-law
          rules. Venue for disputes is in courts located in Virginia unless your signed agreement says otherwise.
        </p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>
          Maximus Reach · Staunton, VA · hello@maximusreach.com · (540) 416-2983
        </p>
      </section>
    </LegalShell>
  )
}

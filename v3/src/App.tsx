import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LevaPanel, useCreateStore } from 'leva'
import DirectNav from '@/components/nav/DirectNav'
import DirectHero from '@/components/hero/DirectHero'
import BrandPreloader from '@/components/hero/BrandPreloader'
import ApertureIntro from '@/components/hero/ApertureIntro'
import PageSections from '@/components/sections/PageSections'
import SmoothScroll from '@/components/SmoothScroll'
import ScrollToTop from '@/components/ScrollToTop'
import AboutPage from '@/pages/AboutPage'
import StartPage from '@/pages/StartPage'
import WorkMockPage from '@/pages/WorkMockPage'
import WebDevelopmentPage from '@/pages/WebDevelopmentPage'
import AdManagementPage from '@/pages/AdManagementPage'
import CreativeStudioPage from '@/pages/CreativeStudioPage'
import { PrivacyPage, TermsPage } from '@/pages/LegalPages'
import PortalLayout from '@/portal/PortalLayout'
import PortalIndex from '@/portal/pages/PortalIndex'
import LoginPage from '@/portal/pages/LoginPage'
import DashboardPage from '@/portal/pages/DashboardPage'
import AdminPage from '@/portal/pages/AdminPage'
import AuthCallbackPage from '@/portal/pages/AuthCallbackPage'
import { PortalAuthProvider } from '@/portal/auth/AuthContext'
import { RequireAuth, RequireAdmin } from '@/portal/auth/RequireAuth'
import { HeroTextTunerProvider } from '@/context/HeroTextTunerContext'
import { ReachTunerProvider } from '@/context/ReachTunerContext'
import { NavTunerProvider } from '@/context/NavTunerContext'
import { HeroLayoutTunerProvider } from '@/context/HeroLayoutTunerContext'
import { BgTunerProvider } from '@/context/BgTunerContext'
import { LenisTunerProvider } from '@/context/LenisTunerContext'
import { GetStartedHoverProvider } from '@/context/GetStartedHoverContext'
import { ProofTunerProvider } from '@/context/ProofTunerContext'
import { IntroTunerProvider } from '@/context/IntroTunerContext'
import { LayoutModeProvider } from '@/context/LayoutModeContext'
import { FaqTunerProvider } from '@/context/FaqTunerContext'
import { HowItWorksTunerProvider } from '@/context/HowItWorksTunerContext'
import { FooterTunerProvider } from '@/context/FooterTunerContext'
import { PageScrollBgTunerProvider } from '@/context/PageScrollBgTunerContext'
import { HomeColorsTunerProvider } from '@/context/HomeColorsTunerContext'
import { ServicesOverviewTunerProvider } from '@/context/ServicesOverviewTunerContext'
import { HomeLevaStoreProvider } from '@/context/HomeLevaStoreContext'
import HomePageShell from '@/components/HomePageShell'
import TubelightNav from '@/components/nav/TubelightNav'

function HomePage() {
  const store = useCreateStore()
  const isDev = import.meta.env.DEV
  const [panelCollapsed, setPanelCollapsed] = useState(true)
  const [panelMountKey, setPanelMountKey] = useState(0)

  useEffect(() => {
    document.documentElement.setAttribute('data-home', '1')
    return () => document.documentElement.removeAttribute('data-home')
  }, [])

  useEffect(() => {
    document.title = 'Maximus Reach · V3'
    const obsolete = [
      'mr-v3-hero-text-tuner-v13',
      'mr-v3-hero-text-tuner-v14',
      'mr-v3-hero-text-tuner-v15',
      'mr-v3-hero-text-tuner-v16',
      'mr-v3-hero-text-tuner-v17',
      'mr-v3-hero-text-tuner-v18',
      'mr-v3-hero-text-tuner-v20',
      'mr-v3-hero-text-tuner-v21',
      'mr-v3-hero-text-tuner-v22',
      'mr-v3-hero-text-tuner-v23',
      'mr-v3-hero-text-tuner-v25',
      'mr-v3-hero-layout-v5',
      'mr-v3-hero-layout-v6',
      'mr-v3-hero-layout-v7',
      'mr-v3-hero-layout-v8',
      'mr-v3-hero-layout-v9',
      'mr-v3-hero-layout-v10',
      'mr-v3-hero-layout-v11',
      'mr-v3-hero-layout-v12',
      'mr-v3-hero-layout-v13',
      'mr-v3-hero-layout-v16',
      'mr-v3-hero-layout-v17',
      'mr-v3-hero-layout-v21',
      'mr-v3-hero-layout-v22',
      'mr-v3-nav-tuner-v5',
      'mr-v3-bg-tuner-v5',
      'mr-v3-proof-fan-v1',
      'mr-v3-proof-fan-v2',
      'mr-v3-how-it-works-v1',
      'mr-v3-how-it-works-v2',
      'mr-v3-how-it-works-v3',
      'mr-v3-how-it-works-v4',
      'mr-hero-text-tuner-v1',
      'mr-how-it-works-v3',
      'mr-v3-intro-tuner-v2',
      'mr-v3-intro-tuner-v3',
      'mr-v3-page-scroll-bg-v1',
      'mr-v3-page-scroll-bg-v2',
      'mr-v3-page-scroll-bg-v3',
      'mr-v3-page-scroll-bg-v4',
      'mr-v3-home-colors-v1',
    ]
    obsolete.forEach((k) => {
      try {
        localStorage.removeItem(k)
        localStorage.removeItem(`${k}:remember`)
      } catch {
        /* ignore */
      }
    })
    // Strip sticky preloader preview if an older session left it on
    try {
      const raw = localStorage.getItem('mr-v3-intro-tuner-v3')
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, unknown>
        if (parsed.preview) {
          localStorage.setItem('mr-v3-intro-tuner-v3', JSON.stringify({ ...parsed, preview: false }))
        }
      }
    } catch {
      /* ignore */
    }
  }, [])

  return (
    <LayoutModeProvider store={store}>
      <BgTunerProvider store={store}>
        <LenisTunerProvider store={store}>
          <NavTunerProvider store={store}>
            <ReachTunerProvider store={store}>
              <HeroLayoutTunerProvider store={store}>
                <HeroTextTunerProvider store={store}>
                  <ProofTunerProvider store={store}>
                    <IntroTunerProvider store={store}>
                        <HowItWorksTunerProvider store={store}>
                          <FaqTunerProvider store={store}>
                            <FooterTunerProvider store={store}>
                            <PageScrollBgTunerProvider store={store}>
                            <HomeColorsTunerProvider store={store}>
                            <ServicesOverviewTunerProvider store={store}>
                            <HomeLevaStoreProvider store={store}>
                            <GetStartedHoverProvider>
                              <SmoothScroll>
                                <ApertureIntro />
                                <HomePageShell>
                                  <div id="top" className="relative min-h-screen">
                                    <BrandPreloader />
                                    <DirectNav overlay />
                                    <DirectHero />
                                    <PageSections />
                                  </div>
                                </HomePageShell>
                              </SmoothScroll>
                              {isDev && (
                                <div
                                  data-lenis-prevent
                                  className="mr-v3-leva-host"
                                  onWheel={(e) => e.stopPropagation()}
                                >
                                  <LevaPanel
                                    key={panelMountKey}
                                    store={store}
                                    collapsed={{
                                      collapsed: panelCollapsed,
                                      onChange: (c) => {
                                        setPanelCollapsed(c)
                                        if (!c) setPanelMountKey((k) => k + 1)
                                      },
                                    }}
                                    titleBar={{ title: 'Maximus · V3', filter: false }}
                                    oneLineLabels
                                  />
                                </div>
                              )}
                            </GetStartedHoverProvider>
                            </HomeLevaStoreProvider>
                            </ServicesOverviewTunerProvider>
                            </HomeColorsTunerProvider>
                            </PageScrollBgTunerProvider>
                            </FooterTunerProvider>
                          </FaqTunerProvider>
                        </HowItWorksTunerProvider>
                    </IntroTunerProvider>
                  </ProofTunerProvider>
                </HeroTextTunerProvider>
              </HeroLayoutTunerProvider>
            </ReachTunerProvider>
          </NavTunerProvider>
        </LenisTunerProvider>
      </BgTunerProvider>
    </LayoutModeProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      {/* Mobile-only bottom nav — md:hidden inside component */}
      <TubelightNav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/start" element={<StartPage />} />
        <Route path="/capabilities/web-development" element={<WebDevelopmentPage />} />
        <Route path="/capabilities/ad-management" element={<AdManagementPage />} />
        <Route path="/capabilities/creative-studio" element={<CreativeStudioPage />} />
        <Route path="/work" element={<Navigate to="/capabilities/web-development" replace />} />
        <Route path="/work/mock/:slug/:version" element={<WorkMockPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route
          path="/portal"
          element={
            <PortalAuthProvider>
              <PortalLayout />
            </PortalAuthProvider>
          }
        >
          <Route index element={<PortalIndex />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="auth/callback" element={<AuthCallbackPage />} />
          <Route
            path="dashboard"
            element={
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            }
          />
          <Route
            path="admin"
            element={
              <RequireAuth>
                <RequireAdmin>
                  <AdminPage />
                </RequireAdmin>
              </RequireAuth>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

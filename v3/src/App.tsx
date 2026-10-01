import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import ScrollToTop from '@/components/ScrollToTop'
import HomeTubelightNav from '@/home/components/nav/TubelightNav'

const AboutPage = lazy(() => import('@/pages/AboutPage'))
const StartPage = lazy(() => import('@/pages/StartPage'))
const WorkMockPage = lazy(() => import('@/pages/WorkMockPage'))
const WebDevelopmentPage = lazy(() => import('@/pages/WebDevelopmentPage'))
const AdManagementPage = lazy(() => import('@/pages/AdManagementPage'))
const CreativeStudioPage = lazy(() => import('@/pages/CreativeStudioPage'))
const PrivacyPage = lazy(() => import('@/pages/LegalPages').then(m => ({ default: m.PrivacyPage })))
const TermsPage = lazy(() => import('@/pages/LegalPages').then(m => ({ default: m.TermsPage })))
const PortalRoutes = lazy(() => import('@/portal/PortalRoutes'))
const NonHomeNavigation = lazy(() => import('@/components/NonHomeNavigation'))

function AppRoutes() {
  const { pathname } = useLocation()
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={null}>
        {pathname === '/' ? <HomeTubelightNav /> : <NonHomeNavigation />}
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
        <Route path="/portal/*" element={<PortalRoutes />} />
      </Routes>
      </Suspense>
    </>
  )
}

export default function App() {
  return <BrowserRouter><AppRoutes /></BrowserRouter>
}

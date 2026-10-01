import { Routes, Route } from 'react-router-dom'
import PortalLayout from './PortalLayout'
import PortalIndex from './pages/PortalIndex'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import AdminPage from './pages/AdminPage'
import AuthCallbackPage from './pages/AuthCallbackPage'
import { PortalAuthProvider } from './auth/AuthContext'
import { RequireAuth, RequireAdmin } from './auth/RequireAuth'

/** Existing portal routes, deferred together so home does not initialize auth/payment code. */
export default function PortalRoutes() {
  return (
    <PortalAuthProvider>
      <Routes>
        <Route element={<PortalLayout />}>
          <Route index element={<PortalIndex />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="auth/callback" element={<AuthCallbackPage />} />
          <Route path="dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
          <Route path="admin" element={<RequireAuth><RequireAdmin><AdminPage /></RequireAdmin></RequireAuth>} />
        </Route>
      </Routes>
    </PortalAuthProvider>
  )
}

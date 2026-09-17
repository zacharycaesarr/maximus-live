export type PortalRole = 'client' | 'admin'

export type PortalProfile = {
  id: string
  email: string
  role: PortalRole
  full_name: string | null
  company_name: string | null
  last_login_at: string | null
  last_action: string | null
  last_action_at: string | null
}

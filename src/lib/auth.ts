const SESSION_KEY = 'rataplasma.user.v3'
const ADMIN_CODE = 'ADMINPLASMA'

export interface RataplasmaSession {
  name: string
  role: 'admin'
  createdAt: string
}

export function getSession(): RataplasmaSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as RataplasmaSession
    if (parsed.role !== 'admin' || !parsed.name) return null
    return parsed
  } catch {
    return null
  }
}

export function login(name: string, code: string): { ok: true; session: RataplasmaSession } | { ok: false; error: string } {
  if (code.trim().toUpperCase() !== ADMIN_CODE) {
    return { ok: false, error: 'Aquest codi no obre la porta de Rataplasma.' }
  }

  const session: RataplasmaSession = {
    name: name.trim() || 'Pau',
    role: 'admin',
    createdAt: new Date().toISOString(),
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return { ok: true, session }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

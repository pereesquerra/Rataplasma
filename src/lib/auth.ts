// Autenticació bàsica Fase 1 — guardada a localStorage
// Fase 2 migrarem a D1 amb codis d'invitació gestionats pel Pau

const KEY_USER = 'rataplasma.user'
const KEY_PENDING = 'rataplasma.pending-requests' // només per admin mock

// Codi d'administrador del Pau — substituir a producció per env var
// ⚠️ NOMÉS PER FASE 1 — Fase 2 ho mourem a D1 amb hash
export const ADMIN_CODE = 'PAU-RATA-2026'

// Codi d'invitació general inicial — substituir per codis personalitzats quan muntem D1
export const INVITATION_CODE = 'RATAPLASMA'

export interface User {
  nom: string
  isAdmin: boolean
  loggedAt: number
}

export function getUser(): User | null {
  try {
    const raw = localStorage.getItem(KEY_USER)
    if (!raw) return null
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

export function login(nom: string, codi: string): { ok: boolean; error?: string } {
  const trimmed = nom.trim()
  if (trimmed.length < 2) return { ok: false, error: 'El nom és massa curt' }
  if (trimmed.length > 20) return { ok: false, error: 'El nom és massa llarg' }

  const isAdmin = codi === ADMIN_CODE
  const validInvitation = codi === INVITATION_CODE

  if (!isAdmin && !validInvitation) {
    return { ok: false, error: 'Aquest codi no és vàlid' }
  }

  const user: User = {
    nom: trimmed,
    isAdmin,
    loggedAt: Date.now(),
  }
  localStorage.setItem(KEY_USER, JSON.stringify(user))
  return { ok: true }
}

export function logout(): void {
  localStorage.removeItem(KEY_USER)
}

// Mock admin — per Fase 1. Fase 2 això va a D1.
export interface PendingRequest {
  id: string
  nom: string
  requestedAt: number
}

export function getPendingRequests(): PendingRequest[] {
  try {
    const raw = localStorage.getItem(KEY_PENDING)
    if (!raw) return []
    return JSON.parse(raw) as PendingRequest[]
  } catch {
    return []
  }
}

export function addPendingRequest(nom: string): void {
  const list = getPendingRequests()
  list.push({ id: crypto.randomUUID(), nom, requestedAt: Date.now() })
  localStorage.setItem(KEY_PENDING, JSON.stringify(list))
}

export function approveRequest(id: string): PendingRequest | null {
  const list = getPendingRequests()
  const req = list.find(r => r.id === id)
  if (!req) return null
  localStorage.setItem(KEY_PENDING, JSON.stringify(list.filter(r => r.id !== id)))
  return req
}

export function rejectRequest(id: string): void {
  const list = getPendingRequests()
  localStorage.setItem(KEY_PENDING, JSON.stringify(list.filter(r => r.id !== id)))
}

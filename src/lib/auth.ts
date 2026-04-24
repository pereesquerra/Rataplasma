// Autenticació Fase 1.1 — només admin amb codi únic
// Versió nova del key per invalidar sessions anteriors guardades amb el codi vell

const KEY_USER = 'rataplasma.user.v2'  // canvi: v2 invalida totes les sessions antigues
const KEY_PENDING = 'rataplasma.pending-requests'

// Codi únic d'administrador. Cap altre codi val.
export const ADMIN_CODE = 'ADMINPLASMA'

export interface User {
  nom: string
  isAdmin: boolean
  loggedAt: number
}

export function getUser(): User | null {
  try {
    const raw = localStorage.getItem(KEY_USER)
    if (!raw) return null
    const u = JSON.parse(raw) as User
    // Sanity: només sessions admin són vàlides ara
    if (!u.isAdmin) {
      localStorage.removeItem(KEY_USER)
      return null
    }
    return u
  } catch {
    return null
  }
}

export function login(nom: string, codi: string): { ok: boolean; error?: string } {
  const trimmed = nom.trim()
  if (trimmed.length < 2) return { ok: false, error: 'El nom és massa curt' }
  if (trimmed.length > 20) return { ok: false, error: 'El nom és massa llarg' }

  if (codi !== ADMIN_CODE) {
    return { ok: false, error: 'Aquest codi no és vàlid' }
  }

  const user: User = {
    nom: trimmed,
    isAdmin: true,
    loggedAt: Date.now(),
  }
  localStorage.setItem(KEY_USER, JSON.stringify(user))
  return { ok: true }
}

export function logout(): void {
  localStorage.removeItem(KEY_USER)
  // Neteja també claus antigues per si l'iPhone té residus
  localStorage.removeItem('rataplasma.user')
}

// Sistema de convidats apagat de moment.
// Quan vulguis tornar a obrir-ho, edita aquestes funcions per acceptar peticions.

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

// Convidats DESACTIVAT — la funció existeix però no fa res al login
export function addPendingRequest(_nom: string): void {
  // intencional: no es guarda res, no s'accepten peticions noves
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

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import Mascot from '@/components/Mascot'
import {
  getPendingRequests,
  approveRequest,
  rejectRequest,
  PendingRequest,
  getUser,
} from '@/lib/auth'

export default function Admin() {
  const user = getUser()!
  const [peticions, setPeticions] = useState<PendingRequest[]>([])
  const [nomsAprovats, setNomsAprovats] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('rataplasma.aprovats') || '[]')
    } catch {
      return []
    }
  })

  function refresh() {
    setPeticions(getPendingRequests())
  }

  useEffect(() => {
    refresh()
    // Refresca cada 2 segons per veure peticions noves
    const interval = setInterval(refresh, 2000)
    return () => clearInterval(interval)
  }, [])

  function handleApprove(id: string) {
    const req = approveRequest(id)
    if (req) {
      const nous = [...nomsAprovats, req.nom]
      setNomsAprovats(nous)
      localStorage.setItem('rataplasma.aprovats', JSON.stringify(nous))
    }
    refresh()
  }

  function handleReject(id: string) {
    rejectRequest(id)
    refresh()
  }

  return (
    <div className="hb-page hb-paper min-h-screen flex flex-col">
      <header className="hb-header flex items-center justify-between gap-3">
        <Link
          to="/"
          className="hb-back"
        >
          ← tornar
        </Link>
        <div className="hb-title text-sm">
          PANEL ADMIN
        </div>
      </header>

      <div className="flex-1 px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Capçalera */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="hb-card flex items-center gap-4 p-4 bg-moonbeam/95"
          >
            <div className="w-20 h-20 rounded-full bg-ghost-blue/40 border-[3px] border-midnight">
              <Mascot size={80} />
            </div>
            <div>
              <div className="terminal-label">benvingut</div>
              <h1 className="hb-title text-2xl">
                REI {user.nom.toUpperCase()}
              </h1>
              <p className="font-terminal text-midnight/70">
                tu controles qui entra a rataplasma.com
              </p>
            </div>
          </motion.div>

          {/* Peticions pendents */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="terminal-label mb-3">
              pissarra de suro · peticions pendents ({peticions.length})
            </div>
            {peticions.length === 0 ? (
              <div className="hb-card relative text-center py-10 px-6 bg-[#c58d58] overflow-hidden">
                <div className="absolute inset-4 border-[2px] border-midnight/30" />
                <div className="relative mx-auto mb-4 w-24">
                  <Mascot size={96} />
                </div>
                <div className="relative hb-title text-2xl">
                  tot tranquil al món real
                </div>
                <div className="relative font-terminal text-midnight/70 mt-2">
                  Cap petició pendent. Quan algun amic demani entrar, el veuràs aquí.
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {peticions.map(req => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="hb-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#f7e7b0]"
                  >
                    <div>
                      <div className="hb-title text-lg">{req.nom}</div>
                      <div className="font-terminal text-midnight/60 text-sm">
                        vol entrar · {new Date(req.requestedAt).toLocaleString('ca-ES')}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="hb-button px-4 py-2 text-sm"
                      >
                        ✓ DEIXA'L
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        className="px-4 py-2 border-[3px] border-midnight bg-harvest text-moonbeam rounded-full font-pixel text-sm shadow-[3px_3px_0_var(--hb-midnight)]"
                      >
                        ✗ FORA
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>

          {/* Aprovats */}
          {nomsAprovats.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="terminal-label mb-3">
                fotos aprovades ({nomsAprovats.length})
              </div>
              <div className="hb-card flex flex-wrap gap-2 p-4 bg-[#c58d58]">
                {nomsAprovats.map((n, i) => (
                  <span
                    key={i}
                    className="inline-block px-3 py-1 bg-moonbeam border-[2px] border-midnight font-terminal text-midnight rotate-[-1deg]"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </motion.section>
          )}

          {/* Info Fase 1 */}
          <div className="font-terminal text-midnight/50 text-sm text-center border-t-[3px] border-midnight/20 pt-6">
            Fase 1 · l'aprovació de peticions és simbòlica (el codi ja els serveix).<br />
            A la Fase 2 migrarem a base de dades real amb codis únics per persona.
          </div>
        </div>
      </div>
    </div>
  )
}

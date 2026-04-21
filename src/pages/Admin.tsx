import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import Mascot from '@/components/Mascot'
import {
  getPendingRequests,
  approveRequest,
  rejectRequest,
  PendingRequest,
  INVITATION_CODE,
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
  const [copied, setCopied] = useState(false)

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

  function copyCodi() {
    navigator.clipboard.writeText(INVITATION_CODE)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 border-b border-phantom/20">
        <Link
          to="/"
          className="font-terminal text-phantom hover:text-haunt transition-colors text-lg"
        >
          ← tornar
        </Link>
        <div className="font-pixel text-voltage text-sm tracking-wider">
          [PANEL ADMIN]
        </div>
      </header>

      <div className="flex-1 px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Capçalera */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-20 h-20">
              <Mascot size={80} />
            </div>
            <div>
              <div className="terminal-label">benvingut</div>
              <h1 className="font-pixel text-2xl text-phantom text-glow-phantom">
                REI {user.nom.toUpperCase()}
              </h1>
              <p className="font-terminal text-bone/70">
                tu controles qui entra a rataplasma.com
              </p>
            </div>
          </motion.div>

          {/* Codi d'invitació */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="panel"
          >
            <div className="terminal-label mb-2">&gt; codi_invitacio_actual</div>
            <div className="flex items-center gap-3">
              <code className="flex-1 bg-ink/60 border border-voltage/40 px-4 py-3 font-terminal text-2xl text-voltage tracking-widest">
                {INVITATION_CODE}
              </code>
              <button
                onClick={copyCodi}
                className="px-4 py-3 border border-voltage/40 font-pixel text-sm text-voltage hover:bg-voltage/10 transition-colors tracking-wider"
              >
                {copied ? '✓ COPIAT' : 'COPIA'}
              </button>
            </div>
            <p className="font-terminal text-bone/60 mt-3 text-sm">
              dóna aquest codi als amics que vulguis que entrin. (en futures versions podràs
              crear codis personalitzats per cada amic)
            </p>
          </motion.section>

          {/* Peticions pendents */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="terminal-label mb-3">
              &gt; peticions_pendents ({peticions.length})
            </div>
            {peticions.length === 0 ? (
              <div className="panel text-center py-8">
                <div className="font-terminal text-bone/60">
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
                    className="panel flex items-center justify-between"
                  >
                    <div>
                      <div className="font-pixel text-phantom text-lg">{req.nom}</div>
                      <div className="font-terminal text-bone/50 text-sm">
                        vol entrar · {new Date(req.requestedAt).toLocaleString('ca-ES')}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="px-4 py-2 bg-phantom text-ink font-pixel text-sm tracking-wider hover:bg-haunt transition-colors"
                      >
                        ✓ DEIXA'L
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        className="px-4 py-2 border border-blood/50 text-blood font-pixel text-sm tracking-wider hover:bg-blood/20 transition-colors"
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
                &gt; amics_aprovats ({nomsAprovats.length})
              </div>
              <div className="panel flex flex-wrap gap-2">
                {nomsAprovats.map((n, i) => (
                  <span
                    key={i}
                    className="inline-block px-3 py-1 bg-phantom/20 border border-phantom/40 font-terminal text-phantom"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </motion.section>
          )}

          {/* Info Fase 1 */}
          <div className="font-terminal text-bone/40 text-sm text-center border-t border-phantom/10 pt-6">
            Fase 1 · l'aprovació de peticions és simbòlica (el codi ja els serveix).<br />
            A la Fase 2 migrarem a base de dades real amb codis únics per persona.
          </div>
        </div>
      </div>
    </div>
  )
}

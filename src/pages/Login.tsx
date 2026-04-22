import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import Mascot from '@/components/Mascot'
import { login, addPendingRequest } from '@/lib/auth'

export default function Login() {
  const navigate = useNavigate()
  const [nom, setNom] = useState('')
  const [codi, setCodi] = useState('')
  const [error, setError] = useState('')
  const [requestSent, setRequestSent] = useState(false)
  const [mode, setMode] = useState<'login' | 'request'>('login')

  function handleLogin(e: FormEvent) {
    e.preventDefault()
    setError('')
    const res = login(nom, codi)
    if (res.ok) {
      navigate('/')
    } else {
      setError(res.error || 'Error desconegut')
    }
  }

  function handleRequest(e: FormEvent) {
    e.preventDefault()
    const trimmed = nom.trim()
    if (trimmed.length < 2) {
      setError('El nom és massa curt')
      return
    }
    addPendingRequest(trimmed)
    setRequestSent(true)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Mascot size={160} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="panel"
        >
          <div className="terminal-label mb-1">&gt; sistema_rataplasma</div>
          <h1 className="font-pixel text-3xl text-phantom text-glow-phantom mb-2 crt-flicker">
            IDENTIFICA'T
          </h1>
          <p className="font-terminal text-xl text-bone/80 mb-6">
            {mode === 'login'
              ? 'Entra amb el teu nom i el codi que t\'ha donat el Pau'
              : 'El Pau rebrà la teva petició i decidirà si pots entrar'}
          </p>

          <form onSubmit={mode === 'login' ? handleLogin : handleRequest} className="space-y-4">
            <div>
              <label className="terminal-label block mb-1" htmlFor="rata-nom">el teu nom</label>
              <input
                id="rata-nom"
                name="username"
                type="text"
                autoComplete="username"
                autoCapitalize="words"
                value={nom}
                onChange={e => setNom(e.target.value)}
                maxLength={20}
                className="w-full bg-ink/60 border border-phantom/30 px-4 py-3 font-terminal text-xl text-bone focus:outline-none focus:border-phantom focus:shadow-[0_0_10px_rgba(110,255,158,0.5)] transition-all"
                placeholder="ex. Marc"
                autoFocus
              />
            </div>

            {mode === 'login' && (
              <div>
                <label className="terminal-label block mb-1" htmlFor="rata-codi">codi secret</label>
                <input
                  id="rata-codi"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  inputMode="text"
                  value={codi}
                  onChange={e => setCodi(e.target.value.toUpperCase())}
                  maxLength={30}
                  className="w-full bg-ink/60 border border-phantom/30 px-4 py-3 font-terminal text-xl text-bone focus:outline-none focus:border-phantom focus:shadow-[0_0_10px_rgba(110,255,158,0.5)] transition-all uppercase tracking-widest"
                  placeholder="XXXX-XXXX"
                />
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-terminal text-blood text-lg"
              >
                ⚠ {error}
              </motion.div>
            )}

            {requestSent ? (
              <div className="font-terminal text-phantom text-lg text-center py-4">
                ✓ Petició enviada! El Pau te l'ha de confirmar.
              </div>
            ) : (
              <button
                type="submit"
                className="w-full btn-rataplasma !text-xl !py-4"
              >
                {mode === 'login' ? 'ENTRA' : 'DEMANA ACCÉS'}
              </button>
            )}
          </form>

          {!requestSent && (
            <div className="mt-6 pt-4 border-t border-phantom/20 text-center">
              <button
                onClick={() => {
                  setMode(mode === 'login' ? 'request' : 'login')
                  setError('')
                }}
                className="font-terminal text-voltage hover:text-phantom transition-colors text-lg underline underline-offset-4"
              >
                {mode === 'login'
                  ? 'No tens codi? Demana permís al Pau'
                  : 'Ja tens codi? Entra aquí'}
              </button>
            </div>
          )}
        </motion.div>

        <div className="mt-6 text-center font-terminal text-bone/40 text-sm">
          rataplasma.com · prohibit als avorrits
        </div>
      </div>
    </div>
  )
}

import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import Mascot from '@/components/Mascot'
import { login } from '@/lib/auth'

export default function Login() {
  const navigate = useNavigate()
  const [nom, setNom] = useState('')
  const [codi, setCodi] = useState('')
  const [error, setError] = useState('')

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

  return (
    <div className="hb-page hb-paper min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="absolute inset-x-0 top-[8%] mx-auto h-40 max-w-3xl rounded-[45%_55%_50%_50%] bg-mustard border-[4px] border-midnight shadow-[8px_8px_0_var(--hb-midnight)] rotate-[-2deg] opacity-80" />
      <div className="relative w-full max-w-md">
        <div className="absolute -right-4 -top-16 w-32 rotate-6 sm:-right-20">
          <Mascot size={128} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="panel bg-moonbeam/95"
        >
          <div className="terminal-label mb-1">mystery van · rataplasma</div>
          <h1 className="hb-title text-4xl mb-2">
            ENTRA SI T'ATREVEIXES
          </h1>
          <p className="font-terminal text-xl text-midnight/80 mb-6">
            Entra amb el teu nom i el codi
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="terminal-label block mb-1" htmlFor="rata-nom">NOM</label>
              <input
                id="rata-nom"
                name="username"
                type="text"
                autoComplete="username"
                autoCapitalize="words"
                value={nom}
                onChange={e => setNom(e.target.value)}
                maxLength={20}
                className="hb-input w-full px-4 py-3 text-xl"
                placeholder="ex. Marc"
                autoFocus
              />
            </div>

            <div>
              <label className="terminal-label block mb-1" htmlFor="rata-codi">CODI SECRET</label>
              <input
                id="rata-codi"
                name="password"
                type="password"
                autoComplete="current-password"
                inputMode="text"
                value={codi}
                onChange={e => setCodi(e.target.value.toUpperCase())}
                maxLength={30}
                className="hb-input w-full px-4 py-3 text-xl uppercase tracking-widest"
                placeholder="ADMINPLASMA"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-terminal text-blood text-lg font-bold"
              >
                ⚠ {error}
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full hb-button !text-xl !py-4"
            >
              ENTRA
            </button>
          </form>
        </motion.div>

        <div className="mt-6 text-center font-terminal text-midnight/50 text-sm">
          rataplasma.com · prohibit als avorrits
        </div>
      </div>
    </div>
  )
}

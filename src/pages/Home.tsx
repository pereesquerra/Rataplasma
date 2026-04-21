import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import Mascot from '@/components/Mascot'
import BotoRataplasma from '@/components/BotoRataplasma'
import { getUser, logout } from '@/lib/auth'

export default function Home() {
  const user = getUser()!
  const navigate = useNavigate()
  const [excited, setExcited] = useState(false)
  const [crits, setCrits] = useState(0)
  const [screaming, setScreaming] = useState(false)

  function handleCrit() {
    setExcited(true)
    setCrits(c => c + 1)
    setScreaming(true)
    setTimeout(() => setExcited(false), 500)
    setTimeout(() => setScreaming(false), 1400)
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const extraAs = Math.min(3 + crits * 2, 18)
  const asText = 'A'.repeat(extraAs)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 border-b border-phantom/20 relative z-20">
        <div className="terminal-label text-phantom">
          &gt; hola, {user.nom.toLowerCase()}
        </div>
        <div className="flex items-center gap-3">
          {user.isAdmin && (
            <Link
              to="/admin"
              className="font-terminal text-voltage hover:text-phantom transition-colors text-sm uppercase tracking-wider border border-voltage/40 px-3 py-1"
            >
              [ADMIN]
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="font-terminal text-bone/60 hover:text-blood transition-colors text-sm uppercase tracking-wider"
          >
            surt
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start px-4 pt-4 pb-12 relative overflow-hidden">
        <AnimatePresence>
          {screaming && (
            <motion.div
              initial={{ opacity: 0, scale: 0.3, y: -40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.5, y: 30 }}
              transition={{ type: 'spring', stiffness: 180, damping: 14 }}
              className="absolute inset-x-0 top-6 flex justify-center pointer-events-none z-0 overflow-hidden"
            >
              <div
                className="font-pixel text-pumpkin text-glow-pumpkin leading-none tracking-tight whitespace-nowrap animate-glitch"
                style={{ fontSize: 'clamp(3rem, 13vw, 9rem)' }}
              >
                R<span className="text-phantom">AT</span>APL<span className="text-voltage">ASM</span>
                {Array.from(asText).map((a, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.025 }}
                    className={i % 3 === 0 ? 'text-pumpkin' : i % 3 === 1 ? 'text-phantom' : 'text-voltage'}
                  >
                    {a}
                  </motion.span>
                ))}
                !
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 w-full flex justify-center"
          style={{ maxWidth: 'min(90vw, 500px)' }}
        >
          <Mascot size={480} excited={excited} className="w-full h-auto" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="font-pixel text-phantom text-glow-phantom tracking-wider crt-flicker relative z-10 -mt-2"
          style={{ fontSize: 'clamp(2.5rem, 9vw, 5.5rem)' }}
        >
          <span className="glitch-text" data-text="RATAPLASMA">RATAPLASMA</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="font-terminal text-xl md:text-2xl text-bone/60 italic mt-1 mb-6"
        >
          ~ la rata fantasma et busca ~
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-col items-center gap-3 relative z-10"
        >
          <BotoRataplasma onCrit={handleCrit} />
          {crits > 0 && (
            <div className="font-terminal text-phantom text-lg">
              {crits === 1 ? '1 crit' : `${crits} crits`} · vés per més! ✨
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-10 w-full max-w-2xl relative z-10"
        >
          <NavCard to="/parla" label="PARLA AMB LA RATA" desc="xateja amb la rata fantasma. prepara't." emoji="💬" color="phantom" available />
          <NavCard to="#" label="FES UNA IMATGE" desc="diu-li el que vulguis i la rata t'ho dibuixa" emoji="🎨" color="voltage" available={false} />
          <NavCard to="#" label="DUEL DE PROMPTS" desc="competeix fent imatges amb els teus amics" emoji="⚔️" color="pumpkin" available={false} />
          <NavCard to="#" label="APRÈN A PROGRAMAR" desc="veu com funciona tot per dins. amb fletxes." emoji="🧪" color="phantom" available={false} />
        </motion.div>

        <div className="mt-8 font-terminal text-sm text-bone/40 text-center max-w-md">
          Fase 1 · les altres seccions aviat. entretant, crida la rata! 👻
        </div>
      </main>
    </div>
  )
}

interface NavCardProps {
  to: string
  label: string
  desc: string
  emoji: string
  color: 'phantom' | 'voltage' | 'pumpkin'
  available: boolean
}

function NavCard({ to, label, desc, emoji, color, available }: NavCardProps) {
  const colorMap = {
    phantom: 'border-phantom/40 hover:border-phantom hover:shadow-[0_0_20px_rgba(110,255,158,0.3)]',
    voltage: 'border-voltage/40 hover:border-voltage hover:shadow-[0_0_20px_rgba(199,125,255,0.3)]',
    pumpkin: 'border-pumpkin/40 hover:border-pumpkin hover:shadow-[0_0_20px_rgba(255,155,63,0.3)]',
  }
  const textColor = {
    phantom: 'text-phantom',
    voltage: 'text-voltage',
    pumpkin: 'text-pumpkin',
  }

  const content = (
    <div className={`relative bg-mist/60 border ${colorMap[color]} p-5 transition-all cursor-pointer group ${!available ? 'opacity-50' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="text-4xl">{emoji}</div>
        <div className="flex-1">
          <div className={`font-pixel ${textColor[color]} text-lg tracking-wider mb-1`}>{label}</div>
          <div className="font-terminal text-bone/70 text-lg leading-snug">{desc}</div>
        </div>
      </div>
      {!available && (
        <div className="absolute top-2 right-2 font-terminal text-xs text-bone/40 uppercase">aviat</div>
      )}
    </div>
  )

  if (available) return <Link to={to}>{content}</Link>
  return <div>{content}</div>
}

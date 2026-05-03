import { useState, useRef, useEffect, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import Mascot from '@/components/Mascot'
import { enviarMissatgeAlXat, ChatMessage } from '@/lib/api'
import { getUser } from '@/lib/auth'
import { speakAsRata, stopSpeaking, preloadVoices } from '@/lib/tts'

export default function Parla() {
  const user = getUser()!
  const [missatges, setMissatges] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `UUUUUUH! Sóc la Rata Fantasma! 👻 Tu deus ser ${user.nom}, oi? Digue'm què vols! Em pots preguntar coses, demanar-me que inventem una història, o jugar a endevinar coses. RATAAAPLAAAASMAAA! 🐀`,
    },
  ])
  const [input, setInput] = useState('')
  const [pensant, setPensant] = useState(false)
  const [error, setError] = useState('')
  const [veuActiva, setVeuActiva] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Precarrega veus del navegador (iOS les carrega asíncron)
  useEffect(() => { preloadVoices() }, [])

  // Bloqueja el scroll del body mentre som al xat (Safari iOS no pot moure la pàgina)
  useEffect(() => {
    document.documentElement.classList.add('chat-lock')
    document.body.classList.add('chat-lock')
    return () => {
      document.documentElement.classList.remove('chat-lock')
      document.body.classList.remove('chat-lock')
    }
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [missatges, pensant])

  // Atura la veu si el user surt
  useEffect(() => {
    return () => { stopSpeaking() }
  }, [])

  // Cada vegada que arriba un missatge nou de la Rata, el llegeix
  useEffect(() => {
    if (!veuActiva) return
    const darrer = missatges[missatges.length - 1]
    if (darrer && darrer.role === 'assistant' && darrer.content) {
      speakAsRata(darrer.content)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missatges.length])

  function toggleVeu() {
    setVeuActiva(v => {
      if (v) stopSpeaking()
      return !v
    })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || pensant) return

    const nousMissatges: ChatMessage[] = [...missatges, { role: 'user', content: text }]
    setMissatges(nousMissatges)
    setInput('')
    setPensant(true)
    setError('')

    try {
      const resposta = await enviarMissatgeAlXat(nousMissatges)
      setMissatges([...nousMissatges, { role: 'assistant', content: resposta }])
    } catch (err) {
      console.error(err)
      setError('La Rata s\'ha quedat muda un moment. Torna-ho a provar!')
    } finally {
      setPensant(false)
    }
  }

  return (
    <div className="hb-page hb-paper flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="hb-header shrink-0 flex items-center justify-between gap-3">
        <Link
          to="/"
          className="hb-back"
        >
          ← tornar
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-ghost-blue/40 border-[3px] border-midnight shadow-[3px_3px_0_var(--hb-midnight)]">
            <Mascot size={48} />
          </div>
          <div>
            <div className="hb-title text-sm">LA RATA</div>
            <div className="font-terminal text-midnight/60 text-xs">en línia · fantasma</div>
          </div>
          <button
            onClick={toggleVeu}
            className="ml-2 h-11 w-11 rounded-full border-[3px] border-midnight bg-mustard shadow-[3px_3px_0_var(--hb-midnight)] font-terminal text-xl leading-none active:translate-x-[2px] active:translate-y-[2px]"
            title={veuActiva ? 'Silencia la veu de la Rata' : 'Activa la veu de la Rata'}
            aria-label={veuActiva ? 'Silencia la veu' : 'Activa la veu'}
          >
            {veuActiva ? '🔊' : '🔇'}
          </button>
        </div>
      </header>

      {/* Xat */}
      <div
        ref={scrollRef}
        className="relative flex-1 overflow-y-auto px-4 py-6 space-y-4 min-h-0"
        style={{
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
        }}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {['ZOINKS!', 'JINKIES!', 'RATAPLASMA!', '?!'].map((word, i) => (
            <div
              key={word}
              className="hb-comic-word absolute opacity-[0.10]"
              style={{
                top: `${12 + i * 20}%`,
                left: i % 2 === 0 ? '7%' : '68%',
                transform: `rotate(${i % 2 === 0 ? -8 : 7}deg)`,
                fontSize: i === 2 ? 'clamp(40px, 8vw, 96px)' : 'clamp(30px, 6vw, 72px)',
              }}
            >
              {word}
            </div>
          ))}
        </div>

        <div className="pointer-events-none fixed right-3 bottom-24 hidden sm:block w-24 opacity-90">
          <Mascot size={96} />
        </div>

        <div className="relative max-w-3xl mx-auto space-y-4">
          <AnimatePresence>
            {missatges.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`relative max-w-[82%] px-4 py-3 font-body text-base sm:text-lg leading-relaxed border-[3px] border-midnight shadow-[4px_4px_0_var(--hb-midnight)] ${
                    m.role === 'user'
                      ? 'bg-avocado text-midnight rounded-[24px_20px_8px_24px]'
                      : 'bg-mustard text-midnight rounded-[20px_24px_24px_8px]'
                  }`}
                >
                  <div
                    className="terminal-label text-xs mb-1"
                  >
                    {m.role === 'user' ? user.nom.toLowerCase() : 'rata'}
                  </div>
                  <div className="whitespace-pre-wrap">{m.content}</div>
                  <span
                    className={`absolute bottom-[-11px] h-5 w-5 rotate-45 border-r-[3px] border-b-[3px] border-midnight ${
                      m.role === 'user' ? 'right-6 bg-avocado' : 'left-6 bg-mustard'
                    }`}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {pensant && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-ghost-blue/70 border-[3px] border-midnight rounded-[20px_24px_24px_8px] shadow-[4px_4px_0_var(--hb-midnight)] px-4 py-3 font-terminal text-midnight/80 text-lg">
                <span className="animate-pulse">la rata està pensant</span>
                <span className="inline-block ml-1">
                  <span className="animate-pulse">.</span>
                  <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
                  <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>.</span>
                </span>
              </div>
            </motion.div>
          )}

          {error && (
            <div className="text-center font-terminal text-blood font-bold">⚠ {error}</div>
          )}
        </div>
      </div>

      {/* Input ancorat a baix */}
      <form
        onSubmit={handleSubmit}
        className="shrink-0 border-t-[3px] border-midnight p-3 bg-moonbeam/95 backdrop-blur-sm"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            maxLength={500}
            disabled={pensant}
            placeholder="diu-li alguna cosa a la rata..."
            className="hb-input flex-1 px-4 py-3 text-lg disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={pensant || !input.trim()}
            className="hb-button px-4 py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ENVIA
          </button>
        </div>
      </form>
    </div>
  )
}

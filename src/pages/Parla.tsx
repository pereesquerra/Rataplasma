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

  // Precarrega veus del navegador (iOS les carrega asíncron)
  useEffect(() => { preloadVoices() }, [])

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
    if (darrer && darrer.role === 'assistant') {
      // Neteja emojis i asteriscs perquè el TTS no els llegeixi
      const net = darrer.content
        .replace(/[\p{Emoji}\u200d\ufe0f]/gu, '')
        .replace(/[*_`~#]/g, '')
        .trim()
      if (net) speakAsRata(net)
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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-phantom/20">
        <Link
          to="/"
          className="font-terminal text-phantom hover:text-haunt transition-colors text-lg"
        >
          ← tornar
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-12 h-12">
            <Mascot size={48} />
          </div>
          <div>
            <div className="font-pixel text-phantom text-sm tracking-wider">LA RATA</div>
            <div className="font-terminal text-bone/60 text-xs">en línia · fantasma</div>
          </div>
          <button
            onClick={toggleVeu}
            className="ml-2 p-2 rounded-full border border-phantom/30 hover:border-phantom transition-colors font-terminal text-xl leading-none"
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
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
        style={{ maxHeight: 'calc(100vh - 140px)' }}
      >
        <div className="max-w-2xl mx-auto space-y-4">
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
                  className={`max-w-[80%] px-4 py-3 font-terminal text-lg leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-voltage/20 border border-voltage/40 text-bone'
                      : 'bg-phantom/10 border border-phantom/40 text-bone'
                  }`}
                >
                  <div
                    className={`terminal-label text-xs mb-1 ${
                      m.role === 'user' ? 'text-voltage' : 'text-phantom'
                    }`}
                  >
                    {m.role === 'user' ? user.nom.toLowerCase() : 'rata'}
                  </div>
                  <div className="whitespace-pre-wrap">{m.content}</div>
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
              <div className="bg-phantom/10 border border-phantom/40 px-4 py-3 font-terminal text-bone/70 text-lg">
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
            <div className="text-center font-terminal text-blood">⚠ {error}</div>
          )}
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-phantom/20 p-3 bg-ink/80 backdrop-blur-sm"
      >
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            maxLength={500}
            disabled={pensant}
            placeholder="diu-li alguna cosa a la rata..."
            className="flex-1 bg-ink/60 border border-phantom/30 px-4 py-3 font-terminal text-lg text-bone focus:outline-none focus:border-phantom focus:shadow-[0_0_10px_rgba(110,255,158,0.4)] transition-all disabled:opacity-50"
            autoFocus
          />
          <button
            type="submit"
            disabled={pensant || !input.trim()}
            className="px-4 py-3 bg-phantom text-ink font-pixel tracking-wider text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-haunt transition-colors"
          >
            ENVIA
          </button>
        </div>
      </form>
    </div>
  )
}

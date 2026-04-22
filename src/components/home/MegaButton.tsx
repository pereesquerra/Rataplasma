import { useEffect, useRef, useState, type CSSProperties } from 'react'

interface MegaButtonProps {
  onPress?: () => void
}

interface FlyingLetter {
  id: string
  char: string
  color: string
  startX: number
  startY: number
  dx: number
  dy: number
  rotate: number
}

interface Trail {
  id: string
  x: number
  y: number
  dx: number
  dy: number
  color: string
  size: number
  delay: number
}

interface Confetti {
  id: string
  x: number
  y: number
  dx: number
  dy: number
  rotate: number
  color: string
  size: number
}

const BUTTON_LABEL = 'RATAPLASMAAAA'
const LETTER_COLORS = ['#4dff9f', '#a47bff', '#ff9f6b', '#ff6fa8', '#ffdc5e', '#5fc8ff']

// Query param ?veu=pau|grandpa|eddy|montse (default: pau v4)
function getVeuUrl(): string {
  if (typeof window === 'undefined') return '/crit-pau-v4.mp3'
  const params = new URLSearchParams(window.location.search)
  const veu = params.get('veu')
  if (veu === 'grandpa') return '/crit-grandpa.m4a'
  if (veu === 'eddy') return '/crit-eddy.m4a'
  if (veu === 'montse') return '/crit-montse.m4a'
  return '/crit-pau-v4.mp3'
}

export default function MegaButton({ onPress }: MegaButtonProps) {
  const [pressing, setPressing] = useState(false)
  const [flyingLetters, setFlyingLetters] = useState<FlyingLetter[]>([])
  const [trails, setTrails] = useState<Trail[]>([])
  const [confetti, setConfetti] = useState<Confetti[]>([])
  const btnRef = useRef<HTMLButtonElement | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // No precarreguem: creem l'Audio al primer clic per evitar problemes d'autoplay i de cache vella
  function tocarCrit() {
    try {
      // Un Audio nou cada vegada — així sempre agafa l'última versió i evita estats pausats
      const a = new Audio(getVeuUrl() + '?v=4')
      a.volume = 1.0
      a.play().catch((err) => console.warn('[MegaButton] play falla:', err))
      audioRef.current = a
      window.dispatchEvent(new CustomEvent('rataplasma:scream-start'))
    } catch (err) {
      console.error('[MegaButton] excepció:', err)
    }
  }

  const spawnLetterWave = () => {
    if (!btnRef.current) return
    const letterSpans = btnRef.current.querySelectorAll('.btn-letter')
    const newLetters: FlyingLetter[] = []
    const newTrails: Trail[] = []
    letterSpans.forEach((span, i) => {
      const r = span.getBoundingClientRect()
      const angle = (Math.random() - 0.5) * Math.PI * 1.3 - Math.PI / 2
      const power = 500 + Math.random() * 600
      const sx = r.left + r.width / 2
      const sy = r.top + r.height / 2
      const dx = Math.cos(angle) * power
      const dy = Math.sin(angle) * power - 300
      const color = LETTER_COLORS[(i + Math.floor(Math.random() * 3)) % LETTER_COLORS.length]
      const uid = Date.now() + '-' + i + '-' + Math.random()
      newLetters.push({
        id: uid, char: span.textContent || '', color,
        startX: sx, startY: sy, dx, dy,
        rotate: (Math.random() - 0.5) * 900,
      })
      for (let t = 0; t < 8; t++) {
        newTrails.push({
          id: uid + '-t-' + t,
          x: sx, y: sy,
          dx: dx * (0.2 + t * 0.1),
          dy: dy * (0.2 + t * 0.1) + t * 20,
          color, size: 10 + Math.random() * 8, delay: t * 25,
        })
      }
    })
    setFlyingLetters(prev => [...prev, ...newLetters])
    setTrails(prev => [...prev, ...newTrails])
    setTimeout(() => setFlyingLetters(prev => prev.filter(p => !newLetters.find(n => n.id === p.id))), 1800)
    setTimeout(() => setTrails(prev => prev.filter(p => !newTrails.find(n => n.id === p.id))), 1400)
  }

  const spawnConfetti = (cx: number, cy: number, count: number) => {
    const newConfetti: Confetti[] = Array.from({ length: count }, (_, i) => {
      const angle = Math.random() * Math.PI * 2
      const power = 200 + Math.random() * 650
      return {
        id: Date.now() + '-c-' + i + '-' + Math.random(),
        x: cx, y: cy,
        dx: Math.cos(angle) * power,
        dy: Math.sin(angle) * power - 350,
        rotate: Math.random() * 900,
        color: ['#4dff9f', '#a47bff', '#ff9f6b', '#ff6fa8', '#ffdc5e', '#5fc8ff'][i % 6],
        size: 10 + Math.random() * 12,
      }
    })
    setConfetti(prev => [...prev, ...newConfetti])
    setTimeout(() => setConfetti(prev => prev.filter(p => !newConfetti.find(n => n.id === p.id))), 2400)
  }

  const handleClick = () => {
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2

    tocarCrit()

    setPressing(true)
    setTimeout(() => setPressing(false), 260)
    onPress?.()

    // Només 2 onades curtes, el crit dura 2s
    spawnLetterWave()
    setTimeout(spawnLetterWave, 600)

    spawnConfetti(cx, cy, 60)
  }

  return (
    <>
      <div className="mega-btn-wrap">
        <button
          ref={btnRef}
          className={`mega-btn ${pressing ? 'pressing' : ''}`}
          onClick={handleClick}
          aria-label="Rataplasmaaa!"
        >
          <div className="mega-btn-shadow" />
          <div className="mega-btn-base" />
          <div className="mega-btn-face">
            <span style={{ display: 'inline-flex', gap: '0.02em' }}>
              {BUTTON_LABEL.split('').map((ch, i) => (
                <span
                  key={i}
                  className="btn-letter"
                  style={{
                    display: 'inline-block',
                    animation: `letterBounce 1.8s ease-in-out ${i * 0.05}s infinite`,
                  }}
                >
                  {ch}
                </span>
              ))}
            </span>
          </div>
          <span className="mega-btn-sparkle s1">✦</span>
          <span className="mega-btn-sparkle s2">✧</span>
          <span className="mega-btn-sparkle s3">✦</span>
        </button>
        <style>{`
          @keyframes letterBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
        `}</style>
      </div>

      {trails.map(t => (
        <span
          key={t.id}
          className="flying-letter-trail"
          style={{
            left: t.x, top: t.y, width: t.size, height: t.size,
            background: t.color,
            boxShadow: `0 0 ${t.size * 2}px ${t.color}`,
            transform: 'translate(-50%, -50%)',
            animation: `trailFly 1.1s ease-out ${t.delay}ms forwards`,
            ['--dx' as string]: `${t.dx}px`,
            ['--dy' as string]: `${t.dy}px`,
          } as CSSProperties}
        />
      ))}

      {flyingLetters.map(l => (
        <span
          key={l.id}
          className="flying-letter"
          style={{
            left: l.startX, top: l.startY, color: l.color,
            transform: 'translate(-50%, -50%)',
            animation: 'letterFly 1.7s cubic-bezier(0.2, 0.8, 0.4, 1) forwards',
            ['--dx' as string]: `${l.dx}px`,
            ['--dy' as string]: `${l.dy}px`,
            ['--rot' as string]: `${l.rotate}deg`,
          } as CSSProperties}
        >
          {l.char}
        </span>
      ))}

      {confetti.map(c => (
        <span
          key={c.id}
          className="confetti"
          style={{
            left: c.x, top: c.y, width: c.size, height: c.size * 1.4,
            background: c.color,
            transform: 'translate(-50%, -50%)',
            animation: 'confettiBurst 2.2s cubic-bezier(0.2, 0.8, 0.4, 1) forwards',
            ['--dx' as string]: `${c.dx}px`,
            ['--dy' as string]: `${c.dy}px`,
            ['--rot' as string]: `${c.rotate}deg`,
          } as CSSProperties}
        />
      ))}

      <style>{`
        @keyframes letterFly {
          0% { transform: translate(-50%, -50%) translate(0, 0) rotate(0) scale(1); opacity: 1; }
          15% { transform: translate(-50%, -50%) translate(calc(var(--dx) * 0.2), calc(var(--dy) * 0.1)) rotate(calc(var(--rot) * 0.15)) scale(1.4); opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(var(--dx), calc(var(--dy) + 400px)) rotate(var(--rot)) scale(0.5); opacity: 0; }
        }
        @keyframes trailFly {
          0% { transform: translate(-50%, -50%) translate(0, 0) scale(1); opacity: 0.9; }
          100% { transform: translate(-50%, -50%) translate(var(--dx), calc(var(--dy) + 250px)) scale(0.2); opacity: 0; }
        }
        @keyframes confettiBurst {
          0% { transform: translate(-50%, -50%) translate(0, 0) rotate(0); opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(var(--dx), calc(var(--dy) + 500px)) rotate(var(--rot)); opacity: 0; }
        }
      `}</style>
    </>
  )
}

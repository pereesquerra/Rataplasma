import { useEffect, useRef, useState, type CSSProperties } from 'react'

type Shape = 'postit' | 'bubble' | 'caution' | 'torn' | 'badge'

interface StickerDef {
  text: string
  bg: string
  fg: string
  shape: Shape
  top: string
  left?: string
  right?: string
  rot: number
  size: number
}

const STICKER_DEFS: StickerDef[] = [
  { text: 'NO CLIQUIS!',     bg: '#ffdc5e', fg: '#3a2500', shape: 'postit',  top: '22%', left: '1%',  rot: -14, size: 0.95 },
  { text: 'SECRET 👻',       bg: '#ff6fa8', fg: '#fff',    shape: 'bubble',  top: '20%', right: '2%', rot: 12,  size: 0.95 },
  { text: 'PERILL!!',        bg: '#ff3d3d', fg: '#fff',    shape: 'caution', top: '46%', left: '1%',  rot: -22, size: 0.95 },
  { text: 'SHHHH...',        bg: '#5fc8ff', fg: '#082a3a', shape: 'torn',    top: '60%', right: '2%', rot: 8,   size: 0.9 },
  { text: 'sorpresa?',       bg: '#4dff9f', fg: '#063820', shape: 'badge',   top: '80%', left: '2%',  rot: 18,  size: 0.85 },
  { text: 'PROHIBIT',        bg: '#1a1a1a', fg: '#ffdc5e', shape: 'caution', top: '34%', right: '2%', rot: -9,  size: 0.9 },
  { text: 'què passa aquí?', bg: '#ffffff', fg: '#2a0d4a', shape: 'postit',  top: '72%', right: '1%', rot: -16, size: 0.85 },
  { text: 'ei, tu!',         bg: '#ff9f6b', fg: '#2a0d00', shape: 'bubble',  top: '33%', left: '2%',  rot: 6,   size: 0.9 },
]

const MIN_TOP_PX = 110

const SURPRISE_PHRASES = [
  'Quineees! 🐀', 'Rataplaaasmaaa!', 'Quiero pipas!', "M'has vist? 👀",
  'Gotcha!', 'Gràcies, humà!', 'Nyam nyam', "No et podràs treure'm del cap!",
  'pip pip pip!', 'BUUUU!', "t'he enxampat 😼",
]

interface Bubble { id: number; phrase: string; x: number; y: number; rot: number }
interface Burst { id: string; x: number; y: number; dx: number; dy: number; rot: number; color: string; size: number }

// Query param per al squeak
function getVeuUrl(): string {
  if (typeof window === 'undefined') return '/rataplasma.m4a'
  const params = new URLSearchParams(window.location.search)
  const veu = params.get('veu')
  if (veu === 'grandpa') return '/crit-grandpa.m4a'
  if (veu === 'eddy') return '/crit-eddy.m4a'
  if (veu === 'montse') return '/crit-montse.m4a'
  return '/rataplasma.m4a'
}

export default function Stickers() {
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [bursts, setBursts] = useState<Burst[]>([])
  const [triggered, setTriggered] = useState<Record<number, number>>({})
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const a = new Audio(getVeuUrl())
    a.volume = 0.35
    a.playbackRate = 1.4
    audioRef.current = a
  }, [])

  const pop = (idx: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    const target = e.currentTarget
    const rect = target.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2

    // squeak curt
    const a = audioRef.current
    if (a) {
      try {
        a.currentTime = 0
        a.play().catch(() => {})
        setTimeout(() => { try { a.pause() } catch { /* ignore */ } }, 350)
      } catch { /* ignore */ }
    }

    // sticker anim
    setTriggered(t => ({ ...t, [idx]: Date.now() }))
    setTimeout(() => setTriggered(t => {
      const n = { ...t }; delete n[idx]; return n
    }), 700)

    // bubble
    const phrase = SURPRISE_PHRASES[Math.floor(Math.random() * SURPRISE_PHRASES.length)]
    const bid = Date.now() + Math.random()
    setBubbles(b => [...b, { id: bid, phrase, x: cx, y: cy - 20, rot: (Math.random() - 0.5) * 16 }])
    setTimeout(() => setBubbles(b => b.filter(bb => bb.id !== bid)), 2000)

    // confetti petit
    const burst: Burst[] = Array.from({ length: 14 }, (_, i) => {
      const ang = Math.random() * Math.PI * 2
      const p = 80 + Math.random() * 150
      return {
        id: Date.now() + '-' + i + Math.random(),
        x: cx, y: cy,
        dx: Math.cos(ang) * p,
        dy: Math.sin(ang) * p - 80,
        rot: Math.random() * 720,
        color: ['#4dff9f', '#a47bff', '#ff9f6b', '#ff6fa8', '#ffdc5e', '#5fc8ff'][i % 6],
        size: 7 + Math.random() * 6,
      }
    })
    setBursts(b => [...b, ...burst])
    setTimeout(() => setBursts(b => b.filter(bb => !burst.find(x => x.id === bb.id))), 1400)
  }

  return (
    <>
      {STICKER_DEFS.map((s, i) => (
        <Sticker key={i} def={s} idx={i} triggered={!!triggered[i]} onClick={(e) => pop(i, e)} />
      ))}

      {bubbles.map(b => (
        <div
          key={b.id}
          className="surprise-bubble"
          style={{
            left: b.x,
            top: b.y,
            transform: `translate(-50%, -100%) rotate(${b.rot}deg)`,
            animation: 'bubblePop 2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          }}
        >
          {b.phrase}
          <span className="bubble-tail" />
        </div>
      ))}

      {bursts.map(c => (
        <span
          key={c.id}
          className="confetti"
          style={{
            left: c.x,
            top: c.y,
            width: c.size,
            height: c.size * 1.3,
            background: c.color,
            transform: 'translate(-50%, -50%)',
            animation: 'confettiBurst 1.3s cubic-bezier(0.2, 0.8, 0.4, 1) forwards',
            ['--dx' as string]: `${c.dx}px`,
            ['--dy' as string]: `${c.dy}px`,
            ['--rot' as string]: `${c.rot}deg`,
          } as CSSProperties}
        />
      ))}
    </>
  )
}

interface StickerProps {
  def: StickerDef
  idx: number
  triggered: boolean
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}

function Sticker({ def, idx, triggered, onClick }: StickerProps) {
  const style: CSSProperties = {
    top: `max(${MIN_TOP_PX}px, ${def.top})`,
    left: def.left,
    right: def.right,
    ['--rot' as string]: `${def.rot}deg`,
    ['--size' as string]: def.size,
    ['--bg' as string]: def.bg,
    ['--fg' as string]: def.fg,
    animationDelay: `${idx * 0.12}s, ${idx * 0.3}s`,
  }
  return (
    <button
      className={`sticker sticker-${def.shape} ${triggered ? 'stk-pop' : ''}`}
      style={style}
      onClick={onClick}
      aria-label={def.text}
    >
      {def.shape === 'caution' && <span className="stk-stripe" aria-hidden />}
      <span className="stk-text">{def.text}</span>
    </button>
  )
}

import { useState, type CSSProperties } from 'react'

type CardId = 'chat' | 'image' | 'duel' | 'code' | 'music' | 'bikes' | 'puzzles'

interface CardDef {
  id: CardId
  title: string
  icon: string
  accent: string
  shadow: string
  glow: string
  locked: boolean
}

const CARDS: CardDef[] = [
  {
    id: 'chat', title: 'Parla amb\nla Rata', icon: '💬',
    accent: '#8aa83b',
    shadow: 'rgba(26, 31, 58, 0.28)',
    glow: 'radial-gradient(circle, rgba(138, 168, 59, 0.28), transparent 70%)',
    locked: false,
  },
  {
    id: 'image', title: 'Fes una\nimatge', icon: '🎨',
    accent: '#f4c542',
    shadow: 'rgba(26, 31, 58, 0.28)',
    glow: 'radial-gradient(circle, rgba(244, 197, 66, 0.28), transparent 70%)',
    locked: true,
  },
  {
    id: 'duel', title: 'Duel de\nprompts', icon: '⚔️',
    accent: '#e8772e',
    shadow: 'rgba(26, 31, 58, 0.28)',
    glow: 'radial-gradient(circle, rgba(232, 119, 46, 0.28), transparent 70%)',
    locked: true,
  },
  {
    id: 'code', title: 'Aprèn a\nprogramar', icon: '🧪',
    accent: '#b94e2c',
    shadow: 'rgba(26, 31, 58, 0.28)',
    glow: 'radial-gradient(circle, rgba(185, 78, 44, 0.28), transparent 70%)',
    locked: false,
  },
]

const MINI_CARDS: CardDef[] = [
  {
    id: 'music', title: 'Música', icon: '🎵',
    accent: '#f4c542',
    shadow: 'rgba(26, 31, 58, 0.25)',
    glow: 'radial-gradient(circle, rgba(244, 197, 66, 0.24), transparent 70%)',
    locked: false,
  },
  {
    id: 'bikes', title: 'Bicis', icon: '🚴',
    accent: '#bce0ff',
    shadow: 'rgba(26, 31, 58, 0.25)',
    glow: 'radial-gradient(circle, rgba(188, 224, 255, 0.24), transparent 70%)',
    locked: true,
  },
  {
    id: 'puzzles', title: 'Puzles', icon: '🧩',
    accent: '#8aa83b',
    shadow: 'rgba(26, 31, 58, 0.25)',
    glow: 'radial-gradient(circle, rgba(138, 168, 59, 0.24), transparent 70%)',
    locked: true,
  },
]

interface NavCardsProps {
  onSelect?: (id: CardId) => void
}

export default function NavCards({ onSelect }: NavCardsProps) {
  return (
    <div className="cards-group">
      <div className="cards">
        {CARDS.map((card, i) => (
          <NavCard key={card.id} card={card} delay={0.1 + i * 0.08} onSelect={onSelect} />
        ))}
      </div>
      <div className="mini-cards">
        {MINI_CARDS.map((card, i) => (
          <MiniCard key={card.id} card={card} delay={0.5 + i * 0.06} onSelect={onSelect} />
        ))}
      </div>
    </div>
  )
}

interface NavCardProps {
  card: CardDef
  delay: number
  onSelect?: (id: CardId) => void
}

function NavCard({ card, delay, onSelect }: NavCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (card.locked) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: x * 12, y: -y * 12 })
  }
  const handleMouseLeave = () => setTilt({ x: 0, y: 0 })

  const style: CSSProperties = {
    animationDelay: `${delay}s`,
    ['--card-accent' as string]: card.accent,
    ['--card-shadow' as string]: card.shadow,
    ['--card-glow' as string]: card.glow,
    transform: tilt.x || tilt.y
      ? `translateY(-10px) scale(1.03) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`
      : undefined,
    transformStyle: 'preserve-3d',
  }

  return (
    <div
      className={`card enter-up ${card.locked ? 'locked' : ''}`}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => !card.locked && onSelect?.(card.id)}
    >
      <div className="card-glow" />
      <div className="card-bg-shape" />

      {card.locked && (
        <>
          <div className="card-soon">aviat</div>
          <div className="card-lock">🔒</div>
        </>
      )}

      <div className="card-icon-wrap">
        <span style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' }}>{card.icon}</span>
      </div>

      <div>
        <div className="card-title">
          {card.title.split('\n').map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
        {!card.locked && (
          <div className="card-sub">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#8aa83b', boxShadow: '0 0 0 2px #1a1f3a' }} />
            llest per jugar
          </div>
        )}
      </div>

      {!card.locked && (
        <div className="card-arrow">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M7 3l4 4-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
  )
}

interface MiniCardProps {
  card: CardDef
  delay: number
  onSelect?: (id: CardId) => void
}

function MiniCard({ card, delay, onSelect }: MiniCardProps) {
  const style: CSSProperties = {
    animationDelay: `${delay}s`,
    ['--card-accent' as string]: card.accent,
    ['--card-shadow' as string]: card.shadow,
    ['--card-glow' as string]: card.glow,
  }
  return (
    <div
      className={`mini-card enter-up ${card.locked ? 'locked' : ''}`}
      style={style}
      onClick={() => !card.locked && onSelect?.(card.id)}
    >
      <div className="card-glow" />
      <div className="mini-card-icon">
        <span>{card.icon}</span>
      </div>
      <div className="mini-card-body">
        <div className="mini-card-title">{card.title}</div>
        <div className="mini-card-sub">
          {card.locked ? (
            <>
              <span className="mini-lock">🔒</span>
              aviat
            </>
          ) : (
            <>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#8aa83b', boxShadow: '0 0 0 2px #1a1f3a' }} />
              llest
            </>
          )}
        </div>
      </div>
    </div>
  )
}

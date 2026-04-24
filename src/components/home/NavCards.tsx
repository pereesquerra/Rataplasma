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
    accent: 'linear-gradient(135deg, #26dc8a 0%, #0aaa58 100%)',
    shadow: 'rgba(38, 220, 138, 0.5)',
    glow: 'radial-gradient(circle, rgba(38, 220, 138, 0.6), transparent 70%)',
    locked: false,
  },
  {
    id: 'image', title: 'Fes una\nimatge', icon: '🎨',
    accent: 'linear-gradient(135deg, #a47bff 0%, #6a2dd9 100%)',
    shadow: 'rgba(138, 71, 255, 0.5)',
    glow: 'radial-gradient(circle, rgba(138, 71, 255, 0.6), transparent 70%)',
    locked: true,
  },
  {
    id: 'duel', title: 'Duel de\nprompts', icon: '⚔️',
    accent: 'linear-gradient(135deg, #ff9f6b 0%, #e85d1b 100%)',
    shadow: 'rgba(255, 108, 67, 0.5)',
    glow: 'radial-gradient(circle, rgba(255, 108, 67, 0.6), transparent 70%)',
    locked: true,
  },
  {
    id: 'code', title: 'Aprèn a\nprogramar', icon: '🧪',
    accent: 'linear-gradient(135deg, #ff6fa8 0%, #d83477 100%)',
    shadow: 'rgba(255, 111, 168, 0.5)',
    glow: 'radial-gradient(circle, rgba(255, 111, 168, 0.6), transparent 70%)',
    locked: true,
  },
]

const MINI_CARDS: CardDef[] = [
  {
    id: 'music', title: 'Música', icon: '🎵',
    accent: 'linear-gradient(135deg, #ffdc5e 0%, #e8a91f 100%)',
    shadow: 'rgba(255, 220, 94, 0.45)',
    glow: 'radial-gradient(circle, rgba(255, 220, 94, 0.55), transparent 70%)',
    locked: false,
  },
  {
    id: 'bikes', title: 'Bicis', icon: '🚴',
    accent: 'linear-gradient(135deg, #5fc8ff 0%, #2a88d4 100%)',
    shadow: 'rgba(95, 200, 255, 0.45)',
    glow: 'radial-gradient(circle, rgba(95, 200, 255, 0.55), transparent 70%)',
    locked: true,
  },
  {
    id: 'puzzles', title: 'Puzles', icon: '🧩',
    accent: 'linear-gradient(135deg, #ff4fa8 0%, #c8227e 100%)',
    shadow: 'rgba(255, 79, 168, 0.45)',
    glow: 'radial-gradient(circle, rgba(255, 79, 168, 0.55), transparent 70%)',
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
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4dff9f', boxShadow: '0 0 8px #4dff9f' }} />
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
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#4dff9f', boxShadow: '0 0 6px #4dff9f' }} />
              llest
            </>
          )}
        </div>
      </div>
    </div>
  )
}

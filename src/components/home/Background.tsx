import { useMemo } from 'react'

interface BackgroundProps {
  showGhosts?: boolean
}

export default function Background({ showGhosts = true }: BackgroundProps) {
  const bokeh = useMemo(() => ([
    { x: 5,  y: 12, size: 320, color: '#f4c542', dur: 26, delay: 0 },
    { x: 70, y: 18, size: 240, color: '#8aa83b', dur: 30, delay: 3 },
    { x: 80, y: 72, size: 340, color: '#e8772e', dur: 28, delay: 7 },
    { x: 12, y: 76, size: 260, color: '#b94e2c', dur: 32, delay: 2 },
    { x: 48, y: 48, size: 210, color: '#bce0ff', dur: 27, delay: 5 },
    { x: 38, y: 8, size: 190, color: '#d6e9d3', dur: 29, delay: 9 },
  ]), [])

  const ghosts = useMemo(() => ([
    { x: 12, y: 60, size: 140, dur: 35, delay: 0 },
    { x: 78, y: 35, size: 110, dur: 42, delay: 6 },
    { x: 55, y: 85, size: 90,  dur: 38, delay: 12 },
    { x: 88, y: 12, size: 70,  dur: 40, delay: 3 },
  ]), [])

  const bokehKeyframes = useMemo(() => bokeh.map((_, i) => (
    `@keyframes bokehDrift-${i} {
      0%, 100% { transform: translate(0, 0) rotate(-5deg) scale(1); }
      33% { transform: translate(${(Math.random() - 0.5) * 36}px, ${(Math.random() - 0.5) * 30}px) rotate(-2deg) scale(1.04); }
      66% { transform: translate(${(Math.random() - 0.5) * 36}px, ${(Math.random() - 0.5) * 30}px) rotate(-8deg) scale(0.98); }
    }`
  )).join('\n'), [bokeh])

  const ghostKeyframes = useMemo(() => ghosts.map((_, i) => (
    `@keyframes ghostDrift-${i} {
      0%, 100% { transform: translate(0, 0) rotate(-3deg); opacity: 0.08; }
      50% { transform: translate(${(Math.random() - 0.5) * 90}px, ${-15 - Math.random() * 28}px) rotate(4deg); opacity: 0.14; }
    }`
  )).join('\n'), [ghosts])

  return (
    <div className="bg">
      {bokeh.map((b, i) => (
        <div
          key={'bok-' + i}
          className="bokeh"
          style={{
            left: b.x + '%',
            top: b.y + '%',
            width: b.size,
            height: b.size,
            background: b.color,
            animation: `bokehDrift-${i} ${b.dur}s ease-in-out ${b.delay}s infinite`,
          }}
        />
      ))}
      <style>{bokehKeyframes}</style>

      {showGhosts && ghosts.map((g, i) => (
        <svg
          key={'gh-' + i}
          className="ghost-silhouette"
          style={{
            left: g.x + '%',
            top: g.y + '%',
            width: g.size,
            height: g.size,
            animation: `ghostDrift-${i} ${g.dur}s ease-in-out ${g.delay}s infinite`,
          }}
          viewBox="0 0 100 100"
        >
          <path
            d="M 20 40 C 20 22, 35 10, 50 10 C 65 10, 80 22, 80 40 L 80 82 C 80 82, 76 90, 72 87 C 68 84, 65 91, 61 87 C 57 83, 54 92, 50 87 C 46 92, 43 83, 39 87 C 35 91, 32 84, 28 87 C 24 90, 20 82, 20 82 Z"
            fill="#ffffff"
          />
        </svg>
      ))}
      <style>{ghostKeyframes}</style>
    </div>
  )
}

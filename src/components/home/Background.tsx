import { useMemo } from 'react'

interface BackgroundProps {
  showGhosts?: boolean
}

export default function Background({ showGhosts = true }: BackgroundProps) {
  const bokeh = useMemo(() => ([
    { x: 8,  y: 15, size: 280, color: '#8a47ff', dur: 22, delay: 0 },
    { x: 72, y: 22, size: 220, color: '#26dc8a', dur: 28, delay: 3 },
    { x: 85, y: 75, size: 320, color: '#ff6b3d', dur: 26, delay: 7 },
    { x: 15, y: 80, size: 260, color: '#ff6fa8', dur: 30, delay: 2 },
    { x: 50, y: 50, size: 200, color: '#5fc8ff', dur: 24, delay: 5 },
    { x: 40, y: 10, size: 180, color: '#ffdc5e', dur: 26, delay: 9 },
  ]), [])

  const ghosts = useMemo(() => ([
    { x: 12, y: 60, size: 140, dur: 35, delay: 0 },
    { x: 78, y: 35, size: 110, dur: 42, delay: 6 },
    { x: 55, y: 85, size: 90,  dur: 38, delay: 12 },
    { x: 88, y: 12, size: 70,  dur: 40, delay: 3 },
  ]), [])

  const bokehKeyframes = useMemo(() => bokeh.map((_, i) => (
    `@keyframes bokehDrift-${i} {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 80}px) scale(1.15); }
      66% { transform: translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 80}px) scale(0.9); }
    }`
  )).join('\n'), [bokeh])

  const ghostKeyframes = useMemo(() => ghosts.map((_, i) => (
    `@keyframes ghostDrift-${i} {
      0%, 100% { transform: translate(0, 0); opacity: 0.04; }
      50% { transform: translate(${(Math.random() - 0.5) * 120}px, ${-20 - Math.random() * 40}px); opacity: 0.08; }
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

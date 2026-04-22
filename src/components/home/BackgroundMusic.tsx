import { useEffect, useRef, useState } from 'react'

// 3 pistes de fons, rotació cíclica automàtica
const TRACKS = [
  { src: '/pista-1.m4a', name: 'Crits del Pau' },
  { src: '/pista-2.mp3', name: 'Rataplasma I' },
  { src: '/pista-3.mp3', name: 'Rataplasma II' },
]

export default function BackgroundMusic() {
  const [idx, setIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.volume = 0.35
    }
    const a = audioRef.current
    a.src = TRACKS[idx].src
    if (playing) a.play().catch(() => setPlaying(false))

    const onEnded = () => setIdx(prev => (prev + 1) % TRACKS.length)
    a.addEventListener('ended', onEnded)
    return () => { a.removeEventListener('ended', onEnded) }
  }, [idx, playing])

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    if (playing) {
      a.pause()
      setPlaying(false)
    } else {
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    }
  }

  const next = () => setIdx((idx + 1) % TRACKS.length)

  return (
    <div className="bg-music">
      <button
        className="bg-music-btn"
        onClick={toggle}
        aria-label={playing ? 'Atura la música' : 'Engega la música'}
        title={TRACKS[idx].name}
      >
        {playing ? '❚❚' : '▶'}
      </button>
      <button
        className="bg-music-next"
        onClick={next}
        aria-label="Pista següent"
        title="Pista següent"
      >
        ⏭
      </button>
      <span className="bg-music-label">
        {playing ? TRACKS[idx].name : 'música aturada'}
      </span>
    </div>
  )
}

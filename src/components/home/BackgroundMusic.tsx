import { useEffect, useRef, useState } from 'react'

// 3 pistes de fons, rotació cíclica. La primera és sempre l'oberta per defecte.
const TRACKS = [
  { src: '/pista-1.m4a', name: '🐀 Crits del Pau' },
  { src: '/pista-2.mp3', name: '🎵 Rataplasma I' },
  { src: '/pista-3.mp3', name: '🎵 Rataplasma II' },
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

  // Ducking: baixa la música mentre crida, puja progressivament al final
  useEffect(() => {
    const onScream = () => {
      const a = audioRef.current
      if (!a) return
      const original = 0.35
      a.volume = 0.08
      // A partir del segon 5.3 (quan arrenca el fade-out del crit), pujo la música progressivament
      const fadeBackSteps = 20
      const fadeBackStart = 5300
      const fadeBackDuration = 1500
      for (let i = 0; i <= fadeBackSteps; i++) {
        const t = fadeBackStart + (fadeBackDuration / fadeBackSteps) * i
        const vol = 0.08 + (original - 0.08) * (i / fadeBackSteps)
        setTimeout(() => {
          if (audioRef.current) audioRef.current.volume = vol
        }, t)
      }
    }
    window.addEventListener('rataplasma:scream-start', onScream)
    return () => window.removeEventListener('rataplasma:scream-start', onScream)
  }, [])

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
  const prev = () => setIdx((idx - 1 + TRACKS.length) % TRACKS.length)

  return (
    <div className="bg-music">
      <button className="bg-music-nav" onClick={prev} aria-label="Pista anterior" title="Anterior">
        ⏮
      </button>
      <button
        className="bg-music-btn"
        onClick={toggle}
        aria-label={playing ? 'Atura la música' : 'Engega la música'}
        title={playing ? 'Atura' : 'Engega'}
      >
        {playing ? '❚❚' : '▶'}
      </button>
      <button className="bg-music-nav" onClick={next} aria-label="Pista següent" title="Següent">
        ⏭
      </button>
      <span className="bg-music-label">{TRACKS[idx].name}</span>
    </div>
  )
}

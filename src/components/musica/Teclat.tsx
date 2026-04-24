import { useState } from 'react'
import { SOLFEIG_NOTES, SOLFEIG_MIDIS, NOTE_COLORS } from '@/lib/audio-engine'
import { playNote, type Instrument } from '@/lib/instruments'

interface Props {
  instrument: Instrument
  onPlay?: (noteIndex: number) => void
}

export default function Teclat({ instrument, onPlay }: Props) {
  const [activa, setActiva] = useState<number | null>(null)

  const tocar = (i: number) => {
    playNote(SOLFEIG_MIDIS[i], 0.7, instrument)
    setActiva(i)
    onPlay?.(i)
    setTimeout(() => setActiva(prev => (prev === i ? null : prev)), 250)
  }

  return (
    <div className="grid grid-cols-8 gap-2 w-full max-w-3xl mx-auto">
      {SOLFEIG_NOTES.map((nota, i) => (
        <button
          key={i}
          onMouseDown={() => tocar(i)}
          onTouchStart={(e) => { e.preventDefault(); tocar(i) }}
          className="relative h-32 sm:h-40 rounded-xl border-2 border-ink/40 transition-all select-none font-pixel text-lg"
          style={{
            background: `linear-gradient(180deg, ${NOTE_COLORS[i]} 0%, ${NOTE_COLORS[i]}cc 100%)`,
            boxShadow: activa === i
              ? `inset 0 6px 0 rgba(0,0,0,0.2), 0 2px 0 ${NOTE_COLORS[i]}88`
              : `inset 0 2px 0 rgba(255,255,255,0.3), 0 8px 0 ${NOTE_COLORS[i]}88, 0 12px 24px rgba(0,0,0,0.3)`,
            transform: activa === i ? 'translateY(6px)' : 'translateY(0)',
            color: '#1a0830',
            textShadow: '0 1px 0 rgba(255,255,255,0.4)',
          }}
          aria-label={nota}
        >
          <span className="absolute inset-0 flex items-end justify-center pb-4">
            {nota}
          </span>
        </button>
      ))}
    </div>
  )
}

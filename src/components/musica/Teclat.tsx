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
    <div className="grid grid-cols-8 gap-1.5 sm:gap-2 w-full max-w-3xl mx-auto rounded-[18px_22px_16px_24px] border-[4px] border-midnight bg-[#7b4a2d] p-3 shadow-[6px_6px_0_var(--hb-midnight)]">
      {SOLFEIG_NOTES.map((nota, i) => (
        <button
          key={i}
          onMouseDown={() => tocar(i)}
          onTouchStart={(e) => { e.preventDefault(); tocar(i) }}
          className="relative h-32 sm:h-40 rounded-[8px_10px_8px_12px] border-[3px] border-midnight transition-all select-none font-pixel text-base sm:text-lg overflow-hidden"
          style={{
            background:
              `linear-gradient(90deg, rgba(255,255,255,0.18), transparent 22%, rgba(26,31,58,0.10) 65%), ` +
              `repeating-linear-gradient(90deg, ${NOTE_COLORS[i]} 0 9px, ${NOTE_COLORS[i]}dd 9px 18px)`,
            boxShadow: activa === i
              ? `inset 0 6px 0 rgba(0,0,0,0.2), 0 2px 0 #1a1f3a`
              : `inset 0 2px 0 rgba(255,255,255,0.3), 0 7px 0 #1a1f3a`,
            transform: activa === i ? 'translateY(6px)' : 'translateY(0)',
            color: '#1a1f3a',
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

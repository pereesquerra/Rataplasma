import { useEffect, useRef, useState } from 'react'
import { CANÇONS, type Cançó } from '@/lib/cancons'
import { SOLFEIG_NOTES, SOLFEIG_MIDIS, NOTE_COLORS } from '@/lib/audio-engine'
import { playNote, type Instrument } from '@/lib/instruments'

interface Props {
  instrument: Instrument
}

// Posició Y de cada nota al pentagrama (5 línies, clau de sol)
// Línies de baix a dalt: Mi Sol Si Re Fa
// Do4 va sota la línia amb línia addicional
// L'index 0 (Do) fins 7 (Do agut) mapeja a posició Y
const NOTE_Y: number[] = [
  140, // Do - sota pentagrama (línia addicional)
  130, // Re - sota pentagrama
  120, // Mi - línia 1 (baix)
  110, // Fa - espai 1
  100, // Sol - línia 2
  90,  // La - espai 2
  80,  // Si - línia 3 (central)
  70,  // Do' - espai 3
]

export default function Pentagrama({ instrument }: Props) {
  const [cancoId, setCancoId] = useState<string>(CANÇONS[0].id)
  const [playing, setPlaying] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(-1)
  const stopRef = useRef(false)

  const canco: Cançó = CANÇONS.find(c => c.id === cancoId) || CANÇONS[0]

  useEffect(() => {
    stopRef.current = true
    setPlaying(false)
    setCurrentIdx(-1)
  }, [cancoId])

  async function tocarCanco() {
    if (playing) { stopRef.current = true; setPlaying(false); return }
    stopRef.current = false
    setPlaying(true)
    const beatMs = 60000 / canco.bpm / 2 // 1 corxera

    for (let i = 0; i < canco.notes.length; i++) {
      if (stopRef.current) break
      const [noteIdx, dur] = canco.notes[i]
      setCurrentIdx(i)
      playNote(SOLFEIG_MIDIS[noteIdx], (dur * beatMs) / 1000 * 0.9, instrument)
      await new Promise(r => setTimeout(r, dur * beatMs))
    }
    setCurrentIdx(-1)
    setPlaying(false)
  }

  function tocarNota(noteIdx: number) {
    playNote(SOLFEIG_MIDIS[noteIdx], 0.5, instrument)
  }

  // Amplada dinàmica segons nombre de notes
  const width = Math.max(600, canco.notes.length * 48 + 120)
  const noteSpacing = (width - 120) / canco.notes.length

  return (
    <div className="w-full">
      {/* Selector i botó */}
      <div className="flex flex-wrap gap-2 items-center justify-center mb-4">
        <div className="flex gap-2 flex-wrap">
          {CANÇONS.map(c => (
            <button
              key={c.id}
              onClick={() => setCancoId(c.id)}
              className={`px-3 py-2 rounded-lg font-terminal text-sm border-2 transition-all ${
                cancoId === c.id
                  ? 'bg-phantom text-ink border-phantom'
                  : 'bg-mist/40 text-bone border-phantom/40 hover:border-phantom'
              }`}
            >
              {c.titol}
            </button>
          ))}
        </div>
        <button
          onClick={tocarCanco}
          className="ml-2 px-5 py-2 rounded-full bg-gradient-to-br from-phantom to-haunt text-ink font-pixel text-sm border-2 border-ink/30 shadow-[0_4px_0_rgba(0,0,0,0.4)] active:translate-y-1 active:shadow-none transition-transform"
        >
          {playing ? '■ ATURA' : '▶ TOCAR'}
        </button>
      </div>

      {/* Pentagrama SVG scrollable horitzontalment */}
      <div className="overflow-x-auto rounded-xl bg-bone/95 p-4 shadow-inner border-2 border-phantom/30">
        <svg
          viewBox={`0 0 ${width} 180`}
          width={width}
          height={180}
          className="mx-auto"
          style={{ minWidth: '100%' }}
        >
          {/* Clau de sol simplificada */}
          <text x="20" y="115" fontSize="60" fill="#1a0830" fontFamily="serif">𝄞</text>

          {/* 5 línies del pentagrama */}
          {[80, 90, 100, 110, 120].map(y => (
            <line key={y} x1="90" y1={y} x2={width - 20} y2={y} stroke="#1a0830" strokeWidth="1.5"/>
          ))}

          {/* Notes */}
          {canco.notes.map(([noteIdx, dur], i) => {
            const x = 110 + i * noteSpacing
            const y = NOTE_Y[noteIdx]
            const isActive = currentIdx === i
            const color = NOTE_COLORS[noteIdx]
            const letraSolfeig = SOLFEIG_NOTES[noteIdx]
            // Línia addicional per a Do (sota el pentagrama)
            const showLedger = noteIdx === 0
            return (
              <g key={i} className="cursor-pointer" onClick={() => tocarNota(noteIdx)}>
                {showLedger && (
                  <line x1={x - 12} y1={140} x2={x + 12} y2={140} stroke="#1a0830" strokeWidth="1.5"/>
                )}
                {/* cap de nota */}
                <ellipse
                  cx={x}
                  cy={y}
                  rx="10"
                  ry="7"
                  fill={isActive ? '#ff4466' : color}
                  stroke="#1a0830"
                  strokeWidth="2"
                  transform={`rotate(-20 ${x} ${y})`}
                >
                  {isActive && (
                    <animate
                      attributeName="rx"
                      values="10;14;10"
                      dur="0.3s"
                    />
                  )}
                </ellipse>
                {/* plica (stem) */}
                <line
                  x1={x + 9}
                  y1={y - 2}
                  x2={x + 9}
                  y2={y - 35}
                  stroke="#1a0830"
                  strokeWidth="2"
                />
                {/* corxera flag si dur < 2 */}
                {dur < 2 && (
                  <path
                    d={`M ${x + 9} ${y - 35} Q ${x + 20} ${y - 28} ${x + 16} ${y - 18}`}
                    stroke="#1a0830"
                    strokeWidth="2"
                    fill="none"
                  />
                )}
                {/* nom solfeig a sota */}
                <text
                  x={x}
                  y="165"
                  fontSize="11"
                  fill={isActive ? '#ff4466' : '#1a0830'}
                  textAnchor="middle"
                  fontWeight="700"
                  fontFamily="monospace"
                >
                  {letraSolfeig}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <p className="text-bone/60 text-sm font-terminal text-center mt-2">
        clica qualsevol nota per tocar-la · o prem ▶ per escoltar sencera
      </p>
    </div>
  )
}

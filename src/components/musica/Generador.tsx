import { useRef, useState } from 'react'
import { SOLFEIG_NOTES, SOLFEIG_MIDIS, NOTE_COLORS } from '@/lib/audio-engine'
import { playNote, type Instrument } from '@/lib/instruments'

interface Props {
  instrument: Instrument
}

export default function Generador({ instrument }: Props) {
  const [sequencia, setSequencia] = useState<number[]>([])
  const [playing, setPlaying] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(-1)
  const stopRef = useRef(false)

  function afegirNota(noteIdx: number) {
    if (sequencia.length >= 32) return
    playNote(SOLFEIG_MIDIS[noteIdx], 0.4, instrument)
    setSequencia(s => [...s, noteIdx])
  }

  function esborrar() {
    setSequencia([])
  }

  function desfer() {
    setSequencia(s => s.slice(0, -1))
  }

  async function reproduir() {
    if (playing) { stopRef.current = true; setPlaying(false); return }
    if (sequencia.length === 0) return
    stopRef.current = false
    setPlaying(true)
    for (let i = 0; i < sequencia.length; i++) {
      if (stopRef.current) break
      setCurrentIdx(i)
      playNote(SOLFEIG_MIDIS[sequencia[i]], 0.35, instrument)
      await new Promise(r => setTimeout(r, 280))
    }
    setCurrentIdx(-1)
    setPlaying(false)
  }

  return (
    <div className="w-full">
      {/* Caixa amb la seqüència gravada */}
      <div className="min-h-[96px] rounded-[18px_22px_16px_24px] bg-[#fff8dc] border-[4px] border-midnight shadow-[6px_6px_0_var(--hb-midnight)] p-3 mb-3 flex flex-wrap gap-1 items-start content-start">
        {sequencia.length === 0 ? (
          <span className="text-midnight/55 font-terminal text-sm self-center w-full text-center">
            prem les tecles per gravar la teva cançó (fins a 32 notes)
          </span>
        ) : sequencia.map((noteIdx, i) => (
          <div
            key={i}
            className="w-11 h-16 rounded-[6px_8px_6px_9px] flex items-end justify-center pb-1 font-pixel text-xs border-[3px] transition-all"
            style={{
              background: NOTE_COLORS[noteIdx],
              borderColor: currentIdx === i ? '#b9362c' : '#1a1f3a',
              transform: currentIdx === i ? 'translateY(-4px) scale(1.1)' : 'none',
              color: '#1a1f3a',
            }}
          >
            {SOLFEIG_NOTES[noteIdx]}
          </div>
        ))}
      </div>

      {/* Mini-teclat de 8 tecles compactes per afegir notes */}
      <div className="grid grid-cols-8 gap-1.5 mb-3">
        {SOLFEIG_NOTES.map((nota, i) => (
          <button
            key={i}
            onMouseDown={() => afegirNota(i)}
            onTouchStart={(e) => { e.preventDefault(); afegirNota(i) }}
            className="h-20 rounded-[8px_10px_8px_12px] font-pixel text-sm select-none active:translate-y-1 transition-transform border-[3px]"
            style={{
              background: NOTE_COLORS[i],
              borderColor: '#1a1f3a',
              boxShadow: '0 5px 0 #1a1f3a',
              color: '#1a1f3a',
            }}
          >
            {nota}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={reproduir}
          disabled={sequencia.length === 0}
          className="hb-button px-5 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {playing ? '■ ATURA' : '▶ TOCAR'}
        </button>
        <button
          onClick={desfer}
          disabled={sequencia.length === 0}
          className="px-4 py-2 rounded-full bg-moonbeam text-midnight font-pixel text-sm border-[3px] border-midnight shadow-[3px_3px_0_var(--hb-midnight)] active:translate-y-0.5 transition-transform disabled:opacity-40"
        >
          ⟲ desfer
        </button>
        <button
          onClick={esborrar}
          disabled={sequencia.length === 0}
          className="px-4 py-2 rounded-full bg-blood text-moonbeam font-pixel text-sm border-[3px] border-midnight shadow-[3px_3px_0_var(--hb-midnight)] active:translate-y-0.5 transition-transform disabled:opacity-40"
        >
          ✕ esborrar
        </button>
      </div>
    </div>
  )
}

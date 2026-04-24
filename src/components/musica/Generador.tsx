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
      <div className="min-h-[90px] rounded-xl bg-mist/60 border-2 border-phantom/30 p-3 mb-3 flex flex-wrap gap-1 items-start content-start">
        {sequencia.length === 0 ? (
          <span className="text-bone/50 font-terminal text-sm self-center w-full text-center">
            prem les tecles per gravar la teva cançó (fins a 32 notes)
          </span>
        ) : sequencia.map((noteIdx, i) => (
          <div
            key={i}
            className="w-11 h-16 rounded-md flex items-end justify-center pb-1 font-pixel text-xs border-2 transition-all"
            style={{
              background: NOTE_COLORS[noteIdx],
              borderColor: currentIdx === i ? '#ff4466' : 'rgba(0,0,0,0.25)',
              transform: currentIdx === i ? 'translateY(-4px) scale(1.1)' : 'none',
              color: '#1a0830',
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
            className="h-20 rounded-lg font-pixel text-sm select-none active:translate-y-1 transition-transform border-2"
            style={{
              background: NOTE_COLORS[i],
              borderColor: 'rgba(0,0,0,0.3)',
              boxShadow: `0 5px 0 ${NOTE_COLORS[i]}88`,
              color: '#1a0830',
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
          className="px-5 py-2 rounded-full bg-gradient-to-br from-phantom to-haunt text-ink font-pixel text-sm border-2 border-ink/30 shadow-[0_4px_0_rgba(0,0,0,0.4)] active:translate-y-1 active:shadow-none transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {playing ? '■ ATURA' : '▶ TOCAR'}
        </button>
        <button
          onClick={desfer}
          disabled={sequencia.length === 0}
          className="px-4 py-2 rounded-full bg-mist/60 text-bone font-pixel text-sm border-2 border-phantom/40 hover:border-phantom active:translate-y-0.5 transition-transform disabled:opacity-40"
        >
          ⟲ desfer
        </button>
        <button
          onClick={esborrar}
          disabled={sequencia.length === 0}
          className="px-4 py-2 rounded-full bg-blood/80 text-bone font-pixel text-sm border-2 border-ink/30 hover:bg-blood active:translate-y-0.5 transition-transform disabled:opacity-40"
        >
          ✕ esborrar
        </button>
      </div>
    </div>
  )
}

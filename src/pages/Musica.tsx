import { useState } from 'react'
import { Link } from 'react-router-dom'
import Teclat from '@/components/musica/Teclat'
import Pentagrama from '@/components/musica/Pentagrama'
import Generador from '@/components/musica/Generador'
import type { Instrument } from '@/lib/instruments'

const INSTRUMENTS: { id: Instrument; label: string; emoji: string }[] = [
  { id: 'piano',    label: 'Piano',    emoji: '🎹' },
  { id: 'xilofon',  label: 'Xilofon',  emoji: '🎵' },
  { id: 'rata',     label: 'Rata',     emoji: '🐀' },
  { id: 'synth',    label: 'Synth',    emoji: '🎛' },
]

export default function Musica() {
  const [instrument, setInstrument] = useState<Instrument>('piano')

  return (
    <div className="hb-page hb-paper min-h-screen pb-24">
      {/* Header */}
      <header className="hb-header">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <Link
            to="/"
            className="hb-back"
          >
            ← tornar
          </Link>
          <div className="text-center flex-1">
            <div className="hb-title text-base sm:text-xl">MÚSICA</div>
            <div className="font-terminal text-midnight/60 text-xs">toca, aprèn, crea</div>
          </div>
          <div className="w-16"></div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-10">
        {/* Selector d'instrument */}
        <section className="hb-card p-4 bg-[#7b4a2d] text-moonbeam">
          <div className="flex flex-wrap gap-2 justify-center">
            {INSTRUMENTS.map(ins => (
              <button
                key={ins.id}
                onClick={() => setInstrument(ins.id)}
                className={`relative px-4 py-3 rounded-full font-pixel text-sm border-[3px] border-midnight transition-all flex items-center gap-2 shadow-[3px_3px_0_var(--hb-midnight)] ${
                  instrument === ins.id
                    ? 'bg-mustard text-midnight'
                    : 'bg-moonbeam text-midnight hover:bg-ghost-blue'
                }`}
              >
                <span className="text-xl">{ins.emoji}</span>
                <span>{ins.label}</span>
              </button>
            ))}
          </div>
          <p className="text-center text-moonbeam/80 font-terminal text-xs mt-3">
            instrument actual: {INSTRUMENTS.find(i => i.id === instrument)?.label}
          </p>
        </section>

        {/* Secció 1: Teclat */}
        <section className="space-y-3">
          <h2 className="hb-title text-lg">TECLAT</h2>
          <p className="text-midnight/70 font-terminal text-sm">
            vuit notes de la escala. prem per tocar.
          </p>
          <Teclat instrument={instrument} />
        </section>

        {/* Secció 2: Pentagrama */}
        <section className="space-y-3">
          <h2 className="hb-title text-lg">CANÇONS I PENTAGRAMA</h2>
          <p className="text-midnight/70 font-terminal text-sm">
            mira el pentagrama i escolta. cada nota t&eacute; un color i un nom en solfeig.
          </p>
          <Pentagrama instrument={instrument} />
        </section>

        {/* Secció 3: Generador */}
        <section className="space-y-3">
          <h2 className="hb-title text-lg">FES LA TEVA CAN&Ccedil;&Oacute;</h2>
          <p className="text-midnight/70 font-terminal text-sm">
            clica tecles per gravar. la rata reprodueix el que has fet.
          </p>
          <Generador instrument={instrument} />
        </section>
      </main>
    </div>
  )
}

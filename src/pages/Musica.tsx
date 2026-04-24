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
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-ink/90 backdrop-blur-md border-b border-phantom/20 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <Link
            to="/"
            className="font-terminal text-phantom hover:text-haunt transition-colors text-lg"
          >
            ← tornar
          </Link>
          <div className="text-center flex-1">
            <div className="font-pixel text-phantom text-base sm:text-xl tracking-wider">MÚSICA</div>
            <div className="font-terminal text-bone/60 text-xs">toca, aprèn, crea</div>
          </div>
          <div className="w-16"></div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-10">
        {/* Selector d'instrument */}
        <section>
          <div className="flex flex-wrap gap-2 justify-center">
            {INSTRUMENTS.map(ins => (
              <button
                key={ins.id}
                onClick={() => setInstrument(ins.id)}
                className={`px-4 py-3 rounded-xl font-pixel text-sm border-2 transition-all flex items-center gap-2 ${
                  instrument === ins.id
                    ? 'bg-phantom text-ink border-phantom shadow-[0_4px_0_rgba(0,0,0,0.4)]'
                    : 'bg-mist/40 text-bone border-phantom/30 hover:border-phantom'
                }`}
              >
                <span className="text-xl">{ins.emoji}</span>
                <span>{ins.label}</span>
              </button>
            ))}
          </div>
          <p className="text-center text-bone/60 font-terminal text-xs mt-2">
            instrument actual: {INSTRUMENTS.find(i => i.id === instrument)?.label}
          </p>
        </section>

        {/* Secció 1: Teclat */}
        <section className="space-y-3">
          <h2 className="font-pixel text-phantom text-lg tracking-wider">▸ TECLAT</h2>
          <p className="text-bone/70 font-terminal text-sm">
            vuit notes de la escala. prem per tocar.
          </p>
          <Teclat instrument={instrument} />
        </section>

        {/* Secció 2: Pentagrama */}
        <section className="space-y-3">
          <h2 className="font-pixel text-phantom text-lg tracking-wider">▸ CANÇONS I PENTAGRAMA</h2>
          <p className="text-bone/70 font-terminal text-sm">
            mira el pentagrama i escolta. cada nota t&eacute; un color i un nom en solfeig.
          </p>
          <Pentagrama instrument={instrument} />
        </section>

        {/* Secció 3: Generador */}
        <section className="space-y-3">
          <h2 className="font-pixel text-phantom text-lg tracking-wider">▸ FES LA TEVA CAN&Ccedil;&Oacute;</h2>
          <p className="text-bone/70 font-terminal text-sm">
            clica tecles per gravar. la rata reprodueix el que has fet.
          </p>
          <Generador instrument={instrument} />
        </section>
      </main>
    </div>
  )
}

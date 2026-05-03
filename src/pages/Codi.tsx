import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

type Level = 1 | 2 | 3
type DemoId = 'crit' | 'fantasma'

const LEVELS: { id: Level; title: string; sub: string; emoji: string }[] = [
  { id: 1, title: 'Valors', sub: 'mou els sliders', emoji: '🎚' },
  { id: 2, title: 'Blocs',  sub: 'encadena passos', emoji: '🧩' },
  { id: 3, title: 'JS real', sub: 'el codi de veritat', emoji: '⌨️' },
]

const DEMOS: { id: DemoId; label: string; emoji: string }[] = [
  { id: 'crit',     label: 'Toca un crit',  emoji: '📢' },
  { id: 'fantasma', label: 'Mou el fantasma', emoji: '👻' },
]

export default function Codi() {
  const [level, setLevel] = useState<Level>(1)
  const [demo, setDemo] = useState<DemoId>('crit')

  return (
    <div className="codi-page hb-page hb-paper min-h-screen pb-24">
      <header className="hb-header">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <Link
            to="/"
            className="hb-back"
          >
            ← tornar
          </Link>
          <div className="text-center flex-1">
            <div className="hb-title text-base sm:text-xl">CODI</div>
            <div className="font-terminal text-midnight/60 text-xs">mira com es fa</div>
          </div>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-8">
        <ProfessorCard level={level} />

        <section className="space-y-3">
          <div className="terminal-label px-1">nivell</div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {LEVELS.map(l => (
              <button
                key={l.id}
                onClick={() => setLevel(l.id)}
                className={`relative p-3 sm:p-4 transition-all text-left rotate-[-1deg] ${
                  level === l.id
                    ? 'bg-mustard border-[3px] border-midnight shadow-[5px_5px_0_var(--hb-midnight)]'
                    : 'bg-moonbeam border-[3px] border-midnight shadow-[3px_3px_0_var(--hb-midnight)] hover:bg-[#fff3bf]'
                }`}
                style={{ borderRadius: '14px 18px 12px 20px' }}
              >
                <div className="text-2xl mb-1">{l.emoji}</div>
                <div className="font-pixel text-midnight text-xs sm:text-sm">N{l.id} · {l.title}</div>
                <div className="font-terminal text-midnight/60 text-xs">{l.sub}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <div className="terminal-label px-1">demo</div>
          <div className="flex flex-wrap gap-2">
            {DEMOS.map(d => (
              <button
                key={d.id}
                onClick={() => setDemo(d.id)}
                className={`px-4 py-3 font-pixel text-xs border-[3px] border-midnight rounded-[18px_22px_16px_24px] transition-all flex items-center gap-2 shadow-[3px_3px_0_var(--hb-midnight)] ${
                  demo === d.id
                    ? 'bg-avocado text-midnight'
                    : 'bg-moonbeam text-midnight hover:bg-mustard'
                }`}
              >
                <span className="text-lg">{d.emoji}</span> {d.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          {demo === 'crit'     && <DemoCrit level={level} />}
          {demo === 'fantasma' && <DemoFantasma level={level} />}
        </section>

        {level === 2 && <MobileBlocksHint />}
      </main>
    </div>
  )
}

/* ============ Professor card ============ */

function ProfessorCard({ level }: { level: Level }) {
  const text = level === 1
    ? 'Comença pels sliders. Toca, mou, escolta. No cal escriure res.'
    : level === 2
      ? 'Encadena blocs com si fossin LEGO. Cada bloc és un pas que la rata fa.'
      : 'Aquí veus codi de veritat (el mateix que fa servir la web). Pots tocar els números i veure què passa.'
  return (
    <div className="hb-card flex items-center gap-4 p-4 bg-moonbeam/95">
      <MiniGhost size={64} glow={28} />
      <div className="flex-1">
        <div className="terminal-label mb-1">professora rata</div>
        <div className="font-body text-midnight/90 text-sm leading-snug">{text}</div>
      </div>
    </div>
  )
}

/* ============ Mini ghost (mascot petit reutilitzable) ============ */

function MiniGhost({
  size = 80,
  glow = 32,
  breathSpeed = 4,
  hue = 200, // 200 = blau
}: {
  size?: number
  glow?: number
  breathSpeed?: number
  hue?: number
}) {
  const glowColor = `hsl(${hue} 100% 65% / 0.7)`
  const haloColor = `hsl(${hue} 100% 75% / 0.5)`
  return (
    <div
      style={{
        width: size,
        height: size * 1.18,
        position: 'relative',
        animation: `ghostBreath ${breathSpeed}s ease-in-out infinite`,
      }}
    >
      <style>{`
        @keyframes ghostBreath {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-${Math.max(2, size * 0.04)}px) scale(1.04); }
        }
      `}</style>
      <svg
        viewBox="0 0 100 118"
        width="100%"
        height="100%"
        style={{
          filter: `drop-shadow(0 0 ${glow}px ${glowColor}) drop-shadow(0 0 ${glow * 1.6}px ${haloColor})`,
          overflow: 'visible',
        }}
      >
        <defs>
          <radialGradient id={`g-${hue}`} cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.99" />
            <stop offset="55%" stopColor="#eaf6ff" stopOpacity="0.95" />
            <stop offset="100%" stopColor={`hsl(${hue} 100% 70%)`} stopOpacity="0.55" />
          </radialGradient>
        </defs>
        {/* orelles */}
        <ellipse cx="28" cy="22" rx="9" ry="11" fill="#ffd0e0" transform="rotate(-22 28 22)" />
        <ellipse cx="72" cy="22" rx="9" ry="11" fill="#ffd0e0" transform="rotate(22 72 22)" />
        {/* cos en forma de fantasma */}
        <path
          d="M 18 50 C 18 22, 82 22, 82 50 L 82 95 Q 78 110 70 100 Q 62 110 54 100 Q 50 110 42 100 Q 34 110 26 100 Q 22 110 18 95 Z"
          fill={`url(#g-${hue})`}
        />
        {/* ulls */}
        <ellipse cx="38" cy="55" rx="6" ry="8" fill="#fff" />
        <ellipse cx="62" cy="55" rx="6" ry="8" fill="#fff" />
        <ellipse cx="38" cy="57" rx="3" ry="5" fill={`hsl(${hue} 80% 30%)`} />
        <ellipse cx="62" cy="57" rx="3" ry="5" fill={`hsl(${hue} 80% 30%)`} />
        <circle cx="39.5" cy="54" r="1.4" fill="#fff" />
        <circle cx="63.5" cy="54" r="1.4" fill="#fff" />
        {/* nas + boca */}
        <ellipse cx="50" cy="68" rx="2" ry="1.5" fill="#ffb3cd" />
        <path d="M 44 75 Q 50 80 56 75" stroke="#1d6ea8" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  )
}

/* ============ Demo: Toca un crit ============
 * Sintetitza un crit amb 3 paràmetres:
 *  - frequency (Hz)        : altura del crit
 *  - distortion (curveAmt) : grunyit / brutícia
 *  - duration (s)          : durada
 */

function DemoCrit({ level }: { level: Level }) {
  const [freq, setFreq]   = useState(420)
  const [dist, setDist]   = useState(35)
  const [dur,  setDur]    = useState(1.2)
  const [active, setActive] = useState<null | 'freq' | 'dist' | 'dur'>(null)

  const audioCtxRef = useRef<AudioContext | null>(null)
  function getCtx() {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext()
    return audioCtxRef.current
  }

  function makeDistortionCurve(amount: number) {
    const k = amount
    const n = 256
    const curve = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / n - 1
      curve[i] = ((3 + k) * x * 20 * (Math.PI / 180)) / (Math.PI + k * Math.abs(x))
    }
    return curve
  }

  function tocar() {
    const ctx = getCtx()
    if (ctx.state === 'suspended') ctx.resume()
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(freq, now)
    osc.frequency.exponentialRampToValueAtTime(Math.max(60, freq * 0.4), now + dur)

    const shaper = ctx.createWaveShaper()
    shaper.curve = makeDistortionCurve(dist)
    shaper.oversample = '4x'

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 2400
    filter.Q.value = 6

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.5, now + 0.04)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur)

    osc.connect(shaper).connect(filter).connect(gain).connect(ctx.destination)
    osc.start(now)
    osc.stop(now + dur + 0.1)
  }

  /* === Nivell 1 === */
  if (level === 1) {
    return (
      <DemoFrame title="📢 Toca un crit · valors">
        <div className="space-y-5">
          <Slider label="🔊 Altura"   value={freq} min={120} max={900} step={10} onChange={setFreq} suffix=" Hz" />
          <Slider label="🌪 Brutícia" value={dist} min={0}   max={100} step={1}  onChange={setDist} />
          <Slider label="⏱ Durada"   value={dur}  min={0.2} max={3}   step={0.1} onChange={v => setDur(+v.toFixed(1))} suffix=" s" />
          <PlayBtn onClick={tocar}>Tocar</PlayBtn>
          <Hint>Cada slider és un “número clau” del codi. Al Nivell 2 i 3 el veuràs escrit.</Hint>
        </div>
      </DemoFrame>
    )
  }

  /* === Nivell 2 === */
  if (level === 2) {
    return (
      <DemoFrame title="📢 Toca un crit · blocs">
        <BlockBuilder
          blocks={[
            { color: 'bg-mustard', label: 'oscil·lador',  value: 'sawtooth (cru)' },
            { color: 'bg-ghost-blue', label: 'altura',       value: `${freq} Hz` },
            { color: 'bg-avocado',    label: 'distorsió',    value: `nivell ${dist}` },
            { color: 'bg-pumpkin',    label: 'volum',        value: 'puja, baixa' },
            { color: 'bg-harvest text-moonbeam', label: 'durada', value: `${dur.toFixed(1)} s` },
          ]}
        />
        <div className="space-y-4 mt-5">
          <Slider label="altura"    value={freq} min={120} max={900} step={10} onChange={setFreq} suffix=" Hz" />
          <Slider label="distorsió" value={dist} min={0}   max={100} step={1}  onChange={setDist} />
          <Slider label="durada"    value={dur}  min={0.2} max={3}   step={0.1} onChange={v => setDur(+v.toFixed(1))} suffix=" s" />
          <PlayBtn onClick={tocar}>▶ Executar la cadena</PlayBtn>
          <Hint>Cada bloc és una peça que el so necessita. L'ordre importa: l'oscil·lador surt primer, el volum apaga al final.</Hint>
        </div>
      </DemoFrame>
    )
  }

  /* === Nivell 3 === */
  return (
    <DemoFrame title="📢 Toca un crit · JavaScript">
      <CodeWithArrows
        active={active}
        onPickNumber={(id) => {
          if (id === 'freq' || id === 'dist' || id === 'dur') setActive(id)
        }}
        lines={[
          { id: null, text: 'const ctx = new AudioContext()' },
          { id: null, text: 'const osc = ctx.createOscillator()' },
          { id: null, text: 'osc.type = "sawtooth"' },
          { id: 'freq', text: `osc.frequency.value = ${freq}   // altura` },
          { id: null, text: 'const shaper = ctx.createWaveShaper()' },
          { id: 'dist', text: `shaper.curve = corba(${dist})    // brutícia` },
          { id: null, text: 'osc.connect(shaper)' },
          { id: null, text: '       .connect(ctx.destination)' },
          { id: null, text: 'osc.start()' },
          { id: 'dur', text: `osc.stop(ctx.currentTime + ${dur.toFixed(1)})  // durada` },
        ]}
        controls={{
          freq: <Slider label="freq" value={freq} min={120} max={900} step={10} onChange={setFreq} suffix=" Hz" />,
          dist: <Slider label="dist" value={dist} min={0}   max={100} step={1}  onChange={setDist} />,
          dur:  <Slider label="dur"  value={dur}  min={0.2} max={3}   step={0.1} onChange={v => setDur(+v.toFixed(1))} suffix=" s" />,
        }}
      />
      <div className="mt-5">
        <PlayBtn onClick={tocar}>▶ Tocar amb aquests valors</PlayBtn>
        <Hint>Aquest és (gairebé) el mateix codi que fa servir el botó RATAPLASMAAA. Els 3 números clau són la freqüència, la distorsió i la durada.</Hint>
      </div>
    </DemoFrame>
  )
}

/* ============ Demo: Mou el fantasma ============ */

function DemoFantasma({ level }: { level: Level }) {
  const [size, setSize]    = useState(140)
  const [glow, setGlow]    = useState(36)
  const [speed, setSpeed]  = useState(4)
  const [hue, setHue]      = useState(200)
  const [active, setActive] = useState<null | 'size' | 'glow' | 'speed' | 'hue'>(null)

  const visual = (
    <div className="flex items-center justify-center min-h-[220px] py-6">
      <MiniGhost size={size} glow={glow} breathSpeed={speed} hue={hue} />
    </div>
  )

  if (level === 1) {
    return (
      <DemoFrame title="👻 Mou el fantasma · valors">
        {visual}
        <div className="space-y-5">
          <Slider label="📏 Mida"    value={size}  min={60}  max={240} step={5}   onChange={setSize}  suffix=" px" />
          <Slider label="✨ Glow"    value={glow}  min={0}   max={80}  step={1}   onChange={setGlow}  suffix=" px" />
          <Slider label="💨 Velocitat" value={speed} min={1}   max={10}  step={0.2} onChange={v => setSpeed(+v.toFixed(1))} suffix=" s" />
          <Slider label="🎨 Color"   value={hue}   min={0}   max={360} step={5}   onChange={setHue}   suffix="°" />
          <Hint>El fantasma respira sol. La velocitat fa que respiri més ràpid o més lent.</Hint>
        </div>
      </DemoFrame>
    )
  }

  if (level === 2) {
    return (
      <DemoFrame title="👻 Mou el fantasma · blocs">
        {visual}
        <BlockBuilder
          blocks={[
            { color: 'bg-mustard', label: 'crear',     value: 'fantasma' },
            { color: 'bg-ghost-blue', label: 'mida',      value: `${size} px` },
            { color: 'bg-avocado',    label: 'color',     value: `hue ${hue}°` },
            { color: 'bg-pumpkin',    label: 'glow',      value: `${glow} px` },
            { color: 'bg-harvest text-moonbeam', label: 'respira', value: `cada ${speed.toFixed(1)}s` },
          ]}
        />
        <div className="space-y-4 mt-5">
          <Slider label="mida"      value={size}  min={60}  max={240} step={5}   onChange={setSize}  suffix=" px" />
          <Slider label="glow"      value={glow}  min={0}   max={80}  step={1}   onChange={setGlow}  suffix=" px" />
          <Slider label="velocitat" value={speed} min={1}   max={10}  step={0.2} onChange={v => setSpeed(+v.toFixed(1))} suffix=" s" />
          <Slider label="color"     value={hue}   min={0}   max={360} step={5}   onChange={setHue}   suffix="°" />
          <Hint>Els blocs s'executen un darrere l'altre: primer crear, després pintar, finalment fer respirar.</Hint>
        </div>
      </DemoFrame>
    )
  }

  return (
    <DemoFrame title="👻 Mou el fantasma · JavaScript">
      {visual}
      <CodeWithArrows
        active={active}
        onPickNumber={(id) => {
          if (id === 'size' || id === 'glow' || id === 'speed' || id === 'hue') setActive(id)
        }}
        lines={[
          { id: null,    text: 'function Ghost({ size, glow, hue, speed }) {' },
          { id: 'size',  text: `  const w = ${size}             // mida en px` },
          { id: 'glow',  text: `  const blur = ${glow}            // glow exterior` },
          { id: 'hue',   text: `  const tint = "hsl(${hue}, 100%, 65%)" // color` },
          { id: 'speed', text: `  const breath = "${speed.toFixed(1)}s"          // velocitat respiració` },
          { id: null,    text: '  return <svg style={{ width: w, filter: `drop-shadow(0 0 ${blur}px ${tint})` }} />' },
          { id: null,    text: '}' },
        ]}
        controls={{
          size:  <Slider label="size"  value={size}  min={60}  max={240} step={5}   onChange={setSize}  suffix=" px" />,
          glow:  <Slider label="glow"  value={glow}  min={0}   max={80}  step={1}   onChange={setGlow}  suffix=" px" />,
          hue:   <Slider label="hue"   value={hue}   min={0}   max={360} step={5}   onChange={setHue}   suffix="°" />,
          speed: <Slider label="speed" value={speed} min={1}   max={10}  step={0.2} onChange={v => setSpeed(+v.toFixed(1))} suffix=" s" />,
        }}
      />
      <Hint>El fantasma de dalt es repinta cada vegada que canvies un número. Així funciona React: número canvia → component es redibuixa.</Hint>
    </DemoFrame>
  )
}

/* ============ Building blocks ============ */

function DemoFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="hb-card p-4 sm:p-6"
      style={{
        backgroundImage:
          'linear-gradient(90deg, rgba(185,78,44,0.28) 0 2px, transparent 2px), repeating-linear-gradient(0deg, rgba(26,31,58,0.13) 0 1px, transparent 1px 28px)',
        backgroundPosition: '52px 0, 0 18px',
      }}
    >
      <div className="hb-title text-base mb-4">{title}</div>
      {children}
    </div>
  )
}

function Slider({
  label, value, min, max, step, onChange, suffix = '',
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  suffix?: string
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-1">
        <span className="font-terminal text-midnight/80 text-sm font-bold">{label}</span>
        <span className="font-pixel text-harvest text-xs">{value}{suffix}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full accent-pumpkin"
      />
    </label>
  )
}

function PlayBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="hb-button w-full py-3 text-sm"
    >
      {children}
    </button>
  )
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 text-xs font-terminal text-midnight/65 leading-snug font-bold">💡 {children}</div>
  )
}

function BlockBuilder({ blocks }: { blocks: { color: string; label: string; value: string }[] }) {
  return (
    <div className="flex flex-col gap-2">
      {blocks.map((b, i) => (
        <div
          key={i}
          className={`flex items-center gap-3 px-4 py-3 rounded-[14px_20px_14px_18px] ${b.color} border-[3px] border-midnight shadow-[4px_4px_0_var(--hb-midnight)]`}
        >
          <div className="font-pixel text-midnight text-xs w-6 text-center bg-white/50 rounded border-2 border-midnight">{i + 1}</div>
          <div className="font-pixel text-current text-xs sm:text-sm flex-1">{b.label}</div>
          <div className="font-terminal text-current text-sm opacity-80">{b.value}</div>
        </div>
      ))}
    </div>
  )
}

/* ============ CodeWithArrows ============
 * Mostra codi amb números clau clicables; dibuixa fletxes SVG des de cada número
 * fins al control corresponent del panell de la dreta.
 */

interface CodeLine { id: string | null; text: string }

function CodeWithArrows({
  lines, controls, active, onPickNumber,
}: {
  lines: CodeLine[]
  controls: Record<string, React.ReactNode>
  active: string | null
  onPickNumber: (id: string) => void
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const lineRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const ctrlRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [arrows, setArrows] = useState<{ id: string; x1: number; y1: number; x2: number; y2: number }[]>([])
  const [tick, setTick] = useState(0)

  useLayoutEffect(() => {
    function compute() {
      if (!wrapRef.current) return
      const wb = wrapRef.current.getBoundingClientRect()
      const next: typeof arrows = []
      Object.keys(controls).forEach(id => {
        const a = lineRefs.current[id]
        const b = ctrlRefs.current[id]
        if (!a || !b) return
        const ar = a.getBoundingClientRect()
        const br = b.getBoundingClientRect()
        next.push({
          id,
          x1: ar.right - wb.left,
          y1: ar.top + ar.height / 2 - wb.top,
          x2: br.left - wb.left,
          y2: br.top + br.height / 2 - wb.top,
        })
      })
      setArrows(next)
    }
    compute()
    const ro = new ResizeObserver(compute)
    if (wrapRef.current) ro.observe(wrapRef.current)
    window.addEventListener('resize', compute)
    window.addEventListener('scroll', compute, true)
    return () => { ro.disconnect(); window.removeEventListener('resize', compute); window.removeEventListener('scroll', compute, true) }
  }, [controls, tick])

  // recalcular quan canvien valors (les línies de codi creixen amb el text)
  useEffect(() => { setTick(t => t + 1) }, [JSON.stringify(lines)])

  return (
    <div ref={wrapRef} className="relative grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
      {/* Codi */}
      <div className="rounded-[14px_18px_12px_20px] bg-[#fff8dc] border-[3px] border-midnight shadow-[4px_4px_0_var(--hb-midnight)] p-3 font-mono text-[12px] sm:text-[13px] leading-6 overflow-x-auto">
        {lines.map((l, i) => (
          <div
            key={i}
            ref={el => { if (l.id) lineRefs.current[l.id] = el }}
            onClick={() => l.id && onPickNumber(l.id)}
            className={`whitespace-pre ${l.id
              ? `cursor-pointer rounded px-1 -mx-1 transition-colors ${active === l.id ? 'bg-mustard text-midnight outline outline-2 outline-harvest' : 'text-harvest hover:bg-mustard/30'}`
              : 'text-midnight/70'}`}
          >
            {syntaxColor(l.text)}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {Object.entries(controls).map(([id, ctrl]) => (
          <div
            key={id}
            ref={el => { ctrlRefs.current[id] = el }}
            className={`rounded-[14px_18px_12px_20px] border-[3px] p-3 transition-all ${active === id
              ? 'border-midnight bg-mustard shadow-[4px_4px_0_var(--hb-midnight)]'
              : 'border-midnight bg-moonbeam shadow-[3px_3px_0_rgba(26,31,58,0.45)]'}`}
          >
            {ctrl}
          </div>
        ))}
      </div>

      {/* Fletxes (només a partir de md:) */}
      <svg
        className="pointer-events-none absolute inset-0 hidden md:block"
        width="100%" height="100%"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <marker id="arrowHead" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#1a1f3a" />
          </marker>
        </defs>
        {arrows.map(a => {
          const dx = a.x2 - a.x1
          const cx1 = a.x1 + Math.max(40, dx * 0.4)
          const cx2 = a.x2 - Math.max(40, dx * 0.4)
          const isActive = active === a.id
          return (
            <path
              key={a.id}
              d={`M ${a.x1} ${a.y1} C ${cx1} ${a.y1}, ${cx2} ${a.y2}, ${a.x2} ${a.y2}`}
              stroke={isActive ? '#b94e2c' : '#1a1f3a'}
              strokeWidth={isActive ? 3.5 : 2.4}
              fill="none"
              strokeDasharray="6 8"
              markerEnd="url(#arrowHead)"
              style={{
                animation: `dash-${isActive ? 'fast' : 'slow'} 1.6s linear infinite`,
                filter: isActive ? 'drop-shadow(2px 2px 0 rgba(244,197,66,0.9))' : undefined,
              }}
            />
          )
        })}
        <style>{`
          @keyframes dash-slow { to { stroke-dashoffset: -28; } }
          @keyframes dash-fast { to { stroke-dashoffset: -56; } }
        `}</style>
      </svg>
    </div>
  )
}

/* Tokenizer molt simple per fer que els nombres i cadenes destaquin */
function syntaxColor(text: string) {
  // splits: keywords, strings, numbers, comments
  const parts: { t: 'k' | 's' | 'n' | 'c' | 'p'; v: string }[] = []
  const re = /(\/\/.*$)|("[^"]*"|`[^`]*`)|(\b\d+(\.\d+)?\b)|(\b(const|function|return|new|let)\b)/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ t: 'p', v: text.slice(last, m.index) })
    if (m[1])      parts.push({ t: 'c', v: m[1] })
    else if (m[2]) parts.push({ t: 's', v: m[2] })
    else if (m[3]) parts.push({ t: 'n', v: m[3] })
    else if (m[5]) parts.push({ t: 'k', v: m[5] })
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push({ t: 'p', v: text.slice(last) })

  return parts.map((p, i) => {
    const cls =
      p.t === 'k' ? 'text-harvest font-bold' :
      p.t === 's' ? 'text-pumpkin font-bold' :
      p.t === 'n' ? 'text-avocado font-bold' :
      p.t === 'c' ? 'text-midnight/45 italic' : ''
    return <span key={i} className={cls}>{p.v}</span>
  })
}

function MobileBlocksHint() {
  return (
    <div className="md:hidden text-xs font-terminal text-midnight/60 px-1">
      📱 Al mòbil els blocs es mostren com a llista. Per encaixar-los amb el dit, obre la web a un ordinador.
    </div>
  )
}

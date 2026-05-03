import RoomShell from '@/components/RoomShell'
import { DragEvent, useMemo, useState } from 'react'
import { playBlip } from '@/lib/audio'

type Level = 'sliders' | 'blocks' | 'js'
type Demo = 'crit' | 'fantasma'

const blockLabels = {
  crit: ['preparar ona', 'tocar nota Do', 'embrutar so', 'esperar 0.5 segons'],
  fantasma: ['crear fantasma', 'fer mes gran', 'encendre glow', 'flotar amunt'],
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export default function Codi() {
  const [level, setLevel] = useState<Level>('sliders')
  const [demo, setDemo] = useState<Demo>('crit')
  const [freq, setFreq] = useState(520)
  const [duration, setDuration] = useState(0.45)
  const [dirt, setDirt] = useState(18)
  const [size, setSize] = useState(118)
  const [glow, setGlow] = useState(26)
  const [speed, setSpeed] = useState(2.4)
  const [blocks, setBlocks] = useState(blockLabels.crit)
  const [dragged, setDragged] = useState<number | null>(null)

  const code = useMemo(() => {
    if (demo === 'crit') {
      return `const crit = crearCrit({\n  frequencia: ${freq},\n  durada: ${duration.toFixed(2)},\n  bruticia: ${dirt}\n})\ncrit.toca()`
    }
    return `const fantasma = crearFantasma({\n  mida: ${size},\n  glow: ${glow},\n  velocitat: ${speed.toFixed(1)}\n})\nfantasma.flota()`
  }, [demo, dirt, duration, freq, glow, size, speed])

  function changeDemo(next: Demo) {
    setDemo(next)
    setBlocks(blockLabels[next])
  }

  function runDemo() {
    if (demo === 'crit') {
      playBlip(freq, duration, dirt > 45 ? 'sawtooth' : 'triangle')
    } else {
      playBlip(420 + size * 2, 0.16, 'sine')
    }
  }

  function dropOn(index: number) {
    if (dragged === null || dragged === index) return
    setBlocks((current) => {
      const next = [...current]
      const [item] = next.splice(dragged, 1)
      next.splice(index, 0, item)
      return next
    })
    setDragged(null)
  }

  function onCodeChange(value: string) {
    const numberFor = (name: string, fallback: number) => {
      const match = value.match(new RegExp(`${name}:\\s*([0-9.]+)`))
      return match ? Number(match[1]) : fallback
    }
    if (demo === 'crit') {
      setFreq(clamp(numberFor('frequencia', freq), 120, 1200))
      setDuration(clamp(numberFor('durada', duration), 0.1, 2))
      setDirt(clamp(numberFor('bruticia', dirt), 0, 90))
    } else {
      setSize(clamp(numberFor('mida', size), 70, 190))
      setGlow(clamp(numberFor('glow', glow), 0, 70))
      setSpeed(clamp(numberFor('velocitat', speed), 0.8, 5))
    }
  }

  return (
    <RoomShell title="Codi que es mou" kicker="laboratori de JavaScript" mascotMood="sorpres">
      <section className="code-room">
        <div className="segmented" role="tablist" aria-label="Nivells de codi">
          {[
            ['sliders', '1 Sliders'],
            ['blocks', '2 Blocs'],
            ['js', '3 JS real'],
          ].map(([id, label]) => (
            <button className={`chip-button ${level === id ? 'is-active' : ''}`} onClick={() => setLevel(id as Level)} key={id}>
              {label}
            </button>
          ))}
        </div>

        <div className="segmented" aria-label="Demos">
          <button className={`chip-button ${demo === 'crit' ? 'is-active' : ''}`} onClick={() => changeDemo('crit')}>Crit sonor</button>
          <button className={`chip-button ${demo === 'fantasma' ? 'is-active' : ''}`} onClick={() => changeDemo('fantasma')}>Fantasma viu</button>
        </div>

        <div className="code-layout">
          <section className="code-controls">
            {level === 'sliders' && (
              <SliderDemo
                demo={demo}
                freq={freq}
                duration={duration}
                dirt={dirt}
                size={size}
                glow={glow}
                speed={speed}
                setFreq={setFreq}
                setDuration={setDuration}
                setDirt={setDirt}
                setSize={setSize}
                setGlow={setGlow}
                setSpeed={setSpeed}
              />
            )}

            {level === 'blocks' && (
              <div className="blocks-board">
                {blocks.map((block, index) => (
                  <button
                    draggable
                    className="code-block"
                    key={block}
                    onDragStart={(event: DragEvent<HTMLButtonElement>) => {
                      setDragged(index)
                      event.dataTransfer.effectAllowed = 'move'
                    }}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => dropOn(index)}
                  >
                    <span>{index + 1}</span>
                    {block}
                  </button>
                ))}
                <button className="primary-action" onClick={runDemo}>Play blocs</button>
              </div>
            )}

            {level === 'js' && (
              <div className="code-editor">
                <textarea value={code} onChange={(event) => onCodeChange(event.target.value)} aria-label="Editor JavaScript" rows={7} />
                <pre aria-hidden="true">{highlight(code)}</pre>
              </div>
            )}
          </section>

          <svg className="code-arrows" viewBox="0 0 240 240" aria-hidden="true">
            <path d="M 16 48 C 98 40 120 66 210 76" />
            <path d="M 18 132 C 92 124 128 152 208 145" />
            <path d="M 22 198 C 94 190 132 202 210 184" />
          </svg>

          <section className="demo-stage" aria-live="polite">
            <button className="tool-button" onClick={runDemo}>Prova efecte</button>
            {demo === 'crit' ? (
              <div className="sound-demo">
                <div className="wave" style={{ ['--freq' as string]: `${freq / 10}px`, ['--dirt' as string]: `${dirt}px` }}>
                  rataplasmaaa
                </div>
                <p>{freq} Hz · {duration.toFixed(2)} s · bruticia {dirt}</p>
              </div>
            ) : (
              <div className="ghost-demo" style={{ ['--ghost-size' as string]: `${size}px`, ['--ghost-glow' as string]: `${glow}px`, ['--ghost-speed' as string]: `${speed}s` }}>
                <span />
                <p>mida {size}px · glow {glow}px · {speed.toFixed(1)}s</p>
              </div>
            )}
          </section>
        </div>
      </section>
    </RoomShell>
  )
}

function SliderDemo(props: {
  demo: Demo
  freq: number
  duration: number
  dirt: number
  size: number
  glow: number
  speed: number
  setFreq: (value: number) => void
  setDuration: (value: number) => void
  setDirt: (value: number) => void
  setSize: (value: number) => void
  setGlow: (value: number) => void
  setSpeed: (value: number) => void
}) {
  if (props.demo === 'crit') {
    return (
      <div className="slider-stack">
        <Range label="frequencia" value={props.freq} min={120} max={1200} step={10} onChange={props.setFreq} suffix=" Hz" />
        <Range label="durada" value={props.duration} min={0.1} max={2} step={0.05} onChange={props.setDuration} suffix=" s" />
        <Range label="bruticia" value={props.dirt} min={0} max={90} step={1} onChange={props.setDirt} />
      </div>
    )
  }
  return (
    <div className="slider-stack">
      <Range label="mida" value={props.size} min={70} max={190} step={1} onChange={props.setSize} suffix=" px" />
      <Range label="glow" value={props.glow} min={0} max={70} step={1} onChange={props.setGlow} suffix=" px" />
      <Range label="velocitat" value={props.speed} min={0.8} max={5} step={0.1} onChange={props.setSpeed} suffix=" s" />
    </div>
  )
}

function Range({ label, value, min, max, step, suffix = '', onChange }: {
  label: string
  value: number
  min: number
  max: number
  step: number
  suffix?: string
  onChange: (value: number) => void
}) {
  return (
    <label className="range-row">
      <span>{label}</span>
      <input type="range" value={value} min={min} max={max} step={step} onChange={(event) => onChange(Number(event.target.value))} />
      <strong>{Number.isInteger(value) ? value : value.toFixed(2)}{suffix}</strong>
    </label>
  )
}

function highlight(code: string) {
  return code
    .replace(/\b(const|crearCrit|crearFantasma)\b/g, '[$1]')
    .replace(/([0-9.]+)/g, '<$1>')
}

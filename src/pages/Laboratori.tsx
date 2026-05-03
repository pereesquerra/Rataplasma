import RoomShell from '@/components/RoomShell'
import { FormEvent, useEffect, useState } from 'react'

interface Creation {
  id: string
  title: string
  kind: string
  note: string
}

const storageKey = 'rataplasma.creacions.v1'
const kinds = ['repte', 'riff', 'cartell', 'invent']
const sparks = [
  'Una escala de guitarra que obre una porta secreta.',
  'Un fantasma que nomes balla si el codi te un numero parell.',
  'Un cartell prohibit que canvia de color quan crides.',
  'Una radio que barreja tres notes i una broma de formatge.',
]

export default function Laboratori() {
  const [creations, setCreations] = useState<Creation[]>([])
  const [title, setTitle] = useState('')
  const [kind, setKind] = useState(kinds[0])
  const [note, setNote] = useState(sparks[0])

  useEffect(() => {
    try {
      setCreations(JSON.parse(localStorage.getItem(storageKey) || '[]') as Creation[])
    } catch {
      setCreations([])
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(creations.slice(0, 24)))
  }, [creations])

  function submit(event: FormEvent) {
    event.preventDefault()
    const cleanTitle = title.trim() || `Invent ${creations.length + 1}`
    setCreations((current) => [
      { id: crypto.randomUUID(), title: cleanTitle, kind, note: note.trim() || sparks[0] },
      ...current,
    ].slice(0, 24))
    setTitle('')
    setNote(sparks[Math.floor(Math.random() * sparks.length)])
  }

  function randomSpark() {
    const left = ['rata', 'guitarra', 'portal', 'xiulet', 'codi', 'ombra']
    const action = ['fa remix de', 'desbloqueja', 'converteix en', 'persegueix', 'dibuixa']
    const right = ['un acord', 'una pista secreta', 'un fantasma petit', 'un repte impossible', 'un cartell brillant']
    setTitle(`${left[Math.floor(Math.random() * left.length)]} ${action[Math.floor(Math.random() * action.length)]}`)
    setNote(right[Math.floor(Math.random() * right.length)])
  }

  return (
    <RoomShell title="Laboratori secret" kicker="apartat creatiu" mascotMood="calmat">
      <section className="lab-room">
        <form className="lab-maker" onSubmit={submit}>
          <div>
            <h2>Fitxa nova</h2>
            <p>Crea una idea per tornar-hi dema: un repte, un riff, un cartell o un invent estrany.</p>
          </div>
          <label>
            Titol
            <input className="lab-input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="ex: riff fantasma en Do" />
          </label>
          <div className="segmented" aria-label="Tipus de fitxa">
            {kinds.map((item) => (
              <button className={`chip-button ${kind === item ? 'is-active' : ''}`} type="button" onClick={() => setKind(item)} key={item}>
                {item}
              </button>
            ))}
          </div>
          <label>
            Nota
            <textarea className="lab-input lab-textarea" value={note} onChange={(event) => setNote(event.target.value)} />
          </label>
          <div className="rec-actions">
            <button className="primary-action" type="submit">Enganxa al mural</button>
            <button className="tool-button" type="button" onClick={randomSpark}>Barreja rara</button>
          </div>
        </form>

        <section className="mural" aria-labelledby="mural-title">
          <h2 id="mural-title">Mural d'invents</h2>
          <div className="mural-grid">
            {creations.length ? creations.map((creation, index) => (
              <article className="mural-card" key={creation.id} style={{ ['--tilt' as string]: `${index % 2 ? 1.2 : -1.4}deg` }}>
                <span>{creation.kind}</span>
                <h3>{creation.title}</h3>
                <p>{creation.note}</p>
              </article>
            )) : (
              <p className="empty-mural">El mural encara esta net. Aixo es sospitosissim.</p>
            )}
          </div>
        </section>
      </section>
    </RoomShell>
  )
}

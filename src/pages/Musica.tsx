import RoomShell from '@/components/RoomShell'
import { useState } from 'react'
import { playNote } from '@/lib/audio'

type Instrument = 'piano' | 'xilofon' | 'rata' | 'synth'

interface NoteDef {
  id: string
  label: string
  solfeig: string
  frequency: number
  staff: number
}

const notes: NoteDef[] = [
  { id: 'C4', label: 'C', solfeig: 'Do', frequency: 261.63, staff: 6 },
  { id: 'D4', label: 'D', solfeig: 'Re', frequency: 293.66, staff: 5 },
  { id: 'E4', label: 'E', solfeig: 'Mi', frequency: 329.63, staff: 4 },
  { id: 'F4', label: 'F', solfeig: 'Fa', frequency: 349.23, staff: 3 },
  { id: 'G4', label: 'G', solfeig: 'Sol', frequency: 392.00, staff: 2 },
  { id: 'A4', label: 'A', solfeig: 'La', frequency: 440.00, staff: 1 },
  { id: 'B4', label: 'B', solfeig: 'Si', frequency: 493.88, staff: 0 },
  { id: 'C5', label: 'C+', solfeig: 'Do+', frequency: 523.25, staff: -1 },
]

const instruments: { id: Instrument; label: string }[] = [
  { id: 'piano', label: 'Piano' },
  { id: 'xilofon', label: 'Xilofon' },
  { id: 'rata', label: 'Rata squeak' },
  { id: 'synth', label: 'Synth' },
]

const songs = [
  { title: 'Sol solet', pattern: ['G4', 'E4', 'G4', 'E4', 'G4', 'A4', 'G4'] },
  { title: 'Per molts anys', pattern: ['C4', 'C4', 'D4', 'C4', 'F4', 'E4', 'C4', 'C4', 'D4', 'C4', 'G4', 'F4'] },
  { title: 'Rataplasma puja', pattern: ['C4', 'E4', 'G4', 'C5', 'B4', 'G4', 'E4', 'C4'] },
]

function findNote(id: string) {
  return notes.find((note) => note.id === id) || notes[0]
}

export default function Musica() {
  const [instrument, setInstrument] = useState<Instrument>('piano')
  const [recording, setRecording] = useState(false)
  const [recorded, setRecorded] = useState<string[]>([])
  const [active, setActive] = useState<string | null>(null)
  const [selectedSong, setSelectedSong] = useState(songs[0])

  function hit(note: NoteDef, shouldRecord = true) {
    setActive(note.id)
    playNote(note.frequency, instrument === 'xilofon' ? 0.22 : 0.42, instrument)
    window.setTimeout(() => setActive(null), 180)
    if (recording && shouldRecord) {
      setRecorded((current) => current.length >= 32 ? current : [...current, note.id])
    }
  }

  function playPattern(pattern: string[], gap = 360) {
    pattern.forEach((id, index) => {
      window.setTimeout(() => hit(findNote(id), false), index * gap)
    })
  }

  return (
    <RoomShell title="Taller de notes" kicker="musica" mascotMood="content">
      <section className="music-room">
        <div className="music-controls" aria-label="Instruments">
          {instruments.map((item) => (
            <button
              className={`chip-button ${instrument === item.id ? 'is-active' : ''}`}
              key={item.id}
              onClick={() => setInstrument(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="keyboard" role="group" aria-label="Teclat Do major">
          {notes.map((note) => (
            <button
              className={`piano-key ${active === note.id ? 'is-active' : ''}`}
              key={note.id}
              onClick={() => hit(note)}
              aria-label={`Toca ${note.solfeig}`}
            >
              <strong>{note.solfeig}</strong>
              <span>{note.label}</span>
            </button>
          ))}
        </div>

        <section className="staff-panel" aria-labelledby="song-title">
          <div className="song-picker">
            {songs.map((song) => (
              <button
                className={`chip-button ${selectedSong.title === song.title ? 'is-active' : ''}`}
                key={song.title}
                onClick={() => setSelectedSong(song)}
              >
                {song.title}
              </button>
            ))}
          </div>
          <div className="staff-head">
            <h2 id="song-title">{selectedSong.title}</h2>
            <button className="tool-button" onClick={() => playPattern(selectedSong.pattern)}>Escolta</button>
          </div>
          <div className="staff" aria-label={`Pentagrama de ${selectedSong.title}`}>
            {[0, 1, 2, 3, 4].map((line) => <span className="staff-line" style={{ top: `${22 + line * 14}%` }} key={line} />)}
            {selectedSong.pattern.map((id, index) => {
              const note = findNote(id)
              return (
                <button
                  className="staff-note"
                  style={{ left: `${8 + index * (84 / Math.max(1, selectedSong.pattern.length - 1))}%`, top: `${14 + note.staff * 8}%` }}
                  key={`${id}-${index}`}
                  onClick={() => hit(note)}
                  aria-label={`Toca ${note.solfeig}`}
                >
                  {note.solfeig}
                </button>
              )
            })}
          </div>
        </section>

        <section className="recorder-panel" aria-labelledby="rec-title">
          <div>
            <h2 id="rec-title">Gravadora de la rata</h2>
            <p>{recorded.length}/32 notes guardades</p>
          </div>
          <div className="rec-actions">
            <button className={`tool-button ${recording ? 'is-danger' : ''}`} onClick={() => setRecording((value) => !value)}>
              {recording ? 'Para' : 'Grava'}
            </button>
            <button className="tool-button" onClick={() => playPattern(recorded)} disabled={!recorded.length}>Repeteix</button>
            <button className="quiet-button" onClick={() => setRecorded([])} disabled={!recorded.length}>Neteja</button>
          </div>
          <div className="note-ribbon" aria-label="Notes gravades">
            {recorded.length ? recorded.map((id, index) => <span key={`${id}-${index}`}>{findNote(id).solfeig}</span>) : <em>toca tecles mentre graves</em>}
          </div>
        </section>
      </section>
    </RoomShell>
  )
}

import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import RataplasmaMascot from '@/components/RataplasmaMascot'
import { getSession, logout } from '@/lib/auth'
import { playRataplasmaBurst } from '@/lib/audio'

const rooms = [
  { to: '/parla', title: 'Parla amb la Rata', note: 'Un walkie fantasma que respon en catala.', symbol: '✦' },
  { to: '/musica', title: 'Taller de notes', note: 'Teclat, pentagrama i gravadora de melodies.', symbol: '♫' },
  { to: '/codi', title: 'Codi que es mou', note: 'Sliders, blocs i JavaScript que fan efectes.', symbol: '{ }' },
  { to: '/laboratori', title: 'Laboratori secret', note: 'Cartells, reptes i invents per guardar.', symbol: '⚑' },
]

export default function Home() {
  const session = getSession()
  const navigate = useNavigate()
  const [burst, setBurst] = useState(false)

  function signature() {
    setBurst(true)
    playRataplasmaBurst()
    window.setTimeout(() => setBurst(false), 900)
  }

  function exit() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <main className="home-page">
      <header className="home-bar">
        <p>Hola, {session?.name || 'Pau'}</p>
        <button className="quiet-button" onClick={exit}>Surt</button>
      </header>

      <section className="desk" aria-labelledby="home-title">
        <div className="desk-copy">
          <p className="scribble">quadern viu</p>
          <h1 id="home-title">Habitacio Rataplasma</h1>
          <p>Un lloc per fer soroll, tocar notes, canviar codi i deixar invents enganxats a la paret.</p>
        </div>

        <button className={`signature-button ${burst ? 'is-bursting' : ''}`} onClick={signature}>
          <span>rataplasmaaa!</span>
        </button>

        <RataplasmaMascot mood={burst ? 'sorpres' : 'content'} />

        <nav className="object-grid" aria-label="Habitacions">
          {rooms.map((room) => (
            <Link className="room-object" to={room.to} key={room.to}>
              <strong>{room.symbol}</strong>
              <span>{room.title}</span>
              <small>{room.note}</small>
            </Link>
          ))}
        </nav>
      </section>
    </main>
  )
}

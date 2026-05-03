import { Link } from 'react-router-dom'
import RataplasmaMascot from '@/components/RataplasmaMascot'

interface RoomShellProps {
  title: string
  kicker: string
  children: React.ReactNode
  mascotMood?: 'calmat' | 'content' | 'parlant' | 'sorpres'
}

export default function RoomShell({ title, kicker, children, mascotMood = 'calmat' }: RoomShellProps) {
  return (
    <main className="room-shell">
      <header className="room-topbar">
        <Link className="back-link" to="/" aria-label="Torna a l'habitacio principal">← Habitacio</Link>
        <div className="room-title">
          <span>{kicker}</span>
          <h1>{title}</h1>
        </div>
        <RataplasmaMascot compact mood={mascotMood} />
      </header>
      {children}
    </main>
  )
}

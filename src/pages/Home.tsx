import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Background from '@/components/home/Background'
import MascotV4 from '@/components/home/MascotV4'
import MegaButton from '@/components/home/MegaButton'
import NavCards from '@/components/home/NavCards'
import Stickers from '@/components/home/Stickers'
import { getUser, logout } from '@/lib/auth'
import '@/styles/home.css'

interface Shockwave { id: number; variant: 0 | 1 | 2 }
interface EyeTarget { x: number; y: number }

export default function Home() {
  const user = getUser()!
  const navigate = useNavigate()
  const [shake, setShake] = useState(false)
  const [leaping, setLeaping] = useState(false)
  const [screaming, setScreaming] = useState(false)
  const [shockwaves, setShockwaves] = useState<Shockwave[]>([])
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const [eyeTarget, setEyeTarget] = useState<EyeTarget | null>(null)
  const mascotRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const nx = (e.clientX - cx) / cx
      const ny = (e.clientY - cy) / cy
      setParallax({ x: nx, y: ny })
      if (mascotRef.current) {
        const r = mascotRef.current.getBoundingClientRect()
        const mx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2)
        const my = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
        setEyeTarget({
          x: Math.max(-1, Math.min(1, mx)) * 5,
          y: Math.max(-1, Math.min(1, my)) * 4,
        })
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const handlePress = () => {
    setShake(true)
    setLeaping(true)
    setScreaming(true)
    const id = Date.now()
    setShockwaves(prev => [...prev, { id, variant: 0 }, { id: id + 1, variant: 1 }, { id: id + 2, variant: 2 }])
    setTimeout(() => {
      const id2 = Date.now()
      setShockwaves(prev => [...prev, { id: id2, variant: 0 }, { id: id2 + 1, variant: 2 }])
      setTimeout(() => setShockwaves(prev => prev.filter(s => s.id !== id2 && s.id !== id2 + 1)), 1200)
    }, 1800)
    setTimeout(() => setShake(false), 4200)
    setTimeout(() => setScreaming(false), 4500)
    setTimeout(() => setLeaping(false), 900)
    setTimeout(() => setShockwaves(prev => prev.filter(s => s.id < id || s.id > id + 2)), 1200)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleCardSelect = (id: string) => {
    if (id === 'chat') navigate('/parla')
    // la resta locked, no fa res
  }

  const handleAdmin = () => navigate('/admin')

  return (
    <div className={`app ${shake ? 'shake' : ''}`}>
      <Background showGhosts />

      <div className="topbar enter-up" style={{ animationDelay: '0.1s' }}>
        <div className="greeting">
          <span className="wave">👋</span>
          hola, <span className="name">{user.nom}</span>
        </div>
        <div className="topbar-right">
          {user.isAdmin && (
            <button className="admin-pill" onClick={handleAdmin} style={{ border: 'none', cursor: 'pointer' }}>
              ADMIN
            </button>
          )}
          <button className="surt-btn" onClick={handleLogout}>Surt</button>
        </div>
      </div>

      <div className="stage">
        <div
          className="mascot-layer enter-pop"
          style={{
            animationDelay: '0.3s',
            transform: `translateX(calc(-50% + ${parallax.x * 14}px)) translateY(${parallax.y * 10}px)`,
            transition: 'transform 0.25s ease-out',
          }}
        >
          <MascotV4 ref={mascotRef} leaping={leaping} screaming={screaming} eyeTarget={eyeTarget} />
        </div>

        {shockwaves.map(s => (
          <div
            key={s.id}
            className={`shockwave ${s.variant === 1 ? 'sw2' : s.variant === 2 ? 'sw3' : ''}`}
          />
        ))}

        <div className="mega-btn-slot enter-pop" style={{ animationDelay: '0.6s' }}>
          <MegaButton onPress={handlePress} />
        </div>

        <NavCards onSelect={handleCardSelect} />
      </div>

      <Stickers />
    </div>
  )
}

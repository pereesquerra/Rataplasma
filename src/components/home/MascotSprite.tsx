import { forwardRef, useEffect, useState } from 'react'

interface MascotSpriteProps {
  leaping?: boolean
  screaming?: boolean
  eyeTarget?: { x: number; y: number } | null
  size?: number
}

type Pose = 'idle' | 'parlant' | 'content' | 'espantat' | 'ballant' | 'pensant'

// Mapa de poses a fitxers (les imatges estan a /public/mascot/)
const POSE_SRC: Record<Pose, string> = {
  idle: '/mascot/idle.png',
  parlant: '/mascot/parlant.png',
  content: '/mascot/content.png',
  espantat: '/mascot/espantat.png',
  ballant: '/mascot/ballant.png',
  pensant: '/mascot/pensant.png',
}

// Precarrega totes les imatges de cop (~2 MB total) perquè els canvis de pose
// siguin instantanis. Es fa només un cop al muntar el component.
function preloadAll() {
  if (typeof window === 'undefined') return
  Object.values(POSE_SRC).forEach((src) => {
    const img = new Image()
    img.src = src
  })
}

const MascotSprite = forwardRef<HTMLDivElement, MascotSpriteProps>(function MascotSprite(
  { leaping = false, screaming = false, eyeTarget = null, size = 480 },
  ref,
) {
  const [pose, setPose] = useState<Pose>('idle')
  const [breathing, setBreathing] = useState(false)

  // Precarrega
  useEffect(() => {
    preloadAll()
  }, [])

  // Decideix la pose en funció de l'estat extern
  useEffect(() => {
    if (screaming) {
      setPose('espantat')
    } else if (leaping) {
      setPose('ballant')
    } else if (eyeTarget) {
      // Cursor a sobre del mascot: una mica de "pensant" curiós
      setPose('pensant')
    } else {
      setPose('idle')
    }
  }, [screaming, leaping, eyeTarget])

  // Idle breathing animation: subtle scale loop
  useEffect(() => {
    const i = setInterval(() => setBreathing((b) => !b), 1800)
    return () => clearInterval(i)
  }, [])

  // Quan està parlant idle, alterna entre idle i parlant per donar vida
  // (només si no està en cap estat fort)
  useEffect(() => {
    if (screaming || leaping || eyeTarget) return
    const i = setInterval(() => {
      setPose((p) => (p === 'idle' ? 'parlant' : 'idle'))
    }, 4500)
    return () => clearInterval(i)
  }, [screaming, leaping, eyeTarget])

  const transform = breathing ? 'scale(1.02)' : 'scale(1)'

  return (
    <div
      ref={ref}
      className="mascot-sprite-wrap"
      style={{
        width: size,
        height: size,
        position: 'relative',
        transition: 'transform 1.6s ease-in-out',
        transform,
        filter: screaming
          ? 'drop-shadow(0 0 30px rgba(255,90,90,0.7))'
          : leaping
          ? 'drop-shadow(0 0 28px rgba(110,255,158,0.6))'
          : 'drop-shadow(0 0 24px rgba(110,255,158,0.45))',
      }}
    >
      {/* Tots els frames es mantenen al DOM amb opacity 0/1 perquè la transició sigui suau
          i no hi hagi flash blanc en canviar src */}
      {(Object.keys(POSE_SRC) as Pose[]).map((p) => (
        <img
          key={p}
          src={POSE_SRC[p]}
          alt={`Rataplasma ${p}`}
          draggable={false}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            mixBlendMode: 'screen', // elimina el fons negre
            opacity: pose === p ? 1 : 0,
            transition: 'opacity 0.18s ease-out',
            pointerEvents: 'none',
          }}
        />
      ))}
    </div>
  )
})

export default MascotSprite

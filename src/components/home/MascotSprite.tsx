import { forwardRef, useEffect, useRef, useState } from 'react'

interface MascotSpriteProps {
  leaping?: boolean
  screaming?: boolean
  eyeTarget?: { x: number; y: number } | null
  size?: number
}

type Pose = 'idle' | 'parlant' | 'content' | 'espantat' | 'ballant' | 'pensant'

const POSE_SRC: Record<Pose, string> = {
  idle:     '/mascot/idle.png',
  parlant:  '/mascot/parlant.png',
  content:  '/mascot/content.png',
  espantat: '/mascot/espantat.png',
  ballant:  '/mascot/ballant.png',
  pensant:  '/mascot/pensant.png',
}

// Precarrega ràpida — així cap canvi de pose té flash
function preloadAll() {
  if (typeof window === 'undefined') return
  Object.values(POSE_SRC).forEach((src) => { const i = new Image(); i.src = src })
}

const MascotSprite = forwardRef<HTMLDivElement, MascotSpriteProps>(function MascotSprite(
  { leaping = false, screaming = false, eyeTarget = null, size = 480 },
  ref,
) {
  const [pose, setPose] = useState<Pose>('idle')
  // bumpKey força un re-trigger de l'animació "squash" en cada canvi de pose
  const [bumpKey, setBumpKey] = useState(0)
  const lastPoseRef = useRef<Pose>('idle')

  useEffect(() => { preloadAll() }, [])

  // Decideix la pose en funció de l'estat extern (prioritat: scream > leap > cursor > idle/parlant)
  useEffect(() => {
    let next: Pose
    if (screaming)        next = 'espantat'
    else if (leaping)     next = 'ballant'
    else if (eyeTarget)   next = 'pensant'
    else                  next = 'idle'
    setPose(next)
  }, [screaming, leaping, eyeTarget])

  // Idle: alterna idle ↔ parlant cada ~4.5s perquè estigui viu (només si està quiet)
  useEffect(() => {
    if (screaming || leaping || eyeTarget) return
    const i = window.setInterval(() => {
      setPose((p) => (p === 'idle' ? 'parlant' : 'idle'))
    }, 4500)
    return () => window.clearInterval(i)
  }, [screaming, leaping, eyeTarget])

  // Squash & stretch en cada canvi de pose
  useEffect(() => {
    if (lastPoseRef.current !== pose) {
      lastPoseRef.current = pose
      setBumpKey((k) => k + 1)
    }
  }, [pose])

  const wrapClass = [
    'mascot-sprite-wrap',
    screaming ? 'is-scream' : '',
    leaping   ? 'is-dance'  : '',
    !screaming && !leaping && eyeTarget ? 'is-curious' : '',
  ].filter(Boolean).join(' ')

  return (
    <div
      ref={ref}
      className={wrapClass}
      style={{ width: size, height: size }}
    >
      {/* Halo decoratiu darrere de la imatge — pulsa, vermell quan crida */}
      <div className="mascot-sprite-halo" />

      {/* Capa interior on apliquem el sacseig violent del crit (separada del wrap
          perquè el wrap pot continuar amb la respiració/float idle) */}
      <div className="mascot-sprite-shake">
        {/* Bump = squash & stretch en cada canvi de pose */}
        <div key={bumpKey} className="mascot-sprite-bump">
          {(Object.keys(POSE_SRC) as Pose[]).map((p) => (
            <img
              key={p}
              src={POSE_SRC[p]}
              alt={`Rataplasma ${p}`}
              draggable={false}
              className="mascot-sprite-img"
              style={{ opacity: pose === p ? 1 : 0 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
})

export default MascotSprite

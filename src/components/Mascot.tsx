import { motion } from 'motion/react'
import { useEffect, useRef } from 'react'

interface MascotProps {
  size?: number
  excited?: boolean
  className?: string
}

/**
 * Rata Fantasma v3 — imatge Flux + mix-blend-mode per treure el fons negre.
 * Parallax amb el cursor, aura viva, flotació orgànica.
 */
export default function Mascot({ size = 500, excited = false, className = '' }: MascotProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  // Parallax suau amb cursor - la rata s'inclina una mica segons el ratolí
  useEffect(() => {
    function handleMove(e: MouseEvent) {
      if (!imgRef.current) return
      const { innerWidth, innerHeight } = window
      const x = (e.clientX / innerWidth - 0.5) * 2
      const y = (e.clientY / innerHeight - 0.5) * 2
      imgRef.current.style.setProperty('--mx', `${x * 8}px`)
      imgRef.current.style.setProperty('--my', `${y * 8}px`)
      imgRef.current.style.setProperty('--rot', `${x * 3}deg`)
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return (
    <motion.div
      ref={wrapperRef}
      className={`relative ${className}`}
      style={{ width: size, height: size, maxWidth: '100%' }}
      animate={excited ? {
        scale: [1, 1.3, 1.12],
        rotate: [0, -5, 5, -3, 0],
      } : {}}
      transition={{ duration: 0.7 }}
    >
      {/* Aura gran animada */}
      <motion.div
        className="absolute inset-0 blur-[80px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(110,255,158,0.9) 0%, rgba(110,255,158,0.3) 35%, transparent 65%)',
        }}
        animate={{
          opacity: excited ? [0.9, 1, 0.9] : [0.55, 0.85, 0.55],
          scale: excited ? [1.2, 1.45, 1.2] : [1, 1.1, 1],
        }}
        transition={{ duration: excited ? 0.6 : 3.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Cercle tènue darrere, tipus "escenari fantasma" */}
      <motion.div
        className="absolute inset-[15%] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(199,125,255,0.15) 0%, transparent 70%)',
          border: '1px solid rgba(110,255,158,0.15)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
      />

      {/* Partícules verdes i morades */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[1px] pointer-events-none"
          style={{
            left: `${10 + i * 11}%`,
            top: `${15 + (i % 3) * 28}%`,
            width: `${3 + (i % 3) * 2}px`,
            height: `${3 + (i % 3) * 2}px`,
            background: i % 3 === 0 ? '#6eff9e' : i % 3 === 1 ? '#c77dff' : '#ff9b3f',
          }}
          animate={{
            y: [-10, -50, -10],
            x: [0, (i % 2 === 0 ? 10 : -10), 0],
            opacity: [0, 0.9, 0],
            scale: [0.3, 1.4, 0.3],
          }}
          transition={{
            duration: 3.5 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* El mascot - mix-blend-mode:screen fa desaparèixer el fons negre */}
      <motion.img
        ref={imgRef}
        src="/mascot.jpg"
        alt="Rata fantasma"
        className="relative w-full h-full object-contain"
        style={{
          mixBlendMode: 'screen',
          transform: 'translate(var(--mx, 0), var(--my, 0)) rotate(var(--rot, 0))',
          transition: 'transform 0.3s ease-out',
          filter: excited
            ? 'drop-shadow(0 0 50px rgba(110,255,158,1)) drop-shadow(0 0 100px rgba(110,255,158,0.7)) saturate(1.4)'
            : 'drop-shadow(0 0 35px rgba(110,255,158,0.8)) drop-shadow(0 0 70px rgba(110,255,158,0.4))',
        }}
        animate={{
          y: [0, -18, 0, -10, 0],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        draggable={false}
      />

      {/* Destell quan excited */}
      {excited && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0.6, 0], scale: [0.8, 1.4, 1.6] }}
          transition={{ duration: 0.7 }}
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(110,255,158,0.3) 30%, transparent 70%)',
            mixBlendMode: 'screen',
          }}
        />
      )}
    </motion.div>
  )
}

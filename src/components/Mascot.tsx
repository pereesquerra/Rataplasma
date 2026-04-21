import { motion } from 'motion/react'

interface MascotProps {
  size?: number
  excited?: boolean
  className?: string
}

/**
 * Rata Fantasma — v3. Imatge generada amb IA (Flux).
 * Overlay amb efectes de glow, flotació i reacció a excited.
 */
export default function Mascot({ size = 480, excited = false, className = '' }: MascotProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: size, height: size, maxWidth: '100%' }}
      animate={excited ? {
        scale: [1, 1.25, 1.1],
        rotate: [0, -4, 4, -2, 0],
      } : {}}
      transition={{ duration: 0.6 }}
    >
      {/* Aura verda animada */}
      <motion.div
        className="absolute inset-0 blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(110,255,158,0.8) 0%, rgba(110,255,158,0.2) 40%, transparent 70%)',
        }}
        animate={{
          opacity: excited ? [0.9, 1, 0.9] : [0.5, 0.8, 0.5],
          scale: excited ? [1.1, 1.3, 1.1] : [1, 1.1, 1],
        }}
        transition={{ duration: excited ? 0.6 : 3.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Partícules verdes flotants */}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[1px]"
          style={{
            left: `${15 + i * 13}%`,
            top: `${20 + (i % 3) * 25}%`,
            width: `${4 + (i % 2) * 3}px`,
            height: `${4 + (i % 2) * 3}px`,
            background: i % 2 === 0 ? '#6eff9e' : '#c77dff',
          }}
          animate={{
            y: [-15, -40, -15],
            opacity: [0, 0.9, 0],
            scale: [0.3, 1.3, 0.3],
          }}
          transition={{
            duration: 3 + i * 0.4,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Mascot imatge amb flotació */}
      <motion.img
        src="/mascot.jpg"
        alt="Rata fantasma"
        className="relative w-full h-full object-contain"
        style={{
          filter: excited
            ? 'drop-shadow(0 0 40px rgba(110,255,158,0.95)) drop-shadow(0 0 80px rgba(110,255,158,0.6)) saturate(1.3)'
            : 'drop-shadow(0 0 30px rgba(110,255,158,0.7)) drop-shadow(0 0 60px rgba(110,255,158,0.4))',
        }}
        animate={{
          y: [0, -15, 0, -8, 0],
          rotate: [-1.5, 1.5, -1.5],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        draggable={false}
      />

      {/* Overlay parpelleig CRT quan excited */}
      {excited && (
        <motion.div
          className="absolute inset-0 mix-blend-screen pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0, 0.2, 0] }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'radial-gradient(circle, rgba(199,125,255,0.5) 0%, transparent 60%)',
          }}
        />
      )}
    </motion.div>
  )
}

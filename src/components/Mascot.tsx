import { motion, AnimatePresence } from 'motion/react'
import { useState, useEffect } from 'react'

interface MascotProps {
  size?: number
  excited?: boolean
  className?: string
}

/**
 * Mascot Rata Fantasma — SVG original dibuixat a mà.
 * Estètica cartoon retro, cap a Scooby-Doo però original (sense copyright).
 * Translúcida verda amb ulls grans i dent sortida.
 */
export default function Mascot({ size = 280, excited = false, className = '' }: MascotProps) {
  const [blinking, setBlinking] = useState(false)

  // Parpelleig aleatori cada pocs segons
  useEffect(() => {
    const blink = () => {
      setBlinking(true)
      setTimeout(() => setBlinking(false), 140)
    }
    const interval = setInterval(blink, 2500 + Math.random() * 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      animate={excited ? { scale: [1, 1.25, 1.1], rotate: [0, -3, 3, 0] } : {}}
      transition={{ duration: 0.5 }}
    >
      {/* Aura verdosa fantasma */}
      <div
        className="absolute inset-0 blur-3xl opacity-60 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(110,255,158,0.7) 0%, rgba(110,255,158,0) 70%)',
        }}
      />

      <motion.svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="relative w-full h-full animate-float drop-shadow-[0_0_30px_rgba(110,255,158,0.8)]"
      >
        <defs>
          <radialGradient id="bodyGradient" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#a8ffca" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#6eff9e" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#2dd866" stopOpacity="0.6" />
          </radialGradient>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>
        </defs>

        {/* Cos fantasmagòric - ondulat a la base */}
        <motion.path
          d="M 50,60
             Q 50,30 100,30
             Q 150,30 150,60
             L 150,150
             Q 145,155 140,148
             Q 130,160 120,150
             Q 110,160 100,150
             Q 90,160 80,150
             Q 70,160 60,148
             Q 55,155 50,150
             Z"
          fill="url(#bodyGradient)"
          stroke="#2dd866"
          strokeWidth="2"
          strokeLinejoin="round"
          animate={{
            d: [
              "M 50,60 Q 50,30 100,30 Q 150,30 150,60 L 150,150 Q 145,155 140,148 Q 130,160 120,150 Q 110,160 100,150 Q 90,160 80,150 Q 70,160 60,148 Q 55,155 50,150 Z",
              "M 50,60 Q 50,30 100,30 Q 150,30 150,60 L 150,148 Q 140,158 132,150 Q 120,152 112,148 Q 100,158 88,150 Q 78,154 68,148 Q 58,156 50,148 Z",
              "M 50,60 Q 50,30 100,30 Q 150,30 150,60 L 150,150 Q 145,155 140,148 Q 130,160 120,150 Q 110,160 100,150 Q 90,160 80,150 Q 70,160 60,148 Q 55,155 50,150 Z",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Orelles de rata */}
        <ellipse cx="72" cy="35" rx="10" ry="13" fill="url(#bodyGradient)" stroke="#2dd866" strokeWidth="1.5" />
        <ellipse cx="128" cy="35" rx="10" ry="13" fill="url(#bodyGradient)" stroke="#2dd866" strokeWidth="1.5" />
        <ellipse cx="72" cy="37" rx="5" ry="7" fill="#c77dff" opacity="0.4" />
        <ellipse cx="128" cy="37" rx="5" ry="7" fill="#c77dff" opacity="0.4" />

        {/* Ulls grans */}
        <g>
          {/* Ull esquerre */}
          <ellipse cx="80" cy="75" rx="14" ry={blinking ? 1 : 16} fill="#ffffff" />
          {!blinking && (
            <>
              <circle cx="82" cy="78" r="7" fill="#0a0a0f" />
              <circle cx="84" cy="75" r="2.5" fill="#ffffff" />
            </>
          )}
          {/* Ull dret */}
          <ellipse cx="120" cy="75" rx="14" ry={blinking ? 1 : 16} fill="#ffffff" />
          {!blinking && (
            <>
              <circle cx="122" cy="78" r="7" fill="#0a0a0f" />
              <circle cx="124" cy="75" r="2.5" fill="#ffffff" />
            </>
          )}
        </g>

        {/* Nas */}
        <ellipse cx="100" cy="105" rx="5" ry="4" fill="#ff4466" opacity="0.9" />

        {/* Bigotis */}
        <g stroke="#2dd866" strokeWidth="1.2" strokeLinecap="round" opacity="0.8">
          <line x1="70" y1="108" x2="50" y2="105" />
          <line x1="70" y1="112" x2="48" y2="115" />
          <line x1="130" y1="108" x2="150" y2="105" />
          <line x1="130" y1="112" x2="152" y2="115" />
        </g>

        {/* Boca somrient amb dent */}
        <AnimatePresence mode="wait">
          {excited ? (
            <motion.g
              key="excited"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <ellipse cx="100" cy="125" rx="18" ry="14" fill="#0a0a0f" stroke="#2dd866" strokeWidth="1.5" />
              <rect x="95" y="115" width="4" height="8" fill="#ffffff" />
              <rect x="101" y="115" width="4" height="8" fill="#ffffff" />
            </motion.g>
          ) : (
            <motion.g
              key="normal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <path
                d="M 88,120 Q 100,128 112,120"
                fill="none"
                stroke="#0a0a0f"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <rect x="98" y="121" width="3" height="5" fill="#ffffff" stroke="#0a0a0f" strokeWidth="0.5" />
            </motion.g>
          )}
        </AnimatePresence>
      </motion.svg>
    </motion.div>
  )
}

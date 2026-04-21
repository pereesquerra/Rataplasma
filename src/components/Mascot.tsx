import { motion, AnimatePresence } from 'motion/react'
import { useState, useEffect } from 'react'

interface MascotProps {
  size?: number
  excited?: boolean
  className?: string
}

export default function Mascot({ size = 420, excited = false, className = '' }: MascotProps) {
  const [blinking, setBlinking] = useState(false)
  const [time, setTime] = useState(0)

  useEffect(() => {
    const blink = () => {
      setBlinking(true)
      setTimeout(() => setBlinking(false), 130)
    }
    const i = setInterval(blink, 2800 + Math.random() * 3000)
    return () => clearInterval(i)
  }, [])

  useEffect(() => {
    let raf: number
    const tick = () => {
      setTime(t => t + 0.016)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const wave1 = Math.sin(time * 1.5) * 6
  const wave2 = Math.sin(time * 2 + 1) * 8
  const wave3 = Math.sin(time * 1.8 + 2) * 5

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      animate={excited ? { scale: [1, 1.35, 1.15], rotate: [0, -5, 5, 0] } : {}}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="absolute inset-0 blur-3xl pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, rgba(110,255,158,0.75) 0%, rgba(110,255,158,0.25) 35%, transparent 65%)',
        }}
        animate={{ opacity: [0.6, 0.9, 0.6], scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {[0, 1, 2, 3, 4].map(i => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 bg-phantom rounded-full blur-[1px]"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 2) * 40}%`,
          }}
          animate={{
            y: [-10, -30, -10],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.7,
            ease: 'easeInOut',
          }}
        />
      ))}

      <svg
        viewBox="0 0 260 320"
        xmlns="http://www.w3.org/2000/svg"
        className="relative w-full h-full drop-shadow-[0_0_40px_rgba(110,255,158,0.7)] animate-float"
      >
        <defs>
          <radialGradient id="mBody" cx="48%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#c4ffdd" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#6eff9e" stopOpacity="0.82" />
            <stop offset="100%" stopColor="#1faf55" stopOpacity="0.55" />
          </radialGradient>
          <linearGradient id="mTail" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6eff9e" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#6eff9e" stopOpacity="0.1" />
          </linearGradient>
          <filter id="wobble">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" seed="3">
              <animate attributeName="baseFrequency" dur="8s" values="0.015;0.022;0.015" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="4" />
          </filter>
        </defs>

        <path
          d={`M 70,210 Q 60,230 ${68 + wave1},250 Q 50,270 ${72 + wave2},290 Q 90,305 110,295 Q 130,310 150,298 Q 170,315 190,302 Q 205,290 ${198 + wave3},270 Q 215,255 200,235 Q 195,220 185,215 Z`}
          fill="url(#mTail)"
          opacity="0.75"
        />

        <path
          d="M 55,120 Q 45,85 60,65 Q 70,40 85,45 Q 95,30 105,50 Q 120,35 135,55 Q 155,30 175,55 Q 190,45 200,65 Q 215,85 205,115 Q 220,140 215,170 Q 218,200 200,218 Q 180,232 150,228 Q 125,232 95,222 Q 60,215 50,185 Q 45,150 55,120 Z"
          fill="url(#mBody)"
          stroke="#2dd866"
          strokeWidth="2.5"
          strokeLinejoin="round"
          filter="url(#wobble)"
        />

        <path d="M 82,55 Q 75,35 68,45 Q 70,60 82,65 Z" fill="url(#mBody)" stroke="#2dd866" strokeWidth="2" />
        <ellipse cx="78" cy="52" rx="4" ry="7" fill="#c77dff" opacity="0.5" />

        <path d="M 178,55 Q 185,32 195,43 Q 195,60 180,65 Z" fill="url(#mBody)" stroke="#2dd866" strokeWidth="2" />
        <ellipse cx="186" cy="52" rx="4" ry="7" fill="#c77dff" opacity="0.5" />

        <g>
          <ellipse cx="100" cy="115" rx={blinking ? 18 : 20} ry={blinking ? 2 : 24} fill="#ffffff" />
          {!blinking && (
            <>
              <ellipse cx="105" cy="120" rx="10" ry="13" fill="#0a0a0f" />
              <circle cx="108" cy="115" r="4" fill="#ffffff" />
              <circle cx="102" cy="124" r="2" fill="#ffffff" opacity="0.7" />
            </>
          )}
        </g>
        <g>
          <ellipse cx="162" cy="113" rx={blinking ? 17 : 19} ry={blinking ? 2 : 22} fill="#ffffff" />
          {!blinking && (
            <>
              <ellipse cx="158" cy="118" rx="9" ry="12" fill="#0a0a0f" />
              <circle cx="155" cy="113" r="3.5" fill="#ffffff" />
              <circle cx="161" cy="122" r="1.8" fill="#ffffff" opacity="0.7" />
            </>
          )}
        </g>

        <path d="M 82,90 Q 100,82 120,95" stroke="#1faf55" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
        <path d="M 142,92 Q 160,80 180,92" stroke="#1faf55" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />

        <ellipse cx="131" cy="160" rx="7" ry="5" fill="#ff4466" />
        <circle cx="129" cy="158" r="2" fill="#ffb0c0" />

        <g stroke="#2dd866" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" fill="none">
          <path d="M 95,168 Q 70,165 45,155" />
          <path d="M 95,175 Q 72,178 48,182" />
          <path d="M 100,182 Q 80,193 58,205" />
          <path d="M 165,168 Q 190,165 218,155" />
          <path d="M 165,175 Q 188,178 215,182" />
          <path d="M 160,182 Q 182,193 205,205" />
        </g>

        <AnimatePresence mode="wait">
          {excited ? (
            <motion.g
              key="uh"
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <ellipse cx="132" cy="190" rx="28" ry="22" fill="#0a0a0f" stroke="#2dd866" strokeWidth="2" />
              <path d="M 118,178 L 123,188 L 128,178" fill="#ffffff" />
              <path d="M 138,178 L 143,188 L 148,178" fill="#ffffff" />
              <ellipse cx="132" cy="200" rx="10" ry="6" fill="#ff4466" opacity="0.6" />
            </motion.g>
          ) : (
            <motion.g
              key="o"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ellipse cx="132" cy="188" rx="10" ry="8" fill="#0a0a0f" stroke="#2dd866" strokeWidth="1.5" />
              <path d="M 125,182 L 128,188 L 131,182" fill="#ffffff" opacity="0.9" />
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </motion.div>
  )
}

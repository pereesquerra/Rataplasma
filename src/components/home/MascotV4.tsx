import { forwardRef, useEffect, useMemo, useState } from 'react'

interface EyeTarget { x: number; y: number }
interface MascotV4Props {
  leaping: boolean
  screaming: boolean
  eyeTarget: EyeTarget | null
}

const MascotV4 = forwardRef<HTMLDivElement, MascotV4Props>(function MascotV4(
  { leaping, screaming, eyeTarget },
  ref
) {
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!eyeTarget) return
    setPupilOffset({
      x: Math.max(-5, Math.min(5, eyeTarget.x)),
      y: Math.max(-4, Math.min(4, eyeTarget.y)),
    })
  }, [eyeTarget])

  return (
    <div
      className={`mascot-wrap ${leaping ? 'leap' : ''} ${screaming ? 'screaming' : ''}`}
      ref={ref}
    >
      <div className="mascot-glow" />
      <MistTrails />
      <MascotParticles />
      <svg
        className="mascot-svg"
        viewBox="0 0 420 760"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="bodyGrad" cx="50%" cy="25%" r="75%">
            <stop offset="0%" stopColor="#d4ffe5" stopOpacity="0.98" />
            <stop offset="30%" stopColor="#6fffb0" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#1fd678" stopOpacity="0.8" />
            <stop offset="90%" stopColor="#0aaa58" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#046a38" stopOpacity="0.2" />
          </radialGradient>
          <radialGradient id="bodyHighlight" cx="30%" cy="20%" r="30%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="earGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffc4dd" />
            <stop offset="100%" stopColor="#ff6fa8" />
          </linearGradient>
          <linearGradient id="earInner" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffa8c8" />
            <stop offset="100%" stopColor="#d84784" />
          </linearGradient>
          <radialGradient id="pawGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#d4ffe5" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#3de08a" stopOpacity="0.85" />
          </radialGradient>
          <linearGradient id="tailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff9ec2" />
            <stop offset="100%" stopColor="#ff5a9c" />
          </linearGradient>
          <filter id="bodyGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="tatter" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.018 0.045" numOctaves={2} seed={3} result="noise">
              <animate attributeName="baseFrequency" dur="9s"
                values="0.018 0.04;0.024 0.055;0.016 0.042;0.018 0.04" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="14" />
          </filter>
          <filter id="softBlur">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>

        {/* TAIL */}
        <g className="rat-tail">
          <path
            d="M 310 200 Q 370 185 385 140 Q 395 95 355 85 Q 318 80 322 118 Q 325 150 360 150 Q 385 150 380 125"
            fill="none"
            stroke="url(#tailGrad)"
            strokeWidth="11"
            strokeLinecap="round"
            opacity="0.95"
          />
          <path
            d="M 310 200 Q 370 185 385 140 Q 395 95 355 85 Q 318 80 322 118"
            fill="none"
            stroke="#ffd0e4"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.65"
          />
        </g>

        {/* EARS */}
        <g className="rat-ear-l">
          <ellipse cx="115" cy="55" rx="34" ry="46" fill="url(#earGrad)" transform="rotate(-24 115 55)" />
          <ellipse cx="117" cy="62" rx="19" ry="30" fill="url(#earInner)" transform="rotate(-24 115 55)" />
        </g>
        <g className="rat-ear-r">
          <ellipse cx="285" cy="55" rx="34" ry="46" fill="url(#earGrad)" transform="rotate(24 285 55)" />
          <ellipse cx="283" cy="62" rx="19" ry="30" fill="url(#earInner)" transform="rotate(24 285 55)" />
        </g>

        {/* BODY with tatter filter */}
        <g className="rat-body" filter="url(#bodyGlow)">
          <g filter="url(#tatter)">
            <path
              className="body-shape"
              d="M 55 175 C 40 110, 80 50, 145 42 C 170 40, 180 55, 200 52 C 220 48, 230 38, 260 44 C 305 52, 355 90, 365 160 C 370 200, 345 230, 360 275 C 372 320, 350 360, 362 405 C 370 455, 345 495, 358 545 C 368 585, 340 620, 348 665 C 352 695, 335 720, 322 725 C 310 727, 305 708, 296 718 C 288 732, 276 718, 268 730 C 258 742, 246 722, 236 734 C 224 744, 212 720, 200 732 C 188 744, 176 722, 164 732 C 152 742, 140 720, 128 728 C 116 735, 104 712, 92 720 C 80 728, 72 708, 70 680 C 65 640, 88 600, 75 555 C 62 510, 90 460, 76 410 C 64 360, 88 310, 72 258 C 62 225, 60 205, 55 175 Z"
              fill="url(#bodyGrad)"
            />
            <path d="M 100 710 Q 96 735 104 755 Q 112 735 108 710 Z" fill="url(#bodyGrad)" opacity="0.85" />
            <path d="M 170 720 Q 166 750 180 765 Q 190 745 182 720 Z" fill="url(#bodyGrad)" opacity="0.8" />
            <path d="M 258 715 Q 254 742 268 758 Q 278 738 270 715 Z" fill="url(#bodyGrad)" opacity="0.85" />
            <path d="M 318 708 Q 312 732 324 748 Q 334 728 328 708 Z" fill="url(#bodyGrad)" opacity="0.8" />
          </g>
          <path
            d="M 95 120 C 110 85, 150 65, 190 70 C 225 78, 250 110, 235 155 C 220 195, 175 210, 140 195 C 105 180, 85 155, 95 120 Z"
            fill="url(#bodyHighlight)"
          />
          <path d="M 60 360 Q 38 382 48 412 Q 34 440 44 468" fill="none" stroke="#4dff9f" strokeWidth="3" strokeLinecap="round" opacity="0.4" filter="url(#softBlur)" />
          <path d="M 360 380 Q 380 402 368 432 Q 380 458 372 488" fill="none" stroke="#4dff9f" strokeWidth="3" strokeLinecap="round" opacity="0.4" filter="url(#softBlur)" />
          <path d="M 90 60 Q 80 40 95 25" fill="none" stroke="#4dff9f" strokeWidth="2.5" strokeLinecap="round" opacity="0.35" filter="url(#softBlur)" />
          <path d="M 325 70 Q 340 48 330 30" fill="none" stroke="#4dff9f" strokeWidth="2.5" strokeLinecap="round" opacity="0.35" filter="url(#softBlur)" />
        </g>

        {/* PAWS */}
        <g className="rat-paw-l">
          <ellipse cx="55" cy="240" rx="22" ry="17" fill="url(#pawGrad)" />
          <circle cx="42" cy="238" r="3.5" fill="#0aaa58" opacity="0.6" />
          <circle cx="46" cy="248" r="3" fill="#0aaa58" opacity="0.6" />
          <circle cx="54" cy="253" r="3" fill="#0aaa58" opacity="0.6" />
        </g>
        <g className="rat-paw-r">
          <ellipse cx="365" cy="240" rx="22" ry="17" fill="url(#pawGrad)" />
          <circle cx="378" cy="238" r="3.5" fill="#0aaa58" opacity="0.6" />
          <circle cx="374" cy="248" r="3" fill="#0aaa58" opacity="0.6" />
          <circle cx="366" cy="253" r="3" fill="#0aaa58" opacity="0.6" />
        </g>

        {/* FACE */}
        <g className="rat-face">
          <g className="rat-eye-group">
            <ellipse cx="158" cy="155" rx="28" ry="34" fill="#fff" />
            <ellipse cx="242" cy="155" rx="28" ry="34" fill="#fff" />
            <g transform={`translate(${pupilOffset.x} ${pupilOffset.y})`}>
              <ellipse className="eye-pupil eye-pupil-l" cx="161" cy="163" rx="13" ry="17" fill="#0d0420" />
              <ellipse className="eye-pupil eye-pupil-r" cx="239" cy="163" rx="13" ry="17" fill="#0d0420" />
              <circle cx="166" cy="156" r="4.5" fill="#fff" />
              <circle cx="244" cy="156" r="4.5" fill="#fff" />
              <circle cx="158" cy="168" r="2" fill="#fff" opacity="0.7" />
              <circle cx="236" cy="168" r="2" fill="#fff" opacity="0.7" />
            </g>
            <path className="brow-idle brow-idle-l" d="M 130 120 Q 155 108 180 120" stroke="#0aaa58" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.55" />
            <path className="brow-idle brow-idle-r" d="M 220 120 Q 245 108 270 120" stroke="#0aaa58" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.55" />
            <path className="brow-rage brow-rage-l" d="M 120 105 L 190 135" stroke="#046a38" strokeWidth="7" fill="none" strokeLinecap="round" />
            <path className="brow-rage brow-rage-r" d="M 280 105 L 210 135" stroke="#046a38" strokeWidth="7" fill="none" strokeLinecap="round" />
          </g>

          <path d="M 190 208 Q 200 200 210 208 Q 200 219 190 208 Z" fill="#ff6fa8" stroke="#d84784" strokeWidth="1.4" />
          <circle cx="200" cy="206" r="2" fill="#fff" opacity="0.6" />

          <g stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" opacity="0.75" fill="none" className="rat-whiskers">
            <path d="M 172 222 Q 142 220 125 210" />
            <path d="M 174 230 Q 145 232 122 228" />
            <path d="M 176 238 Q 148 242 128 248" />
            <path d="M 228 222 Q 258 220 275 210" />
            <path d="M 226 230 Q 255 232 278 228" />
            <path d="M 224 238 Q 252 242 272 248" />
          </g>

          <g className="rat-mouth">
            <path className="mouth-smirk" d="M 180 250 Q 200 262 222 252" stroke="#0d0420" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.85" />
            <rect className="mouth-tooth-smirk" x="195" y="255" width="4.5" height="6.5" fill="#fff" rx="0.5" />

            <g className="mouth-scream">
              <ellipse cx="200" cy="280" rx="42" ry="52" fill="#1a0510" stroke="#0d0420" strokeWidth="4" />
              <ellipse cx="200" cy="296" rx="28" ry="32" fill="#0a020a" opacity="0.75" />
              <ellipse cx="200" cy="300" rx="22" ry="20" fill="#ff4f7f" />
              <path d="M 200 294 Q 200 318 200 326" stroke="#c52a5e" strokeWidth="2" fill="none" opacity="0.55" />
              <rect x="170" y="232" width="8" height="14" fill="#fff" rx="1.5" />
              <rect x="180" y="230" width="9" height="16" fill="#fff" rx="1.5" />
              <rect x="191" y="228" width="9" height="18" fill="#fff" rx="1.5" />
              <rect x="202" y="228" width="9" height="18" fill="#fff" rx="1.5" />
              <rect x="213" y="230" width="9" height="16" fill="#fff" rx="1.5" />
              <rect x="224" y="232" width="8" height="14" fill="#fff" rx="1.5" />
              <rect x="178" y="320" width="7" height="10" fill="#fff" rx="1" />
              <rect x="188" y="322" width="8" height="10" fill="#fff" rx="1" />
              <rect x="200" y="322" width="8" height="10" fill="#fff" rx="1" />
              <rect x="212" y="320" width="7" height="10" fill="#fff" rx="1" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  )
})

export default MascotV4

function MistTrails() {
  const mists = useMemo(() => (
    Array.from({ length: 10 }, (_, i) => ({
      side: i % 2 === 0 ? -1 : 1,
      top: 20 + (i * 8) + Math.random() * 6,
      size: 55 + Math.random() * 70,
      duration: 5 + Math.random() * 5,
      delay: Math.random() * 6,
    }))
  ), [])

  const keyframes = useMemo(() => mists.map((m, i) => (
    `@keyframes mistDrift-${i} {
      0% { transform: translate(0, 0) scale(0.7); opacity: 0; }
      30% { opacity: 0.55; }
      100% { transform: translate(${m.side * (40 + Math.random() * 50)}px, -${50 + Math.random() * 50}px) scale(1.5); opacity: 0; }
    }`
  )).join('\n'), [mists])

  return (
    <div className="mascot-mist">
      {mists.map((m, i) => (
        <div
          key={i}
          className="mist-wisp"
          style={{
            left: m.side < 0 ? `${-8 + Math.random() * 12}%` : 'auto',
            right: m.side > 0 ? `${-8 + Math.random() * 12}%` : 'auto',
            top: `${m.top}%`,
            width: m.size,
            height: m.size,
            animation: `mistDrift-${i} ${m.duration}s ease-in-out ${m.delay}s infinite`,
          }}
        />
      ))}
      <style>{keyframes}</style>
    </div>
  )
}

function MascotParticles() {
  const particles = useMemo(() => (
    Array.from({ length: 18 }, (_, i) => ({
      angle: (i / 18) * Math.PI * 2 + Math.random() * 0.5,
      radius: 180 + Math.random() * 100,
      size: 5 + Math.random() * 8,
      color: ['#4dff9f', '#a47bff', '#ff9f6b', '#ffffff', '#ff6fa8'][i % 5],
      duration: 5 + Math.random() * 5,
      delay: Math.random() * 5,
      cy: 25 + Math.random() * 25,
    }))
  ), [])

  const keyframes = useMemo(() => particles.map((p, i) => {
    const tx = Math.cos(p.angle) * p.radius
    const ty = Math.sin(p.angle) * p.radius * 0.6
    const tx2 = Math.cos(p.angle + 0.9) * (p.radius + 25)
    const ty2 = Math.sin(p.angle + 0.9) * (p.radius + 25) * 0.6
    return `@keyframes mascotOrbit-${i} {
      0% { transform: translate(-50%, -50%) translate(${tx}px, ${ty}px) scale(1); opacity: 0.85; }
      50% { transform: translate(-50%, -50%) translate(${tx2}px, ${ty2}px) scale(1.35); opacity: 0.35; }
      100% { transform: translate(-50%, -50%) translate(${tx}px, ${ty}px) scale(1); opacity: 0.85; }
    }`
  }).join('\n'), [particles])

  return (
    <div className="mascot-particles">
      {particles.map((p, i) => (
        <div
          key={i}
          className="mascot-particle"
          style={{
            top: `${p.cy}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 2.5}px ${p.color}`,
            animation: `mascotOrbit-${i} ${p.duration}s ease-in-out ${p.delay}s infinite`,
            opacity: 0.85,
          }}
        />
      ))}
      <style>{keyframes}</style>
    </div>
  )
}

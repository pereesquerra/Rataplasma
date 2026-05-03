import { motion, useReducedMotion } from 'motion/react'

type MascotMood = 'calmat' | 'content' | 'parlant' | 'sorpres'

interface RataplasmaMascotProps {
  mood?: MascotMood
  label?: string
  compact?: boolean
}

export default function RataplasmaMascot({ mood = 'calmat', label = 'Rataplasma', compact = false }: RataplasmaMascotProps) {
  const reduceMotion = useReducedMotion()
  const bob = reduceMotion ? {} : { y: mood === 'sorpres' ? [-4, -18, -4] : [-3, 6, -3], rotate: [-1, 1, -1] }
  const faceY = mood === 'sorpres' ? -4 : 0
  const mouth = mood === 'parlant' ? 'M 83 121 Q 103 137 123 121' : mood === 'sorpres' ? 'M 98 121 Q 103 132 108 121 Q 103 116 98 121' : 'M 84 120 Q 103 132 122 120'

  return (
    <figure className={`mascot-wrap ${compact ? 'mascot-wrap--compact' : ''}`} aria-label={label}>
      <motion.svg
        viewBox="0 0 210 250"
        role="img"
        aria-labelledby="rataplasma-title"
        className="mascot-svg"
        animate={bob}
        transition={{ duration: mood === 'parlant' ? 1.2 : 2.4, repeat: Infinity, ease: 'steps(6)' }}
      >
        <title id="rataplasma-title">{label}</title>
        <defs>
          <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.34 0 0 0 0 0.82 0 0 0 0 0.92 0 0 0 0.65 0" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <motion.path
          d="M 42 177 C 19 177 13 150 32 137 C 42 130 56 131 65 140"
          className="mascot-tail"
          fill="none"
          strokeLinecap="round"
          animate={reduceMotion ? {} : { d: [
            'M 42 177 C 19 177 13 150 32 137 C 42 130 56 131 65 140',
            'M 42 177 C 18 170 19 140 40 137 C 53 135 60 142 66 150',
            'M 42 177 C 19 177 13 150 32 137 C 42 130 56 131 65 140',
          ] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'steps(5)' }}
        />
        <path className="mascot-ear mascot-ear-left" d="M 66 52 C 39 20 29 58 44 84" />
        <path className="mascot-ear mascot-ear-right" d="M 145 52 C 174 21 181 62 160 86" />
        <path className="mascot-body" filter="url(#softGlow)" d="M 105 42 C 151 42 175 75 170 126 C 167 162 179 198 151 218 C 134 230 121 213 105 226 C 87 211 74 231 58 216 C 31 190 43 158 39 126 C 32 75 60 42 105 42 Z" />
        <motion.g animate={reduceMotion ? {} : { y: faceY }}>
          <ellipse className="mascot-eye" cx="82" cy="98" rx="12" ry="18" />
          <ellipse className="mascot-eye" cx="128" cy="98" rx="12" ry="18" />
          <circle className="mascot-pupil" cx="85" cy="101" r="5" />
          <circle className="mascot-pupil" cx="125" cy="101" r="5" />
          <path className="mascot-nose" d="M 99 113 Q 105 107 111 113 Q 105 120 99 113 Z" />
          <path className="mascot-mouth" d={mouth} fill="none" strokeLinecap="round" />
          <path className="mascot-whisker" d="M 69 113 L 35 104 M 70 123 L 36 128 M 136 113 L 172 104 M 136 123 L 172 128" />
        </motion.g>
        <motion.g className="mascot-sparks" animate={reduceMotion ? {} : { opacity: [0.45, 1, 0.45] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'steps(4)' }}>
          <path d="M 26 71 L 32 83 L 44 88 L 32 93 L 26 105 L 20 93 L 8 88 L 20 83 Z" />
          <path d="M 183 156 L 188 165 L 198 169 L 188 173 L 183 182 L 178 173 L 168 169 L 178 165 Z" />
        </motion.g>
      </motion.svg>
    </figure>
  )
}

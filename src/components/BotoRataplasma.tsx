import { useRef, useState, useEffect } from 'react'
import { motion } from 'motion/react'

interface BotoRataplasmaProps {
  onCrit?: () => void
  className?: string
}

// Selecciona la veu via URL query param: ?veu=grandpa | eddy | montse
function getVeuUrl(): string {
  if (typeof window === 'undefined') return '/rataplasma.m4a'
  const params = new URLSearchParams(window.location.search)
  const veu = params.get('veu')
  if (veu === 'grandpa') return '/crit-grandpa.m4a'
  if (veu === 'eddy') return '/crit-eddy.m4a'
  if (veu === 'montse') return '/crit-montse.m4a'
  return '/rataplasma.m4a'
}

export default function BotoRataplasma({ onCrit, className = '' }: BotoRataplasmaProps) {
  const audioCtxRef = useRef<AudioContext | null>(null)
  const bufferRef = useRef<AudioBuffer | null>(null)
  const reverbBufferRef = useRef<AudioBuffer | null>(null)
  const [pressat, setPressat] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
        const ctx = new AudioCtx()
        audioCtxRef.current = ctx

        const res = await fetch(getVeuUrl())
        const arr = await res.arrayBuffer()
        bufferRef.current = await ctx.decodeAudioData(arr)

        // Reverb lleuger, menys que abans perquè s'entengui millor
        const impulseLen = ctx.sampleRate * 1.2
        const impulse = ctx.createBuffer(2, impulseLen, ctx.sampleRate)
        for (let ch = 0; ch < 2; ch++) {
          const data = impulse.getChannelData(ch)
          for (let i = 0; i < impulseLen; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / impulseLen, 2.5)
          }
        }
        reverbBufferRef.current = impulse

        setLoaded(true)
      } catch (err) {
        console.error('Error carregant àudio:', err)
      }
    }
    load()
  }, [])

  function tocarCrit() {
    const ctx = audioCtxRef.current
    const buffer = bufferRef.current
    const impulse = reverbBufferRef.current
    if (!ctx || !buffer) return
    if (ctx.state === 'suspended') ctx.resume()

    const source = ctx.createBufferSource()
    source.buffer = buffer

    const master = ctx.createGain()
    master.gain.value = 1.3
    master.connect(ctx.destination)

    // Veu principal - més dry per claredat (menys reverb que abans)
    const dryGain = ctx.createGain()
    dryGain.gain.value = 0.85
    dryGain.connect(master)

    const wetGain = ctx.createGain()
    wetGain.gain.value = 0.35
    wetGain.connect(master)

    if (impulse) {
      const convolver = ctx.createConvolver()
      convolver.buffer = impulse
      source.connect(convolver)
      convolver.connect(wetGain)
    }

    // Filtre lleu per accentuar presència
    const filter = ctx.createBiquadFilter()
    filter.type = 'peaking'
    filter.frequency.value = 1800
    filter.gain.value = 2
    filter.Q.value = 1
    source.connect(filter)
    filter.connect(dryGain)

    source.start(0)
  }

  function handleClick() {
    tocarCrit()
    setPressat(true)
    setTimeout(() => setPressat(false), 1400)
    onCrit?.()
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={!loaded}
      className={`btn-rataplasma ${className} ${!loaded ? 'opacity-60' : ''}`}
      whileTap={{ scale: 0.92 }}
      animate={pressat ? { rotate: [0, -2, 2, -2, 0] } : {}}
      transition={{ duration: 0.3 }}
      aria-label="Crida Rataplasma"
    >
      <span className="relative glitch-text" data-text="RATAPLASMAAA!">
        RATAPLASMAAA!
      </span>
    </motion.button>
  )
}

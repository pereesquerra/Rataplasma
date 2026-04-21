import { useRef, useState, useEffect } from 'react'
import { motion } from 'motion/react'

interface BotoRataplasmaProps {
  onCrit?: () => void
  className?: string
}

/**
 * Botó RATAPLASMAAA! — reprodueix el crit gravat amb veu clara (TTS macOS),
 * aplicant reverb fantasmagòric via Web Audio API al vol.
 */
export default function BotoRataplasma({ onCrit, className = '' }: BotoRataplasmaProps) {
  const audioCtxRef = useRef<AudioContext | null>(null)
  const bufferRef = useRef<AudioBuffer | null>(null)
  const reverbBufferRef = useRef<AudioBuffer | null>(null)
  const [pressat, setPressat] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // Descarrega i descodifica el fitxer d'àudio un cop
  useEffect(() => {
    async function load() {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
        const ctx = new AudioCtx()
        audioCtxRef.current = ctx

        // Carrega el crit pre-gravat
        const res = await fetch('/rataplasma.m4a')
        const arr = await res.arrayBuffer()
        bufferRef.current = await ctx.decodeAudioData(arr)

        // Genera impulse response per reverb (convolver)
        const impulseLen = ctx.sampleRate * 1.8
        const impulse = ctx.createBuffer(2, impulseLen, ctx.sampleRate)
        for (let ch = 0; ch < 2; ch++) {
          const data = impulse.getChannelData(ch)
          for (let i = 0; i < impulseLen; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / impulseLen, 2.2)
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

    // Veu original
    const source = ctx.createBufferSource()
    source.buffer = buffer
    // Pitch lleugerament més alt perquè soni més fantasmagòric/infantil
    source.playbackRate.value = 1.08

    // Cadena amb reverb
    const master = ctx.createGain()
    master.gain.value = 1.2
    master.connect(ctx.destination)

    const dryGain = ctx.createGain()
    dryGain.gain.value = 0.75
    dryGain.connect(master)

    const wetGain = ctx.createGain()
    wetGain.gain.value = 0.55
    wetGain.connect(master)

    if (impulse) {
      const convolver = ctx.createConvolver()
      convolver.buffer = impulse
      source.connect(convolver)
      convolver.connect(wetGain)
    }

    // Filtre lleu per accentuar aguts i donar "presència"
    const filter = ctx.createBiquadFilter()
    filter.type = 'peaking'
    filter.frequency.value = 2000
    filter.gain.value = 3
    filter.Q.value = 1.2
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
      whileTap={{ scale: 0.93 }}
      animate={pressat ? { rotate: [0, -1.5, 1.5, -1.5, 0] } : {}}
      transition={{ duration: 0.3 }}
      aria-label="Crida Rataplasma"
    >
      <span className="relative glitch-text" data-text="RATAPLASMAAA!">
        RATAPLASMAAA!
      </span>
    </motion.button>
  )
}

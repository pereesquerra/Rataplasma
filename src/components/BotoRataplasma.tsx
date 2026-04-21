import { useRef, useState } from 'react'
import { motion } from 'motion/react'

interface BotoRataplasmaProps {
  onCrit?: () => void
  className?: string
}

/**
 * Botó icònic "RATAPLASMA!" — genera el crit amb Web Audio API
 * en temps real (sense necessitat de fitxer d'àudio).
 * Reverb fantasmagòric + vibrato + pitch sweep.
 */
export default function BotoRataplasma({ onCrit, className = '' }: BotoRataplasmaProps) {
  const audioCtxRef = useRef<AudioContext | null>(null)
  const [pressat, setPressat] = useState(false)

  function getCtx(): AudioContext {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return audioCtxRef.current
  }

  function tocarRataplasma() {
    const ctx = getCtx()
    if (ctx.state === 'suspended') ctx.resume()

    const now = ctx.currentTime
    const durada = 1.2

    // Cadena efectes: oscillador -> vibrato -> distorsió suau -> reverb -> output
    const master = ctx.createGain()
    master.gain.value = 0.3
    master.connect(ctx.destination)

    // Reverb simulat amb convolver impulse
    const convolver = ctx.createConvolver()
    const impulseLen = ctx.sampleRate * 1.5
    const impulse = ctx.createBuffer(2, impulseLen, ctx.sampleRate)
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch)
      for (let i = 0; i < impulseLen; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / impulseLen, 2.5)
      }
    }
    convolver.buffer = impulse

    const dryGain = ctx.createGain()
    const wetGain = ctx.createGain()
    dryGain.gain.value = 0.6
    wetGain.gain.value = 0.5
    dryGain.connect(master)
    convolver.connect(wetGain)
    wetGain.connect(master)

    // Oscil·lador principal - veu sintetitzada
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    // Pitch sweep descendent i ondulat (com un "RATAAA-PLAAASMAAA")
    osc.frequency.setValueAtTime(280, now)
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.3)
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.5)
    osc.frequency.exponentialRampToValueAtTime(120, now + durada)

    // Filtre formant per simular vocal
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(800, now)
    filter.frequency.linearRampToValueAtTime(600, now + durada)
    filter.Q.value = 5

    // Vibrato
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.frequency.value = 7
    lfoGain.gain.value = 8
    lfo.connect(lfoGain)
    lfoGain.connect(osc.frequency)

    // Envolupant
    const ampEnv = ctx.createGain()
    ampEnv.gain.setValueAtTime(0, now)
    ampEnv.gain.linearRampToValueAtTime(0.8, now + 0.05)
    ampEnv.gain.setValueAtTime(0.8, now + 0.6)
    ampEnv.gain.exponentialRampToValueAtTime(0.001, now + durada)

    osc.connect(filter)
    filter.connect(ampEnv)
    ampEnv.connect(dryGain)
    ampEnv.connect(convolver)

    osc.start(now)
    osc.stop(now + durada)
    lfo.start(now)
    lfo.stop(now + durada)

    // Soroll fantasmagòric superposat
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * durada, ctx.sampleRate)
    const noiseData = noiseBuffer.getChannelData(0)
    for (let i = 0; i < noiseData.length; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * 0.08
    }
    const noise = ctx.createBufferSource()
    noise.buffer = noiseBuffer
    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = 'highpass'
    noiseFilter.frequency.value = 2000
    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0, now)
    noiseGain.gain.linearRampToValueAtTime(0.2, now + 0.1)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + durada)
    noise.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(convolver)
    noise.start(now)
    noise.stop(now + durada)
  }

  function handleClick() {
    tocarRataplasma()
    setPressat(true)
    setTimeout(() => setPressat(false), 600)
    onCrit?.()
  }

  return (
    <motion.button
      onClick={handleClick}
      className={`btn-rataplasma ${className}`}
      whileTap={{ scale: 0.95 }}
      animate={pressat ? { rotate: [0, -1, 1, -1, 0] } : {}}
      transition={{ duration: 0.2 }}
      aria-label="Crida RATAPLASMA"
    >
      <span className="relative glitch-text" data-text="RATAPLASMA!">
        RATAPLASMA!
      </span>
    </motion.button>
  )
}

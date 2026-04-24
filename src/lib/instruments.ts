import { getCtx, getMaster, midiToFreq } from './audio-engine'

// Tons i timbres diferents. Més musicals que un sinus pur.
// Cada "instrument" té envelope ADSR diferent i forma d'ona.

export type Instrument = 'piano' | 'xilofon' | 'rata' | 'synth'

export function playNote(midi: number, duration = 0.6, instrument: Instrument = 'piano') {
  const ctx = getCtx()
  const master = getMaster()
  const now = ctx.currentTime
  const freq = midiToFreq(midi)

  if (instrument === 'piano') {
    playPiano(ctx, master, freq, now, duration)
  } else if (instrument === 'xilofon') {
    playXilofon(ctx, master, freq, now, duration)
  } else if (instrument === 'rata') {
    playRataSqueak(ctx, master, freq, now, duration)
  } else {
    playSynth(ctx, master, freq, now, duration)
  }
}

// Piano simulat: 3 harmonics amb decay exponencial
function playPiano(ctx: AudioContext, out: GainNode, freq: number, start: number, dur: number) {
  const harmonics = [
    { mult: 1, gain: 1.0 },
    { mult: 2, gain: 0.35 },
    { mult: 3, gain: 0.15 },
    { mult: 4, gain: 0.08 },
  ]
  const mainGain = ctx.createGain()
  mainGain.gain.setValueAtTime(0, start)
  mainGain.gain.linearRampToValueAtTime(0.5, start + 0.005)
  mainGain.gain.exponentialRampToValueAtTime(0.001, start + dur)
  mainGain.connect(out)

  harmonics.forEach(({ mult, gain }) => {
    const osc = ctx.createOscillator()
    osc.type = mult === 1 ? 'triangle' : 'sine'
    osc.frequency.value = freq * mult
    const g = ctx.createGain()
    g.gain.value = gain
    osc.connect(g)
    g.connect(mainGain)
    osc.start(start)
    osc.stop(start + dur + 0.1)
  })
}

// Xilofón: sinus amb atac brusc i decay ràpid
function playXilofon(ctx: AudioContext, out: GainNode, freq: number, start: number, dur: number) {
  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.value = freq
  const osc2 = ctx.createOscillator()
  osc2.type = 'sine'
  osc2.frequency.value = freq * 3.01 // harmonic impur
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0, start)
  gain.gain.linearRampToValueAtTime(0.5, start + 0.002)
  gain.gain.exponentialRampToValueAtTime(0.001, start + dur * 0.8)
  const gain2 = ctx.createGain()
  gain2.gain.value = 0.3
  osc.connect(gain)
  osc2.connect(gain2)
  gain2.connect(gain)
  gain.connect(out)
  osc.start(start); osc2.start(start)
  osc.stop(start + dur); osc2.stop(start + dur)
}

// Rata squeak: freqüència més alta + vibrato ràpid + noise
function playRataSqueak(ctx: AudioContext, out: GainNode, freq: number, start: number, dur: number) {
  const osc = ctx.createOscillator()
  osc.type = 'sawtooth'
  const baseFreq = freq * 2
  osc.frequency.setValueAtTime(baseFreq, start)
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.15, start + 0.04)
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.95, start + dur)

  // Vibrato LFO
  const lfo = ctx.createOscillator()
  lfo.frequency.value = 18
  const lfoGain = ctx.createGain()
  lfoGain.gain.value = baseFreq * 0.02
  lfo.connect(lfoGain)
  lfoGain.connect(osc.frequency)

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 3500
  filter.Q.value = 3

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0, start)
  gain.gain.linearRampToValueAtTime(0.25, start + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.001, start + dur)

  osc.connect(filter)
  filter.connect(gain)
  gain.connect(out)
  osc.start(start); lfo.start(start)
  osc.stop(start + dur); lfo.stop(start + dur)
}

// Synth amb sub bass + detune per fer un so ample
function playSynth(ctx: AudioContext, out: GainNode, freq: number, start: number, dur: number) {
  const oscA = ctx.createOscillator()
  const oscB = ctx.createOscillator()
  oscA.type = 'sawtooth'; oscB.type = 'sawtooth'
  oscA.frequency.value = freq; oscB.frequency.value = freq
  oscA.detune.value = -8; oscB.detune.value = 8

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(freq * 6, start)
  filter.frequency.exponentialRampToValueAtTime(freq * 2, start + dur)
  filter.Q.value = 2

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0, start)
  gain.gain.linearRampToValueAtTime(0.3, start + 0.02)
  gain.gain.setTargetAtTime(0.15, start + 0.1, 0.2)
  gain.gain.exponentialRampToValueAtTime(0.001, start + dur)

  oscA.connect(filter); oscB.connect(filter)
  filter.connect(gain); gain.connect(out)
  oscA.start(start); oscB.start(start)
  oscA.stop(start + dur + 0.1); oscB.stop(start + dur + 0.1)
}

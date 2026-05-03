let sharedContext: AudioContext | null = null

function getContext() {
  if (!sharedContext) {
    const AudioCtor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    sharedContext = new AudioCtor()
  }
  if (sharedContext.state === 'suspended') {
    void sharedContext.resume()
  }
  return sharedContext
}

export function playBlip(frequency = 620, duration = 0.14, type: OscillatorType = 'triangle') {
  const ctx = getContext()
  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(frequency, now)
  osc.frequency.exponentialRampToValueAtTime(Math.max(80, frequency * 0.72), now + duration)
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(0.18, now + 0.015)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(now)
  osc.stop(now + duration + 0.03)
}

export function playRataplasmaBurst() {
  const notes = [392, 494, 659, 988, 740]
  notes.forEach((note, index) => {
    window.setTimeout(() => playBlip(note, 0.11 + index * 0.015, index % 2 ? 'square' : 'triangle'), index * 75)
  })
}

export function playNote(frequency: number, duration = 0.42, instrument: 'piano' | 'xilofon' | 'rata' | 'synth' = 'piano') {
  const ctx = getContext()
  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  const filter = ctx.createBiquadFilter()

  osc.type = instrument === 'synth' ? 'sawtooth' : instrument === 'rata' ? 'square' : 'sine'
  osc.frequency.setValueAtTime(frequency, now)
  if (instrument === 'rata') {
    osc.frequency.exponentialRampToValueAtTime(frequency * 1.38, now + duration * 0.35)
    osc.frequency.exponentialRampToValueAtTime(frequency * 0.88, now + duration)
  }
  filter.type = 'lowpass'
  filter.frequency.value = instrument === 'synth' ? 900 : 2200
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(instrument === 'rata' ? 0.09 : 0.18, now + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
  osc.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  osc.start(now)
  osc.stop(now + duration + 0.04)
}

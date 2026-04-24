// Motor d'àudio compartit per a tota la pàgina de música
// Un AudioContext únic, funcions per tocar notes MIDI, loops, soroll de rata
// Notes MIDI: 60 = C4 (Do central). Freq: 440 * 2^((n - 69) / 12)

let ctx: AudioContext | null = null
let masterGain: GainNode | null = null

export function getCtx(): AudioContext {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    ctx = new AC()
    masterGain = ctx.createGain()
    masterGain.gain.value = 0.7
    masterGain.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function getMaster(): GainNode {
  getCtx()
  return masterGain!
}

export function setMasterVolume(v: number) {
  getMaster().gain.setTargetAtTime(v, getCtx().currentTime, 0.05)
}

// Converteix nom de nota → MIDI. 'C4' = 60, 'A4' = 69
const NOTE_OFFSET: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }
export function noteToMidi(note: string): number {
  const m = note.match(/^([A-G])(#|b)?(\d)$/)
  if (!m) return 60
  const [, letter, accidental, octaveStr] = m
  const octave = parseInt(octaveStr, 10)
  let midi = 12 * (octave + 1) + NOTE_OFFSET[letter]
  if (accidental === '#') midi += 1
  if (accidental === 'b') midi -= 1
  return midi
}

export function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12)
}

// Noms solfeig/llatí → MIDI (C4-based)
export const SOLFEIG_NOTES = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si', 'Do']
export const SOLFEIG_MIDIS = [60, 62, 64, 65, 67, 69, 71, 72]

// Colors per a les tecles
export const NOTE_COLORS = [
  '#ff6fa8', // Do - rosa
  '#ff9f6b', // Re - taronja
  '#ffdc5e', // Mi - groc
  '#4dff9f', // Fa - verd
  '#5fc8ff', // Sol - blau cel
  '#a47bff', // La - lila
  '#ff4fa8', // Si - magenta
  '#ff6fa8', // Do agut - rosa
]

// Text-to-Speech per la Rata Fantasma — fa servir Web Speech API (gratis, a tot el navegador)
// Veu configurada perquè soni a rata/nen: pitch alt, velocitat ràpida, veu català o castellà femenina petita

let cachedVoice: SpeechSynthesisVoice | null = null
let voiceLoadAttempted = false

function pickVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice
  const voices = window.speechSynthesis.getVoices()
  if (voices.length === 0) return null

  // Prioritat: català > castellà > qualsevol de nen/infantil
  // iOS i macOS tenen veus com 'Mónica', 'Paulina', 'Jorge' (es-ES), 'Montserrat' (ca-ES)
  const byLang = (prefix: string) =>
    voices.find(v => v.lang.toLowerCase().startsWith(prefix))

  const candidate =
    byLang('ca') ||
    voices.find(v => /Montserrat|Mónica|Monica|Paulina/i.test(v.name)) ||
    byLang('es') ||
    voices[0]

  cachedVoice = candidate || null
  return cachedVoice
}

// El navegador carrega les veus de forma asíncrona; cal esperar l'esdeveniment
export function preloadVoices(): void {
  if (voiceLoadAttempted) return
  voiceLoadAttempted = true
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.getVoices()
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null
    pickVoice()
  }
}

export function speakAsRata(text: string): void {
  if (!('speechSynthesis' in window)) return
  // Atura si hi ha alguna cosa parlant (no acumular)
  window.speechSynthesis.cancel()

  const utter = new SpeechSynthesisUtterance(text)
  const voice = pickVoice()
  if (voice) {
    utter.voice = voice
    utter.lang = voice.lang
  } else {
    utter.lang = 'ca-ES'
  }
  // Veu de rata: pitch alt i velocitat ràpida
  utter.pitch = 1.6
  utter.rate = 1.15
  utter.volume = 1.0
  window.speechSynthesis.speak(utter)
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}

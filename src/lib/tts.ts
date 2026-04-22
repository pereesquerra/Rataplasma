// Text-to-Speech per la Rata Fantasma — Web Speech API
// Veu: català prioritari, pitch alt, velocitat ràpida — rata/nen

let cachedVoice: SpeechSynthesisVoice | null = null
let voiceLoadAttempted = false

function pickVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice
  const voices = window.speechSynthesis.getVoices()
  if (voices.length === 0) return null

  // 1. Qualsevol veu en català (ca-ES, ca-AD, etc.)
  const catala = voices.find(v => v.lang.toLowerCase().startsWith('ca'))
  if (catala) { cachedVoice = catala; return catala }

  // 2. Veus en espanyol que sonen bé (macOS/iOS)
  const castella = voices.find(v => /Montserrat|Mónica|Monica|Paulina/i.test(v.name))
    || voices.find(v => v.lang.toLowerCase().startsWith('es'))
  if (castella) { cachedVoice = castella; return castella }

  cachedVoice = voices[0]
  return cachedVoice
}

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

// Neteja del text perquè el TTS no llegeixi símbols, emojis, URLs, codi…
function cleanForSpeech(text: string): string {
  return text
    // treu blocs de codi ``` …  ```
    .replace(/```[\s\S]*?```/g, ' ')
    // treu codi inline `…`
    .replace(/`[^`]*`/g, ' ')
    // treu URLs
    .replace(/https?:\/\/\S+/g, ' ')
    // treu tags HTML
    .replace(/<[^>]+>/g, ' ')
    // treu emojis
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
    // treu markdown d'èmfasi i símbols estranys
    .replace(/[*_~#>|\[\]{}<>^]/g, '')
    // treu rep. de puntuació ("!!!" → "!")
    .replace(/([!?¡¿.]){2,}/g, '$1')
    // normalitza espais/tabs/salts
    .replace(/\s+/g, ' ')
    .trim()
}

export function speakAsRata(text: string): void {
  if (!('speechSynthesis' in window)) return
  const net = cleanForSpeech(text)
  if (!net) return

  window.speechSynthesis.cancel()

  const utter = new SpeechSynthesisUtterance(net)
  const voice = pickVoice()
  if (voice) {
    utter.voice = voice
    utter.lang = voice.lang
  } else {
    utter.lang = 'ca-ES'
  }
  utter.pitch = 1.6
  utter.rate = 1.0
  utter.volume = 1.0
  window.speechSynthesis.speak(utter)
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}


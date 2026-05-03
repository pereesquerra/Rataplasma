export function speakRataplasma(text: string) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text.replace(/\s+/g, ' ').slice(0, 900))
  const voices = window.speechSynthesis.getVoices()
  utterance.lang = 'ca-ES'
  utterance.pitch = 1.35
  utterance.rate = 1
  utterance.voice = voices.find((voice) => {
    const haystack = `${voice.lang} ${voice.name}`.toLowerCase()
    return haystack.includes('ca') || haystack.includes('montserrat') || haystack.includes('mónica') || haystack.includes('monica')
  }) || null
  window.speechSynthesis.speak(utterance)
}

export function stopSpeech() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}

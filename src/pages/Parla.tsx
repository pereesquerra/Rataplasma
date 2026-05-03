import { FormEvent, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import RataplasmaMascot from '@/components/RataplasmaMascot'
import { speakRataplasma, stopSpeech } from '@/lib/tts'

type Role = 'user' | 'assistant'

interface Message {
  id: string
  role: Role
  content: string
}

const starter: Message = {
  id: 'hola',
  role: 'assistant',
  content: 'Rataplasmaaa! Soc aqui, Pau. Avui vols una historia rara, una pista de guitarra o una idea per trastejar amb codi?',
}

export default function Parla() {
  const [messages, setMessages] = useState<Message[]>([starter])
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [muted, setMuted] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const mascotMood = useMemo(() => loading ? 'parlant' : 'content', [loading])

  async function submit(event: FormEvent) {
    event.preventDefault()
    const clean = draft.trim()
    if (!clean || loading) return

    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content: clean }
    const assistantId = crypto.randomUUID()
    const nextMessages = [...messages, userMessage]
    setMessages([...nextMessages, { id: assistantId, role: 'assistant', content: '' }])
    setDraft('')
    setLoading(true)
    stopSpeech()

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
        signal: controller.signal,
      })

      if (!response.ok || !response.body) {
        throw new Error('La boira ha tallat el cable.')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let full = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const chunks = buffer.split('\n\n')
        buffer = chunks.pop() || ''

        for (const chunk of chunks) {
          const line = chunk.split('\n').find((entry) => entry.startsWith('data: '))
          if (!line) continue
          const payload = line.slice(6)
          if (payload === '[DONE]') continue
          try {
            const parsed = JSON.parse(payload) as {
              type?: string
              delta?: { text?: string }
            }
            if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
              full += parsed.delta.text
              setMessages((current) => current.map((message) => (
                message.id === assistantId ? { ...message, content: full } : message
              )))
            }
          } catch {
            // Ignorem fragments SSE que no siguin JSON d'Anthropic.
          }
        }
      }

      if (!muted && full) speakRataplasma(full)
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        const fallback = 'Ai, ai. El fantasma del router ha fet nyec. Torna-hi d-aqui un moment.'
        setMessages((current) => current.map((message) => (
          message.id === assistantId ? { ...message, content: fallback } : message
        )))
        if (!muted) speakRataplasma(fallback)
      }
    } finally {
      setLoading(false)
      abortRef.current = null
    }
  }

  function toggleMute() {
    setMuted((value) => {
      if (!value) stopSpeech()
      return !value
    })
  }

  function stopAnswer() {
    abortRef.current?.abort()
    stopSpeech()
    setLoading(false)
  }

  return (
    <main className="chat-page">
      <header className="chat-top">
        <Link className="back-link" to="/">← Habitacio</Link>
        <div>
          <span className="eyebrow">walkie fantasma</span>
          <h1>Parla amb la Rata</h1>
        </div>
        <button className="quiet-button" onClick={toggleMute} aria-pressed={muted}>
          {muted ? 'Veu off' : 'Veu on'}
        </button>
      </header>

      <section className="chat-stage">
        <RataplasmaMascot compact mood={mascotMood} />
        <div className="chat-scroll" aria-live="polite">
          {messages.map((message) => (
            <article className={`chat-bubble chat-bubble--${message.role}`} key={message.id}>
              <span>{message.role === 'assistant' ? 'Rataplasma' : 'Pau'}</span>
              <p>{message.content || '...'}</p>
            </article>
          ))}
        </div>
      </section>

      <form className="chat-input" onSubmit={submit}>
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Escriu a la rata..."
          rows={2}
          aria-label="Missatge per a Rataplasma"
        />
        {loading ? (
          <button className="tool-button" type="button" onClick={stopAnswer}>Atura</button>
        ) : (
          <button className="primary-action" type="submit">Envia</button>
        )}
      </form>
    </main>
  )
}

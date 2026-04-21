// Capa simple de crides a les Pages Functions

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function enviarMissatgeAlXat(
  missatges: ChatMessage[],
  signal?: AbortSignal
): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: missatges }),
    signal,
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Error del servidor: ${error}`)
  }

  const data = await res.json() as { resposta: string }
  return data.resposta
}

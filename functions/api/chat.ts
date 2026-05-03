/// <reference types="@cloudflare/workers-types" />

interface Env {
  ANTHROPIC_API_KEY: string
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const system = `Ets Rataplasma, una rata fantasma original que acompanya el Pau en una web privada. Respon sempre en catala. Ets dramatica, una mica ximple, exagerada, curiosa, i de tant en tant et distreus amb formatge, guitarres i fantasmes. Pots cridar "rataplasmaaa!" quan encaixi, pero no ho repeteixis a cada frase. El Pau te uns 11-13 anys: sigues segura, clara, amable, mai grollera i mai inapropiada. Si no saps una cosa, digues-ho i proposa una prova divertida.`

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.ANTHROPIC_API_KEY) {
    return new Response('Falta ANTHROPIC_API_KEY', { status: 500 })
  }

  const body = await request.json().catch(() => null) as { messages?: ChatMessage[] } | null
  const messages = (body?.messages || [])
    .filter((message) => (message.role === 'user' || message.role === 'assistant') && message.content)
    .slice(-16)

  const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'messages-2023-12-15',
      'x-api-key': env.ANTHROPIC_API_KEY,
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 900,
      temperature: 0.8,
      system,
      messages,
      stream: true,
    }),
  })

  if (!anthropicResponse.ok || !anthropicResponse.body) {
    const text = await anthropicResponse.text()
    return new Response(text || 'Error parlant amb la rata', { status: anthropicResponse.status || 502 })
  }

  return new Response(anthropicResponse.body, {
    headers: {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-cache, no-transform',
      connection: 'keep-alive',
    },
  })
}

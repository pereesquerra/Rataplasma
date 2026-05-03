import { FormEvent, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import RataplasmaMascot from '@/components/RataplasmaMascot'
import { login } from '@/lib/auth'
import { playBlip } from '@/lib/audio'

export default function Login() {
  const [name, setName] = useState('Pau')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  function submit(event: FormEvent) {
    event.preventDefault()
    const result = login(name, code)
    if (!result.ok) {
      setError(result.error)
      playBlip(180, 0.22, 'sawtooth')
      return
    }
    playBlip(740, 0.18)
    navigate((location.state as { from?: string } | null)?.from || '/', { replace: true })
  }

  return (
    <main className="login-page">
      <section className="login-door" aria-labelledby="login-title">
        <div>
          <p className="scribble">porta privada</p>
          <h1 id="login-title">Rataplasma</h1>
          <p className="door-note">Una habitacio d'invents, sons i fantasmes per al Pau.</p>
        </div>
        <RataplasmaMascot mood={error ? 'sorpres' : 'content'} />
        <form className="login-form" onSubmit={submit}>
          <label>
            Nom
            <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="given-name" />
          </label>
          <label>
            Codi secret
            <input
              type="password"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              autoComplete="current-password"
              inputMode="text"
            />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-action" type="submit">Obre la porta</button>
        </form>
      </section>
    </main>
  )
}

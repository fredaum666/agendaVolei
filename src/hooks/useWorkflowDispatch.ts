import { useState } from 'react'

type DispatchStatus = 'idle' | 'loading' | 'success' | 'error'

export function useWorkflowDispatch() {
  const [status, setStatus] = useState<DispatchStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function dispatch() {
    const token = import.meta.env.VITE_GITHUB_TOKEN
    if (!token) {
      setStatus('error')
      setErrorMessage('VITE_GITHUB_TOKEN não configurado')
      return
    }

    setStatus('loading')
    setErrorMessage(null)

    try {
      const res = await fetch(
        'https://api.github.com/repos/fredaum666/agendaVolei/actions/workflows/fetch-data.yml/dispatches',
        {
          method: 'POST',
          headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ref: 'main' }),
        }
      )

      if (res.status === 204 || res.status === 422) {
        setStatus('success')
        setTimeout(() => setStatus('idle'), 3000)
      } else if (res.status === 401 || res.status === 403) {
        setStatus('error')
        setErrorMessage('Token inválido ou sem permissão')
      } else {
        setStatus('error')
        setErrorMessage(`Erro ${res.status} — tente novamente`)
      }
    } catch {
      setStatus('error')
      setErrorMessage('Erro de rede — tente novamente')
    }
  }

  return { dispatch, status, errorMessage }
}

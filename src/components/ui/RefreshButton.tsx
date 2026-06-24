import { useState, useRef, useEffect } from 'react'
import { useWorkflowDispatch } from '@/hooks/useWorkflowDispatch'

const CONFIRM_PASSWORD = '36080311'

export function RefreshButton() {
  const { dispatch, status, errorMessage } = useWorkflowDispatch()
  const [showModal, setShowModal] = useState(false)
  const [password, setPassword] = useState('')
  const [wrongPassword, setWrongPassword] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (showModal) {
      setPassword('')
      setWrongPassword(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [showModal])

  function handleButtonClick() {
    if (status === 'loading') return
    setShowModal(true)
  }

  function handleConfirm() {
    if (password === CONFIRM_PASSWORD) {
      setShowModal(false)
      dispatch()
    } else {
      setWrongPassword(true)
      setPassword('')
      inputRef.current?.focus()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleConfirm()
    if (e.key === 'Escape') setShowModal(false)
  }

  return (
    <>
      <button
        onClick={handleButtonClick}
        disabled={status === 'loading'}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
        title="Atualizar dados"
      >
        {status === 'loading' ? (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        )}
        <span className="hidden sm:inline">
          {status === 'success' ? '✓ Iniciado' : status === 'loading' ? 'Atualizando…' : 'Atualizar'}
        </span>
      </button>

      {status === 'error' && errorMessage && (
        <p className="text-red-300 text-[10px] leading-none">{errorMessage}</p>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xs" onClick={e => e.stopPropagation()}>
            <h2 className="text-[#1A3A5C] font-bold text-base mb-1">Confirmar atualização</h2>
            <p className="text-gray-500 text-sm mb-4">Digite a senha para disparar o workflow.</p>

            <input
              ref={inputRef}
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setWrongPassword(false) }}
              onKeyDown={handleKeyDown}
              placeholder="••••••••"
              className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1A3A5C]/30 mb-1 ${wrongPassword ? 'border-red-400' : 'border-gray-300'}`}
            />
            {wrongPassword && <p className="text-red-500 text-xs mb-3">Senha incorreta</p>}
            {!wrongPassword && <div className="mb-3" />}

            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-2 rounded-lg bg-[#1A3A5C] text-white text-sm font-medium hover:bg-[#1A3A5C]/90 transition-colors"
              >
                Atualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

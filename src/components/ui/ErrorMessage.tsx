interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 p-6 text-center bg-red-50 border border-red-200 rounded-xl"
    >
      <span className="text-3xl" aria-hidden>⚠️</span>
      <p className="text-sm text-red-700 font-medium">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
        >
          Tentar novamente
        </button>
      )}
    </div>
  )
}

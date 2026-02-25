interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

const SIZE_CLASS = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-3',
}

export function LoadingSpinner({ size = 'md', className = '', label = 'Carregando...' }: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={`inline-block rounded-full border-[#4A9CC7] border-t-transparent animate-spin ${SIZE_CLASS[size]} ${className}`}
    />
  )
}

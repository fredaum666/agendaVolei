import type { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <main
      className="max-w-2xl mx-auto px-3 py-3 pb-safe"
      style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
    >
      {children}
    </main>
  )
}

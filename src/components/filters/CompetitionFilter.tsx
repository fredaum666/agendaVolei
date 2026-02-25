import { useState, useRef, useEffect } from 'react'
import type { League, LeagueCategory } from '@/types/competition'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface CompetitionFilterProps {
  leagues: League[]
  selectedLeagueId: number | null
  onLeagueSelect: (id: number | null) => void
  isLoading: boolean
}

const CATEGORY_ORDER: LeagueCategory[] = [
  'superliga-m',
  'superliga-f',
  'nacional',
  'internacional',
  'estadual',
]

const CATEGORY_LABELS: Record<LeagueCategory, string> = {
  'superliga-m': 'Superliga',
  'superliga-f': 'Superliga',
  'nacional': 'Nacional',
  'internacional': 'Internacional',
  'estadual': 'Estadual',
}

const CATEGORY_DOT: Record<LeagueCategory, string> = {
  'superliga-m': 'bg-[#1A3A5C]',
  'superliga-f': 'bg-[#8B1A6B]',
  'nacional': 'bg-[#1A6B1A]',
  'internacional': 'bg-[#B8860B]',
  'estadual': 'bg-[#6B3A1A]',
}

function sortLeagues(leagues: League[]): League[] {
  return [...leagues].sort((a, b) => {
    const catA = CATEGORY_ORDER.indexOf(a.category)
    const catB = CATEGORY_ORDER.indexOf(b.category)
    if (catA !== catB) return catA - catB
    return a.displayName.localeCompare(b.displayName, 'pt-BR')
  })
}

function getSelectedLabel(leagues: League[], selectedId: number | null): string {
  if (selectedId === null) return 'Todas as competições'
  return leagues.find(l => l.id === selectedId)?.displayName ?? 'Todas as competições'
}

export function CompetitionFilter({
  leagues,
  selectedLeagueId,
  onLeagueSelect,
  isLoading,
}: CompetitionFilterProps) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const sorted = sortLeagues(leagues)
  const selectedLabel = getSelectedLabel(leagues, selectedLeagueId)
  const selectedLeague = leagues.find(l => l.id === selectedLeagueId)

  // Fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fechar ao pressionar Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  function handleSelect(id: number | null) {
    onLeagueSelect(id)
    setOpen(false)
  }

  // Agrupar ligas por categoria
  const groups: { category: LeagueCategory; label: string; items: League[] }[] = []
  for (const cat of CATEGORY_ORDER) {
    const items = sorted.filter(l => l.category === cat)
    if (items.length > 0) {
      groups.push({ category: cat, label: CATEGORY_LABELS[cat], items })
    }
  }

  return (
    <div className="bg-[#1A3A5C]/5 border-b border-[#1A3A5C]/10 px-3 py-2 relative" ref={wrapperRef}>
      <div className="max-w-2xl mx-auto">
        {/* Botão trigger */}
        <button
          onClick={() => setOpen(v => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label="Selecionar competição"
          disabled={isLoading}
          className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-white border border-[#1A3A5C]/15 shadow-sm text-sm font-medium text-[#1A3A5C] hover:border-[#1A3A5C]/30 hover:shadow transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A9CC7] active:scale-[0.99] disabled:opacity-60 select-none"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <span
                className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                  selectedLeague ? CATEGORY_DOT[selectedLeague.category] : 'bg-[#1A3A5C]'
                }`}
                aria-hidden
              />
            )}
            <span className="truncate font-semibold">
              {isLoading ? 'Carregando...' : selectedLabel}
            </span>
          </div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`flex-shrink-0 text-[#1A3A5C]/40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            aria-hidden
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {/* Dropdown panel */}
        {open && !isLoading && (
          <>
            {/* Overlay para mobile */}
            <div
              className="fixed inset-0 z-40 bg-black/20 sm:hidden"
              onClick={() => setOpen(false)}
              aria-hidden
            />

            <div
              role="listbox"
              aria-label="Competições disponíveis"
              className="absolute left-0 right-0 top-full mt-1 z-50 bg-white rounded-2xl shadow-2xl border border-[#1A3A5C]/10 overflow-hidden"
              style={{ maxHeight: '65vh', overflowY: 'auto' }}
            >
              {/* Opção "Todas" */}
              <div className="sticky top-0 bg-white border-b border-[#E8C99A]/60 z-10">
                <button
                  role="option"
                  aria-selected={selectedLeagueId === null}
                  onClick={() => handleSelect(null)}
                  className={`w-full flex items-center gap-3 px-4 py-4 text-sm font-bold transition-colors ${
                    selectedLeagueId === null
                      ? 'bg-[#1A3A5C] text-white'
                      : 'text-[#1A3A5C] hover:bg-[#EBF4FA] active:bg-[#EBF4FA]'
                  }`}
                >
                  <span
                    className={`w-3 h-3 rounded-full flex-shrink-0 border-2 ${
                      selectedLeagueId === null
                        ? 'bg-white/80 border-white/50'
                        : 'border-[#1A3A5C]/30 bg-transparent'
                    }`}
                    aria-hidden
                  />
                  Todas as competições
                  {selectedLeagueId === null && <CheckIcon className="ml-auto" light />}
                </button>
              </div>

              {/* Grupos */}
              {groups.length === 0 ? (
                <p className="px-4 py-6 text-sm text-center text-[#1A3A5C]/40">
                  Nenhuma competição disponível
                </p>
              ) : (
                groups.map((group, gi) => (
                  <div key={group.category} className={gi > 0 ? 'border-t border-[#F0E8D8]' : ''}>
                    {/* Label do grupo */}
                    <div className="px-4 pt-3 pb-1.5 bg-[#FAFAF8]">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#1A3A5C]/35">
                        {group.label}
                      </span>
                    </div>

                    {/* Itens */}
                    {group.items.map(league => {
                      const isSelected = selectedLeagueId === league.id
                      return (
                        <button
                          key={league.id}
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => handleSelect(league.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm transition-colors ${
                            isSelected
                              ? 'bg-[#EBF4FA] text-[#1A3A5C] font-semibold'
                              : 'text-[#1A3A5C]/80 hover:bg-[#F5F9FC] active:bg-[#EBF4FA] font-medium'
                          }`}
                        >
                          <span
                            className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${CATEGORY_DOT[league.category]}`}
                            aria-hidden
                          />
                          <span className="flex-1 text-left">{league.displayName}</span>
                          {isSelected && <CheckIcon />}
                        </button>
                      )
                    })}
                  </div>
                ))
              )}
              {/* Espaço extra para scroll no iOS */}
              <div className="h-2" />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function CheckIcon({ className = '', light = false }: { className?: string; light?: boolean }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`flex-shrink-0 ${light ? 'text-white/80' : 'text-[#4A9CC7]'} ${className}`}
      aria-hidden
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

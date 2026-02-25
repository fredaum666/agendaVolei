interface EmptyMatchStateProps {
  hasFilter: boolean
}

export function EmptyMatchState({ hasFilter }: EmptyMatchStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 px-4 text-center">
      <span className="text-4xl" aria-hidden>🏐</span>
      <p className="text-sm font-medium text-[#1A3A5C]/60">
        {hasFilter
          ? 'Nenhum jogo desta competição neste dia'
          : 'Nenhum jogo programado para este dia'}
      </p>
      {hasFilter && (
        <p className="text-xs text-[#1A3A5C]/40">
          Tente selecionar "Todas" para ver todos os jogos
        </p>
      )}
    </div>
  )
}

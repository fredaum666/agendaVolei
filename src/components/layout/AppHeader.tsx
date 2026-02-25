export function AppHeader() {
  return (
    <header className="bg-[#1A3A5C] shadow-lg sticky top-0 z-30" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
        <img
          src="/volleyballIcon.png"
          alt=""
          aria-hidden
          className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-black text-white leading-tight tracking-tight">
            Agenda Vôlei
          </h1>
          <p className="text-[10px] text-white/50 leading-none font-medium tracking-wider uppercase">
            Calendário de jogos
          </p>
        </div>
      </div>
    </header>
  )
}

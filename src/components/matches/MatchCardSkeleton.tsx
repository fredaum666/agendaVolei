export function MatchCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E8C99A]/50 overflow-hidden animate-pulse">
      <div className="px-3 py-2 bg-[#1A3A5C]/5 border-b border-[#E8C99A]/40">
        <div className="flex items-center justify-between">
          <div className="h-4 w-20 bg-[#1A3A5C]/10 rounded" />
          <div className="h-3 w-10 bg-[#1A3A5C]/10 rounded" />
        </div>
      </div>
      <div className="px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-7 h-7 rounded-full bg-[#1A3A5C]/10" />
            <div className="h-4 flex-1 bg-[#1A3A5C]/10 rounded" />
          </div>
          <div className="h-3 w-6 bg-[#1A3A5C]/10 rounded mx-2" />
          <div className="flex items-center gap-2 flex-1 justify-end">
            <div className="h-4 flex-1 bg-[#1A3A5C]/10 rounded" />
            <div className="w-7 h-7 rounded-full bg-[#1A3A5C]/10" />
          </div>
        </div>
        <div className="mt-2 h-3 w-32 bg-[#1A3A5C]/10 rounded mx-auto" />
      </div>
    </div>
  )
}

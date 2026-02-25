import { WEEKDAY_LABELS } from '@/lib/utils/date'

export function WeekdayLabels() {
  return (
    <div className="grid grid-cols-7 mb-1" role="row">
      {WEEKDAY_LABELS.map(label => (
        <div
          key={label}
          role="columnheader"
          aria-label={label}
          className="py-2 text-center text-xs font-semibold text-[#2C5F8A] uppercase tracking-wider"
        >
          {label}
        </div>
      ))}
    </div>
  )
}

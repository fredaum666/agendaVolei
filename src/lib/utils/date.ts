import { ptBR } from 'date-fns/locale'
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
  getYear,
  getMonth,
} from 'date-fns'

export { ptBR, parseISO, isSameMonth, isSameDay, isToday, getYear, getMonth }

// Formata mês/ano em português: "Fevereiro 2026"
export function formatMonthYear(date: Date): string {
  const formatted = format(date, 'MMMM yyyy', { locale: ptBR })
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

// Formata data do dia: "15 de fevereiro de 2026"
export function formatFullDate(date: Date): string {
  return format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR })
}

// Formata hora de um jogo: "20:00"
export function formatMatchTime(isoDate: string): string {
  try {
    const date = parseISO(isoDate)
    return format(date, 'HH:mm')
  } catch {
    return '--:--'
  }
}

// Gera chave string para um dia: "2026-02-15"
export function formatDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

// Gera as 42 células do grid do calendário (6 semanas x 7 dias)
// Semana começa no domingo (weekStartsOn: 0)
export function generateCalendarDays(currentMonth: Date): Date[] {
  const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 })
  const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 })
  return eachDayOfInterval({ start, end })
}

// Abreviações dos dias da semana em pt-BR
export const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

// Status do jogo em português
export function formatMatchStatus(statusShort: string): string {
  const statusMap: Record<string, string> = {
    NS: 'Não iniciado',
    LIVE: 'Ao vivo',
    FT: 'Encerrado',
    PD: 'Adiado',
    'Q1': '1º set',
    'Q2': '2º set',
    'Q3': '3º set',
    'Q4': '4º set',
    'Q5': '5º set (tie-break)',
    AWD: 'WO',
    CANC: 'Cancelado',
  }
  return statusMap[statusShort] ?? statusShort
}

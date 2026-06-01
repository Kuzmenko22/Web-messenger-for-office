import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { startOfMonth, endOfMonth, eachDayOfInterval, format, addDays, startOfWeek, endOfWeek, isSameMonth } from 'date-fns'
import { ru } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generatePagination = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages]
  }

  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages]
  }

  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
}

export const formatDateToYYYYMMDD = (
  input: Date | string | null | undefined
): string => {
  if (!input) return ''

  const date = typeof input === 'string' ? new Date(input) : input

  if (!(date instanceof Date) || isNaN(date.getTime())) return ''

  return date.toISOString().split('T')[0] ?? ''
}

export const getWeekDates = (
  currentDate: Date
): { date: Date; label: string }[] => {
  const start = startOfWeek(currentDate, { weekStartsOn: 1 })
  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

  return Array.from({ length: 7 }).map((_, i) => {
    const date = addDays(start, i)
    const label = `${daysOfWeek[i]}, ${date.getDate()}.${date.getMonth() + 1}`
    return { date, label }
  })
}

/*export function getMonthDates(baseDate: Date) {
  const start = startOfWeek(startOfMonth(baseDate), { weekStartsOn: 1 })
  const end = addDays(endOfMonth(baseDate), 6) // захватываем последнюю неделю

  return eachDayOfInterval({ start, end }).map((date) => ({
    date,
    label: format(date, 'EEE', { locale: ru }), // Пн, Вт и т.д.
  }))
}*/

export function getMonthDates(baseDate: Date) {
  const start = startOfWeek(startOfMonth(baseDate), { weekStartsOn: 1 })
  const end = endOfWeek(endOfMonth(baseDate), { weekStartsOn: 1 }) // полная неделя

  return eachDayOfInterval({ start, end }).map((date) => ({
    date,
    label: format(date, 'EEE', { locale: ru }), 
    isCurrentMonth: isSameMonth(date, baseDate), 
  }))
}
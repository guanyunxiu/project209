import type { Holiday } from '@/types'

export const holidays: Holiday[] = [
  { date: '2026-01-01', name: '元旦' },
  { date: '2026-01-28', name: '除夕' },
  { date: '2026-01-29', name: '春节' },
  { date: '2026-01-30', name: '春节' },
  { date: '2026-01-31', name: '春节' },
  { date: '2026-02-01', name: '春节' },
  { date: '2026-02-02', name: '春节' },
  { date: '2026-04-04', name: '清明节' },
  { date: '2026-04-05', name: '清明节' },
  { date: '2026-04-06', name: '清明节' },
  { date: '2026-05-01', name: '劳动节' },
  { date: '2026-05-02', name: '劳动节' },
  { date: '2026-05-03', name: '劳动节' },
  { date: '2026-05-04', name: '劳动节' },
  { date: '2026-05-05', name: '劳动节' },
  { date: '2026-06-19', name: '端午节' },
  { date: '2026-06-20', name: '端午节' },
  { date: '2026-06-21', name: '端午节' },
  { date: '2026-10-01', name: '国庆节' },
  { date: '2026-10-02', name: '国庆节' },
  { date: '2026-10-03', name: '国庆节' },
  { date: '2026-10-04', name: '国庆节' },
  { date: '2026-10-05', name: '国庆节' },
  { date: '2026-10-06', name: '国庆节' },
  { date: '2026-10-07', name: '国庆节' },
]

export const getHoliday = (dateStr: string): Holiday | undefined => {
  return holidays.find(h => h.date === dateStr)
}

export const isHoliday = (dateStr: string): boolean => {
  return holidays.some(h => h.date === dateStr)
}

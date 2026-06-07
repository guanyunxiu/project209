import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import localeData from 'dayjs/plugin/localeData'
import 'dayjs/locale/zh-cn'
import type { DayCell, CalendarEvent, ViewType } from '@/types'
import { isHoliday, getHoliday } from './holidays'

dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.locale('zh-cn')

export const generateMonthDays = (
  year: number,
  month: number,
  selectedDate: string,
  events: CalendarEvent[]
): DayCell[] => {
  const firstDay = dayjs(`${year}-${month + 1}-01`)
  const startDay = firstDay.weekday(0)
  const today = dayjs().format('YYYY-MM-DD')
  const cells: DayCell[] = []

  for (let i = 0; i < 42; i++) {
    const currentDate = startDay.add(i, 'day')
    const dateStr = currentDate.format('YYYY-MM-DD')
    const dayEvents = events.filter(e => e.date === dateStr)

    cells.push({
      date: dateStr,
      day: currentDate.date(),
      isCurrentMonth: currentDate.month() === month,
      isToday: dateStr === today,
      isSelected: dateStr === selectedDate,
      isWeekend: currentDate.day() === 0 || currentDate.day() === 6,
      isHoliday: isHoliday(dateStr),
      holidayName: getHoliday(dateStr)?.name,
      events: dayEvents
    })
  }

  return cells
}

export const generateWeekDays = (
  year: number,
  month: number,
  day: number,
  selectedDate: string,
  events: CalendarEvent[]
): DayCell[] => {
  const currentDate = dayjs(`${year}-${month + 1}-${day}`)
  const startOfWeek = currentDate.weekday(0)
  const today = dayjs().format('YYYY-MM-DD')
  const cells: DayCell[] = []

  for (let i = 0; i < 7; i++) {
    const date = startOfWeek.add(i, 'day')
    const dateStr = date.format('YYYY-MM-DD')
    const dayEvents = events.filter(e => e.date === dateStr)

    cells.push({
      date: dateStr,
      day: date.date(),
      isCurrentMonth: date.month() === month,
      isToday: dateStr === today,
      isSelected: dateStr === selectedDate,
      isWeekend: date.day() === 0 || date.day() === 6,
      isHoliday: isHoliday(dateStr),
      holidayName: getHoliday(dateStr)?.name,
      events: dayEvents
    })
  }

  return cells
}

export const getMonthLabel = (year: number, month: number): string => {
  return dayjs(`${year}-${month + 1}-01`).format('YYYY年MM月')
}

export const getWeekLabel = (year: number, month: number, day: number): string => {
  const currentDate = dayjs(`${year}-${month + 1}-${day}`)
  const startOfWeek = currentDate.weekday(0)
  const endOfWeek = startOfWeek.add(6, 'day')
  return `${startOfWeek.format('MM月DD日')} - ${endOfWeek.format('MM月DD日')}`
}

export const navigateDate = (
  viewType: ViewType,
  year: number,
  month: number,
  day: number,
  direction: 'prev' | 'next'
): { year: number; month: number; day: number } => {
  const current = dayjs(`${year}-${month + 1}-${day}`)
  const target = viewType === 'month'
    ? (direction === 'prev' ? current.subtract(1, 'month') : current.add(1, 'month'))
    : (direction === 'prev' ? current.subtract(1, 'week') : current.add(1, 'week'))

  return {
    year: target.year(),
    month: target.month(),
    day: target.date()
  }
}

export const goToToday = (): { year: number; month: number; day: number } => {
  const today = dayjs()
  return {
    year: today.year(),
    month: today.month(),
    day: today.date()
  }
}

export const getWeekdayLabels = (): string[] => {
  return ['日', '一', '二', '三', '四', '五', '六']
}

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

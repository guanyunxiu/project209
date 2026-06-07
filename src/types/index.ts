export interface CalendarEvent {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  color: string
  isMarked?: boolean
  createdAt: number
  updatedAt: number
}

export interface DayCell {
  date: string
  day: number
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  isWeekend: boolean
  isHoliday: boolean
  holidayName?: string
  events: CalendarEvent[]
}

export type ViewType = 'month' | 'week'

export interface Holiday {
  date: string
  name: string
}

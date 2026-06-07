import type { CalendarEvent } from '@/types'

const STORAGE_KEY = 'calendar_events'

export const loadEvents = (): CalendarEvent[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      return JSON.parse(data)
    }
  } catch (e) {
    console.error('Failed to load events from localStorage:', e)
  }
  return []
}

export const saveEvents = (events: CalendarEvent[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  } catch (e) {
    console.error('Failed to save events to localStorage:', e)
  }
}

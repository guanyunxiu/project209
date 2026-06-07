import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import dayjs from 'dayjs'
import type { CalendarEvent, ViewType } from '@/types'
import { loadEvents, saveEvents } from '@/utils/storage'
import { generateId } from '@/utils/calendar'

export const useCalendarStore = defineStore('calendar', () => {
  const currentYear = ref(dayjs().year())
  const currentMonth = ref(dayjs().month())
  const currentDay = ref(dayjs().date())
  const selectedDate = ref(dayjs().format('YYYY-MM-DD'))
  const viewType = ref<ViewType>('month')
  const events = ref<CalendarEvent[]>(loadEvents())
  const hoverEvent = ref<CalendarEvent | null>(null)
  const dialogVisible = ref(false)
  const editingEvent = ref<CalendarEvent | null>(null)
  const dialogMode = ref<'add' | 'edit' | 'view'>('add')

  const eventColors = [
    { name: '蓝色', value: '#409eff' },
    { name: '绿色', value: '#67c23a' },
    { name: '橙色', value: '#e6a23c' },
    { name: '红色', value: '#f56c6c' },
    { name: '紫色', value: '#8e44ad' },
    { name: '青色', value: '#16a085' }
  ]

  const eventsByDate = computed(() => {
    const map: Record<string, CalendarEvent[]> = {}
    events.value.forEach(event => {
      if (!map[event.date]) {
        map[event.date] = []
      }
      map[event.date].push(event)
    })
    return map
  })

  watch(events, (newEvents) => {
    saveEvents(newEvents)
  }, { deep: true })

  const setViewType = (type: ViewType) => {
    viewType.value = type
  }

  const setSelectedDate = (date: string) => {
    selectedDate.value = date
    const d = dayjs(date)
    currentYear.value = d.year()
    currentMonth.value = d.month()
    currentDay.value = d.date()
  }

  const navigatePrev = () => {
    if (viewType.value === 'month') {
      const prev = dayjs(`${currentYear.value}-${currentMonth.value + 1}-01`).subtract(1, 'month')
      currentYear.value = prev.year()
      currentMonth.value = prev.month()
      currentDay.value = Math.min(currentDay.value, prev.daysInMonth())
    } else {
      const prev = dayjs(`${currentYear.value}-${currentMonth.value + 1}-${currentDay.value}`).subtract(1, 'week')
      currentYear.value = prev.year()
      currentMonth.value = prev.month()
      currentDay.value = prev.date()
    }
  }

  const navigateNext = () => {
    if (viewType.value === 'month') {
      const next = dayjs(`${currentYear.value}-${currentMonth.value + 1}-01`).add(1, 'month')
      currentYear.value = next.year()
      currentMonth.value = next.month()
      currentDay.value = Math.min(currentDay.value, next.daysInMonth())
    } else {
      const next = dayjs(`${currentYear.value}-${currentMonth.value + 1}-${currentDay.value}`).add(1, 'week')
      currentYear.value = next.year()
      currentMonth.value = next.month()
      currentDay.value = next.date()
    }
  }

  const goToToday = () => {
    const today = dayjs()
    currentYear.value = today.year()
    currentMonth.value = today.month()
    currentDay.value = today.date()
    selectedDate.value = today.format('YYYY-MM-DD')
  }

  const addEvent = (eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now()
    const newEvent: CalendarEvent = {
      ...eventData,
      id: generateId(),
      createdAt: now,
      updatedAt: now
    }
    events.value.push(newEvent)
  }

  const updateEvent = (id: string, eventData: Partial<CalendarEvent>) => {
    const index = events.value.findIndex(e => e.id === id)
    if (index !== -1) {
      events.value[index] = {
        ...events.value[index],
        ...eventData,
        updatedAt: Date.now()
      }
    }
  }

  const deleteEvent = (id: string) => {
    const index = events.value.findIndex(e => e.id === id)
    if (index !== -1) {
      events.value.splice(index, 1)
    }
  }

  const openAddDialog = (date?: string) => {
    editingEvent.value = null
    dialogMode.value = 'add'
    dialogVisible.value = true
    if (date) {
      selectedDate.value = date
    }
  }

  const openEditDialog = (event: CalendarEvent) => {
    editingEvent.value = { ...event }
    dialogMode.value = 'edit'
    dialogVisible.value = true
  }

  const openViewDialog = (event: CalendarEvent) => {
    editingEvent.value = { ...event }
    dialogMode.value = 'view'
    dialogVisible.value = true
  }

  const closeDialog = () => {
    dialogVisible.value = false
    editingEvent.value = null
  }

  return {
    currentYear,
    currentMonth,
    currentDay,
    selectedDate,
    viewType,
    events,
    hoverEvent,
    dialogVisible,
    editingEvent,
    dialogMode,
    eventColors,
    eventsByDate,
    setViewType,
    setSelectedDate,
    navigatePrev,
    navigateNext,
    goToToday,
    addEvent,
    updateEvent,
    deleteEvent,
    openAddDialog,
    openEditDialog,
    openViewDialog,
    closeDialog
  }
})

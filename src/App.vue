<script setup lang="ts">
import { computed } from 'vue'
import { useCalendarStore } from '@/stores/calendar'
import { generateMonthDays, generateWeekDays, getMonthLabel, getWeekLabel, getWeekdayLabels } from '@/utils/calendar'
import type { DayCell, CalendarEvent } from '@/types'
import CalendarHeader from '@/components/CalendarHeader.vue'
import EventDialog from '@/components/EventDialog.vue'

const store = useCalendarStore()

const weekdayLabels = getWeekdayLabels()

const dateLabel = computed(() => {
  if (store.viewType === 'month') {
    return getMonthLabel(store.currentYear, store.currentMonth)
  }
  return getWeekLabel(store.currentYear, store.currentMonth, store.currentDay)
})

const days = computed<DayCell[]>(() => {
  if (store.viewType === 'month') {
    return generateMonthDays(
      store.currentYear,
      store.currentMonth,
      store.selectedDate,
      store.events
    )
  }
  return generateWeekDays(
    store.currentYear,
    store.currentMonth,
    store.currentDay,
    store.selectedDate,
    store.events
  )
})

const handleDayClick = (day: DayCell) => {
  store.setSelectedDate(day.date)
}

const handleDayDoubleClick = (day: DayCell) => {
  store.setSelectedDate(day.date)
  store.openAddDialog(day.date)
}

const handleEventClick = (event: CalendarEvent, e: Event) => {
  e.stopPropagation()
  store.openViewDialog(event)
}

const getDisplayEvents = (events: CalendarEvent[]) => {
  return events.slice(0, 3)
}

const getMoreCount = (events: CalendarEvent[]) => {
  return Math.max(0, events.length - 3)
}
</script>

<template>
  <div class="calendar-container">
    <CalendarHeader :date-label="dateLabel" />

    <div class="calendar-body">
      <div class="weekday-header">
        <div
          v-for="(label, index) in weekdayLabels"
          :key="label"
          class="weekday-cell"
          :class="{ weekend: index === 0 || index === 6 }"
        >
          {{ label }}
        </div>
      </div>

      <div :class="store.viewType === 'month' ? 'month-view' : 'week-view'">
        <div
          v-for="day in days"
          :key="day.date"
          class="day-cell"
          :class="{
            'other-month': !day.isCurrentMonth,
            today: day.isToday,
            selected: day.isSelected,
            holiday: day.isHoliday,
            weekend: day.isWeekend
          }"
          @click="handleDayClick(day)"
          @dblclick="handleDayDoubleClick(day)"
        >
          <span class="day-number">{{ day.day }}</span>
          <span v-if="day.holidayName" class="holiday-label">{{ day.holidayName }}</span>

          <div class="events-list">
            <div
              v-for="event in getDisplayEvents(day.events)"
              :key="event.id"
              class="event-item"
              :style="{ backgroundColor: event.color }"
              @click="handleEventClick(event, $event)"
            >
              {{ event.startTime }} {{ event.title }}
            </div>
            <div
              v-if="getMoreCount(day.events) > 0"
              class="event-item more-events"
            >
              +{{ getMoreCount(day.events) }} 更多
            </div>
          </div>
        </div>
      </div>
    </div>

    <EventDialog />
  </div>
</template>

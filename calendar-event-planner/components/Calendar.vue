<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <div class="flex items-center justify-between mb-6">
      <button
        @click="prevMonth"
        class="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      
      <h2 class="text-2xl font-bold text-gray-800">
        {{ currentYear }}年{{ currentMonth + 1 }}月
      </h2>
      
      <button
        @click="nextMonth"
        class="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>
    
    <div class="grid grid-cols-7 gap-1 mb-2">
      <div
        v-for="day in weekDays"
        :key="day"
        class="text-center text-sm font-medium text-gray-500 py-2"
      >
        {{ day }}
      </div>
    </div>
    
    <div class="grid grid-cols-7 gap-1">
      <div
        v-for="(day, index) in calendarDays"
        :key="index"
        @click="day.date && selectDate(day.date)"
        :class="[
          'min-h-24 p-2 rounded-lg border transition-all cursor-pointer relative',
          day.isCurrentMonth ? 'bg-white border-gray-200 hover:border-blue-400' : 'bg-gray-50 border-gray-100',
          day.isToday ? 'ring-2 ring-blue-500' : '',
          selectedDate === day.date ? 'bg-blue-50 border-blue-400' : ''
        ]"
      >
        <span
          :class="[
            'text-sm font-medium',
            day.isCurrentMonth ? 'text-gray-800' : 'text-gray-400',
            day.isToday ? 'text-blue-600' : ''
          ]"
        >
          {{ day.day }}
        </span>
        
        <div class="mt-1 space-y-1">
          <div
            v-for="event in getEventsForDate(day.date)"
            :key="event.id"
            @click.stop="editEvent(event)"
            class="text-xs px-1 py-0.5 rounded text-white cursor-pointer hover:opacity-80"
            :style="{ backgroundColor: event.color }"
            :class="[
              event.startDate === event.endDate ? 'truncate' : '',
              event.startDate === day.date && event.endDate !== day.date ? 'rounded-r-none' : '',
              event.endDate === day.date && event.startDate !== day.date ? 'rounded-l-none' : '',
              event.startDate < day.date && event.endDate > day.date ? 'rounded-none -mx-2' : ''
            ]"
          >
            <span v-if="event.startDate === day.date">{{ event.startTime }} </span>
            {{ event.title }}
            <span v-if="event.endDate === day.date"> {{ event.endTime }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CalendarEvent } from '~/types'

const props = defineProps<{
  events: CalendarEvent[]
  selectedDate: string
}>()

const emit = defineEmits<{
  (e: 'selectDate', date: string): void
  (e: 'editEvent', event: CalendarEvent): void
}>()

const weekDays = ['日', '一', '二', '三', '四', '五', '六']

const now = new Date()
const currentYear = ref(now.getFullYear())
const currentMonth = ref(now.getMonth())

const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

const calendarDays = computed(() => {
  const days = []
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  
  const startDay = firstDay.getDay()
  const prevMonthLastDay = new Date(currentYear.value, currentMonth.value, 0).getDate()
  
  for (let i = startDay - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i
    const date = formatDate(currentYear.value, currentMonth.value - 1, day)
    days.push({ day, date, isCurrentMonth: false, isToday: date === today })
  }
  
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = formatDate(currentYear.value, currentMonth.value, i)
    days.push({ day: i, date, isCurrentMonth: true, isToday: date === today })
  }
  
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    const date = formatDate(currentYear.value, currentMonth.value + 1, i)
    days.push({ day: i, date, isCurrentMonth: false, isToday: date === today })
  }
  
  return days
})

const formatDate = (year: number, month: number, day: number) => {
  const d = new Date(year, month, day)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

const selectDate = (date: string) => {
  emit('selectDate', date)
}

const editEvent = (event: CalendarEvent) => {
  emit('editEvent', event)
}

const getEventsForDate = (date: string) => {
  return props.events.filter(e => e.startDate <= date && e.endDate >= date)
}
</script>

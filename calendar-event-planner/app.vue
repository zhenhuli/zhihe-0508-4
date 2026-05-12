<template>
  <div class="min-h-screen bg-gray-100">
    <div class="container mx-auto px-4 py-8">
      <header class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">📅 日历事件规划</h1>
        <p class="text-gray-600">管理您的日程安排</p>
      </header>
      
      <div class="grid lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <Calendar
            :events="events"
            :selected-date="selectedDate"
            @select-date="handleSelectDate"
            @edit-event="handleEditEvent"
          />
        </div>
        
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-gray-800">事件列表</h2>
              <button
                @click="showModal = true"
                class="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors"
              >
                + 添加
              </button>
            </div>
            
            <div class="mb-4">
              <input
                v-model="filterDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                @change="applyFilter"
              />
            </div>
            
            <div class="space-y-3 max-h-96 overflow-y-auto">
              <div
                v-for="event in filteredEvents"
                :key="event.id"
                @click="handleEditEvent(event)"
                class="p-3 rounded-lg border border-gray-200 hover:border-blue-400 cursor-pointer transition-all"
              >
                <div class="flex items-center gap-2 mb-1">
                  <div
                    class="w-3 h-3 rounded-full"
                    :style="{ backgroundColor: event.color }"
                  ></div>
                  <h3 class="font-medium text-gray-800">{{ event.title }}</h3>
                </div>
                <p class="text-sm text-gray-500">
                  {{ event.startDate }} {{ event.startTime }} 
                  <span v-if="event.startDate !== event.endDate || event.startTime !== event.endTime">
                    → {{ event.endDate }} {{ event.endTime }}
                  </span>
                </p>
                <p v-if="event.description" class="text-sm text-gray-600 mt-1">{{ event.description }}</p>
              </div>
              
              <div v-if="filteredEvents.length === 0" class="text-center py-8 text-gray-500">
                暂无事件
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <EventModal
      :show="showModal"
      :selected-date="selectedDate"
      :event="editingEvent"
      @close="handleModalClose"
      @save="handleSaveEvent"
      @delete="handleDeleteEvent"
    />
  </div>
</template>

<script setup lang="ts">
import type { CalendarEvent } from '~/types'

const { events, addEvent, updateEvent, deleteEvent } = useStorage()

const now = new Date()
const selectedDate = ref(
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
)
const filterDate = ref('')
const showModal = ref(false)
const editingEvent = ref<CalendarEvent | null>(null)

const filteredEvents = computed(() => {
  if (!filterDate.value) {
    return events.value
  }
  return events.value.filter(e => e.startDate <= filterDate.value && e.endDate >= filterDate.value)
})

const handleSelectDate = (date: string) => {
  selectedDate.value = date
  editingEvent.value = null
  showModal.value = true
}

const handleEditEvent = (event: CalendarEvent) => {
  editingEvent.value = event
  showModal.value = true
}

const handleModalClose = () => {
  showModal.value = false
  editingEvent.value = null
}

const handleSaveEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
  if (editingEvent.value) {
    updateEvent(editingEvent.value.id, eventData)
  } else {
    addEvent(eventData)
  }
}

const handleDeleteEvent = (id: string) => {
  deleteEvent(id)
}

const applyFilter = () => {
}
</script>

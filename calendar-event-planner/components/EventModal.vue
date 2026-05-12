<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl max-h-screen overflow-y-auto">
      <h2 class="text-xl font-bold mb-4">{{ isEditing ? '编辑事件' : '添加事件' }}</h2>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">标题</label>
          <input
            v-model="form.title"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入事件标题"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">描述</label>
          <textarea
            v-model="form.description"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="输入事件描述"
          ></textarea>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">开始日期</label>
            <input
              v-model="form.startDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="autoSetEndDate"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">开始时间</label>
            <input
              v-model="form.startTime"
              type="time"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">结束日期</label>
            <input
              v-model="form.endDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">结束时间</label>
            <input
              v-model="form.endTime"
              type="time"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">颜色</label>
          <div class="flex gap-2">
            <button
              v-for="color in colors"
              :key="color"
              @click="form.color = color"
              :class="[
                'w-8 h-8 rounded-full border-2',
                form.color === color ? 'border-gray-800 scale-110' : 'border-gray-300'
              ]"
              :style="{ backgroundColor: color }"
            ></button>
          </div>
        </div>
      </div>
      
      <div class="flex gap-3 mt-6">
        <button
          @click="handleSave"
          class="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          保存
        </button>
        <button
          v-if="isEditing"
          @click="handleDelete"
          class="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
        >
          删除
        </button>
        <button
          @click="handleClose"
          class="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
        >
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CalendarEvent } from '~/types'

const props = defineProps<{
  show: boolean
  selectedDate: string
  event?: CalendarEvent | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', event: Omit<CalendarEvent, 'id'>): void
  (e: 'delete', id: string): void
}>()

const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899']

const isEditing = computed(() => !!props.event)

const form = ref({
  title: '',
  description: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  color: colors[3]
})

watch(() => props.show, (newVal) => {
  if (newVal) {
    if (props.event) {
      form.value = {
        title: props.event.title,
        description: props.event.description,
        startDate: props.event.startDate,
        startTime: props.event.startTime,
        endDate: props.event.endDate,
        endTime: props.event.endTime,
        color: props.event.color
      }
    } else {
      form.value = {
        title: '',
        description: '',
        startDate: props.selectedDate,
        startTime: '09:00',
        endDate: props.selectedDate,
        endTime: '10:00',
        color: colors[3]
      }
    }
  }
})

const autoSetEndDate = () => {
  if (form.value.startDate > form.value.endDate) {
    form.value.endDate = form.value.startDate
  }
}

const handleSave = () => {
  if (!form.value.title) return
  emit('save', form.value)
  handleClose()
}

const handleDelete = () => {
  if (props.event) {
    emit('delete', props.event.id)
    handleClose()
  }
}

const handleClose = () => {
  emit('close')
}
</script>

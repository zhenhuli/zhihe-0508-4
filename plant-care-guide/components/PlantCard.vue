<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div class="relative">
      <img :src="plant.image" :alt="plant.name" class="w-full h-48 object-cover" />
      <button
        @click.stop="toggleFavorite(plant.id)"
        class="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
      >
        <span class="text-2xl">{{ isFavorite(plant.id) ? '❤️' : '🤍' }}</span>
      </button>
      <span
        class="absolute bottom-3 left-3 px-3 py-1 rounded-full text-sm font-medium"
        :class="difficultyClass"
      >
        {{ difficultyText }}
      </span>
    </div>
    <div class="p-5">
      <h3 class="text-xl font-bold text-gray-800 mb-1">{{ plant.name }}</h3>
      <p class="text-sm text-gray-500 italic mb-3">{{ plant.scientificName }}</p>
      <p class="text-gray-600 text-sm line-clamp-2 mb-4">{{ plant.description }}</p>
      
      <div class="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <div class="flex items-center gap-1">
          <span>{{ plant.light.icon }}</span>
          <span>{{ plant.light.level }}</span>
        </div>
        <div class="flex items-center gap-1">
          <span>{{ plant.water.icon }}</span>
          <span>{{ plant.water.frequency }}</span>
        </div>
        <div class="flex items-center gap-1">
          <span>{{ plant.temperature.icon }}</span>
          <span>{{ plant.temperature.min }}-{{ plant.temperature.max }}°C</span>
        </div>
      </div>
      
      <button
        @click="goToDetail"
        class="w-full py-2 px-4 bg-plant-green text-white rounded-lg hover:bg-plant-light transition-colors"
      >
        查看详情
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Plant } from '~/types'

const props = defineProps<{
  plant: Plant
}>()

const { isFavorite, toggleFavorite } = useFavorites()

const difficultyClass = computed(() => {
  switch (props.plant.difficulty) {
    case 'easy':
      return 'bg-green-100 text-green-700'
    case 'medium':
      return 'bg-yellow-100 text-yellow-700'
    case 'hard':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
})

const difficultyText = computed(() => {
  switch (props.plant.difficulty) {
    case 'easy':
      return '简单'
    case 'medium':
      return '中等'
    case 'hard':
      return '困难'
    default:
      return '未知'
  }
})

const goToDetail = () => {
  navigateTo(`/plant/${props.plant.id}`)
}
</script>

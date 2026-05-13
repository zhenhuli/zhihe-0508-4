<template>
  <div class="min-h-screen py-8">
    <div v-if="plant" class="max-w-4xl mx-auto px-4">
      <button
        @click="navigateBack"
        class="flex items-center gap-2 text-gray-600 hover:text-plant-green mb-6 transition-colors"
      >
        <span>←</span>
        <span>返回列表</span>
      </button>
      
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="relative">
          <img :src="plant.image" :alt="plant.name" class="w-full h-72 object-cover" />
          <button
            @click="toggleFavorite(plant.id)"
            class="absolute top-4 right-4 p-3 rounded-full bg-white/80 hover:bg-white transition-colors"
          >
            <span class="text-3xl">{{ isFavorite(plant.id) ? '❤️' : '🤍' }}</span>
          </button>
        </div>
        
        <div class="p-8">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-800 mb-1">{{ plant.name }}</h1>
              <p class="text-gray-500 italic">{{ plant.scientificName }}</p>
            </div>
            <span
              class="px-4 py-2 rounded-full text-sm font-medium"
              :class="difficultyClass"
            >
              {{ difficultyText }}
            </span>
          </div>
          
          <p class="text-gray-600 text-lg mb-8">{{ plant.description }}</p>
          
          <h2 class="text-xl font-bold text-gray-800 mb-4">📋 养护指南</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
              <div class="flex items-center gap-3 mb-3">
                <span class="text-3xl">{{ plant.light.icon }}</span>
                <div>
                  <h3 class="font-bold text-gray-800">光照需求</h3>
                  <p class="text-sm text-gray-500">{{ plant.light.level }}</p>
                </div>
              </div>
              <p class="text-gray-600 text-sm">{{ plant.light.description }}</p>
            </div>
            
            <div class="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <div class="flex items-center gap-3 mb-3">
                <span class="text-3xl">{{ plant.water.icon }}</span>
                <div>
                  <h3 class="font-bold text-gray-800">浇水频率</h3>
                  <p class="text-sm text-gray-500">{{ plant.water.frequency }}</p>
                </div>
              </div>
              <p class="text-gray-600 text-sm">{{ plant.water.description }}</p>
            </div>
            
            <div class="bg-red-50 rounded-xl p-6 border border-red-100">
              <div class="flex items-center gap-3 mb-3">
                <span class="text-3xl">{{ plant.temperature.icon }}</span>
                <div>
                  <h3 class="font-bold text-gray-800">温度要求</h3>
                  <p class="text-sm text-gray-500">{{ plant.temperature.min }}-{{ plant.temperature.max }}°C</p>
                </div>
              </div>
              <p class="text-gray-600 text-sm">{{ plant.temperature.description }}</p>
            </div>
          </div>
          
          <div class="bg-green-50 rounded-xl p-6 border border-green-100">
            <h2 class="text-xl font-bold text-gray-800 mb-4">💡 养护小贴士</h2>
            <ul class="space-y-3">
              <li v-for="(tip, index) in plant.tips" :key="index" class="flex items-start gap-3">
                <span class="text-green-500 mt-0.5">✓</span>
                <span class="text-gray-600">{{ tip }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="max-w-4xl mx-auto px-4 text-center py-16">
      <p class="text-gray-500 text-lg">植物未找到</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { plants } from '~/data/plants'
import type { Plant } from '~/types'

const route = useRoute()
const { isFavorite, toggleFavorite } = useFavorites()

const plantId = computed(() => parseInt(route.params.id as string))

const plant = computed<Plant | undefined>(() => {
  return plants.find(p => p.id === plantId.value)
})

const difficultyClass = computed(() => {
  if (!plant.value) return ''
  switch (plant.value.difficulty) {
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
  if (!plant.value) return ''
  switch (plant.value.difficulty) {
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

const navigateBack = () => {
  navigateTo('/')
}
</script>

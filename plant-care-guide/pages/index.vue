<template>
  <div class="min-h-screen">
    <div class="bg-gradient-to-r from-plant-green to-plant-light py-16">
      <div class="max-w-6xl mx-auto px-4 text-center">
        <h1 class="text-4xl font-bold text-white mb-4">🌿 植物养护指南</h1>
        <p class="text-green-100 text-lg max-w-2xl mx-auto">
          发现适合你的植物，学习专业的养护知识，让每一株植物都茁壮成长
        </p>
      </div>
    </div>
    
    <div class="max-w-6xl mx-auto px-4 py-12">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-2xl font-bold text-gray-800">🌱 推荐植物</h2>
        <span class="text-gray-500">共 {{ filteredPlants.length }} 种植物</span>
      </div>
      
      <div class="flex flex-wrap gap-3 mb-8">
        <button
          @click="selectedDifficulty = 'all'"
          class="px-5 py-2.5 rounded-full font-medium transition-all duration-200"
          :class="selectedDifficulty === 'all' 
            ? 'bg-plant-green text-white shadow-md' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        >
          全部
        </button>
        <button
          @click="selectedDifficulty = 'easy'"
          class="px-5 py-2.5 rounded-full font-medium transition-all duration-200 flex items-center gap-2"
          :class="selectedDifficulty === 'easy' 
            ? 'bg-green-500 text-white shadow-md' 
            : 'bg-green-50 text-green-700 hover:bg-green-100'"
        >
          <span>😊</span>
          <span>简单</span>
        </button>
        <button
          @click="selectedDifficulty = 'medium'"
          class="px-5 py-2.5 rounded-full font-medium transition-all duration-200 flex items-center gap-2"
          :class="selectedDifficulty === 'medium' 
            ? 'bg-yellow-500 text-white shadow-md' 
            : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'"
        >
          <span>🤔</span>
          <span>中等</span>
        </button>
        <button
          @click="selectedDifficulty = 'hard'"
          class="px-5 py-2.5 rounded-full font-medium transition-all duration-200 flex items-center gap-2"
          :class="selectedDifficulty === 'hard' 
            ? 'bg-red-500 text-white shadow-md' 
            : 'bg-red-50 text-red-700 hover:bg-red-100'"
        >
          <span>💪</span>
          <span>困难</span>
        </button>
      </div>
      
      <div v-if="filteredPlants.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PlantCard v-for="plant in filteredPlants" :key="plant.id" :plant="plant" />
      </div>
      
      <div v-else class="text-center py-16">
        <div class="text-6xl mb-4">🌱</div>
        <h3 class="text-xl font-bold text-gray-700 mb-2">暂无该难度的植物</h3>
        <p class="text-gray-500">试试选择其他难度吧！</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { plants } from '~/data/plants'

const selectedDifficulty = ref<'all' | 'easy' | 'medium' | 'hard'>('all')

const filteredPlants = computed(() => {
  if (selectedDifficulty.value === 'all') {
    return plants
  }
  return plants.filter(plant => plant.difficulty === selectedDifficulty.value)
})
</script>

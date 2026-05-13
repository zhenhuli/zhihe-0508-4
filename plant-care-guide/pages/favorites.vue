<template>
  <div class="min-h-screen">
    <div class="bg-gradient-to-r from-plant-green to-plant-light py-16">
      <div class="max-w-6xl mx-auto px-4 text-center">
        <h1 class="text-4xl font-bold text-white mb-4">❤️ 我的收藏</h1>
        <p class="text-green-100 text-lg">
          收藏你喜爱的植物，随时查看养护指南
        </p>
      </div>
    </div>
    
    <div class="max-w-6xl mx-auto px-4 py-12">
      <div v-if="favoritePlants.length > 0">
        <h2 class="text-2xl font-bold text-gray-800 mb-8">已收藏的植物 ({{ favoritePlants.length }})</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PlantCard v-for="plant in favoritePlants" :key="plant.id" :plant="plant" />
        </div>
      </div>
      
      <div v-else class="text-center py-16">
        <div class="text-6xl mb-4">🌱</div>
        <h3 class="text-xl font-bold text-gray-700 mb-2">还没有收藏植物</h3>
        <p class="text-gray-500 mb-6">浏览植物列表，收藏你喜欢的养护方案吧！</p>
        <NuxtLink
          to="/"
          class="inline-block py-3 px-8 bg-plant-green text-white rounded-lg hover:bg-plant-light transition-colors"
        >
          浏览植物
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { plants } from '~/data/plants'

const { favorites } = useFavorites()

const favoritePlants = computed(() => {
  return plants.filter(plant => favorites.value.includes(plant.id))
})
</script>

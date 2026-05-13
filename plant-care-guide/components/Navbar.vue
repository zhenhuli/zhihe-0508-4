<template>
  <nav class="bg-white shadow-md sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="text-2xl">🌿</span>
          <span class="text-xl font-bold text-plant-green">植物养护指南</span>
        </NuxtLink>
        
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/"
            class="px-4 py-2 rounded-lg text-gray-600 hover:bg-green-50 hover:text-plant-green transition-colors"
            :class="{ 'bg-green-50 text-plant-green': $route.path === '/' }"
          >
            首页
          </NuxtLink>
          <NuxtLink
            to="/favorites"
            class="px-4 py-2 rounded-lg text-gray-600 hover:bg-green-50 hover:text-plant-green transition-colors flex items-center gap-2"
            :class="{ 'bg-green-50 text-plant-green': $route.path === '/favorites' }"
          >
            <span>❤️</span>
            <span>我的收藏</span>
            <span v-if="favorites.length > 0" class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {{ favorites.length }}
            </span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { favorites } = useFavorites()
</script>

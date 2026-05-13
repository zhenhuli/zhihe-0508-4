<template>
  <NuxtLink :to="`/yoga/${pose.id}`" class="block">
    <div class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div class="relative h-48 overflow-hidden">
        <img :src="pose.image" :alt="pose.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
        <div class="absolute top-3 right-3">
          <span :class="difficultyClass" class="px-3 py-1 rounded-full text-white text-sm font-medium">
            {{ difficultyLabel }}
          </span>
        </div>
      </div>
      <div class="p-4">
        <h3 class="text-lg font-bold text-gray-800 mb-1">{{ pose.name }}</h3>
        <p class="text-sm text-gray-500 mb-3">{{ pose.sanskritName }}</p>
        <div class="flex flex-wrap gap-2">
          <span v-for="area in pose.targetAreas.slice(0, 3)" :key="area" class="px-2 py-1 bg-purple-100 text-yoga-purple text-xs rounded-full">
            {{ area }}
          </span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { YogaPose } from '~/types'
import { difficultyLabels } from '~/data/poses'

const props = defineProps<{
  pose: YogaPose
}>()

const difficultyLabel = computed(() => difficultyLabels[props.pose.difficulty])

const difficultyClass = computed(() => {
  switch (props.pose.difficulty) {
    case 'beginner':
      return 'bg-yoga-sage'
    case 'intermediate':
      return 'bg-yoga-purple'
    case 'advanced':
      return 'bg-yoga-pink'
    default:
      return 'bg-gray-500'
  }
})
</script>

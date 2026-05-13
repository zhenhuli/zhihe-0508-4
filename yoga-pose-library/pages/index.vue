<template>
  <div>
    <div class="text-center mb-10">
      <h1 class="text-4xl font-bold text-gray-800 mb-4">瑜伽体式库</h1>
      <p class="text-gray-600 text-lg">探索经典瑜伽体式，按难度和部位分类</p>
    </div>

    <div class="bg-white rounded-xl shadow-md p-6 mb-8 space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">按难度筛选</label>
        <div class="flex flex-wrap gap-2">
          <button @click="selectedDifficulty = null" :class="['px-4 py-2 rounded-lg text-sm font-medium transition-colors', selectedDifficulty === null ? 'bg-yoga-purple text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']">
            全部
          </button>
          <button v-for="(label, key) in difficultyLabels" :key="key" @click="selectedDifficulty = key as any" :class="['px-4 py-2 rounded-lg text-sm font-medium transition-colors', selectedDifficulty === key ? 'bg-yoga-purple text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']">
            {{ label }}
          </button>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">按部位筛选</label>
        <div class="flex flex-wrap gap-2">
          <button @click="selectedArea = null" :class="['px-4 py-2 rounded-lg text-sm font-medium transition-colors', selectedArea === null ? 'bg-yoga-purple text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']">
            全部
          </button>
          <button v-for="area in allTargetAreas" :key="area" @click="selectedArea = area" :class="['px-4 py-2 rounded-lg text-sm font-medium transition-colors', selectedArea === area ? 'bg-yoga-purple text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']">
            {{ area }}
          </button>
        </div>
      </div>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <YogaPoseCard v-for="pose in filteredPoses" :key="pose.id" :pose="pose" />
    </div>

    <div v-if="filteredPoses.length === 0" class="text-center py-12">
      <p class="text-gray-500 text-lg">没有找到符合条件的体式</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { yogaPoses, difficultyLabels, allTargetAreas } from '~/data/poses'

const selectedDifficulty = ref<string | null>(null)
const selectedArea = ref<string | null>(null)

const filteredPoses = computed(() => {
  return yogaPoses.filter(pose => {
    if (selectedDifficulty.value && pose.difficulty !== selectedDifficulty.value) {
      return false
    }
    if (selectedArea.value && !pose.targetAreas.includes(selectedArea.value)) {
      return false
    }
    return true
  })
})
</script>

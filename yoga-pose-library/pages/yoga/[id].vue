<template>
  <div v-if="pose">
    <NuxtLink to="/" class="inline-flex items-center text-yoga-purple hover:text-yoga-light mb-6 font-medium">
      <span class="mr-2">←</span> 返回体式列表
    </NuxtLink>

    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="md:flex">
        <div class="md:w-1/2">
          <img :src="pose.image" :alt="pose.name" class="w-full h-80 md:h-full object-cover">
        </div>
        <div class="md:w-1/2 p-8">
          <div class="flex items-center gap-3 mb-4">
            <span :class="difficultyClass" class="px-3 py-1 rounded-full text-white text-sm font-medium">
              {{ difficultyLabel }}
            </span>
          </div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ pose.name }}</h1>
          <p class="text-gray-500 text-lg mb-4">{{ pose.sanskritName }}</p>
          <p class="text-gray-600 mb-6">{{ pose.description }}</p>
          
          <div class="flex flex-wrap gap-2 mb-6">
            <span v-for="area in pose.targetAreas" :key="area" class="px-3 py-1 bg-purple-100 text-yoga-purple text-sm rounded-full">
              {{ area }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-8">
            <div class="bg-purple-50 rounded-lg p-4 text-center">
              <p class="text-gray-500 text-sm">推荐保持时长</p>
              <p class="text-xl font-bold text-yoga-purple">{{ pose.duration }}</p>
            </div>
            <div class="bg-purple-50 rounded-lg p-4 text-center">
              <p class="text-gray-500 text-sm">练习次数</p>
              <p class="text-xl font-bold text-yoga-purple">{{ poseRecords.length }} 次</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-md p-6 mt-8">
      <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <span class="mr-2">✨</span> 动作要点
      </h2>
      <div class="grid md:grid-cols-2 gap-6">
        <div v-for="(point, index) in pose.keyPoints" :key="index" class="flex flex-col items-center text-center bg-purple-50 rounded-lg p-4 hover:bg-purple-100 transition-colors">
          <span class="flex-shrink-0 w-10 h-10 bg-yoga-purple text-white rounded-full flex items-center justify-center text-lg font-bold mb-3">{{ index + 1 }}</span>
          <img :src="point.image" :alt="point.text" class="w-32 h-32 object-cover rounded-lg shadow-md mb-3">
          <span class="text-gray-700 font-medium">{{ point.text }}</span>
        </div>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-6 mt-8">
      <div class="bg-white rounded-xl shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span class="mr-2">🌬️</span> 呼吸方式
        </h2>
        <p class="text-gray-600 leading-relaxed">{{ pose.breathing }}</p>
      </div>

      <div class="bg-white rounded-xl shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span class="mr-2">⏱️</span> 记录训练
        </h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">练习时长（秒）</label>
            <input v-model.number="newDuration" type="number" min="1" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yoga-purple focus:border-transparent">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">备注（可选）</label>
            <textarea v-model="newNotes" rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yoga-purple focus:border-transparent"></textarea>
          </div>
          <button @click="saveRecord" class="w-full bg-yoga-purple text-white py-2 rounded-lg hover:bg-yoga-light transition-colors font-medium">
            保存记录
          </button>
        </div>
      </div>
    </div>

    <div v-if="poseRecords.length > 0" class="bg-white rounded-xl shadow-md p-6 mt-8">
      <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span class="mr-2">📝</span> 历史记录
      </h2>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b">
              <th class="text-left py-3 px-4 text-gray-600 font-medium">日期</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">时长</th>
              <th class="text-left py-3 px-4 text-gray-600 font-medium">备注</th>
              <th class="text-right py-3 px-4 text-gray-600 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in poseRecords" :key="record.id" class="border-b hover:bg-gray-50">
              <td class="py-3 px-4 text-gray-800">{{ record.date }}</td>
              <td class="py-3 px-4 text-gray-800">{{ record.duration }} 秒</td>
              <td class="py-3 px-4 text-gray-600">{{ record.notes || '-' }}</td>
              <td class="py-3 px-4 text-right">
                <button @click="deleteRecord(record.id)" class="text-red-500 hover:text-red-700 font-medium">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-20">
    <p class="text-gray-500 text-lg">体式不存在</p>
  </div>
</template>

<script setup lang="ts">
import { yogaPoses, difficultyLabels } from '~/data/poses'
import type { YogaPose } from '~/types'

const route = useRoute()
const { records, addRecord, deleteRecord: deleteTrainingRecord, getRecordsByPose } = useTrainingRecords()

const newDuration = ref(30)
const newNotes = ref('')

const pose = computed<YogaPose | undefined>(() => {
  return yogaPoses.find(p => p.id === route.params.id)
})

const poseRecords = computed(() => {
  return pose.value ? getRecordsByPose(pose.value.id) : []
})

const difficultyLabel = computed(() => {
  return pose.value ? difficultyLabels[pose.value.difficulty] : ''
})

const difficultyClass = computed(() => {
  if (!pose.value) return ''
  switch (pose.value.difficulty) {
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

const saveRecord = () => {
  if (pose.value && newDuration.value > 0) {
    addRecord(pose.value.id, pose.value.name, newDuration.value, newNotes.value)
    newDuration.value = 30
    newNotes.value = ''
  }
}

const deleteRecord = (id: string) => {
  deleteTrainingRecord(id)
}
</script>

<template>
  <div>
    <div class="text-center mb-10">
      <h1 class="text-4xl font-bold text-gray-800 mb-4">训练记录</h1>
      <p class="text-gray-600 text-lg">追踪你的瑜伽练习进度</p>
    </div>

    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-md p-6 text-center">
        <p class="text-4xl font-bold text-yoga-purple mb-2">{{ records.length }}</p>
        <p class="text-gray-600">总练习次数</p>
      </div>
      <div class="bg-white rounded-xl shadow-md p-6 text-center">
        <p class="text-4xl font-bold text-yoga-sage mb-2">{{ formatTotalDuration }}</p>
        <p class="text-gray-600">总练习时长</p>
      </div>
      <div class="bg-white rounded-xl shadow-md p-6 text-center">
        <p class="text-4xl font-bold text-yoga-pink mb-2">{{ uniquePosesCount }}</p>
        <p class="text-gray-600">练习过的体式</p>
      </div>
    </div>

    <div v-if="records.length > 0" class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="text-left py-4 px-6 text-gray-700 font-medium">日期</th>
              <th class="text-left py-4 px-6 text-gray-700 font-medium">体式名称</th>
              <th class="text-left py-4 px-6 text-gray-700 font-medium">时长</th>
              <th class="text-left py-4 px-6 text-gray-700 font-medium">备注</th>
              <th class="text-right py-4 px-6 text-gray-700 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in records" :key="record.id" class="border-t hover:bg-gray-50 transition-colors">
              <td class="py-4 px-6 text-gray-800">{{ record.date }}</td>
              <td class="py-4 px-6">
                <NuxtLink :to="`/yoga/${record.poseId}`" class="text-yoga-purple hover:text-yoga-light font-medium">
                  {{ record.poseName }}
                </NuxtLink>
              </td>
              <td class="py-4 px-6 text-gray-800">{{ record.duration }} 秒</td>
              <td class="py-4 px-6 text-gray-600">{{ record.notes || '-' }}</td>
              <td class="py-4 px-6 text-right">
                <button @click="deleteRecord(record.id)" class="text-red-500 hover:text-red-700 font-medium transition-colors">
                  删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="text-center py-16 bg-white rounded-xl shadow-md">
      <p class="text-6xl mb-4">🧘</p>
      <p class="text-gray-500 text-lg mb-4">还没有训练记录</p>
      <NuxtLink to="/" class="inline-block bg-yoga-purple text-white px-6 py-2 rounded-lg hover:bg-yoga-light transition-colors font-medium">
        开始练习
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const { records, deleteRecord, getTotalDuration } = useTrainingRecords()

const formatTotalDuration = computed(() => {
  const total = getTotalDuration()
  if (total < 60) {
    return `${total} 秒`
  }
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  if (seconds === 0) {
    return `${minutes} 分钟`
  }
  return `${minutes} 分 ${seconds} 秒`
})

const uniquePosesCount = computed(() => {
  const poseIds = new Set(records.value.map(r => r.poseId))
  return poseIds.size
})
</script>

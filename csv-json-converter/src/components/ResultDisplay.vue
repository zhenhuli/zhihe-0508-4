<template>
  <div class="result-display">
    <h2>转换结果</h2>
    
    <div v-if="!result" class="empty-state">
      <p>请上传文件或粘贴文本进行转换</p>
    </div>
    
    <div v-else class="result-content">
      <div class="result-header">
        <span class="result-type">{{ resultType }}</span>
        <div class="result-actions">
          <button @click="beautify" class="beautify-btn">
            {{ isBeautified ? '压缩' : '美化' }}
          </button>
          <button @click="copyResult" class="copy-btn">复制</button>
          <button @click="downloadFile" class="download-btn">下载</button>
        </div>
      </div>
      
      <div class="result-textarea-container">
        <textarea
          v-model="displayResult"
          readonly
          rows="15"
          class="result-textarea"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  result: String,
  convertDirection: String
})

const emit = defineEmits(['beautify'])

const isBeautified = ref(true)
const displayResult = ref('')

const resultType = computed(() => {
  if (props.convertDirection === 'csv-to-json' || props.convertDirection === 'json-to-json') {
    return 'JSON'
  }
  return 'CSV'
})

watch(() => props.result, (newVal) => {
  if (newVal) {
    displayResult.value = newVal
    isBeautified.value = true
  }
}, { immediate: true })

const beautify = () => {
  isBeautified.value = !isBeautified.value
  emit('beautify', isBeautified.value)
}

const copyResult = async () => {
  try {
    await navigator.clipboard.writeText(displayResult.value)
    alert('已复制到剪贴板')
  } catch (err) {
    console.error('复制失败:', err)
  }
}

const downloadFile = () => {
  if (!displayResult.value) return
  
  const mimeType = resultType.value === 'JSON' ? 'application/json' : 'text/csv'
  const extension = resultType.value === 'JSON' ? 'json' : 'csv'
  const blob = new Blob([displayResult.value], { type: mimeType })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `converted.${extension}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.result-display {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #333;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  background: #f9fafb;
  border-radius: 8px;
}

.result-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.result-type {
  padding: 6px 12px;
  background: #dbeafe;
  color: #1d4ed8;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
}

.result-actions {
  display: flex;
  gap: 8px;
}

.beautify-btn,
.copy-btn,
.download-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: #f5f5f5;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.beautify-btn:hover,
.copy-btn:hover,
.download-btn:hover {
  background: #e5e5e5;
}

.download-btn {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.download-btn:hover {
  background: #059669;
}

.result-textarea-container {
  width: 100%;
}

.result-textarea {
  width: 100%;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.6;
  resize: vertical;
  box-sizing: border-box;
  background: #f9fafb;
  color: #333;
}

.result-textarea:focus {
  outline: none;
  border-color: #4f46e5;
}
</style>

<template>
  <div class="file-processor">
    <h2>数据输入</h2>
    
    <div class="input-section">
      <div class="input-tabs">
        <button 
          :class="{ active: inputMode === 'upload' }" 
          @click="inputMode = 'upload'"
        >
          上传文件
        </button>
        <button 
          :class="{ active: inputMode === 'paste' }" 
          @click="inputMode = 'paste'"
        >
          粘贴文本
        </button>
      </div>

      <div v-if="inputMode === 'upload'" class="upload-area">
        <div 
          class="drop-zone" 
          @dragover.prevent="handleDragOver"
          @dragleave="handleDragLeave"
          @drop.prevent="handleDrop"
          @click="triggerFileInput"
        >
          <div class="drop-icon">📁</div>
          <p>拖拽文件到此处或点击上传</p>
          <p class="hint">支持 .csv 和 .json 文件</p>
          <input 
            ref="fileInput" 
            type="file" 
            accept=".csv,.json" 
            @change="handleFileChange"
            style="display: none"
          />
        </div>
        <div v-if="fileName" class="file-info">
          <span>已选择: {{ fileName }}</span>
          <button @click="clearFile" class="clear-btn">清除</button>
        </div>
      </div>

      <div v-else class="paste-area">
        <textarea
          v-model="inputText"
          placeholder="在此粘贴 CSV 或 JSON 文本..."
          rows="10"
        ></textarea>
      </div>
    </div>

    <div class="action-buttons">
      <button @click="beautify" class="beautify-btn">美化</button>
      <button @click="convert" class="convert-btn">转换</button>
      <button @click="clearAll" class="clear-btn">清空</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['convert', 'beautify', 'clear'])

const inputMode = ref('upload')
const fileName = ref('')
const inputText = ref('')
const fileInput = ref(null)

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    processFile(file)
  }
}

const handleDragOver = (e) => {
  e.currentTarget.classList.add('dragover')
}

const handleDragLeave = (e) => {
  e.currentTarget.classList.remove('dragover')
}

const handleDrop = (e) => {
  e.currentTarget.classList.remove('dragover')
  const file = e.dataTransfer.files[0]
  if (file) {
    processFile(file)
  }
}

const processFile = (file) => {
  fileName.value = file.name

  const reader = new FileReader()
  reader.onload = (e) => {
    inputText.value = e.target.result
  }
  reader.readAsText(file)
}

const clearFile = () => {
  fileName.value = ''
  inputText.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const clearAll = () => {
  clearFile()
  emit('clear')
}

const beautify = () => {
  emit('beautify', {
    text: inputText.value
  })
}

const convert = () => {
  emit('convert', {
    text: inputText.value
  })
}
</script>

<style scoped>
.file-processor {
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

.input-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.input-tabs button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: #f5f5f5;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.input-tabs button.active {
  background: #4f46e5;
  color: white;
  border-color: #4f46e5;
}

.upload-area,
.paste-area {
  margin-bottom: 20px;
}

.drop-zone {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.drop-zone:hover,
.drop-zone.dragover {
  border-color: #4f46e5;
  background: #f5f3ff;
}

.drop-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.drop-zone p {
  margin: 8px 0;
  color: #666;
}

.hint {
  font-size: 14px;
  color: #999 !important;
}

.file-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f0f9ff;
  border-radius: 6px;
  margin-top: 12px;
}

.paste-area textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: monospace;
  font-size: 14px;
  resize: vertical;
  box-sizing: border-box;
}

.paste-area textarea:focus {
  outline: none;
  border-color: #4f46e5;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.beautify-btn {
  padding: 10px 24px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.beautify-btn:hover {
  background: #059669;
}

.convert-btn {
  padding: 10px 24px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.convert-btn:hover {
  background: #4338ca;
}

.clear-btn {
  padding: 10px 24px;
  background: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: #e5e5e5;
}
</style>

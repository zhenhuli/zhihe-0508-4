<template>
  <div class="app">
    <Header :theme="theme" @toggle-theme="toggleTheme" />
    
    <main class="main-content">
      <div class="container">
        <div class="input-section">
          <div class="section-header">
            <div class="header-left">
              <h2>输入</h2>
              <div class="mode-tabs">
                <button
                  :class="['tab-btn', inputMode === 'single' ? 'active' : '']"
                  @click="switchMode('single')"
                >
                  单条
                </button>
                <button
                  :class="['tab-btn', inputMode === 'batch' ? 'active' : '']"
                  @click="switchMode('batch')"
                >
                  批量
                </button>
              </div>
            </div>
            <div class="action-buttons">
              <button class="secondary" @click="loadFromHistory">📜 历史</button>
              <button class="secondary" @click="clearInput">🗑️ 清空</button>
            </div>
          </div>
          
          <textarea
            v-model="inputText"
            :placeholder="inputMode === 'single' ? '在这里粘贴或输入 JSON 数据...' : '在这里粘贴多个 JSON 对象或数组，每个单独一行或以空行分隔...'"
            @input="onInputChange"
            @paste="onPaste"
          ></textarea>
          
          <div class="input-info">
            <template v-if="inputMode === 'single'">
              <span v-if="validation.valid" class="valid">✓ 有效的 JSON</span>
              <span v-else-if="inputText" class="error">✗ {{ validation.error }}</span>
            </template>
            <template v-else>
              <span v-if="batchCount > 0" class="valid">✓ 已识别 {{ batchCount }} 个 JSON</span>
              <span v-else-if="inputText" class="warning">⚠ 未识别到有效的 JSON</span>
            </template>
            <span class="info-text">
              行数: {{ sizeInfo.lines }} | 字符: {{ sizeInfo.chars }} | 字节: {{ formatBytes(sizeInfo.bytes) }}
            </span>
          </div>
        </div>
        
        <div class="action-bar">
          <button class="primary" @click="formatJson" :disabled="inputMode === 'single' ? !validation.valid : batchCount === 0">
            🎨 格式化
          </button>
          <button class="primary" @click="minifyJson" :disabled="inputMode === 'single' ? !validation.valid : batchCount === 0">
            📦 压缩
          </button>
          <button class="secondary" @click="validateJson">
            🔍 校验
          </button>
          <button class="secondary" @click="escapeText">
            🔒 转义
          </button>
          <button class="secondary" @click="unescapeText">
            🔓 反转义
          </button>
          <button class="secondary" @click="showTreeView" :disabled="inputMode === 'single' ? !validation.valid : batchCount === 0">
            🌳 树视图
          </button>
        </div>
        
        <div class="output-section">
          <div class="section-header">
            <h2>输出</h2>
            <div class="action-buttons">
              <template v-if="inputMode === 'single'">
                <button class="success" @click="copyOutput" :disabled="!outputText">
                  📋 复制全部
                </button>
                <button class="secondary" @click="useOutputAsInput" :disabled="!outputText">
                  ↩️ 设为输入
                </button>
              </template>
              <template v-else>
                <button class="success" @click="copyAllBatchOutput" :disabled="batchResults.length === 0">
                  📋 复制全部
                </button>
              </template>
            </div>
          </div>
          
          <div class="output-container">
            <template v-if="inputMode === 'single'">
              <pre v-if="outputText"><code>{{ highlightedOutput }}</code></pre>
              <div v-else class="empty-placeholder">
                <span>格式化结果将显示在这里</span>
              </div>
            </template>
            <template v-else>
              <div v-if="batchResults.length > 0" class="batch-output">
                <div
                  v-for="(item, index) in batchResults"
                  :key="index"
                  class="batch-item"
                >
                  <div class="batch-item-header">
                    <span class="batch-item-index">第 {{ index + 1 }} 条</span>
                    <span v-if="item.success" class="batch-item-success">✓ 成功</span>
                    <span v-else class="batch-item-error">✗ 失败</span>
                    <div class="batch-item-actions">
                      <button
                        v-if="item.success"
                        class="success small"
                        @click="copyBatchItem(item.output)"
                      >
                        📋 复制
                      </button>
                      <button
                        v-if="item.success"
                        class="secondary small"
                        @click="useBatchItemAsInput(item.output)"
                      >
                        ↩️ 设为输入
                      </button>
                    </div>
                  </div>
                  <div class="batch-item-content">
                    <pre v-if="item.success"><code>{{ item.output }}</code></pre>
                    <div v-else class="batch-item-error-msg">
                      {{ item.error }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="empty-placeholder">
                <span>批量处理结果将显示在这里</span>
              </div>
            </template>
          </div>
        </div>
        
        <ErrorPanel
          v-if="showError && validation.errorLine"
          :error-info="validation.errorLine"
          :error-message="validation.error"
          @close="showError = false"
        />
        
        <TreeView
          v-if="showTree"
          :data="parsedData"
          @close="showTree = false"
          @copy="copyNodeValue"
        />
        
        <HistoryPanel
          v-if="showHistory"
          :history="history"
          @select="loadHistoryItem"
          @delete="deleteHistoryItem"
          @clear="clearAllHistory"
          @close="showHistory = false"
        />
      </div>
    </main>
    
    <Toast
      v-if="toast.show"
      :message="toast.message"
      :type="toast.type"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

import Header from './components/Header.vue'
import ErrorPanel from './components/ErrorPanel.vue'
import TreeView from './components/TreeView.vue'
import HistoryPanel from './components/HistoryPanel.vue'
import Toast from './components/Toast.vue'

import {
  parseJSON,
  formatJSON,
  minifyJSON,
  escapeJSON,
  unescapeJSON,
  validateJSON,
  getSizeInfo,
  copyToClipboard,
  generateId
} from './utils/jsonUtils'

import {
  getTheme,
  saveTheme,
  applyTheme,
  getHistory,
  saveHistory,
  clearHistory,
  deleteHistoryItem as deleteHistoryFromStorage
} from './utils/storage'

const theme = ref('light')
const inputMode = ref('single')
const inputText = ref('')
const outputText = ref('')
const parsedData = ref(null)
const validation = ref({ valid: false, error: null, errorLine: null, warning: null })
const sizeInfo = ref({ lines: 0, chars: 0, bytes: 0 })
const outputType = ref('json')
const batchResults = ref([])

const showError = ref(false)
const showTree = ref(false)
const showHistory = ref(false)
const history = ref([])

const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

const highlightedOutput = computed(() => {
  if (!outputText.value) return ''
  return outputText.value
})

const batchCount = computed(() => {
  return parseMultipleJSON(inputText.value).length
})

function parseMultipleJSON(text) {
  if (!text.trim()) return []
  
  const items = []
  let currentItem = ''
  let depth = 0
  let inString = false
  let escapeNext = false
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    
    if (escapeNext) {
      escapeNext = false
      if (depth > 0) currentItem += char
      continue
    }
    
    if (char === '\\' && inString) {
      escapeNext = true
      if (depth > 0) currentItem += char
      continue
    }
    
    if (char === '"') {
      inString = !inString
      if (depth > 0) currentItem += char
      continue
    }
    
    if (inString) {
      if (depth > 0) currentItem += char
      continue
    }
    
    if (char === '{' || char === '[') {
      if (depth === 0) {
        currentItem = char
      } else {
        currentItem += char
      }
      depth++
    } else if (char === '}' || char === ']') {
      if (depth > 0) {
        currentItem += char
        depth--
        
        if (depth === 0) {
          const trimmed = currentItem.trim()
          try {
            JSON.parse(trimmed)
            items.push(trimmed)
          } catch (e) {
          }
          currentItem = ''
          inString = false
          escapeNext = false
        }
      }
    } else if (depth > 0) {
      currentItem += char
    }
  }
  
  return items
}

onMounted(() => {
  theme.value = getTheme()
  applyTheme(theme.value)
  history.value = getHistory()
})

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  saveTheme(theme.value)
  applyTheme(theme.value)
}

function switchMode(mode) {
  inputMode.value = mode
  outputText.value = ''
  batchResults.value = []
  showError.value = false
}

function onInputChange() {
  sizeInfo.value = getSizeInfo(inputText.value)
  
  if (inputMode.value === 'single') {
    if (inputText.value) {
      validation.value = validateJSON(inputText.value)
      if (validation.value.valid) {
        const result = parseJSON(inputText.value)
        parsedData.value = result.data
      }
    } else {
      validation.value = { valid: false, error: null, errorLine: null, warning: null }
      parsedData.value = null
    }
  }
  showError.value = false
}

function onPaste(e) {
  const pastedText = e.clipboardData?.getData('text') || ''
  if (pastedText) {
    setTimeout(() => onInputChange(), 0)
  }
}

function formatJson() {
  if (inputMode.value === 'single') {
    if (!validation.value.valid) {
      showError.value = true
      showToast('JSON 格式错误，请检查后重试', 'error')
      return
    }
    
    outputType.value = 'json'
    outputText.value = formatJSON(parsedData.value, 2)
    batchResults.value = []
    saveToHistory('格式化', inputText.value, outputText.value)
    showToast('格式化成功', 'success')
  } else {
    const items = parseMultipleJSON(inputText.value)
    if (items.length === 0) {
      showToast('未识别到有效的 JSON', 'warning')
      return
    }
    
    batchResults.value = items.map(item => {
      const result = parseJSON(item)
      if (result.success) {
        return {
          success: true,
          input: item,
          output: formatJSON(result.data, 2)
        }
      } else {
        return {
          success: false,
          input: item,
          error: result.error
        }
      }
    })
    
    const successCount = batchResults.value.filter(r => r.success).length
    outputText.value = ''
    showToast(`批量格式化完成: ${successCount}/${items.length} 成功`, successCount > 0 ? 'success' : 'error')
  }
}

function minifyJson() {
  if (inputMode.value === 'single') {
    if (!validation.value.valid) {
      showError.value = true
      showToast('JSON 格式错误，请检查后重试', 'error')
      return
    }
    
    outputType.value = 'json'
    outputText.value = minifyJSON(parsedData.value)
    batchResults.value = []
    saveToHistory('压缩', inputText.value, outputText.value)
    showToast('压缩成功', 'success')
  } else {
    const items = parseMultipleJSON(inputText.value)
    if (items.length === 0) {
      showToast('未识别到有效的 JSON', 'warning')
      return
    }
    
    batchResults.value = items.map(item => {
      const result = parseJSON(item)
      if (result.success) {
        return {
          success: true,
          input: item,
          output: minifyJSON(result.data)
        }
      } else {
        return {
          success: false,
          input: item,
          error: result.error
        }
      }
    })
    
    const successCount = batchResults.value.filter(r => r.success).length
    outputText.value = ''
    showToast(`批量压缩完成: ${successCount}/${items.length} 成功`, successCount > 0 ? 'success' : 'error')
  }
}

function validateJson() {
  if (!inputText.value) {
    showToast('请输入 JSON 数据', 'warning')
    return
  }
  
  if (inputMode.value === 'single') {
    validation.value = validateJSON(inputText.value)
    
    if (validation.value.valid) {
      if (validation.value.warning) {
        showToast(validation.value.warning, 'warning')
      } else {
        showToast('✓ 有效的 JSON', 'success')
      }
      const result = parseJSON(inputText.value)
      parsedData.value = result.data
    } else {
      showError.value = true
      showToast('✗ ' + validation.value.error, 'error')
    }
  } else {
    const items = parseMultipleJSON(inputText.value)
    if (items.length === 0) {
      showToast('未识别到有效的 JSON', 'warning')
    } else {
      showToast(`✓ 已识别 ${items.length} 个有效的 JSON`, 'success')
    }
  }
}

function escapeText() {
  if (!inputText.value) {
    showToast('请输入要转义的文本', 'warning')
    return
  }
  
  outputType.value = 'text'
  outputText.value = escapeJSON(inputText.value)
  batchResults.value = []
  saveToHistory('转义', inputText.value, outputText.value)
  showToast('转义成功', 'success')
}

function unescapeText() {
  if (!inputText.value) {
    showToast('请输入要反转义的文本', 'warning')
    return
  }
  
  outputType.value = 'text'
  outputText.value = unescapeJSON(inputText.value)
  batchResults.value = []
  saveToHistory('反转义', inputText.value, outputText.value)
  showToast('反转义成功', 'success')
}

function showTreeView() {
  if (inputMode.value === 'single') {
    if (!validation.value.valid) {
      showError.value = true
      showToast('JSON 格式错误，无法显示树视图', 'error')
      return
    }
    showTree.value = true
  } else {
    const items = parseMultipleJSON(inputText.value)
    if (items.length === 0) {
      showToast('未识别到有效的 JSON', 'warning')
      return
    }
    if (items.length > 1) {
      showToast('批量模式下请先切换到单条模式查看树视图', 'warning')
      return
    }
    const result = parseJSON(items[0])
    if (result.success) {
      parsedData.value = result.data
      showTree.value = true
    }
  }
}

function clearInput() {
  inputText.value = ''
  outputText.value = ''
  outputType.value = 'json'
  batchResults.value = []
  parsedData.value = null
  validation.value = { valid: false, error: null, errorLine: null, warning: null }
  sizeInfo.value = { lines: 0, chars: 0, bytes: 0 }
  showError.value = false
}

async function copyOutput() {
  if (!outputText.value) return
  
  try {
    await copyToClipboard(outputText.value)
    showToast('已复制到剪贴板', 'success')
  } catch (e) {
    showToast('复制失败', 'error')
  }
}

function useOutputAsInput() {
  if (!outputText.value) return
  
  inputText.value = outputText.value
  onInputChange()
  showToast('已将输出设为输入', 'success')
}

async function copyBatchItem(text) {
  if (!text) return
  
  try {
    await copyToClipboard(text)
    showToast('已复制到剪贴板', 'success')
  } catch (e) {
    showToast('复制失败', 'error')
  }
}

function useBatchItemAsInput(text) {
  if (!text) return
  
  inputMode.value = 'single'
  inputText.value = text
  batchResults.value = []
  outputText.value = ''
  onInputChange()
  showToast('已切换到单条模式并设为输入', 'success')
}

async function copyAllBatchOutput() {
  const successResults = batchResults.value.filter(r => r.success)
  if (successResults.length === 0) return
  
  const allText = successResults.map(r => r.output).join('\n\n---\n\n')
  
  try {
    await copyToClipboard(allText)
    showToast('已复制全部结果到剪贴板', 'success')
  } catch (e) {
    showToast('复制失败', 'error')
  }
}

function loadFromHistory() {
  history.value = getHistory()
  showHistory.value = true
}

function loadHistoryItem(item) {
  inputMode.value = 'single'
  inputText.value = item.input
  outputText.value = item.output
  batchResults.value = []
  
  if (item.action === '转义' || item.action === '反转义') {
    outputType.value = 'text'
  } else {
    outputType.value = 'json'
  }
  
  onInputChange()
  showHistory.value = false
  showToast('已从历史记录加载', 'success')
}

function deleteHistoryItem(id) {
  history.value = deleteHistoryFromStorage(id)
}

function clearAllHistory() {
  history.value = clearHistory()
  showToast('历史记录已清空', 'success')
}

function copyNodeValue(value) {
  copyToClipboard(value)
  showToast('节点值已复制', 'success')
}

function saveToHistory(action, input, output) {
  const item = {
    id: generateId(),
    action,
    input,
    output,
    timestamp: Date.now()
  }
  history.value = saveHistory(item)
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function showToast(message, type = 'success') {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 2000)
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 20px;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-header h2 {
  font-size: 16px;
  color: var(--text-primary);
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.input-section,
.output-section {
  background-color: var(--bg-primary);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: var(--shadow);
}

.output-container {
  min-height: 200px;
}

.empty-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: var(--text-muted);
  border: 2px dashed var(--border-color);
  border-radius: 4px;
  background-color: var(--bg-secondary);
}

.action-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.input-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  font-size: 13px;
}

.valid {
  color: var(--success-color);
}

.error {
  color: var(--error-color);
}

.info-text {
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .main-content {
    padding: 10px;
  }
  
  .action-bar {
    justify-content: center;
  }
  
  .input-info {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
}
</style>

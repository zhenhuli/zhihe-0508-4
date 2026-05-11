<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h3>📦 批量处理</h3>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>
      
      <div class="modal-body">
        <div class="instructions">
          <p>请输入多个 JSON 对象，每个单独一行，或使用空行分隔：</p>
        </div>
        
        <textarea
          v-model="batchInput"
          placeholder="例如：&#10;{&#34;name&#34;: &#34;test1&#34;}&#10;{&#34;name&#34;: &#34;test2&#34;}&#10;&#10;{&#34;name&#34;: &#34;test3&#34;}"
          rows="12"
        ></textarea>
        
        <div class="info">
          <span>已识别 {{ itemCount }} 个 JSON 对象</span>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="secondary" @click="$emit('close')">取消</button>
        <button
          class="primary"
          @click="handleProcess"
          :disabled="itemCount === 0"
        >
          开始处理
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { validateJSON } from '../utils/jsonUtils'

const emit = defineEmits(['close', 'process'])

const batchInput = ref('')

const itemCount = computed(() => {
  return parseItems().length
})

function parseItems() {
  if (!batchInput.value.trim()) return []
  
  const items = []
  const text = batchInput.value
  
  let currentItem = ''
  let depth = 0
  let inString = false
  let escapeNext = false
  let rootChar = null
  
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
        rootChar = char
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
          rootChar = null
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

function handleProcess() {
  const items = parseItems()
  if (items.length === 0) return
  
  emit('process', items)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background-color: var(--bg-primary);
  border-radius: 8px;
  width: 100%;
  max-width: 700px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 20px;
  padding: 4px 8px;
  cursor: pointer;
}

.close-btn:hover {
  color: var(--text-primary);
}

.modal-body {
  flex: 1;
  overflow: auto;
  padding: 16px;
}

.instructions {
  margin-bottom: 12px;
}

.instructions p {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
}

textarea {
  width: 100%;
  min-height: 200px;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.5;
  resize: vertical;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

textarea:focus {
  outline: none;
  border-color: var(--accent-color);
}

.info {
  margin-top: 10px;
  font-size: 13px;
  color: var(--text-muted);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 12px 20px;
  border-top: 1px solid var(--border-color);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

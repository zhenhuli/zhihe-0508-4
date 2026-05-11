<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h3>📜 历史记录</h3>
        <div class="header-actions">
          <button
            v-if="history.length > 0"
            class="danger small"
            @click="handleClear"
          >
            清空
          </button>
          <button class="close-btn" @click="$emit('close')">✕</button>
        </div>
      </div>
      
      <div class="modal-body">
        <div v-if="history.length === 0" class="empty-state">
          <span class="empty-icon">📭</span>
          <span class="empty-text">暂无历史记录</span>
        </div>
        
        <div v-else class="history-list">
          <div
            v-for="item in history"
            :key="item.id"
            class="history-item"
          >
            <div class="item-header">
              <span class="action-badge">{{ item.action }}</span>
              <span class="time">{{ formatTime(item.timestamp) }}</span>
            </div>
            
            <div class="item-preview">
              <div class="preview-label">输入:</div>
              <pre>{{ truncate(item.input, 100) }}</pre>
            </div>
            
            <div class="item-actions">
              <button class="success small" @click="$emit('select', item)">
                加载
              </button>
              <button class="danger small" @click="$emit('delete', item.id)">
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <span class="count">共 {{ history.length }} 条记录</span>
        <button class="secondary" @click="$emit('close')">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  history: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'select', 'delete', 'clear'])

function formatTime(timestamp) {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) {
    return '刚刚'
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)} 分钟前`
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)} 小时前`
  } else {
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

function truncate(text, maxLength) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

function handleClear() {
  if (confirm('确定要清空所有历史记录吗？')) {
    emit('clear')
  }
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
  max-width: 600px;
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
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

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  gap: 12px;
  color: var(--text-muted);
}

.empty-icon {
  font-size: 48px;
}

.empty-text {
  font-size: 14px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  background-color: var(--bg-secondary);
  border-radius: 6px;
  padding: 12px;
  border: 1px solid var(--border-color);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.action-badge {
  background-color: var(--accent-color);
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.time {
  font-size: 12px;
  color: var(--text-muted);
}

.item-preview {
  margin-bottom: 10px;
}

.preview-label {
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.item-preview pre {
  margin: 0;
  padding: 8px;
  background-color: var(--code-bg);
  border-radius: 4px;
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 80px;
  overflow: hidden;
  color: var(--text-secondary);
}

.item-actions {
  display: flex;
  gap: 8px;
}

button.small {
  padding: 6px 12px;
  font-size: 12px;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-top: 1px solid var(--border-color);
}

.count {
  font-size: 13px;
  color: var(--text-muted);
}
</style>

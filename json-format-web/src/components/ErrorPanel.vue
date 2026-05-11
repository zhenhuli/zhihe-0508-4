<template>
  <div class="error-panel">
    <div class="panel-header">
      <h3>❌ JSON 解析错误</h3>
      <button class="close-btn" @click="$emit('close')">✕</button>
    </div>
    
    <div class="error-details">
      <div class="error-message">
        <strong>错误信息：</strong>
        <span>{{ errorMessage }}</span>
      </div>
      
      <div class="error-location">
        <div class="location-item">
          <strong>位置：</strong>
          <span>第 {{ errorInfo.line }} 行，第 {{ errorInfo.column }} 列</span>
        </div>
      </div>
      
      <div class="error-context">
        <strong>上下文：</strong>
        <pre>{{ errorInfo.context }}</pre>
      </div>
      
      <div class="error-suggestions">
        <strong>常见错误原因：</strong>
        <ul>
          <li>缺少逗号或尾随逗号</li>
          <li>字符串使用了单引号（应使用双引号）</li>
          <li>键名未使用双引号包裹</li>
          <li>JSON 中包含注释（标准 JSON 不支持注释）</li>
          <li>转义字符使用不当</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  errorInfo: {
    type: Object,
    required: true
  },
  errorMessage: {
    type: String,
    required: true
  }
})

defineEmits(['close'])
</script>

<style scoped>
.error-panel {
  background-color: var(--bg-primary);
  border: 1px solid var(--error-color);
  border-radius: 8px;
  margin-bottom: 20px;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: rgba(244, 67, 54, 0.1);
  border-bottom: 1px solid var(--error-color);
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  color: var(--error-color);
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 18px;
  padding: 0 8px;
  cursor: pointer;
}

.close-btn:hover {
  color: var(--error-color);
}

.error-details {
  padding: 16px;
}

.error-message {
  margin-bottom: 12px;
  color: var(--text-primary);
  font-size: 14px;
}

.error-message span {
  color: var(--error-color);
  font-family: monospace;
}

.error-location {
  margin-bottom: 12px;
  font-size: 14px;
  color: var(--text-secondary);
}

.location-item {
  margin-bottom: 4px;
}

.error-context {
  margin-bottom: 16px;
}

.error-context strong {
  display: block;
  margin-bottom: 8px;
  color: var(--text-primary);
  font-size: 14px;
}

.error-context pre {
  background-color: var(--code-bg);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 12px;
  font-size: 13px;
  color: var(--error-color);
  white-space: pre-wrap;
  word-break: break-all;
}

.error-suggestions {
  background-color: var(--bg-secondary);
  border-radius: 6px;
  padding: 12px 16px;
}

.error-suggestions strong {
  display: block;
  margin-bottom: 8px;
  color: var(--text-primary);
  font-size: 14px;
}

.error-suggestions ul {
  margin: 0;
  padding-left: 20px;
  font-size: 13px;
  color: var(--text-secondary);
}

.error-suggestions li {
  margin-bottom: 4px;
}
</style>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h3>🌳 JSON 树视图</h3>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>
      
      <div class="modal-body">
        <div class="tree-container">
          <TreeNode :node="data" :is-root="true" @copy="handleCopy" />
        </div>
      </div>
      
      <div class="modal-footer">
        <span class="tip">💡 点击值可以复制</span>
        <button class="secondary" @click="$emit('close')">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import TreeNode from './TreeNode.vue'

defineProps({
  data: {
    type: [Object, Array, String, Number, Boolean, null],
    required: true
  }
})

const emit = defineEmits(['close', 'copy'])

function handleCopy(value) {
  emit('copy', value)
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
  max-width: 800px;
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
  padding: 20px;
}

.tree-container {
  background-color: var(--code-bg);
  border-radius: 4px;
  padding: 16px;
  min-height: 200px;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-top: 1px solid var(--border-color);
}

.tip {
  font-size: 13px;
  color: var(--text-muted);
}
</style>

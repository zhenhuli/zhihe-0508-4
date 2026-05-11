<template>
  <div class="toast" :class="type">
    <span class="icon">{{ getIcon() }}</span>
    <span class="message">{{ message }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'success'
  }
})

function getIcon() {
  switch (props.type) {
    case 'success': return '✓'
    case 'error': return '✗'
    case 'warning': return '⚠'
    default: return 'ℹ'
  }
}
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 2000;
  animation: slideUp 0.3s ease;
}

.toast.success {
  background-color: #4caf50;
  color: white;
}

.toast.error {
  background-color: #f44336;
  color: white;
}

.toast.warning {
  background-color: #ff9800;
  color: white;
}

.icon {
  font-size: 16px;
  font-weight: bold;
}

.message {
  line-height: 1.4;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}
</style>

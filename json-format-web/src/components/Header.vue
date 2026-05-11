<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <div class="logo">
          <span class="icon">🔧</span>
          <h1>JSON 工具箱</h1>
        </div>
        <button class="theme-toggle" @click="$emit('toggle-theme')">
          {{ theme === 'dark' ? '☀️ 浅色' : '🌙 深色' }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  theme: {
    type: String,
    default: 'light'
  }
})

defineEmits(['toggle-theme'])
</script>

<style scoped>
.header {
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon {
  font-size: 28px;
}

h1 {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.theme-toggle {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
}

.theme-toggle:hover {
  background-color: var(--border-color);
}

@media (max-width: 768px) {
  .container {
    padding: 12px 16px;
  }
  
  h1 {
    font-size: 18px;
  }
  
  .icon {
    font-size: 24px;
  }
}
</style>

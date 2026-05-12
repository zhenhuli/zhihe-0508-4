<script setup>
const props = defineProps({
  selectedTemplate: { type: String, required: true }
})

const emit = defineEmits(['selectTemplate'])

const templates = [
  { id: 'grid', name: '栅格系统', icon: '▦', color: '#00d9ff' },
  { id: 'flex', name: 'Flexbox布局', icon: '↔', color: '#ff6b6b' },
  { id: 'dashboard', name: '仪表盘布局', icon: '📊', color: '#4ecdc4' },
  { id: 'blog', name: '博客文章', icon: '📝', color: '#ffe66d' },
  { id: 'ecommerce', name: '电商首页', icon: '🛒', color: '#ff8b94' },
  { id: 'profile', name: '用户中心', icon: '👤', color: '#a8e6cf' }
]
</script>

<template>
  <div class="template-selector">
    <div class="panel-section">
      <h3>📑 布局模板</h3>
      <div class="template-grid">
        <button
          v-for="template in templates"
          :key="template.id"
          :class="['template-card', { active: selectedTemplate === template.id }]"
          :style="{ '--accent-color': template.color }"
          @click="emit('selectTemplate', template.id)"
        >
          <span class="template-icon">{{ template.icon }}</span>
          <span class="template-name">{{ template.name }}</span>
        </button>
      </div>
    </div>

    <div class="panel-section">
      <h3>💡 使用提示</h3>
      <ul class="tips-list">
        <li>切换设备查看不同响应式效果</li>
        <li>点击旋转按钮切换横竖屏</li>
        <li>调整缩放比例适配窗口</li>
        <li>尝试不同布局模板学习设计</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.template-selector {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  overflow-y: auto;
}

.panel-section {
  margin-bottom: 24px;
}

.panel-section:last-child {
  margin-bottom: 0;
}

.panel-section h3 {
  font-size: 16px;
  margin-bottom: 12px;
  color: #00d9ff;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.template-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid transparent;
  border-radius: 12px;
  color: #eee;
  cursor: pointer;
  transition: all 0.3s ease;
}

.template-card:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
}

.template-card.active {
  background: rgba(255, 255, 255, 0.15);
  border-color: var(--accent-color);
}

.template-icon {
  font-size: 28px;
}

.template-name {
  font-size: 13px;
  font-weight: 500;
  text-align: center;
}

.tips-list {
  list-style: none;
  padding: 0;
}

.tips-list li {
  padding: 10px 12px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  font-size: 13px;
  color: #aaa;
  position: relative;
  padding-left: 28px;
}

.tips-list li::before {
  content: '✓';
  position: absolute;
  left: 10px;
  color: #4ecdc4;
  font-weight: bold;
}
</style>

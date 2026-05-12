<script setup>
import { ref, computed } from 'vue'
import DevicePreview from './components/DevicePreview.vue'
import TemplateSelector from './components/TemplateSelector.vue'
import ControlPanel from './components/ControlPanel.vue'

const devices = [
  { id: 'mobile', name: '手机', width: 375, height: 667, icon: '📱' },
  { id: 'tablet', name: '平板', width: 768, height: 1024, icon: '📟' },
  { id: 'laptop', name: '笔记本', width: 1366, height: 768, icon: '💻' },
  { id: 'desktop', name: '桌面', width: 1920, height: 1080, icon: '🖥️' },
  { id: 'custom', name: '自定义', width: 800, height: 600, icon: '✏️' }
]

const selectedDevice = ref(devices[0])
const isRotated = ref(false)
const scale = ref(1)
const selectedTemplate = ref('grid')
const customSize = ref({ width: devices[0].width, height: devices[0].height })

const isCustomDevice = computed(() => selectedDevice.value.id === 'custom')

const currentDimensions = computed(() => {
  if (isRotated.value) {
    return {
      width: customSize.value.height,
      height: customSize.value.width
    }
  }
  return {
    width: customSize.value.width,
    height: customSize.value.height
  }
})

const selectDevice = (device) => {
  selectedDevice.value = device
  customSize.value = { width: device.width, height: device.height }
}

const updateCustomSize = (size) => {
  customSize.value = size
  selectedDevice.value = { ...selectedDevice.value, ...size }
}

const rotateDevice = () => {
  isRotated.value = !isRotated.value
}

const updateScale = (newScale) => {
  scale.value = Math.max(0.25, Math.min(2, newScale))
}

const selectTemplate = (templateId) => {
  selectedTemplate.value = templateId
}
</script>

<template>
  <div class="app-container">
    <header class="header">
      <h1>🎨 响应式布局模拟器</h1>
      <p class="subtitle">实时预览不同设备下的页面效果</p>
    </header>

    <div class="main-content">
      <ControlPanel
        :devices="devices"
        :selected-device="selectedDevice"
        :is-rotated="isRotated"
        :scale="scale"
        :is-custom-device="isCustomDevice"
        @select-device="selectDevice"
        @rotate="rotateDevice"
        @update-scale="updateScale"
        @update-custom-size="updateCustomSize"
      />

      <div class="preview-area">
        <DevicePreview
          :dimensions="currentDimensions"
          :scale="scale"
          :device-name="selectedDevice.name"
          :template="selectedTemplate"
        />
      </div>

      <TemplateSelector
        :selected-template="selectedTemplate"
        @select-template="selectTemplate"
      />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.header {
  text-align: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header h1 {
  font-size: 28px;
  margin-bottom: 8px;
  background: linear-gradient(90deg, #00d9ff, #ff6b6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: #888;
  font-size: 14px;
}

.main-content {
  flex: 1;
  display: grid;
  grid-template-columns: 280px 1fr 280px;
  gap: 20px;
  padding: 20px;
  overflow: hidden;
}

.preview-area {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  overflow: auto;
  padding: 20px;
}

@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
  }
}
</style>

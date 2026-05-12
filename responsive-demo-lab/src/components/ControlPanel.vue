<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  devices: { type: Array, required: true },
  selectedDevice: { type: Object, required: true },
  isRotated: { type: Boolean, required: true },
  scale: { type: Number, required: true },
  isCustomDevice: { type: Boolean, required: true }
})

const emit = defineEmits(['selectDevice', 'rotate', 'updateScale', 'updateCustomSize'])

const customWidth = ref(props.selectedDevice.width)
const customHeight = ref(props.selectedDevice.height)

const effectiveWidth = computed(() => props.isRotated ? customHeight.value : customWidth.value)
const effectiveHeight = computed(() => props.isRotated ? customWidth.value : customHeight.value)

const handleWidthChange = (e) => {
  const value = parseInt(e.target.value) || 100
  const clampedValue = Math.min(Math.max(value, 100), 4096)
  if (props.isRotated) {
    customHeight.value = clampedValue
  } else {
    customWidth.value = clampedValue
  }
  emitSizeUpdate()
}

const handleHeightChange = (e) => {
  const value = parseInt(e.target.value) || 100
  const clampedValue = Math.min(Math.max(value, 100), 4096)
  if (props.isRotated) {
    customWidth.value = clampedValue
  } else {
    customHeight.value = clampedValue
  }
  emitSizeUpdate()
}

const emitSizeUpdate = () => {
  emit('updateCustomSize', {
    width: customWidth.value,
    height: customHeight.value
  })
}

const handleDeviceSelect = (device) => {
  customWidth.value = device.width
  customHeight.value = device.height
  emit('selectDevice', device)
}
</script>

<template>
  <div class="control-panel">
    <div class="panel-section">
      <h3>📐 设备选择</h3>
      <div class="device-buttons">
        <button
          v-for="device in devices"
          :key="device.id"
          :class="['device-btn', { active: selectedDevice.id === device.id }]"
          @click="handleDeviceSelect(device)"
        >
          <span class="device-icon">{{ device.icon }}</span>
          <span class="device-name">{{ device.name }}</span>
          <span class="device-size">{{ device.width }}×{{ device.height }}</span>
        </button>
      </div>
    </div>

    <div class="panel-section">
      <h3>🔄 方向控制</h3>
      <button class="rotate-btn" :class="{ rotated: isRotated }" @click="emit('rotate')">
        <span class="rotate-icon">{{ isRotated ? '↔️' : '↕️' }}</span>
        {{ isRotated ? '横屏' : '竖屏' }}
      </button>
    </div>

    <div class="panel-section">
      <h3>🔍 缩放控制</h3>
      <div class="scale-control">
        <button class="scale-btn" @click="emit('updateScale', scale - 0.25)">-</button>
        <span class="scale-value">{{ Math.round(scale * 100) }}%</span>
        <button class="scale-btn" @click="emit('updateScale', scale + 0.25)">+</button>
      </div>
      <input
        type="range"
        class="scale-slider"
        min="0.25"
        max="2"
        step="0.05"
        :value="scale"
        @input="emit('updateScale', parseFloat($event.target.value))"
      />
    </div>

    <div class="panel-section">
      <h3>📊 自定义尺寸</h3>
      <div class="dimensions-display">
        <div class="dim-item">
          <span class="dim-label">宽度</span>
          <input
            type="number"
            class="dim-input"
            :class="{ disabled: !isCustomDevice }"
            :value="effectiveWidth"
            :disabled="!isCustomDevice"
            min="100"
            max="4096"
            @input="handleWidthChange"
          />
          <span class="dim-unit">px</span>
        </div>
        <div class="dim-item">
          <span class="dim-label">高度</span>
          <input
            type="number"
            class="dim-input"
            :class="{ disabled: !isCustomDevice }"
            :value="effectiveHeight"
            :disabled="!isCustomDevice"
            min="100"
            max="4096"
            @input="handleHeightChange"
          />
          <span class="dim-unit">px</span>
        </div>
      </div>
      <p class="custom-hint" v-if="isCustomDevice">💡 输入100-4096之间的数值</p>
      <p class="custom-hint" v-else>💡 选择"自定义"设备以编辑尺寸</p>
    </div>
  </div>
</template>

<style scoped>
.control-panel {
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

.device-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.device-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid transparent;
  border-radius: 10px;
  color: #eee;
  cursor: pointer;
  transition: all 0.3s ease;
}

.device-btn:hover {
  background: rgba(255, 255, 255, 0.12);
}

.device-btn.active {
  background: rgba(0, 217, 255, 0.15);
  border-color: #00d9ff;
}

.device-icon {
  font-size: 20px;
}

.device-name {
  flex: 1;
  text-align: left;
  font-weight: 500;
}

.device-size {
  font-size: 12px;
  color: #888;
  font-family: monospace;
}

.rotate-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(255, 107, 107, 0.1));
  border: 2px solid rgba(255, 107, 107, 0.5);
  border-radius: 10px;
  color: #ff6b6b;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.rotate-btn:hover {
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.3), rgba(255, 107, 107, 0.2));
}

.rotate-icon {
  font-size: 18px;
}

.scale-control {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.scale-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.scale-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.scale-value {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: #00d9ff;
}

.scale-slider {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  cursor: pointer;
}

.scale-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #00d9ff;
  cursor: pointer;
}

.dimensions-display {
  display: flex;
  gap: 12px;
}

.dim-item {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  padding: 12px;
  border-radius: 8px;
  text-align: center;
}

.dim-label {
  display: block;
  font-size: 12px;
  color: #888;
  margin-bottom: 4px;
}

.dim-value {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #00d9ff;
  font-family: monospace;
}

.dim-input {
  width: 100%;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(0, 217, 255, 0.3);
  border-radius: 6px;
  color: #00d9ff;
  font-size: 14px;
  font-weight: 600;
  font-family: monospace;
  text-align: center;
  outline: none;
  transition: all 0.2s ease;
}

.dim-input:focus {
  border-color: #00d9ff;
  background: rgba(0, 217, 255, 0.15);
  box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1);
}

.dim-input.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: rgba(255, 255, 255, 0.1);
}

.dim-input::-webkit-outer-spin-button,
.dim-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.dim-input[type=number] {
  -moz-appearance: textfield;
}

.dim-unit {
  display: block;
  font-size: 11px;
  color: #666;
  margin-top: 4px;
}

.custom-hint {
  font-size: 11px;
  color: #666;
  text-align: center;
  margin-top: 12px;
}
</style>

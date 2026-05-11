<template>
  <div class="tree-node">
    <template v-if="isObject(node)">
      <div class="node-header" @click="toggleExpand">
        <span class="expand-icon">{{ expanded ? '▼' : '▶' }}</span>
        <span class="node-label" v-if="key !== undefined">"{{ key }}"</span>
        <span class="node-type">Object ({{ Object.keys(node).length }} 个属性)</span>
      </div>
      
      <div v-if="expanded" class="node-children">
        <TreeNode
          v-for="(value, k) in node"
          :key="k"
          :node="value"
          :key-prop="k"
          @copy="handleCopy"
        />
      </div>
    </template>
    
    <template v-else-if="isArray(node)">
      <div class="node-header" @click="toggleExpand">
        <span class="expand-icon">{{ expanded ? '▼' : '▶' }}</span>
        <span class="node-label" v-if="key !== undefined">"{{ key }}"</span>
        <span class="node-type">Array ({{ node.length }} 个元素)</span>
      </div>
      
      <div v-if="expanded" class="node-children">
        <TreeNode
          v-for="(value, index) in node"
          :key="index"
          :node="value"
          :key-prop="index"
          @copy="handleCopy"
        />
      </div>
    </template>
    
    <template v-else>
      <div class="node-value" @click="copyValue">
        <span class="node-label" v-if="key !== undefined">"{{ key }}":</span>
        <span class="value" :class="getTypeClass(node)">
          {{ formatValue(node) }}
        </span>
        <span class="copy-hint">(点击复制)</span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatJSON } from '../utils/jsonUtils'

const props = defineProps({
  node: {
    type: [Object, Array, String, Number, Boolean, null],
    required: true
  },
  keyProp: {
    type: [String, Number],
    default: undefined
  },
  isRoot: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['copy'])

const key = computed(() => props.keyProp)
const expanded = ref(!props.isRoot ? true : true)

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function isArray(value) {
  return Array.isArray(value)
}

function toggleExpand() {
  expanded.value = !expanded.value
}

function getTypeClass(value) {
  if (value === null) return 'value-null'
  const type = typeof value
  switch (type) {
    case 'string': return 'value-string'
    case 'number': return 'value-number'
    case 'boolean': return 'value-boolean'
    default: return 'value-unknown'
  }
}

function formatValue(value) {
  if (value === null) return 'null'
  if (typeof value === 'string') return `"${value}"`
  if (typeof value === 'boolean') return value.toString()
  if (typeof value === 'number') return value.toString()
  return JSON.stringify(value)
}

function copyValue() {
  const value = typeof props.node === 'object' && props.node !== null
    ? formatJSON(props.node, 2)
    : String(props.node)
  emit('copy', value)
}

function handleCopy(value) {
  emit('copy', value)
}
</script>

<style scoped>
.tree-node {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.6;
}

.node-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 0;
  cursor: pointer;
  user-select: none;
}

.node-header:hover {
  background-color: rgba(0, 0, 0, 0.05);
  margin: 0 -4px;
  padding: 4px;
  border-radius: 4px;
}

.expand-icon {
  font-size: 10px;
  color: var(--text-muted);
  width: 12px;
  text-align: center;
}

.node-label {
  color: #9c27b0;
}

.node-type {
  color: var(--text-muted);
  font-size: 12px;
}

.node-children {
  padding-left: 20px;
  border-left: 1px solid var(--border-color);
  margin-left: 5px;
}

.node-value {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 0;
  cursor: pointer;
}

.node-value:hover {
  background-color: rgba(0, 0, 0, 0.05);
  margin: 0 -4px;
  padding: 4px;
  border-radius: 4px;
}

.value {
  font-weight: 500;
}

.value-string {
  color: #2e7d32;
}

.value-number {
  color: #f57c00;
}

.value-boolean {
  color: #1976d2;
}

.value-null {
  color: #757575;
  font-style: italic;
}

.copy-hint {
  font-size: 11px;
  color: var(--text-muted);
  opacity: 0;
  transition: opacity 0.2s;
}

.node-value:hover .copy-hint {
  opacity: 1;
}
</style>

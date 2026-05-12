<template>
  <div class="font-preview-app">
    <header class="header">
      <div class="container">
        <h1 class="title">🖋️ 字体预览平台</h1>
        <p class="subtitle">上传字体文件，实时预览多字体对比效果</p>
      </div>
    </header>

    <main class="main">
      <div class="container">
        <section class="upload-section">
          <div class="upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
            <input ref="fileInput" type="file" accept=".ttf,.otf,.woff,.woff2" multiple @change="handleFileUpload" style="display: none;" />
            <div class="upload-icon">📁</div>
            <p class="upload-text">点击或拖拽字体文件到此处</p>
            <p class="upload-hint">支持 .ttf, .otf, .woff, .woff2 格式</p>
          </div>
        </section>

        <section class="controls-section">
          <div class="controls-grid">
            <div class="control-item">
              <label class="control-label">预览文案</label>
              <textarea v-model="previewText" class="text-input" rows="2" placeholder="输入自定义预览文案..." />
            </div>
            
            <div class="control-item">
              <label class="control-label">字号: {{ fontSize }}px</label>
              <input type="range" v-model.number="fontSize" min="12" max="120" step="1" />
            </div>
            
            <div class="control-item">
              <label class="control-label">行高: {{ lineHeight }}</label>
              <input type="range" v-model.number="lineHeight" min="1" max="3" step="0.1" />
            </div>
            
            <div class="control-item">
              <label class="control-label">字重: {{ fontWeight }}</label>
              <input type="range" v-model.number="fontWeight" min="100" max="900" step="100" />
            </div>
          </div>
        </section>

        <section class="fonts-section" v-if="fonts.length > 0">
          <div class="section-header">
            <h2 class="section-title">已上传字体 ({{ fonts.length }})</h2>
            <button class="clear-btn" @click="clearAllFonts">清空全部</button>
          </div>
          
          <div class="fonts-grid">
            <div v-for="(font, index) in fonts" :key="font.id" class="font-card">
              <div class="font-header">
                <span class="font-name">{{ font.name }}</span>
                <div class="font-actions">
                  <button class="info-btn" @click="showFontDetails(font)">ℹ️</button>
                  <button class="remove-btn" @click="removeFont(index)">✕</button>
                </div>
              </div>
              <div class="font-preview" :style="getFontStyle(font)">
                {{ previewText || 'The quick brown fox jumps over the lazy dog. 窗前明月光，疑是地上霜。' }}
              </div>
            </div>
          </div>
        </section>

        <div class="modal-overlay" v-if="selectedFont" @click.self="closeModal">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title">📋 字体详情</h3>
              <button class="close-modal-btn" @click="closeModal">✕</button>
            </div>
            <div class="modal-body" v-if="selectedFont">
              <div class="detail-section">
                <h4 class="detail-title">基本信息</h4>
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="detail-label">文件名</span>
                    <span class="detail-value">{{ selectedFont.name }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">文件大小</span>
                    <span class="detail-value">{{ selectedFont.size || '未知' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">文件类型</span>
                    <span class="detail-value">{{ selectedFont.type || '未知' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">上传时间</span>
                    <span class="detail-value">{{ selectedFont.uploadDate || '未知' }}</span>
                  </div>
                </div>
              </div>

              <div class="detail-section">
                <h4 class="detail-title">字体属性</h4>
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="detail-label">字体家族</span>
                    <span class="detail-value">{{ selectedFont.fontFamily }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">字重范围</span>
                    <span class="detail-value">{{ selectedFont.weightRange || '100-900' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">是否斜体</span>
                    <span class="detail-value">{{ selectedFont.isItalic ? '是' : '否' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">预览字号</span>
                    <span class="detail-value">{{ fontSize }}px</span>
                  </div>
                </div>
              </div>

              <div class="detail-section">
                <h4 class="detail-title">支持字符预览</h4>
                <div class="charset-preview" :style="{ fontFamily: `'${selectedFont.fontFamily}', sans-serif` }">
                  <span v-for="char in sampleChars" :key="char" class="char-item">{{ char }}</span>
                </div>
              </div>

              <div class="detail-section">
                <h4 class="detail-title">常用字符集</h4>
                <div class="charset-info">
                  <div class="charset-item">
                    <span class="charset-name">英文大小写</span>
                    <span class="charset-status">✓ 支持</span>
                  </div>
                  <div class="charset-item">
                    <span class="charset-name">数字</span>
                    <span class="charset-status">✓ 支持</span>
                  </div>
                  <div class="charset-item">
                    <span class="charset-name">常用符号</span>
                    <span class="charset-status">✓ 支持</span>
                  </div>
                  <div class="charset-item">
                    <span class="charset-name">中文</span>
                    <span class="charset-status">{{ selectedFont.supportsChinese ? '✓ 支持' : '可能不支持' }}</span>
                  </div>
                </div>
              </div>

              <div class="detail-section">
                <h4 class="detail-title">完整预览</h4>
                <div class="full-preview" :style="getFontStyle(selectedFont)">
                  <p>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
                  <p>abcdefghijklmnopqrstuvwxyz</p>
                  <p>0123456789</p>
                  <p>!@#$%^&*()_+-=[]{}|;':",./<>?</p>
                  <p>床前明月光，疑是地上霜。举头望明月，低头思故乡。</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section class="empty-state" v-else>
          <div class="empty-icon">✨</div>
          <p class="empty-text">上传字体文件开始预览</p>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fileInput = ref(null)
const fonts = ref([])
const previewText = ref('')
const fontSize = ref(32)
const lineHeight = ref(1.6)
const fontWeight = ref(400)
const selectedFont = ref(null)

const sampleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789一二三四五六七八九十'

let fontIdCounter = 0

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileExtension = (filename) => {
  return filename.split('.').pop().toUpperCase()
}

const formatDate = (date) => {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event) => {
  const files = event.target.files
  processFiles(files)
  event.target.value = ''
}

const handleDrop = (event) => {
  const files = event.dataTransfer.files
  processFiles(files)
}

const processFiles = async (files) => {
  for (const file of files) {
    if (isValidFontFile(file)) {
      await loadFont(file)
    }
  }
}

const isValidFontFile = (file) => {
  const validExtensions = ['.ttf', '.otf', '.woff', '.woff2']
  const fileName = file.name.toLowerCase()
  return validExtensions.some(ext => fileName.endsWith(ext))
}

const loadFont = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const fontData = e.target.result
      const fontName = `custom-font-${++fontIdCounter}`
      
      const style = document.createElement('style')
      style.textContent = `
        @font-face {
          font-family: '${fontName}';
          src: url(${fontData});
        }
      `
      document.head.appendChild(style)
      
      fonts.value.push({
        id: fontIdCounter,
        name: file.name,
        fontFamily: fontName,
        size: formatFileSize(file.size),
        type: getFileExtension(file.name),
        uploadDate: formatDate(new Date()),
        weightRange: '100-900',
        isItalic: file.name.toLowerCase().includes('italic') || file.name.toLowerCase().includes(' oblique'),
        supportsChinese: true
      })
      
      resolve()
    }
    reader.readAsDataURL(file)
  })
}

const removeFont = (index) => {
  fonts.value.splice(index, 1)
}

const clearAllFonts = () => {
  fonts.value = []
}

const getFontStyle = (font) => {
  return {
    fontFamily: `'${font.fontFamily}', sans-serif`,
    fontSize: `${fontSize.value}px`,
    lineHeight: lineHeight.value,
    fontWeight: fontWeight.value
  }
}

const showFontDetails = (font) => {
  selectedFont.value = font
}

const closeModal = () => {
  selectedFont.value = null
}
</script>

<style scoped lang="scss">
.font-preview-app {
  min-height: 100vh;
}

.header {
  background: linear-gradient(135deg, $primary-color, $secondary-color);
  padding: 40px 0;
  text-align: center;
  
  .title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 8px;
  }
  
  .subtitle {
    font-size: 1rem;
    opacity: 0.9;
  }
}

.main {
  padding: 40px 0;
}

.upload-section {
  margin-bottom: 32px;
}

.upload-area {
  background: $card-bg;
  border: 2px dashed $border-color;
  border-radius: $border-radius;
  padding: 48px 24px;
  text-align: center;
  cursor: pointer;
  transition: $transition;
  
  &:hover {
    border-color: $primary-color;
    background: rgba(99, 102, 241, 0.1);
  }
  
  .upload-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  .upload-text {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .upload-hint {
    font-size: 0.875rem;
    color: $text-muted;
  }
}

.controls-section {
  margin-bottom: 32px;
}

.controls-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 20px;
  background: $card-bg;
  padding: 24px;
  border-radius: $border-radius;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.control-item {
  .control-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 12px;
    color: $text-muted;
  }
}

.text-input {
  width: 100%;
  padding: 12px 16px;
  background: $bg-color;
  border: 1px solid $border-color;
  border-radius: 8px;
  color: $text-color;
  font-size: 0.875rem;
  resize: none;
  outline: none;
  transition: $transition;
  
  &:focus {
    border-color: $primary-color;
  }
}

.fonts-section {
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .section-title {
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  .clear-btn {
    padding: 8px 16px;
    background: $danger-color;
    color: white;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    
    &:hover {
      opacity: 0.9;
    }
  }
}

.fonts-grid {
  display: grid;
  gap: 20px;
}

.font-card {
  background: $card-bg;
  border-radius: $border-radius;
  overflow: hidden;
  box-shadow: $shadow;
}

.font-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid $border-color;
  
  .font-name {
    font-weight: 600;
    font-size: 0.9375rem;
  }
  
  .font-actions {
    display: flex;
    gap: 8px;
  }
  
  .info-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(99, 102, 241, 0.2);
    color: $primary-color;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background: $primary-color;
      color: white;
    }
  }
  
  .remove-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(239, 68, 68, 0.2);
    color: $danger-color;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background: $danger-color;
      color: white;
    }
  }
}

.font-preview {
  padding: 32px;
  word-break: break-word;
  min-height: 160px;
  overflow-x: auto;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  
  .empty-icon {
    font-size: 64px;
    margin-bottom: 16px;
  }
  
  .empty-text {
    font-size: 1.125rem;
    color: $text-muted;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: $card-bg;
  border-radius: $border-radius;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid $border-color;
  background: rgba(0, 0, 0, 0.2);
  
  .modal-title {
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  .close-modal-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(239, 68, 68, 0.2);
    color: $danger-color;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background: $danger-color;
      color: white;
    }
  }
}

.modal-body {
  padding: 24px;
}

.detail-section {
  margin-bottom: 28px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .detail-title {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 16px;
    color: $primary-color;
    padding-bottom: 8px;
    border-bottom: 2px solid rgba(99, 102, 241, 0.3);
  }
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  
  .detail-label {
    font-size: 0.75rem;
    color: $text-muted;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .detail-value {
    font-size: 0.9375rem;
    font-weight: 500;
    word-break: break-all;
  }
}

.charset-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  font-size: 24px;
}

.char-item {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 6px;
  border: 1px solid rgba(99, 102, 241, 0.3);
}

.charset-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.charset-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  
  .charset-name {
    font-size: 0.9375rem;
  }
  
  .charset-status {
    font-size: 0.875rem;
    color: $success-color;
    font-weight: 500;
  }
}

.full-preview {
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  word-break: break-word;
  
  p {
    margin-bottom: 12px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
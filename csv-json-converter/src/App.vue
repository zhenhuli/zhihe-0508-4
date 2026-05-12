<script setup>
import { ref, onMounted } from 'vue'
import FileProcessor from './components/FileProcessor.vue'
import ResultDisplay from './components/ResultDisplay.vue'

const result = ref('')
const convertDirection = ref('csv-to-json')
const rawResult = ref('')

const sampleCSV = `姓名,年龄,城市,职业
张三,28,北京,工程师
李四,32,上海,设计师
王五,25,广州,产品经理
赵六,30,深圳,数据分析师
钱七,27,杭州,前端开发`

const sampleJSON = [
  { 姓名: '张三', 年龄: 28, 城市: '北京', 职业: '工程师' },
  { 姓名: '李四', 年龄: 32, 城市: '上海', 职业: '设计师' },
  { 姓名: '王五', 年龄: 25, 城市: '广州', 职业: '产品经理' },
  { 姓名: '赵六', 年龄: 30, 城市: '深圳', 职业: '数据分析师' },
  { 姓名: '钱七', 年龄: 27, 城市: '杭州', 职业: '前端开发' }
]

onMounted(() => {
  result.value = JSON.stringify(sampleJSON, null, 2)
  rawResult.value = JSON.stringify(sampleJSON)
  convertDirection.value = 'csv-to-json'
})

const csvToJSON = (csvText) => {
  const lines = csvText.trim().split('\n')
  const headers = parseCSVLine(lines[0])
  const result = []

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = parseCSVLine(lines[i])
      const obj = {}
      headers.forEach((header, index) => {
        let value = values[index] || ''
        if (!isNaN(value) && value !== '') {
          value = Number(value)
        }
        obj[header] = value
      })
      result.push(obj)
    }
  }

  return result
}

const parseCSVLine = (line) => {
  const result = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result
}

const jsonToCSV = (jsonText) => {
  const data = JSON.parse(jsonText)
  if (!Array.isArray(data) || data.length === 0) {
    return ''
  }

  const headers = Object.keys(data[0])
  const lines = [headers.join(',')]

  data.forEach(item => {
    const values = headers.map(header => {
      let value = item[header] !== undefined ? item[header] : ''
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        value = '"' + value.replace(/"/g, '""') + '"'
      }
      return value
    })
    lines.push(values.join(','))
  })

  return lines.join('\n')
}

const detectFormat = (text) => {
  const trimmed = text.trim()
  
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      JSON.parse(trimmed)
      return 'json'
    } catch (e) {
      // 不是有效的 JSON
    }
  }
  
  const firstLine = trimmed.split('\n')[0]
  if (firstLine.includes(',')) {
    return 'csv'
  }
  
  return null
}

const handleConvert = ({ text }) => {
  if (!text.trim()) {
    alert('请输入数据')
    return
  }

  try {
    const format = detectFormat(text)
    
    if (format === 'csv') {
      convertDirection.value = 'csv-to-json'
      const jsonData = csvToJSON(text)
      rawResult.value = JSON.stringify(jsonData)
      result.value = JSON.stringify(jsonData, null, 2)
    } else if (format === 'json') {
      convertDirection.value = 'json-to-csv'
      const csvData = jsonToCSV(text)
      rawResult.value = csvData
      result.value = csvData
    } else {
      alert('无法识别数据格式，请检查输入是否为有效的 CSV 或 JSON 格式')
    }
  } catch (error) {
    console.error('转换错误:', error)
    alert('转换失败，请检查输入格式是否正确')
  }
}

const handleInputBeautify = ({ text }) => {
  if (!text.trim()) {
    alert('请输入数据')
    return
  }

  try {
    const format = detectFormat(text)
    
    if (format === 'json') {
      const jsonData = JSON.parse(text)
      rawResult.value = JSON.stringify(jsonData)
      result.value = JSON.stringify(jsonData, null, 2)
      convertDirection.value = 'json-to-json'
    } else if (format === 'csv') {
      result.value = text
      rawResult.value = text
      convertDirection.value = 'csv-to-csv'
      alert('CSV 格式已保持原样显示')
    } else {
      alert('无法识别数据格式，请检查输入是否为有效的 CSV 或 JSON 格式')
    }
  } catch (error) {
    console.error('美化错误:', error)
    alert('美化失败，请检查输入格式是否正确')
  }
}

const handleClear = () => {
  result.value = ''
  rawResult.value = ''
}

const handleBeautify = (isBeautified) => {
  if (convertDirection.value === 'csv-to-json' || convertDirection.value === 'json-to-json') {
    if (isBeautified) {
      result.value = JSON.stringify(JSON.parse(rawResult.value), null, 2)
    } else {
      result.value = rawResult.value
    }
  }
}
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>CSV ↔ JSON 转换器</h1>
      <p class="subtitle">简单易用的数据格式转换工具</p>
    </header>

    <main class="main-content">
      <div class="container">
        <FileProcessor @convert="handleConvert" @beautify="handleInputBeautify" @clear="handleClear" />
        <ResultDisplay 
          :result="result" 
          :convert-direction="convertDirection"
          @beautify="handleBeautify"
        />
      </div>
    </main>

    <footer class="footer">
      <p>支持拖拽上传、粘贴文本 | 一键转换 | 格式美化 | 文件下载</p>
    </footer>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  text-align: center;
  padding: 40px 20px 20px;
  color: white;
}

.header h1 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 16px;
  opacity: 0.9;
}

.main-content {
  flex: 1;
  padding: 20px;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.footer {
  text-align: center;
  padding: 24px;
  color: white;
  opacity: 0.8;
}

.footer p {
  font-size: 14px;
}
</style>

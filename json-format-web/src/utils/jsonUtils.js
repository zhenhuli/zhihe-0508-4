import JSON5 from 'json5'

export function parseJSON(text) {
  try {
    return {
      success: true,
      data: JSON.parse(text),
      error: null
    }
  } catch (e) {
    try {
      const data = JSON5.parse(text)
      return {
        success: true,
        data,
        warning: '使用 JSON5 解析（支持注释、尾随逗号等）',
        error: null
      }
    } catch (e2) {
      return {
        success: false,
        data: null,
        error: e.message,
        errorLine: extractErrorLine(e.message, text)
      }
    }
  }
}

export function formatJSON(data, indent = 2) {
  return JSON.stringify(data, null, indent)
}

export function minifyJSON(data) {
  return JSON.stringify(data)
}

export function escapeJSON(text) {
  return JSON.stringify(text).slice(1, -1)
}

export function unescapeJSON(text) {
  try {
    return JSON.parse(`"${text}"`)
  } catch (e) {
    return text
  }
}

export function validateJSON(text) {
  const result = parseJSON(text)
  return {
    valid: result.success,
    error: result.error,
    errorLine: result.errorLine,
    warning: result.warning
  }
}

function extractErrorLine(errorMessage, text) {
  const match = errorMessage.match(/position (\d+)/i)
  if (!match) return { line: 1, column: 1, context: '' }
  
  const position = parseInt(match[1])
  const lines = text.substring(0, position).split('\n')
  const line = lines.length
  const column = lines[lines.length - 1].length + 1
  
  const allLines = text.split('\n')
  const startLine = Math.max(0, line - 3)
  const endLine = Math.min(allLines.length, line + 2)
  const context = allLines.slice(startLine, endLine).map((l, i) => {
    const lineNum = startLine + i + 1
    const marker = lineNum === line ? '>> ' : '   '
    return `${marker}${lineNum}: ${l}`
  }).join('\n')
  
  return { line, column, position, context }
}

export function getSizeInfo(text) {
  const bytes = new Blob([text]).size
  const chars = text.length
  const lines = text.split('\n').length
  return { bytes, chars, lines }
}

export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text)
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

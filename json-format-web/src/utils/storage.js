const HISTORY_KEY = 'json_tool_history'
const THEME_KEY = 'json_tool_theme'
const MAX_HISTORY = 50

export function saveHistory(item) {
  const history = getHistory()
  const newHistory = [item, ...history].slice(0, MAX_HISTORY)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
  return newHistory
}

export function getHistory() {
  try {
    const data = localStorage.getItem(HISTORY_KEY)
    return data ? JSON.parse(data) : []
  } catch (e) {
    return []
  }
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY)
  return []
}

export function deleteHistoryItem(id) {
  const history = getHistory().filter(item => item.id !== id)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  return history
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme)
}

export function getTheme() {
  const saved = localStorage.getItem(THEME_KEY)
  if (saved) return saved
  
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

export function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
}

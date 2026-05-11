const presetThemes = {
  neon: {
    name: '霓虹灯',
    colors: ['#00ffff', '#ff00ff', '#00ff00']
  },
  ocean: {
    name: '海洋',
    colors: ['#006994', '#40e0d0', '#00ced1']
  },
  sunset: {
    name: '日落',
    colors: ['#ff4500', '#ff6347', '#ffa500']
  },
  forest: {
    name: '森林',
    colors: ['#228b22', '#32cd32', '#90ee90']
  },
  purple: {
    name: '紫色梦幻',
    colors: ['#8b00ff', '#9370db', '#da70d6']
  }
}

class Theme {
  constructor() {
    this.currentTheme = 'neon'
    this.customColors = ['#00ffff', '#ff00ff', '#00ff00']
    this.onThemeChange = null
  }

  getPresetThemes() {
    return presetThemes
  }

  getTheme(themeName) {
    if (themeName === 'custom') {
      return { name: '自定义', colors: this.customColors }
    }
    return presetThemes[themeName] || presetThemes.neon
  }

  getCurrentColors() {
    if (this.currentTheme === 'custom') {
      return this.customColors
    }
    return this.getTheme(this.currentTheme).colors
  }

  setTheme(themeName) {
    this.currentTheme = themeName
    if (this.onThemeChange) {
      this.onThemeChange(this.getCurrentColors())
    }
  }

  setCustomColors(colors) {
    this.customColors = colors
    if (this.currentTheme === 'custom' && this.onThemeChange) {
      this.onThemeChange(this.customColors)
    }
  }

  setCustomColor(index, color) {
    if (index >= 0 && index < 3) {
      this.customColors[index] = color
      if (this.currentTheme === 'custom' && this.onThemeChange) {
        this.onThemeChange(this.customColors)
      }
    }
  }
}

export default new Theme()

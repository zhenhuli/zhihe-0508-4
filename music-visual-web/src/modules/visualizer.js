import audioAnalyzer from './audio-analyzer.js'

class Visualizer {
  constructor() {
    this.canvas = null
    this.ctx = null
    this.mode = 'bar'
    this.animationId = null
    this.barCount = 64
    this.colors = ['#00ffff', '#ff00ff', '#00ff00']
    this.particles = []
    this.time = 0
  }

  init(canvasId) {
    this.canvas = document.getElementById(canvasId)
    this.ctx = this.canvas.getContext('2d')
    this.resize()
    window.addEventListener('resize', () => this.resize())
  }

  getWidth() {
    return this.canvas.parentElement.getBoundingClientRect().width
  }

  getHeight() {
    return this.canvas.parentElement.getBoundingClientRect().height
  }

  resize() {
    const container = this.canvas.parentElement
    const rect = container.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    
    this.getWidth() = rect.width * dpr
    this.getHeight() = rect.height * dpr
    
    this.canvas.style.width = rect.width + 'px'
    this.canvas.style.height = rect.height + 'px'
    
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  setMode(mode) {
    this.mode = mode
    this.clear()
  }

  setColors(colors) {
    this.colors = colors
  }

  start() {
    if (this.animationId) return
    this.animate()
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate())
    this.time += 0.02
    
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
    this.ctx.fillRect(0, 0, this.getWidth(), this.getHeight())
    
    switch (this.mode) {
      case 'bar':
        this.drawBars()
        break
      case 'wave':
        this.drawWave()
        break
      case 'mirror':
        this.drawMirrorBars()
        break
      case 'circle':
        this.drawCircle()
        break
      case 'doubleCircle':
        this.drawDoubleCircle()
        break
      case 'particles':
        this.drawParticles()
        break
      case 'spectrum3D':
        this.drawSpectrum3D()
        break
      case 'spiral':
        this.drawSpiral()
        break
      default:
        this.drawBars()
    }
  }

  drawBars() {
    const frequencyData = audioAnalyzer.getFrequencyData()
    if (frequencyData.length === 0) return
    
    const width = this.getWidth()
    const height = this.getHeight()
    const barWidth = width / this.barCount
    const step = Math.floor(frequencyData.length / this.barCount)
    
    const gradient = this.ctx.createLinearGradient(0, height, 0, 0)
    gradient.addColorStop(0, this.colors[0])
    gradient.addColorStop(0.5, this.colors[1])
    gradient.addColorStop(1, this.colors[2])
    
    this.ctx.fillStyle = gradient
    this.ctx.shadowBlur = 15
    this.ctx.shadowColor = this.colors[0]
    
    for (let i = 0; i < this.barCount; i++) {
      const dataIndex = i * step
      const value = frequencyData[dataIndex] || 0
      const barHeight = (value / 255) * height * 0.8
      
      const x = i * barWidth
      const y = height - barHeight
      
      this.ctx.fillRect(x + 1, y, barWidth - 2, barHeight)
    }
    
    this.ctx.shadowBlur = 0
  }

  drawWave() {
    const timeData = audioAnalyzer.getTimeDomainData()
    if (timeData.length === 0) return
    
    const width = this.getWidth()
    const height = this.getHeight()
    const sliceWidth = width / timeData.length
    
    const gradient = this.ctx.createLinearGradient(0, 0, width, 0)
    gradient.addColorStop(0, this.colors[0])
    gradient.addColorStop(0.5, this.colors[1])
    gradient.addColorStop(1, this.colors[2])
    
    this.ctx.lineWidth = 3
    this.ctx.strokeStyle = gradient
    this.ctx.shadowBlur = 10
    this.ctx.shadowColor = this.colors[0]
    
    this.ctx.beginPath()
    
    let x = 0
    for (let i = 0; i < timeData.length; i++) {
      const v = timeData[i] / 128.0
      const y = (v * height) / 2
      
      if (i === 0) {
        this.ctx.moveTo(x, y)
      } else {
        this.ctx.lineTo(x, y)
      }
      
      x += sliceWidth
    }
    
    this.ctx.lineTo(width, height / 2)
    this.ctx.stroke()
    
    this.ctx.fillStyle = gradient
    this.ctx.globalAlpha = 0.3
    this.ctx.lineTo(width, height)
    this.ctx.lineTo(0, height)
    this.ctx.fill()
    this.ctx.globalAlpha = 1
    
    this.ctx.shadowBlur = 0
  }

  drawMirrorBars() {
    const frequencyData = audioAnalyzer.getFrequencyData()
    if (frequencyData.length === 0) return
    
    const width = this.getWidth()
    const height = this.getHeight()
    const barWidth = width / this.barCount
    const step = Math.floor(frequencyData.length / this.barCount)
    const centerY = height / 2
    
    const gradient = this.ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, this.colors[2])
    gradient.addColorStop(0.5, this.colors[1])
    gradient.addColorStop(1, this.colors[0])
    
    this.ctx.fillStyle = gradient
    this.ctx.shadowBlur = 12
    this.ctx.shadowColor = this.colors[1]
    
    for (let i = 0; i < this.barCount; i++) {
      const dataIndex = i * step
      const value = frequencyData[dataIndex] || 0
      const barHeight = (value / 255) * (height * 0.4)
      
      const x = i * barWidth
      
      this.ctx.fillRect(x + 1, centerY - barHeight, barWidth - 2, barHeight)
      this.ctx.fillRect(x + 1, centerY, barWidth - 2, barHeight)
    }
    
    this.ctx.fillStyle = this.colors[1]
    this.ctx.fillRect(0, centerY - 1, width, 2)
    
    this.ctx.shadowBlur = 0
  }

  drawCircle() {
    const frequencyData = audioAnalyzer.getFrequencyData()
    if (frequencyData.length === 0) return
    
    const width = this.getWidth()
    const height = this.getHeight()
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) * 0.25
    const barCount = 128
    const step = Math.floor(frequencyData.length / barCount)
    
    this.ctx.save()
    this.ctx.translate(centerX, centerY)
    
    for (let i = 0; i < barCount; i++) {
      const dataIndex = i * step
      const value = frequencyData[dataIndex] || 0
      const barHeight = (value / 255) * radius * 1.5
      
      const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2
      
      const colorIndex = Math.floor((i / barCount) * 3)
      this.ctx.fillStyle = this.colors[colorIndex % 3]
      this.ctx.shadowBlur = 8
      this.ctx.shadowColor = this.colors[colorIndex % 3]
      
      this.ctx.save()
      this.ctx.rotate(angle)
      this.ctx.fillRect(2, -1.5, barHeight, 3)
      this.ctx.restore()
    }
    
    const innerGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, radius)
    innerGradient.addColorStop(0, this.colors[1] + '40')
    innerGradient.addColorStop(1, this.colors[0] + '10')
    
    this.ctx.beginPath()
    this.ctx.arc(0, 0, radius * 0.9, 0, Math.PI * 2)
    this.ctx.fillStyle = innerGradient
    this.ctx.fill()
    
    this.ctx.shadowBlur = 0
    this.ctx.restore()
  }

  drawDoubleCircle() {
    const frequencyData = audioAnalyzer.getFrequencyData()
    if (frequencyData.length === 0) return
    
    const width = this.getWidth()
    const height = this.getHeight()
    const centerX = width / 2
    const centerY = height / 2
    const radius1 = Math.min(width, height) * 0.3
    const radius2 = Math.min(width, height) * 0.15
    const barCount = 80
    const step = Math.floor(frequencyData.length / barCount)
    
    this.ctx.save()
    this.ctx.translate(centerX, centerY)
    
    this.ctx.rotate(this.time * 0.5)
    for (let i = 0; i < barCount; i++) {
      const dataIndex = i * step
      const value = frequencyData[dataIndex] || 0
      const barHeight = (value / 255) * radius1 * 0.6
      
      const angle = (i / barCount) * Math.PI * 2
      
      this.ctx.fillStyle = this.colors[0]
      this.ctx.shadowBlur = 10
      this.ctx.shadowColor = this.colors[0]
      
      this.ctx.save()
      this.ctx.rotate(angle)
      this.ctx.fillRect(radius1, -2, barHeight, 4)
      this.ctx.restore()
    }
    this.ctx.rotate(-this.time * 0.5)
    
    this.ctx.rotate(-this.time * 0.8)
    for (let i = 0; i < barCount; i++) {
      const dataIndex = (barCount - i) * step
      const value = frequencyData[dataIndex] || 0
      const barHeight = (value / 255) * radius2 * 0.8
      
      const angle = (i / barCount) * Math.PI * 2
      
      this.ctx.fillStyle = this.colors[2]
      this.ctx.shadowBlur = 10
      this.ctx.shadowColor = this.colors[2]
      
      this.ctx.save()
      this.ctx.rotate(angle)
      this.ctx.fillRect(radius2, -1.5, barHeight, 3)
      this.ctx.restore()
    }
    this.ctx.rotate(this.time * 0.8)
    
    const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, radius2)
    gradient.addColorStop(0, this.colors[1])
    gradient.addColorStop(1, this.colors[1] + '00')
    
    this.ctx.beginPath()
    this.ctx.arc(0, 0, radius2 * 0.8, 0, Math.PI * 2)
    this.ctx.fillStyle = gradient
    this.ctx.fill()
    
    this.ctx.shadowBlur = 0
    this.ctx.restore()
  }

  drawParticles() {
    const frequencyData = audioAnalyzer.getFrequencyData()
    if (frequencyData.length === 0) return
    
    const width = this.getWidth()
    const height = this.getHeight()
    const centerX = width / 2
    const centerY = height / 2
    
    let avg = 0
    const step = Math.floor(frequencyData.length / 32)
    for (let i = 0; i < 32; i++) {
      avg += frequencyData[i * step] || 0
    }
    avg = avg / 32
    
    const particleCount = Math.max(5, Math.floor(avg / 10))
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = (avg / 255) * 8 + 2
      const colorIndex = Math.floor(Math.random() * 3)
      this.particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        color: this.colors[colorIndex],
        life: 1
      })
    }
    
    this.ctx.globalCompositeOperation = 'lighter'
    
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]
      
      p.x += p.vx
      p.y += p.vy
      p.life -= 0.01
      p.size *= 0.99
      
      if (p.life <= 0 || p.size < 0.5) {
        this.particles.splice(i, 1)
        continue
      }
      
      this.ctx.beginPath()
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      this.ctx.fillStyle = p.color
      this.ctx.globalAlpha = p.life
      this.ctx.fill()
    }
    
    this.ctx.globalAlpha = 1
    this.ctx.globalCompositeOperation = 'source-over'
    
    if (avg > 50) {
      const gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 100)
      gradient.addColorStop(0, this.colors[1] + Math.floor((avg / 255) * 80).toString(16).padStart(2, '0'))
      gradient.addColorStop(1, 'transparent')
      
      this.ctx.beginPath()
      this.ctx.arc(centerX, centerY, 100, 0, Math.PI * 2)
      this.ctx.fillStyle = gradient
      this.ctx.fill()
    }
  }

  drawSpectrum3D() {
    const frequencyData = audioAnalyzer.getFrequencyData()
    if (frequencyData.length === 0) return
    
    const width = this.getWidth()
    const height = this.getHeight()
    const centerX = width / 2
    const centerY = height / 2
    const baseRadius = Math.min(width, height) * 0.2
    const barCount = 96
    const step = Math.floor(frequencyData.length / barCount)
    
    this.ctx.save()
    this.ctx.translate(centerX, centerY)
    
    for (let layer = 0; layer < 3; layer++) {
      const layerRadius = baseRadius - layer * 30
      const alpha = 1 - layer * 0.3
      
      for (let i = 0; i < barCount; i++) {
        const dataIndex = (i + layer * 10) * step
        const value = frequencyData[dataIndex] || 0
        const barHeight = (value / 255) * layerRadius * 0.5
        
        const angle = (i / barCount) * Math.PI * 2 + this.time * (0.3 - layer * 0.1)
        const colorIndex = layer % 3
        
        this.ctx.save()
        this.ctx.rotate(angle)
        this.ctx.globalAlpha = alpha
        this.ctx.fillStyle = this.colors[colorIndex]
        this.ctx.shadowBlur = 6
        this.ctx.shadowColor = this.colors[colorIndex]
        
        this.ctx.fillRect(layerRadius, -1.5, barHeight + 5, 3)
        this.ctx.restore()
      }
    }
    
    const centerGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, baseRadius)
    centerGradient.addColorStop(0, this.colors[1] + '60')
    centerGradient.addColorStop(0.5, this.colors[0] + '20')
    centerGradient.addColorStop(1, 'transparent')
    
    this.ctx.beginPath()
    this.ctx.arc(0, 0, baseRadius, 0, Math.PI * 2)
    this.ctx.fillStyle = centerGradient
    this.ctx.globalAlpha = 0.5
    this.ctx.fill()
    
    this.ctx.globalAlpha = 1
    this.ctx.shadowBlur = 0
    this.ctx.restore()
  }

  drawSpiral() {
    const frequencyData = audioAnalyzer.getFrequencyData()
    if (frequencyData.length === 0) return
    
    const width = this.getWidth()
    const height = this.getHeight()
    const centerX = width / 2
    const centerY = height / 2
    const maxRadius = Math.min(width, height) * 0.45
    const spirals = 3
    
    this.ctx.save()
    this.ctx.translate(centerX, centerY)
    
    for (let s = 0; s < spirals; s++) {
      this.ctx.beginPath()
      
      const spiralOffset = (s / spirals) * Math.PI * 2
      const color = this.colors[s % 3]
      
      for (let i = 0; i <= 200; i++) {
        const progress = i / 200
        const angle = progress * Math.PI * 8 + spiralOffset + this.time
        const radius = progress * maxRadius
        
        const dataIndex = Math.floor(progress * frequencyData.length)
        const value = frequencyData[dataIndex] || 0
        const offset = (value / 255) * 30
        
        const x = Math.cos(angle) * (radius + offset)
        const y = Math.sin(angle) * (radius + offset)
        
        if (i === 0) {
          this.ctx.moveTo(x, y)
        } else {
          this.ctx.lineTo(x, y)
        }
      }
      
      const gradient = this.ctx.createLinearGradient(0, -maxRadius, 0, maxRadius)
      gradient.addColorStop(0, color + '00')
      gradient.addColorStop(0.5, color)
      gradient.addColorStop(1, color + '00')
      
      this.ctx.strokeStyle = gradient
      this.ctx.lineWidth = 2
      this.ctx.shadowBlur = 15
      this.ctx.shadowColor = color
      this.ctx.stroke()
    }
    
    let avg = 0
    for (let i = 0; i < 20; i++) {
      avg += frequencyData[i] || 0
    }
    avg = avg / 20
    
    const centerGlow = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 80)
    centerGlow.addColorStop(0, this.colors[1] + Math.floor((avg / 255) * 100).toString(16).padStart(2, '0'))
    centerGlow.addColorStop(1, 'transparent')
    
    this.ctx.beginPath()
    this.ctx.arc(0, 0, 80, 0, Math.PI * 2)
    this.ctx.fillStyle = centerGlow
    this.ctx.fill()
    
    this.ctx.shadowBlur = 0
    this.ctx.restore()
  }

  clear() {
    this.particles = []
    this.ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    this.ctx.fillRect(0, 0, this.getWidth(), this.getHeight())
  }
}

export default new Visualizer()

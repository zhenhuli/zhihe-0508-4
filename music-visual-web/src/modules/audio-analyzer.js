class AudioAnalyzer {
  constructor() {
    this.audioContext = null
    this.analyser = null
    this.source = null
    this.connectedAudioElement = null
    this.dataArray = null
    this.fftSize = 2048
  }

  init() {
    if (this.audioContext) return
    
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    this.analyser = this.audioContext.createAnalyser()
    this.analyser.fftSize = this.fftSize
    this.analyser.smoothingTimeConstant = 0.8
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount)
  }

  connectAudioElement(audioElement) {
    if (!this.audioContext) {
      this.init()
    }
    
    if (this.connectedAudioElement === audioElement) {
      return
    }
    
    this.connectedAudioElement = audioElement
    this.source = this.audioContext.createMediaElementSource(audioElement)
    this.source.connect(this.analyser)
    this.analyser.connect(this.audioContext.destination)
  }

  getFrequencyData() {
    if (!this.analyser) return []
    this.analyser.getByteFrequencyData(this.dataArray)
    return this.dataArray
  }

  getTimeDomainData() {
    if (!this.analyser) return []
    const timeData = new Uint8Array(this.analyser.frequencyBinCount)
    this.analyser.getByteTimeDomainData(timeData)
    return timeData
  }

  getFrequencyBinCount() {
    return this.analyser ? this.analyser.frequencyBinCount : 0
  }

  async resumeContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }
  }

  setSmoothing(value) {
    if (this.analyser) {
      this.analyser.smoothingTimeConstant = Math.max(0, Math.min(1, value))
    }
  }

  setFftSize(size) {
    if (this.analyser) {
      this.analyser.fftSize = size
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount)
    }
  }
}

export default new AudioAnalyzer()

import audioAnalyzer from './audio-analyzer.js'

class Player {
  constructor() {
    this.audio = new Audio()
    this.audio.crossOrigin = 'anonymous'
    this.playlist = []
    this.currentIndex = 0
    this.isPlaying = false
    this.onPlay = null
    this.onPause = null
    this.onEnded = null
    this.onTimeUpdate = null
    this.onLoaded = null
    
    this.audio.addEventListener('play', () => {
      this.isPlaying = true
      if (this.onPlay) this.onPlay()
    })
    
    this.audio.addEventListener('pause', () => {
      this.isPlaying = false
      if (this.onPause) this.onPause()
    })
    
    this.audio.addEventListener('ended', () => {
      this.isPlaying = false
      if (this.onEnded) this.onEnded()
    })
    
    this.audio.addEventListener('timeupdate', () => {
      if (this.onTimeUpdate) this.onTimeUpdate(this.audio.currentTime, this.audio.duration)
    })
    
    this.audio.addEventListener('loadedmetadata', () => {
      if (this.onLoaded) this.onLoaded(this.audio.duration)
    })
  }

  addFiles(files) {
    for (const file of files) {
      const url = URL.createObjectURL(file)
      this.playlist.push({
        name: file.name,
        url: url,
        file: file
      })
    }
    return this.playlist
  }

  loadTrack(index) {
    if (index < 0 || index >= this.playlist.length) return false
    
    this.currentIndex = index
    this.audio.src = this.playlist[index].url
    audioAnalyzer.connectAudioElement(this.audio)
    return true
  }

  async play() {
    await audioAnalyzer.resumeContext()
    return this.audio.play()
  }

  pause() {
    this.audio.pause()
  }

  togglePlayPause() {
    if (this.isPlaying) {
      this.pause()
    } else {
      this.play()
    }
  }

  next() {
    if (this.playlist.length === 0) return
    
    let nextIndex = this.currentIndex + 1
    if (nextIndex >= this.playlist.length) {
      nextIndex = 0
    }
    
    this.loadTrack(nextIndex)
    this.play()
    return nextIndex
  }

  prev() {
    if (this.playlist.length === 0) return
    
    let prevIndex = this.currentIndex - 1
    if (prevIndex < 0) {
      prevIndex = this.playlist.length - 1
    }
    
    this.loadTrack(prevIndex)
    this.play()
    return prevIndex
  }

  setVolume(value) {
    this.audio.volume = value
  }

  setCurrentTime(time) {
    this.audio.currentTime = time
  }

  getCurrentTrack() {
    return this.playlist[this.currentIndex]
  }

  getPlaylist() {
    return this.playlist
  }

  getCurrentIndex() {
    return this.currentIndex
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
}

export default new Player()

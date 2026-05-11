import './style.css'
import audioAnalyzer from './modules/audio-analyzer.js'
import visualizer from './modules/visualizer.js'
import player from './modules/player.js'
import theme from './modules/theme.js'

function init() {
  visualizer.init('visualizer')
  visualizer.setColors(theme.getCurrentColors())
  visualizer.start()
  
  const fileInput = document.getElementById('fileInput')
  const playlistEl = document.getElementById('playlist')
  const playPauseBtn = document.getElementById('playPauseBtn')
  const prevBtn = document.getElementById('prevBtn')
  const nextBtn = document.getElementById('nextBtn')
  const progressBar = document.getElementById('progressBar')
  const currentTimeEl = document.getElementById('currentTime')
  const durationEl = document.getElementById('duration')
  const volumeBar = document.getElementById('volumeBar')
  const modeSelect = document.getElementById('modeSelect')
  const presetThemeSelect = document.getElementById('presetTheme')
  const customColorsEl = document.getElementById('customColors')
  const color1Input = document.getElementById('color1')
  const color2Input = document.getElementById('color2')
  const color3Input = document.getElementById('color3')

  player.setVolume(0.8)

  player.onPlay = () => {
    playPauseBtn.textContent = '⏸'
  }

  player.onPause = () => {
    playPauseBtn.textContent = '▶'
  }

  player.onEnded = () => {
    player.next()
    updatePlaylistUI()
  }

  player.onTimeUpdate = (current, duration) => {
    currentTimeEl.textContent = player.formatTime(current)
    if (!isNaN(duration)) {
      durationEl.textContent = player.formatTime(duration)
      progressBar.max = duration
      progressBar.value = current
    }
  }

  player.onLoaded = (duration) => {
    durationEl.textContent = player.formatTime(duration)
    updatePlaylistUI()
  }

  theme.onThemeChange = (colors) => {
    visualizer.setColors(colors)
  }

  function updatePlaylistUI() {
    const playlist = player.getPlaylist()
    const currentIndex = player.getCurrentIndex()
    
    playlistEl.innerHTML = ''
    playlist.forEach((track, index) => {
      const item = document.createElement('div')
      item.className = 'playlist-item'
      item.textContent = track.name
      if (index === currentIndex) {
        item.classList.add('active')
      }
      item.addEventListener('click', () => {
        player.loadTrack(index)
        player.play()
        updatePlaylistUI()
      })
      playlistEl.appendChild(item)
    })
  }

  fileInput.addEventListener('change', (e) => {
    const files = e.target.files
    if (files.length > 0) {
      const playlist = player.addFiles(files)
      if (playlist.length === files.length) {
        player.loadTrack(0)
      }
      updatePlaylistUI()
    }
    fileInput.value = ''
  })

  playPauseBtn.addEventListener('click', async () => {
    if (player.getPlaylist().length === 0) {
      fileInput.click()
      return
    }
    if (!player.getCurrentTrack()) {
      player.loadTrack(0)
    }
    await player.togglePlayPause()
  })

  prevBtn.addEventListener('click', () => {
    player.prev()
    updatePlaylistUI()
  })

  nextBtn.addEventListener('click', () => {
    player.next()
    updatePlaylistUI()
  })

  progressBar.addEventListener('input', (e) => {
    player.setCurrentTime(parseFloat(e.target.value))
  })

  volumeBar.addEventListener('input', (e) => {
    player.setVolume(e.target.value / 100)
  })

  modeSelect.addEventListener('change', (e) => {
    visualizer.setMode(e.target.value)
  })

  presetThemeSelect.addEventListener('change', (e) => {
    theme.setTheme(e.target.value)
    if (e.target.value === 'custom') {
      customColorsEl.style.display = 'flex'
    } else {
      customColorsEl.style.display = 'none'
    }
  })

  color1Input.addEventListener('input', (e) => {
    theme.setCustomColor(0, e.target.value)
  })

  color2Input.addEventListener('input', (e) => {
    theme.setCustomColor(1, e.target.value)
  })

  color3Input.addEventListener('input', (e) => {
    theme.setCustomColor(2, e.target.value)
  })
}

document.addEventListener('DOMContentLoaded', init)

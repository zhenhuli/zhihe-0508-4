import './style.css'

const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')

canvas.width = 800
canvas.height = 600

const GRAVITY = 0.6
const JUMP_FORCE = -14
const BASE_SPEED = 3

let gameState = 'start'
let score = 0
let highScores = JSON.parse(localStorage.getItem('blockJumpHighScores')) || []
let speed = BASE_SPEED

function getDifficulty() {
  return Math.min(score / 500, 10)
}

function saveScore(newScore) {
  highScores.push(newScore)
  highScores.sort((a, b) => b - a)
  highScores = highScores.slice(0, 5)
  localStorage.setItem('blockJumpHighScores', JSON.stringify(highScores))
}

const player = {
  x: 150,
  y: 300,
  width: 40,
  height: 40,
  velocityY: 0,
  isJumping: false,
  color: '#FF6B6B'
}

let platforms = []
let obstacles = []
let clouds = []

function initClouds() {
  clouds = []
  for (let i = 0; i < 5; i++) {
    clouds.push({
      x: Math.random() * canvas.width,
      y: Math.random() * 200 + 50,
      width: Math.random() * 80 + 60,
      speed: Math.random() * 0.5 + 0.2
    })
  }
}

function initPlatforms() {
  platforms = []
  platforms.push({
    x: 0,
    y: 500,
    width: 500,
    height: 20
  })
  
  for (let i = 1; i < 8; i++) {
    const lastPlatform = platforms[platforms.length - 1]
    const gap = Math.random() * 80 + 60
    const width = Math.random() * 120 + 180
    platforms.push({
      x: lastPlatform.x + lastPlatform.width + gap,
      y: Math.random() * 150 + 400,
      width: width,
      height: 20
    })
  }
}

function generatePlatform() {
  const difficulty = getDifficulty()
  const lastPlatform = platforms[platforms.length - 1]
  const gap = Math.random() * (80 + difficulty * 5) + 60
  const width = Math.max(80, Math.random() * (120 - difficulty * 8) + 180 - difficulty * 10)
  platforms.push({
    x: lastPlatform.x + lastPlatform.width + gap,
    y: Math.random() * 150 + 400,
    width: width,
    height: 20
  })
}

function generateObstacle() {
  const difficulty = getDifficulty()
  const lastPlatform = platforms[platforms.length - 1]
  const obstacleChance = Math.min(0.25 + difficulty * 0.05, 0.6)
  const minWidth = Math.max(100, 130 - difficulty * 5)
  
  if (Math.random() < obstacleChance && lastPlatform.width > minWidth) {
    obstacles.push({
      x: lastPlatform.x + lastPlatform.width / 2 - 15,
      y: lastPlatform.y - 30,
      width: 30,
      height: 30,
      color: '#4ECDC4'
    })
  }
}

function drawClouds() {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
  clouds.forEach(cloud => {
    ctx.beginPath()
    ctx.arc(cloud.x, cloud.y, cloud.width * 0.3, 0, Math.PI * 2)
    ctx.arc(cloud.x + cloud.width * 0.3, cloud.y - 10, cloud.width * 0.25, 0, Math.PI * 2)
    ctx.arc(cloud.x + cloud.width * 0.5, cloud.y, cloud.width * 0.3, 0, Math.PI * 2)
    ctx.fill()
  })
}

function drawPlayer() {
  ctx.fillStyle = player.color
  ctx.fillRect(player.x, player.y, player.width, player.height)
  
  ctx.fillStyle = 'white'
  ctx.fillRect(player.x + 8, player.y + 10, 10, 10)
  ctx.fillRect(player.x + 22, player.y + 10, 10, 10)
  
  ctx.fillStyle = '#333'
  ctx.fillRect(player.x + 12, player.y + 13, 5, 5)
  ctx.fillRect(player.x + 26, player.y + 13, 5, 5)
}

function drawPlatforms() {
  platforms.forEach(platform => {
    const gradient = ctx.createLinearGradient(platform.x, platform.y, platform.x, platform.y + platform.height)
    gradient.addColorStop(0, '#8B7355')
    gradient.addColorStop(1, '#6B5344')
    ctx.fillStyle = gradient
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height)
    
    ctx.fillStyle = '#4CAF50'
    ctx.fillRect(platform.x, platform.y - 5, platform.width, 8)
  })
}

function drawObstacles() {
  obstacles.forEach(obstacle => {
    ctx.fillStyle = obstacle.color
    ctx.beginPath()
    ctx.moveTo(obstacle.x + obstacle.width / 2, obstacle.y)
    ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height)
    ctx.lineTo(obstacle.x, obstacle.y + obstacle.height)
    ctx.closePath()
    ctx.fill()
  })
}

function updatePlayer() {
  player.velocityY += GRAVITY
  player.y += player.velocityY
  
  let onPlatform = false
  platforms.forEach(platform => {
    if (
      player.x + player.width > platform.x &&
      player.x < platform.x + platform.width &&
      player.y + player.height >= platform.y &&
      player.y + player.height <= platform.y + 20 &&
      player.velocityY >= 0
    ) {
      player.y = platform.y - player.height
      player.velocityY = 0
      player.isJumping = false
      onPlatform = true
    }
  })
  
  if (player.y > canvas.height) {
    gameOver()
  }
}

function checkObstacleCollision() {
  obstacles.forEach(obstacle => {
    if (
      player.x + player.width > obstacle.x + 5 &&
      player.x < obstacle.x + obstacle.width - 5 &&
      player.y + player.height > obstacle.y + 10 &&
      player.y < obstacle.y + obstacle.height
    ) {
      gameOver()
    }
  })
}

function updatePlatforms() {
  platforms.forEach(platform => {
    platform.x -= speed
  })
  
  platforms = platforms.filter(platform => platform.x + platform.width > -100)
  
  if (platforms[platforms.length - 1].x < canvas.width + 200) {
    generatePlatform()
    generateObstacle()
    score += 10
    
    const difficulty = getDifficulty()
    speed = BASE_SPEED + difficulty * 0.4
    
    updateUI()
  }
}

function updateObstacles() {
  obstacles.forEach(obstacle => {
    obstacle.x -= speed
  })
  
  obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > -50)
}

function updateClouds() {
  clouds.forEach(cloud => {
    cloud.x -= cloud.speed
    if (cloud.x + cloud.width < 0) {
      cloud.x = canvas.width + 50
      cloud.y = Math.random() * 200 + 50
    }
  })
}

function updateUI() {
  document.getElementById('score').textContent = score
  document.getElementById('highScore').textContent = highScores[0] || 0
}

function gameOver() {
  gameState = 'gameOver'
  
  saveScore(score)
  
  document.getElementById('finalScore').textContent = score
  updateHighScoresDisplay()
  document.getElementById('game-over-screen').classList.remove('hidden')
}

function updateHighScoresDisplay() {
  const containers = [
    document.getElementById('start-high-scores-list'),
    document.getElementById('gameover-high-scores-list')
  ]
  
  const colors = ['#FFD700', '#C0C0C0', '#CD7F32', '#888888', '#888888']
  
  containers.forEach(container => {
    if (!container) return
    
    if (highScores.length === 0) {
      container.innerHTML = '<p style="color: #888; margin: 10px 0;">暂无记录</p>'
      return
    }
    
    container.innerHTML = highScores.map((s, i) => `
      <div class="score-item" style="color: ${colors[i]}; font-size: ${i < 3 ? '20px' : '18px'}; margin: 8px 0;">
        ${i + 1}. ${s} 分
      </div>
    `).join('')
  })
}

function jump() {
  if (!player.isJumping && gameState === 'playing') {
    player.velocityY = JUMP_FORCE
    player.isJumping = true
  }
}

function startGame() {
  gameState = 'playing'
  score = 0
  speed = BASE_SPEED
  
  player.x = 150
  player.y = 300
  player.velocityY = 0
  player.isJumping = false
  
  obstacles = []
  initClouds()
  initPlatforms()
  updateUI()
  
  document.getElementById('start-screen').classList.add('hidden')
  document.getElementById('game-over-screen').classList.add('hidden')
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
  skyGradient.addColorStop(0, '#87CEEB')
  skyGradient.addColorStop(1, '#E0F6FF')
  ctx.fillStyle = skyGradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  drawClouds()
  drawPlatforms()
  drawObstacles()
  drawPlayer()
  
  if (gameState === 'playing') {
    updateClouds()
    updatePlatforms()
    updateObstacles()
    updatePlayer()
    checkObstacleCollision()
  }
  
  requestAnimationFrame(gameLoop)
}

document.getElementById('startBtn').addEventListener('click', startGame)
document.getElementById('restartBtn').addEventListener('click', startGame)

canvas.addEventListener('click', jump)
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault()
    jump()
  }
})

initClouds()
initPlatforms()
updateUI()
updateHighScoresDisplay()
gameLoop()

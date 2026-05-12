<script>
  import { onMount, onDestroy } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  const animals = [
    { id: 1, emoji: '🐶', name: 'dog' },
    { id: 2, emoji: '🐱', name: 'cat' },
    { id: 3, emoji: '🐭', name: 'mouse' },
    { id: 4, emoji: '🐰', name: 'rabbit' },
    { id: 5, emoji: '🐻', name: 'bear' },
    { id: 6, emoji: '🐼', name: 'panda' },
    { id: 7, emoji: '🐨', name: 'koala' },
    { id: 8, emoji: '🐯', name: 'tiger' },
    { id: 9, emoji: '🦁', name: 'lion' },
    { id: 10, emoji: '🐮', name: 'cow' },
    { id: 11, emoji: '🐷', name: 'pig' },
    { id: 12, emoji: '🐸', name: 'frog' },
    { id: 13, emoji: '🐵', name: 'monkey' },
    { id: 14, emoji: '🐔', name: 'chicken' },
    { id: 15, emoji: '🐧', name: 'penguin' },
    { id: 16, emoji: '🦊', name: 'fox' },
    { id: 17, emoji: '🦋', name: 'butterfly' },
    { id: 18, emoji: '🐝', name: 'bee' },
    { id: 19, emoji: '🦄', name: 'unicorn' },
    { id: 20, emoji: '🐙', name: 'octopus' },
    { id: 21, emoji: '🦀', name: 'crab' },
    { id: 22, emoji: '🐠', name: 'fish' },
    { id: 23, emoji: '🦜', name: 'parrot' },
    { id: 24, emoji: '🦔', name: 'hedgehog' }
  ];

  const levels = [
    { level: 1, pairs: 6, unlocked: true },
    { level: 2, pairs: 8, unlocked: false },
    { level: 3, pairs: 10, unlocked: false },
    { level: 4, pairs: 12, unlocked: false },
    { level: 5, pairs: 15, unlocked: false },
    { level: 6, pairs: 18, unlocked: false },
    { level: 7, pairs: 21, unlocked: false },
    { level: 8, pairs: 24, unlocked: false }
  ];

  let cards = [];
  let flippedCards = [];
  let matchedPairs = 0;
  let moves = 0;
  let score = 0;
  let timer = 0;
  let timerInterval;
  let gameStarted = false;
  let gameWon = false;
  let currentLevel = 1;
  let unlockedLevels = [1];
  let showVictory = false;
  let showHistory = false;
  let showRules = false;
  let gameHistory = [];

  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function initGame() {
    const levelConfig = levels.find(l => l.level === currentLevel);
    const selectedAnimals = animals.slice(0, levelConfig.pairs);
    const cardPairs = [...selectedAnimals, ...selectedAnimals];
    cards = shuffleArray(cardPairs).map((animal, index) => ({
      ...animal,
      cardId: index,
      flipped: false,
      matched: false
    }));
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    score = 0;
    timer = 0;
    gameStarted = false;
    gameWon = false;
    showVictory = false;
    stopTimer();
  }

  function startTimer() {
    if (!gameStarted) {
      gameStarted = true;
      timerInterval = setInterval(() => {
        timer++;
      }, 1000);
    }
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function flipCard(card) {
    if (card.flipped || card.matched || flippedCards.length >= 2) return;
    
    startTimer();
    
    cards = cards.map(c => 
      c.cardId === card.cardId ? { ...c, flipped: true } : c
    );
    flippedCards = [...flippedCards, { ...card, flipped: true }];
    
    if (flippedCards.length === 2) {
      moves++;
      checkMatch();
    }
  }

  function checkMatch() {
    const [first, second] = flippedCards;
    if (first.id === second.id) {
      setTimeout(() => {
        cards = cards.map(c => 
          c.cardId === first.cardId || c.cardId === second.cardId 
            ? { ...c, matched: true } 
            : c
        );
        matchedPairs++;
        score += Math.max(10, 100 - Math.floor(timer / 10) * 10);
        flippedCards = [];
        
        const levelConfig = levels.find(l => l.level === currentLevel);
        if (matchedPairs === levelConfig.pairs) {
          gameWon = true;
          showVictory = true;
          stopTimer();
          saveGameRecord();
          unlockNextLevel();
        }
      }, 500);
    } else {
      setTimeout(() => {
        cards = cards.map(c => 
          c.cardId === first.cardId || c.cardId === second.cardId 
            ? { ...c, flipped: false } 
            : c
        );
        flippedCards = [];
      }, 1000);
    }
  }



  function unlockNextLevel() {
    if (currentLevel < levels.length) {
      const nextLevel = currentLevel + 1;
      if (!unlockedLevels.includes(nextLevel)) {
        unlockedLevels = [...unlockedLevels, nextLevel];
        localStorage.setItem('memoryGameUnlockedLevels', JSON.stringify(unlockedLevels));
      }
    }
  }

  function selectLevel(level) {
    if (unlockedLevels.includes(level)) {
      currentLevel = level;
      initGame();
    }
  }

  function nextLevel() {
    if (currentLevel < levels.length) {
      currentLevel++;
      initGame();
    }
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function getGridCols() {
    const levelConfig = levels.find(l => l.level === currentLevel);
    if (levelConfig.pairs <= 6) return 4;
    if (levelConfig.pairs <= 8) return 4;
    if (levelConfig.pairs <= 10) return 5;
    if (levelConfig.pairs <= 12) return 6;
    if (levelConfig.pairs <= 15) return 6;
    if (levelConfig.pairs <= 18) return 6;
    if (levelConfig.pairs <= 21) return 7;
    return 8;
  }

  function loadHistory() {
    try {
      const saved = localStorage.getItem('memoryGameHistory');
      if (saved) {
        gameHistory = JSON.parse(saved);
      }
      const savedLevels = localStorage.getItem('memoryGameUnlockedLevels');
      if (savedLevels) {
        unlockedLevels = JSON.parse(savedLevels);
      }
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  }

  function saveHistory(record) {
    const newRecord = {
      ...record,
      date: new Date().toLocaleString('zh-CN')
    };
    gameHistory = [...gameHistory, newRecord];
    try {
      localStorage.setItem('memoryGameHistory', JSON.stringify(gameHistory));
      localStorage.setItem('memoryGameUnlockedLevels', JSON.stringify(unlockedLevels));
    } catch (e) {
      console.error('Failed to save history:', e);
    }
  }

  function getBestTime(level) {
    const levelRecords = gameHistory.filter(r => r.level === level);
    if (levelRecords.length === 0) return null;
    return Math.min(...levelRecords.map(r => r.time));
  }

  function getLevelHistory(level) {
    return gameHistory
      .filter(r => r.level === level)
      .sort((a, b) => a.time - b.time);
  }

  function clearHistory() {
    gameHistory = [];
    unlockedLevels = [1];
    localStorage.removeItem('memoryGameHistory');
    localStorage.removeItem('memoryGameUnlockedLevels');
  }

  onMount(() => {
    loadHistory();
    initGame();
  });

  onDestroy(() => {
    stopTimer();
  });
</script>

<div class="game-container">
  <header class="game-header">
    <h1>🦁 动物记忆配对游戏 🐼</h1>
    <div class="stats">
      <div class="stat-item">
        <span class="stat-label">关卡</span>
        <span class="stat-value">{currentLevel}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">时间</span>
        <span class="stat-value">{formatTime(timer)}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">步数</span>
        <span class="stat-value">{moves}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">分数</span>
        <span class="stat-value">{score}</span>
      </div>
    </div>
  </header>

  <div class="level-selector">
    {#each levels as level}
      <button 
        class="level-btn {currentLevel === level.level ? 'active' : ''} {unlockedLevels.includes(level.level) ? '' : 'locked'}"
        on:click={() => selectLevel(level.level)}
        disabled={!unlockedLevels.includes(level.level)}
      >
        {#if unlockedLevels.includes(level.level)}
          {level.level}
        {:else}
          🔒
        {/if}
      </button>
    {/each}
  </div>

  <div class="game-board" style="--grid-cols: {getGridCols()}">
    {#each cards as card (card.cardId)}
      <div 
        class="card {card.flipped || card.matched ? 'flipped' : ''} {card.matched ? 'matched' : ''}"
        on:click={() => flipCard(card)}
      >
        <div class="card-inner">
          <div class="card-front">
          </div>
          <div class="card-back">
            <span class="emoji">{card.emoji}</span>
          </div>
        </div>
      </div>
    {/each}
  </div>

  <div class="action-buttons">
    <button class="action-btn" on:click={initGame}>
      🔄 重新开始
    </button>
    <button class="action-btn" on:click={() => showRules = true}>
      📜 游戏规则
    </button>
    <button class="action-btn" on:click={() => showHistory = true}>
      📊 历史记录
    </button>
  </div>

  {#if showRules}
    <div class="modal-overlay" transition:fade on:click={() => showRules = false}>
      <div class="modal-content" in:fly={{ y: -50, duration: 300 }} on:click|stopPropagation>
        <button class="close-btn" on:click={() => showRules = false}>✕</button>
        <h2>📜 游戏规则</h2>
        <div class="rules-content">
          <div class="rule-item">
            <span class="rule-icon">🎯</span>
            <p><strong>目标：</strong>找出所有配对的动物卡片</p>
          </div>
          <div class="rule-item">
            <span class="rule-icon">👆</span>
            <p><strong>操作：</strong>点击卡片翻转，每次最多翻开2张</p>
          </div>
          <div class="rule-item">
            <span class="rule-icon">✅</span>
            <p><strong>配对：</strong>两张相同的动物会保持翻开状态</p>
          </div>
          <div class="rule-item">
            <span class="rule-icon">❌</span>
            <p><strong>失败：</strong>不匹配的卡片会自动翻回</p>
          </div>
          <div class="rule-item">
            <span class="rule-icon">⏱️</span>
            <p><strong>计时：</strong>翻开第一张卡片开始计时</p>
          </div>
          <div class="rule-item">
            <span class="rule-icon">⭐</span>
            <p><strong>计分：</strong>用时越短得分越高</p>
          </div>
          <div class="rule-item">
            <span class="rule-icon">🔓</span>
            <p><strong>解锁：</strong>完成当前关卡解锁下一关</p>
          </div>
          <div class="rule-item">
            <span class="rule-icon">🏆</span>
            <p><strong>挑战：</strong>共8个关卡，难度递增！</p>
          </div>
        </div>
      </div>
    </div>
  {/if}

  {#if showHistory}
    <div class="modal-overlay" transition:fade on:click={() => showHistory = false}>
      <div class="modal-content history-modal" in:fly={{ y: -50, duration: 300 }} on:click|stopPropagation>
        <button class="close-btn" on:click={() => showHistory = false}>✕</button>
        <h2>📊 历史记录</h2>
        {#if gameHistory.length === 0}
          <p class="no-history">暂无游戏记录，快去挑战吧！</p>
        {:else}
          <div class="history-levels">
            {#each levels as level}
              {@const levelRecords = getLevelHistory(level.level)}
              {@const bestTime = getBestTime(level.level)}
              {#if levelRecords.length > 0}
                <div class="history-level-item">
                  <h3>
                    第 {level.level} 关
                    {#if bestTime}
                      <span class="best-badge">🏆 最佳: {formatTime(bestTime)}</span>
                    {/if}
                  </h3>
                  <div class="history-table">
                    <div class="history-header">
                      <span>排名</span>
                      <span>用时</span>
                      <span>步数</span>
                      <span>得分</span>
                      <span>日期</span>
                    </div>
                    {#each levelRecords.slice(0, 5) as record, index}
                      <div class="history-row {index === 0 ? 'best-row' : ''}">
                        <span>{index === 0 ? '🥇' : index + 1}</span>
                        <span class="{index === 0 ? 'best-time' : ''}">{formatTime(record.time)}</span>
                        <span>{record.moves}</span>
                        <span>{record.score}</span>
                        <span class="date">{record.date}</span>
                      </div>
                    {/each}
                  </div>
                </div>
              {/if}
            {/each}
          </div>
          <button class="clear-history-btn" on:click={() => { clearHistory(); initGame(); }}>
            🗑️ 清空记录
          </button>
        {/if}
      </div>
    </div>
  {/if}

  {#if showVictory}
    <div class="victory-overlay" transition:fade>
      <div class="victory-modal" in:fly={{ y: -50, duration: 500 }}>
        <div class="confetti">
          {#each Array(20) as _, i}
            <div class="confetti-piece" style="--delay: {i * 0.1}s; --color: {['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181'][i % 5]}"></div>
          {/each}
        </div>
        <h2>🎉 恭喜过关！🎉</h2>
        <div class="victory-stats">
          <p>⏱️ 用时: {formatTime(timer)}</p>
          <p>👆 步数: {moves}</p>
          <p>⭐ 得分: {score}</p>
        </div>
        <div class="victory-buttons">
          <button class="victory-btn" on:click={initGame}>🔄 再玩一次</button>
          {#if currentLevel < levels.length}
            <button class="victory-btn next" on:click={nextLevel}>➡️ 下一关</button>
          {/if}
          <button class="victory-btn history" on:click={() => { showVictory = false; showHistory = true; }}>📊 查看记录</button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .game-container {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }

  .game-header {
    text-align: center;
    margin-bottom: 25px;
  }

  .game-header h1 {
    font-size: 2rem;
    color: #4a5568;
    margin-bottom: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .stats {
    display: flex;
    justify-content: center;
    gap: 30px;
    flex-wrap: wrap;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 10px 20px;
    border-radius: 10px;
    color: white;
    min-width: 80px;
  }

  .stat-label {
    font-size: 0.8rem;
    opacity: 0.9;
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .level-selector {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 25px;
  }

  .level-btn {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    border: none;
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
    background: #e2e8f0;
    color: #4a5568;
  }

  .level-btn.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    transform: scale(1.1);
  }

  .level-btn.locked {
    background: #cbd5e0;
    color: #a0aec0;
    cursor: not-allowed;
  }

  .level-btn:not(.locked):hover {
    transform: scale(1.1);
  }

  .game-board {
    display: grid;
    grid-template-columns: repeat(var(--grid-cols), 1fr);
    gap: 12px;
    margin-bottom: 25px;
    perspective: 1000px;
  }

  .card {
    aspect-ratio: 1;
    cursor: pointer;
  }

  .card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;
  }

  .card.flipped .card-inner {
    transform: rotateY(180deg);
  }

  .card.matched .card-inner {
    transform: rotateY(180deg);
  }

  .card.matched .card-back {
    background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
    animation: pulse 0.5s ease;
  }

  @keyframes pulse {
    0%, 100% { transform: rotateY(180deg) scale(1); }
    50% { transform: rotateY(180deg) scale(1.1); }
  }

  .card-front, .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  .card-front {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .card-front::before {
    content: '❓';
    font-size: 2rem;
  }

  .card-back {
    background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
    transform: rotateY(180deg);
  }

  .emoji {
    font-size: clamp(1.2rem, 3vw, 2.5rem);
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 15px;
    flex-wrap: wrap;
    margin-top: 20px;
  }

  .action-btn {
    padding: 10px 20px;
    font-size: 1rem;
    border: none;
    border-radius: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }

  .action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }

  .modal-content {
    background: white;
    padding: 30px;
    border-radius: 20px;
    position: relative;
    max-width: 500px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }

  .history-modal {
    max-width: 700px;
  }

  .close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 30px;
    height: 30px;
    border: none;
    border-radius: 50%;
    background: #e2e8f0;
    cursor: pointer;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
  }

  .close-btn:hover {
    background: #cbd5e0;
    transform: scale(1.1);
  }

  .modal-content h2 {
    text-align: center;
    color: #4a5568;
    margin-bottom: 20px;
    font-size: 1.8rem;
  }

  .rules-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .rule-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 12px;
    background: #f7fafc;
    border-radius: 10px;
  }

  .rule-icon {
    font-size: 1.5rem;
  }

  .rule-item p {
    margin: 0;
    color: #2d3748;
  }

  .no-history {
    text-align: center;
    color: #718096;
    font-size: 1.1rem;
    padding: 30px;
  }

  .history-levels {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .history-level-item h3 {
    display: flex;
    align-items: center;
    gap: 15px;
    margin: 0 0 10px 0;
    color: #4a5568;
    font-size: 1.2rem;
  }

  .best-badge {
    font-size: 0.9rem;
    background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
    padding: 4px 12px;
    border-radius: 12px;
    color: white;
    font-weight: bold;
  }

  .history-table {
    border-radius: 10px;
    overflow: hidden;
  }

  .history-header {
    display: grid;
    grid-template-columns: 60px 80px 60px 60px 1fr;
    gap: 10px;
    padding: 12px 15px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-weight: bold;
    font-size: 0.9rem;
  }

  .history-row {
    display: grid;
    grid-template-columns: 60px 80px 60px 60px 1fr;
    gap: 10px;
    padding: 10px 15px;
    background: #f7fafc;
    border-bottom: 1px solid #e2e8f0;
    align-items: center;
    font-size: 0.9rem;
  }

  .history-row:last-child {
    border-bottom: none;
  }

  .best-row {
    background: linear-gradient(135deg, rgba(246, 211, 101, 0.2) 0%, rgba(253, 160, 133, 0.2) 100%);
  }

  .best-time {
    color: #e53e3e;
    font-weight: bold;
  }

  .date {
    font-size: 0.8rem;
    color: #718096;
  }

  .clear-history-btn {
    display: block;
    margin: 20px auto 0;
    padding: 10px 25px;
    border: 2px solid #e53e3e;
    border-radius: 20px;
    background: white;
    color: #e53e3e;
    cursor: pointer;
    font-size: 0.95rem;
    transition: all 0.3s;
  }

  .clear-history-btn:hover {
    background: #e53e3e;
    color: white;
  }

  .victory-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .victory-modal {
    background: white;
    padding: 40px;
    border-radius: 20px;
    text-align: center;
    position: relative;
    max-width: 400px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }

  .victory-modal h2 {
    font-size: 2rem;
    color: #4a5568;
    margin-bottom: 20px;
  }

  .victory-stats {
    margin-bottom: 25px;
  }

  .victory-stats p {
    font-size: 1.2rem;
    margin: 10px 0;
    color: #2d3748;
  }

  .victory-buttons {
    display: flex;
    gap: 15px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .victory-btn {
    padding: 12px 25px;
    font-size: 1rem;
    border: none;
    border-radius: 25px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    cursor: pointer;
    transition: all 0.3s;
  }

  .victory-btn.next {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  }

  .victory-btn.history {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .victory-btn:hover {
    transform: scale(1.05);
  }

  .confetti {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
  }

  .confetti-piece {
    position: absolute;
    width: 10px;
    height: 10px;
    background: var(--color);
    top: -10px;
    animation: confetti-fall 3s ease-out var(--delay) infinite;
  }

  @keyframes confetti-fall {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(400px) rotate(720deg);
      opacity: 0;
    }
  }

  .fade {
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @media (max-width: 600px) {
    .game-container {
      padding: 20px;
    }

    .game-header h1 {
      font-size: 1.5rem;
    }

    .stats {
      gap: 15px;
    }

    .stat-item {
      padding: 8px 15px;
      min-width: 60px;
    }

    .stat-value {
      font-size: 1.2rem;
    }

    .emoji {
      font-size: 1.8rem;
    }

    .game-board {
      gap: 8px;
    }

    .action-buttons {
      gap: 10px;
    }

    .action-btn {
      padding: 8px 15px;
      font-size: 0.9rem;
    }

    .modal-content {
      padding: 20px;
    }

    .history-header,
    .history-row {
      grid-template-columns: 40px 70px 50px 50px 1fr;
      gap: 5px;
      padding: 8px 10px;
      font-size: 0.8rem;
    }

    .history-level-item h3 {
      flex-direction: column;
      align-items: flex-start;
      gap: 5px;
    }
  }
</style>

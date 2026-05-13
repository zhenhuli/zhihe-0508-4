<script>
  import { flashCards } from './stores/flashCards.js';
  import FlashCard from './components/FlashCard.svelte';

  let currentCard = null;
  let isFlipped = false;
  let showAddModal = false;
  let showManageModal = false;
  let editingCard = null;
  let newFront = '';
  let newBack = '';

  const masteryLabels = ['未掌握', '学习中', '已掌握'];
  const masteryColors = ['#ef4444', '#f59e0b', '#22c55e'];

  function getRandomCard() {
    currentCard = $flashCards.length > 0
      ? $flashCards[Math.floor(Math.random() * $flashCards.length)]
      : null;
    isFlipped = false;
  }

  function flipCard() {
    isFlipped = !isFlipped;
  }

  function setMastery(mastery) {
    if (currentCard) {
      flashCards.setMastery(currentCard.id, mastery);
      currentCard.mastery = mastery;
    }
  }

  function openAddModal() {
    editingCard = null;
    newFront = '';
    newBack = '';
    showAddModal = true;
  }

  function openEditModal(card) {
    editingCard = card;
    newFront = card.front;
    newBack = card.back;
    showAddModal = true;
  }

  function saveCard() {
    if (!newFront.trim() || !newBack.trim()) return;
    
    if (editingCard) {
      flashCards.updateCard(editingCard.id, newFront.trim(), newBack.trim());
    } else {
      flashCards.addCard(newFront.trim(), newBack.trim());
    }
    showAddModal = false;
  }

  function deleteCard(id) {
    flashCards.deleteCard(id);
    if (currentCard?.id === id) {
      getRandomCard();
    }
  }

  $: if ($flashCards.length > 0 && !currentCard) {
    getRandomCard();
  }

  function getStats() {
    const total = $flashCards.length;
    const notMastered = $flashCards.filter(c => c.mastery === 0).length;
    const learning = $flashCards.filter(c => c.mastery === 1).length;
    const mastered = $flashCards.filter(c => c.mastery === 2).length;
    return { total, notMastered, learning, mastered };
  }
</script>

<div class="app">
  <header class="header">
    <h1>📚 学习闪卡记忆工具</h1>
    <div class="stats">
      <span class="stat-item">总计: {$flashCards.length}</span>
      <span class="stat-item" style="color: {masteryColors[0]}">未掌握: {getStats().notMastered}</span>
      <span class="stat-item" style="color: {masteryColors[1]}">学习中: {getStats().learning}</span>
      <span class="stat-item" style="color: {masteryColors[2]}">已掌握: {getStats().mastered}</span>
    </div>
  </header>

  <main class="main">
    {#if $flashCards.length === 0}
      <div class="empty-state">
        <div class="empty-icon">📝</div>
        <h2>还没有闪卡</h2>
        <p>点击下方按钮添加你的第一张学习闪卡吧！</p>
        <button class="btn btn-primary" on:click={openAddModal}>
          + 添加闪卡
        </button>
      </div>
    {:else if currentCard}
      <div class="study-area">
        <div class="card-wrapper">
          <FlashCard {currentCard} {isFlipped} onFlip={flipCard} />
        </div>
        
        <p class="hint">点击卡片翻转查看答案</p>
        
        {#if isFlipped}
          <div class="mastery-buttons">
            <p>你掌握这张卡片了吗？</p>
            <div class="button-group">
              <button 
                class="btn btn-mastery" 
                style="background-color: {masteryColors[0]}"
                on:click={() => setMastery(0)}
              >
                {masteryLabels[0]}
              </button>
              <button 
                class="btn btn-mastery" 
                style="background-color: {masteryColors[1]}"
                on:click={() => setMastery(1)}
              >
                {masteryLabels[1]}
              </button>
              <button 
                class="btn btn-mastery" 
                style="background-color: {masteryColors[2]}"
                on:click={() => setMastery(2)}
              >
                {masteryLabels[2]}
              </button>
            </div>
          </div>
        {/if}
        
        <div class="action-buttons">
          <button class="btn btn-secondary" on:click={getRandomCard}>
            🎲 随机抽卡
          </button>
          <button class="btn btn-primary" on:click={openAddModal}>
            + 添加闪卡
          </button>
          <button class="btn btn-secondary" on:click={() => showManageModal = true}>
            📋 管理闪卡
          </button>
        </div>
      </div>
    {/if}
  </main>

  {#if showAddModal}
    <div class="modal-overlay" on:click={() => showAddModal = false}>
      <div class="modal" on:click|stopPropagation>
        <h2>{editingCard ? '编辑闪卡' : '添加闪卡'}</h2>
        <div class="form-group">
          <label>正面（问题）</label>
          <textarea 
            bind:value={newFront} 
            placeholder="输入问题或概念"
            rows="3"
          />
        </div>
        <div class="form-group">
          <label>背面（答案）</label>
          <textarea 
            bind:value={newBack} 
            placeholder="输入答案或解释"
            rows="3"
          />
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" on:click={() => showAddModal = false}>
            取消
          </button>
          <button class="btn btn-primary" on:click={saveCard}>
            {editingCard ? '保存' : '添加'}
          </button>
        </div>
      </div>
    </div>
  {/if}

  {#if showManageModal}
    <div class="modal-overlay" on:click={() => showManageModal = false}>
      <div class="modal modal-large" on:click|stopPropagation>
        <h2>管理闪卡</h2>
        <div class="card-list">
          {#each $flashCards as card (card.id)}
            <div class="card-item">
              <div class="card-item-content">
                <div class="card-item-front">{card.front}</div>
                <div class="card-item-back">{card.back}</div>
              </div>
              <div class="card-item-actions">
                <span class="mastery-tag" style="background-color: {masteryColors[card.mastery]}">
                  {masteryLabels[card.mastery]}
                </span>
                <button class="btn-icon" on:click={() => openEditModal(card)}>
                  ✏️
                </button>
                <button class="btn-icon" on:click={() => deleteCard(card.id)}>
                  🗑️
                </button>
              </div>
            </div>
          {/each}
        </div>
        <div class="modal-actions">
          <button class="btn btn-primary" on:click={() => showManageModal = false}>
            关闭
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .app {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem;
  }

  .header {
    text-align: center;
    color: white;
    margin-bottom: 2rem;
  }

  .header h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .stats {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .stat-item {
    background: rgba(255, 255, 255, 0.2);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: 600;
    color: white;
  }

  .main {
    max-width: 800px;
    margin: 0 auto;
  }

  .empty-state {
    background: white;
    border-radius: 20px;
    padding: 3rem 2rem;
    text-align: center;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .empty-state h2 {
    color: #333;
    margin-bottom: 0.5rem;
  }

  .empty-state p {
    color: #666;
    margin-bottom: 1.5rem;
  }

  .study-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .card-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .hint {
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.9rem;
  }

  .mastery-buttons {
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    text-align: center;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  }

  .mastery-buttons p {
    color: #333;
    margin-bottom: 1rem;
    font-weight: 600;
  }

  .button-group {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .action-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  }

  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .btn-secondary {
    background: white;
    color: #333;
  }

  .btn-mastery {
    color: white;
    flex: 1;
    min-width: 100px;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .modal {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    width: 100%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-large {
    max-width: 700px;
  }

  .modal h2 {
    color: #333;
    margin-bottom: 1.5rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group label {
    display: block;
    color: #555;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  .form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    font-size: 1rem;
    font-family: inherit;
    resize: vertical;
  }

  .form-group textarea:focus {
    outline: none;
    border-color: #667eea;
  }

  .modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1.5rem;
  }

  .card-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-height: 60vh;
    overflow-y: auto;
  }

  .card-item {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .card-item-content {
    flex: 1;
  }

  .card-item-front {
    color: #333;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .card-item-back {
    color: #666;
    font-size: 0.9rem;
  }

  .card-item-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .mastery-tag {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    color: white;
  }

  .btn-icon {
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 8px;
    transition: background 0.2s;
  }

  .btn-icon:hover {
    background: rgba(0, 0, 0, 0.1);
  }
</style>

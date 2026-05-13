<script>
  export let card;
  export let onFlip;
  export let isFlipped = false;

  const masteryLabels = ['未掌握', '学习中', '已掌握'];
  const masteryColors = ['#ef4444', '#f59e0b', '#22c55e'];

  function handleClick() {
    if (onFlip) {
      onFlip();
    }
  }
</script>

<div class="flash-card-container" on:click={handleClick}>
  <div class="flash-card" class:flipped={isFlipped}>
    <div class="card-face card-front">
      <div class="card-content">
        {card?.front}
      </div>
      {#if card?.mastery !== undefined}
        <div class="mastery-badge" style="background-color: {masteryColors[card.mastery]}">
          {masteryLabels[card.mastery]}
        </div>
      {/if}
    </div>
    <div class="card-face card-back">
      <div class="card-content">
        {card?.back}
      </div>
    </div>
  </div>
</div>

<style>
  .flash-card-container {
    perspective: 1000px;
    width: 100%;
    max-width: 500px;
    height: 300px;
    cursor: pointer;
  }

  .flash-card {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;
  }

  .flash-card.flipped {
    transform: rotateY(180deg);
  }

  .card-face {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  }

  .card-front {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .card-back {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
    transform: rotateY(180deg);
  }

  .card-content {
    font-size: 1.25rem;
    text-align: center;
    word-wrap: break-word;
    line-height: 1.6;
  }

  .mastery-badge {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    color: white;
  }
</style>

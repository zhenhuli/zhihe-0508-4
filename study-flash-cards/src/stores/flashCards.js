import { writable } from 'svelte/store';

const STORAGE_KEY = 'study-flash-cards';

function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

function saveToStorage(cards) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch (e) {
    console.error('Failed to save cards:', e);
  }
}

function createFlashCardsStore() {
  const { subscribe, set, update } = writable(loadFromStorage());

  subscribe((cards) => {
    saveToStorage(cards);
  });

  return {
    subscribe,
    addCard: (front, back) => {
      update((cards) => [
        ...cards,
        {
          id: Date.now(),
          front,
          back,
          mastery: 0,
          createdAt: new Date().toISOString(),
        },
      ]);
    },
    updateCard: (id, front, back) => {
      update((cards) =>
        cards.map((card) =>
          card.id === id ? { ...card, front, back, updatedAt: new Date().toISOString() } : card
        )
      );
    },
    deleteCard: (id) => {
      update((cards) => cards.filter((card) => card.id !== id));
    },
    setMastery: (id, mastery) => {
      update((cards) =>
        cards.map((card) =>
          card.id === id ? { ...card, mastery, lastReviewed: new Date().toISOString() } : card
        )
      );
    },
    getRandomCard: (cards) => {
      if (cards.length === 0) return null;
      return cards[Math.floor(Math.random() * cards.length)];
    },
    getCardsByMastery: (cards, masteryLevel) => {
      return cards.filter((card) => card.mastery === masteryLevel);
    },
  };
}

export const flashCards = createFlashCardsStore();

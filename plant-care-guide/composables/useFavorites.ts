export const useFavorites = () => {
  const favorites = useState<number[]>('favorites', () => {
    if (process.client) {
      const stored = localStorage.getItem('plant-favorites')
      return stored ? JSON.parse(stored) : []
    }
    return []
  })

  const isFavorite = (plantId: number) => {
    return favorites.value.includes(plantId)
  }

  const toggleFavorite = (plantId: number) => {
    const index = favorites.value.indexOf(plantId)
    if (index > -1) {
      favorites.value.splice(index, 1)
    } else {
      favorites.value.push(plantId)
    }
    if (process.client) {
      localStorage.setItem('plant-favorites', JSON.stringify(favorites.value))
    }
  }

  return {
    favorites,
    isFavorite,
    toggleFavorite
  }
}

export interface Plant {
  id: number
  name: string
  scientificName: string
  image: string
  description: string
  light: {
    level: string
    description: string
    icon: string
  }
  water: {
    frequency: string
    description: string
    icon: string
  }
  temperature: {
    min: number
    max: number
    description: string
    icon: string
  }
  difficulty: 'easy' | 'medium' | 'hard'
  tips: string[]
}

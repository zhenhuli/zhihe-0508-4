export interface KeyPoint {
  text: string
  image: string
}

export interface YogaPose {
  id: string
  name: string
  sanskritName?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  targetAreas: string[]
  description: string
  keyPoints: KeyPoint[]
  breathing: string
  duration: string
  image: string
}

export interface TrainingRecord {
  id: string
  poseId: string
  poseName: string
  date: string
  duration: number
  notes?: string
}

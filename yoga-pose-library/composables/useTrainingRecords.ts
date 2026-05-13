import type { TrainingRecord } from '~/types'

export const useTrainingRecords = () => {
  const records = useState<TrainingRecord[]>('training-records', () => [])

  if (process.client) {
    const stored = localStorage.getItem('yoga-training-records')
    if (stored) {
      records.value = JSON.parse(stored)
    }
  }

  watch(records, (newRecords) => {
    if (process.client) {
      localStorage.setItem('yoga-training-records', JSON.stringify(newRecords))
    }
  }, { deep: true })

  const addRecord = (poseId: string, poseName: string, duration: number, notes?: string) => {
    const newRecord: TrainingRecord = {
      id: Date.now().toString(),
      poseId,
      poseName,
      date: new Date().toISOString().split('T')[0],
      duration,
      notes
    }
    records.value.unshift(newRecord)
  }

  const deleteRecord = (id: string) => {
    records.value = records.value.filter(r => r.id !== id)
  }

  const getRecordsByPose = (poseId: string) => {
    return records.value.filter(r => r.poseId === poseId)
  }

  const getTotalDuration = () => {
    return records.value.reduce((sum, r) => sum + r.duration, 0)
  }

  return {
    records,
    addRecord,
    deleteRecord,
    getRecordsByPose,
    getTotalDuration
  }
}

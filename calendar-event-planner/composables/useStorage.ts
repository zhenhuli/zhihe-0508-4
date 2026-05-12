import type { CalendarEvent } from '~/types'

const STORAGE_KEY = 'calendar-events'

export function useStorage() {
  const events = useState<CalendarEvent[]>('events', () => [])

  const saveEvents = () => {
    if (process.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events.value))
    }
  }

  if (process.client) {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      events.value = parsed.map((e: any) => ({
        id: e.id,
        title: e.title,
        description: e.description || '',
        startDate: e.startDate || e.date,
        startTime: e.startTime || e.time || '09:00',
        endDate: e.endDate || e.date,
        endTime: e.endTime || e.time || '10:00',
        color: e.color
      }))
      saveEvents()
    }
  }

  const addEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now().toString()
    }
    events.value.push(newEvent)
    saveEvents()
    return newEvent
  }

  const updateEvent = (id: string, event: Partial<CalendarEvent>) => {
    const index = events.value.findIndex(e => e.id === id)
    if (index !== -1) {
      events.value[index] = { ...events.value[index], ...event }
      saveEvents()
    }
  }

  const deleteEvent = (id: string) => {
    events.value = events.value.filter(e => e.id !== id)
    saveEvents()
  }

  const getEventsByDate = (date: string) => {
    return events.value.filter(e => {
      return e.startDate <= date && e.endDate >= date
    })
  }

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsByDate
  }
}

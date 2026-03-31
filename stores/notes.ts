import { defineStore } from 'pinia'
import type { INote, ITodoItem } from '~/types/notes.types'

const STORAGE_KEY = 'notes-app-data'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

function loadFromStorage(): INote[] {
  if (typeof window === 'undefined') return []

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  }
  catch {
    return []
  }
}

function saveToStorage(notes: INote[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: [] as INote[],
    initialized: false,
  }),

  getters: {
    getNoteById: (state) => {
      return (id: string): INote | undefined => state.notes.find(n => n.id === id)
    },
  },

  actions: {
    init() {
      if (this.initialized) return
      this.notes = loadFromStorage()
      this.initialized = true
    },

    persist() {
      saveToStorage(this.notes)
    },

    addNote(title: string, todos: ITodoItem[]): string {
      const id = generateId()

      this.notes.unshift({
        id,
        title,
        todos,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })

      this.persist()
      return id
    },

    updateNote(id: string, data: { title: string; todos: ITodoItem[] }) {
      const note = this.notes.find(n => n.id === id)
      if (!note) return

      note.title = data.title
      note.todos = data.todos
      note.updatedAt = Date.now()
      this.persist()
    },

    deleteNote(id: string) {
      const index = this.notes.findIndex(n => n.id === id)

      if (index !== -1) {
        this.notes.splice(index, 1)
        this.persist()
      }
    },
  },
})

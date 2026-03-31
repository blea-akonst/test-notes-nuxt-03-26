import { computed, ref } from 'vue'

export function useUndoRedo<T>() {
  const undoStack = ref<string[]>([])
  const redoStack = ref<string[]>([])

  function pushState(state: T): void {
    undoStack.value.push(JSON.stringify(state))
    redoStack.value = []
  }

  function undo(currentState: T): T | null {
    if (!undoStack.value.length) return null

    redoStack.value.push(JSON.stringify(currentState))
    const previous = undoStack.value.pop()!

    return JSON.parse(previous)
  }

  function redo(currentState: T): T | null {
    if (!redoStack.value.length) return null

    undoStack.value.push(JSON.stringify(currentState))
    const next = redoStack.value.pop()!

    return JSON.parse(next)
  }

  function reset(): void {
    undoStack.value = []
    redoStack.value = []
  }

  const canUndo = computed<boolean>(() => undoStack.value.length > 0)
  const canRedo = computed<boolean>(() => redoStack.value.length > 0)

  return {
    pushState,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
  }
}

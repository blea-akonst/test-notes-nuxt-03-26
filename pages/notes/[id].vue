<script lang="ts" setup>
import type { ITodoItem } from '~/types/notes.types'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const notesStore = useNotesStore()

notesStore.init()

const isNew = computed<boolean>(() => route.params.id === 'new')
const noteId = computed<string>(() => route.params.id as string)

// Local editing state
const title = ref('')
const todos = ref<ITodoItem[]>([])

// Modals
const showDeleteModal = ref(false)
const showCancelModal = ref(false)

// Undo/redo
interface NoteSnapshot {
  title: string
  todos: ITodoItem[]
}

const { pushState, undo, redo, canUndo, canRedo } = useUndoRedo<NoteSnapshot>()

// Initialize from store
if (!isNew.value) {
  const note = notesStore.getNoteById(noteId.value)

  if (!note) {
    router.replace('/')
  }
  else {
    title.value = note.title
    todos.value = JSON.parse(JSON.stringify(note.todos))
  }
}

// Helpers
function generateTodoId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

function getSnapshot(): NoteSnapshot {
  return {
    title: title.value,
    todos: JSON.parse(JSON.stringify(todos.value)),
  }
}

function applySnapshot(snapshot: NoteSnapshot): void {
  title.value = snapshot.title
  todos.value = snapshot.todos
}

let lastCaptured = ''

function captureState(): void {
  const snapshot = getSnapshot()
  const serialized = JSON.stringify(snapshot)

  if (serialized !== lastCaptured) {
    pushState(snapshot)
    lastCaptured = serialized
  }
}

// Todo actions
function addTodo(): void {
  captureState()
  todos.value.push({ id: generateTodoId(), text: '', completed: false })
}

function deleteTodo(index: number): void {
  captureState()
  todos.value.splice(index, 1)
}

function updateTodoText(index: number, text: string): void {
  todos.value[index].text = text
}

function toggleTodo(index: number): void {
  captureState()
  todos.value[index].completed = !todos.value[index].completed
}

function handleUndo(): void {
  const snapshot = undo(getSnapshot())
  if (snapshot) {
    applySnapshot(snapshot)
    lastCaptured = JSON.stringify(snapshot)
  }
}

function handleRedo(): void {
  const snapshot = redo(getSnapshot())
  if (snapshot) {
    applySnapshot(snapshot)
    lastCaptured = JSON.stringify(snapshot)
  }
}

// Keyboard shortcuts
function onKeydown(e: KeyboardEvent): void {
  if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
    e.preventDefault()
    if (e.shiftKey) handleRedo()
    else handleUndo()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

// Save
function save(): void {
  if (!title.value.trim()) return

  if (isNew.value) {
    notesStore.addNote(title.value.trim(), todos.value)
  }
  else {
    notesStore.updateNote(noteId.value, { title: title.value.trim(), todos: todos.value })
  }

  router.push('/')
}

// Cancel
function requestCancel(): void {
  if (hasChanges.value) showCancelModal.value = true
  else router.push('/')
}

function confirmCancel(): void {
  showCancelModal.value = false
  router.push('/')
}

// Delete
function requestDelete(): void {
  showDeleteModal.value = true
}

function confirmDelete(): void {
  if (!isNew.value) notesStore.deleteNote(noteId.value)
  showDeleteModal.value = false
  router.push('/')
}

const hasChanges = computed<boolean>(() => {
  if (isNew.value) return title.value.trim() !== '' || todos.value.length > 0
  const original = notesStore.getNoteById(noteId.value)
  if (!original) return false
  return original.title !== title.value || JSON.stringify(original.todos) !== JSON.stringify(todos.value)
})
</script>

<template>
  <div :class="$style.page">
    <div :class="$style.toolbar">
      <button :class="$style.backBtn" @click="requestCancel">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        {{ t('notes.back') }}
      </button>

      <div :class="$style.toolbarActions">
        <UiButton
          severity="secondary"
          text
          rounded
          size="small"
          :disabled="!canUndo"
          :title="t('actions.undo')"
          @click="handleUndo"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 14l-4-4 4-4" /><path d="M5 10h11a4 4 0 010 8h-1" />
          </svg>
        </UiButton>

        <UiButton
          severity="secondary"
          text
          rounded
          size="small"
          :disabled="!canRedo"
          :title="t('actions.redo')"
          :class="$style.redoBtn"
          @click="handleRedo"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 14l4-4-4-4" /><path d="M19 10H8a4 4 0 000 8h1" />
          </svg>
        </UiButton>

        <UiButton
          v-if="!isNew"
          :label="t('notes.delete')"
          severity="danger"
          outlined
          size="small"
          @click="requestDelete"
        />

        <UiButton
          :label="t('notes.save')"
          size="small"
          :disabled="!title.trim()"
          @click="save"
        />
      </div>
    </div>

    <div :class="$style.editor">
      <div :class="$style.titleSection">
        <input
          v-model="title"
          :class="$style.titleInput"
          type="text"
          :placeholder="t('notes.titlePlaceholder')"
          @focus="captureState"
        >
      </div>

      <div :class="$style.todosSection">
        <div :class="$style.todosHeader">
          <h3 :class="$style.todosTitle">
            {{ t('notes.todosTitle') }}
          </h3>
          <UiButton :label="'+ ' + t('notes.addTodo')" severity="secondary" size="small" @click="addTodo" />
        </div>

        <div v-if="todos.length" :class="$style.todosList">
          <TodoItem
            v-for="(todo, index) in todos"
            :key="todo.id"
            :todo="todo"
            @update:text="updateTodoText(index, $event)"
            @update:completed="toggleTodo(index)"
            @delete="deleteTodo(index)"
            @focus="captureState"
          />
        </div>

        <div v-else :class="$style.todosEmpty">
          {{ t('notes.todosEmptyHint') }}
        </div>
      </div>
    </div>

    <UiModal v-model:visible="showCancelModal" :header="t('modals.cancelTitle')">
      <p>{{ t('modals.cancelText') }}</p>
      <template #footer>
        <UiButton :label="t('modals.stay')" severity="secondary" text @click="showCancelModal = false" />
        <UiButton :label="t('modals.leave')" severity="danger" @click="confirmCancel" />
      </template>
    </UiModal>

    <UiModal v-model:visible="showDeleteModal" :header="t('modals.deleteTitle')">
      <p>{{ t('modals.deleteText') }}</p>
      <template #footer>
        <UiButton :label="t('modals.cancel')" severity="secondary" text @click="showDeleteModal = false" />
        <UiButton :label="t('modals.confirmDelete')" severity="danger" @click="confirmDelete" />
      </template>
    </UiModal>
  </div>
</template>

<style lang="scss" module>
.page {
  max-width: 720px;
  margin: 0 auto;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 24px;

  @include media($breakpoint-exsm) {
    flex-wrap: wrap;
  }
}

.backBtn {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  color: var(--app-text-muted);
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 0;
  transition: color 0.15s;

  @include hover {
    color: var(--app-text);
  }
}

.toolbarActions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.editor {
  background: var(--app-surface);
  border-radius: var(--app-border-radius);
  border: 1px solid var(--app-border);
  overflow: hidden;
}

.titleSection {
  padding: 24px 24px 0;

  @include media($breakpoint-small) {
    padding: 20px 16px 0;
  }
}

.titleInput {
  width: 100%;
  border: none;
  outline: none;
  font-size: 24px;
  font-weight: 700;
  font-family: inherit;
  color: var(--app-text);
  background: transparent;
  padding: 0;

  &::placeholder {
    color: var(--app-text-muted);
    opacity: 0.6;
  }

  @include media($breakpoint-small) {
    font-size: 20px;
  }
}

.todosSection {
  padding: 24px;

  @include media($breakpoint-small) {
    padding: 20px 16px;
  }
}

.todosHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.todosTitle {
  font-size: 16px;
  font-weight: 600;
  color: var(--app-text-muted);
}

.todosList {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.todosEmpty {
  text-align: center;
  padding: 32px 20px;
  font-size: 14px;
  color: var(--app-text-muted);
  border: 2px dashed var(--app-border);
  border-radius: var(--app-border-radius);
}
</style>

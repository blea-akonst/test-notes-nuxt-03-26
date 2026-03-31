<script lang="ts" setup>
const { t } = useI18n()
const router = useRouter()
const notesStore = useNotesStore()

notesStore.init()

const showDeleteModal = ref(false)
const noteToDelete = ref<string | null>(null)

function createNote() {
  router.push('/notes/new')
}

function editNote(id: string) {
  router.push(`/notes/${id}`)
}

function requestDelete(id: string) {
  noteToDelete.value = id
  showDeleteModal.value = true
}

function confirmDelete() {
  if (noteToDelete.value) {
    notesStore.deleteNote(noteToDelete.value)
  }

  noteToDelete.value = null
  showDeleteModal.value = false
}
</script>

<template>
  <div :class="$style.page">
    <div :class="$style.header">
      <h1 class="h1">
        {{ t('notes.title') }}
      </h1>

      <UiButton :label="'+ ' + t('notes.create')" @click="createNote" />
    </div>

    <div v-if="notesStore.notes.length" :class="$style.grid">
      <NoteCard
        v-for="note in notesStore.notes"
        :key="note.id"
        :note="note"
        @edit="editNote(note.id)"
        @delete="requestDelete(note.id)"
      />
    </div>

    <div v-else :class="$style.empty">
      <svg :class="$style.emptyIcon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>

      <p :class="$style.emptyTitle">
        {{ t('notes.emptyTitle') }}
      </p>

      <p :class="$style.emptyText">
        {{ t('notes.emptyText') }}
      </p>

      <UiButton :label="'+ ' + t('notes.createFirst')" size="large" @click="createNote" />
    </div>

    <UiModal
      v-model:visible="showDeleteModal"
      :header="t('modals.deleteTitle')"
    >
      <p>{{ t('modals.deleteText') }}</p>

      <template #footer>
        <UiButton :label="t('modals.cancel')" severity="secondary" text @click="showDeleteModal = false" />
        <UiButton :label="t('modals.confirmDelete')" severity="danger" @click="confirmDelete" />
      </template>
    </UiModal>
  </div>
</template>

<style lang="scss" module>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;

  @include media($breakpoint-exsm) {
    flex-direction: column;
    align-items: stretch;
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @include media($breakpoint-large) {
    grid-template-columns: repeat(2, 1fr);
  }

  @include media($breakpoint-small) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 20px;
}

.emptyIcon {
  color: var(--app-text-muted);
  opacity: 0.3;
  margin-bottom: 20px;
}

.emptyTitle {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.emptyText {
  font-size: 15px;
  color: var(--app-text-muted);
  margin-bottom: 24px;
}
</style>

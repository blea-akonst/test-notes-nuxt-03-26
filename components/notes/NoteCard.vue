<script lang="ts" setup>
import type { PropType } from 'vue'
import type { INote, ITodoItem } from '~/types/notes.types'

const { t } = useI18n()

const props = defineProps({
  note: {
    type: Object as PropType<INote>,
    required: true,
  },
})

const emit = defineEmits<{
  edit: []
  delete: []
}>()

const MAX_VISIBLE_TODOS = 3

const visibleTodos = computed<ITodoItem[]>(() => props.note.todos.slice(0, MAX_VISIBLE_TODOS))
const remainingCount = computed<number>(() => Math.max(0, props.note.todos.length - MAX_VISIBLE_TODOS))
</script>

<template>
  <div :class="$style.card">
    <div :class="$style.header">
      <h2 :class="$style.title">
        {{ note.title || t('notes.untitled') }}
      </h2>

      <div :class="$style.actions">
        <UiButton severity="secondary" text rounded size="small" :aria-label="t('notes.edit')" @click="emit('edit')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 3a2.85 2.85 0 114 4L7.5 20.5 2 22l1.5-5.5Z" />
          </svg>
        </UiButton>
        <UiButton severity="danger" text rounded size="small" :aria-label="t('notes.delete')" @click="emit('delete')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M19 6v14a1 1 0 01-1 1H6a1 1 0 01-1-1V6M10 11v6M14 11v6" />
          </svg>
        </UiButton>
      </div>
    </div>

    <div v-if="note.todos.length" :class="$style.todos">
      <div
        v-for="todo in visibleTodos"
        :key="todo.id"
        :class="[$style.todoItem, { [$style._completed]: todo.completed }]"
      >
        <UiCheckbox :model-value="todo.completed" disabled :aria-label="todo.text || t('notes.emptyTodo')" />
        <span :class="$style.todoText">{{ todo.text || t('notes.emptyTodo') }}</span>
      </div>

      <div v-if="remainingCount > 0" :class="$style.more">
        {{ t('notes.moreItems', { count: remainingCount }) }}
      </div>
    </div>

    <div v-else :class="$style.empty">
      {{ t('notes.noTodos') }}
    </div>
  </div>
</template>

<style lang="scss" module>
.card {
  background: var(--app-surface);
  border-radius: var(--app-border-radius);
  padding: 20px;
  border: 1px solid var(--app-border);
  transition: box-shadow 0.2s;

  @include hover {
    box-shadow: var(--app-shadow);
  }
}

.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.title {
  font-size: 17px;
  font-weight: 600;
  line-height: 1.35;
  overflow-wrap: break-word;
}

.actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.todos {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.todoItem {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  line-height: 1.4;

  &._completed {
    .todoText {
      text-decoration: line-through;
      color: var(--app-text-muted);
    }
  }
}

.todoText {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.more {
  font-size: 13px;
  color: var(--app-text-muted);
  padding-left: 30px;
}

.empty {
  font-size: 14px;
  color: var(--app-text-muted);
}
</style>

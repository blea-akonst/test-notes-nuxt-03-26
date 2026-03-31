<script lang="ts" setup>
import type { PropType } from 'vue'
import type { ITodoItem } from '~/types/notes.types'

const { t } = useI18n()

defineProps({
  todo: {
    type: Object as PropType<ITodoItem>,
    required: true,
  },
})

const emit = defineEmits<{
  'update:text': [value: string]
  'update:completed': [value: boolean]
  'delete': []
  'focus': []
}>()
</script>

<template>
  <div :class="[$style.item, { [$style._completed]: todo.completed }]">
    <UiCheckbox
      :model-value="todo.completed"
      @update:model-value="emit('update:completed', $event)"
    />

    <input
      :class="$style.input"
      :value="todo.text"
      :placeholder="t('notes.todoPlaceholder')"
      @focus="emit('focus')"
      @input="emit('update:text', ($event.target as HTMLInputElement).value)"
    >

    <UiButton severity="danger" text rounded size="small" :class="$style.deleteBtn" @click="emit('delete')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </UiButton>
  </div>
</template>

<style lang="scss" module>
.item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: var(--app-border-radius);
  transition: border-color 0.15s, box-shadow 0.15s;

  &:focus-within {
    border-color: var(--app-primary);
    box-shadow: var(--app-focus-ring);
  }

  &._completed {
    .input {
      text-decoration: line-through;
      color: var(--app-text-muted);
    }
  }
}

.input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  line-height: 1.4;
  font-family: inherit;
  color: var(--app-text);
  background: transparent;
  min-width: 0;

  &::placeholder {
    color: var(--app-text-muted);
  }
}

.deleteBtn {
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.15s;

  .item:hover &,
  .item:focus-within & {
    opacity: 1;
  }

  @include media($breakpoint-small) {
    opacity: 1;
  }
}
</style>

<script lang="ts" setup>
const model = defineModel<boolean>({ required: true })

defineProps({
  disabled: { type: Boolean, default: false },
  ariaLabel: { type: String, default: '' },
})
</script>

<template>
  <label :class="[$style.checkbox, { [$style._disabled]: disabled }]">
    <input
      v-model="model"
      type="checkbox"
      :class="$style.input"
      :disabled="disabled"
      :aria-label="ariaLabel || undefined"
    >
    <span :class="$style.box">
      <svg v-if="model" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12l5 5L20 7" />
      </svg>
    </span>
  </label>
</template>

<style lang="scss" module>
.checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;

  &._disabled {
    cursor: default;
    opacity: 0.6;
  }
}

.input {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}

.box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 2px solid var(--app-border);
  background: var(--app-surface);
  transition: background-color 0.15s, border-color 0.15s;
  color: var(--app-primary-text);

  .input:checked + & {
    background: var(--app-primary);
    border-color: var(--app-primary);
  }

  .input:focus-visible + & {
    box-shadow: var(--app-focus-ring);
  }
}
</style>

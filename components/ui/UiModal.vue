<script lang="ts" setup>
const visible = defineModel<boolean>('visible', { required: true })

defineProps({
  header: { type: String, default: '' },
  maxWidth: { type: String, default: '440px' },
})

function close() {
  visible.value = false
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" :class="$style.overlay" @click.self="close">
        <div :class="$style.modal" :style="{ maxWidth }" role="dialog" aria-modal="true">
          <div v-if="header" :class="$style.header">
            <h3 :class="$style.title">{{ header }}</h3>
            <button :class="$style.close" aria-label="Close" @click="close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div :class="$style.body">
            <slot />
          </div>

          <div v-if="$slots.footer" :class="$style.footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" module>
.overlay {
  position: fixed;
  inset: 0;
  background: var(--app-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: $z-index-modal-overlay;
  padding: 20px;
}

.modal {
  background: var(--app-surface);
  border-radius: var(--app-border-radius);
  box-shadow: var(--app-shadow-lg);
  width: 100%;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 0;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: var(--app-text);
}

.close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: none;
  color: var(--app-text-muted);
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;

  @include hover {
    background: var(--app-surface-hover);
    color: var(--app-text);
  }
}

.body {
  padding: 16px 24px;
  font-size: 15px;
  line-height: 1.5;
  color: var(--app-text-muted);
}

.footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 0 24px 20px;
}
</style>

<script lang="ts" setup>
const { locale, locales, setLocale } = useI18n()

interface LocaleItem {
  code: string
  label: string
}

const items = computed<LocaleItem[]>(() =>
  (locales.value as Array<{ code: string; name?: string }>).map(l => ({
    code: l.code,
    label: l.name || l.code,
  })),
)

const currentLabel = computed<string>(() =>
  items.value.find(i => i.code === locale.value)?.label ?? locale.value,
)

const open = ref(false)

function select(code: string) {
  setLocale(code)
  open.value = false
}

function onClickOutside(e: MouseEvent) {
  if (!(e.target as HTMLElement).closest('[data-locale-switcher]')) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

<template>
  <div :class="$style.wrapper" data-locale-switcher>
    <button :class="$style.trigger" @click="open = !open">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10A15.3 15.3 0 0112 2z" />
      </svg>
      {{ currentLabel }}
      <svg :class="[$style.arrow, { [$style._open]: open }]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>

    <Transition name="fade">
      <div v-if="open" :class="$style.dropdown">
        <button
          v-for="item in items"
          :key="item.code"
          :class="[$style.option, { [$style._active]: item.code === locale }]"
          @click="select(item.code)"
        >
          {{ item.label }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  position: relative;
}

.trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: var(--app-border-radius);
  font-size: 13px;
  font-weight: 500;
  color: var(--app-text-muted);
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: color 0.15s, background-color 0.15s;

  @include hover {
    color: var(--app-text);
    background: var(--app-surface-hover);
  }
}

.arrow {
  transition: transform 0.2s;

  &._open {
    transform: rotate(180deg);
  }
}

.dropdown {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 120px;
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: var(--app-border-radius);
  box-shadow: var(--app-shadow-lg);
  padding: 4px;
  z-index: $z-index-header + 1;
}

.option {
  display: block;
  width: 100%;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  color: var(--app-text);
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s;

  @include hover {
    background: var(--app-surface-hover);
  }

  &._active {
    color: var(--app-primary);
  }
}
</style>

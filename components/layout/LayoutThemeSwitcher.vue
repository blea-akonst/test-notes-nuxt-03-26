<script lang="ts" setup>
const { isDark, init, toggle } = useTheme()

onMounted(() => init())
</script>

<template>
  <button :class="$style.button" :aria-label="isDark ? 'Light mode' : 'Dark mode'" @click="toggle">
    <!-- sun -->
    <svg v-if="isDark" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
    <!-- moon -->
    <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  </button>
</template>

<style lang="scss" module>
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
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
</style>

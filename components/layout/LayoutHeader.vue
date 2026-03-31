<script lang="ts" setup>
const { t } = useI18n()
</script>

<template>
  <header :class="$style.header">
    <div class="container" :class="$style.inner">
      <NuxtLink to="/" :class="$style.logo" :aria-label="t('app.name')">
        <svg :class="$style.logoIcon" width="24" height="24" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <rect x="4" y="2" width="24" height="28" rx="3" fill="currentColor" />
          <line x1="10" y1="10" x2="22" y2="10" stroke="var(--app-surface)" stroke-width="2" stroke-linecap="round" />
          <line x1="10" y1="16" x2="19" y2="16" stroke="var(--app-surface)" stroke-width="2" stroke-linecap="round" />
          <line x1="10" y1="22" x2="21" y2="22" stroke="var(--app-surface)" stroke-width="2" stroke-linecap="round" />
        </svg>
      </NuxtLink>

      <div :class="$style.controls">
        <LayoutLocaleSwitcher />
        <LayoutThemeSwitcher />
      </div>
    </div>
  </header>
</template>

<style lang="scss" module>
.header {
  background: var(--app-surface);
  border-bottom: 1px solid var(--app-border);
  position: sticky;
  top: 0;
  z-index: $z-index-header;
}

.inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logoIcon {
  color: var(--app-primary);
}

.controls {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>

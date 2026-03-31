<script lang="ts" setup>
</script>

<template>
  <div :class="$style.layout">
    <LayoutHeader />

    <main :class="$style.main">
      <div class="container">
        <slot />
      </div>
    </main>
  </div>
</template>

<style lang="scss" module>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main {
  flex: 1;
  padding: 32px 0 60px;

  @include media($breakpoint-small) {
    padding: 20px 0 40px;
  }
}
</style>

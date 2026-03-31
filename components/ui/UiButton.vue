<script lang="ts" setup>
import type { PropType } from 'vue'

defineProps({
  label: { type: String, default: '' },
  severity: { type: String as PropType<'primary' | 'secondary' | 'danger'>, default: 'primary' },
  size: { type: String as PropType<'small' | 'medium' | 'large'>, default: 'medium' },
  text: { type: Boolean, default: false },
  outlined: { type: Boolean, default: false },
  rounded: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})
</script>

<template>
  <button
    :class="[
      $style.btn,
      $style[`_${severity}`],
      $style[`_${size}`],
      {
        [$style._text]: text,
        [$style._outlined]: outlined,
        [$style._rounded]: rounded,
        [$style._iconOnly]: !label,
      },
    ]"
    :disabled="disabled"
  >
    <slot />
    <span v-if="label">{{ label }}</span>
  </button>
</template>

<style lang="scss" module>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid transparent;
  border-radius: var(--app-border-radius);
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.15s, color 0.15s, border-color 0.15s, box-shadow 0.15s;
  outline: none;

  &:focus-visible {
    box-shadow: var(--app-focus-ring);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  svg {
    flex-shrink: 0;
  }

  // — Severities (filled) —
  &._primary {
    background: var(--app-primary);
    color: var(--app-primary-text);

    @include hover {
      background: var(--app-primary-hover);
    }
  }

  &._secondary {
    background: var(--app-secondary);
    color: var(--app-secondary-text);

    @include hover {
      background: var(--app-secondary-hover);
    }
  }

  &._danger {
    background: var(--app-danger);
    color: var(--app-danger-text);

    @include hover {
      background: var(--app-danger-hover);
    }
  }

  // — Text variant —
  &._text {
    background: transparent;
    border-color: transparent;

    &._primary {
      color: var(--app-primary);

      @include hover { background: var(--app-primary-subtle); }
    }

    &._secondary {
      color: var(--app-text-muted);

      @include hover { background: var(--app-surface-hover); color: var(--app-text); }
    }

    &._danger {
      color: var(--app-danger-subtle-text);

      @include hover { background: var(--app-danger-subtle); }
    }
  }

  // — Outlined variant —
  &._outlined {
    background: transparent;

    &._primary {
      border-color: var(--app-primary);
      color: var(--app-primary);

      @include hover { background: var(--app-primary-subtle); }
    }

    &._danger {
      border-color: var(--app-danger-subtle-text);
      color: var(--app-danger-subtle-text);

      @include hover { background: var(--app-danger-subtle); }
    }
  }

  // — Sizes —
  &._large {
    height: 48px;
    padding: 0 24px;
    font-size: 16px;

    &._iconOnly {
      width: 48px;
      padding: 0;
    }
  }

  &._medium {
    height: 40px;
    padding: 0 18px;
    font-size: 14px;

    &._iconOnly {
      width: 40px;
      padding: 0;
    }
  }

  &._small {
    height: 32px;
    padding: 0 12px;
    font-size: 13px;

    &._iconOnly {
      width: 32px;
      padding: 0;
    }
  }

  // — Rounded (circle for icon-only) —
  &._rounded {
    border-radius: 50%;
  }
}
</style>

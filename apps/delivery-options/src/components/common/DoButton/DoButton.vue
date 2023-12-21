<template>
  <button
    :class="[
      // Spacing
      'mp-px-5',
      'mp-py-2',
      'mp-flex-grow',

      // Borders
      'first-of-type:mp-border-l',
      'first-of-type:mp-rounded-l-full',
      'last:mp-border-r',
      'last:mp-rounded-r-full',
      'mp-border-r-0',
      'mp-border',

      // Colors
      'dark:mp-border-gray-700',
      'dark:mp-text-gray-100',
      'mp-bg-white',
      'mp-text-gray-900',
      'mp-transition-colors',

      {
        'dark:mp-bg-gray-900 mp-bg-gray-200': active,
        'hover:mp-bg-gray-100 dark:hover:mp-bg-gray-700 dark:mp-bg-gray-800 mp-bg-gray-100': !active,
      },
    ]"
    type="button">
    <slot />
  </button>
</template>

<script lang="ts" setup>
defineProps<{active?: boolean}>();
</script>

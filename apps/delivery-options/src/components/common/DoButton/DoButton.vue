<template>
  <button
    :class="classes"
    type="button">
    <slot />

    <span
      v-if="props.link"
      class="mp-not-sr-only">
      &or;
    </span>
  </button>
</template>

<script lang="ts" setup>
import {computed} from 'vue';

const props = defineProps<{
  active?: boolean;

  /**
   * To show the button as a link.
   */
  link?: boolean;
}>();

const classes = computed(() => {
  const classList: (string | Record<string, unknown>)[] = [
    // Colors
    'dark:mp-border-gray-700',
    'dark:mp-text-gray-300',
    'mp-text-gray-500',

    'mp-transition-colors',

    // Spacing
    'mp-py-2',
    'mp-flex-grow',
  ];

  if (props.link) {
    classList.push({
      'mp-text-gray-800 mp-underline': props.active,
      'hover:mp-text-gray-900 dark:hover:mp-text-gray-200 hover:mp-underline': !props.active,
    });
  } else {
    classList.push(
      // Spacing
      'mp-px-5',
      'mp-w-full',

      // Borders
      'first-of-type:mp-border-l',
      'first-of-type:mp-rounded-l-full',
      'last:mp-border-r',
      'last:mp-rounded-r-full',
      'mp-border-r-0',
      'mp-border',

      // Colors
      'mp-bg-white',

      {
        'dark:mp-bg-gray-900 mp-bg-gray-200': props.active,
        'hover:mp-bg-gray-100 dark:hover:mp-bg-gray-700 dark:mp-bg-gray-800 mp-bg-gray-100': !props.active,
      },
    );
  }

  return classList;
});
</script>

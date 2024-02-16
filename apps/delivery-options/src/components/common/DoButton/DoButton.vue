<template>
  <button
    :class="classes"
    :disabled="disabled"
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

  disabled?: boolean;

  noSpacing?: boolean;

  /**
   * To show the button as a link.
   */
  link?: boolean;
}>();

const classes = computed(() => {
  const classList: (string | Record<string, unknown>)[] = [
    // Colors
    'mp-text-gray-500',

    'mp-transition-colors',

    {
      'mp-py-2 mp-flex-grow': !props.noSpacing,
    },
  ];

  if (props.link) {
    classList.push({
      'mp-text-gray-800 mp-underline': props.active,
      'hover:mp-text-gray-900 hover:mp-underline': !props.active,
    });
  } else {
    classList.push(
      // Borders
      'first-of-type:mp-border-l',
      'first-of-type:mp-rounded-l-full',
      'last:mp-border-r',
      'last:mp-rounded-r-full',
      'mp-border-r-0',
      'mp-border',

      {
        // Spacing
        'mp-px-5 mp-w-full': !props.noSpacing,

        // Colors
        'mp-bg-white': !props.disabled,
        'mp-cursor-not-allowed mp-opacity-50 mp-bg-gray-100': props.disabled,

        'mp-bg-gray-200': props.active,
        'hover:mp-bg-gray-100 mp-bg-gray-100': !props.active,
      },
    );
  }

  return classList;
});
</script>

<template>
  <span
    :class="[
      ...classes,
      {
        'mp-px-1': !label,
        'mp-px-2': label,
      },
    ]"
    class="mp-bg-opacity-30 mp-border mp-rounded-full">
    <slot name="icon" />

    <span
      v-if="label"
      v-text="label" />
  </span>
</template>

<script lang="ts" setup>
import {computed} from 'vue';

const props = defineProps<{label?: string; variant?: 'green'}>();

const classes = computed(() => {
  if (props.variant === 'green') {
    return ['mp-bg-green-700', 'mp-border-green-700', 'mp-text-green-900'];
  }

  return ['mp-bg-gray-700', 'mp-border-gray-700', 'mp-text-gray-900'];
});
</script>

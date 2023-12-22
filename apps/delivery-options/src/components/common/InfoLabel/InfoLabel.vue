<template>
  <span
    :class="[
      ...classes,
      {
        'mp-px-1': !label,
        'mp-px-2': label,
      },
    ]"
    class="mp-border mp-gap-2 mp-inline-flex mp-items-center mp-rounded-full">
    <span
      v-if="hasSlotContent($slots.default)"
      class="mp-h-4">
      <slot />
    </span>

    <span
      v-if="label"
      v-text="label" />
  </span>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {hasSlotContent} from '../../../utils/hasSlotContent';

const VARIANT_GREEN = 'green';

const props = defineProps<{label?: string; variant?: 'green'}>();

const classes = computed(() => {
  if (props.variant === VARIANT_GREEN) {
    return ['mp-bg-green-100', 'mp-border-green-500', 'mp-text-green-700'];
  }

  return ['mp-bg-gray-100', 'mp-border-gray-500', 'mp-text-gray-700'];
});
</script>

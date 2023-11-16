<template>
  <button
    :class="classes"
    class="dark:text-white inline-flex rounded-full"
    type="button"
    @click="$emit('click')">
    <span class="m-auto">
      <slot />
    </span>
  </button>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {type StyleProps} from '../types';
import {StyleSize, StyleVariant} from '../constants';

const props = defineProps<StyleProps>();

defineEmits<{click: (event: MouseEvent) => void}>();

const classes = computed(() => {
  const array = [];

  switch (props.size) {
    case StyleSize.Small:
      array.push('px-2', 'py-1', 'text-sm');
      break;

    case StyleSize.Large:
      array.push('px-6', 'py-3', 'text-lg');
      break;

    default:
      array.push('px-4', 'py-2', 'text-base');
      break;
  }

  switch (props.variant) {
    case StyleVariant.Secondary:
      array.push(
        'bg-goldfish-200',
        'hover:bg-goldfish-300',
        'text-goldfish-700',
        'dark:bg-goldfish-700',
        'dark:hover:bg-goldfish-600',
      );
      break;

    default:
      array.push(
        'bg-monstera-200',
        'hover:bg-monstera-300',
        'text-monstera-700',
        'dark:bg-monstera-700',
        'dark:hover:bg-monstera-600',
      );
      break;
  }

  return array;
});
</script>

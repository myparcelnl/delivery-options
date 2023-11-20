<template>
  <button
    :class="classes"
    class="dark:mp-text-white mp-inline-flex mp-rounded-full"
    type="button"
    @click="$emit('click')">
    <span class="mp-m-auto">
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
      array.push('mp-px-2', 'mp-py-1', 'mp-text-sm');
      break;

    case StyleSize.Large:
      array.push('mp-px-6', 'mp-py-3', 'mp-text-lg');
      break;

    default:
      array.push('mp-px-4', 'mp-py-2', 'mp-text-base');
      break;
  }

  switch (props.variant) {
    case StyleVariant.Secondary:
      array.push(
        'mp-bg-goldfish-200',
        'hover:mp-bg-goldfish-300',
        'mp-text-goldfish-700',
        'dark:mp-bg-goldfish-700',
        'dark:hover:mp-bg-goldfish-600',
      );
      break;

    default:
      array.push(
        'mp-bg-monstera-200',
        'hover:mp-bg-monstera-300',
        'mp-text-monstera-700',
        'dark:mp-bg-monstera-700',
        'dark:hover:mp-bg-monstera-600',
      );
      break;
  }

  return array;
});
</script>

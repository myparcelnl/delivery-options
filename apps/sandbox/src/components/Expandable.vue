<template>
  <div
    class="mp-cursor-pointer mp-flex"
    @click="onClick">
    <slot name="title">
      <span>{{ title }}</span>
    </slot>

    <div
      v-if="!manual"
      :class="{'mp-rotate-45': isOpen}"
      class="mp-flex mp-items-center mp-justify-center mp-ml-auto mp-p-3 mp-relative mp-select-none mp-transition-transform">
      <div class="mp-absolute mp-bg-gray-400 mp-h-px mp-w-4" />
      <div class="mp-absolute mp-bg-gray-400 mp-h-4 mp-w-px" />
    </div>
  </div>

  <div
    v-show="isOpen"
    v-bind="$attrs">
    <slot />
  </div>
</template>

<script lang="ts">
export default {inheritAttrs: false};
</script>

<script lang="ts" setup>
import {useVModel} from '@vueuse/core';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<{title?: string; open?: boolean; manual?: boolean}>();

const isOpen = useVModel(props, 'open');

const onClick = () => {
  if (props.manual) {
    return;
  }

  isOpen.value = !isOpen.value;
};
</script>

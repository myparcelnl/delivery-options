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
import {computed, ref} from 'vue';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<{title?: string; open?: boolean; manual?: boolean}>();

const mutableOpen = ref(props.open ?? false);

const isOpen = computed<boolean>({
  get() {
    return props.manual ? props.open ?? false : mutableOpen.value;
  },

  set(value) {
    mutableOpen.value = value;
  },
});

const onClick = () => {
  if (props.manual) {
    return;
  }

  mutableOpen.value = !mutableOpen.value;
};
</script>

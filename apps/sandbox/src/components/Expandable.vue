<template>
  <div
    class="mp-cursor-pointer mp-flex"
    @click="mutableOpen = !mutableOpen">
    <slot name="title">
      <span>{{ title }}</span>
    </slot>

    <div
      v-if="!manual"
      :class="{'mp-rotate-45': mutableOpen}"
      class="mp-flex mp-items-center mp-justify-center mp-ml-auto mp-p-3 mp-relative mp-select-none mp-transition-transform">
      <div class="mp-absolute mp-bg-gray-400 mp-h-px mp-w-4" />
      <div class="mp-absolute mp-bg-gray-400 mp-h-4 mp-w-px" />
    </div>
  </div>

  <div v-show="open">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';

const props = defineProps<{title?: string; open?: boolean; manual?: boolean}>();

const mutableOpen = ref(props.open ?? false);
</script>

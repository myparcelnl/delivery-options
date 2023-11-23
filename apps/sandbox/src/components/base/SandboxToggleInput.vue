<template>
  <label :for="id">
    <span
      :class="{
        'mp-opacity-50': disabled,
      }"
      class="mp-cursor-pointer mp-inline-flex mp-relative">
      <input
        v-model="model"
        class="mp-sr-only"
        type="checkbox"
        v-bind="$props" />

      <span
        :class="{
          'mp-bg-goldfish-500 dark:mp-bg-goldfish-600': model,
          'mp-bg-gray-300 dark:mp-bg-gray-600': !model,
        }"
        class="mp-h-6 mp-rounded-full mp-transition-colors mp-w-10" />

      <span
        :class="{
          'mp-translate-x-4': model,
          'mp-translate-x-0': !model,
        }"
        class="mp-absolute mp-bg-white mp-h-4 mp-left-1 mp-rounded-full mp-top-1 mp-transition mp-w-4" />
    </span>
  </label>
</template>

<script lang="ts" setup>
import {useVModel} from '@vueuse/core';
import {type ToggleInputEmits, type ToggleInputProps} from '@myparcel-do/shared';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<ToggleInputProps>();
const emit = defineEmits<ToggleInputEmits>();

const model = useVModel(props, undefined, emit);
</script>

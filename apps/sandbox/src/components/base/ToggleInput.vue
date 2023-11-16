<template>
  <label :for="id">
    <span
      :class="{
        'opacity-50': disabled,
      }"
      class="cursor-pointer inline-flex relative">
      <input
        v-model="model"
        class="sr-only"
        type="checkbox"
        v-bind="$props" />

      <span
        :class="{
          'bg-green-400 dark:bg-green-600': model,
          'bg-gray-600': !model,
        }"
        class="h-6 rounded-full transition-colors w-10" />

      <span
        :class="{
          'translate-x-4': model,
          'translate-x-0': !model,
        }"
        class="absolute bg-white h-4 left-1 rounded-full top-1 transition w-4" />
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

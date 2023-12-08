<template>
  <label :for="id">
    <span
      :class="{
        'mp-opacity-50': disabled,
      }"
      class="mp-cursor-pointer mp-inline-flex mp-relative">
      <input
        :id="id"
        v-model="model"
        :disabled="disabled"
        :name="name"
        :readonly="readonly"
        class="mp-peer mp-sr-only"
        type="checkbox" />

      <span
        class="dark:mp-bg-gray-600 mp-bg-gray-300 mp-h-6 mp-rounded-full mp-transition-colors mp-w-10 peer-checked:dark:mp-bg-goldfish-600 peer-checked:mp-bg-goldfish-500" />

      <span
        class="mp-absolute mp-bg-white mp-h-4 mp-left-1 mp-rounded-full mp-top-1 mp-transition mp-translate-x-0 mp-w-4 peer-checked:mp-translate-x-4" />
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

<template>
  <div class="mp-relative mp-w-full">
    <select
      v-model="model"
      :disabled="disabled"
      class="mp-w-full mp-px-4 mp-py-3 mp-border mp-rounded-full mp-bg-white dark:mp-bg-gray-800 dark:mp-text-white mp-appearance-none">
      <option
        v-if="placeholder"
        value=""
        disabled
        selected>
        {{ translate(placeholder) }}
      </option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value">
        {{ translate(option.label) }}
      </option>
    </select>
    <div class="mp-absolute mp-inset-y-0 mp-right-0 mp-flex mp-items-center mp-px-4 mp-pointer-events-none">
      <svg
        class="mp-h-5 mp-w-5 mp-text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</template>

<script generic="T extends SelectInputModelValue" lang="ts" setup>
import {type SelectInputModelValue, type SelectInputProps} from '@myparcel-dev/do-shared';
import {useLanguage} from '../../composables';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<SelectInputProps<T>>();

const model = defineModel<T>();

const {translate} = useLanguage();
</script>

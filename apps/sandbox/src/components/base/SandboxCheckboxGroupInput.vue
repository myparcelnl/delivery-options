<template>
  <ul class="mp-gap-4 mp-grid">
    <li
      v-for="option in options"
      :key="option.value">
      <label class="mp-flex">
        <SandboxCheckboxInput
          v-model="model"
          :disabled="disabled"
          :readonly="readonly"
          :value="option.value"
          wrapper="div" />

        <span v-text="option.label" />
      </label>

      <slot v-bind="{option}" />
    </li>
  </ul>
</template>

<script generic="T extends CheckboxGroupModelValue" lang="ts" setup>
import {useVModel} from '@vueuse/core';
import {
  type CheckboxGroupEmits,
  type CheckboxGroupModelValue,
  type CheckboxGroupProps,
  type SelectOption,
} from '@myparcel-dev/do-shared';
import SandboxCheckboxInput from './SandboxCheckboxInput.vue';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<CheckboxGroupProps<T>>();
const emit = defineEmits<CheckboxGroupEmits<T>>();

defineSlots<{default(props: {option: SelectOption<string>}): unknown}>();

const model = useVModel(props, undefined, emit);
</script>

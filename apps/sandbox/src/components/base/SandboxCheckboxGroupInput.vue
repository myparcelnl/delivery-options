<template>
  <div>
    <SandboxCheckboxInput
      v-for="option in options"
      :key="option.value"
      :model-value="model?.includes(option.value)"
      :value="option.value"
      @update:modelValue="(value) => createUpdateHandler(option.value)(value)" />
  </div>
</template>

<script generic="T extends CheckboxGroupModelValue" lang="ts" setup>
import {
  type CheckboxGroupEmits,
  type CheckboxGroupModelValue,
  type CheckboxGroupProps,
  useCheckboxGroupContext,
} from '@myparcel-do/shared';
import SandboxCheckboxInput from './SandboxCheckboxInput.vue';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<CheckboxGroupProps<T>>();
const emit = defineEmits<CheckboxGroupEmits<T>>();

const {id, model, elementProps, createUpdateHandler} = useCheckboxGroupContext(props, emit);
</script>

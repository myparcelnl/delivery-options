<template>
  <SandboxCheckboxGroupInput
    :id="id"
    v-model="model"
    :options="options"
    v-bind="elementProps" />
</template>

<script generic="T extends CheckboxGroupModelValue" lang="ts" setup>
import {
  type CheckboxGroupEmits,
  type CheckboxGroupModelValue,
  type CheckboxGroupProps,
  useCheckboxGroupContext,
  type WithElement,
} from '@myparcel-do/shared';
import SandboxCheckboxGroupInput from '../base/SandboxCheckboxGroupInput.vue';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<WithElement<CheckboxGroupProps<T>>>();
const emit = defineEmits<CheckboxGroupEmits<T>>();

const {id, model, elementProps, options} = useCheckboxGroupContext(props, emit);
</script>

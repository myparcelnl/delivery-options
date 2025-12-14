<template>
  <SandboxRadioGroupInput
    :id="id"
    v-model="model"
    :options="options"
    v-bind="elementProps" />
</template>

<script generic="T extends RadioGroupModelValue" lang="ts" setup>
import {
  type RadioGroupEmits,
  type RadioGroupModelValue,
  type RadioGroupProps,
  useRadioGroupContext,
  type WithElement,
} from '@myparcel-dev/shared';
import SandboxRadioGroupInput from '../../base/SandboxRadioGroupInput.vue';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<WithElement<RadioGroupProps<T>>>();
const emit = defineEmits<RadioGroupEmits<T>>();

const {id, model, elementProps, options} = useRadioGroupContext(props, emit);
</script>

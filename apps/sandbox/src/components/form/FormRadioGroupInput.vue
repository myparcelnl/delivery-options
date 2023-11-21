<template>
  <RadioGroupInput
    v-model="model"
    :element="element" />
</template>

<script generic="T extends RadioGroupModelValue" lang="ts" setup>
import {useVModel} from '@vueuse/core';
import {
  type RadioGroupEmits,
  RadioGroupInput,
  type RadioGroupModelValue,
  type RadioGroupProps,
  type WithElement,
} from '@myparcel-do/shared';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<WithElement<RadioGroupProps<T>>>();
const emit = defineEmits<RadioGroupEmits<T>>();

const {model} = useVModel(props, emit);
</script>

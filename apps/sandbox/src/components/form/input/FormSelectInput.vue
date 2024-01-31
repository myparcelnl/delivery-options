<template>
  <SelectInput
    v-model="model"
    :element="element" />
</template>

<script generic="T extends SelectInputModelValue" lang="ts" setup>
import {useVModel} from '@vueuse/core';
import {
  type SelectInputEmits,
  type SelectInputModelValue,
  type SelectInputProps,
  type WithElement,
} from '@myparcel-do/shared';
import SelectInput from '../../SelectInput.vue';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<WithElement<SelectInputProps<T>>>();
const emit = defineEmits<SelectInputEmits<T>>();

const model = useVModel(props, undefined, emit);
</script>

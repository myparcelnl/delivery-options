<template>
  <select
    v-model="model"
    v-bind="elementProps">
    <option
      v-for="option in options"
      :key="`${id}_${option.value}`"
      :value="option.value"
      v-text="option.label" />
  </select>
</template>

<script generic="T extends SelectInputModelValue" lang="ts" setup>
import {type SelectInputEmits, type SelectInputModelValue, type SelectInputProps, type WithElement} from '../types';
import {useSelectInputContext} from '../composables';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<WithElement<SelectInputProps<T>>>();
const emit = defineEmits<SelectInputEmits<T>>();

const {id, model, options, elementProps} = useSelectInputContext(props, emit);
</script>

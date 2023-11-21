<template>
  <SelectInput
    v-model="model"
    :class="classes"
    :element="element" />
</template>

<script generic="T extends SelectInputModelValue" lang="ts" setup>
import {useVModel} from '@vueuse/core';
import {
  SelectInput,
  type SelectInputEmits,
  type SelectInputModelValue,
  type SelectInputProps,
  type WithElement,
} from '@myparcel-do/shared';
import {useElInputClasses} from '../../composables';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<WithElement<SelectInputProps<T>>>();
const emit = defineEmits<SelectInputEmits<T>>();

const model = useVModel(props, undefined, emit);
const classes = useElInputClasses();
</script>

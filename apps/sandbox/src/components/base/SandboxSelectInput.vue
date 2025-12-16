<template>
  <select
    v-model="model"
    :class="classes">
    <option
      v-for="option in options"
      :key="`${id}_${option.value}`"
      :value="option.value"
      v-text="option.label" />
  </select>
</template>

<script generic="T extends SelectInputModelValue" lang="ts" setup>
import {useVModel} from '@vueuse/core';
import {type SelectInputEmits, type SelectInputModelValue, type SelectInputProps} from '@myparcel-dev/do-shared';
import {useBaseInputClasses} from '../../composables';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<SelectInputProps<T>>();
const emit = defineEmits<SelectInputEmits<T>>();

const model = useVModel(props, undefined, emit);

const classes = useBaseInputClasses();
</script>

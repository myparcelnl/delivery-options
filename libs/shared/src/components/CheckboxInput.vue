<template>
  <input
    v-model="model"
    type="checkbox"
    v-bind="props" />
</template>

<script generic="T extends CheckboxModelValue" lang="ts" setup>
import {useVModel} from '@vueuse/core';
import {type CheckboxEmits, type CheckboxModelValue, type CheckboxProps} from '../types';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<CheckboxProps<T>>();
const emit = defineEmits<CheckboxEmits<T>>();

const model = useVModel(props, undefined, emit);
</script>

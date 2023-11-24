<template>
  <input
    v-model="model"
    type="checkbox"
    v-bind="props" />
</template>

<script generic="T extends Keyable" lang="ts" setup>
import {useVModel} from '@vueuse/core';
import {type InputEmits, type InputProps, type Keyable} from '../types';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<InputProps<T>>();
const emit = defineEmits<InputEmits<T>>();

const model = useVModel(props, undefined, emit);
</script>

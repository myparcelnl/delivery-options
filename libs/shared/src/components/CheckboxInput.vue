<template>
  <input
    v-model="model"
    type="checkbox" />
</template>

<script generic="T extends Keyable" lang="ts" setup>
import {useVModel} from '@vueuse/core';
import {type InputEmits, type InputProps, type Keyable, type SelectOption} from '../types';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<InputProps<T> & {option: SelectOption}>();
const emit = defineEmits<InputEmits<T>>();

const model = useVModel(props, undefined, emit);
</script>

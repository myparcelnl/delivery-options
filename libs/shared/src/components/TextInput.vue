<template>
  <input
    v-model="model"
    v-bind="props" />
</template>

<script lang="ts" setup>
import {useVModel} from '@vueuse/core';
import {type TextInputEmits, type TextInputProps} from '../types';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<TextInputProps>();
const emit = defineEmits<TextInputEmits>();

const model = useVModel(props, undefined, emit);
</script>

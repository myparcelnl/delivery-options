<template>
  <TextInput
    v-model="model"
    type="number"
    v-bind="{
      min: 0,
      step: 1,
      ...$props,
    }" />
</template>

<script lang="ts" setup>
import {useVModel} from '@vueuse/core';
import {type NumberInputEmits, type NumberInputProps} from '@myparcel-do/shared';
import TextInput from './TextInput.vue';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<NumberInputProps>();
const emit = defineEmits<NumberInputEmits>();

const model = useVModel(props, undefined, emit);
</script>

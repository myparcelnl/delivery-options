<template>
  <TextInput
    v-model.number="model"
    type="number"
    v-bind="{
      min: 0,
      step: 1,
      ...$props,
    }" />
</template>

<script lang="ts" setup>
import {useVModel} from '@vueuse/core';
import {type NumberInputEmits, type NumberInputProps} from '@myparcel-dev/shared';
import TextInput from './SandboxTextInput.vue';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<NumberInputProps>();
const emit = defineEmits<NumberInputEmits>();

const model = useVModel(props, undefined, emit);
</script>

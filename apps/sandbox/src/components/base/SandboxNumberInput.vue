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
import {type NumberInputProps} from '@myparcel-dev/do-shared';
import TextInput from './SandboxTextInput.vue';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<NumberInputProps>();

const model = defineModel<number>();
</script>

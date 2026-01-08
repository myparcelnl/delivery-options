<template>
  <SandboxSelectInput
    v-model="model"
    :options="options"
    v-bind="$attrs" />
</template>

<script generic="T extends SelectInputModelValue" lang="ts" setup>
import {
  type SelectInputModelValue,
  type SelectInputProps,
} from '@myparcel-dev/do-shared';
import { SandboxSelectInput } from '../../base';

const model = defineModel<T>();
const props = defineProps<SelectInputProps<T>>();
</script>

<template>
  <SandboxCheckboxGroupInput
    v-model="model"
    v-bind="$attrs" />
</template>

<script generic="T extends CheckboxGroupModelValue" lang="ts" setup>
import {
  type CheckboxGroupModelValue,
} from '@myparcel-dev/do-shared';
import SandboxCheckboxGroupInput from '../../base/SandboxCheckboxGroupInput.vue';

const model = defineModel<T>();
</script>

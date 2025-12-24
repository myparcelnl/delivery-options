<template>
  <SelectInput
    v-model="model"
    v-bind="$attrs" />
</template>

<script generic="T extends SelectInputModelValue" lang="ts" setup>
import {
  type SelectInputModelValue,
} from '@myparcel-dev/do-shared';
import SelectInput from '../../SelectInput.vue';

const model = defineModel<T>();
</script>

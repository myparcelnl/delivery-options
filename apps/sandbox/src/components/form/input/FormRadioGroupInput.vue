<template>
  <SandboxRadioGroupInput
    v-model="model"
    :options="options" />
</template>

<script generic="T extends RadioGroupModelValue" lang="ts" setup>
import {
  type RadioGroupModelValue,
  type SelectOption,
} from '@myparcel-dev/do-shared';
import SandboxRadioGroupInput from '../../base/SandboxRadioGroupInput.vue';

interface Props {
  options: SelectOption[];
}

const props = defineProps<Props>();

const model = defineModel<T>();
</script>

<template>
  <div>
    <input
      v-for="option in options"
      :key="option.value"
      v-model="model"
      :disabled="disabled"
      :name="`${id}[${option.value}]`"
      :value="option.value"
      type="checkbox" />
  </div>
</template>

<script generic="T extends CheckboxGroupModelValue" lang="ts" setup>
import {
  type CheckboxGroupEmits,
  type CheckboxGroupModelValue,
  type CheckboxGroupProps,
  useCheckboxGroupContext,
} from '@myparcel-do/shared';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<CheckboxGroupProps<T>>();
const emit = defineEmits<CheckboxGroupEmits<T>>();

const model = useCheckboxGroupContext(props, emit);
</script>

<template>
  <div>
    <input
      v-for="option in options"
      :key="option.value"
      :disabled="disabled"
      :name="`${id}[${option.value}]`"
      :value="option.value"
      type="checkbox"
      @change="onChange" />
  </div>
</template>

<script generic="T extends CheckboxGroupModelValue" lang="ts" setup>
import {useVModel} from '@vueuse/core';
import {type CheckboxGroupEmits, type CheckboxGroupModelValue, type CheckboxGroupProps} from '@myparcel-do/shared';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<CheckboxGroupProps<T>>();
const emit = defineEmits<CheckboxGroupEmits<T>>();

const model = useVModel(props, undefined, emit);

const onChange = (value: T) => {
  const newValue = [...model.value];
  const index = newValue.indexOf(value);

  if (index === -1) {
    newValue.push(value);
  } else {
    newValue.splice(index, 1);
  }

  model.value = newValue as T;
};
</script>

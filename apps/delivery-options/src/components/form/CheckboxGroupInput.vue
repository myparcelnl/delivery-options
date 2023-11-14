<template>
  <div>
    <CheckboxInput
      v-for="option in element.props.options"
      :key="option.value"
      :element="element"
      :label="option.label"
      :model-value="model[option.value]"
      :value="option.value"
      @change="onChange" />
  </div>
</template>

<script lang="ts" setup>
import {toRefs} from 'vue';
import {useVModel} from '@vueuse/core';
import {type ElementEmits, type ElementProps} from '@myparcel-do/shared';
import CheckboxInput from './CheckboxInput.vue';

const props = defineProps<ElementProps<string[]>>();
const emit = defineEmits<ElementEmits<string[]>>();

const propRefs = toRefs(props);
const model = useVModel(propRefs.modelValue, undefined, emit);

const onChange = (value: string) => {
  const newValue = [...model.value];
  const index = newValue.indexOf(value);

  if (index === -1) {
    newValue.push(value);
  } else {
    newValue.splice(index, 1);
  }

  model.value = newValue;
};
</script>

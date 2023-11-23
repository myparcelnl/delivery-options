<template>
  <div>
    <RadioInputRow
      v-for="option in options"
      :key="`${id}-${option.value}`"
      v-model="model"
      :option="option"
      v-bind="elementProps" />
  </div>
</template>

<script generic="T extends RadioGroupModelValue" lang="ts" setup>
import {type RadioGroupEmits, type RadioGroupModelValue, type RadioGroupProps, type WithElement} from '../types';
import {useRadioGroupContext} from '../composables';
import RadioInputRow from './RadioInputRow.vue';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<WithElement<RadioGroupProps<T>>>();
const emit = defineEmits<RadioGroupEmits<T>>();

const {id, model, options, elementProps} = useRadioGroupContext(props, emit);
</script>

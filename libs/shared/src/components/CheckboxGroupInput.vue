<template>
  <div>
    <OptionRow
      v-for="option in options"
      :key="`${id}-${option.value}`"
      v-model="model"
      :option="option">
      <CheckboxInput
        :id="`${id}-${option.value}`"
        v-model="model"
        :disabled="option.disabled || elementProps.disabled"
        :name="id"
        :option="option"
        :readonly="elementProps.readonly"
        :value="option.value"
        @update:modelValue="createUpdateHandler(option)" />
    </OptionRow>
  </div>
</template>

<script generic="T extends CheckboxGroupModelValue" lang="ts" setup>
import {
  type CheckboxGroupEmits,
  type CheckboxGroupModelValue,
  type CheckboxGroupProps,
  type WithElement,
} from '../types';
import {useCheckboxGroupContext} from '../composables';
import OptionRow from './OptionRow.vue';
import CheckboxInput from './CheckboxInput.vue';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<WithElement<CheckboxGroupProps<T>>>();
const emit = defineEmits<CheckboxGroupEmits<T>>();

const {id, model, options, elementProps, createUpdateHandler} = useCheckboxGroupContext(props, emit);
</script>

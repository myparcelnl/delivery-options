<template>
  <div>
    <OptionRow
      v-for="option in options"
      :key="`${id}-${option.value}`"
      :option="option">
      <RadioInput
        v-model="model"
        :value="option.value"
        type="radio"
        v-bind="elementProps" />
    </OptionRow>
  </div>
</template>

<script generic="T extends RadioGroupModelValue" lang="ts" setup>
import {
  type RadioGroupEmits,
  type RadioGroupModelValue,
  type RadioGroupProps,
  RadioInput,
  useRadioGroupContext,
  type WithElement,
} from '@myparcel-do/shared';
import OptionRow from '../../common/OptionRow/OptionRow.vue';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<WithElement<RadioGroupProps<T>>>();
const emit = defineEmits<RadioGroupEmits<T>>();

const {id, model, options, elementProps} = useRadioGroupContext(props, emit);
</script>

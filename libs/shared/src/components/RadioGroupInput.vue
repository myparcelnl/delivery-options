<template>
  <div>
    <OptionRow
      v-for="option in options"
      :key="`${id}-${option.value}`"
      v-model="model"
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
import {type RadioGroupEmits, type RadioGroupModelValue, type RadioGroupProps, type WithElement} from '../types';
import {useRadioGroupContext} from '../composables';
import OptionRow from '../../../../apps/delivery-options/src/components/OptionRow.vue';
import RadioInput from './RadioInput.vue';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<WithElement<RadioGroupProps<T>>>();
const emit = defineEmits<RadioGroupEmits<T>>();

const {id, model, options, elementProps} = useRadioGroupContext(props, emit);
</script>

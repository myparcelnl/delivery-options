<template>
  <div>
    <label
      v-for="option in options"
      :key="`${id}-${option.value}`"
      class="mp-flex mp-gap-2 mp-items-center mp-py-1">
      <RadioInput
        v-model="model"
        :value="option.value"
        type="radio"
        v-bind="elementProps" />

      <span v-text="translate(option.label)" />
    </label>
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
} from '@myparcel-dev/do-shared';
import {useLanguage} from '../composables';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<WithElement<RadioGroupProps<T>>>();
const emit = defineEmits<RadioGroupEmits<T>>();

const {id, model, options, elementProps} = useRadioGroupContext(props, emit);

const {translate} = useLanguage();
</script>

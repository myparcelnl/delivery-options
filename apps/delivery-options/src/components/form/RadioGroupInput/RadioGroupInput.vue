<template>
  <GroupInput
    :id="id"
    :options="options">
    <template #input="{option}">
      <RadioInput
        v-model="model"
        :value="option.value"
        type="radio"
        v-bind="elementProps" />
    </template>

    <template
      v-for="slot in Object.keys($slots)"
      #[slot]="context">
      <slot
        :name="slot"
        v-bind="context" />
    </template>
  </GroupInput>
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
import GroupInput from '../GroupInput/GroupInput.vue';
import {type GroupInputSlots} from '../../../types';

defineSlots<GroupInputSlots<T>>();

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<WithElement<RadioGroupProps<T>>>();
const emit = defineEmits<RadioGroupEmits<T>>();

const {id, model, options, elementProps} = useRadioGroupContext(props, emit);
</script>

<template>
  <GroupInput
    :id="id"
    :options="options">
    <template #input="{option}">
      <CheckboxInput
        :id="`${id}-${option.value}`"
        v-model="model"
        :disabled="option.disabled || elementProps.disabled"
        :name="id"
        :option="option"
        :readonly="elementProps.readonly"
        :value="option.value"
        @update:modelValue="createUpdateHandler(option)" />
    </template>

    <template
      v-for="(slot, index) in Object.keys($slots)"
      :key="index"
      #[slot]="context">
      <slot
        :name="slot"
        v-bind="context" />
    </template>
  </GroupInput>
</template>

<script generic="T extends CheckboxGroupModelValue" lang="ts" setup>
import {
  type CheckboxGroupEmits,
  type CheckboxGroupModelValue,
  type CheckboxGroupProps,
  CheckboxInput,
  useCheckboxGroupContext,
  type WithElement,
} from '@myparcel-do/shared';
import GroupInput from '../GroupInput/GroupInput.vue';
import {type GroupInputSlots} from '../../../types';

defineSlots<GroupInputSlots<T>>();

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<WithElement<CheckboxGroupProps<T>>>();
const emit = defineEmits<CheckboxGroupEmits<T>>();

const {id, model, options, elementProps, createUpdateHandler} = useCheckboxGroupContext(props, emit);
</script>

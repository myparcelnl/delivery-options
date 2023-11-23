<template>
  <div>
    <label
      v-for="option in options"
      :key="`${id}-${option.value}`"
      class="mp-block">
      <CheckboxInput
        :id="`${id}-${option.value}`"
        :disabled="option.disabled || elementProps.disabled"
        :model-value="model?.includes(option.value)"
        :name="id"
        :option="option"
        :readonly="elementProps.readonly"
        :value="option.value"
        @update:modelValue="(value) => createUpdateHandler(option.value)(value)" />

      <span>
        {{ option.label }}
      </span>
    </label>
  </div>
</template>

<script generic="T extends CheckboxGroupModelValue" lang="ts" setup>
import {computed} from 'vue';
import {
  type CheckboxGroupEmits,
  type CheckboxGroupModelValue,
  type CheckboxGroupProps,
  type WithElement,
} from '../types';
import {useCheckboxGroupContext} from '../composables';
import CheckboxInput from './CheckboxInput.vue';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<WithElement<CheckboxGroupProps<T>>>();
const emit = defineEmits<CheckboxGroupEmits<T>>();

const {id, model, elementProps} = useCheckboxGroupContext(props, emit);

const options = computed(() => props.element.props.options);

const createUpdateHandler = (optionValue: T) => {
  return (toggle: boolean) => {
    const newModel = [...model.value];

    if (toggle) {
      newModel.push(optionValue);
    } else {
      newModel.splice(newModel.indexOf(optionValue), 1);
    }

    emit('update:modelValue', newModel);
  };
};
</script>

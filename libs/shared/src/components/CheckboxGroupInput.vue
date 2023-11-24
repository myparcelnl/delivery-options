<template>
  <div>
    <label
      v-for="option in options"
      :key="`${id}-${option.value}`"
      class="mp-block">
      <CheckboxInput
        :id="`${id}-${option.value}`"
        :disabled="option.disabled || elementProps.disabled"
        :name="id"
        :option="option"
        :readonly="elementProps.readonly"
        v-bind="createProps(option)" />

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

const {id, model, elementProps, createProps} = useCheckboxGroupContext(props, emit);

const options = computed(() => props.element.props.options);
</script>

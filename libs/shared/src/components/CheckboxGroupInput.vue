<template>
  <div>
    <label
      v-for="option in options"
      :key="`${id}-${option.value}`">
      <CheckboxInput
        :id="`${id}-${option.value}`"
        v-model="model"
        :disabled="elementProps.disabled || option.disabled"
        :name="id"
        :option="option"
        :readonly="elementProps.readonly"
        :value="option.value" />

      <span>
        {{ option.label }}
      </span>
    </label>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {type CheckboxGroupEmits, type CheckboxGroupProps, type WithElement} from '../types';
import {useElementContext} from '../composables';
import CheckboxInput from './CheckboxInput.vue';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<WithElement<CheckboxGroupProps<string>>>();
const emit = defineEmits<CheckboxGroupEmits<string>>();

const {id, model, elementProps} = useElementContext(props, emit);

const options = computed(() => props.element.props.options);
</script>

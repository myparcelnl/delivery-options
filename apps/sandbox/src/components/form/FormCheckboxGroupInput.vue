<template>
  <CheckboxGroupInput
    v-model="model"
    :options="options"
    v-bind="elementProps" />
</template>

<script generic="T extends CheckboxGroupModelValue" lang="ts" setup>
import {computed} from 'vue';
import {
  type CheckboxGroupEmits,
  type CheckboxGroupModelValue,
  type CheckboxGroupProps,
  type ElProps,
  useElementContext,
} from '@myparcel-do/shared';
import CheckboxGroupInput from '../base/CheckboxGroupInput.vue';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<ElProps<CheckboxGroupProps<T>>>();
const emit = defineEmits<CheckboxGroupEmits<T>>();

const {model, elementProps} = useElementContext(props, emit);

const options = computed(() => props.element.props.options ?? []);
</script>

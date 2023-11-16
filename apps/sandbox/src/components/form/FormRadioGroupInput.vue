<template>
  <RadioGroupInput
    v-model="model"
    :options="options"
    v-bind="elementProps" />
</template>

<script generic="T extends RadioGroupModelValue" lang="ts" setup>
import {computed} from 'vue';
import {
  type ElProps,
  type RadioGroupEmits,
  type RadioGroupModelValue,
  type RadioGroupProps,
  useElementContext,
} from '@myparcel-do/shared';
import RadioGroupInput from '../base/RadioGroupInput.vue';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<ElProps<RadioGroupProps<T>>>();
const emit = defineEmits<RadioGroupEmits<T>>();

const {model, elementProps} = useElementContext(props, emit);

const options = computed(() => props.element.props.options ?? []);
</script>

<template>
  <SandboxSelectInput
    :id="id"
    v-model="model"
    :class="classes"
    :options="options"
    v-bind="elementProps" />
</template>

<script generic="T extends SelectInputModelValue" lang="ts" setup>
import {
  type SelectInputEmits,
  type SelectInputModelValue,
  type SelectInputProps,
  useSelectInputContext,
  type WithElement,
} from '@myparcel-do/shared';
import SandboxSelectInput from '../base/SandboxSelectInput.vue';
import {useElInputClasses} from '../../composables'; // eslint-disable-next-line vue/no-unused-properties

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<WithElement<SelectInputProps<T>>>();
const emit = defineEmits<SelectInputEmits<T>>();

const {id, model, elementProps, options} = useSelectInputContext(props, emit);

const classes = useElInputClasses();
</script>

<template>
  <SandboxCurrencyInput
    v-model="model"
    :class="classes"
    v-bind="elementProps" />
</template>

<script lang="ts" setup>
import {
  type CurrencyInputEmits,
  type CurrencyInputProps,
  useElementContext,
  type WithElement,
} from '@myparcel-do/shared';
import SandboxCurrencyInput from '../base/SandboxCurrencyInput.vue';
import {useElInputClasses} from '../../composables';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<WithElement<CurrencyInputProps>>();
const emit = defineEmits<CurrencyInputEmits>();

const {model, elementProps} = useElementContext(props, emit);

const classes = useElInputClasses();
</script>

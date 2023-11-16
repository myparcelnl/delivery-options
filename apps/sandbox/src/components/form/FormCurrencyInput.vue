<template>
  <CurrencyInput
    v-model="model"
    :class="classes"
    v-bind="elementProps" />
</template>

<script lang="ts" setup>
import {type CurrencyInputEmits, type CurrencyInputProps, type ElProps, useElementContext} from '@myparcel-do/shared';
import CurrencyInput from '../base/CurrencyInput.vue';
import {useElInputClasses} from '../../composables/useElInputClasses';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<ElProps<CurrencyInputProps>>();
const emit = defineEmits<CurrencyInputEmits>();

const {model, elementProps} = useElementContext(props, emit);

const classes = useElInputClasses();
</script>

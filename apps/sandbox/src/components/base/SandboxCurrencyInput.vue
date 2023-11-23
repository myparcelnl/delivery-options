<template>
  <div class="mp-grid mp-grid-flow-col">
    <span
      :class="[...useBaseInputClasses(), 'rounded-r-none']"
      class="dark:mp-bg-gray-600 mp-align-middle mp-bg-gray-100 mp-flex mp-px-4">
      <span>€</span>
    </span>

    <NumberInput
      v-model.number="model"
      class="mp-border-l-0 mp-rounded-l-none"
      v-bind="{
        step: 0.05,
        min: undefined,
        ...$props,
      }" />
  </div>
</template>

<script lang="ts" setup>
import {useVModel} from '@vueuse/core';
import {type CurrencyInputEmits, type CurrencyInputProps} from '@myparcel-do/shared';
import {useBaseInputClasses} from '../../composables';
import NumberInput from './SandboxNumberInput.vue';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<CurrencyInputProps>();
const emit = defineEmits<CurrencyInputEmits>();

const model = useVModel(props, undefined, emit);
</script>

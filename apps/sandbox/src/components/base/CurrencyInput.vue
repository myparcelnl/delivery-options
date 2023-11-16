<template>
  <div class="grid grid-flow-col">
    <span
      :class="[...useBaseInputClasses(), '!rounded-r-none']"
      class="align-middle bg-gray-100 dark:bg-gray-600 flex px-4">
      <span>€</span>
    </span>

    <NumberInput
      v-model.number="model"
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
import {useBaseInputClasses} from '../../composables/useBaseInputClasses';
import NumberInput from './NumberInput.vue';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<CurrencyInputProps>();
const emit = defineEmits<CurrencyInputEmits>();

const model = useVModel(props, undefined, emit);
</script>

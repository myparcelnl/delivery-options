<template>
  <label class="mp-flex mp-gap-2 mp-items-center">
    <RadioInput
      v-model="model"
      :disabled="disabled"
      :readonly="readonly"
      :value="option.value"
      type="radio" />

    <slot name="label">
      <span>
        {{ option.label }}
      </span>
    </slot>

    <EcoFriendlyLabel v-if="option.ecoFriendly" />

    <span
      v-if="option.price || option.carrier"
      class="mp-ml-auto">
      <PriceTag
        v-if="option.price"
        :price="option.price" />

      <CarrierLogo
        v-if="option.carrier"
        :carrier="option.carrier" />
    </span>
  </label>
</template>

<script generic="T extends SelectInputModelValue" lang="ts" setup>
import {useVModel} from '@vueuse/core';
import {
  CarrierLogo,
  EcoFriendlyLabel,
  type InputEmits,
  type InputProps,
  PriceTag,
  RadioInput,
  type SelectInputModelValue,
  type SelectOption,
} from '@myparcel-do/shared';

const props = defineProps<InputProps<T> & {option: SelectOption}>();
const emit = defineEmits<InputEmits<T>>();

const model = useVModel(props, undefined, emit);
</script>

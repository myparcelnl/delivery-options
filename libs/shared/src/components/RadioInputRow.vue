<template>
  <label class="mp-flex mp-gap-2 mp-items-center mp-py-1">
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

    <EcoFriendlyLabel
      v-if="option.ecoFriendly"
      :amount="option.ecoFriendly" />

    <PriceTag
      v-if="option.price"
      :price="option.price"
      class="mp-ml-auto" />

    <CarrierLogo
      v-if="option.carrier"
      :carrier="option.carrier"
      :class="{
        'mp-ml-auto': !option.price,
      }" />
  </label>
</template>

<script generic="T extends SelectInputModelValue" lang="ts" setup>
import {useVModel} from '@vueuse/core';
import type {InputEmits, InputProps, SelectInputModelValue, SelectOption} from '../types';
import CarrierLogo from './CarrierLogo.vue';
import EcoFriendlyLabel from './EcoFriendlyLabel.vue';
import PriceTag from './PriceTag.vue';

const props = defineProps<InputProps<T> & {option: SelectOption}>();
const emit = defineEmits<InputEmits<T>>();

const model = useVModel(props, undefined, emit);
</script>

<template>
  <label class="mp-flex mp-gap-2 mp-items-center mp-py-1">
    <slot />

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

<script lang="ts" setup>
import {type SelectOption} from '../types';
import PriceTag from './PriceTag.vue';
import EcoFriendlyLabel from './EcoFriendlyLabel.vue';
import CarrierLogo from './CarrierLogo.vue';

const props = defineProps<{option: SelectOption}>();
</script>

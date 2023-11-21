<template>
  <div>
    <label
      v-for="option in options"
      :key="`${id}-${option.value}`"
      class="mp-flex mp-flex-col">
      <input
        v-model="model"
        :disabled="elementProps.disabled"
        :name="`${id}[${option.value}]`"
        :readonly="elementProps.readonly"
        :value="option.value"
        type="radio" />

      <span>
        {{ option.label }}
      </span>

      <EcoFriendlyLabel v-if="elementProps.ecoFriendly" />

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
  </div>
</template>

<script generic="T extends RadioGroupModelValue" lang="ts" setup>
import {type RadioGroupEmits, type RadioGroupModelValue, type RadioGroupProps, type WithElement} from '../types';
import {useRadioGroupContext} from '../composables';
import PriceTag from './PriceTag.vue';
import EcoFriendlyLabel from './EcoFriendlyLabel.vue';
import CarrierLogo from './CarrierLogo.vue';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<WithElement<RadioGroupProps<T>>>();
const emit = defineEmits<RadioGroupEmits<T>>();

const {id, model, options, elementProps} = useRadioGroupContext(props, emit);
</script>

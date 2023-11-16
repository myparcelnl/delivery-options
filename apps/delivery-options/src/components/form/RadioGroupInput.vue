<template>
  <div>
    <label
      v-for="option in options"
      :key="`${id}-${option.value}`"
      class="mypa-flex">
      <input
        :id="`${id}-${option.value}`"
        v-model="model"
        :disabled="elementProps.disabled || option.disabled"
        :name="id"
        :readonly="elementProps.readonly"
        :value="option.value"
        type="radio" />

      <span>
        {{ option.label }}
      </span>

      <PriceTag
        v-if="elementProps.price"
        :price="elementProps.price" />

      <EcoFriendlyLabel v-if="elementProps.ecoFriendly" />

      <CarrierLogo
        v-if="elementProps.carrier"
        :carrier="elementProps.carrier"
        class="mypa-ml-auto" />
    </label>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {CarrierLogo, type ElementEmits, type ElementProps, useElementContext} from '@myparcel-do/shared';
import PriceTag from '../PriceTag.vue';
import EcoFriendlyLabel from '../EcoFriendlyLabel.vue';

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<ElementProps<string>>();
const emit = defineEmits<ElementEmits<string>>();

const {id, model, elementProps} = useElementContext(props, emit);

const options = computed(() => props.element.props.options);
</script>

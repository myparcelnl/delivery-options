<template>
  <component
    :is="component"
    :size="size"
    :variant="'outline-' + (icon ? 'dark' : carrier.name)"
    v-bind="$attrs">
    <img
      v-if="icon"
      class="img-fluid"
      width="18"
      :src="getCarrierLogo(carrier.name)"
      :alt="carrier.text">

    <span
      v-if="text"
      class="m-auto"
      v-text="carrier.text" />
  </component>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {getCarrierLogo} from '@myparcel/delivery-options-shared/src/config';

export default defineComponent({
  name: 'CarrierButton',
  props: {
    carrier: {
      type: Object,
      default: null,
    },
    component: {
      type: [String, Object],
      default: () => 'b-button',
    },
    icon: Boolean,
    size: {
      type: String,
      default: null,
    },
    text: Boolean,
  },

  setup: () => ({
    getCarrierLogo,
  })
});
</script>

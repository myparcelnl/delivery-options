<template>
  <component
    :is="component"
    :size="size"
    :variant="`outline-${icon ? 'dark' : carrier.name}`"
    v-bind="$attrs">
    <img
      v-if="icon"
      :alt="carrier.text"
      :src="$getUrl.carrierLogo(carrier.name)"
      class="img-fluid"
      width="18" />

    <span
      v-if="text"
      class="m-auto"
      v-text="carrier.text" />
  </component>
</template>

<script lang="ts" setup>
defineProps({
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
});
</script>

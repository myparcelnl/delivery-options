<template>
  <button
    type="button"
    :class="{
      [`${$classBase}__button`]: true,
      [`${$classBase}__button--selected`]: isSelected,
    }"
    @click="(event) => $emit('click', event)" />
</template>

<script lang="ts">
import {defineComponent} from 'vue'; export default defineComponent({
  name: 'CButton',
  props: {
    isSelected: {
      type: Boolean,
    },
  },

  emits: ['click'],
});
</script>

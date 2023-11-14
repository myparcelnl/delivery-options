<template>
  <button
    :class="{
      [`${$classBase}__button`]: true,
      [`${$classBase}__button--selected`]: isSelected,
    }"
    type="button"
    @click="(event) => $emit('click', event)" />
</template>

<script lang="ts">
export default {
  name: 'CButton',
  props: {
    isSelected: {
      type: Boolean,
    },
  },

  emits: ['click'],
};
</script>

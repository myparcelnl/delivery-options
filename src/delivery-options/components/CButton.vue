<template>
  <button
    :class="{
      [$classBase + '__button']: true,
      [$classBase + '__button--selected']: isSelected,
    }"
    @click="(event) => $emit('click', event)" />
</template>

<script>
export default {
  name: 'CButton',
  props: {
    isSelected: {
      type: Boolean,
    },
  },
};
</script>

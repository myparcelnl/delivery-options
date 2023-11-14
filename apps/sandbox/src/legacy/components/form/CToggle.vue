<template>
  <BFormCheckbox
    :id="$props.id"
    v-model="selected"
    switch
    v-bind="filteredProps" />
</template>

<script lang="ts">
export default {
  name: 'CToggle',
  mixins: [formCheckbox],

  props: {
    checked: Boolean,
    size: {
      type: String,
      default: () => 'lg',
    },
  },
};
</script>

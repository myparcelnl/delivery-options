<template>
  <CInput
    v-model="selected"
    :options="translatedOptions"
    :stacked="options.length >= 3"
    component="BFormCheckboxGroup"
    v-bind="filteredProps" />
</template>

<script lang="ts">
import CInput from './CInput.vue';

export default {
  name: 'CCheckboxGroup',
  components: {CInput},
  extends: BFormCheckboxGroup,
  mixins: [formCheckboxGroup],
};
</script>

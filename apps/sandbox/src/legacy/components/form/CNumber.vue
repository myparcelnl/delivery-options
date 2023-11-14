<template>
  <CInput
    v-model="mutableValue"
    component="BFormInput"
    type="number"
    v-bind="filteredProps" />
</template>

<script lang="ts">
import CInput from './CInput.vue';

export default {
  name: 'CNumber',
  components: {CInput},
  extends: BFormInput,
  mixins: [formNumberInput],
};
</script>

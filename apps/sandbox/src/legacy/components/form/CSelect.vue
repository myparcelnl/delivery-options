<template>
  <CInput
    v-model="mutableValue"
    :options="translatedOptions"
    component="BFormSelect" />
</template>

<script lang="ts">
import CInput from './CInput.vue';

export default {
  name: 'CSelect',
  components: {CInput},

  mixins: [formSelect, hasOptions],
};
</script>

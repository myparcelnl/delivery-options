<template>
  <CInput
    v-model="mutableValue"
    component="BFormInput"
    v-bind="filteredProps" />
</template>

<script lang="ts">
import CInput from './CInput.vue';

export default {
  name: 'CTextInput',
  components: {CInput},
  mixins: [formTextInput],
};
</script>

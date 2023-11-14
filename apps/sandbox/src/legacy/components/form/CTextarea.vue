<template>
  <CInput
    ref="textarea"
    v-model="mutableValue"
    component="b-form-textarea"
    v-bind="filteredProps" />
</template>

<script lang="ts">
import CInput from './CInput.vue';

export default {
  name: 'CTextarea',
  components: {CInput},
  mixins: [formTextarea],
};
</script>

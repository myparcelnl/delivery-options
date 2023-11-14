<template>
  <CInput
    v-model="mutableValue"
    placeholder="HH:mm"
    type="time"
    v-bind="filteredProps" />
</template>

<script lang="ts">
import CInput from './CInput.vue';

export default {
  name: 'CTimepicker',
  components: {CInput},
  mixins: [formTextInput],
};
</script>

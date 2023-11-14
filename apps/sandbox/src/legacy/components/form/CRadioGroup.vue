<template>
  <CInput
    v-model="selected"
    :options="translatedOptions"
    component="BFormRadioGroup" />
</template>

<script lang="ts">
import CInput from './CInput.vue';

export default {
  name: 'CRadioGroup',
  components: {CInput},
  extends: BFormRadioGroup,
  mixins: [formRadioGroup],
};
</script>

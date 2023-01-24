<template>
  <CInput
    v-model="mutableValue"
    component="BFormInput"
    v-bind="filteredProps" />
</template>

<script>
import CInput from '../../delivery-options/src/sandbox/components/form/CInput';
import { formTextInput } from '../../delivery-options/src/sandbox/services/mixins/formTextInput';

export default {
  name: 'CTextInput',
  components: { CInput },
  mixins: [
    formTextInput,
  ],
};
</script>

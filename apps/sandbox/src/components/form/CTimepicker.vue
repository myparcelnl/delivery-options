<template>
  <CInput
    v-model="mutableValue"
    type="time"
    placeholder="HH:mm"
    v-bind="filteredProps" />
</template>

<script>
import CInput from '../../delivery-options/src/sandbox/components/form/CInput';
import { formTextInput } from '../../delivery-options/src/sandbox/services/mixins/formTextInput';

export default {
  name: 'CTimepicker',
  components: { CInput },
  mixins: [
    formTextInput,
  ],
};
</script>

<template>
  <CInput
    v-model="mutableValue"
    :options="translatedOptions"
    component="BFormSelect" />
</template>

<script>
import CInput from '../../delivery-options/src/sandbox/components/form/CInput';
import { formSelect } from '../../delivery-options/src/sandbox/services/mixins/formSelect';
import { hasOptions } from '../../delivery-options/src/sandbox/services/mixins/hasOptions';

export default {
  name: 'CSelect',
  components: { CInput },

  mixins: [
    formSelect,
    hasOptions,
  ],
};
</script>

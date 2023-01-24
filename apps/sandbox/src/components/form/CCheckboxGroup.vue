<template>
  <CInput
    v-model="selected"
    v-bind="filteredProps"
    component="BFormCheckboxGroup"
    :stacked="options.length >= 3"
    :options="translatedOptions" />
</template>

<script>
import { BFormCheckboxGroup } from 'bootstrap-vue/src/components/form-checkbox/form-checkbox-group';
import CInput from '../../delivery-options/src/sandbox/components/form/CInput';
import { formCheckboxGroup } from '../../delivery-options/src/sandbox/services/mixins/formCheckboxGroup';

export default {
  name: 'CCheckboxGroup',
  components: { CInput },
  extends: BFormCheckboxGroup,
  mixins: [
    formCheckboxGroup,
  ],
};
</script>

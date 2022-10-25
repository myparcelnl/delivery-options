<template>
  <CInput
    v-model="selected"
    v-bind="filteredProps"
    component="BFormCheckboxGroup"
    :stacked="options.length >= 3"
    :options="translatedOptions" />
</template>

<script lang="ts">
import { BFormCheckboxGroup } from 'bootstrap-vue/src/components/form-checkbox/form-checkbox-group';
import CInput from '@/sandbox/components/form/CInput';
import { formCheckboxGroup } from '@/sandbox/services/mixins/formCheckboxGroup';

import {defineComponent} from 'vue'; export default defineComponent({
  name: 'CCheckboxGroup',
  components: { CInput },
  extends: BFormCheckboxGroup,
  mixins: [
    formCheckboxGroup,
  ],
});
</script>

<template>
  <CInput
    v-model="mutableValue"
    :options="translatedOptions"
    component="BFormSelect" />
</template>

<script lang="ts">
import CInput from '@/sandbox/components/form/CInput';
import { formSelect } from '@/sandbox/services/mixins/formSelect';
import { hasOptions } from '@/sandbox/services/mixins/hasOptions';

import {defineComponent} from 'vue'; export default defineComponent({
  name: 'CSelect',
  components: { CInput },

  mixins: [
    formSelect,
    hasOptions,
  ],
});
</script>

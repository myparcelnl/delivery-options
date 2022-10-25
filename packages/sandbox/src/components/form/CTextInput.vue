<template>
  <CInput
    v-model="mutableValue"
    component="BFormInput"
    v-bind="filteredProps" />
</template>

<script lang="ts">
import CInput from '@/sandbox/components/form/CInput';
import { formTextInput } from '@/sandbox/services/mixins/formTextInput';

import {defineComponent} from 'vue'; export default defineComponent({
  name: 'CTextInput',
  components: { CInput },
  mixins: [
    formTextInput,
  ],
});
</script>

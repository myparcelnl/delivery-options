<template>
  <CInput
    ref="textarea"
    v-model="mutableValue"
    component="b-form-textarea"
    v-bind="filteredProps" />
</template>

<script lang="ts">
import CInput from '@/sandbox/components/form/CInput';
import { formTextarea } from '@/sandbox/services/mixins/formTextarea';

import {defineComponent} from 'vue'; export default defineComponent({
  name: 'CTextarea',
  components: { CInput },
  mixins: [
    formTextarea,
  ],
});
</script>

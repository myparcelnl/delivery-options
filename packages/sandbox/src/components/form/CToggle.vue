<template>
  <BFormCheckbox
    :id="$props.id"
    v-model="selected"
    v-bind="filteredProps"
    switch />
</template>

<script lang="ts">
import { formCheckbox } from '@/sandbox/services/mixins/formCheckbox';

import {defineComponent} from 'vue'; export default defineComponent({
  name: 'CToggle',
  mixins: [
    formCheckbox,
  ],

  props: {
    checked: Boolean,
    size: {
      type: String,
      default: () => 'lg',
    },
  },
});
</script>

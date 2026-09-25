<template>
  <Box class="mp-gap-4 mp-grid">
    <label for="sandbox-weight">Shipment weight (g)</label>
    <SandboxNumberInput
      id="sandbox-weight"
      v-model="weight"
      :min="1"
      :step="1" />
    <p>Include packaging. Leave empty when the complete shipment weight is unknown.</p>
  </Box>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {useSandboxStore} from '../stores';
import {SandboxNumberInput} from './base';
import {Box} from './Box';

const store = useSandboxStore();
const weight = computed({
  get: () => store.config.physicalProperties?.weight,
  set: (value: number | undefined) => {
    store.config.physicalProperties =
      Number.isSafeInteger(Number(value)) && Number(value) > 0 ? {weight: Number(value)} : null;
  },
});
</script>

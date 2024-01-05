<template>
  <Box>
    <h2>Carriers</h2>

    <Suspense>
      <template #default>
        <SandboxCarrierFormSections />
      </template>

      <template #fallback>
        <SandboxLoadingIndicator />
      </template>
    </Suspense>
  </Box>
</template>

<script lang="ts" setup>
import {watch} from 'vue';
import {useDebounceFn} from '@vueuse/core';
import {useForm} from '@myparcel/vue-form-builder';
import {useSandboxStore} from '../stores';
import SandboxLoadingIndicator from './SandboxLoadingIndicator.vue';
import SandboxCarrierFormSections from './SandboxCarrierFormSections.vue';
import {Box} from './Box.js';

const sandboxStore = useSandboxStore();
const form = useForm();

/**
 * Start listening to changes in the configuration when the carrier fields have loaded. This is so the configuration is
 * not saved to storage before all fields are loaded.
 */

form.on(
  'afterAddElement',
  useDebounceFn(() => {
    watch(form.values, (newConfiguration: Record<string, unknown>) => {
      sandboxStore.updateConfiguration(newConfiguration);
    });
  }, 50),
);
</script>

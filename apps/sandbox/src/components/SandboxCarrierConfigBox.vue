<template>
  <Box class="mp-flex mp-flex-col mp-gap-4">
    <h2 v-text="translate('carriers')" />

    <Suspense>
      <template #default>
        <SandboxCarrierFormSections />
      </template>

      <template #fallback>
        <DotsLoader />
      </template>
    </Suspense>
  </Box>
</template>

<script lang="ts" setup>
import {watch} from 'vue';
import {useDebounceFn} from '@vueuse/core';
import {useForm} from '@myparcel-dev/vue-form-builder';
import {useSandboxStore} from '../stores';
import {useLanguage} from '../composables';
import SandboxCarrierFormSections from './SandboxCarrierFormSections.vue';
import {DotsLoader} from './DotsLoader';
import {Box} from './Box';

const sandboxStore = useSandboxStore();
const form = useForm();

const {translate} = useLanguage();

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

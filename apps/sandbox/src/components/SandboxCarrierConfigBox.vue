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

<script
  lang="ts"
  setup>
import {useLanguage} from '../composables';
import SandboxCarrierFormSections from './SandboxCarrierFormSections.vue';
import {DotsLoader} from './DotsLoader';
import {Box} from './Box';

const { translate } = useLanguage();
</script>

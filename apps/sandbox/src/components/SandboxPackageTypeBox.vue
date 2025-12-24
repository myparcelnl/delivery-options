<template>
  <Box class="mp-gap-4 mp-grid">
    <h2 v-text="translate('package_type')" />

    <!-- TODO: Restore package type box after vue-form-builder removal -->
    <p class="mp-text-gray-500 mp-text-sm">Package type box temporarily disabled during refactoring</p>
  </Box>
</template>

<script lang="ts" setup>
import {useLanguage} from '../composables';
import {Box} from './Box';

const {translate} = useLanguage();
</script>

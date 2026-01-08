<template>
  <Box class="mp-gap-4 mp-grid">
    <h2 v-text="translate('other_settings')" />

    <!-- TODO: Restore features box after vue-form-builder removal -->
    <p class="mp-text-gray-500 mp-text-sm">Features box temporarily disabled during refactoring</p>
  </Box>
</template>

<script lang="ts" setup>
import {useLanguage} from '../composables';
import {Box} from './Box';

const {translate} = useLanguage();
</script>

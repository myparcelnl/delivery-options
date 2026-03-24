<template>
  <Box class="mp-gap-4 mp-grid">
    <h2>API key</h2>
    <FormTextInput
      v-model="apiKey"
      class="mp-w-full" />
  </Box>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {useSandboxStore} from '../stores';
import FormTextInput from './form/input/FormTextInput.vue';
import {Box} from './Box';

const sandboxStore = useSandboxStore();

const apiKey = computed({
  get: () => sandboxStore.config.apiKey ?? '',
  set: (value) => {
    sandboxStore.config.apiKey = value || undefined;
  },
});
</script>

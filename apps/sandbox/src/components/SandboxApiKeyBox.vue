<template>
  <Box>
    <Expandable :open="true">
      <template #title>
        <h2 v-text="translate('api_key_header')" />
      </template>

      <div class="mp-gap-4 mp-grid mp-pt-4">
        <FormTextInput
          v-model="apiKey"
          class="mp-w-full" />

        <h2 v-text="translate('platform_header')" />
        <FormSelectInput
          v-model="platform"
          :options="platformOptions" />
      </div>
    </Expandable>
  </Box>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {useSandboxStore} from '../stores';
import {useLanguage} from '../composables';
import FormTextInput from './form/input/FormTextInput.vue';
import FormSelectInput from './form/input/FormSelectInput.vue';
import Expandable from './Expandable.vue';
import {Box} from './Box';

const {translate} = useLanguage();
const sandboxStore = useSandboxStore();

const PLATFORMS = ['myparcel', 'belgie', 'italy'] as const;

const apiKey = computed({
  get: () => sandboxStore.config.apiKey ?? '',
  set: (value) => {
    sandboxStore.config.apiKey = value || undefined;
  },
});

const platform = computed({
  get: () => sandboxStore.config.platform,
  set: (value: string) => {
    sandboxStore.config.platform = value;
  },
});

const platformOptions = PLATFORMS.map((value) => ({
  label: `platform_${value}`,
  value,
}));
</script>

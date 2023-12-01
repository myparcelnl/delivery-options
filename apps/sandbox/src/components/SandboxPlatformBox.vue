<template>
  <Box class="dark:mp-bg-goldfish-800 mp-bg-goldfish-200 mp-border-0">
    <h2>Platform</h2>
    <Platform.Component />
  </Box>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {ConfigSetting, KEY_CONFIG, type SelectOption, SUPPORTED_PLATFORMS} from '@myparcel-do/shared';
import {createField} from '@myparcel/vue-form-builder';
import RadioGroupInput from './RadioGroupInput.vue';
import {Box} from './Box';

// eslint-disable-next-line @typescript-eslint/naming-convention
const Platform = createField({
  name: `${KEY_CONFIG}.${ConfigSetting.Platform}`,
  component: RadioGroupInput,
  ref: ref(),
  wrapper: false,
  props: {
    options: SUPPORTED_PLATFORMS.map((platform) => ({
      value: platform,
      label: platform,
    })) satisfies SelectOption[],
  },
});
</script>

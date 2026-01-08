<template>
  <Box class="dark:mp-bg-goldfish-800 mp-bg-goldfish-200 mp-border-0">
    <h2 v-text="translate('platform')" />
    <RadioGroupInput
      v-model="platform"
      :options="options" />
  </Box>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {ConfigSetting, type SelectOption, SUPPORTED_PLATFORMS} from '@myparcel-dev/do-shared';
import {type PlatformName} from '@myparcel-dev/constants';
import {useSandboxStore} from '../stores';
import {useLanguage} from '../composables';
import RadioGroupInput from './RadioGroupInput.vue';
import {Box} from './Box';

const store = useSandboxStore();

const {translate} = useLanguage();

const platform = computed<PlatformName>({
  get: () => store.platform,
  set: (value) => {
    store.updateConfiguration({
      [`config.${ConfigSetting.Platform}`]: value
    });
  }
});

const options: SelectOption[] = SUPPORTED_PLATFORMS.map((platform) => ({
  value: platform,
  label: `platform_${platform}`,
}));
</script>

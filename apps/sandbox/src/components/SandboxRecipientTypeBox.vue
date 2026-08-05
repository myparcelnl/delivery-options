<template>
  <Box class="mp-gap-4 mp-grid">
    <h2 v-text="translate(RECIPIENT_TYPE_LABEL)" />

    <SandboxRadioGroupInput
      v-model="recipientType"
      :options="RECIPIENT_TYPE_OPTIONS" />
  </Box>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {type SelectOption} from '@myparcel-dev/do-shared';
import {useSandboxStore} from '../stores';
import {useLanguage} from '../composables';
import {SandboxRadioGroupInput} from './base';
import {Box} from './Box';

/**
 * The capabilities API sees business and consumer as two distinct answers, and sending nothing at
 * all as a third one - that last one is what platforms which don't pass the flag yet look like.
 * Radio values can only be strings, so they are mapped onto the boolean the config holds.
 */
const UNSET = 'unset';
const BUSINESS = 'business';
const CONSUMER = 'consumer';

const RECIPIENT_TYPE_LABEL = {key: 'Recipient type', plain: true} as const;

// Labelled in place instead of through a translation key, because the sandbox translations come
// from an external sheet and this is a developer-only control.
const RECIPIENT_TYPE_OPTIONS: SelectOption<string>[] = [
  {label: {key: 'Not set', plain: true}, value: UNSET},
  {label: {key: 'Business (B2B)', plain: true}, value: BUSINESS},
  {label: {key: 'Consumer (B2C)', plain: true}, value: CONSUMER},
];

const sandboxStore = useSandboxStore();

const recipientType = computed({
  get: () => {
    const {isBusiness} = sandboxStore.config;

    if (isBusiness === undefined) {
      return UNSET;
    }

    return isBusiness ? BUSINESS : CONSUMER;
  },

  set: (value: string) => {
    if (value === UNSET) {
      // Removing the key keeps it out of the config entirely, so the widget omits it from the
      // request. Setting it to undefined would leave the key behind in the resolved config.
      delete sandboxStore.config.isBusiness;

      return;
    }

    sandboxStore.config.isBusiness = value === BUSINESS;
  },
});

const {translate} = useLanguage();
</script>

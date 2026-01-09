<template>
  <Box class="mp-gap-4 mp-grid">
    <h2 v-text="translate('package_type')" />

    <!-- TODO: Restore package type box after vue-form-builder removal -->
    <SandboxRadioGroupInput v-model="packageType" :options="packageTypeOptions" />
  </Box>
</template>

<script lang="ts" setup>
import { SUPPORTED_PACKAGE_TYPES } from '@myparcel-dev/do-shared';
import {useLanguage} from '../composables';
import { useSandboxStore } from '../stores';
import { SandboxRadioGroupInput } from './base';
import { Box } from './Box';
import { computed } from 'vue';
import type { PackageTypeName } from '@myparcel-dev/constants';

const {translate} = useLanguage();
const sandboxStore = useSandboxStore();

const packageType = computed({
  get: () => sandboxStore.config.packageType,
  set: (value: PackageTypeName) => {
    sandboxStore.config.packageType = value;
  },
});
const packageTypeOptions = SUPPORTED_PACKAGE_TYPES.map((value) => ({
  label: `package_type_${value}`,
  value,
}));
</script>

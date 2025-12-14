<template>
  <CarrierBox
    v-for="carrier in carrierSections"
    :key="carrier.name"
    :carrier="carrier.name">
    <SandboxSettingsSection
      v-for="section in carrier.sections"
      :key="section.label"
      :section="section" />
  </CarrierBox>
</template>

<script lang="ts" setup>
import {computed, toValue} from 'vue';
import {CarrierBox, KEY_CARRIER_SETTINGS} from '@myparcel-dev/shared';
import {type CarrierName} from '@myparcel-dev/constants';
import {type SettingsSection} from '../types';
import {getConfigSandboxSections} from '../form';
import {useCurrentPlatform} from '../composables';
import {SandboxSettingsSection} from './form';

const platform = useCurrentPlatform();

const carrierSections = computed<{name: CarrierName; sections: SettingsSection[]}[]>(() => {
  const {carriers} = toValue(platform.config);

  return (
    carriers.map((carrier) => {
      return {
        name: carrier.name,
        sections: getConfigSandboxSections(`${KEY_CARRIER_SETTINGS}.${carrier.name}`),
      };
    }) ?? []
  );
});
</script>

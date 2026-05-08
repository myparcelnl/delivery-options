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
import {computed} from 'vue';
import {type CarrierIdentifier, CarrierBox} from '@myparcel-dev/do-shared';
import {getConfigSandboxSections} from '../form';
import {useSandboxStore} from '../stores';
import {useSandboxCapabilities} from '../composables';
import {SandboxSettingsSection} from './form';

const store = useSandboxStore();
const {capabilities} = useSandboxCapabilities();

const carrierSections = computed(() => {
  // Touch capabilities to create reactive dependency — recompute sections when capabilities change
  void capabilities.value;
  const carriers = Object.keys(store.carrierSettings) as CarrierIdentifier[];

  return (
    carriers.map((carrierName) => {
      return {
        name: carrierName,
        sections: getConfigSandboxSections(carrierName),
      };
    }) ?? []
  );
});
</script>

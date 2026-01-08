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
import {CarrierBox} from '@myparcel-dev/do-shared';
import {getConfigSandboxSections} from '../form';
import {useCurrentPlatform} from '../composables';
import {SandboxSettingsSection} from './form';

const platform = useCurrentPlatform();

const carrierSections = computed(() => {
  const {carriers} = toValue(platform.config);


  return (
    carriers.map((carrier) => {
      return {
        name: carrier.name,
        sections: getConfigSandboxSections(carrier.name),
      };
    }) ?? []
  );
});
</script>

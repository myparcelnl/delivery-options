<template>
  <CarrierBox
    v-for="carrier in allCarriers"
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
import {get} from '@vueuse/core';
import {CarrierBox, type FullCarrier, KEY_CARRIER_SETTINGS, useCarriersRequest} from '@myparcel-do/shared';
import {type SettingsSection} from '../types';
import {getConfigSandboxSections} from '../form';
import {useAvailableCarriers} from '../composables';
import {SandboxSettingsSection} from './form';

const carriers = useCarriersRequest();

await carriers.load();

const availableCarriers = useAvailableCarriers();

const allCarriers = computed<(FullCarrier & {sections: SettingsSection[]})[]>(() => {
  return (
    get(availableCarriers)?.map((carrier) => ({
      ...carrier,
      sections: getConfigSandboxSections(`${KEY_CARRIER_SETTINGS}.${carrier.name}`),
    })) ?? []
  );
});
</script>

<template>
  <Box
    v-for="carrier in allCarriers"
    class="mp-pt-0 mp-px-0">
    <Expandable
      :open="enabledCarriers.includes(carrier.name)"
      manual>
      <template #title>
        <h3 class="mp-pt-2 mp-w-full">
          <label class="mp-flex mp-gap-2 mp-items-center">
            <span>
              <SandboxCheckboxInput
                is="div"
                v-model="enabledCarriers"
                :name="carrier.name"
                :value="carrier.name" />
            </span>

            <CarrierLogo :carrier="carrier.name" />

            <span>
              {{ carrier.human }}
            </span>
          </label>
        </h3>
      </template>

      <SandboxFormSection
        v-for="section in sections[carrier.name]"
        :key="section.label"
        :section="section" />
    </Expandable>
  </Box>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {get, useLocalStorage} from '@vueuse/core';
import {CARRIER_SETTINGS, CarrierLogo, useCarriers, useCurrentPlatform} from '@myparcel-do/shared';
import {type CarrierName} from '@myparcel/constants';
import {type SettingsSection} from '../types';
import {getConfigurationSections} from '../form/getConfigurationSections';
import SandboxCheckboxInput from './base/SandboxCheckboxInput.vue';
import SandboxFormSection from './SandboxFormSection.vue';
import Expandable from './Expandable.vue';
import {Box} from './Box';

const carriers = useCarriers();

await carriers.load();

const platform = useCurrentPlatform();

const enabledCarriers = useLocalStorage('enabledCarriers', []);

const allCarriers = get(platform.config).carriers.map((carrier) => {
  const matchingCarrier = get(carriers.data).find((c) => c.name === carrier.name);

  return {...carrier, ...matchingCarrier};
});

const sections = computed(() => {
  return allCarriers.reduce((acc, carrier) => {
    acc[carrier.name] = getConfigurationSections(`${CARRIER_SETTINGS}.${carrier.name}`);

    return acc;
  }, {} as Record<CarrierName, SettingsSection[]>);
});
</script>

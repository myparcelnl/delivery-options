<template>
  <template
    v-for="carrier in allCarriers"
    :key="carrier.name">
    <KeepAlive>
      <component
        :is="Box"
        class="mp-pt-0 mp-px-0">
        <Expandable
          :open="enabledCarriers.includes(carrier.name)"
          manual>
          <template #title>
            <AutoAnchor
              :label="carrier.human"
              :name="carrier.name">
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
            </AutoAnchor>
          </template>

          <SandboxSettingsSection
            v-for="section in carrier.sections"
            :key="section.label"
            :section="section" />
        </Expandable>
      </component>
    </KeepAlive>
  </template>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {get, useLocalStorage} from '@vueuse/core';
import {CarrierLogo, type FullCarrier, KEY_CARRIER_SETTINGS, useCarriersRequest} from '@myparcel-do/shared';
import {type SettingsSection} from '../types';
import {getConfigSandboxSections} from '../form';
import {useAvailableCarriers} from '../composables';
import {SandboxSettingsSection} from './form';
import {SandboxCheckboxInput} from './base';
import Expandable from './Expandable.vue';
import {Box} from './Box';
import AutoAnchor from './AutoAnchor.vue';

const carriers = useCarriersRequest();

await carriers.load();

const availableCarriers = useAvailableCarriers();

const enabledCarriers = useLocalStorage('enabledCarriers', []);

const allCarriers = computed<(FullCarrier & {sections: SettingsSection[]})[]>(() => {
  return (
    get(availableCarriers)?.map((carrier) => ({
      ...carrier,
      sections: getConfigSandboxSections(`${KEY_CARRIER_SETTINGS}.${carrier.name}`),
    })) ?? []
  );
});
</script>

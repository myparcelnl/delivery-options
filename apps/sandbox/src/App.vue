<template>
  <SandboxHeader />

  <div class="mp-flex">
    <SandboxSidebar />

    <Container>
      <h1>Sandbox</h1>

      <Box columns="2">
        <Suspense @resolve="ready = true">
          <SandboxConfiguration />
        </Suspense>

        <div class="mp-relative">
          <div class="mp-sticky mp-top-4">
            <Box v-if="ready">
              <h2>Delivery Options</h2>

              <DeliveryOptionsBlock />
            </Box>

            <Box>
              <Expandable>
                <template #title>
                  <h3>Resolved configuration</h3>
                </template>

                <pre
                  class="mp-text-xs"
                  v-text="{
                    address: sandboxStore.resolvedConfiguration.address ?? {},
                    config: sandboxStore.resolvedConfiguration.config ?? {},
                  }" />
              </Expandable>
            </Box>

            <Box>
              <Expandable>
                <template #title>
                  <h3>Events</h3>
                </template>

                <DebugEventLog />
              </Expandable>
            </Box>
          </div>
        </div>
      </Box>
    </Container>
  </div>

  <SandboxFooter />
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import {useFormBuilder} from '@myparcel/vue-form-builder';
import {useSandboxStore} from './stores';
import SandboxHeader from './components/layout/SandboxHeader.vue';
import SandboxFooter from './components/layout/SandboxFooter.vue';
import SandboxConfiguration from './components/SandboxConfiguration.vue';
import Expandable from './components/Expandable.vue';
import DeliveryOptionsBlock from './components/DeliveryOptionsBlock.vue';
import {Box, Container} from './components';
import SandboxSidebar from './SandboxSidebar.vue';
import DebugEventLog from './DebugEventLog.vue';

const formBuilder = useFormBuilder();
const sandboxStore = useSandboxStore();

// Use this to wait for all carriers to have been loaded. This avoids unnecessary calls to the individual carriers.
const ready = ref(false);

const form = computed(() => {
  return formBuilder.getForm('configuration');
});

// const translations =Object.entries(englishTranslations as Record<string, string>).map(([key, value]) => {
//   return {
//     key: (key.replace('field.', 'string_')).replace('.description', '_description'),
//     value: value.replace('field.', 'string_'),
//   };
// });
//
// // to csv, escape double quotes
// console.log(translations.map(({key, value}) => `${key};"${value.replace(/"/g, '""')}"`).join('\n'));
</script>

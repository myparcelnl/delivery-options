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
              <DebugEventLog />
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
import SandboxHeader from './components/layout/SandboxHeader.vue';
import SandboxFooter from './components/layout/SandboxFooter.vue';
import SandboxConfiguration from './components/SandboxConfiguration.vue';
import DeliveryOptionsBlock from './components/DeliveryOptionsBlock.vue';
import {Container} from './components/Container';
import {Box} from './components/Box';
import SandboxSidebar from './SandboxSidebar.vue';
import DebugEventLog from './DebugEventLog.vue';

const formBuilder = useFormBuilder();

// Use this to wait for all carriers to have been loaded. This avoids unnecessary calls to the individual carriers.
const ready = ref(false);

const form = computed(() => {
  return formBuilder.getForm('configuration');
});
</script>

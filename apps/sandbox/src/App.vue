<template>
  <SandboxHeader />

  <Container>
    <h1>Sandbox</h1>

    <Box columns="2">
      <Box>
        <SandboxConfiguration />
      </Box>

      <Box>
        <h2>Delivery Options</h2>
        <DeliveryOptionsBlock />

        <div class="mp-bg-opacity-30 mp-bg-red-950 mp-border-t-red-950 mp-p-4 mp-rounded-xl">
          <h2>Sandbox form</h2>

          <div>
            <pre v-text="form?.getValues()"></pre>
          </div>

          <h2>Delivery options form</h2>

          <div>
            <pre v-text="doValues"></pre>
          </div>

          <DebugEventLog />
        </div>
      </Box>
    </Box>
  </Container>

  <SandboxFooter />
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {useFormBuilder} from '@myparcel/vue-form-builder';
import SandboxHeader from './components/SandboxHeader.vue';
import SandboxFooter from './components/SandboxFooter.vue';
import SandboxConfiguration from './components/SandboxConfiguration.vue';
import DeliveryOptionsBlock from './components/DeliveryOptionsBlock.vue';
import {Container} from './components/Container';
import {Box} from './components/Box';
import DebugEventLog from './DebugEventLog.vue';

const formBuilder = useFormBuilder();

const form = computed(() => {
  return formBuilder.getForm('configuration');
});

const doValues = computed(() => {
  return formBuilder.getForm('DeliveryOptions')?.getValues();
});
</script>

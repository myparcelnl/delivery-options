<template>
  <div
    v-if="!loaded"
    class="mp-flex mp-h-[100vh] mp-items-center mp-justify-center mp-w-[100vw]">
    <DotsLoader />
  </div>

  <div v-else>
    <SandboxHeader />

    <Container class="!mp-items-start mp-py-8">
      <div class="mp-w-2/5">
        <Suspense @resolve="ready = true">
          <SandboxConfiguration />
        </Suspense>
      </div>

      <div class="mp-flex mp-flex-col mp-flex-grow mp-sticky mp-top-4 mp-w-3/5">
        <div class="mp-gap-4 mp-grid">
          <DeliveryOptionsDemo v-if="ready" />
        </div>
      </div>
    </Container>

    <SandboxFooter />
  </div>
</template>

<script lang="ts" setup>
import {ref, onMounted, onActivated} from 'vue';
import {waitForRequestData, useCarriersRequest} from '@myparcel-dev/do-shared';
import {useColorMode, useLanguage} from './composables';
import SandboxHeader from './components/layout/SandboxHeader.vue';
import SandboxFooter from './components/layout/SandboxFooter.vue';
import SandboxConfiguration from './components/SandboxConfiguration.vue';
import {Container, DotsLoader} from './components';
import DeliveryOptionsDemo from './DeliveryOptionsDemo.vue';

const ready = ref(false);

useColorMode();

const {load} = useLanguage();

const loaded = ref(false);

const waitForLoad = async () => {
  await load();
  await waitForRequestData(useCarriersRequest);
  loaded.value = true;
};

onMounted(waitForLoad);
onActivated(waitForLoad);
</script>

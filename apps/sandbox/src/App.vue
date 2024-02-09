<template>
  <div
    v-if="!languageReady"
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
import {useColorMode, useLanguage} from './composables';
import SandboxHeader from './components/layout/SandboxHeader.vue';
import SandboxFooter from './components/layout/SandboxFooter.vue';
import SandboxConfiguration from './components/SandboxConfiguration.vue';
import {Container, DotsLoader} from './components';
import DeliveryOptionsDemo from './DeliveryOptionsDemo.vue';

const ready = ref(false);

useColorMode();

const {load} = useLanguage();

const languageReady = ref(false);

const waitForLanguage = async () => {
  await load();
  languageReady.value = true;
};

onMounted(waitForLanguage);
onActivated(waitForLanguage);
</script>

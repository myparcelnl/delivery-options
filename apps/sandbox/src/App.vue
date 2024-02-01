<template>
  <div
    v-if="loading"
    class="mp-flex mp-h-[100vh] mp-items-center mp-justify-center mp-w-[100vw]">
    <DotsLoader />
  </div>

  <div v-else>
    <SandboxHeader />

    <Container>
      <h1>MyParcel Delivery Options Sandbox</h1>
    </Container>

    <Container class="!mp-items-start">
      <div class="mp-w-2/5">
        <Suspense @resolve="ready = true">
          <SandboxConfiguration />
        </Suspense>
      </div>

      <div class="mp-flex mp-flex-col mp-flex-grow mp-relative mp-w-3/5">
        <div class="mp-sticky mp-top-4">
          <div class="mp-gap-4 mp-grid">
            <DeliveryOptionsDemo v-if="ready" />
          </div>
        </div>
      </div>
    </Container>

    <SandboxFooter />
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {useColorMode, useLanguage} from './composables';
import SandboxHeader from './components/layout/SandboxHeader.vue';
import SandboxFooter from './components/layout/SandboxFooter.vue';
import SandboxConfiguration from './components/SandboxConfiguration.vue';
import {Container, DotsLoader} from './components';
import DeliveryOptionsDemo from './DeliveryOptionsDemo.vue';

const ready = ref(false);

useColorMode();

const {loading} = useLanguage();
</script>

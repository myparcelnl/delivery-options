<template>
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
      <DeliveryOptionsDemo
        v-if="ready"
        class="mp-sticky mp-top-4" />
    </div>
  </Container>

  <SandboxFooter />
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import SandboxHeader from './components/layout/SandboxHeader.vue';
import SandboxFooter from './components/layout/SandboxFooter.vue';
import SandboxConfiguration from './components/SandboxConfiguration.vue';
import {Container} from './components';
import DeliveryOptionsDemo from './DeliveryOptionsDemo.vue';

const ready = ref(false);
</script>

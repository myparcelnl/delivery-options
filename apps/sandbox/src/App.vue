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
          <DeliveryOptionsDemo
            v-if="ready"
            class="mp-sticky mp-top-4" />
        </div>
      </Box>
    </Container>
  </div>

  <SandboxFooter />
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import SandboxHeader from './components/layout/SandboxHeader.vue';
import SandboxFooter from './components/layout/SandboxFooter.vue';
import SandboxConfiguration from './components/SandboxConfiguration.vue';
import {Box, Container} from './components';
import SandboxSidebar from './SandboxSidebar.vue';
import DeliveryOptionsDemo from './DeliveryOptionsDemo.vue';

const ready = ref(false);
</script>

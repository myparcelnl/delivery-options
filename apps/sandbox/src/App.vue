<template>
  <h1>Sandbox</h1>

  <Container columns="2">
    <Container>
      <h2>Settings</h2>
      <SandboxConfiguration />
    </Container>

    <Container>
      <h2>Delivery Options</h2>
      <DeliveryOptionsBlock />
    </Container>
  </Container>
</template>

<script lang="ts" setup>
import SandboxConfiguration from './components/SandboxConfiguration.vue';
import DeliveryOptionsBlock from './components/DeliveryOptionsBlock.vue';
import {Container} from './components/Container';
</script>

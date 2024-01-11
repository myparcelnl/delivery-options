<template>
  <div class="mp-flex-grow">
    <Box>
      <h2>Result</h2>

      <div class="mp-max-w-full mp-min-w-80 mp-overflow-auto mp-pb-4 mp-resize-x">
        <DeliveryOptionsBlock />
      </div>
    </Box>
  </div>

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
</template>

<script lang="ts" setup>
import {useSandboxStore} from './stores';
import {Box, DeliveryOptionsBlock, Expandable} from './components';
import DebugEventLog from './DebugEventLog.vue';

const sandboxStore = useSandboxStore();
</script>

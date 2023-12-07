<template>
  <div>
    <Box>
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
</template>

<script lang="ts" setup>
import {useSandboxStore} from './stores';
import {Box, DeliveryOptionsBlock, Expandable} from './components';
import DebugEventLog from './DebugEventLog.vue';

const sandboxStore = useSandboxStore();
</script>

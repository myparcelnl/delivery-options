<template>
  <div class="mp-flex-grow">
    <Box>
      <h2 v-text="translate('result')" />

      <div class="mp-max-w-full mp-min-w-80 mp-overflow-auto mp-pb-4 mp-resize-x">
        <DeliveryOptionsBlock />
      </div>
    </Box>
  </div>

  <Box>
    <Expandable>
      <template #title>
        <h3 v-text="translate('resolved_configuration')" />
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
        <h3 v-text="translate('events')" />
      </template>

      <DebugEventLog />
    </Expandable>
  </Box>
</template>

<script lang="ts" setup>
import {useSandboxStore} from './stores';
import {useLanguage} from './composables';
import {Box, DeliveryOptionsBlock, Expandable} from './components';
import DebugEventLog from './DebugEventLog.vue';

const sandboxStore = useSandboxStore();

const {translate} = useLanguage();
</script>

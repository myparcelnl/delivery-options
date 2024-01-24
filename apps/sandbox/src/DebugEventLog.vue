<template>
  <div>
    <CButton
      v-show="eventLog.length"
      @click="eventLog = []">
      Clear
    </CButton>

    <SandboxTable
      :content="eventLog.toReversed()"
      :header="['timestamp', 'detail']" />
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {useEventListener} from '@vueuse/core';
import {isCustomEvent} from '@myparcel-do/shared';
import {UPDATED_DELIVERY_OPTIONS} from '@myparcel/delivery-options/ts';
import SandboxTable from './components/SandboxTable.vue';
import {CButton} from './components';

const eventLog = ref<string[][]>([]);

const logEvent = (event: Event | CustomEvent) => {
  eventLog.value.push([new Date().toISOString().slice(11, 19), isCustomEvent(event) ? event.detail : undefined]);
};

useEventListener(document, UPDATED_DELIVERY_OPTIONS, logEvent);
</script>

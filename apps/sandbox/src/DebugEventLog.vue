<template>
  <h2>Events</h2>

  <CTable
    :content="eventLog.toReversed()"
    :header="['timestamp', 'detail']" />
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {useEventListener} from '@vueuse/core';
import {UPDATED_DELIVERY_OPTIONS} from '@myparcel-do/shared';
import {isOfType} from '@myparcel/ts-utils';
import CTable from './components/CTable.vue';

const eventLog = ref<string[][]>([]);

const logEvent = (event: Event | CustomEvent) => {
  eventLog.value.push([
    new Date().toISOString().slice(11, 19),
    isOfType<CustomEvent>(event, 'detail') ? event.detail : undefined,
  ]);
};

useEventListener(document, UPDATED_DELIVERY_OPTIONS, logEvent);
</script>

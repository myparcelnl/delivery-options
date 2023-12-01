<template>
  <div>
    <CButton
      v-show="eventLog.length"
      @click="eventLog = []">
      Clear
    </CButton>

    <CTable
      :content="eventLog.toReversed()"
      :header="['timestamp', 'detail']" />
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {useEventListener} from '@vueuse/core';
import {UPDATED_DELIVERY_OPTIONS} from '@myparcel-do/shared';
import {isOfType} from '@myparcel/ts-utils';
import CTable from './components/legacy/CTable.vue';
import {CButton} from './components';

const eventLog = ref<string[][]>([]);

const logEvent = (event: Event | CustomEvent) => {
  eventLog.value.push([
    new Date().toISOString().slice(11, 19),
    isOfType<CustomEvent>(event, 'detail') ? event.detail : undefined,
  ]);
};

useEventListener(document, UPDATED_DELIVERY_OPTIONS, logEvent);
</script>

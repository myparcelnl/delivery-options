<template>
  <Box>
    <div
      v-if="data"
      class="mp-flex mp-gap-2 mp-items-center mp-pb-2">
      <CarrierLogo
        :carrier="data.name"
        small />

      <b v-text="data.human" />

      <slot name="heading" />
    </div>

    <slot />
  </Box>
</template>

<script lang="ts" setup>
import {toRefs, computed} from 'vue';
import {resolveCarrierName} from '../utils';
import {type CarrierIdentifier} from '../types';
import {useCarrierRequest} from '../composables';
import CarrierLogo from './CarrierLogo.vue';
import Box from './Box.vue';

const props = defineProps<{carrier: CarrierIdentifier}>();
const propRefs = toRefs(props);
const carrierName = computed(() => resolveCarrierName(propRefs.carrier.value));

const {data} = useCarrierRequest(carrierName);
</script>
